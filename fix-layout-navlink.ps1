# fix-layout-navlink.ps1
# Fixes: event handlers in Server Component (layout.tsx)
# Solution: extract NavLink into its own 'use client' component

$root = "C:\Users\emb95\Documents\veradminpropfirm\scaffold"
$errors = @()

function Write-B64File {
    param([string]$RelPath, [string]$B64Content)
    $fullPath = Join-Path $root $RelPath
    $dir = Split-Path $fullPath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    try {
        $bytes = [System.Convert]::FromBase64String($B64Content)
        [System.IO.File]::WriteAllBytes($fullPath, $bytes)
        Write-Host "  OK  $RelPath" -ForegroundColor Green
    } catch {
        Write-Host "  FAIL $RelPath -- $_" -ForegroundColor Red
        $script:errors += $RelPath
    }
}

Write-Host "Writing src/app/components/NavLink.tsx..." -ForegroundColor Cyan
Write-B64File "src/app/components/NavLink.tsx" (
    'J3VzZSBjbGllbnQnOwppbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnOwoKZXhwb3J0IGZ1bmN0aW9u' +
    'IE5hdkxpbmsoeyBocmVmLCBsYWJlbCwgaWNvbiB9OiB7IGhyZWY6IHN0cmluZzsgbGFiZWw6IHN0' +
    'cmluZzsgaWNvbjogc3RyaW5nIH0pIHsKICAgIHJldHVybiAoCiAgICAgICAgPGEgaHJlZj17aHJl' +
    'Zn0gc3R5bGU9e3sKICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2Vu' +
    'dGVyJywgZ2FwOiAnMC42cmVtJywKICAgICAgICAgICAgcGFkZGluZzogJzAuNXJlbSAwLjc1cmVt' +
    'JywgYm9yZGVyUmFkaXVzOiAnMC4zNzVyZW0nLAogICAgICAgICAgICBjb2xvcjogJyNjYmQ1ZTEn' +
    'LCB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLCBmb250U2l6ZTogJzAuOXJlbScsCiAgICAgICAgfX0K' +
    'ICAgICAgICAgICAgb25Nb3VzZU92ZXI9e2UgPT4gKGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNr' +
    'Z3JvdW5kID0gJyMzMzQxNTUnKX0KICAgICAgICAgICAgb25Nb3VzZU91dD17ZSA9PiAoZS5jdXJy' +
    'ZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnKX0KICAgICAgICA+CiAg' +
    'ICAgICAgICAgIDxzcGFuPntpY29ufTwvc3Bhbj57bGFiZWx9CiAgICAgICAgPC9hPgogICAgKTsK' +
    'fQo='
)

Write-Host "Writing src/app/layout.tsx..." -ForegroundColor Cyan
Write-B64File "src/app/layout.tsx" (
    'aW1wb3J0IHR5cGUgeyBNZXRhZGF0YSB9IGZyb20gJ25leHQnOwppbXBvcnQgJy4vZ2xvYmFscy5j' +
    'c3MnOwppbXBvcnQgeyBOYXZMaW5rIH0gZnJvbSAnLi9jb21wb25lbnRzL05hdkxpbmsnOwoKZXhw' +
    'b3J0IGNvbnN0IG1ldGFkYXRhOiBNZXRhZGF0YSA9IHsKICAgIHRpdGxlOiAnVmVyYWRtaW4nLAog' +
    'ICAgZGVzY3JpcHRpb246ICdQcm9wIGZpcm0gYWRtaW4gc2NhZmZvbGQnLAp9OwoKZXhwb3J0IGRl' +
    'ZmF1bHQgZnVuY3Rpb24gUm9vdExheW91dCh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0' +
    'LlJlYWN0Tm9kZSB9KSB7CiAgICByZXR1cm4gKAogICAgICAgIDxodG1sIGxhbmc9ImVuIj4KICAg' +
    'ICAgICAgICAgPGJvZHkgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250RmFtaWx5OiAnc3lzdGVtLXVp' +
    'LCBzYW5zLXNlcmlmJywgZGlzcGxheTogJ2ZsZXgnLCBtaW5IZWlnaHQ6ICcxMDB2aCcgfX0+CiAg' +
    'ICAgICAgICAgICAgICA8bmF2IHN0eWxlPXt7CiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcy' +
    'MDBweCcsIG1pbkhlaWdodDogJzEwMHZoJywgYmFja2dyb3VuZDogJyMxZTI5M2InLAogICAgICAg' +
    'ICAgICAgICAgICAgIGNvbG9yOiAnI2YxZjVmOScsIHBhZGRpbmc6ICcxLjVyZW0gMXJlbScsIGZs' +
    'ZXhTaHJpbms6IDAsCiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGly' +
    'ZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMC4yNXJlbScsCiAgICAgICAgICAgICAgICB9fT4KICAg' +
    'ICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDcwMCwgZm9udFNpemU6' +
    'ICcxLjFyZW0nLCBtYXJnaW5Cb3R0b206ICcxLjVyZW0nLCBjb2xvcjogJyMzOGJkZjgnIH19Pgog' +
    'ICAgICAgICAgICAgICAgICAgICAgICBWZXJhZG1pbgogICAgICAgICAgICAgICAgICAgIDwvZGl2' +
    'PgogICAgICAgICAgICAgICAgICAgIDxOYXZMaW5rIGhyZWY9Ii9zY3JlZW5zL0FjY291bnREZXRh' +
    'aWxTY3JlZW4iIGxhYmVsPSJBY2NvdW50cyIgaWNvbj0i8J+PpiIgLz4KICAgICAgICAgICAgICAg' +
    'ICAgICA8TmF2TGluayBocmVmPSIvc2NyZWVucy9Kb3VybmFsU2NyZWVuIiBsYWJlbD0iSm91cm5h' +
    'bCIgaWNvbj0i8J+TkyIgLz4KICAgICAgICAgICAgICAgICAgICA8TmF2TGluayBocmVmPSIvc2Ny' +
    'ZWVucy9QYXlvdXRzU2NyZWVuIiBsYWJlbD0iUGF5b3V0cyIgaWNvbj0i8J+SuCIgLz4KICAgICAg' +
    'ICAgICAgICAgICAgICA8TmF2TGluayBocmVmPSIvc2NyZWVucy9BbGVydHNTY3JlZW4iIGxhYmVs' +
    'PSJBbGVydHMiIGljb249IvCflJQiIC8+CiAgICAgICAgICAgICAgICAgICAgPE5hdkxpbmsgaHJl' +
    'Zj0iL3NjcmVlbnMvQ2FsZW5kYXJSb3RhdGlvblNjcmVlbiIgbGFiZWw9IkNhbGVuZGFyIiBpY29u' +
    'PSLwn5OFIiAvPgogICAgICAgICAgICAgICAgPC9uYXY+CiAgICAgICAgICAgICAgICA8bWFpbiBz' +
    'dHlsZT17eyBmbGV4OiAxLCBvdmVyZmxvd1k6ICdhdXRvJyB9fT4KICAgICAgICAgICAgICAgICAg' +
    'ICB7Y2hpbGRyZW59CiAgICAgICAgICAgICAgICA8L21haW4+CiAgICAgICAgICAgIDwvYm9keT4K' +
    'ICAgICAgICA8L2h0bWw+CiAgICApOwp9Cg=='
)

Write-Host ""
if ($errors.Count -eq 0) {
    Write-Host "Done. layout.tsx and NavLink.tsx updated." -ForegroundColor Green
    Write-Host "Refresh your browser." -ForegroundColor White
} else {
    Write-Host "$($errors.Count) file(s) failed." -ForegroundColor Red
}