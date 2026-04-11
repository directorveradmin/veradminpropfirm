param(
  [string]C:\Users\emb95\Documents\veradminpropfirm\scaffold = (Get-Location).Path,
  [string] = 'http://localhost:3000',
  [switch]
)

Stop = 'Stop'

function Join-RepoPath {
  param([string])
  return [System.IO.Path]::Combine(C:\Users\emb95\Documents\veradminpropfirm\scaffold, )
}

function Assert-Exists {
  param([string])
   = Join-RepoPath 
  if (-not (Test-Path -LiteralPath )) {
    throw "Missing required file: "
  }
  Write-Host "[ok] " -ForegroundColor Green
}

 = @(
  'src\lib\services\workspaceData.ts',
  'src\lib\ui\appShell.tsx',
  'src\lib\ui\surface.tsx',
  'src\app\page.tsx',
  'src\app\(shell)\layout.tsx',
  'src\app\accounts\page.tsx',
  'src\app\accounts\[id]\page.tsx',
  'src\app\journal\page.tsx',
  'src\app\alerts\page.tsx',
  'src\app\payouts\page.tsx',
  'src\app\calendar\page.tsx',
  'src\app\(shell)\settings\page.tsx',
  'src\app\(shell)\backups\page.tsx',
  'docs\65-all-in-one-surface-wiring.md'
)

Write-Host 'Verifying all-in-one surface wiring under:' C:\Users\emb95\Documents\veradminpropfirm\scaffold -ForegroundColor Cyan
foreach ( in ) {
  Assert-Exists 
}

Push-Location C:\Users\emb95\Documents\veradminpropfirm\scaffold
try {
  Write-Host 'Running pnpm typecheck...' -ForegroundColor Cyan
  pnpm typecheck
  if ( -ne 0) { throw 'pnpm typecheck failed.' }

  Write-Host 'Running pnpm test...' -ForegroundColor Cyan
  pnpm test
  if ( -ne 0) { throw 'pnpm test failed.' }
}
finally {
  Pop-Location
}

if () {
   = @('/', '/accounts', '/accounts/A1', '/journal', '/alerts', '/payouts', '/calendar', '/settings', '/backups', '/reports', '/simulation')
  foreach ( in ) {
    try {
       = Invoke-WebRequest -Uri (.TrimEnd('/') + ) -UseBasicParsing -Method GET -TimeoutSec 10
      Write-Host "[http ] " -ForegroundColor Green
    } catch {
      Write-Host "[http fail]  :: " -ForegroundColor Yellow
    }
  }
}

Write-Host ''
Write-Host 'All-in-one surface wiring verification completed.' -ForegroundColor Green