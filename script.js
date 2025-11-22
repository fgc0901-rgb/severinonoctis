// ===== PALETA =====
const palette = {
  base: '#b22222',
  accent: '#4b0082',
  faint: '#c0c0c0'
};

// ===== PARALLAX NO HERO =====
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const y = window.scrollY * 0.3;
    hero.style.backgroundPosition = `center calc(50% + ${y}px)`;
  }
});

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
  window.addEventListener('resize', () => {
    const active = document.querySelector('.navbar a.active') || links[0];
    setIndicator(active);
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

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#b22222';
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
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Redimensiona canvas
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ===== CARREGAR DADOS DO JSON =====
fetch('dados.json')
  .then(r => r.json())
  .then(data => {
    // História
    const historiaOrigem = document.getElementById('historia-origem');
    const historiaRitual = document.getElementById('historia-ritual');
    const historiaErrancia = document.getElementById('historia-errancia');
    
    if (historiaOrigem) historiaOrigem.textContent = data.linhagem.heranca;
    if (historiaRitual) historiaRitual.textContent = data.linhagem.marca;
    if (historiaErrancia) historiaErrancia.textContent = data.linhagem.queda;

    // Eventos
    const eventoQueda = document.getElementById('evento-queda');
    const eventoLua = document.getElementById('evento-lua');
    const eventoVaela = document.getElementById('evento-vaela');
    
    if (eventoQueda) eventoQueda.textContent = 'Testemunho da ruína dos Escarlates na noite sem retorno.';
    if (eventoLua) eventoLua.textContent = 'A lunação escarlate que abriu feridas no mundo velado.';
    if (eventoVaela) eventoVaela.textContent = 'Os traços de Vaela entre pergaminhos e cinzas ritualísticas.';

    // Lore
    const lore = document.getElementById('lore-conteudo');
    if (lore) {
      lore.innerHTML = `
        <p><strong>Nome:</strong> ${data.identidade.nome}</p>
        <p><strong>Alcunhas:</strong> ${data.identidade.alcunhas.join(', ')}</p>
        <p><strong>Desejo:</strong> ${data.desejo.obsessao} — ${data.desejo.motivo}</p>
        <p class="aside"><em>Natureza:</em> ${data.identidade.natureza}</p>
      `;
    }
  })
  .catch(err => console.error('Erro ao carregar dados.json:', err));

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