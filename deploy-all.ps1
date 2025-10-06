# Complete Deployment Script
# Deploys Backend to Railway and Frontend Build to Netlify

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RNC Platform - Complete Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Get-Location

# Step 1: Install i18next dependencies
Write-Host "Step 1: Installing i18next dependencies..." -ForegroundColor Yellow
cd client

$i18nextInstalled = Test-Path "node_modules/i18next"
if (-not $i18nextInstalled) {
    Write-Host "Installing i18next, react-i18next, and language detector..." -ForegroundColor Yellow
    npm install i18next react-i18next i18next-browser-languagedetector
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Installation failed!" -ForegroundColor Red
        cd $projectRoot
        exit 1
    }
    Write-Host "✓ i18next installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✓ i18next already installed" -ForegroundColor Green
}

Write-Host ""

# Step 2: Build Frontend
Write-Host "Step 2: Building frontend for production..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    cd $projectRoot
    exit 1
}

Write-Host "✓ Frontend build completed successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Commit and Push Frontend
Write-Host "Step 3: Deploying frontend to GitHub..." -ForegroundColor Yellow

# Check if there are changes
$frontendChanges = git status --porcelain

if ($frontendChanges) {
    Write-Host "Staging frontend changes..." -ForegroundColor Gray
    
    # Stage all frontend changes
    git add src/
    git add build/
    git add public/
    git add package.json
    git add package-lock.json
    
    Write-Host "Committing frontend changes..." -ForegroundColor Gray
    git commit -m "Deploy: Frontend updates - Multi-language support, About page redesign, UI enhancements

- Added i18next for multi-language support (6 languages)
- Redesigned About page with flip cards and animations
- Updated terminology (Refugee → Member)
- Enhanced admin components
- Built production bundle"
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Gray
    git push origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend deployed to GitHub!" -ForegroundColor Green
        Write-Host "  Netlify will auto-build in ~3-5 minutes" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Frontend push failed!" -ForegroundColor Red
        cd $projectRoot
        exit 1
    }
} else {
    Write-Host "✓ No frontend changes to deploy" -ForegroundColor Green
}

Write-Host ""

# Step 4: Deploy Backend
cd $projectRoot
cd railway-backend-only

Write-Host "Step 4: Deploying backend to Railway..." -ForegroundColor Yellow

# Check if there are changes
$backendChanges = git status --porcelain

if ($backendChanges) {
    Write-Host "Staging backend changes..." -ForegroundColor Gray
    
    # Stage backend changes
    git add models/
    git add routes/
    git add config/
    
    Write-Host "Committing backend changes..." -ForegroundColor Gray
    git commit -m "Deploy: Backend updates - Terminology fix, Course & Community Projects improvements

- Updated User model (Refugee → Member)
- Fixed Course creation validation
- Enhanced Community Projects API
- Added admin management fields
- Improved error handling"
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Gray
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Backend deployed to GitHub!" -ForegroundColor Green
        Write-Host "  Railway will auto-deploy in ~2-3 minutes" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Backend push failed!" -ForegroundColor Red
        cd $projectRoot
        exit 1
    }
} else {
    Write-Host "✓ No backend changes to deploy" -ForegroundColor Green
}

Write-Host ""

# Step 5: Deploy Main Repository (if needed)
cd $projectRoot

Write-Host "Step 5: Updating main repository..." -ForegroundColor Yellow

$mainChanges = git status --porcelain

if ($mainChanges) {
    Write-Host "Staging documentation and scripts..." -ForegroundColor Gray
    
    # Stage documentation and scripts
    git add *.md
    git add *.ps1
    git add scripts/
    
    Write-Host "Committing changes..." -ForegroundColor Gray
    git commit -m "Docs: Complete implementation guides and deployment scripts

- Added comprehensive documentation
- Created deployment scripts
- Added migration scripts
- Updated all guides"
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Gray
    git push origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Main repository updated!" -ForegroundColor Green
    } else {
        Write-Host "⚠ Main repository push failed (non-critical)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ No main repository changes" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Frontend: Deployed to GitHub" -ForegroundColor Green
Write-Host "  → Netlify will build automatically" -ForegroundColor White
Write-Host "  → Check: https://app.netlify.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Backend: Deployed to GitHub" -ForegroundColor Green
Write-Host "  → Railway will deploy automatically" -ForegroundColor White
Write-Host "  → Check: https://railway.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Wait 5-10 minutes for deployments" -ForegroundColor White
Write-Host "  2. Check Netlify build logs" -ForegroundColor White
Write-Host "  3. Check Railway deployment logs" -ForegroundColor White
Write-Host "  4. Test your live site" -ForegroundColor White
Write-Host "  5. Run database migration if not done:" -ForegroundColor White
Write-Host "     node scripts/migrate-refugee-to-member.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
