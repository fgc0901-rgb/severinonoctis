# Guia de Especificações de Mídia

Padronização de resolução, duração, proporção, encoding e áudio para cada formato.

## 1. Resumo Tabelado
| Plataforma | Formato | Proporção | Resolução Alvo | Duração Ideal | Codec Vídeo | Bitrate Vídeo | Áudio |
|------------|---------|-----------|----------------|--------------|------------|---------------|-------|
| TikTok Vídeo | Vertical | 9:16 | 1080x1920 | 15–30s | H.264 | 5–8 Mbps (VBR) | AAC 128–160 Kbps |
| TikTok Story | Vertical | 9:16 | 1080x1920 | <15s | H.264 | 4–6 Mbps | AAC 128 Kbps |
| Kwai Vídeo | Vertical | 9:16 | 1080x1920 | 20–40s | H.264 | 5–8 Mbps | AAC 128–160 Kbps |
| Instagram Reels | Vertical | 9:16 | 1080x1920 | 30–45s | H.264 | 6–9 Mbps | AAC 160 Kbps |
| YouTube Longo | Horizontal | 16:9 | 1920x1080 | 6–8 min | H.264 / VP9 | 8–12 Mbps | AAC 160 Kbps |
| Kick Live | Horizontal | 16:9 | 1920x1080 | Variável | H.264 | 6–9 Mbps CBR | AAC 160 Kbps |
| Twitch Raid/Live | Horizontal | 16:9 | 1920x1080 | Variável | H.264 | 6–8 Mbps CBR | AAC 160 Kbps |

## 2. Encoding Detalhes
- Keyframe Interval: 2s (para lives e VOD).  
- GOP: ~120 frames @60fps ou 60 @30fps.  
- Profile: `high` (1080p), `main` (720p fallback).  
- Color Space: Rec.709 (padrão).  

## 3. Export Presets (Sugestões)
### Shorts/Vertical (Premiere / DaVinci)
- Format: H.264
- Render at Maximum Depth: ON
- VBR 2-pass Target 8 Mbps, Max 12 Mbps
- Audio: AAC 160 Kbps Stereo 48kHz

### YouTube Longo
- H.264 High Profile
- VBR 2-pass Target 10 Mbps, Max 16 Mbps (1080p60)
- For VP9 (opcional): subir como .webm (FFmpeg) caso conteúdo com muitos gráficos.

### Lives (OBS)
- x264: Preset veryfast / NVENC quality
- Bitrate 7500–8500 Kbps (se upload >= 18 Mbps)
- Fallback: 6500 (rede instável)

## 4. Textos & Safe Zones
- TikTok / Reels: manter textos principais dentro de 1080x1420 área segura (evitar sobreposição em UI).  
- YouTube: manter títulos dentro de 90% largura para evitar cortes em TVs.  

## 5. Legendas & Subtítulos
- Whisper SRT gerado para master YouTube.  
- Reaproveitar texto para vertical editando timing (excluir pausas >0.8s).  
- Tam. fonte vertical: 48–60px (export final).  

## 6. Otimização de Peso
- Converter artes para WebP (thumbnails extras).  
- Reels/TikTok: evitar >25MB (reduz tempo upload em celular).  
- YouTube: thumbnail <=2MB, 1280x720, ratio 16:9.  

## 7. Controle de Qualidade (Checklist)
- [ ] Sem bordas pretas.
- [ ] Áudio sincronizado (amostras random no meio e fim).
- [ ] Volume pico -6dB sem clipping.
- [ ] Texto legível (contraste > 4.5:1). 
- [ ] FPS consistente (sem pulos >5 frames consecutivos).  

## 8. Nomenclatura Arquivos
`YYYY-MM-DD_INCIDENTE_tipo.ext`  
Ex: `2025-11-22_colapso-escarlate_relatorio.mp4`  
Ex: `2025-11-22_colapso-escarlate_vertical_tiktok.mp4`

## 9. Ferramentas Complementares
- FFmpeg (cortes, normalização loudness).
- HandBrake (compressão adicional). 
- ExifTool (limpar metadados sensíveis).  

## 10. Futuro
- HDR workflow (se adotado) – export HEVC 10-bit.
- Áudio espacial/ambiente camadas (design).  
- Automação pipeline transcodificação.

---
Versão 1.0 – Ajustar conforme feedback real e métricas de retenção.
