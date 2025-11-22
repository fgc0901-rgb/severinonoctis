#!/usr/bin/env node
/**
 * Healthcheck script
 * Usage:
 *   node scripts/healthcheck.js --domain bobbunitinho.com --api http://localhost:3080 --timeout 8000
 * Exits 0 if all mandatory checks pass, 1 otherwise.
 */

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
const fetchTimeout = (url, ms) => Promise.race([
  fetch(url).then(r => ({ r })),
  new Promise(res => setTimeout(() => res({ timeout: true }), ms))
]);

if (!domain) {
  console.error('Missing --domain or HEALTH_DOMAIN');
  process.exit(1);
}

(async () => {
  const results = { timestamp: new Date().toISOString(), domain, ok: true, checks: [] };

  // Root page
  const rootUrl = `https://${domain}/`;
  const rootRes = await fetchTimeout(rootUrl, timeoutMs);
  if (rootRes.timeout || !rootRes.r.ok) {
    results.ok = false;
    results.checks.push({ name: 'root', url: rootUrl, status: rootRes.timeout ? 'timeout' : rootRes.r.status, ok: false });
  } else {
    results.checks.push({ name: 'root', url: rootUrl, status: rootRes.r.status, ok: true });
  }

  // service-worker.js (optional)
  const swUrl = `https://${domain}/service-worker.js`;
  const swRes = await fetchTimeout(swUrl, timeoutMs);
  results.checks.push({ name: 'service-worker', url: swUrl, status: swRes.timeout ? 'timeout' : (swRes.r && swRes.r.status), ok: !swRes.timeout && swRes.r && swRes.r.ok });

  // API status & points (only if apiBase provided)
  if (apiBase) {
    for (const ep of ['status', 'points']) {
      const apiUrl = `${apiBase.replace(/\/$/, '')}/${ep}`;
      const apiRes = await fetchTimeout(apiUrl, timeoutMs);
      const bodyOk = apiRes.r && apiRes.r.ok;
      let parsed;
      if (bodyOk) {
        try { parsed = await apiRes.r.json(); } catch { }
      }
      const ok = bodyOk && parsed && typeof parsed === 'object';
      if (!ok) results.ok = false;
      results.checks.push({ name: `api-${ep}`, url: apiUrl, status: apiRes.timeout ? 'timeout' : (apiRes.r && apiRes.r.status), ok, sample: parsed && Object.keys(parsed).slice(0, 5) });
    }
  }

  // Output
  console.log(JSON.stringify(results, null, 2));
  if (!results.ok) process.exit(1);
})();
