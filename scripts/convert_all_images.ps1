<#
.SYNOPSIS
  Converte todas as imagens JPG/PNG para WebP em um diretório (recursivo) usando cwebp ou ffmpeg.
.DESCRIPTION
  Procura arquivos .jpg/.jpeg/.png, gera .webp com qualidade configurável, evita reconverter se já existe (a menos que -Overwrite).
  Gera relatório de economia de tamanho (bytes antes vs depois) e opção para remover metadados se exiftool presente.
.PARAMETER RootDir
  Diretório base (padrão: ./imagens).
.PARAMETER Quality
  Qualidade WebP (0-100). Padrão 80.
.PARAMETER Overwrite
  Reprocessa arquivos já convertidos.
.PARAMETER UseFfmpeg
  Usa ffmpeg em vez de cwebp (útil se cwebp não instalado). Usa libwebp com -q.
.EXAMPLE
  ./convert_all_images.ps1 -RootDir ./imagens -Quality 82
.EXAMPLE
  ./convert_all_images.ps1 -RootDir ./imagens -Overwrite -UseFfmpeg
#>
param(
  [string]$RootDir = (Join-Path $PSScriptRoot '..' 'imagens'),
  [int]$Quality = 80,
  [switch]$Overwrite,
  [switch]$UseFfmpeg
)

function Require-Tool($name){
  if(-not (Get-Command $name -ErrorAction SilentlyContinue)){
    Write-Error "Ferramenta '$name' não encontrada."; exit 1
  }
}

if(-not (Test-Path $RootDir)){ Write-Error "Diretório não encontrado: $RootDir"; exit 1 }

# Preferência de conversor
if($UseFfmpeg){ Require-Tool ffmpeg } else { if(Get-Command cwebp -ErrorAction SilentlyContinue){ $global:UseCwebp=$true } else { Write-Warning 'cwebp não encontrado, usando ffmpeg'; Require-Tool ffmpeg; $UseFfmpeg=$true } }
if(Get-Command exiftool -ErrorAction SilentlyContinue){ $global:HasExif=$true } else { $global:HasExif=$false }

$raw = Get-ChildItem $RootDir -Recurse -File | Where-Object { $_.Extension -match '\.(jpg|jpeg|png)$' }
if(-not $raw){ Write-Host 'Nenhum JPG/PNG encontrado.'; exit 0 }

Write-Host "Total de arquivos encontrados: $($raw.Count)" -ForegroundColor Cyan

$results = @()
foreach($f in $raw){
  $target = Join-Path $f.DirectoryName ($f.BaseName + '.webp')
  if((Test-Path $target) -and -not $Overwrite){
    $results += [pscustomobject]@{Orig=$f.Name; WebP=(Split-Path $target -Leaf); Status='skip'; SavedKB=0}
    continue
  }
  if($UseFfmpeg){
    ffmpeg -v error -y -i "$($f.FullName)" -c:v libwebp -qscale:v $Quality -preset picture -compression_level 6 -c:a none "$target" 2>$null
  } else {
    cwebp "$($f.FullName)" -q $Quality -quiet -o "$target"
  }
  if($LASTEXITCODE -ne 0 -or -not (Test-Path $target)){
    Write-Warning "Falha: $($f.Name)"; $results += [pscustomobject]@{Orig=$f.Name; WebP=$null; Status='error'; SavedKB=0}; continue
  }
  if($HasExif){
    try{ exiftool -overwrite_original -all= "$($f.FullName)" | Out-Null } catch {}
    try{ exiftool -overwrite_original -all= "$target" | Out-Null } catch {}
  }
  $origSize = $f.Length; $newSize = (Get-Item $target).Length
  $saved = [math]::Round(($origSize - $newSize)/1kb,1)
  Write-Host "OK -> $($f.Name) => $(Split-Path $target -Leaf) (Economia ${saved}KB)" -ForegroundColor Green
  $results += [pscustomobject]@{Orig=$f.Name; WebP=(Split-Path $target -Leaf); Status='ok'; SavedKB=$saved}
}

Write-Host "\nResumo:" -ForegroundColor Yellow
$results | Format-Table -AutoSize
$converted = $results | Where-Object Status -eq 'ok'
$totSaved = [math]::Round(($converted | Measure-Object -Property SavedKB -Sum).Sum,1)
Write-Host "Economia total aproximada: ${totSaved}KB" -ForegroundColor Cyan

# Sugestão de atualização de JSON RDR2 se diretório rdr2 envolvido
$rdr2Dir = Join-Path $RootDir 'rdr2'
if(Test-Path $rdr2Dir){
  $jsonPath = Join-Path $rdr2Dir 'rdr2.json'
  if(Test-Path $jsonPath){
    Write-Host "Verifique se novas WebP precisam ser adicionadas em: $jsonPath" -ForegroundColor Magenta
  }
}

Write-Host "Conversão concluída." -ForegroundColor Cyan
