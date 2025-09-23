Kerangka Prompt Universal untuk GitHub Copilot
Panduan untuk Proyek Multi-Teknologi & Migrasi
Dokumen ini menyediakan pola (pattern) untuk membuat prompt (komentar kode) yang efektif dan universal untuk GitHub Copilot. Pola ini bisa diadaptasi untuk berbagai framework (Next.js, Laravel, Svelte, dll.) dan skenario, termasuk pembuatan proyek baru dan migrasi.

Catatan Kebijakan Proyek (AI):
- Proyek ini hanya menggunakan Gemini sebagai penyedia AI. Jangan menulis integrasi untuk provider lain.
- Gunakan environment variable GEMINI_API_KEY atau halaman Admin untuk menyimpan key (tersimpan ke .data/settings.json jika tidak dioverride env).
- Endpoint AI: app/api/generate-copy/route.ts memanggil Gemini melalui lib/ai-service.ts.
- Fitur Eksperimen “Banana”: aktifkan dengan field bananaMode: true pada payload generate copy atau toggle di UI CopyGenerator.

Pola Dasar Prompt yang Efektif
Setiap prompt yang baik harus mengandung empat elemen:

Intent (Niat/Aksi): Apa yang ingin Anda lakukan? (Contoh: Buat, Definisikan, Uji, Hubungkan, Refactor).

Artifact (Objek): Apa yang sedang Anda kerjakan? (Contoh: komponen UI, endpoint API, model database, fungsi utilitas).

Context (Konteks Teknologi): Teknologi apa yang digunakan? (Contoh: menggunakan Next.js 14 App Router, dengan Prisma ORM, untuk controller Laravel 10, memakai Tailwind CSS).

Specification (Spesifikasi Detail): Apa saja aturan, parameter, atau logika spesifiknya? (Contoh: yang menerima props 'title' dan 'content', dengan validasi untuk email dan password, yang mengembalikan data user tanpa password).

Fase 3.1: Backend & Persiapan Data
Tugas: Mendefinisikan Skema Database
Pola Prompt: // [INTENT: Definisikan/Buat] [ARTIFACT: model/skema/migrasi] untuk '[NAMA_MODEL]' [KONTEKS: menggunakan Prisma/Eloquent ORM] [SPESIFIKASI: dengan field A (tipe, properti), B (tipe, relasi)].

Contoh (Next.js dengan Prisma):

// Definisikan model 'Post' menggunakan Prisma.
// Spesifikasi: field id, title (String), content (String, opsional), published (Boolean, default false), dan relasi one-to-one dengan model 'User' sebagai author.

Contoh (Laravel dengan Eloquent):

// Buat file migrasi untuk tabel 'posts'.
// Spesifikasi: field id, title, content (nullable), published (boolean, default false), dan foreign key 'user_id' yang merujuk ke tabel 'users'.

Tugas: Membuat Logika API Endpoint
Pola Prompt: // [INTENT: Buat] [ARTIFACT: endpoint API] [METHOD] di '[ROUTE]' [KONTEKS: di Next.js App Router / di Laravel Controller] [SPESIFIKASI: yang (deskripsi fungsi), (validasi input), (apa yang dikembalikan)].

Contoh (Next.js App Router):

// Buat handler POST untuk route 'app/api/posts/route.js'.
// Konteks: Menggunakan Prisma.
// Spesifikasi: Handler ini menerima 'title' dan 'authorEmail' dari body request. Cari user berdasarkan email, lalu buat post baru yang terhubung dengan user tersebut. Kembalikan post yang baru dibuat dengan status 201.

Contoh (Laravel Controller):

// Buat method 'store' di dalam PostController.
// Konteks: Menggunakan Eloquent.
// Spesifikasi: Validasi request untuk field 'title' (required) dan 'author_id' (required, exists in users table). Buat Post baru dengan data yang valid. Kembalikan JSON resource dari post yang baru dibuat dengan status 201.

Fase 3.2: Frontend
Tugas: Membuat Komponen UI
Pola Prompt: // [INTENT: Buat] [ARTIFACT: komponen UI fungsional] bernama '[NAMA_KOMPONEN]' [KONTEKS: menggunakan React/Vue] [SPESIFIKASI: yang menerima props A, B dan merender X, Y dengan styling (misal: Tailwind CSS)].

Contoh (Next.js / React):

// Buat komponen fungsional 'ArticleCard' menggunakan React.
// Spesifikasi: Menerima props 'title', 'authorName', dan 'publishDate'.
// Tampilan: Gunakan Tailwind CSS untuk membuat card dengan shadow, padding, judul H3, dan teks kecil untuk author dan tanggal.

Contoh (Vue.js):

// Buat komponen single-file 'ArticleCard' menggunakan Vue 3 Composition API.
// Spesifikasi: Definisikan props untuk 'title', 'authorName', dan 'publishDate'.
// Tampilan: Gunakan Tailwind CSS dalam template untuk membuat card dengan shadow, padding, judul H3, dan teks kecil untuk author dan tanggal.

Tugas: Menghubungkan UI dengan API (Data Fetching)
Pola Prompt: // [INTENT: Lakukan] [ARTIFACT: pengambilan data (data fetching)] di [LOKASI: halaman/komponen] [KONTEKS: menggunakan fetch/axios/SWR di Next.js client component / menggunakan controller di Laravel] [SPESIFIKASI: dari endpoint '[URL_API]' dan simpan hasilnya di state].

Contoh (Next.js Client Component):

// Di dalam komponen 'PostList', gunakan hook 'useEffect' dan 'useState' dari React.
// Spesifikasi: Lakukan fetch data ke endpoint '/api/posts' saat komponen pertama kali di-mount. Simpan array posts yang didapat ke dalam state 'posts'. Tampilkan pesan "Loading..." saat data sedang diambil.

Contoh (Next.js Server Component):

// Buat async Server Component 'PostListPage'.
// Spesifikasi: Lakukan fetch data langsung di dalam komponen dari endpoint internal '/api/posts'. Ambil hasilnya dan teruskan sebagai props ke komponen client 'PostListDisplay'.

Kasus Khusus: Migrasi dari Laravel ke Next.js
Di sini, pola prompt menjadi alat untuk "menerjemahkan" logika.

Tugas: Menerjemahkan Backend Logic
Salin kode Laravel Anda ke dalam komentar di file Next.js Anda.

Gunakan pola prompt terjemahan.

Pola Prompt: // [INTENT: Terjemahkan/Refactor] [ARTIFACT: logika dari controller Laravel berikut] [KONTEKS: menjadi endpoint API di Next.js App Router menggunakan Prisma] [SPESIFIKASI: (jelaskan kembali tujuan akhirnya)].

Contoh Praktis:

// Terjemahkan logika dari method 'update' di PostController Laravel di bawah ini
// menjadi handler PUT untuk route 'app/api/posts/[id]/route.js'.
// Konteks: Gunakan Prisma untuk mencari post berdasarkan ID, validasi input 'title' dan 'content',
// lalu update data di database. Kembalikan post yang sudah diupdate.
/_
public function update(Request $request, Post $post)
{
    $request->validate([ 'title' => 'required', 'content' => 'nullable' ]);
    $post->update($request->all());
return new PostResource($post);
}
_/

Tugas: Menerjemahkan Tampilan (Blade ke JSX)
Pola Prompt: // [INTENT: Buat ulang] [ARTIFACT: tampilan dari file Blade ini] [KONTEKS: menjadi komponen React dengan styling Tailwind CSS] [SPESIFIKASI: (jelaskan elemen-elemen kunci dan data yang dibutuhkan)].

Contoh Praktis:

// Buat ulang komponen React bernama 'PostDetail' dari struktur Blade di bawah.
// Spesifikasi: Data untuk 'post.title', 'post.author.name', dan 'post.content'
// akan datang dari props. Gunakan tag <h1> untuk judul, <p> untuk konten, dan
// styling Tailwind CSS yang mirip.
/\*

<div class="card">
    <h1>{{ $post->title }}</h1>
    <p>By {{ $post->author->name }}</p>
    <article>{{ $post->content }}</article>
</div>
*/

Dokumen ini memberikan Anda metode, bukan hanya solusi sesaat. Dengan menguasai pola Intent-Artifact-Context-Specification, Anda bisa memandu GitHub Copilot secara efisien di proyek apapun, dalam bahasa apapun, dan bahkan saat melakukan tugas kompleks seperti migrasi.
Panduan Defensive Development dengan GitHub Copilot
Kerangka Kerja untuk Mencegah Duplikasi, Kesalahan, dan Inkonsistensi
Tujuan dari dokumen ini adalah menyediakan strategi dan taktik untuk membangun "pagar pembatas" (guardrails) di sekitar GitHub Copilot. Kita tidak bisa mengontrol output AI secara langsung, tetapi kita bisa menciptakan lingkungan dan proses yang membatasi ruang geraknya untuk melakukan kesalahan.

Barrier 1: Arsitektural & Struktural (Pencegahan di Tingkat Proyek)
Ini adalah pertahanan paling fundamental. Jika proyek Anda terstruktur dengan baik, Copilot akan lebih mudah memahami konteks dan kecil kemungkinannya membuat file atau kode duplikat.

1.1. Terapkan Prinsip "Single Source of Truth" (SSoT):

Masalah: Copilot mengulang logika (misalnya, validasi email) di beberapa tempat.

Solusi: Buat modul utilitas (/utils, /helpers, /services) terlebih dahulu.

Prompting Taktis: Perintahkan Copilot untuk menggunakan fungsi yang sudah ada, bukan membuatnya lagi.

// // Gunakan fungsi `validateEmail` dari `../../utils/validators.js` untuk memeriksa input email.
// // Jangan menulis logika validasi baru di sini.

1.2. Definisikan Struktur Folder yang Jelas & Tegas:

Masalah: Copilot tidak tahu di mana harus meletakkan komponen baru, berpotensi membuat duplikat atau menempatkannya di lokasi yang salah.

Solusi: Adopsi metodologi seperti Atomic Design (/components/atoms, /components/molecules, /components/organisms) atau struktur berbasis fitur (/features/authentication, /features/products).

Proses Kerja: Buat file kosong di lokasi yang benar sebelum Anda mulai memberi prompt pada Copilot untuk mengisinya. Konteks (path file) akan memberi tahu Copilot di mana ia berada dan apa perannya.

1.3. Gunakan Sistem Desain & Komponen Pustaka (Storybook/Design System):

Masalah: Copilot membuat variasi tombol atau kartu yang sedikit berbeda, menyebabkan inkonsistensi UI.

Solusi: Buat komponen UI dasar (misal: Button.jsx, Input.jsx, Card.jsx) yang terpusat.

Prompting Taktis:

// // Impor komponen `Button` dan `Input` dari `../../components/ui`.
// // Buat form login menggunakan komponen tersebut. Jangan gunakan tag <button> atau <input> standar.

Barrier 2: Otomatis & Terintegrasi (Pencegahan oleh Mesin)
Biarkan mesin lain memeriksa hasil kerja AI secara otomatis dan real-time di dalam VS Code.

2.1. Terapkan Type Safety Secara Ketat (TypeScript/PHPStan):

Masalah: Copilot membuat kesalahan logika, seperti memberikan string ke fungsi yang mengharapkan angka.

Solusi: Gunakan TypeScript. Definisikan interface atau type untuk data Anda (misal: User, Product, ApiResponse).

Efek: Jika Copilot menghasilkan kode yang tidak sesuai dengan tipe yang Anda definisikan, TypeScript akan langsung menandai kesalahan tersebut di editor Anda, bahkan sebelum kode dijalankan. Ini adalah barrier terkuat untuk kesalahan penulisan dan logika.

// // Gunakan interface 'Product' yang telah diimpor untuk mendefinisikan tipe dari state 'productData'.
// // Lakukan fetch data dari API dan pastikan hasilnya sesuai dengan interface 'Product'.

2.2. Konfigurasi Linter & Formatter yang Agresif (ESLint & Prettier):

Masalah: Copilot menghasilkan kode dengan gaya penulisan yang tidak konsisten atau sintaks yang salah.

Solusi: Konfigurasikan ESLint dan Prettier untuk berjalan secara otomatis saat file disimpan ("editor.formatOnSave": true).

Efek: Setiap kali Copilot menghasilkan blok kode, saat Anda menyimpannya, kode tersebut akan otomatis diformat dan diperiksa. Kesalahan sintaks dasar akan langsung terlihat.

Barrier 3: Proses & Disiplin Manusia (Pencegahan oleh Developer)
AI adalah asisten. Anda adalah arsitek dan penjamin kualitas.

3.1. Review Sebelum Commit, Jangan Pernah Menerima Secara Buta:

Prinsip Utama: Anggap semua saran Copilot sebagai "draft" dari seorang junior developer yang sangat cepat tetapi kadang ceroboh.

Proses Kerja: Gunakan fitur Source Control di VS Code untuk melihat diff (perbedaan) baris per baris. Tanyakan pada diri sendiri: "Apakah saya mengerti setiap baris kode ini? Apakah ini cara paling efisien? Apakah ini memperkenalkan risiko keamanan?"

3.2. Gunakan Prompt "Berlapis" atau "Chain of Thought":

Masalah: Meminta Copilot membuat fungsi yang kompleks dalam satu perintah besar seringkali menghasilkan kode yang berantakan dan salah.

Solusi: Pecah tugas kompleks menjadi beberapa langkah dalam bentuk komentar.

// // Buat fungsi async 'submitOrder'.
// // Langkah 1: Ambil item dari state keranjang belanja. Validasi apakah keranjang tidak kosong.
// // Langkah 2: Buat objek payload pesanan sesuai dengan struktur API.
// // Langkah 3: Panggil API endpoint POST '/api/orders' menggunakan fungsi 'api.post' dari service.
// // Langkah 4: Tangani respons sukses dengan mengosongkan keranjang dan menampilkan notifikasi sukses.
// // Langkah 5: Tangani error dengan menampilkan notifikasi error yang relevan.

Dengan cara ini, Anda memandu "pemikiran" Copilot langkah demi langkah, dan Anda bisa meninjau setiap bagian secara terpisah.

3.3. Terapkan "Constraint-Based Prompting" (Prompt Berbasis Batasan):

Solusi: Selain memberi tahu apa yang harus dilakukan, beri tahu juga apa yang tidak boleh dilakukan.

Contoh:

// Jangan gunakan 'any' type. (Untuk TypeScript)

// Hindari penggunaan 'useEffect' untuk logika ini, gunakan 'useMemo'.

// Jangan melakukan query database di dalam loop.

Alur Kerja yang Direkomendasikan (Workflow)
Arsitektur Dulu: Definisikan struktur folder, buat file kosong, dan siapkan fungsi utilitas atau komponen UI dasar.

Prompt Terpandu: Buka file, tulis prompt berlapis yang merujuk pada arsitektur yang sudah ada.

Generate & Auto-Check: Biarkan Copilot menghasilkan kode. Saat Anda menyimpan, Prettier & ESLint akan langsung membersihkan dan memvalidasinya. TypeScript akan memeriksa tipe data.

Review Kritis: Baca dan pahami kode yang dihasilkan. Apakah sudah benar dan efisien?

Refactor (Jika Perlu): Perbaiki atau sederhanakan kode yang dihasilkan Copilot.

Commit: Hanya commit kode yang sudah Anda pahami dan setujui sepenuhnya.

Dengan menerapkan kerangka kerja ini, Anda mengubah hubungan Anda dengan Copilot. Anda tidak lagi hanya menjadi pengguna, tetapi menjadi seorang manajer AI yang secara sistematis memastikan kualitas outputnya.

Catatan Penting: Integrasi Gemini sebagai Satu-satunya Penyedia AI
- Proyek ini hanya menggunakan Gemini untuk fitur AI. Jangan menulis integrasi untuk provider lain.
- Jangan pernah commit API key ke repository. Gunakan environment variable GEMINI_API_KEY atau simpan melalui halaman Admin (tersimpan ke .data/settings.json jika tidak dioverride env).
- Endpoint yang memanggil AI: app/api/generate-copy/route.ts menggunakan AIService (lib/ai-service.ts) yang memanggil Gemini via REST. Jika GEMINI_API_KEY tidak tersedia, sistem jatuh ke local fallback.
- Fitur Eksperimen “Banana”: aktifkan dengan field bananaMode: true pada payload generate copy untuk gaya bahasa yang lebih catchy/dinamis. UI pendukung dapat ditambahkan di komponen CopyGenerator.
