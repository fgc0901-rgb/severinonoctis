// Paleta para o gráfico
const palette = {
  base: '#b22222',
  accent: '#4b0082',
  faint: '#c0c0c0'
};

// Parallax leve no hero
window.addEventListener('scroll', () => {
  const y = window.scrollY * 0.3;
  document.querySelector('.hero').style.backgroundPosition = `center calc(50% + ${y}px)`;
});

// Indicador de navegação ativo
const nav = document.querySelector('.navbar');
const indicator = document.querySelector('.nav-indicator');
const links = [...nav.querySelectorAll('a')];
function setIndicator(el) {
  const rect = el.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();
  indicator.style.left = `${rect.left - navRect.left}px`;
  indicator.style.width = `${rect.width}px`;
}
links.forEach(a => a.addEventListener('mouseenter', () => setIndicator(a)));
window.addEventListener('resize', () => {
  const active = document.querySelector('.navbar a.active') || links[0];
  setIndicator(active);
});

// Revelação por scroll
const revealEls = document.querySelectorAll('.reveal, .reveal-list li');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));

// Lightbox para galeria
const lightbox = document.getElementById('lightbox');
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
lbClose.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });

// Filtros da galeria
const filterBtns = document.querySelectorAll('.filters .btn');
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

// Gráfico simples em canvas
function drawChart() {
  const cvs = document.getElementById('economiaChart');
  const ctx = cvs.getContext('2d');
  const w = cvs.width, h = cvs.height;
  ctx.clearRect(0,0,w,h);

  const data = [60, 80, 55, 70, 90]; // indicadores fictícios
  const labels = ['PIB', 'Emprego', 'Comércio', 'Infra', 'Serviços'];
  const max = Math.max(...data);
  const gap = w / (data.length + 1);

  // grid
  ctx.strokeStyle = 'rgba(192,192,192,0.2)';
  for (let i=0;i<=4;i++) {
    const y = h - (h * (i/4));
    ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w-20, y); ctx.stroke();
  }

  // barras com animação
  let t = 0;
  function anim() {
    t = Math.min(t + 0.02, 1);
    ctx.clearRect(0,0,w,h);
    // grid
    ctx.strokeStyle = 'rgba(192,192,192,0.2)';
    for (let i=0;i<=4;i++) {
      const y = h - (h * (i/4));
      ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w-20, y); ctx.stroke();
    }

    data.forEach((val, i) => {
      const x = gap * (i+1);
      const height = (val / max) * (h - 60) * t;
      ctx.fillStyle = palette.base;
      ctx.fillRect(x - 20, h - 40 - height, 40, height);
      // brilho
      ctx.fillStyle = palette.accent;
      ctx.fillRect(x - 20, h - 40 - Math.min(6, height*0.2), 40, Math.min(6, height*0.2));

      // labels
      ctx.fillStyle = '#f5f5f5';
      ctx.font = '12px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x, h - 20);
    });

    if (t < 1) requestAnimationFrame(anim);
  }
  anim();
}
drawChart();

// Conteúdo vindo do dados.json
fetch('dados.json')
  .then(r => r.json())
  .then(data => {
    // História
    document.getElementById('historia-origem').textContent = data.linhagem.heranca;
    document.getElementById('historia-ritual').textContent = data.linhagem.marca;
    document.getElementById('historia-errancia').textContent = data.linhagem.queda;

    // Eventos
    document.getElementById('evento-queda').textContent = 'Testemunho da ruína dos Escarlates na noite sem retorno.';
    document.getElementById('evento-lua').textContent = 'A lunação escarlate que abriu feridas no mundo velado.';
    document.getElementById('evento-vaela').textContent = 'Os traços de Vaela entre pergaminhos e cinzas ritualísticas.';

    // Lore
    const lore = document.getElementById('lore-conteudo');
    lore.innerHTML = `
      <p><strong>Nome:</strong> ${data.identidade.nome}</p>
      <p><strong>Alcunhas:</strong> ${data.identidade.alcunhas.join(', ')}</p>
      <p><strong>Desejo:</strong> ${data.desejo.obsessao} — ${data.desejo.motivo}</p>
      <p class="aside"><em>Natureza:</em> ${data.identidade.natureza}</p>
    `;
  })
  .catch(err => console.error('Erro ao carregar dados.json:', err));