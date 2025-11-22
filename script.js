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
  fetch('data/atualizacoes.json').then(r => r.json()).catch(()=>({lista:[]}))
]).then(([personagem, eventos, itens, atualizacoes]) => {
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
}).catch(err => console.error('Erro ao carregar dados modularizados:', err));

// ===== REGISTRO SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(e=>console.log('SW falhou', e));
  });
}

// ===== TRANSIÇÃO DE PÁGINA =====
const transitionMask = document.getElementById('pageTransition');
if (transitionMask) {
  document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
      transitionMask.classList.add('active');
      setTimeout(() => transitionMask.classList.remove('active'), 400);
    });
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