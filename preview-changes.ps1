# Preview Changes Script
# This script helps you preview all changes before deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RNC Platform - Preview Changes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: Not in project root directory!" -ForegroundColor Red
    Write-Host "Please run this script from: C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project" -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Checking if i18next is installed..." -ForegroundColor Yellow
cd client

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if i18next is installed
$i18nextInstalled = Test-Path "node_modules/i18next"
$reactI18nextInstalled = Test-Path "node_modules/react-i18next"

if (-not $i18nextInstalled -or -not $reactI18nextInstalled) {
    Write-Host "Installing i18next dependencies..." -ForegroundColor Yellow
    npm install i18next react-i18next i18next-browser-languagedetector
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ i18next installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "✗ Installation failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ i18next already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Preview Instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The development server will start at:" -ForegroundColor White
Write-Host "  http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "What to test:" -ForegroundColor Yellow
Write-Host "  1. Home Page - Check language switcher" -ForegroundColor White
Write-Host "  2. About Page - Check flip cards and animations" -ForegroundColor White
Write-Host "  3. Login Page - Verify 'Member' option (not 'Refugee')" -ForegroundColor White
Write-Host "  4. Admin Panel - Test Community Projects & Courses" -ForegroundColor White
Write-Host ""
Write-Host "Languages available:" -ForegroundColor Yellow
Write-Host "  🇬🇧 English" -ForegroundColor White
Write-Host "  🇸🇦 Arabic (العربية)" -ForegroundColor White
Write-Host "  🇮🇷 Persian (فارسی)" -ForegroundColor White
Write-Host "  🇫🇷 French (Français)" -ForegroundColor White
Write-Host "  🇲🇲 Burmese (ဗမာ)" -ForegroundColor White
Write-Host "  🇸🇴 Somali" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the development server
npm start
