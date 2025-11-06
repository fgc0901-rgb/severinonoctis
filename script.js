// Carrega os dados do códex
fetch("dados.json")
  .then(response => response.json())
  .then(data => {
    const conteudo = document.getElementById("conteudo");

    // Identidade
    const identidade = document.createElement("div");
    identidade.innerHTML = `
      <h2>Identidade</h2>
      <p><strong>Nome:</strong> ${data.identidade.nome}</p>
      <p><strong>Alcunhas:</strong> ${data.identidade.alcunhas.join(", ")}</p>
      <p><strong>Apelido:</strong> ${data.identidade.apelido}</p>
      <p><strong>Natureza:</strong> ${data.identidade.natureza}</p>
    `;
    conteudo.appendChild(identidade);

    // Linhagem
    const linhagem = document.createElement("div");
    linhagem.innerHTML = `
      <h2>Linhagem e Origem</h2>
      <p>${data.linhagem.heranca}</p>
      <p>${data.linhagem.queda}</p>
      <p>${data.linhagem.marca}</p>
    `;
    conteudo.appendChild(linhagem);

    // Idade
    const idade = document.createElement("div");
    idade.innerHTML = `
      <h2>Idade</h2>
      <p><strong>Aparente:</strong> ${data.idade.aparente}</p>
      <p><strong>Real:</strong> ${data.idade.real}</p>
    `;
    conteudo.appendChild(idade);

    // Desejo
    const desejo = document.createElement("div");
    desejo.innerHTML = `
      <h2>Desejo Vampírico</h2>
      <p><strong>Obsessão:</strong> ${data.desejo.obsessao}</p>
      <p><strong>Motivo:</strong> ${data.desejo.motivo}</p>
      <p><strong>Postura:</strong> ${data.desejo.postura}</p>
    `;
    conteudo.appendChild(desejo);

    // Frase
    const frase = document.createElement("blockquote");
    frase.textContent = data.frase;
    conteudo.appendChild(frase);
  })
  .catch(error => console.error("Erro ao carregar dados:", error));