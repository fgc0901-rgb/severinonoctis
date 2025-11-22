# Codex de Severino Noctis

Grimório transmídia sobre Severino Noctis: sua linhagem marcada, ecos rituais, busca pela metamorfose vampírica e expansão de lore em múltiplas plataformas (YouTube, Twitch/Kick, TikTok e Web).

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

## 2. Identidade Visual
- Paleta: Sangue `#b22222`, Arcano `#4b0082`, Cinza `#c0c0c0`, Fundo `#0a0a0a`.
- Tipografia: Títulos "Cinzel Decorative"; Corpo "Georgia"; Alternativa futura: "Inter" para overlays.
- Logo: Versões (detalhada, simplificada, monocromática). Salvar em `imagens/`.
- Banner OG: Criar `og-banner.jpg` (1200x630) com símbolo + lua sangrenta.

## 3. Modularização de Lore
- `personagem.json`: identidade, linhagem, desejo, poderes e fraquezas.
- `eventos.json`: lista temporal de eventos (id, título, época, descrição).
- `itens.json`: artefatos e relíquias com simbolismo.
- Extensões futuras: `rituais.json`, `fragmentos.json`.

## 4. SEO & Metadados
Incluídos: meta description, Open Graph, Twitter Card, canonical, JSON-LD. Atualizar valor de `canonical` para domínio real quando registrado.

## 5. PWA
- Manifest e Service Worker simples de cache estático.
- Para testar offline: abrir DevTools > Application > Service Workers.

## 6. Pipeline de Conteúdo (Resumo)
1. Gravação em alta qualidade.
2. Edição (template de lower thirds + símbolo pulsante).
3. Extração automática de clipes (FFmpeg + Whisper ou ferramenta SaaS).
4. Distribuição:
   - YouTube: 1 vídeo longo semanal + 3 Shorts.
   - Twitch/Kick: Lives temáticas (Leitura do Grimório / Laboratório Ritualístico / Caça a Relíquias).
   - TikTok: Micro-lore e teasers de transformação.
5. Reciclagem e análise semanal de métricas.

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

## 9. Monetização (Fases)
- Crescimento: Foco em retenção narrativa.
- Conversão: Apoia.se/Patreon (tiers: Marcado, Errante, Eco, Sangue).
- Expansão: Merch (grimório parcial, arte impressa, amuleto lunar), biblioteca sonora.

## 10. Próximos Passos Técnicos
- Adicionar acessibilidade: aria-label em botões de filtro e lightbox (ex: `aria-modal="true"`).
- Converter imagens para WebP (otimização) + fallback.
- Criar `rituais.json` para aprofundar trilha de metamorfose.
- Implementar página secundária: `/cronologia.html` com timeline interativa.

## 11. Comandos Úteis (Windows PowerShell)
```powershell
# Servir localmente com Python simples (alternativa ao Live Server)
python -m http.server 5500

# Conversão de imagem para WebP (instalar cwebp previamente)
# cwebp input.png -o output.webp
```

## 12. Licenciamento & Proteção
- Registrar domínio e nome.
- Centralizar artes originais datadas.
- Guardar versões brutas dos arquivos visuais (prova de criação).

## 13. Estrutura de Expansão Futuras (Esboço API Local)
GET /api/personagem -> personagem.json
GET /api/eventos -> eventos.json
GET /api/itens -> itens.json
GET /api/rituais -> rituais.json (futuro)

## 14. Checklist Rápido
- [ ] Adicionar og-banner.jpg
- [ ] Criar favicon dedicado (32x32)
- [ ] Converter imagens para WebP
- [ ] Configurar GA4 quando domínio ativo
- [ ] Criar Discord
- [ ] Registrar perfis em todas plataformas
 - [ ] Verificar handle YouTube @bobbunitinho
 - [ ] Verificar Twitch bobbunitinhu

## 15. Comunidade
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

## 16. Monetização
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
Evolua os dados em `data/` sem quebrar chave existente. Expanda com novos campos como `progresso`, `rituais_pendentes`, `eco_atual`. Boa jornada na Lua Sangrenta.
