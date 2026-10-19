# Journey of a Request — Modul Interaktif Transport Layer

Modul belajar mandiri untuk **NPUS236017 Jaringan Komputer — S1 Ilmu Perpustakaan**.

Versi ini sengaja dibuat **linear/story-based**, bukan berupa banyak menu terpisah. Mahasiswa cukup menekan **Lanjut** dan mengikuti satu cerita:

1. Connect ke Wi‑Fi
2. DHCP
3. Ketik domain
4. DNS
5. Transport Layer + Port
6. TCP vs UDP
7. TCP Three-Way Handshake
8. HTTPS Request
9. Ringkasan
10. Service Detective
11. Kuis Akhir

## Membuka langsung di komputer

Tidak perlu instalasi.

1. Ekstrak ZIP.
2. Pastikan file berikut berada pada folder yang sama:
   - `index.html`
   - `styles.css`
   - `app.js`
3. Klik dua kali `index.html`.
4. Website terbuka di browser.

## Publish gratis menggunakan GitHub Pages

### A. Buat repository
1. Buka https://github.com
2. Login / buat akun.
3. Klik **New repository**.
4. Nama repository, misalnya: `transport-layer-interaktif`
5. Pilih **Public**
6. Klik **Create repository**

### B. Upload file
1. Di repository baru, klik **Add file → Upload files**.
2. Upload:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. Klik **Commit changes**.

> `index.html` harus berada langsung di root repository.

### C. Aktifkan GitHub Pages
1. Buka **Settings**
2. Pilih **Pages**
3. Pada **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/(root)`
4. Klik **Save**

### D. Tunggu deploy
Biasanya beberapa menit.

Alamat akan berbentuk:
`https://USERNAME.github.io/transport-layer-interaktif/`

Tidak perlu membeli domain atau hosting.

## Update web
Jika ada revisi:
1. Edit file lokal.
2. Upload ulang file yang berubah ke repository.
3. Commit changes.
4. GitHub Pages otomatis deploy ulang.

## Catatan
- Website statis.
- Tidak memakai backend/database.
- Tidak memakai CDN/framework.
- Bisa berjalan dari `file://` maupun GitHub Pages.
- Progres scene disimpan pada browser mahasiswa dengan `localStorage`.
