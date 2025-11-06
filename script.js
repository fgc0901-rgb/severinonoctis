// Carrega dados do códex
fetch("dados.json")
  .then(response => response.json())
  .then(data => {
    // História
    const historia = document.getElementById("historia-conteudo");
    historia.innerHTML = `
      <p>${data.linhagem.heranca}</p>
      <p>${data.linhagem.queda}</p>
      <p>${data.linhagem.marca}</p>
    `;

    // Lore
    const lore = document.getElementById("lore-conteudo");
    lore.innerHTML = `
      <p><strong>Identidade:</strong> ${data.identidade.nome}, ${data.identidade.alcunhas.join(", ")}</p>
      <p><strong>Desejo:</strong> ${data.desejo.obsessao} — ${data.desejo.motivo}</p>
      <blockquote>${data.frase}</blockquote>
    `;

    // Eventos
    const eventos = document.getElementById("lista-eventos");
    const listaEventos = [
      "Queda dos Escarlates",
      "Noites da Lua Sangrenta",
      "Vestígios de Vaela"
    ];
    listaEventos.forEach(ev => {
      const li = document.createElement("li");
      li.textContent = ev;
      eventos.appendChild(li);
    });
  })
  .catch(error => console.error("Erro ao carregar dados:", error));