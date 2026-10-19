# Modul Interaktif — Transport Layer & Layanan Jaringan

Modul belajar mandiri untuk **NPUS236017 Jaringan Komputer** — S1 Ilmu Perpustakaan.

## Fitur
- Simulasi perjalanan request: Wi‑Fi → DHCP → DNS → Port → TCP → HTTPS
- Penjelasan Transport Layer, port, socket
- Simulasi TCP three-way handshake
- Perbandingan TCP vs UDP
- DHCP, DNS, HTTP, HTTPS
- Integrasi Application → Transport → Network → Data Link → Physical
- Service Detective berbasis kasus
- Kuis akhir 10 soal dengan feedback
- Progres belajar disimpan di browser (`localStorage`)
- Responsive untuk laptop/tablet/HP
- Tidak menggunakan backend, framework, CDN, atau database

## Cara membuka langsung di komputer
1. Ekstrak ZIP.
2. Pastikan file berikut berada di folder yang sama:
   - `index.html`
   - `styles.css`
   - `app.js`
3. Klik dua kali `index.html`.
4. Modul akan terbuka di browser.

## Cara publish gratis dengan GitHub Pages

### 1. Buat akun GitHub
Buka `https://github.com` lalu login/daftar.

### 2. Buat repository
Klik **New repository**.

Contoh nama:
`transport-layer-interaktif`

Pilih:
- **Public**
- lalu klik **Create repository**

### 3. Upload file
Pada repository yang baru dibuat:
1. klik **Add file**
2. pilih **Upload files**
3. upload:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
4. klik **Commit changes**

> Penting: `index.html` harus berada langsung di root repository, bukan di dalam subfolder.

### 4. Aktifkan GitHub Pages
1. buka tab **Settings**
2. pilih **Pages**
3. pada **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/(root)`
4. klik **Save**

### 5. Tunggu deploy
Biasanya beberapa menit.

GitHub akan memberikan alamat seperti:
`https://USERNAME.github.io/transport-layer-interaktif/`

Tidak perlu membeli domain.

## Cara update
Jika materi diubah:
1. edit file lokal
2. upload ulang file yang berubah ke repository
3. commit
4. GitHub Pages otomatis melakukan deploy ulang

## Catatan pengajar
Website ini dirancang agar mahasiswa tetap dapat belajar mandiri meskipun tanpa penjelasan dosen secara langsung. Bagian yang disarankan dikerjakan berurutan adalah:
1. Perjalanan Request
2. Transport Layer
3. TCP vs UDP
4. Layanan Jaringan
5. Dari Aplikasi ke Media
6. Service Detective
7. Kuis Akhir
