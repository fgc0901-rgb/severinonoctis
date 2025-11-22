Param(
    [string]$Domain = "bobbunitinho.com",
    [string[]]$Servers = @("1.1.1.1","8.8.8.8","9.9.9.9","208.67.222.222")
)

Function Test-Domain {
    Param(
        [string]$Domain,
        [string]$Server
    )
    $a = Resolve-DnsName -Name $Domain -Type A -Server $Server -ErrorAction SilentlyContinue
    $aaaa = Resolve-DnsName -Name $Domain -Type AAAA -Server $Server -ErrorAction SilentlyContinue

    $rdapContent = $null
    try {
        $rdapResponse = Invoke-WebRequest -Uri "https://rdap.org/domain/$Domain" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        if ($rdapResponse.StatusCode -ge 200 -and $rdapResponse.StatusCode -lt 300) {
            $rdapContent = $rdapResponse.Content
        }
    } catch {}

    [pscustomobject]@{
        Domain      = $Domain
        Server      = $Server
        ARecords    = ($a | Select-Object -ExpandProperty IPAddress -ErrorAction SilentlyContinue) -join ", "
        AAAARecords = ($aaaa | Select-Object -ExpandProperty IPAddress -ErrorAction SilentlyContinue) -join ", "
        RDAPFound   = [bool]$rdapContent
    }
}

Write-Host "Checking DNS resolution for $Domain..." -ForegroundColor Cyan
$results = foreach($s in $Servers){ Test-Domain -Domain $Domain -Server $s }
$results | Format-Table -AutoSize

$anyA = $results.ARecords | Where-Object { $_ -and $_.Length -gt 0 }
if(-not $anyA){
    Write-Host "No A records returned from public resolvers." -ForegroundColor Yellow
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host " 1. Domain not registered or expired" -ForegroundColor Yellow
    Write-Host " 2. Nameservers not set at registrar" -ForegroundColor Yellow
    Write-Host " 3. Zone exists but missing A records" -ForegroundColor Yellow
    Write-Host " 4. Propagation window (wait up to a few hours)" -ForegroundColor Yellow
    Write-Host " 5. DNSSEC misconfiguration (if enabled)" -ForegroundColor Yellow
}

if(-not ($results.RDAPFound | Where-Object { $_ })) {
    Write-Host "RDAP did not return data. Domain may not be registered." -ForegroundColor Red
    Write-Host "Verify at registrar or use external WHOIS web tool." -ForegroundColor Red
}

Write-Host "\nNext steps suggestions:" -ForegroundColor Cyan
Write-Host " - WHOIS/RDAP check for registration status" -ForegroundColor Cyan
Write-Host " - Confirm nameservers at registrar" -ForegroundColor Cyan
Write-Host " - Add A records (GitHub Pages: 185.199.108.153-111.153)" -ForegroundColor Cyan
Write-Host " - Add AAAA records (optional)" -ForegroundColor Cyan
