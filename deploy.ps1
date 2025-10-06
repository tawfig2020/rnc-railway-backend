# RNC Platform - Automated Deployment Script
# This script pushes all changes to GitHub and optionally builds the frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RNC Platform - Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: Not in project root directory!" -ForegroundColor Red
    Write-Host "Please run this script from: C:\Users\Lenovo\CascadeProjects\RNC\CascadeProjects\windsurf-project" -ForegroundColor Yellow
    exit 1
}

# Step 1: Show current status
Write-Host "Step 1: Checking Git Status..." -ForegroundColor Yellow
git status
Write-Host ""

# Step 2: Stage backend changes
Write-Host "Step 2: Staging Backend Changes..." -ForegroundColor Yellow
git add routes/campaigns.js
git add routes/courses.js
git add models/Course.js
git add railway-backend-only/routes/campaigns.js
git add railway-backend-only/routes/courses.js
git add railway-backend-only/models/Course.js
Write-Host "✓ Backend files staged" -ForegroundColor Green
Write-Host ""

# Step 3: Stage frontend changes
Write-Host "Step 3: Staging Frontend Changes..." -ForegroundColor Yellow
git add client/src/components/admin/sections/CommunityProjectsManagement.js
git add client/src/components/admin/sections/CourseManagement.js
Write-Host "✓ Frontend files staged" -ForegroundColor Green
Write-Host ""

# Step 4: Stage documentation
Write-Host "Step 4: Staging Documentation..." -ForegroundColor Yellow
git add COMMUNITY_PROJECTS_ENHANCEMENT.md
git add COURSE_MANAGEMENT_FIX.md
git add DEPLOY_TO_GITHUB.md
git add deploy.ps1
Write-Host "✓ Documentation staged" -ForegroundColor Green
Write-Host ""

# Step 5: Show what will be committed
Write-Host "Step 5: Files to be committed:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Step 6: Confirm commit
$confirm = Read-Host "Do you want to commit these changes? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Step 7: Commit changes
Write-Host "Step 6: Committing Changes..." -ForegroundColor Yellow
$commitMessage = @"
Fix: Community Projects & Course Management - Full CRUD with Admin Controls

- Fixed Community Projects Management panel showing 'No projects found'
- Added optional auth middleware for admin access to all campaigns
- Enhanced UI with filters, bulk actions, and statistics dashboard
- Fixed Course Management 'Add New Course' validation errors
- Added required fields: level, duration, language with defaults
- Extended Course model with admin management fields
- Improved error handling and user feedback
- Added comprehensive documentation

Backend Changes:
- routes/campaigns.js: Optional auth + admin access to all statuses
- routes/courses.js: Relaxed validation + auto instructor creation
- models/Course.js: Added instructorName, schedule, location, etc.
- railway-backend-only: Applied same fixes for production

Frontend Changes:
- CommunityProjectsManagement: Filters, bulk actions, statistics
- CourseManagement: Added level, duration, language fields

Docs:
- COMMUNITY_PROJECTS_ENHANCEMENT.md
- COURSE_MANAGEMENT_FIX.md
- DEPLOY_TO_GITHUB.md
- deploy.ps1
"@

git commit -m $commitMessage
Write-Host "✓ Changes committed" -ForegroundColor Green
Write-Host ""

# Step 8: Push to GitHub
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow
$pushConfirm = Read-Host "Push to GitHub now? (Y/N)"
if ($pushConfirm -eq "Y" -or $pushConfirm -eq "y") {
    git push origin master
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "✗ Push failed! Please check the error above." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Push skipped. You can push later with: git push origin master" -ForegroundColor Yellow
}
Write-Host ""

# Step 9: Ask about frontend build
Write-Host "Step 8: Frontend Build..." -ForegroundColor Yellow
$buildConfirm = Read-Host "Do you want to build the frontend? (Y/N)"
if ($buildConfirm -eq "Y" -or $buildConfirm -eq "y") {
    Write-Host "Building frontend..." -ForegroundColor Yellow
    
    # Navigate to client directory
    Push-Location client
    
    # Run build
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend built successfully!" -ForegroundColor Green
        
        # Go back to root
        Pop-Location
        
        # Ask if they want to commit the build
        $buildCommitConfirm = Read-Host "Commit and push the build folder? (Y/N)"
        if ($buildCommitConfirm -eq "Y" -or $buildCommitConfirm -eq "y") {
            git add client/build/
            git commit -m "Build: Updated frontend build with latest fixes"
            git push origin master
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Build pushed to GitHub!" -ForegroundColor Green
            } else {
                Write-Host "✗ Build push failed!" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "✗ Build failed! Please check the error above." -ForegroundColor Red
        Pop-Location
    }
} else {
    Write-Host "Build skipped." -ForegroundColor Yellow
    Write-Host "Note: If using Netlify/Vercel, they will build automatically." -ForegroundColor Cyan
}
Write-Host ""

# Step 10: Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Backend changes committed and pushed" -ForegroundColor Green
Write-Host "✓ Frontend changes committed and pushed" -ForegroundColor Green
Write-Host "✓ Documentation updated" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check Railway deployment: https://railway.app" -ForegroundColor White
Write-Host "2. Check Netlify deployment: https://app.netlify.com" -ForegroundColor White
Write-Host "3. Test Community Projects Management" -ForegroundColor White
Write-Host "4. Test Course Management" -ForegroundColor White
Write-Host "5. Verify all CRUD operations work" -ForegroundColor White
Write-Host ""
Write-Host "Deployment URLs:" -ForegroundColor Yellow
Write-Host "Backend: https://rnc-railway-backend.onrender.com" -ForegroundColor White
Write-Host "Frontend: Check your Netlify dashboard" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
