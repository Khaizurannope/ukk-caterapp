import { z } from "zod";

// =====================================
// AUTH SCHEMAS
// =====================================

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export const RegisterPelangganSchema = z.object({
  namaPelanggan: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  telepon: z.string().min(10, { message: "Nomor telepon minimal 10 digit" }),
  alamat1: z.string().min(10, { message: "Alamat minimal 10 karakter" }),
});

// =====================================
// PAKET SCHEMAS
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
// PEMESANAN SCHEMAS
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
// PENGIRIMAN SCHEMAS
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
// USER SCHEMAS
// =====================================

export const UserSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  level: z.enum(["admin", "owner", "kurir"]),
});

// =====================================
// JENIS PEMBAYARAN SCHEMAS
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
// TYPE EXPORTS
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
