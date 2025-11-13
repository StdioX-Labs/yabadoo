# 🚀 Deployment Guide for Yaba Music Website

## Prerequisites

1. **Git LFS** - For handling large audio files
2. **GitHub Account**
3. **Netlify Account**
4. **Node.js 20+** and **pnpm**

---

## 📦 Step 1: Install Git LFS

### Windows (PowerShell)
```powershell
# Using Chocolatey
choco install git-lfs

# Or download from: https://git-lfs.github.com/
```

### Mac
```bash
brew install git-lfs
```

### Linux
```bash
sudo apt-get install git-lfs
```

### Initialize Git LFS
```bash
git lfs install
```

---

## 🎵 Step 2: Set Up Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit (Git LFS will automatically handle .wav files)
git commit -m "Initial commit with music tracks"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/yabadoo.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy to Netlify

### Option A: Via Netlify Dashboard (Recommended)

1. **Go to [Netlify](https://app.netlify.com/)**
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize
4. Choose your **yabadoo** repository
5. Configure build settings:
   - **Build command:** `pnpm build`
   - **Publish directory:** `.next`
   - **Base directory:** (leave empty)
6. Click **"Deploy site"**

### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify project
netlify init

# Deploy
netlify deploy --prod
```

---

## ⚙️ Important Netlify Configuration

### Install Next.js Plugin
The `netlify.toml` file already includes the Next.js plugin configuration. Netlify will automatically detect and install it.

### Environment Variables (if needed)
In Netlify Dashboard → Site settings → Environment variables, add:
```
NODE_VERSION=20
NEXT_TELEMETRY_DISABLED=1
```

---

## 🎵 Git LFS Considerations

### File Size Limits
- **GitHub:** Free accounts get 1GB storage + 1GB bandwidth/month
- **GitHub Pro:** 2GB storage + 2GB bandwidth/month
- **Netlify:** Includes Git LFS support automatically

### Your Music Files
```
v1 Yaba - Adhiambo.wav
v1 Yaba - Mazoea 2.wav
v1 Yaba - Sema 2.wav
v1 Yaba - Something Sweet 2.wav
v1 Yaba - Today.wav
v1 Yaba - Wape Wape.wav
```

### Check File Sizes
```bash
# Check total size of music files
Get-ChildItem public\music -Recurse | Measure-Object -Property Length -Sum
```

### Alternative: Convert to MP3
If files are too large, consider converting to MP3 for web delivery:
```bash
# Install ffmpeg (Windows)
choco install ffmpeg

# Convert WAV to MP3 (high quality, smaller size)
ffmpeg -i "public/music/v1 Yaba - Adhiambo.wav" -codec:a libmp3lame -b:a 320k "public/music/v1 Yaba - Adhiambo.mp3"
```

---

## 📊 Git LFS Commands

```bash
# Track which files are in LFS
git lfs ls-files

# Check LFS status
git lfs status

# Migrate existing files to LFS
git lfs migrate import --include="*.wav" --everything

# Pull LFS files
git lfs pull
```

---

## 🔧 Troubleshooting

### If Git LFS files don't upload to Netlify:
1. Ensure Git LFS is installed: `git lfs version`
2. Check `.gitattributes` is committed
3. Verify files are tracked: `git lfs ls-files`
4. Re-commit if needed:
   ```bash
   git rm --cached public/music/*.wav
   git add public/music/*.wav
   git commit -m "Re-add music files with LFS"
   git push
   ```

### If build fails on Netlify:
1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Clear cache and retry deploy
4. Check Node version matches (20+)

### Large Bundle Size Warning:
Next.js may warn about large pages. This is normal for audio files. Consider:
- Using dynamic imports for the music player
- Lazy loading audio files
- Serving from a CDN (future enhancement)

---

## 🎯 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Music previews work (30-second limit)
- [ ] Payment forms display properly
- [ ] Mobile responsiveness verified
- [ ] Coffee button appears and works
- [ ] All images load
- [ ] Navigation functions correctly

---

## 🔄 Future Updates

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push

# Netlify will automatically rebuild and deploy
```

---

## 💡 Tips

1. **Custom Domain:** Add via Netlify Dashboard → Domain settings
2. **SSL Certificate:** Automatically provided by Netlify
3. **Form Handling:** Use Netlify Forms (already configured)
4. **Analytics:** Enable Netlify Analytics for visitor insights
5. **Performance:** Use Netlify's CDN for faster global delivery

---

## 📞 Support

- **Netlify Docs:** https://docs.netlify.com/
- **Git LFS Docs:** https://git-lfs.github.com/
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

**Your site will be live at:** `https://your-site-name.netlify.app`

You can customize the subdomain or add a custom domain in Netlify settings!
