# Plano Diário de Divulgação

Este documento padroniza a execução de um ciclo diário com: TikTok (vídeo + story), Kwai vídeo, Kick live, Instagram Reels, YouTube vídeo, Twitch raid.

## 1. Timeline (Base)
| Etapa | Horário Relativo | Ação | Objetivo |
|-------|------------------|------|----------|
| Prep | T–2h | Gravar master YouTube + gerar cortes | Base narrativa |
| 1 | T | TikTok Vídeo | Descoberta inicial |
| 2 | T+15m | TikTok Story (enquete) | Interação / sinal social |
| 3 | T+30m | Kwai Vídeo | Ampliar alcance vertical |
| 4 | T+45m | Instagram Reels | Expansão não seguidores |
| 5 | T+60m | Publica YouTube (Relatório) | Profundidade / watch time |
| 6 | T+90m | Inicia Live Kick (ou simultânea) | Retenção / engajamento |
| 7 | T+Final Live | Twitch Raid | Conversão / networking |
| Pós | T+180m | Post resumo Discord | Consolidação / CTA próximo ciclo |

## 2. Mensagem Central do Dia
"Incidente Classificado" — reutilizado em cada asset com variação de frase de abertura.

## 3. Estrutura do Master (YouTube Relatório)
Seções: Introdução (hook)<2min, Incidente (contexto), Artefato, Avaliação Psicológica, Fecho (CTA comentário).
Capítulos na descrição.

## 4. Checklists por Plataforma
### TikTok Vídeo
- 15–30s, hook 0–2s.
- Texto grande: "Registro CLASSIFICADO vazou".
- Subtítulos auto + cor neutra.
- CTA comentário: "ACESSO".

### TikTok Story
- Enquete: "Liberar próxima página?" Sim / Ainda não.
- Tag perfil YouTube.

### Kwai
- 20–40s, variação de hook ("Interceptação às 03h").
- Sem watermark externa.

### Instagram Reels
- 30–45s, 3 subtítulos dinâmicos.
- CTA: "Comenta tua análise".
- Adicionar localização opcional para boost (cidade genérica).

### YouTube
- 6–8 min, thumbnail 3–4 palavras.
- Descrição: resumo + links Discord.

### Kick Live
- Título: "Operação AO VIVO – Incidente #01".
- Overlay: status / meta comentários.
- Reforçar vídeo YouTube (meta X análises).

### Twitch Raid
- Selecionar alvo com afinidade temática.
- Mensagem raid: "Eco registrado. Comentem no relatório!".

## 5. Captions (Resumo)
Ver arquivo `CAPTIONS_TEMPLATES.md`.

## 6. Variáveis do Dia
- INCIDENTE_ID
- ARTEFATO_FOCO
- META_COMENTARIOS (ex: 50)
- HASHTAGS_ROTACAO (3–5 secundárias)

## 7. Automação Scripts Usáveis
- FFmpeg cortes (scripts/ffmpeg_tasks.ps1 / .sh)
- Whisper transcrição SRT.
- Node snippet métricas (scripts/metrics_ingest.js).

## 8. KPIs Coletar (1h / 24h)
| Plataforma | 1h | 24h |
|------------|----|-----|
| TikTok Vídeo | Views, Retenção 3s/8s, Comentários c/ "ACESSO" | Views totais, Compartilhamentos |
| TikTok Story | % voto Sim | NA |
| Kwai | Views, Compartilhamentos | Views, Comentários CTA |
| Reels | Alcance não seguidores, Salvamentos | Comentários totais |
| YouTube | Views, CTR, Retenção 30% | Retenção final, Comentários c/ "PRÓXIMO INCIDENTE" |
| Kick Live | Pico, Média, Chat/min | Seguidores ganhos |
| Twitch Raid | Viewers pré/pós, seguidores ganhos | Seguidores 24h, impacto comentários YT |

## 9. Log Pós-Ciclo
Registro breve (date, incidente, resultados principais, ajustes para próximo dia).

## 10. Próximos Incrementos
- Comando `!relatorio` automatizado com contagem de comentários (scraping futuro).
- Overlay métrica combinada (viewers multi-stream). 
- API interna consolidando KPIs.

---
Versão 1.0 – Ajustar conforme feedback real.
