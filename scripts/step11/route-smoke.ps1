[CmdletBinding()]
param([string]$BaseUrl = "http://localhost:3000")

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$routes = @("/", "/journal", "/alerts", "/payouts", "/calendar", "/accounts", "/settings", "/backups")
foreach ($route in $routes) {
    $url = $BaseUrl.TrimEnd("/") + $route
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
    if ([int]$response.StatusCode -ne 200) { throw "$route failed with $([int]$response.StatusCode)" }
    Write-Host "$route -> 200" -ForegroundColor Green
}
