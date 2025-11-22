param(
  [string]$SourceDir = (Join-Path $PSScriptRoot '..' 'imagens' 'rdr2'),
  [int]$Quality = 85,
  [switch]$Overwrite
)

# Verifica dependências
function Require-Tool($name){
  if(-not (Get-Command $name -ErrorAction SilentlyContinue)){
    Write-Error "Ferramenta '$name' não encontrada. Instale antes (ex: cwebp / exiftool)."; exit 1
  }
}
Require-Tool cwebp
if(Get-Command exiftool -ErrorAction SilentlyContinue){ $global:HasExif = $true } else { $global:HasExif = $false }

if(-not (Test-Path $SourceDir)){ Write-Error "Diretório não encontrado: $SourceDir"; exit 1 }
$rawFiles = Get-ChildItem $SourceDir -File | Where-Object { $_.Extension -match '\.(jpg|jpeg|png)$' }
if(-not $rawFiles){ Write-Host "Nenhum arquivo JPG/PNG encontrado."; exit 0 }

Write-Host "Convertendo para WebP (qualidade $Quality)..." -ForegroundColor Cyan
foreach($f in $rawFiles){
  $target = Join-Path $SourceDir ($f.BaseName + '.webp')
  if((Test-Path $target) -and -not $Overwrite){
    Write-Warning "Skip (já existe): $($f.Name)"; continue
  }
  cwebp "$($f.FullName)" -q $Quality -quiet -o "$target"
  if($LASTEXITCODE -ne 0){ Write-Warning "Falha conversão: $($f.Name)"; continue }
  if($HasExif){
    # Limpa EXIF do original e do convertido
    try{ exiftool -overwrite_original -all= "$($f.FullName)" | Out-Null } catch {}
    try{ exiftool -overwrite_original -all= "$target" | Out-Null } catch {}
  }
  Write-Host "OK -> $($f.Name) => $(Split-Path $target -Leaf)" -ForegroundColor Green
}

# Relatório tamanho
Write-Host "Resumo tamanhos:" -ForegroundColor Yellow
$report = Get-ChildItem $SourceDir -File | Where-Object { $_.Extension -match '\.(webp|jpg|jpeg|png)$' } | Select Name,@{n='KB';e={[math]::Round($_.Length/1kb,1)}}
$report | Format-Table -AutoSize

Write-Host "Conversão concluída. Atualize 'rdr2.json' se adicionou novos arquivos." -ForegroundColor Cyan
