# README Streaming: OBS Studio + StreamElements

Guia operacional completo para colocar a transmissão multi-plataforma (Twitch / YouTube / Kick / TikTok opcional) em funcionamento com identidade do projeto "Dossiê Militar: Severino Noctis".

---
## 1. Pré-Requisitos
- **Hardware mínimo:** CPU 4c/8t (ex: Ryzen 5 / i5), 16GB RAM, GPU com encoder (NVENC Turing/Ampere ou AMD AMF) para aliviar CPU.
- **Disco:** SSD com >20GB livres para VODs temporários.
- **Internet:** Upload estável (medir 3 vezes):
  - 1080p60 Multi-stream: ≥ 20 Mbps.
  - 900p/720p60 Multi-stream: ≥ 12 Mbps.
  - 720p30: ≥ 6–8 Mbps.
- **Paleta / Tipografia:** Já definida no site – usar `Playfair Display`, `Merriweather`, `Special Elite`.
- **Conta StreamElements** conectada às plataformas principais (pelo menos Twitch + YouTube). Kick/TikTok podem exigir integrações separadas.

---
## 2. Instalação & Perfil OBS
1. Baixar última versão OBS (https://obsproject.com/).
2. Criar **Perfil**: `Severino_MultiStream`.
3. Criar **Coleção de Cenas**: `Dossie_Operacional`.
4. Ativar gravação em MKV (Settings > Output > Recording Format) para evitar corrupção em queda.
5. (Opcional) Ajustar Process Priority: Settings > Advanced > Process Priority = Above Normal.

### Plugin Multi-RTMP (se não usar serviço externo)
- Baixar: https://github.com/sorayuki/obs-multi-rtmp (Release ZIP) > extrair na pasta OBS (reiniciar).
- Novo menu "Multiple Output" aparece: adicionar endpoints para Twitch, YouTube, Kick.

---
## 3. Cenas Padronizadas
| Cena | Conteúdo | Objetivo |
|------|----------|----------|
| `Aquecimento` | Imagem/loop + música ambiente + contador início | Engajamento inicial / retenção pré-live |
| `Dossie` | Cam principal + Overlay StreamElements + Chat unificado | Núcleo da narrativa / análise |
| `Análise_Artefato` | Captura de janela (imagem / PDF) + Cam pequena | Foco em item/lore visual |
| `Ritual_Simulado` | Captura jogo/app + efeitos áudio | Imersão / dramatização |
| `Intervalo` | Tela estática com mensagens rotativas | Pausas táticas |
| `Encerramento` | Call to action Discord + próximos eventos | Conversão / comunidade |

Sugestão: Agrupar fontes comuns em **Cenas Aninhadas** (OBS > Add > Scene) para reutilizar (ex: `Cam_Base` com filtros aplicados).

---
## 4. Fontes Principais (Sources)
- **Camera (Video Capture Device):** 1080p30 (reduz carga se streaming 60fps com gameplay). Filtros: Color Correction (suave), Sharpen leve (<0.15).
- **Audio Input Capture (Mic):** Microfone dedicado.
- **Audio Output Capture (Desktop):** Som do sistema controlado por mix.
- **Browser Source (Overlay):** URL do overlay StreamElements principal (1920x1080).
- **Browser Source (Chat unificado):** Restream Chat ou overlay StreamElements chat se disponível.
- **Image / Media:** Logo, transição, textura militar.
- **Text (GDI+):** Mensagens temporárias (usar fonte `Special Elite`).

---
## 5. Configuração de Saída (Encoder)
### Opção GPU (NVENC)
- Rate Control: CBR
- Bitrate (ver tabela abaixo)
- Keyframe Interval: 2
- Preset: Quality
- Profile: High
- Look-ahead: OFF (economia performance) ou ON se sobra GPU.
- Psycho Visual Tuning: ON

### Opção CPU (x264)
- Rate Control: CBR
- Bitrate conforme resolução
- Keyframe Interval: 2
- CPU Preset: veryfast (equilíbrio). Se sobra CPU: fast.
- Profile: high (1080p) / main (720p)

### Bitrates Recomendados
| Upload Real (Mbps) | Plataforma Alvo | Resolução | FPS | Bitrate Vídeo | Áudio (AAC) |
|--------------------|-----------------|----------|-----|---------------|-------------|
| ≥ 20               | Twitch + YT     | 1080p    | 60  | 8000–9000 Kbps| 160 Kbps    |
| 15–19              | Multi           | 900p     | 60  | 6500–7500 Kbps| 160 Kbps    |
| 10–14              | Multi / Stable  | 720p     | 60  | 4500–5500 Kbps| 128–160 Kbps|
| 6–9                | Single / Multi  | 720p     | 30  | 3500–4500 Kbps| 128 Kbps    |

Ativar "Dynamically change bitrate" (se disponível) para evitar quedas bruscas em instabilidade.

---
## 6. Áudio & Filtros
Aplicar filtros no **Mic**:
1. Noise Suppression (RNNoise) – redução suave de fundo.
2. Compressor – Ratio 4:1 / Threshold -18dB / Attack 6ms / Release 120ms / Output Gain +3dB.
3. Limiter – Threshold -1dB (evita clipping).
4. (Opcional) Expander – mantém ambiente baixo sem cortar respirações.

Mix Final: Picos máx entre -6dB e -4dB durante fala intensa.

Música Ambiente em canal separado com ganho mais baixo (-25 a -30dB) para não competir com voz.

---
## 7. Overlays StreamElements
1. Logar em https://streamelements.com/ e conectar Twitch + YouTube.
2. Criar Overlay: `Dossie_Principal` (1920x1080).
3. Adicionar Widgets:
   - AlertBox unificado (seguidores/inscritos/subs): renomear layout para estética militar.
   - Recent Events (últimos 5) com ícones pequenos por plataforma.
   - Goal Bar: "Meta: 100 membros Discord".
   - Chat (se integrável) ou usar Restream.
   - Custom Widget (HTML) para Fragmento Ritualístico aleatório (placeholder futuro).
4. Exportar URL (Overlay > Launch Overlay > Copy).
5. Adicionar no OBS como Browser Source (1920x1080 / FPS 30 / Control de áudio OFF).

### CSS Base (Custom CSS do Overlay)
```css
body, .se-body {
  font-family: 'Merriweather', serif !important;
  color: #2e2e2e;
}
.alert-box, .goal, .event-item {
  background: linear-gradient(180deg,#e9dcc6,#d6c3a7);
  border: 1px solid #b59b78;
  border-radius: 6px;
  box-shadow: 0 3px 8px rgba(110,85,55,.25);
  font-family: 'Playfair Display', serif;
}
.platform-icon { width:16px; height:16px; margin-right:4px; filter: sepia(.4); }
```

### Padronização de Alertas
- Duração: 6s.
- Sons: uso de efeitos originais (evitar material protegido).
- Cor por plataforma (apêndice simples): Twitch roxo suave, YouTube vermelho queimado, Kick verde atenuado.

---
## 8. Multi-Stream (Três abordagens)
1. **Serviço Externo (Restream):** Simplifica chave única -> distribuir. Menos controle advanced.
2. **Plugin Multi-RTMP:** Mais controle, pode aumentar carga CPU/GPU.
3. **Servidor NGINX RTMP Próprio:** Requer configuração avançada e hospedagem.

Começar pelo serviço externo para estabilizar; migrar para plugin quando quiser menos dependência.

### Plugin Multiple Output Exemplo
| Output | Server | Stream Key |
|--------|--------|------------|
| Twitch | rtmp://live.twitch.tv/app | (chave secreta) |
| YouTube| rtmp://a.rtmp.youtube.com/live2 | (chave evento ou padrão) |
| Kick   | rtmp://fa.kick.com/app | (chave) |

Verificar latência e quedas: abrir Output Stats (OBS > View > Stats).

---
## 9. Checklist Pré-Live (Consolidado)
- [ ] Teste privado 2–5 min sem quedas.
- [ ] CPU < 75% / GPU < 70%.
- [ ] Bitrate estável (variação < 20%).
- [ ] Áudio calibrado (picos -6dB, sem clipping).
- [ ] Overlay carregado (alert test OK).
- [ ] Cena inicial pronta (`Aquecimento`).
- [ ] Gravação local ON.
- [ ] Chat legível / sem overflow.
- [ ] Chaves verificados (não expostas em tela).

---
## 10. Fluxo Pós-Live
1. Parar transmissão e aguardar flush final (3–5s).
2. Verificar gravação MKV salva; renomear: `YYYY-MM-DD_TemaSessao.mkv`.
3. Converter para MP4 (se necessário) e gerar cortes com FFmpeg.
4. Rodar transcrição (Whisper) para legendas.
5. Selecionar 3–5 momentos para Shorts/TikTok.
6. Atualizar planilha de métricas (views, pico, retenção média). Usar `metrics_template.csv` se aplicável.

Exemplos:
```powershell
ffmpeg -i live.mkv -c copy live.mp4
ffmpeg -i live.mp4 -ss 00:12:10 -to 00:14:05 -c copy corte_ritual.mp4
ffmpeg -i corte_ritual.mp4 -af loudnorm=I=-16:LRA=11:TP=-1.5 corte_norm.mp4
```

---
## 11. Integração Futuras (Bot / Status)
- Pasta `bot/` já possui scripts (ex: `liveWatcher.js`, `statusServer.js`) para consolidar estado.
- Futuro: Overlay Custom Browser puxando `http://localhost:PORT/status` com JSON de espectadores agregados.
- Comando de chat `!plataformas` lido pelo bot listando se cada endpoint está ativo.

---
## 12. Segurança & Boas Práticas
- Nunca mostrar tela com chave quando alternando cenas.
- Revogar chave se suspeita de vazamento.
- Manter backup do Overlay (Export JSON StreamElements ao versionar grande mudança).
- Evitar música com direitos – usar loops originais do diretório `sons/`.

---
## 13. Troubleshooting Rápido
| Problema | Possível Causa | Ação |
|----------|----------------|------|
| Queda Bitrate | Upload instável / saturação | Reduzir resolução para 900p ou 720p; limitar apps background |
| Desync Áudio/Vídeo | Alta carga CPU | Migrar para NVENC; baixar preset x264; fechar processos pesados |
| Alertas duplicados | Multi-overlay ativo | Garantir só 1 Browser Source principal com alerts |
| Chat ilegível | Fonte pequena / excesso | Aumentar tamanho CSS; limitar mensagens por segundo no widget |
| Frame Drops (render) | GPU saturada | Reduzir filtros, desativar Look-ahead NVENC, diminuir fps 60->30 temporário |
| Delay longo YouTube | Latência normal padrão | Usar modo "Baixa Latência" em evento YT |

---
## 14. Expansões (Roadmap)
- Widget de "Fragmento Ritualístico" rotativo puxando arquivo JSON.
- Contador de meta (ex: próximos 10 membros Discord) via API bot.
- Cron disparo automático de intervalos (script pequena janela).
- Página web interna com painel consolidado (usar `statusServer.js`).

---
## 15. Referências Internas
- Documento base multi-stream: `STREAMING_CONFIG.md` (este README aprofunda execução prática).
- Métricas: `metrics_template.csv`.
- Áudio ambiente: `sons/ambiente.mp3`.
- Paleta e tipografia: ver `README.md` seção Identidade Visual.

---
## 16. Resumo Ultra-Rápido (TL;DR)
1. Perfil & Coleção criados.
2. Bitrate definido conforme upload.
3. Overlays StreamElements + URL no OBS.
4. Cenas principais estruturadas.
5. Filtros áudio aplicados (Noise, Compressor, Limiter).
6. Multi-output (serviço ou plugin) configurado.
7. Checklist pré-live OK -> GO.
8. Pós-live: cortes + transcrição + métricas.

---
### Pronto para iniciar.
Se quiser adicionar um modo responsivo de ícones (somente SVG em mobile) ou integrar contador de espectadores combinado, solicitar próximo passo.

---
## 17. Configurações Otimizadas por Plataforma

### Twitch
- Resolução: 936p60 (alternativa eficiente) ou 1080p60 se banda estável.
- Bitrate: 6000 Kbps (limite padrão) CBR; se 936p pode usar 6500 em evento especial (verificar limites regionais).
- Encoder: NVENC Quality / x264 veryfast.
- Keyframe: 2s; Perfil: High; Áudio: 160 Kbps AAC.
- Latência: Normal (ou Low Latency se maior interação). Desativar B-Frames extras em hardware antigo.
- Estratégia de lives curtas (2h) para progressão de contagem sem exaustão.

### YouTube
- Resolução: 1080p60 (ou 1440p se upscale leve para transcodificação VP9 melhor em VOD).
- Bitrate: 8000–9000 Kbps (1080p60); 10–12 Mbps se 1440p.
- Encoder: NVENC Quality / x264 fast (melhor compressão para VOD).
- Latência: Baixa Latência para interação; Ultra Baixa só se chat rápido (cuidado com estabilidade).
- Pós-live: Adicionar capítulos (00:00 Aquecimento / 05:00 Ritual / 65:00 Encerramento) melhora retenção e views recorrentes.

### Kick
- Resolução: 1080p60 ou 900p60 (reduz carga se multi-stream).
- Bitrate: 8000 Kbps (testar estabilidade; reduzir para 7000 se oscilação >25%).
- Encoder: NVENC Quality.
- Priorizar título direto + tag temática (lore / ritual) para descoberta inicial.

### TikTok Live (Opcional)
- Canvas vertical: 720x1280 ou 1080x1920 @ 30 ou 60fps (30 suficiente para talking head).
- Bitrate: 2500–3500 Kbps CBR; Áudio 128 Kbps.
- Crop vertical: Cena dedicada no OBS (duplicar cena principal + filtro de recorte).
- Evitar excesso de overlay — foco em rosto + elemento destaque (símbolo). CTA: “Link completo na bio”.

### Instagram Reels / Stories / Feed
- Reels/Stories: 1080x1920, 30–60s, áudio normalizado -16 LUFS.
- Feed imagem: 1080x1350 (4:5) – textura militar + selo + micro-frase (máx 4 palavras).
- Export vertical master sem watermark; duplicar variações para Reels + TikTok.

### YouTube Shorts
- Formato: 1080x1920, <60s, foco em primeiro 1.5s com gancho textual.
- Inserir legenda que cobre 35–45% inferior sem ocultar elementos.

### Pipeline de Master Vertical
1. Grava live 2h (formato horizontal base).
2. Marca timestamps (ex: ritual, reação, revelação artefato).
3. Exporta cortes para pasta `shorts_raw/`.
4. Converte cada corte para vertical (crop + scale) via FFmpeg.
5. Overlay leve (logo + faixa curta) aplicado em edição rápida (template).
6. Duplica arquivo sem marca d’água para uso externo (TikTok Atlanta).

---
## 18. Sistema de Pontuação: Análise & Eficiência

### Lives (2h vs 10h)
Pontuação por hora é linear: 2h = 2 pts (1 pt/h), 4h = 4 pts (1 pt/h) … 10h = 10 pts (1 pt/h). Logo, fazer mais sessões de 2h permite:
- Menor desgaste.
- Mais eventos de descoberta inicial (cada início ativa notificação).
- Mais janelas para exportar clipes frescos.

### Vistas (Views) por Live
Objetivo progressivo: tentar escalar pelo menos 1 live/semana para >1000 views (+12 pts). Estratégia:
- Programar “live especial” com maior divulgação (Reels/Short teaser + Story + TikTok 3h antes).
- Usar título com fórmula: “RITUAL #X – Decodificando Artefato [Palavra Forte]”.
- Intercalar momentos de retenção a cada ~12–15 min (micro revelações). Evita queda de audiência.

### Conteúdo Diário (Limites)
Máximo teórico diário (se produzir tudo permitido):
- TikTok Vídeo: 3 pts
- TikTok Edit sem watermark: 3 pts
- Instagram Feed: 3 pts
- Instagram Reels: 3 pts
- Instagram Stories: 3 pts
- YouTube Shorts: 3 pts
Total: 18 pts/dia (conteúdo curto) + Live (2–10 pts) + Views bônus (2–12 pts) + RAID/Indicação (5 pts cada).

### RAID & Indicação
- Planejar 1 RAID seletiva para criador de mesmo nicho por semana => +5 pts.
- Indicações: criar micro funnel (Story + canal Discord) pedindo use do allowlist/código.

### Priorização (Se Tempo Limitado)
1. Live 2h (base progressão + clipes).
2. Shorts/Vertical: produzir 1 versão “limpa” e derivar para Reels + TikTok (automatiza 3 pontos plurais).
3. Story com CTA para live de amanhã (manutenção atividade).
4. Feed 4:5 apenas 3–4x semana (mantém frescor; evita saturação). Substituir por Reels se pouco tempo.

### Loop Semanal Pontos (Exemplo)
| Dia | Live | Pts Live | Base Conteúdo (Alvo) | Pts Conteúdo | Extra (Views/RAID) | Total Estimado |
|-----|------|----------|----------------------|--------------|--------------------|----------------|
| Seg | 2h   | 2        | TikTok + Reels + Shorts + Story | 12 | - | 14 |
| Ter | 2h   | 2        | TikTok Edit + Feed + Story + Shorts | 12 | RAID +5 | 19 |
| Qua | 2h   | 2        | TikTok + Reels + Story | 9 | Live Especial (>500 views +8) | 19 |
| Qui | Off  | 0        | TikTok + Shorts + Story | 9 | - | 9 |
| Sex | 2h   | 2        | TikTok + Reels + Shorts + Story | 12 | Indicação +5 | 19 |
| Sáb | 2h   | 2        | TikTok Edit + Reels + Story | 9 | Live Especial (>1000 views +12) | 23 |
| Dom | Off  | 0        | Recap Feed + Story | 6 | - | 6 |
Total estimado semanal ~109 pts (ajustável).

---
## 19. Estratégia Operacional para Mais Pontos

1. Micro-Planejamento Diário (no fim da live): marcar 5 momentos potenciais de clipe (timestamp + 8 palavras de contexto) para acelerar produção vertical.
2. Automação FFmpeg: script que normaliza lote e gera versão cropped vertical (power shell pipeline).
3. Template de legenda rápido (arquivo `.srt` gerado por Whisper) -> inserir em editor e exportar para Reels/Shorts.
4. Reaproveitar um único master vertical para: Shorts, Reels, TikTok (alterar apenas CTA final de texto sobre fundo).
5. Story pré-live (T-3h) + Story “AO VIVO” (início) para impulsionar pico inicial e aumentar chance de view bracket superior.
6. RAID estratégico: escolher canal com público sobreposto mas ligeiramente maior (ganho de novos espectadores + pontos).
7. Indicações: manter formulário rápido (Google Form curto) vinculado a allowlist – publicar resultado parcial semanal (reforço social).
8. Live Especial (sábado): roteiro leve – bloco 1 (gancho) / bloco 2 (artefato raro) / bloco 3 (interação perguntas) / bloco 4 (teaser semana seguinte).

### Check de Saturação
Se queda de retenção <40% em Shorts/Reels consecutivos: reduzir volume para qualidade — focar em 1 peça mais roteirizada ao invés de 3 superficiais.

### Métricas que Retroalimentam Pontos
- Tempo médio de live antes de primeira queda (>25 min ideal).
- % cliques de Story -> live (objetivo inicial 5%).
- Taxa conversão espectadores -> Discord (meta 8%).

---
## 20. Scripts PowerShell Sugeridos (Protótipo)
```powershell
# 1. Normalizar e gerar corte vertical (crop central 9:16 baseado em fonte 1920x1080)
$input = "live.mp4"
$outDir = "shorts_raw"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
ffmpeg -i $input -ss 00:12:10 -to 00:13:05 -vf "crop=1080:1920:420:0,scale=1080:1920" -af loudnorm=I=-16:LRA=11:TP=-1.5 "$outDir/ritual_fragment.mp4"

# 2. Gerar versão sem watermark
Copy-Item "$outDir/ritual_fragment.mp4" "$outDir/ritual_fragment_clean.mp4"

# 3. Listar cortes para log de pontos
Get-ChildItem $outDir -Filter *.mp4 | Select Name, Length
```

---
## 21. Próximos Incrementos Possíveis
- Dashboard interno calculando pontos acumulados (ler eventos + contagem de posts registrados).
- CLI de registro: `register_content.ps1 -tipo reels -data 2025-11-22` atualiza CSV de pontuação.
- Overlay contador incremental de pontos da semana.

---
## 22. TL;DR Pontos & Config
- Use lives curtas (2h) para acelerar contagem e gerar mais clipes.
- Planeje 1–2 lives especiais por semana para ultrapassar brackets de views.
- Max diário conteúdo rápido: 18 pts (6 categorias) + live + extras.
- Reutilize um master vertical para todas plataformas (reduz tempo).
- Automatize FFmpeg + Whisper para escalar sem perder qualidade.
- RAID e Indicações agendadas amplificam picos + agregam pontos.

---
## 23. Scripts de Registro & Painel de Pontos

Arquivos adicionados para controle operacional:
- `content_points.csv` (base de dados de pontos)
- `scripts/register_content.ps1` (registro de itens de conteúdo / lives / raids / indicações)
- `scripts/points_summary.ps1` (resumo últimos dias / semana)
- `scripts/points_server.js` (API local JSON para overlay / dashboard)

### 23.1 Registro de Conteúdo
Exemplos PowerShell:
```powershell
# Registrar live 2h com 420 views
powershell -File .\scripts\register_content.ps1 -Tipo live -Platform twitch -DurationHours 2 -Views 420 -Notes "Ritual #5"

# Registrar TikTok vídeo do dia
powershell -File .\scripts\register_content.ps1 -Tipo tiktok -Platform tiktok -Notes "Clip lua sangrenta"

# Registrar Reels Instagram
powershell -File .\scripts\register_content.ps1 -Tipo instagram_reels -Platform instagram -Notes "Teaser artefato"

# Registrar RAID
powershell -File .\scripts\register_content.ps1 -Tipo raid -Notes "Raid para canal aliado"

# Registrar Indicação (allowlist)
powershell -File .\scripts\register_content.ps1 -Tipo indicacao -Notes "Indicação usuário X"
```
Regras aplicadas automaticamente:
- Live: pontos = duração (2/4/6/8/10) + pontos por faixa de views.
- Views faixas: 1000>=12, 800>=10, 500>=8, 350>=6, 100>=4, 1>=2.
- Conteúdo curto (tiktok, tiktok_edit, instagram_feed, instagram_reels, instagram_stories, shorts): 3 pontos cada (máximo 1 registro por dia por tipo).
- Raid: 5 pontos. Indicação: 5 pontos.

### 23.2 Resumo Rápido
```powershell
powershell -File .\scripts\points_summary.ps1            # últimos 7 dias (default)
powershell -File .\scripts\points_summary.ps1 -Days 14    # últimos 14 dias
```
Saída inclui: pontos últimos X dias, semana atual (seg->dom), total lives, horas acumuladas e top categorias.

### 23.3 API Local de Pontos
Iniciar servidor:
```powershell
node .\scripts\points_server.js
```
Endpoint: `http://localhost:4580` retorna JSON:
```json
{
  "total_points": 132,
  "by_type": {"live": 46, "tiktok": 15},
  "by_date": {"2025-11-20": 18, "2025-11-21": 22},
  "current_week": {"start": "2025-11-17", "end": "2025-11-23", "points": 74},
  "lives": {"count": 5, "total_hours": 12, "avg_duration": 2.4, "avg_views": 380.6}
}
```
Uso sugerido: Browser Source (HTML futuro) consumindo esse JSON para exibir progresso semanal.

### 23.4 Estrutura do CSV
Cabeçalho:
```
date,type,platform,duration_hours,views,points,notes
```
Exemplo linha live 2h / 420 views:
```
2025-11-22,live,twitch,2,420,6,"Ritual #5"
```

### 23.5 Boas Práticas de Registro
- Registrar imediatamente após terminar live (timestamp fresco para clipes).
- Manter notas curtas (até ~40 caracteres) para facilitar overlay futuro.
- Auditar duplicados 1x/semana (script bloqueia tipos diários repetidos, mas revisar manual).

### 23.6 Próximas Melhorias (Opcional)
- Script de merge automático de clipes -> entrada batelada no CSV.
- Cliente web simples (React/Vite) lendo `points_server.js` para gráfico semanal.
- Export semana fechada para `metrics_template.csv` consolidando pontos + métricas de audiência.

### 23.7 Integração com Site (Pontuação Operacional)
- Seção `#pontuacao` consome o endpoint local. Necessário iniciar servidor antes de abrir a página para gráficos aparecerem.
- Falha de conexão mostra mensagem “Sem resposta do servidor de pontos.”
- Comando rápido: `node .\scripts\points_server.js` em paralelo ao servidor estático do site.
