# 🎵 YABA - Prince of Rhumbacane

Official website for Yaba, a Kenyan Rhumba artist. Experience authentic Kenyan Rhumba music with modern web technology.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎧 **30-Second Music Previews** - Listen before you buy
- 💿 **WAPE WAPE EP** - Complete 6-track album showcase
- 🛒 **Integrated Checkout** - M-Pesa and Card payments
- ☕ **Buy Me a Coffee** - Support the artist with custom donations
- 📱 **Fully Responsive** - Beautiful on all devices
- 🎨 **Modern UI/UX** - Glassmorphism and smooth animations
- 🎯 **Optimized Performance** - Fast loading with Next.js 15

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/yabadoo.git
cd yabadoo

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## 📁 Project Structure

```
yabadoo/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page
│   │   ├── checkout/         # EP checkout page
│   │   ├── coffee/           # Coffee donation page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   └── components/
│       ├── MusicPlayer.tsx   # Audio player with 30s preview
│       └── BuyMeCoffeeButton.tsx
├── public/
│   ├── music/                # Audio files (*.wav)
│   └── images/               # Images and logos
├── netlify.toml              # Netlify configuration
└── .gitattributes            # Git LFS configuration
```

## 🎵 Music Files

This project uses **Git LFS** to handle large audio files efficiently.

### Setting up Git LFS

```bash
# Install Git LFS
# Windows (Chocolatey)
choco install git-lfs

# Mac
brew install git-lfs

# Linux
sudo apt-get install git-lfs

# Initialize Git LFS
git lfs install
```

The `.gitattributes` file is already configured to track `.wav` files.

## 🌐 Deployment

### Deploy to Netlify

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**

1. Push to GitHub
2. Connect repository to Netlify
3. Netlify will automatically build and deploy

The `netlify.toml` configuration is already set up for optimal performance.

### Quick Setup Script

Run the automated setup:

```powershell
.\setup-deployment.ps1
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Fonts:** Playfair Display, Inter
- **Deployment:** Netlify
- **Version Control:** Git with Git LFS
- **Package Manager:** pnpm

## 📦 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🎨 Color Palette

- **Background:** `#1A2421` (Dark green-black)
- **Primary:** `#708238` (Olive green)
- **Secondary:** `#3F704D` (Forest green)
- **Accent:** `#F0FFF0` (Honeydew)

## 🎯 Key Features Breakdown

### Music Player
- 30-second preview limit
- Auto-pause after preview
- Purchase modal on preview end
- Progress bar with shimmer effect
- Mobile-optimized controls

### Checkout Pages
- **EP Checkout:** Fixed price (KES 1,000)
- **Coffee Page:** Dynamic amount selection
- M-Pesa and Card payment options
- Form validation
- Responsive design

### Performance Optimizations
- Next.js Image optimization
- Audio lazy loading
- Git LFS for large files
- CDN delivery via Netlify
- Tailwind CSS tree-shaking

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ by the STDIOX Labs team

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**© 2025 YABA. All rights reserved.**
