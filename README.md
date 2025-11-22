# Dossiê Militar: Severino Noctis

Relatório transmídia classificado sobre Severino Noctis: registro de serviço, incidentes classificados, avaliação psicológica, logística & suprimentos e expansão narrativa operacional em múltiplas plataformas (YouTube, Twitch/Kick, TikTok e Web).

## 1. Estrutura do Projeto
```
index.html          # Página principal
style.css           # Estilos góticos responsivos
script.js           # Interações, gráfico, partículas, carregamento modular
manifest.json       # PWA
service-worker.js   # Cache básico
imagens/            # Logos e artes (adicionar og-banner.jpg)
sons/               # Áudio ambiente (ambiente.mp3)
data/               # Módulos de lore
  personagem.json
  eventos.json
  itens.json
```

## 2. Identidade Visual (Atualizada)
- Paleta parchment militar: Papel `#f2e6cf`, Oliva `#556b2f`, Couro `#7c4f2b`, Acento escuro `#3d4c1f`.
- Tipografia: Títulos "Playfair Display"; Corpo "Merriweather"; Elementos mecanografados "Special Elite".
- Estética: Documento arquivado / carimbos de classificação / texturas sutis.
- Banner OG: `og-banner.jpg` (1200x630) com selo + faixa "Dossiê Militar".

## 3. Modularização de Dados
- `personagem.json`: identidade operacional, linhagem (herança / queda / marca), estado e capacidades.
- `eventos.json`: incidentes classificados (id, título, época, descrição analítica).
- `itens.json`: artefatos catalogados (sensor, ferramenta, barreira) com simbolismo funcional.
- Extensões futuras: `protocolos.json`, `residuos.json`.

## 4. SEO & Metadados
Incluídos: meta description, Open Graph, Twitter Card, canonical, JSON-LD. Atualizar valor de `canonical` para domínio real quando registrado.

## 5. PWA
- Manifest e Service Worker simples de cache estático.
- Para testar offline: abrir DevTools > Application > Service Workers.

## 6. Estratégia Multicanal
| Canal | Formato | Frequência | Objetivo |
|-------|---------|-----------|----------|
| YouTube Longo | Episódio "Relatório de Campo" (8–12 min) | 1x/sem | Profundidade narrativa |
| YouTube Shorts | Micro-incidente / símbolo decodificado | 3x/sem | Descoberta / CTR |
| Twitch/Kick | Live Operacional (análise fragmentos / simulação ritual / Q&A) | 2–3x/sem | Comunidade / watch time |
| TikTok | Clip vertical (30–45s) com legenda forte + call to Discord | 4–5x/sem | Alcance / funil |
| Discord | Drops, enquetes, resumos pós-live | Diário | Retenção / pertencimento |

Pilares narrativos: (1) Incompletude / estabilização; (2) Incidentes históricos; (3) Artefatos funcionais; (4) Avaliação psicológica progressiva; (5) Colapso Escarlate.

Calendário simplificado:
- Seg: Short símbolo / Teaser live.
- Ter: TikTok incidente + Enquete Discord.
- Qua: Live (Análise fragmentos).
- Qui: Short + TikTok estado psicológico.
- Sex: Episódio Longo (Relatório de Campo) + Post resumo.
- Sáb: Live Operacional / Teste de ferramenta.
- Dom: Compilado semanal (Discord) + planejamento próximo sprint.

KPIs iniciais: Retenção YouTube (50% aos 60% do vídeo), Média live > 10 espectadores sustentados, Taxa clique Discord > 8%, Conversão TikTok->YouTube (>5%).

## 7. Pipeline de Mídia & Automação
Fases:
1. Captura: OBS perfil com cenas (Documento / Análise / Ritual / Encerramento).
2. Edição: Template DaVinci/Premiere com lower third "CLASSIFICADO" e LUT sepia suave.
3. Extração automática: Script FFmpeg corta segmentos por marcador de cena; Whisper transcreve e gera legendas SRT.
4. Geração Shorts: Script Node recorta trechos com palavras-chave (ex: "colapso", "resíduo", "marcador") e aplica moldura vertical.
5. Publicação: CLI (YouTube API + Twitch schedule) — cron job PowerShell local ou GitHub Actions.
6. Clipping discord: Bot lê novos uploads via RSS e publica embed padronizado.

Automação exemplos (pseudo):
`ffmpeg -i live.mp4 -filter:v "crop=iw:ih*0.8" clipped.mp4`
`whisper live.mp4 --language pt --output_dir transcricao/`

Backlog de scripts:
- Extrator vertical automático.
- Normalizador de áudio (sox / ffmpeg loudnorm).
- Gerador de thumbnails (node-canvas + template base).

## 8. Configuração de Analytics
- GA4: placeholder adicionado em `index.html` (substituir G-XXXXXXX).
- YouTube: monitorar retenção, CTR título + thumb, origem de tráfego.
- Twitch/Kick: watch time médio por bloco (início / pico / final), taxa de chat por minuto.
- TikTok: média visualizações nas últimas 10 peças, taxa de conclusão (>60%).
- Dashboard unificado: Planilha ou Notion — colunas (Data | Conteúdo | Canal | Visualizações | Retenção | Cliques Discord | Novos membros).
- Futuro: Export API YouTube + Helix + TikTok (via terceiros) para consolidação automática.

## 9. Comunidade & Engajamento

## 7. Analytics (Planejar)
- GA4 para tráfego do site.
- YouTube Studio: CTR, retenção, palavras-chave.
- Twitch/Kick: média de espectadores, chat engagement.
- TikTok: taxa de conclusão, seguidores por vídeo.
- Centralização opcional: Notion / AirTable.

## 8. Comunidade & Engajamento
- Discord com canais temáticos: `#eco-do-sangue`, `#rituais`, `#arquivos-perdidos`, `#avisos-lua`.
- Progressão de roles: Mortal → Marcado → Errante → Eco → Sangue Completo.
- Bots: anúncios de live, novo vídeo, drops simbólicos (XP / relíquias).

## 10. Monetização (Fases)
- Crescimento: Foco em retenção narrativa.
- Conversão: Apoia.se/Patreon (tiers: Marcado, Errante, Eco, Sangue).
- Expansão: Merch (grimório parcial, arte impressa, amuleto lunar), biblioteca sonora.

## 11. Próximos Passos Técnicos
- Adicionar acessibilidade: aria-label em botões de filtro e lightbox (ex: `aria-modal="true"`).
- Converter imagens para WebP (otimização) + fallback.
- Criar `rituais.json` para aprofundar trilha de metamorfose.
- Implementar página secundária: `/cronologia.html` com timeline interativa.

### Princípios de UX Aplicados (Atualização)
- Mobile-first: estilos base simplificados e media query apenas para ampliar layout.
- Minimalismo: redução de texturas e sombras intensas, foco em tipografia e hierarquia clara.
- Psicologia das Cores: verde profundo (estabilidade/confiabilidade) e marrom quente (narrativa/humano) equilibram emoção e segurança.
- Layout em F: títulos e parágrafos alinhados à esquerda, largura moderada melhora varredura inicial de conteúdo.
- Performance: `defer` no script, atributos `width/height/decoding` em imagens para reduzir CLS, listener `passive` e pausa de partículas em background.
- Acessibilidade: skip link, foco visível, redução de movimento para usuários com preferência.

## 12. Comandos Úteis (Windows PowerShell)
```powershell
# Servir localmente com Python simples (alternativa ao Live Server)
python -m http.server 5500

# Conversão de imagem para WebP (instalar cwebp previamente)
# cwebp input.png -o output.webp
```

## 13. Proteção & Marca
- Registrar domínio (bobbunitinho.com) e variantes próximos.
- Verificar marca nominativa "Severino Noctis" (INPI) + logotipo estilizado.
- Arquivar evidências de criação (arte, áudio, texto) com data (repositório privado + hash SHA256).
- Monitoramento de uso indevido: alertas Google + pesquisa trimestral.
- DMCA: template pronto para acionamento rápido.

## 14. Estrutura de Expansão Futuras (Esboço API Local)
GET /api/personagem -> personagem.json
GET /api/eventos -> eventos.json
GET /api/itens -> itens.json
GET /api/rituais -> rituais.json (futuro)

## 15. Checklist Rápido
- [ ] Adicionar og-banner.jpg
- [ ] Criar favicon dedicado (32x32)
- [ ] Converter imagens para WebP
- [ ] Configurar GA4 quando domínio ativo
- [ ] Criar Discord
- [ ] Registrar perfis em todas plataformas
 - [ ] Verificar handle YouTube @bobbunitinho
 - [ ] Verificar Twitch bobbunitinhu

## 16. Comunidade
### Estrutura Discord
- Canais:
  - `#eco-do-sangue` (chat geral atmosférico)
  - `#rituais` (teorias e construção de lore)
  - `#arquivos-perdidos` (drop de fragmentos narrativos) 
  - `#avisos-lua` (anúncios oficiais: lives, vídeos, eventos)
  - `#crônicas` (resumos pós-live / episódios)
  - `#atelier` (fanart, mídia criada pela comunidade)
  - `#sussurros` (canal limitado para pistas ARG / enquetes)
- Categorias: Introdução | Lore | Interação | Suporte | Exclusivos.
- Roles progressivas gamificadas:
  - Mortal (entrada)
  - Marcado (10 mensagens + reação ao termo lua)
  - Errante (participa de 1 live + 50 msgs)
  - Eco (envia conteúdo/fanart aprovado)
  - Sangue Completo (apoiador financeiro / moderador confiável)
- Permissões: Acesso a `#sussurros` a partir de Errante; criação de threads a partir de Eco.

### Bots e Automação
- Bot de anúncios (ex: Discord.js ou plataformas prontas como Statbot + YT notifier):
  - Monitorar RSS do YouTube e postar embed.
  - Webhook para lives (Twitch/Kick) com banner + horário.
  - Sistema de “drop de fragmentos”: a cada X mensagens, bot envia `Fragmento Ritualístico #NN`.
- Moderação: Auto-delete links suspeitos, lista de palavras banidas (spam / phishing).
- Integração futura: Comando `/lore evento <id>` retornando dados de `eventos.json`.

### Engajamento Semanal
- Segunda: Enquete de rumo narrativo.
- Quarta: Post de fragmento do passado (arquivo parcial).
- Sexta: Teaser do episódio de sábado.
- Pós-live: Resumo em `#crônicas` + votação de teorias.

### KPIs Comunidade
- Retenção (membros ativos / total).
- Mensagens diárias médias.
- % usuários que evoluem de Mortal -> Errante em 30 dias.
- Fanarts / semana.

## 17. Monetização
### Fases
1. Consolidação (0–90 dias): foco em crescimento orgânico e identidade.
2. Ativação (90–180 dias): introdução leve de tiers + recompensas digitais.
3. Expansão (180+): produtos físicos / digitais premium.

### Tiers (Apoia.se / Patreon)
- Marcado: Nome em página de agradecimento + wallpapers (R$5–10).
- Errante: Acesso antecipado a fragmentos + enquetes exclusivas (R$15).
- Eco: Episódio extra mensal (lore estendido) + canal privado (R$30).
- Sangue Completo: Créditos especiais em vídeos, relíquias digitais numeradas, participação em sessão de criação (R$60+).

### Recompensas Sustentáveis
- Conteúdo “batch” (wallpapers, pacotes de ambient sound) para evitar overload.
- Relatórios de progresso mensais.
- Evitar promessas de tempo real excessivas (preserva foco criativo).

### Produtos Futuro
- Grimório parcial impresso (edição limitada numerada).
- Amuleto metálico (símbolo) + certificado.
- Pack sonoro ritual (loops atmosféricos originais). 
- Kit digital: Texturas de pergaminho + padrões rúnicos.

### Estrutura Financeira Inicial
- Separar 20% de entrada (apoios) para reinvestir em arte/produção.
- Criar planilha: receita mensal, custos (software, comissões arte, hospedagem).

### KPIs Monetização
- Taxa de conversão de espectadores para apoiadores (%).
- Receita média por apoiador.
- Retenção de tiers (churn mensal < 10%).
- Percentual de upgrades (Marcado -> Errante, etc.).

### Proteções e Ética
- Transparência: publicar destino geral do apoio (ex: "Melhoria de áudio", "Arte nova").
- Limite: evitar paywall total da lore principal (tiers complementam, não bloqueiam base).

### Funil Proposto
Descoberta (Short / TikTok) -> Live envolvente (Twitch bobbunitinhu) -> Discord -> Enquete / fragmento -> Agradecimento personalizado -> Oferta tier.

### Ações Imediatas
- Criar landing simples /apoio com resumo dos tiers.
- Gerar 5 wallpapers iniciais (variações símbolo + lua).
- Publicar manifesto breve do projeto (visão e ética).

---
Para evolução técnica futura dos bots, criar pasta `bot/` com Node.js + Discord.js e endpoints internos reutilizando JSON em `data/`. Solicite quando quiser iniciar implementação.

---
Evolua os dados em `data/` sem quebrar chave existente. Expansões sugeridas: `progresso_estabilizacao`, `protocolos_pendentes`, `indice_residual`. Persistir consistência da estrutura.

---
Estado atual: Estética militar vintage aplicada, dados modulados reescritos em tom operacional, JSON-LD adaptado a `Report`, GA4 placeholder inserido, multi-stream watcher (Twitch/YouTube/Kick) e documentação `STREAMING_CONFIG.md` adicionados.
