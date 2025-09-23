# Documentation Index

Welcome to the Yuki Yaki Corner documentation! This folder contains comprehensive documentation for the project.

## 📚 Documentation Overview

### Project Information

- **[Project Details](#project-details)** - Complete project description and features
- **[ROADMAP.md](./ROADMAP.md)** - Development roadmap and future plans
- **[DESIGN-ROADMAP.md](./DESIGN-ROADMAP.md)** - Design system and UX roadmap

### Deployment & Setup Guides

- **[DEPLOY-GUIDE-EN.md](./DEPLOY-GUIDE-EN.md)** - English deployment guide for Netlify
- **[PANDUAN-DEPLOY-NETLIFY.md](./PANDUAN-DEPLOY-NETLIFY.md)** - Panduan deploy ke Netlify (Indonesian)
- **[PANDUAN-COOLIFY-FIX.md](./PANDUAN-COOLIFY-FIX.md)** - Panduan troubleshooting Coolify
- **[PANDUAN-UPDATE-EFISIEN.md](./PANDUAN-UPDATE-EFISIEN.md)** - Panduan update yang efisien

---

## Project Details

### Yuki Yaki Corner – Studio Foto F&B

Web app untuk mengubah 1 foto makanan menjadi transparan dan meningkatkan kualitas foto sesuai brand Yuki Yaki Corner. Hasil siap untuk GoFood, GrabFood, dan ShopeeFood.

### 🚀 Fitur Utama

- Upload gambar, auto hapus background putih/terang (heuristik), ekspor PNG transparan
- Preset enhancement khusus F&B (brightness, saturation, sharpen)
- Admin panel: atur API key Gemini dan GitHub Models, serta opsi provider background
- Brand theme: warna, tipografi sesuai panduan
- Fondasi untuk AI copywriting (judul/desk produk) via Gemini/GitHub Models (stub)

### 📋 Prasyarat

- Node.js 18+ dan npm/pnpm

### ⚙️ Konfigurasi

Buat file `.env.local` berdasarkan `.env.example`.

### 🛠️ Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 📦 Deployment

See deployment guides in this docs folder:

- **[DEPLOY-GUIDE-EN.md](./DEPLOY-GUIDE-EN.md)** - English deployment guide for Netlify
- **[PANDUAN-DEPLOY-NETLIFY.md](./PANDUAN-DEPLOY-NETLIFY.md)** - Panduan deploy ke Netlify (Indonesian)
- **[PANDUAN-COOLIFY-FIX.md](./PANDUAN-COOLIFY-FIX.md)** - Troubleshooting guide for Coolify

#### Other Platforms

- **Vercel**: `npm i -g vercel && vercel`
- **Railway**: Connect GitHub repository
- **Heroku**: Add buildpack dan Procfile

### 🗺️ Roadmap & Future Development

See detailed roadmaps:

- **[ROADMAP.md](./ROADMAP.md)** - Comprehensive development roadmap
- **[DESIGN-ROADMAP.md](./DESIGN-ROADMAP.md)** - Design system and UX roadmap
- **[PANDUAN-UPDATE-EFISIEN.md](./PANDUAN-UPDATE-EFISIEN.md)** - Efficient update guide

#### Development Phases

- **Fase 1**: Core Enhancement (AI integration, analytics, user management)
- **Fase 2**: Business Features (multi-tenant, automations, mobile apps)
- **Fase 3**: Scale & Innovation (advanced AI, platform expansion, emerging tech)

### 🛡️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **AI Integration**: Gemini & GitHub Models
- **Image Processing**: Sharp

### 📝 Notes

- Penghapusan background menggunakan pendekatan heuristik (chroma key putih). Untuk kualitas studio, integrasikan layanan khusus background removal (mis. rembg/segmentation ML) — sudah disiapkan provider flag `imageBgProvider`.
- Logo pada `public/logo.svg` adalah placeholder.

### 🤝 Contributing

Roadmap ini terbuka untuk kontribusi! Silakan buat GitHub Issue atau Pull Request untuk:

- Feature requests
- Bug reports
- Performance improvements
- Documentation updates

### 📄 License

Proprietary – internal Yuki Yaki Corner.
