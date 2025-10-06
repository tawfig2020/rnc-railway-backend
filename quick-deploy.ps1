# Quick Deploy Script - No Questions Asked
# Builds frontend and pushes everything to GitHub

Write-Host "🚀 Quick Deploy Starting..." -ForegroundColor Cyan
Write-Host ""

$projectRoot = Get-Location

# 1. Install i18next if needed
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
cd client
if (-not (Test-Path "node_modules/i18next")) {
    npm install i18next react-i18next i18next-browser-languagedetector --silent
}

# 2. Build Frontend
Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
npm run build --silent

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# 3. Push Frontend
Write-Host "📤 Pushing frontend..." -ForegroundColor Yellow
git add -A
git commit -m "Deploy: Frontend build with all enhancements" --quiet
git push origin master --quiet

# 4. Push Backend
Write-Host "📤 Pushing backend..." -ForegroundColor Yellow
cd $projectRoot/railway-backend-only
git add -A
git commit -m "Deploy: Backend with all fixes" --quiet
git push origin main --quiet

# 5. Push Main Repo
Write-Host "📤 Updating main repo..." -ForegroundColor Yellow
cd $projectRoot
git add -A
git commit -m "Deploy: Documentation and scripts" --quiet
git push origin master --quiet

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "   Frontend: Netlify will build in ~3-5 min" -ForegroundColor Cyan
Write-Host "   Backend: Railway will deploy in ~2-3 min" -ForegroundColor Cyan
Write-Host ""
