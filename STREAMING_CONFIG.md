# Configuração Multi-Stream (OBS Studio + StreamElements)

## Objetivo
Transmitir simultaneamente para Twitch, Kick e YouTube mantendo consistência visual (overlay), estabilidade de bitrate e sincronização de anúncios/alertas.

## 1. Perfis & Cenas OBS
- Criar 1 Perfil: `Severino_MultiStream`.
- Criar 1 Coleção de Cenas: `Dossie_Operacional`.

### Cenas sugeridas
1. `Aquecimento` (Tela inicial + música ambiente + contador opcional).
2. `Dossie` (Cam + Browser Source overlay principal + Chat unificado opcional).
3. `Análise_Artefato` (Captura de janela + câmera pequena + foco em item/imagem).
4. `Ritual_Simulado` (Captura jogo ou app + efeitos áudio).
5. `Intervalo` (Tela de espera curta com mensagens rotativas).
6. `Encerramento` (Call to action Discord + próximos eventos).

## 2. Overlays StreamElements
1. Criar overlay 1920x1080 com widgets:
   - Alerta de novos seguidores/inscritos (genérico multiplataforma quando possível).
   - Caixa de eventos vertical (últimos 5 eventos) usando filtragem combinada (Twitch+YouTube; Kick pode exigir separação).
   - Logo e faixa "Dossiê Militar" fixos.
   - Barra inferior: objetivo meta (ex: "Meta: 100 membros Discord").
2. Browser Source (OBS): largura 1920 / altura 1080 / FPS 30 / custom CSS opcional para padronizar tipografia `'Merriweather'`.
3. Ajustes de segurança: desativar interações arriscadas (endereços externos desconhecidos) e testar overlay em cena privada antes.

## 3. Chat Unificado
- Alternativas:
  - `StreamElements Chat Aggregation` (se disponível) ou serviço como `Restream Chat` em Browser Source.
  - Bot custom futuramente lendo APIs e postando no Discord.
- Configurar fonte monoespaçada legível (Ex: `Special Elite` para estética, fallback `Courier New`).

## 4. Encoding (Sugestões)
| Resolução | FPS | Bitrate Vídeo | Codec | Uso |
|-----------|-----|---------------|-------|-----|
| 1920x1080 | 60  | 8000-9000 Kbps | x264 / NVENC | Banda adequada (>12Mbps up) |
| 1600x900  | 60  | 6500-7500 Kbps | x264 / NVENC | Menor carga CPU/GPU |
| 1280x720  | 60  | 4500-5500 Kbps | x264 / NVENC | Conexões medianas |

- Áudio: 160 Kbps AAC (estável multiplataforma). 
- Keyframe Interval: 2 segundos.
- Preset x264: `veryfast` (ou NVENC `quality`).
- Profile: `high` para 1080p; `main` para 720p.
- Evitar CBR vazando para mais de 9Mbps em conexões instáveis.

## 5. Largura de Banda
- Testar `speedtest` real: Upload >= 20 Mbps para 1080p multi-stream.
- Reserva 30% de banda para overhead e variações.
- Caso instabilidade: reduzir resolução para 900p ou 720p antes de sacrificar FPS.

## 6. Múltiplos RTMP
Opções:
1. Plugin OBS: `Multiple RTMP Outputs` (adiciona endpoints extras).
2. Serviço terceirizado (Restream / Melon / StreamElements Multi-stream se disponível).
3. Custom servidor NGINX RTMP (avançado) recebendo ingest único e replicando.

Recomendação inicial: usar serviço (menos complexidade). Se plugin:
- Configurar Saída 1: Twitch (Server ingest melhor proximidade geográfica).
- Saída 2: YouTube RTMP (Chave de transmissão padrão ou evento específico).
- Saída 3: Kick (Endpoint padrão; validar latência).

## 7. Sincronização de Alertas
- Alguns eventos são específicos (ex: "Inscrito YouTube" vs "Seguidor Twitch").
- Padronizar nomenclatura nas camadas: exibir ícone da plataforma junto do nome.
- Cor de faixa:
  - Twitch: roxo sutil (#6441A5).
  - YouTube: vermelho escuro (#C4302B no tom vintage adaptado).
  - Kick: verde (#53FC18) suavizado para combinar com paleta.

## 8. VOD Considerações
- YouTube mantém VOD automaticamente; Twitch e Kick também.
- Evitar música protegida para manter reuso dos cortes.
- Marcar capítulos manualmente em YouTube pós-live (melhora descoberta).

## 9. Fluxo Pós-Live (Automação)
1. Exportar gravação local (MKV).
2. Script renomeia `YYYY-MM-DD_TemaSessao.mkv`.
3. FFmpeg gera "cortes candidatos" por detecção de silêncio/elevação de voz.
4. Whisper transcreve e produz SRT.
5. Seleção manual -> Shorts / TikTok.

Exemplo comandos:
```powershell
# Conversão para mp4
ffmpeg -i input.mkv -c copy output.mp4

# Extrair segmento 00:10:00 - 00:12:30
ffmpeg -i input.mp4 -ss 00:10:00 -to 00:12:30 -c copy corte1.mp4

# Normalizar loudness
ffmpeg -i corte1.mp4 -af loudnorm=I=-16:LRA=11:TP=-1.5 corte1_norm.mp4
```

## 10. Checklist Pré-Live
- [ ] Velocidade upload > 20 Mbps confirmada.
- [ ] Chaves RTMP atualizadas (Twitch, YouTube Evento, Kick).
- [ ] Cena inicial carregada (Aquecimento).
- [ ] Overlay StreamElements funcionando (teste alert de seguidores).
- [ ] Monitor de CPU/GPU < 75% quando em cena principal.
- [ ] Áudio: níveis -6dB pico / sem clipping.
- [ ] Chat unificado legível.
- [ ] Gravação local ON (fallback / edição).

## 11. Segurança & Operacional
- Ocultar chave RTMP em gravações de tela.
- Verificar se plugin multi-output não duplica alertas.
- Teste de 5 minutos privado antes de publicar.
- Manter backup de último overlay JSON.

## 12. Próximas Extensões
- Inserir watermark dinâmica quando multi-stream ativo.
- Estatísticas em overlay (viewers combinados) via status server futuro.
- Integração bot: comando `!plataformas` listando estado de cada live.

---
Atualize `.env` com API YouTube e slug Kick para permitir detecção multi-live. Status consolidado em `/status`.
