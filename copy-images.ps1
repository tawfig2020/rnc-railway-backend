# PowerShell script to help copy images to the correct locations
# Run this script from the project root directory

Write-Host "=== RNC Activities Album Image Setup ===" -ForegroundColor Green
Write-Host ""

# Define target directories
$bakingDir = "client\public\assets\activities\baking"
$artDir = "client\public\assets\activities\art"

Write-Host "Target directories:" -ForegroundColor Yellow
Write-Host "Baking: $bakingDir"
Write-Host "Art: $artDir"
Write-Host ""

# Check if directories exist
if (Test-Path $bakingDir) {
    Write-Host "✓ Baking directory exists" -ForegroundColor Green
} else {
    Write-Host "✗ Baking directory not found" -ForegroundColor Red
}

if (Test-Path $artDir) {
    Write-Host "✓ Art directory exists" -ForegroundColor Green
} else {
    Write-Host "✗ Art directory not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Files to Replace ===" -ForegroundColor Yellow
Write-Host ""

Write-Host "BAKING IMAGES (3 files):" -ForegroundColor Cyan
Write-Host "1. Replace: $bakingDir\baking-class-instructor.jpg"
Write-Host "   With: Your Image 1 (baking class with instructor)"
Write-Host ""
Write-Host "2. Replace: $bakingDir\baking-community-kitchen.jpg"
Write-Host "   With: Your Image 2 (baking collage)"
Write-Host ""
Write-Host "3. Replace: $bakingDir\baking-final-products.jpg"
Write-Host "   With: Your Image 3 (person with cookies)"
Write-Host ""

Write-Host "ART IMAGES (2 files):" -ForegroundColor Cyan
Write-Host "4. Replace: $artDir\art-individual-work.jpg"
Write-Host "   With: Your Image 4 (person drawing)"
Write-Host ""
Write-Host "5. Replace: $artDir\art-collaborative-session.jpg"
Write-Host "   With: Your Image 5 (group art session)"
Write-Host ""

Write-Host "=== Instructions ===" -ForegroundColor Yellow
Write-Host "1. Copy your images to the locations shown above"
Write-Host "2. Make sure to use the EXACT filenames"
Write-Host "3. Refresh your browser after copying"
Write-Host ""

# Option to open directories
$openDirs = Read-Host "Would you like to open the target directories? (y/n)"
if ($openDirs -eq 'y' -or $openDirs -eq 'Y') {
    if (Test-Path $bakingDir) {
        Invoke-Item $bakingDir
        Write-Host "Opened baking directory" -ForegroundColor Green
    }
    if (Test-Path $artDir) {
        Invoke-Item $artDir
        Write-Host "Opened art directory" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Script completed!" -ForegroundColor Green
