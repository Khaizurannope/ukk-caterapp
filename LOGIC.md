# Dokumentasi Logika Projek Catering App

File ini menjelaskan alur logika bisnis dan teknis dari aplikasi Catering, mencakup Autentikasi, Manajemen Produk, Pemesanan, dan Pengiriman.

# 1. Arsitektur Data & Role
Aplikasi menggunakan **Prisma ORM** dengan database PostgreSQL. Struktur data memisahkan pengguna menjadi dua entitas utama:

# A. Aktor (User & Pelanggan)
Aplikasi membedakan tabel untuk Staff dan Customer:
1. **User (Staff)**
   - Role: `admin`, `owner`, `kurir`.
   - Tabel: `users`
   - Digunakan untuk manajemen internal (Admin), laporan (Owner), dan pengiriman (Kurir).
2. **Pelanggan (Customer)**
   - Role: `pelanggan`.
   - Tabel: `pelanggans`
   - Melakukan pemesanan dan pembayaran.

# B. Entitas Utama Lainnya
- **Paket**: Menu katering (Prasmanan/Box).
- **Pemesanan**: Header transaksi pesanan.
- **DetailPemesanan**: Item detil dalam satu pesanan.
- **Pengiriman**: Data tracking pengiriman oleh kurir.
- **JenisPembayaran**: Metode pembayaran (Transfer Bank, dll).

---

# 2. Autentikasi (Auth Logic)
Implementasi berada di `src/lib/auth.ts` menggunakan **NextAuth v5**.

- **Strategi**: `Credentials` provider.
- **Logika Login**:
  - Menerima input: `email`, `password`, dan `loginType`.
  - Jika `loginType === "staff"`, sistem mencari di tabel `User`.
  - Jika `loginType === "customer"`, sistem mencari di tabel `Pelanggan`.
  - Verifikasi password menggunakan `bcrypt`.
- **Session**: Data sesi diperkaya dengan `role`, `id`, dan `type` untuk mempermudah akses kontrol di frontend dan backend.

---

# 3. Manajemen Paket (Menu)
Logika bisnis di `src/actions/paket-actions.ts`.

- **CRUD**: Admin dapat membuat, membaca, memperbarui, dan menghapus paket.
- **Kategorisasi**: Paket dibedakan berdasarkan:
  - **Jenis**: Prasmanan, Box.
  - **Kategori**: Pernikahan, Selamatan, Ulang Tahun, dll.
- **Upload Gambar**: Integrasi dengan Cloudinary (disimpulkan dari kode helper) untuk menyimpan foto makanan.

---

# 4. Alur Pemesanan (Order Flow)
Logika utama di `src/actions/pemesanan-actions.ts`.

# A. Pembuatan Pesanan (`createPemesanan`)
1. **Input**: Data pelanggan, item paket yang dipilih, alamat kirim.
2. **Kalkulasi**: Total bayar dihitung di server (harga paket * jumlah).
3. **Transaksi Database**:
   - Dibalut dalam `prisma.$transaction` untuk atomicity.
   - Membuat record `Pemesanan`.
   - Membuat detail item di `DetailPemesanan`.
   - Generate No Resi unik dengan format: `CTR-YYMMDD-XXXXXX`.
4. **Status Awal**: `Menunggu_Konfirmasi`.

# B. Pembayaran
- Pelanggan mengunggah bukti transfer via `uploadBuktiTransfer`.
- Sistem menyimpan URL bukti transfer.
- **Trigger**: Saat bukti diunggah, status pesanan otomatis berubah menjadi `Sedang_Diproses` (menandakan admin perlu mengecek, atau dianggap sudah dibayar).

# C. Update Status (Admin)
Admin memiliki kontrol penuh untuk mengubah status pesanan melalui `updateStatusPemesanan`:
- `Menunggu_Konfirmasi`
- `Sedang_Diproses`
- `Menunggu_Kurir` (Siap dikirim)
- `Sedang_Dikirim`
- `Selesai`

---

# 5. Logika Pengiriman (Delivery)
Logika di `src/actions/pengiriman-actions.ts`.

# A. Penugasan Kurir (`assignKurir`)
- Dilakukan oleh **Admin**.
- Menghubungkan `Pemesanan` dengan `User` (Kurir).
- **Efek Samping**:
  - Membuat record baru di tabel `Pengiriman` dengan status `Sedang_Dikirim`.
  - Mengupdate status di tabel `Pemesanan` menjadi `Sedang_Dikirim`.

# B. Update Kurir (`updatePengiriman`)
- Dilakukan oleh **Kurir**.
- Kurir mengupdate saat pesanan sampai.
- Status berubah menjadi `Tiba_Ditujuan`.
- Kurir wajib/bisa mengunggah **Bukti Foto** pengiriman.

---

# 6. Server Actions & Validasi
- **Server Actions**: Semua mutasi data (POST/PUT/DELETE) menggunakan React Server Actions (`"use server"`).
- **Validasi Input**: Menggunakan library **Zod** sebelum data diproses ke database untuk keamanan.
- **Revalidasi Cache**: Menggunakan `revalidatePath` setelah mutasi data agar tampilan frontend (dashboard/menu) langsung terupdate tanpa refresh manual.
