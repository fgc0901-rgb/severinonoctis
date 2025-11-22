// ===== PALETA (Ajustada para estética militar vintage) =====
const palette = {
  base: '#556b2f', // oliva principal
  accent: '#7c4f2b', // couro/rust
  faint: '#c3b094'  // tom papel envelhecido
};

// ===== PARALLAX NO HERO =====
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const y = window.scrollY * 0.3;
    hero.style.backgroundPosition = `center calc(50% + ${y}px)`;
  }
}, { passive: true });

// ===== INDICADOR DE NAVEGAÇÃO =====
const nav = document.querySelector('.navbar');
const indicator = document.querySelector('.nav-indicator');
const links = nav ? [...nav.querySelectorAll('a')] : [];

function setIndicator(el) {
  if (!indicator || !nav) return;
  const rect = el.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();
  indicator.style.left = `${rect.left - navRect.left}px`;
  indicator.style.width = `${rect.width}px`;
}

if (links.length > 0) {
  links.forEach(a => a.addEventListener('mouseenter', () => setIndicator(a)));
  let resizeScheduled = false;
  window.addEventListener('resize', () => {
    if (!resizeScheduled) {
      resizeScheduled = true;
      requestAnimationFrame(() => {
        const active = document.querySelector('.navbar a.active') || links[0];
        setIndicator(active);
        resizeScheduled = false;
      });
    }
  });
  // Inicializa o indicador
  setIndicator(links[0]);
}

// ===== REVELAÇÃO POR SCROLL =====
const sections = document.querySelectorAll('.section');
const revealEls = document.querySelectorAll('.reveal, .reveal-list li');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

sections.forEach(el => io.observe(el));
revealEls.forEach(el => io.observe(el));

// ===== LIGHTBOX DA GALERIA =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('.lightbox-img');
  const lbCap = lightbox.querySelector('.lightbox-caption');
  const lbClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.grid-galeria .item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = item.querySelector('figcaption').textContent;
      lightbox.classList.add('open');
      if (lbClose) { lbClose.setAttribute('tabindex','0'); lbClose.focus(); }
    });
  });
  
  if (lbClose) {
    lbClose.addEventListener('click', () => lightbox.classList.remove('open'));
  }
  
  lightbox.addEventListener('click', (e) => { 
    if (e.target === lightbox) lightbox.classList.remove('open'); 
  });
}

// ===== FILTROS DA GALERIA =====
const filterBtns = document.querySelectorAll('.filters .btn');
if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      document.querySelectorAll('.grid-galeria .item').forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

// ===== GRÁFICO DA ECONOMIA =====
function drawChart() {
  const cvs = document.getElementById('economiaChart');
  if (!cvs) return;
  
  const ctx = cvs.getContext('2d');
  const w = cvs.width, h = cvs.height;

  const data = [60, 80, 55, 70, 90];
  const labels = ['PIB', 'Emprego', 'Comércio', 'Infra', 'Serviços'];
  const max = Math.max(...data);
  const gap = w / (data.length + 1);

  let t = 0;
  function anim() {
    t = Math.min(t + 0.02, 1);
    ctx.clearRect(0, 0, w, h);
    
    // Grid
    ctx.strokeStyle = 'rgba(192,192,192,0.2)';
    for (let i = 0; i <= 4; i++) {
      const y = h - (h * (i / 4));
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Barras
    data.forEach((val, i) => {
      const x = gap * (i + 1);
      const height = (val / max) * (h - 60) * t;
      
      ctx.fillStyle = palette.base;
      ctx.fillRect(x - 20, h - 40 - height, 40, height);
      
      // Brilho
      ctx.fillStyle = palette.accent;
      ctx.fillRect(x - 20, h - 40 - Math.min(6, height * 0.2), 40, Math.min(6, height * 0.2));

      // Labels
      ctx.fillStyle = '#f5f5f5';
      ctx.font = '12px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x, h - 20);
    });

    if (t < 1) requestAnimationFrame(anim);
  }
  anim();
}

// Inicia gráfico quando seção estiver visível
const economiaSec = document.getElementById('economia');
if (economiaSec) {
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        drawChart();
        chartObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  chartObserver.observe(economiaSec);
}

// ===== PARTÍCULAS SANGRENTAS =====
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Reduz partículas em mobile
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 30 : 80;
  
  let drops = [];
  for (let i = 0; i < particleCount; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 2,
      speed: Math.random() * 1 + 0.5
    });
  }

  let particleFrame;
  let running = true;
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = palette.base;
    drops.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      d.y += d.speed;
      if (d.y > canvas.height) {
        d.y = -10;
        d.x = Math.random() * canvas.width;
      }
    });
    if (running) particleFrame = requestAnimationFrame(animateParticles);
  }
  animateParticles();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      if (particleFrame) cancelAnimationFrame(particleFrame);
    } else {
      if (!running) {
        running = true;
        animateParticles();
      }
    }
  });

  // Redimensiona canvas
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ===== CARREGAR DADOS DO JSON =====
Promise.all([
  fetch('data/personagem.json').then(r => r.json()),
  fetch('data/eventos.json').then(r => r.json()),
  fetch('data/itens.json').then(r => r.json()).catch(()=>({itens:[]})),
  fetch('data/atualizacoes.json').then(r => r.json()).catch(()=>({lista:[]})),
  fetch('imagens/rdr2/rdr2.json').then(r => r.json()).catch(()=>({capturas:[]}))
]).then(([personagem, eventos, itens, atualizacoes, rdr2]) => {
  // História
  const historiaOrigem = document.getElementById('historia-origem');
  const historiaRitual = document.getElementById('historia-ritual');
  const historiaErrancia = document.getElementById('historia-errancia');
  if (historiaOrigem) historiaOrigem.textContent = personagem.linhagem.heranca;
  if (historiaRitual) historiaRitual.textContent = personagem.linhagem.marca;
  if (historiaErrancia) historiaErrancia.textContent = personagem.linhagem.queda;

  // Eventos
  const eventoQueda = document.getElementById('evento-queda');
  const eventoLua = document.getElementById('evento-lua');
  const eventoVaela = document.getElementById('evento-vaela');
  if (eventos && eventos.lista) {
    if (eventoQueda) eventoQueda.textContent = eventos.lista.find(e=>e.id==='queda').descricao;
    if (eventoLua) eventoLua.textContent = eventos.lista.find(e=>e.id==='lua').descricao;
    if (eventoVaela) eventoVaela.textContent = eventos.lista.find(e=>e.id==='vaela').descricao;
  }

  // Lore principal
  const lore = document.getElementById('lore-conteudo');
  if (lore) {
    lore.innerHTML = `
      <p><strong>Nome:</strong> ${personagem.identidade.nome}</p>
      <p><strong>Alcunhas:</strong> ${personagem.identidade.alcunhas.join(', ')}</p>
      <p><strong>Desejo:</strong> ${personagem.desejo.obsessao} — ${personagem.desejo.motivo}</p>
      <p class="aside"><em>Natureza:</em> ${personagem.identidade.natureza}</p>
      <details open>
        <summary><strong>Fragmentos & Itens</strong></summary>
        <ul>
          ${itens.itens.map(i=>`<li><strong>${i.nome}</strong> — <em>${i.tipo}</em> — ${i.simbolismo}</li>`).join('')}
        </ul>
      </details>
    `;
  }

  // Atualizações
  const updatesList = document.getElementById('updates-list');
  const updatesPagination = document.getElementById('updates-pagination');
  if (updatesList && atualizacoes && Array.isArray(atualizacoes.lista)) {
    const sorted = [...atualizacoes.lista].sort((a,b)=> new Date(b.data) - new Date(a.data));
    const pageSize = 6;
    let currentPage = 1;
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

    function renderPage(page){
      updatesList.setAttribute('aria-busy','true');
      currentPage = page;
      const start = (page-1)*pageSize;
      const slice = sorted.slice(start, start+pageSize);
      updatesList.innerHTML = slice.map(u => {
        const icon = u.tipo === 'imagem' ? '🖼️' : (u.tipo === 'arquivo' ? '📁' : '📝');
        const dateFmt = new Date(u.data).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});
        const link = u.url ? `<a href="${u.url}" target="_blank" rel="noopener" class="upd-link" aria-label="Abrir ${u.titulo}">Abrir</a>` : '';
        return `<article class="update-card" data-tipo="${u.tipo}">
          <header class="update-head"><span class="update-icon" aria-hidden="true">${icon}</span><h3 class="update-title">${u.titulo}</h3></header>
          <p class="update-desc">${u.descricao}</p>
          <footer class="update-meta"><time datetime="${u.data}">${dateFmt}</time>${link}</footer>
        </article>`;
      }).join('');
      updatesList.setAttribute('aria-busy','false');
      buildPagination();
      // Mantém visão centrada sem necessidade de rolagem adicional
      if(updatesList.scrollIntoView){ updatesList.scrollIntoView({block:'start'}); }
    }

    function buildPagination(){
      if(!updatesPagination) return;
      updatesPagination.innerHTML = '';
      if(totalPages <= 1){ updatesPagination.style.display='none'; return; } else { updatesPagination.style.display='flex'; }
      const prevBtn = document.createElement('button');
      prevBtn.type='button'; prevBtn.className='page-btn'; prevBtn.textContent='«'; prevBtn.disabled = currentPage===1; prevBtn.setAttribute('aria-label','Página anterior');
      prevBtn.onclick=()=>renderPage(currentPage-1);
      updatesPagination.appendChild(prevBtn);
      for(let i=1;i<=totalPages;i++){
        const b=document.createElement('button'); b.type='button'; b.className='page-btn'; b.textContent=i; b.onclick=()=>renderPage(i);
        if(i===currentPage){ b.classList.add('active'); b.setAttribute('aria-current','page'); }
        updatesPagination.appendChild(b);
      }
      const nextBtn = document.createElement('button');
      nextBtn.type='button'; nextBtn.className='page-btn'; nextBtn.textContent='»'; nextBtn.disabled = currentPage===totalPages; nextBtn.setAttribute('aria-label','Próxima página');
      nextBtn.onclick=()=>renderPage(currentPage+1);
      updatesPagination.appendChild(nextBtn);
    }
    renderPage(1);
  }

  // RDR2 Galeria (opcional)
  const rdr2Container = document.getElementById('rdr2-galeria');
  if(rdr2Container && rdr2 && Array.isArray(rdr2.capturas)){
    if(rdr2.capturas.length === 0){
      rdr2Container.innerHTML = '<p class="aside" style="grid-column:1/-1;text-align:center;">Nenhuma captura adicionada. Use o script de conversão e atualize <code>rdr2.json</code>.</p>';
    } else {
      rdr2Container.innerHTML = rdr2.capturas.map(c => {
        const alt = c.alt || 'Captura RDR2';
        const file = `imagens/rdr2/${c.arquivo}`;
        return `<figure class="item" data-cat="rdr2"><img src="${file}" alt="${alt}" loading="lazy" decoding="async" width="300" height="300" /><figcaption>${alt}</figcaption></figure>`;
      }).join('');
      // Usa a primeira captura como plano de fundo global
      // Seleção diária determinística (hash da data) se não houver override
      const today = new Date().toISOString().slice(0,10);
      const storedOverride = localStorage.getItem('rdr2BgOverride');
      const paramBg = new URLSearchParams(location.search).get('bg');
      let chosenFile = null;
      if(paramBg){
        chosenFile = paramBg;
      } else if(storedOverride){
        chosenFile = storedOverride;
      } else {
        const lastDate = localStorage.getItem('rdr2BgDailyDate');
        const lastFile = localStorage.getItem('rdr2BgDailyFile');
        if(lastDate === today && lastFile){
          chosenFile = lastFile;
        } else {
          // hash simples
            let hash = 0; for(let i=0;i<today.length;i++){ hash = (hash*31 + today.charCodeAt(i)) & 0xffffffff; }
            const idx = Math.abs(hash) % rdr2.capturas.length;
            chosenFile = rdr2.capturas[idx].arquivo;
            localStorage.setItem('rdr2BgDailyDate', today);
            localStorage.setItem('rdr2BgDailyFile', chosenFile);
        }
      }
      if(chosenFile){
        document.body.classList.add('rdr2-bg');
        document.body.style.setProperty('--rdr2-bg-image', `url('imagens/rdr2/${chosenFile}')`);
      }
      // Se houver parâmetro de URL ?bg=arquivo.webp substitui a imagem
      const params = new URLSearchParams(location.search);
      const overrideBg = params.get('bg');
      if(overrideBg){
        const found = rdr2.capturas.find(c=>c.arquivo === overrideBg);
        const finalFile = found ? found.arquivo : overrideBg; // permite testar imagem nova
        document.body.classList.add('rdr2-bg');
        document.body.style.setProperty('--rdr2-bg-image', `url('imagens/rdr2/${finalFile}')`);
        localStorage.setItem('rdr2BgOverride', finalFile);
      } else {
        const stored = localStorage.getItem('rdr2BgOverride');
        if(stored){
          document.body.classList.add('rdr2-bg');
          document.body.style.setProperty('--rdr2-bg-image', `url('imagens/rdr2/${stored}')`);
        }
      }
    }
  }
}).catch(err => console.error('Erro ao carregar dados modularizados:', err));

// ===== REGISTRO SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(e=>console.log('SW falhou', e));
  });
}

// ===== GRÁFICOS DE PONTUAÇÃO (SEM BIBLIOTECA) =====
function drawSimpleBar(ctx, dataPairs, opts={}) {
  const {w, h} = ctx.canvas;
  ctx.clearRect(0,0,w,h);
  const padding = 40;
  const maxVal = Math.max(...dataPairs.map(p=>p[1]), 1);
  const barW = (w - padding*2) / dataPairs.length * 0.6;
  dataPairs.forEach((p,i)=>{
    const x = padding + (i+0.5) * ((w - padding*2)/dataPairs.length);
    const hVal = (p[1]/maxVal) * (h - padding*2);
    ctx.fillStyle = palette.base;
    ctx.fillRect(x - barW/2, h - padding - hVal, barW, hVal);
    ctx.fillStyle = palette.accent;
    ctx.fillRect(x - barW/2, h - padding - Math.min(8, hVal*0.2), barW, Math.min(8, hVal*0.2));
    ctx.fillStyle = '#222';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(p[0], x, h - padding + 14);
    ctx.fillText(p[1], x, h - padding - hVal - 6);
  });
  // eixo
  ctx.strokeStyle = '#444';
  ctx.beginPath(); ctx.moveTo(padding, h - padding); ctx.lineTo(w - padding, h - padding); ctx.stroke();
}

function drawSimpleLine(ctx, dataPairs) {
  const {w,h} = ctx.canvas;
  ctx.clearRect(0,0,w,h);
  const padding = 50;
  const maxVal = Math.max(...dataPairs.map(p=>p[1]),1);
  const stepX = (w - padding*2)/(dataPairs.length-1 || 1);
  ctx.strokeStyle = '#bbb';
  for(let i=0;i<=4;i++){
    const y = h - padding - (h - padding*2)*(i/4);
    ctx.beginPath(); ctx.moveTo(padding,y); ctx.lineTo(w - padding,y); ctx.stroke();
  }
  ctx.beginPath();
  ctx.strokeStyle = palette.base;
  ctx.lineWidth = 2;
  dataPairs.forEach((p,i)=>{
    const x = padding + i*stepX;
    const y = h - padding - (p[1]/maxVal)*(h - padding*2);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  dataPairs.forEach((p,i)=>{
    const x = padding + i*stepX;
    const y = h - padding - (p[1]/maxVal)*(h - padding*2);
    ctx.fillStyle = palette.accent; ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#222'; ctx.font='12px Georgia'; ctx.textAlign='center'; ctx.fillText(p[0], x, h - padding + 16);
    ctx.fillText(p[1], x, y - 10);
  });
}

function initPointsCharts(){
  const weekCanvas = document.getElementById('pointsWeekChart');
  const typeCanvas = document.getElementById('pointsTypeChart');
  const summaryEl = document.getElementById('pointsSummary');
  if(!weekCanvas || !typeCanvas) return;
  const endpoints = ['/points','/api/points','http://localhost:3080/points','http://localhost:4580'];
  function tryFetch(list){
    if(list.length===0){ if(summaryEl) summaryEl.textContent='Sem resposta do servidor de pontos.'; return Promise.reject(); }
    const url = list[0];
    return fetch(url).then(r=> r.ok ? r.json(): Promise.reject()).catch(()=> tryFetch(list.slice(1)));
  }
  tryFetch(endpoints).then(json => {
    if(json.error){ summaryEl.textContent = 'Servidor de pontos indisponível.'; return; }
    const byDate = json.by_date || {}; // { '2025-11-21': pts }
    // Ordena por data crescente
    const dates = Object.keys(byDate).sort();
    const weekPairs = dates.slice(-7).map(d=>[d.slice(5), Number(byDate[d])]);
    drawSimpleLine(weekCanvas.getContext('2d'), weekPairs);
    const byType = json.by_type || {};
    const typePairs = Object.entries(byType).sort((a,b)=>b[1]-a[1]).slice(0,8);
    drawSimpleBar(typeCanvas.getContext('2d'), typePairs);
    summaryEl.textContent = `Total acumulado: ${json.total_points} | Semana: ${json.current_week?.points ?? 0} | Lives: ${json.lives?.count ?? 0} (média views ${Math.round(json.lives?.avg_views ?? 0)})`;
  }).catch(()=>{ if(summaryEl) summaryEl.textContent='Sem resposta do servidor de pontos.'; });
}

// Ativa gráficos quando seção pontuacao entrar na tela
const pontuacaoSec = document.getElementById('pontuacao');
if(pontuacaoSec){
  const pointsObserver = new IntersectionObserver(entries => {
    entries.forEach(e=>{ if(e.isIntersecting){ initPointsCharts(); pointsObserver.unobserve(e.target); } });
  }, {threshold:0.3});
  pointsObserver.observe(pontuacaoSec);
}

// ===== TRANSIÇÃO DE PÁGINA =====
const transitionMask = document.getElementById('pageTransition');
if (transitionMask) {
  const pageLinks = document.querySelectorAll('.navbar a');
  const pages = document.querySelectorAll('.page');
  function activatePage(id){
    pages.forEach(p => {
      const active = p.id === id;
      p.setAttribute('aria-hidden', active ? 'false':'true');
      if(active){
        p.classList.add('visible');
        const heading = p.querySelector('h2, h1');
        if(heading){ heading.setAttribute('tabindex','-1'); setTimeout(()=>heading.focus(),30); }
      } else {
        p.classList.remove('visible');
      }
    });
    pageLinks.forEach(a => {
      const isActive = a.getAttribute('href') === '#'+id;
      a.classList.toggle('active', isActive);
      if(isActive){ a.setAttribute('aria-current','page'); } else { a.removeAttribute('aria-current'); }
    });
    const activeLink = [...pageLinks].find(a=>a.classList.contains('active'));
    if(activeLink){ setIndicator(activeLink); }
  }
  pageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      if(document.getElementById(targetId)){
        e.preventDefault();
        transitionMask.classList.add('active');
        setTimeout(() => {
          transitionMask.classList.remove('active');
          activatePage(targetId);
          // Atualiza URL sem scroll
          history.pushState({page:targetId}, '', '#'+targetId);
        }, 300);
      }
    });
  });
  // Ativa página inicial baseada em hash
  const initial = location.hash ? location.hash.slice(1) : 'historia';
  if(!document.getElementById(initial)) {
    history.replaceState({page:'historia'}, '', '#historia');
    activatePage('historia');
  } else {
    history.replaceState({page:initial}, '', '#'+initial);
    activatePage(initial);
  }

  // Navegação pelo botão voltar/avançar
  window.addEventListener('popstate', (e) => {
    const target = (e.state && e.state.page) ? e.state.page : (location.hash ? location.hash.slice(1) : 'historia');
    if(document.getElementById(target)) {
      activatePage(target);
    }
  });

  // Caso hash mude por manipulação externa
  window.addEventListener('hashchange', () => {
    const h = location.hash.slice(1);
    if(document.getElementById(h)) activatePage(h);
  });
}

// ===== CONTROLE DE ÁUDIO =====
const audio = document.getElementById('ambiente');
const audioToggle = document.getElementById('audioToggle');

if (audio && audioToggle) {
  audio.volume = 0.2;
  let isPlaying = false;

  audioToggle.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      audioToggle.textContent = '🔇';
      audioToggle.title = 'Ativar áudio';
    } else {
      audio.play().catch(err => console.log('Autoplay bloqueado:', err));
      audioToggle.textContent = '🔊';
      audioToggle.title = 'Desativar áudio';
    }
    isPlaying = !isPlaying;
  });

  // Tenta tocar automaticamente
  audio.play()
    .then(() => {
      isPlaying = true;
      audioToggle.textContent = '🔊';
    })
    .catch(() => {
      isPlaying = false;
      audioToggle.textContent = '🔇';
    });
}

// ===== FUNÇÃO GLOBAL PARA DEFINIR BACKGROUND MANUALMENTE =====
window.setRdr2Background = function(filename){
  if(!filename){ console.log('Informe o nome do arquivo (ex: rdr2_acampamento_noturno_02.webp)'); return; }
  document.body.classList.add('rdr2-bg');
  document.body.style.setProperty('--rdr2-bg-image', `url('imagens/rdr2/${filename}')`);
  localStorage.setItem('rdr2BgOverride', filename);
  console.log('Plano de fundo atualizado para', filename);
};

// ===== BOTÃO DE ALTERNÂNCIA DE FUNDO =====
const bgToggle = document.getElementById('bgToggle');
if(bgToggle){
  bgToggle.addEventListener('click', () => {
    fetch('imagens/rdr2/rdr2.json').then(r=>r.json()).then(data => {
      if(!data.capturas || data.capturas.length === 0){ return; }
      const current = localStorage.getItem('rdr2BgOverride') || localStorage.getItem('rdr2BgDailyFile');
      const index = data.capturas.findIndex(c=>c.arquivo === current);
      const nextIdx = index >= 0 ? (index + 1) % data.capturas.length : 0;
      const nextFile = data.capturas[nextIdx].arquivo;
      setRdr2Background(nextFile);
    }).catch(()=>{});
  });
}