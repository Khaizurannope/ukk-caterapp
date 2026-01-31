"use server";

import { prisma } from "@/lib/prisma";
import { PaketSchema, PaketInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/lib/cloudinary";

// Tipe alias untuk enum Prisma
type JenisPaket = "Prasmanan" | "Box";
type KategoriPaket = "Pernikahan" | "Selamatan" | "Ulang_Tahun" | "Studi_Tour" | "Rapat";

// AMBIL SEMUA PAKET
export async function getAllPaket() {
  try {
    const pakets = await prisma.paket.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { data: pakets };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data paket" };
  }
}

// AMBIL PAKET BERDASARKAN ID
export async function getPaketById(id: number) {
  try {
    const paket = await prisma.paket.findUnique({
      where: { id: BigInt(id) },
    });
    return { data: paket };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data paket" };
  }
}

// AMBIL PAKET BERDASARKAN FILTER
export async function getPaketByFilter(jenis?: string, kategori?: string) {
  try {
    const pakets = await prisma.paket.findMany({
      where: {
        ...(jenis && { jenis: jenis as JenisPaket }),
        ...(kategori && { kategori: kategori as KategoriPaket }),
      },
      orderBy: { createdAt: "desc" },
    });
    return { data: pakets };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data paket" };
  }
}

// TAMBAH PAKET
export async function createPaket(data: PaketInput) {
  try {
    const validatedData = PaketSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    const { namaPaket, jenis, kategori, jumlahPax, hargaPaket, deskripsi, foto1, foto2, foto3 } = validatedData.data;

    await prisma.paket.create({
      data: {
        namaPaket,
        jenis: jenis as JenisPaket,
        kategori: kategori as KategoriPaket,
        jumlahPax,
        hargaPaket,
        deskripsi,
        foto1: foto1 || null,
        foto2: foto2 || null,
        foto3: foto3 || null,
      },
    });

    revalidatePath("/admin/paket");
    revalidatePath("/menu");
    return { success: "Paket berhasil ditambahkan" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menambahkan paket" };
  }
}

// PERBARUI PAKET
export async function updatePaket(id: number, data: PaketInput) {
  try {
    const validatedData = PaketSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    // Ambil data lama untuk mengecek perubahan gambar
    const oldPaket = await prisma.paket.findUnique({
      where: { id: BigInt(id) },
    });

    if (!oldPaket) {
      return { error: "Paket tidak ditemukan" };
    }

    const { namaPaket, jenis, kategori, jumlahPax, hargaPaket, deskripsi, foto1, foto2, foto3 } = validatedData.data;

    // Hapus foto lama jika diganti (dan foto lama ada)
    if (oldPaket.foto1 && foto1 && oldPaket.foto1 !== foto1) await deleteImage(oldPaket.foto1);
    if (oldPaket.foto2 && foto2 && oldPaket.foto2 !== foto2) await deleteImage(oldPaket.foto2);
    if (oldPaket.foto3 && foto3 && oldPaket.foto3 !== foto3) await deleteImage(oldPaket.foto3);
    
    // Jika foto dihapus (menjadi kosong/null) tapi sebelumnya ada
    if (oldPaket.foto1 && !foto1) await deleteImage(oldPaket.foto1);
    if (oldPaket.foto2 && !foto2) await deleteImage(oldPaket.foto2);
    if (oldPaket.foto3 && !foto3) await deleteImage(oldPaket.foto3);

    await prisma.paket.update({
      where: { id: BigInt(id) },
      data: {
        namaPaket,
        jenis: jenis as JenisPaket,
        kategori: kategori as KategoriPaket,
        jumlahPax,
        hargaPaket,
        deskripsi,
        foto1: foto1 || null,
        foto2: foto2 || null,
        foto3: foto3 || null,
      },
    });

    revalidatePath("/admin/paket");
    revalidatePath("/menu");
    return { success: "Paket berhasil diupdate" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengupdate paket" };
  }
}

// HAPUS PAKET
export async function deletePaket(id: number) {
  try {
    // Ambil data paket dulu untuk mendapatkan URL gambar
    const paket = await prisma.paket.findUnique({
      where: { id: BigInt(id) },
    });

    if (paket) {
      // Hapus gambar dari Cloudinary jika ada
      if (paket.foto1) await deleteImage(paket.foto1);
      if (paket.foto2) await deleteImage(paket.foto2);
      if (paket.foto3) await deleteImage(paket.foto3);
    }

    await prisma.paket.delete({
      where: { id: BigInt(id) },
    });

    revalidatePath("/admin/paket");
    revalidatePath("/menu");
    return { success: "Paket berhasil dihapus" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus paket" };
  }
}
