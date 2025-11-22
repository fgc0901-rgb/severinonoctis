# Diretório RDR2 (Capturas Próprias)

Este diretório armazena SOMENTE capturas de gameplay próprias de Red Dead Redemption 2 (RDR2) ou assets oficiais autorizados (press kit) conforme termos da Rockstar.

## Regras de Origem
- Capturas devem ser realizadas pelo autor do projeto com o jogo licenciado.
- Proibido incluir qualquer material datamined, vazado ou mod que viole EULA.
- Press kit: incluir apenas se arquivo veio de fonte oficial Rockstar e política permitir uso não-comercial / editorial.

## Nome de Arquivos
Formato recomendado:
```
rdr2_[contexto]_[descricao]_[sequencia].jpg
```
Exemplos:
```
rdr2_neblina_alvorecer_01.jpg
rdr2_acampamento_noturno_02.jpg
rdr2_cavalo_corrida_03.jpg
```

## Metadados ALT (HTML)
Descrever cena + contexto atmosférico, sem exageros:
```
Cena de Red Dead Redemption 2 – cavalo atravessando riacho ao pôr do sol.
```

## Conversão & Otimização
1. Salvar captura original (PNG/JPG) em subpasta `raw/` se necessário.
2. Converter para WebP (reduz tamanho, mantém qualidade):
```
cwebp rdr2_neblina_alvorecer_01.jpg -q 85 -o rdr2_neblina_alvorecer_01.webp
```
3. Manter largura máxima: 1600px (paisagem) / 1080px (vertical recortado).
4. Remover metadados sensíveis (EXIF localização). Ferramentas: `exiftool -all= arquivo`.
5. Script automático (PowerShell):
```
powershell -File .\scripts\convert_rdr2.ps1 -SourceDir .\imagens\rdr2 -Quality 85
```
Use `-Overwrite` para reconverter arquivos já existentes.

## Direitos & Disclaimer
Red Dead Redemption 2 © Rockstar Games. As imagens aqui são capturas autorais usadas em contexto documental / transmídia. Não há intenção de comercializar ou redistribuir assets proprietários.

## Checklist Antes de Commit
- [ ] Arquivo convertido para WebP (quando possível).
- [ ] Nome seguindo padrão.
- [ ] ALT text definido no HTML onde for usado.
- [ ] Nenhuma marca d’água de terceiros.
- [ ] Confirmado que não é asset protegido ou fan art de outra pessoa.

## Próximos Passos (Opcional)
- Script PowerShell para lote de conversão e limpeza EXIF.
- Galeria dinâmica filtrável por clima (neblina, tempestade, crepúsculo).
- Overlay comparativo (antes/depois aplicação LUT).

## Plano de Fundo Dinâmico
O site pode usar uma captura RDR2 como plano de fundo global (escurecido por overlay) de três maneiras:

1. Seleção diária automática: escolhe uma captura diferente por dia (hash da data) — armazenado em `localStorage`.
2. Parâmetro de URL: `?bg=nome_do_arquivo.webp` força o fundo imediatamente.
3. Função global no console: `setRdr2Background('arquivo.webp')` persiste override até mudar novamente.

Além disso há um botão 🖼️ ("Alternar plano de fundo") na interface que cicla para a próxima captura listada em `rdr2.json`.

### Para adicionar nova imagem como candidata a fundo
1. Converter para WebP (recomendado) ou manter JPG se necessário.
2. Inserir entrada em `rdr2.json` com `arquivo` e `alt`.
3. (Opcional) Usar `?bg=arquivo.webp` para testar.

### Dicas de ALT para plano de fundo
Use descrição concisa da cena + atmosfera:
```
"Cena de Red Dead Redemption 2 – neblina dourada atravessando vale ao amanhecer"
```
