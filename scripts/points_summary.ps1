param(
  [string]$CsvPath = (Join-Path $PSScriptRoot '..' 'content_points.csv'),
  [int]$Days = 7
)

if(!(Test-Path $CsvPath)){ Write-Error "CSV não encontrado em $CsvPath"; exit 1 }
$rows = Import-Csv -Path $CsvPath | ForEach-Object {
  $_.points = [int]$_.points
  $_.views = ($_.views -as [int])
  $_.duration_hours = ($_.duration_hours -as [double])
  $_
}

$today = Get-Date
$cutDate = $today.AddDays(-$Days).ToString('yyyy-MM-dd')
$recent = $rows | Where-Object { $_.date -ge $cutDate }

$totalRecent = ($recent | Measure-Object -Property points -Sum).Sum

# Agrupar por tipo
$byType = $recent | Group-Object type | ForEach-Object {
  [pscustomobject]@{ type=$_.Name; points=($_.Group | Measure-Object -Property points -Sum).Sum }
} | Sort-Object points -Descending

# Semana atual (segunda a domingo)
function Get-WeekRange($d){
  $day = $d.DayOfWeek.value__ # Sunday=0
  $diffToMonday = ( $day -eq 0 ? -6 : 1 ) - $day
  $monday = $d.AddDays($diffToMonday)
  $sunday = $monday.AddDays(6)
  return @($monday,$sunday)
}
$wr = Get-WeekRange $today
$weekStart = $wr[0].ToString('yyyy-MM-dd')
$weekEnd = $wr[1].ToString('yyyy-MM-dd')
$weekRows = $rows | Where-Object { $_.date -ge $weekStart -and $_.date -le $weekEnd }
$weekPoints = ($weekRows | Measure-Object -Property points -Sum).Sum

$lives = $rows | Where-Object { $_.type -eq 'live' }
$liveHours = ($lives | Measure-Object -Property duration_hours -Sum).Sum
$liveAvgViews = if($lives.Count){ ($lives | Measure-Object -Property views -Average).Average } else { 0 }

Write-Host "Resumo últimos $Days dias: $totalRecent pontos" -ForegroundColor Green
Write-Host "Semana atual ($weekStart -> $weekEnd): $weekPoints pontos" -ForegroundColor Cyan
Write-Host "Lives: $($lives.Count) | Horas total: $liveHours | Média views: {0:N1}" -f $liveAvgViews
Write-Host "Top categorias recentes:" -ForegroundColor Yellow
$byType | Format-Table -AutoSize
