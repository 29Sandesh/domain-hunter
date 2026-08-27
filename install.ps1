# Domen by Codehtml — 1-Command Windows Installer
Write-Host "`n🚀 Installing Domen by Codehtml..." -ForegroundColor Cyan

$targetFolder = "domen"

if (Test-Path $targetFolder) {
    Write-Host "Folder '$targetFolder' already exists. Navigating inside..." -ForegroundColor Yellow
} else {
    Write-Host "📦 Cloning repository..." -ForegroundColor Gray
    git clone https://github.com/29Sandesh/domain-hunter.git $targetFolder
}

Set-Location $targetFolder

Write-Host "⚡ Installing dependencies..." -ForegroundColor Gray
npm install

Write-Host "`n✨ Launching Domen at http://localhost:3000..." -ForegroundColor Green
npm run dev
