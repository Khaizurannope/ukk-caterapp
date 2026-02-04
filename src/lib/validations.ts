import { z } from "zod";

// =====================================
// SKEMA AUTENTIKASI
// =====================================

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export const RegisterPelangganSchema = z.object({
  namaPelanggan: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  tglLahir: z.string()
    .min(1, { message: "Tanggal lahir wajib diisi" })
    .refine((date) => !isNaN(new Date(date).getTime()), { message: "Format tanggal tidak valid" })
    .refine((date) => new Date(date) <= new Date(), { message: "Tanggal lahir tidak boleh di masa depan" })
    .refine((date) => {
      const today = new Date();
      const birthDate = new Date(date);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 17;
    }, { message: "Minimal umur 17 tahun (Wajib memiliki KTP)" }),
  telepon: z.string().min(10, { message: "Nomor telepon minimal 10 digit" }),
  alamat1: z.string().min(10, { message: "Alamat utama minimal 10 karakter" }),
  alamat2: z.string().optional(),
  alamat3: z.string().optional(),
  kartuId: z.string().min(1, { message: "KTP wajib diupload" }),
  foto: z.string().optional(),
});

// =====================================
// SKEMA PAKET
// =====================================

export const PaketSchema = z.object({
  namaPaket: z.string().min(3, { message: "Nama paket minimal 3 karakter" }),
  jenis: z.enum(["Prasmanan", "Box"]),
  kategori: z.enum(["Pernikahan", "Selamatan", "Ulang_Tahun", "Studi_Tour", "Rapat"]),
  jumlahPax: z.preprocess((val) => Number(val), z.number().min(1, { message: "Jumlah pax minimal 1" })),
  hargaPaket: z.preprocess((val) => Number(val), z.number().min(1000, { message: "Harga minimal Rp 1.000" })),
  deskripsi: z.string().min(10, { message: "Deskripsi minimal 10 karakter" }),
  foto1: z.string().optional(),
  foto2: z.string().optional(),
  foto3: z.string().optional(),
});

// =====================================
// SKEMA PEMESANAN
// =====================================

export const PemesananSchema = z.object({
  pelangganId: z.coerce.number(),
  jenisPembayaranId: z.coerce.number(),
  alamatKirim: z.string().min(10, { message: "Alamat minimal 10 karakter" }),
  tglPesan: z.coerce.date(),
  items: z.array(z.object({
    paketId: z.coerce.number(),
    jumlahOrder: z.coerce.number().min(1),
    hargaPaket: z.coerce.number(),
  })).min(1, { message: "Minimal 1 item" }),
});

export const UpdateStatusPesananSchema = z.object({
  id: z.coerce.number(),
  statusPesan: z.enum(["Menunggu_Konfirmasi", "Sedang_Diproses", "Menunggu_Kurir"]),
});

// =====================================
// SKEMA PENGIRIMAN
// =====================================

export const AssignKurirSchema = z.object({
  idPesan: z.coerce.number(),
  idUser: z.coerce.number(),
});

export const UpdatePengirimanSchema = z.object({
  id: z.coerce.number(),
  statusKirim: z.enum(["Sedang_Dikirim", "Tiba_Ditujuan"]),
  buktiFoto: z.string().optional(),
});

// =====================================
// SKEMA USER
// =====================================

export const UserSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  level: z.enum(["admin", "owner", "kurir"]),
});

// =====================================
// SKEMA JENIS PEMBAYARAN
// =====================================

export const JenisPembayaranSchema = z.object({
  metodePembayaran: z.string().min(3, { message: "Nama metode minimal 3 karakter" }),
});

export const DetailJenisPembayaranSchema = z.object({
  idJenisPembayaran: z.coerce.number(),
  noRek: z.string().min(5, { message: "Nomor rekening minimal 5 karakter" }),
  tempatBayar: z.string().min(2, { message: "Nama bank/platform minimal 2 karakter" }),
  logo: z.string().optional(),
});

// =====================================
// SKEMA UPDATE PROFILE
// =====================================

export const UpdateProfileSchema = z.object({
  namaPelanggan: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  tglLahir: z.string().optional(),
  telepon: z.string().min(10, { message: "Nomor telepon minimal 10 digit" }),
  alamat1: z.string().min(10, { message: "Alamat utama minimal 10 karakter" }),
  alamat2: z.string().optional(),
  alamat3: z.string().optional(),
  foto: z.string().optional(),
});

// =====================================
// EKSPOR TIPE
// =====================================

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterPelangganInput = z.infer<typeof RegisterPelangganSchema>;
export type PaketInput = z.infer<typeof PaketSchema>;
export type PemesananInput = z.infer<typeof PemesananSchema>;
export type UpdateStatusPesananInput = z.infer<typeof UpdateStatusPesananSchema>;
export type AssignKurirInput = z.infer<typeof AssignKurirSchema>;
export type UpdatePengirimanInput = z.infer<typeof UpdatePengirimanSchema>;
export type UserInput = z.infer<typeof UserSchema>;
export type JenisPembayaranInput = z.infer<typeof JenisPembayaranSchema>;
export type DetailJenisPembayaranInput = z.infer<typeof DetailJenisPembayaranSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
