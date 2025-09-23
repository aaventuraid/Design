# Yuki Yaki Corner – Studio Foto F&B

Web app untuk mengubah 1 foto makanan menjadi transparan dan meningkatkan kualitas foto sesuai brand Yuki Yaki Corner. Hasil siap untuk GoFood, GrabFood, dan ShopeeFood.

## Fitur Utama

- Upload gambar, auto hapus background putih/terang (heuristik), ekspor PNG transparan
- Preset enhancement khusus F&B (brightness, saturation, sharpen)
- Admin panel: atur API key Gemini dan opsi provider background
- Brand theme: warna, tipografi sesuai panduan
- Generator copy produk via Gemini (dengan opsi eksperimen Banana)

## Prasyarat

- Node.js 18+ dan npm/pnpm

## Konfigurasi

- Buat file `.env.local` berdasarkan `.env.example`.
- Set `GEMINI_API_KEY` untuk mengaktifkan AI generator (atau isi via halaman Admin).

## Development

```bash
npm install
npm run dev
```

Buka http://localhost:3000 di browser.

## Dokumentasi

📚 Lengkap ada di folder [`docs/`](./docs/):
- [README.md](./docs/README.md)
- [ROADMAP.md](./docs/ROADMAP.md)
- [DESIGN-ROADMAP.md](./docs/DESIGN-ROADMAP.md)

## Deployment

Lihat panduan di folder docs:
- [DEPLOY-GUIDE-EN.md](./docs/DEPLOY-GUIDE-EN.md)
- [PANDUAN-DEPLOY-NETLIFY.md](./docs/PANDUAN-DEPLOY-NETLIFY.md)
- [PANDUAN-COOLIFY-FIX.md](./docs/PANDUAN-COOLIFY-FIX.md)

## Tech Stack

- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Language: TypeScript
- AI: Gemini (satu-satunya provider; fallback lokal tersedia)
- Image Processing: Sharp

## Catatan

- Penghapusan background menggunakan pendekatan heuristik (chroma key putih). Untuk kualitas studio, integrasikan layanan khusus (rembg/segmentation ML) — provider `imageBgProvider` sudah disiapkan.
- Fitur eksperimen Banana: aktifkan di Generator Copy (toggle), membuat gaya bahasa lebih catchy/dinamis.

## Lisensi

Proprietary – internal Yuki Yaki Corner.
