# 🚀 Quick Setup Script for Deployment

Write-Host "🎵 Yaba Music - GitHub & Netlify Deployment Setup" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Check if Git is installed
Write-Host "1️⃣  Checking Git installation..." -ForegroundColor Yellow
if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion`n" -ForegroundColor Green
} else {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check if Git LFS is installed
Write-Host "2️⃣  Checking Git LFS installation..." -ForegroundColor Yellow
if (Get-Command git-lfs -ErrorAction SilentlyContinue) {
    $lfsVersion = git lfs version
    Write-Host "✅ Git LFS is installed: $lfsVersion`n" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git LFS is not installed." -ForegroundColor Yellow
    Write-Host "   Installing Git LFS is recommended for large music files.`n" -ForegroundColor Yellow
    
    $installLFS = Read-Host "   Do you want to install Git LFS now? (y/n)"
    if ($installLFS -eq 'y') {
        if (Get-Command choco -ErrorAction SilentlyContinue) {
            Write-Host "   Installing via Chocolatey..." -ForegroundColor Cyan
            choco install git-lfs -y
        } else {
            Write-Host "   Please install Git LFS manually from: https://git-lfs.github.com/" -ForegroundColor Yellow
            Write-Host "   Then run this script again.`n" -ForegroundColor Yellow
            exit 1
        }
    }
}

# Initialize Git LFS
Write-Host "3️⃣  Initializing Git LFS..." -ForegroundColor Yellow
git lfs install
Write-Host "✅ Git LFS initialized`n" -ForegroundColor Green

# Check music file sizes
Write-Host "4️⃣  Checking music file sizes..." -ForegroundColor Yellow
$musicFiles = Get-ChildItem -Path "public\music" -Filter "*.wav" -ErrorAction SilentlyContinue
if ($musicFiles) {
    $totalSize = ($musicFiles | Measure-Object -Property Length -Sum).Sum
    $totalSizeMB = [math]::Round($totalSize / 1MB, 2)
    Write-Host "   Found $($musicFiles.Count) WAV files" -ForegroundColor Cyan
    Write-Host "   Total size: $totalSizeMB MB`n" -ForegroundColor Cyan
    
    if ($totalSizeMB -gt 1000) {
        Write-Host "⚠️  WARNING: Music files exceed 1GB" -ForegroundColor Yellow
        Write-Host "   Consider converting to MP3 for smaller file sizes`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "   No WAV files found in public\music`n" -ForegroundColor Yellow
}

# Check if already a git repository
Write-Host "5️⃣  Checking Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "✅ Already a Git repository`n" -ForegroundColor Green
} else {
    Write-Host "   Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Git repository initialized`n" -ForegroundColor Green
}

# Check for remote
Write-Host "6️⃣  Checking remote repository..." -ForegroundColor Yellow
$remotes = git remote
if ($remotes -contains "origin") {
    $originUrl = git remote get-url origin
    Write-Host "✅ Remote 'origin' exists: $originUrl`n" -ForegroundColor Green
} else {
    Write-Host "   No remote repository configured." -ForegroundColor Yellow
    Write-Host "   You'll need to add it manually:`n" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/yabadoo.git`n" -ForegroundColor Cyan
}

# Stage files
Write-Host "7️⃣  Staging files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged`n" -ForegroundColor Green

# Show status
Write-Host "8️⃣  Git status:" -ForegroundColor Yellow
git status --short

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "=============" -ForegroundColor Cyan
Write-Host "1. Create a GitHub repository at: https://github.com/new" -ForegroundColor White
Write-Host "2. Add remote: git remote add origin https://github.com/YOUR_USERNAME/yabadoo.git" -ForegroundColor White
Write-Host "3. Commit: git commit -m 'Initial commit with music tracks'" -ForegroundColor White
Write-Host "4. Push: git push -u origin main" -ForegroundColor White
Write-Host "5. Deploy to Netlify: https://app.netlify.com/" -ForegroundColor White
Write-Host "`n📖 See DEPLOYMENT.md for detailed instructions`n" -ForegroundColor Yellow

Write-Host "✨ Setup complete! Ready to deploy! ✨`n" -ForegroundColor Green
