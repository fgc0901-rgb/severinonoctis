#!/usr/bin/env node
/**
 * Healthcheck estendido
 * Uso:
 *   node scripts/healthcheck.js --domain bobbunitinho.com --api http://localhost:3080 --timeout 8000 --assets style.css,script.js,manifest.json
 * Retorno: exit code 0 se tudo essencial ok, 1 se falhas.
 */

const dns = require('dns');
const https = require('https');
const { performance } = require('perf_hooks');

const { argv } = process;
const args = {};
for (let i = 2; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    const [k, v] = argv[i].split('=');
    args[k.replace(/^--/, '')] = v === undefined ? true : v;
  }
}

const domain = args.domain || process.env.HEALTH_DOMAIN;
const apiBase = args.api || process.env.HEALTH_API_BASE; // e.g. http://localhost:3080
const timeoutMs = Number(args.timeout || 8000);
const assetList = (args.assets ? args.assets.split(',') : ['style.css', 'script.js', 'manifest.json', 'imagens/simbolo.png']);

if (!domain) {
  console.error('Missing --domain or HEALTH_DOMAIN');
  process.exit(1);
}

// Fetch compat (Node <18 fallback)
const doFetch = typeof fetch === 'function'
  ? fetch
  : (url, opts={}) => new Promise((resolve, reject) => {
      const u = new URL(url);
      const req = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: opts.method || 'GET' }, res => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, text: () => Promise.resolve(data), json: () => Promise.resolve(JSON.parse(data)) }));
      });
      req.on('error', reject);
      req.end();
    });

const fetchTimeout = (url, ms, method='GET') => {
  const start = performance.now();
  return Promise.race([
    doFetch(url, { method }).then(r => ({ r, ms: performance.now() - start })),
    new Promise(res => setTimeout(() => res({ timeout: true, ms: performance.now() - start }), ms))
  ]);
};

async function dnsResolve(host) {
  return new Promise(resolve => {
    dns.resolve4(host, (err, addrs) => {
      if (err) return resolve({ ok: false, error: err.code || err.message });
      resolve({ ok: true, addresses: addrs });
    });
  });
}

(async () => {
  const results = { timestamp: new Date().toISOString(), domain, ok: true, checks: [] };

  // DNS
  const dnsInfo = await dnsResolve(domain);
  if (!dnsInfo.ok) { results.ok = false; }
  results.checks.push({ name: 'dns', host: domain, ok: dnsInfo.ok, addresses: dnsInfo.addresses, error: dnsInfo.error });

  // Página raiz
  const rootUrl = `https://${domain}/`;
  const rootRes = await fetchTimeout(rootUrl, timeoutMs);
  if (rootRes.timeout || !rootRes.r.ok) {
    results.ok = false;
    results.checks.push({ name: 'root', url: rootUrl, status: rootRes.timeout ? 'timeout' : rootRes.r.status, ok: false, timeMs: rootRes.ms });
  } else {
    // Tamanho aproximado
    let size = 0;
    try { const txt = await rootRes.r.text(); size = Buffer.byteLength(txt, 'utf8'); } catch {}
    results.checks.push({ name: 'root', url: rootUrl, status: rootRes.r.status, ok: true, timeMs: rootRes.ms, sizeBytes: size });
  }

  // Service Worker
  const swUrl = `https://${domain}/service-worker.js`;
  const swRes = await fetchTimeout(swUrl, timeoutMs);
  results.checks.push({ name: 'service-worker', url: swUrl, status: swRes.timeout ? 'timeout' : (swRes.r && swRes.r.status), ok: !swRes.timeout && swRes.r && swRes.r.ok, timeMs: swRes.ms });

  // Assets críticos
  for (const asset of assetList) {
    const aUrl = `https://${domain}/${asset}`;
    const aRes = await fetchTimeout(aUrl, timeoutMs, 'HEAD');
    const ok = !aRes.timeout && aRes.r && aRes.r.ok;
    if (!ok) results.ok = false;
    results.checks.push({ name: 'asset', asset, url: aUrl, status: aRes.timeout ? 'timeout' : (aRes.r && aRes.r.status), ok, timeMs: aRes.ms });
  }

  // API endpoints opcionais
  if (apiBase) {
    for (const ep of ['status', 'points']) {
      const apiUrl = `${apiBase.replace(/\/$/, '')}/${ep}`;
      const apiRes = await fetchTimeout(apiUrl, timeoutMs);
      const bodyOk = apiRes.r && apiRes.r.ok;
      let parsed;
      if (bodyOk) {
        try { parsed = await apiRes.r.json(); } catch {}
      }
      const ok = bodyOk && parsed && typeof parsed === 'object';
      if (!ok) results.ok = false;
      results.checks.push({ name: `api-${ep}`, url: apiUrl, status: apiRes.timeout ? 'timeout' : (apiRes.r && apiRes.r.status), ok, sampleKeys: parsed && Object.keys(parsed).slice(0, 5) });
    }
  }

  // Sumário rápido
  results.summary = {
    dnsOk: dnsInfo.ok,
    rootOk: !!results.checks.find(c => c.name === 'root' && c.ok),
    missingAssets: results.checks.filter(c => c.name === 'asset' && !c.ok).map(c => c.asset)
  };

  console.log(JSON.stringify(results, null, 2));
  if (!results.ok) process.exit(1);
})();
