# Assets Faltantes / Placeholders

Atualmente foram inseridos placeholders inline (data URI SVG) em `index.html` para imagens ausentes. Para restaurar conteúdo real:

## Imagens Necessárias
- `imagens/simbolo.png` (favicon + logo)
  - Recom.: PNG transparente 512x512 e 192x192; tema oliva (#556b2f) + detalhe papel (#c3b094).
- `imagens/og-banner.jpg`
  - Dimensão recomendada: 1200x630 (Open Graph), peso < 150KB (usar JPEG progressivo ou WebP).
- Galeria inicial:
  - `imagens/noctis1.jpg`
  - `imagens/lua.jpg`
  - `imagens/ritual.jpg`
  - Sugestão: Converter para WebP qualidade ~80. ALT semântico descritivo.

Após adicionar os arquivos, substituir as tags `<img src="data:image/svg+xml,...">` pelos caminhos corretos e restaurar favicon `<link rel="icon" type="image/png" href="imagens/simbolo.png">`.

## Áudio Ambiente
- `sons/ambiente.mp3` ausente.
  - Duração curta em loop ou faixa ambiente (≤ 1MB ideal). Converter para MP3 ~96kbps mono se for ruído de fundo.
  - Restaurar bloco:
    ```html
    <audio id="ambiente" loop>
      <source src="sons/ambiente.mp3" type="audio/mpeg">
    </audio>
    ```

## Service Worker
Atualizado para não pré-cachear assets inexistentes. Ao adicionar arquivos, considere atualizar `ASSETS` em `service-worker.js`.

## Healthcheck
Para validar assets após adicioná-los:
```powershell
node scripts/healthcheck.js --domain=bobbunitinho.com --assets=style.css,script.js,manifest.json,imagens/simbolo.png,imagens/og-banner.jpg
```

## Otimização Recomendada
1. Converter JPG/PNG para WebP (qualidade 80) usando script `scripts/convert_all_images.ps1`.
2. Garantir peso total inicial < 1MB para primeira pintura.
3. Usar nomes descritivos: `noctis_portrait_01.webp`, `lua_sangrenta.webp`.
4. Remover placeholders inline de `index.html` após subir imagens reais.

### Conversão Automática (PowerShell)
```powershell
# Converter todas as imagens (recursivo)
./scripts/convert_all_images.ps1 -RootDir ./imagens -Quality 82

# Forçar reconversão
./scripts/convert_all_images.ps1 -RootDir ./imagens -Quality 82 -Overwrite

# Usar ffmpeg se cwebp ausente
./scripts/convert_all_images.ps1 -RootDir ./imagens -UseFfmpeg
```

Se quiser apenas diretório RDR2: `./scripts/convert_rdr2.ps1 -Quality 85`.

Após conversão, atualizar `rdr2.json` se novas capturas foram adicionadas.

## Próximos Passos
- Subir arquivos reais.
- Limpar placeholders.
- Reexecutar healthcheck.
- Reativar áudio se desejado.

