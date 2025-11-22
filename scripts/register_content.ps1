param(
  [Parameter(Mandatory=$true)][string]$Tipo,
  [string]$Platform = '',
  [double]$DurationHours = 0,
  [int]$Views = 0,
  [string]$Date = (Get-Date -Format 'yyyy-MM-dd'),
  [string]$Notes = '',
  [string]$CsvPath = (Join-Path $PSScriptRoot '..' 'content_points.csv')
)

$limitedTypes = 'tiktok','tiktok_edit','instagram_feed','instagram_reels','instagram_stories','shorts'
$liveTypes = 'live'
$raidTypes = 'raid'
$indicacaoTypes = 'indicacao'

function Ensure-Csv {
  param($Path)
  if(!(Test-Path $Path)){
    'date,type,platform,duration_hours,views,points,notes' | Out-File -FilePath $Path -Encoding UTF8
  }
}

function Get-LiveDurationPoints {
  param([double]$H)
  if($H -ge 10){ return 10 }
  elseif($H -ge 8){ return 8 }
  elseif($H -ge 6){ return 6 }
  elseif($H -ge 4){ return 4 }
  elseif($H -ge 2){ return 2 }
  else { return 0 }
}

function Get-ViewPoints {
  param([int]$V)
  if($V -ge 1000){ return 12 }
  elseif($V -ge 800){ return 10 }
  elseif($V -ge 500){ return 8 }
  elseif($V -ge 350){ return 6 }
  elseif($V -ge 100){ return 4 }
  elseif($V -ge 1){ return 2 }
  else { return 0 }
}

function Get-ContentPoints {
  param([string]$T)
  switch ($T.ToLower()) {
    'tiktok' { return 3 }
    'tiktok_edit' { return 3 }
    'instagram_feed' { return 3 }
    'instagram_reels' { return 3 }
    'instagram_stories' { return 3 }
    'shorts' { return 3 }
    'raid' { return 5 }
    'indicacao' { return 5 }
    default { return 0 }
  }
}

Ensure-Csv -Path $CsvPath
$rows = Import-Csv -Path $CsvPath

# Enforce one per day rule for limited daily types
if($limitedTypes -contains $Tipo.ToLower()){
  $exists = $rows | Where-Object { $_.date -eq $Date -and $_.type -eq $Tipo }
  if($exists){
    Write-Error "Já existe registro para tipo '$Tipo' na data $Date (limite diário)."; exit 1
  }
}

$points = 0
if($liveTypes -contains $Tipo.ToLower()){
  $durationPts = Get-LiveDurationPoints -H $DurationHours
  $viewPts = Get-ViewPoints -V $Views
  $points = $durationPts + $viewPts
  if($durationPts -eq 0){ Write-Warning 'Live com menos de 2h não pontua duração.' }
} else {
  $points = Get-ContentPoints -T $Tipo
}

if($raidTypes -contains $Tipo.ToLower()) { $Platform = 'multi' }
if($indicacaoTypes -contains $Tipo.ToLower()) { $Platform = 'multi' }

$record = [pscustomobject]@{
  date = $Date
  type = $Tipo
  platform = $Platform
  duration_hours = if($DurationHours){ [string]$DurationHours } else { '' }
  views = if($Views){ [string]$Views } else { '' }
  points = $points
  notes = $Notes
}

$record | Export-Csv -Path $CsvPath -NoTypeInformation -Append -Encoding UTF8

# Summary
$totalPoints = ($rows + $record | Measure-Object -Property points -Sum).Sum
$todayPoints = (($rows + $record) | Where-Object { $_.date -eq $Date } | Measure-Object -Property points -Sum).Sum

Write-Host "Registro adicionado:" -ForegroundColor Green
$record | Format-List
Write-Host "Total acumulado: $totalPoints" -ForegroundColor Cyan
Write-Host "Total hoje ($Date): $todayPoints" -ForegroundColor Yellow
