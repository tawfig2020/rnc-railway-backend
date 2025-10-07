# Build Status Checker
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Build Status Diagnostic" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd client

Write-Host "Checking build folder..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path build) {
    Write-Host "✅ build folder exists" -ForegroundColor Green
    Write-Host ""
    
    # Check index.html
    if (Test-Path build\index.html) {
        Write-Host "✅ index.html EXISTS" -ForegroundColor Green
        $size = (Get-Item build\index.html).Length
        Write-Host "   Size: $size bytes" -ForegroundColor Cyan
        Write-Host "   This is GOOD! ✓" -ForegroundColor Green
    } else {
        Write-Host "❌ index.html MISSING!" -ForegroundColor Red
        Write-Host "   This is WHY you're getting 404 errors!" -ForegroundColor Yellow
        Write-Host "   Solution: Run a clean build" -ForegroundColor Yellow
    }
    Write-Host ""
    
    # Check _redirects
    if (Test-Path build\_redirects) {
        Write-Host "✅ _redirects exists" -ForegroundColor Green
    } else {
        Write-Host "⚠️  _redirects missing (needed for routing)" -ForegroundColor Yellow
    }
    Write-Host ""
    
    # Check static folder
    if (Test-Path build\static) {
        Write-Host "✅ static folder exists" -ForegroundColor Green
        
        if (Test-Path build\static\js) {
            $jsFiles = (Get-ChildItem build\static\js -Filter *.js).Count
            Write-Host "   JavaScript files: $jsFiles" -ForegroundColor Cyan
        }
        
        if (Test-Path build\static\css) {
            $cssFiles = (Get-ChildItem build\static\css -Filter *.css).Count
            Write-Host "   CSS files: $cssFiles" -ForegroundColor Cyan
        }
    } else {
        Write-Host "❌ static folder MISSING!" -ForegroundColor Red
    }
    Write-Host ""
    
    Write-Host "Build folder contents:" -ForegroundColor Cyan
    Write-Host "======================" -ForegroundColor Cyan
    dir build | Select-Object Mode, Length, Name | Format-Table -AutoSize
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    
    if (Test-Path build\index.html) {
        Write-Host "  ✅ BUILD IS VALID" -ForegroundColor Green
        Write-Host "  Ready to upload to Netlify!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Upload this folder to Netlify:" -ForegroundColor Yellow
        Write-Host "  $(Get-Location)\build" -ForegroundColor Cyan
    } else {
        Write-Host "  ❌ BUILD IS INVALID" -ForegroundColor Red
        Write-Host "  Cannot deploy - missing index.html" -ForegroundColor Red
        Write-Host ""
        Write-Host "Run this to fix:" -ForegroundColor Yellow
        Write-Host '  Remove-Item -Recurse -Force build' -ForegroundColor Cyan
        Write-Host '  npm run build' -ForegroundColor Cyan
    }
    
    Write-Host "========================================" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ build folder doesn't exist!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Run this to create it:" -ForegroundColor Yellow
    Write-Host '  npm run build' -ForegroundColor Cyan
    Write-Host ""
}
