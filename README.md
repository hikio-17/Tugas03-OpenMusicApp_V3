# Open Music API

Open Music API adalah sebuah proyek API musik terbuka yang dibangun menggunakan Node.js dan Hapi.js. API ini memungkinkan pengguna untuk mengakses dan mengelola informasi tentang lagu, artis, dan album musik.

## Teknologi Utama

Proyek ini dibangun dengan menggunakan teknologi-teknologi berikut:

- **Node.js**: Lingkungan runtime JavaScript yang digunakan untuk menjalankan server API.
- **Hapi.js**: Framework Node.js yang digunakan untuk membangun API dengan mudah dan efisien.
- **JWT (JSON Web Tokens)**: Digunakan untuk mengamankan akses API dengan autentikasi berbasis token.
- **PostgreSQL**: Basis data relasional untuk menyimpan informasi tentang lagu, artis, dan album.
- **Redis**: Sistem penyimpanan data berkinerja tinggi yang digunakan untuk caching hasil permintaan API.

## Fitur Utama

- Daftar lagu, artis, dan album musik.
- Detail lengkap tentang lagu, artis, dan album, termasuk informasi tambahan seperti lirik dan ulasan.
- Pencarian lagu, artis, atau album berdasarkan kata kunci.
- Autentikasi pengguna menggunakan JWT.
- Penyimpanan dan manajemen data menggunakan PostgreSQL.
- Caching hasil permintaan API menggunakan Redis.

## Panduan Penggunaan

1. **Persyaratan Sistem**:

   Pastikan sistem Anda memiliki Node.js, npm, PostgreSQL, dan Redis terpasang.

2. **Instalasi**:

   - Clone repositori ini: `https://github.com/hikio-17/Tugas03-OpenMusicApp_V3.git`
   - Pindah ke direktori proyek: `cd Tugas03-OpenMusicApp_V3`
   - Instal dependensi: `npm install`

3. **Konfigurasi**:

   - Buat salinan file `.env.example` dan ubah namanya menjadi `.env`.
   - Isi konfigurasi yang diperlukan seperti koneksi basis data dan pengaturan Redis.

4. **Menjalankan Aplikasi**:

   Jalankan server dengan perintah: `npm start`

5. **Menggunakan API**:

   - API dapat diakses pada `http://localhost:3000`.
   - Dokumentasi API dapat ditemukan di [Postman](https://documenter.getpostman.com/view/20149138/2s93zB51po)
