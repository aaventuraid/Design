# Yuki Yaki Corner – Studio Foto F&B# Yuki Yaki Corner – Studio Foto F&B

Web app untuk mengubah 1 foto makanan menjadi transparan dan meningkatkan kualitas foto sesuai brand Yuki Yaki Corner. Hasil siap untuk GoFood, GrabFood, dan ShopeeFood.Web app untuk mengubah 1 foto makanan menjadi transparan dan meningkatkan kualitas foto sesuai brand Yuki Yaki Corner. Hasil siap untuk GoFood, GrabFood, dan ShopeeFood.

## Quick Start## Fitur Utama

````bash- Upload gambar, auto hapus background putih/terang (heuristik), ekspor PNG transparan

# Install dependencies- Preset enhancement khusus F&B (brightness, saturation, sharpen)

npm install- Admin panel: atur API key Gemini dan GitHub Models, serta opsi provider background

- Brand theme: warna, tipografi sesuai panduan

# Start development server- Fondasi untuk AI copywriting (judul/desk produk) via Gemini/GitHub Models (stub)

npm run dev

```## Prasyarat



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.- Node.js 18+ dan pnpm



## Documentation## Konfigurasi



📚 **Complete documentation is available in the [`docs/`](./docs/) folder:**Buat file `.env.local` berdasarkan `.env.example`.



- **[README.md](./docs/README.md)** - Detailed project documentation## Development

- **[ROADMAP.md](./docs/ROADMAP.md)** - Development roadmap

- **[DESIGN-ROADMAP.md](./docs/DESIGN-ROADMAP.md)** - Design system roadmap```bash

npm run dev

### Deployment Guides```



- **[DEPLOY-GUIDE-EN.md](./docs/DEPLOY-GUIDE-EN.md)** - English deployment guideOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **[PANDUAN-DEPLOY-NETLIFY.md](./docs/PANDUAN-DEPLOY-NETLIFY.md)** - Panduan deploy ke Netlify

- **[PANDUAN-COOLIFY-FIX.md](./docs/PANDUAN-COOLIFY-FIX.md)** - Panduan troubleshooting Coolify## Deployment

- **[PANDUAN-UPDATE-EFISIEN.md](./docs/PANDUAN-UPDATE-EFISIEN.md)** - Panduan update yang efisien

### Deploy ke Netlify

## Tech StackBaca panduan lengkap di [PANDUAN-DEPLOY-NETLIFY.md](./PANDUAN-DEPLOY-NETLIFY.md) untuk deploy ke Netlify.



- **Framework**: Next.js 14 with App Router### Deploy to Netlify (English)

- **Styling**: Tailwind CSSRead the complete guide in [DEPLOY-GUIDE-EN.md](./DEPLOY-GUIDE-EN.md) for Netlify deployment.

- **Language**: TypeScript

- **AI Integration**: Gemini & GitHub Models### Deploy ke Platform Lain

- **Vercel**: `npm i -g vercel && vercel`

## License- **Railway**: Connect GitHub repository

- **Heroku**: Add buildpack dan Procfile

Proprietary – internal Yuki Yaki Corner.
## Roadmap & Future Development

### 🗺️ Roadmap Lengkap
Lihat [ROADMAP.md](./ROADMAP.md) untuk roadmap pengembangan komprehensif mencakup:
- **Fase 1**: Core Enhancement (AI integration, analytics, user management)
- **Fase 2**: Business Features (multi-tenant, automations, mobile apps)
- **Fase 3**: Scale & Innovation (advanced AI, platform expansion, emerging tech)

### 🎨 Design & UX Roadmap
Lihat [DESIGN-ROADMAP.md](./DESIGN-ROADMAP.md) untuk roadmap design system dan UX improvements.

### 🚀 Contributing
Roadmap ini terbuka untuk kontribusi! Silakan buat GitHub Issue atau Pull Request untuk:
- Feature requests
- Bug reports
- Performance improvements
- Documentation updates

## Catatan

- Penghapusan background menggunakan pendekatan heuristik (chroma key putih). Untuk kualitas studio, integrasikan layanan khusus background removal (mis. rembg/segmentation ML) — sudah disiapkan provider flag `imageBgProvider`.
- Logo pada `public/logo.svg` adalah placeholder.

## Lisensi

Proprietary – internal Yuki Yaki Corner.
````
