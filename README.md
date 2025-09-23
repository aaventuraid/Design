# Yuki Yaki Corner – Studio Foto F&B

Web app untuk mengubah 1 foto makanan menjadi transparan dan meningkatkan kualitas foto sesuai brand Yuki Yaki Corner. Hasil siap untuk GoFood, GrabFood, dan ShopeeFood.

## Fitur Utama

- Upload gambar, auto hapus background putih/terang (heuristik), ekspor PNG transparan
- Preset enhancement khusus F&B (brightness, saturation, sharpen)
- Admin panel: atur API key Gemini dan GitHub Models, serta opsi provider background
- Brand theme: warna, tipografi sesuai panduan
- Fondasi untuk AI copywriting (judul/desk produk) via Gemini/GitHub Models (stub)

## Prasyarat

- Node.js 18+ dan pnpm

## Konfigurasi

Buat file `.env.local` berdasarkan `.env.example`.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Deploy ke Netlify
Baca panduan lengkap di [PANDUAN-DEPLOY-NETLIFY.md](./PANDUAN-DEPLOY-NETLIFY.md) untuk deploy ke Netlify.

### Deploy to Netlify (English)
Read the complete guide in [DEPLOY-GUIDE-EN.md](./DEPLOY-GUIDE-EN.md) for Netlify deployment.

### Deploy ke Platform Lain
- **Vercel**: `npm i -g vercel && vercel`
- **Railway**: Connect GitHub repository
- **Heroku**: Add buildpack dan Procfile

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
