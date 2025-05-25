# ADVisor Deployment Script for Windows PowerShell
# This script helps you deploy the ADVisor application on Windows

Write-Host "🚀 ADVisor Deployment Script" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    
    # Extract major version number
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "❌ Node.js version 18+ is required. Current version: $nodeVersion" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
try {
    npm install
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Blue
try {
    npm run build
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Check if dist folder exists
if (Test-Path "dist") {
    Write-Host ""
    Write-Host "📁 Build output is in the 'dist' folder" -ForegroundColor Green
    
    # Get folder size
    $size = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
    $sizeInMB = [math]::Round($size / 1MB, 2)
    Write-Host "📊 Build size: $sizeInMB MB" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build folder 'dist' not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🌐 Deployment Options:" -ForegroundColor Yellow
Write-Host "1. GitHub Pages: Push to GitHub and enable Pages in repository settings"
Write-Host "2. Netlify: Drag and drop the 'dist' folder to netlify.com"
Write-Host "3. Vercel: Run 'npx vercel' in this directory"
Write-Host "4. Static hosting: Upload the contents of 'dist' folder to your web server"
Write-Host ""
Write-Host "🎉 Deployment preparation complete!" -ForegroundColor Green

# Optional: Open the dist folder
Write-Host "📂 Opening dist folder..." -ForegroundColor Blue
try {
    Invoke-Item "dist"
} catch {
    Write-Host "Could not open dist folder automatically" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Tip: You can preview the build locally by running 'npm run preview'" -ForegroundColor Cyan 