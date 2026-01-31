"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET ALL JENIS PEMBAYARAN
export async function getAllJenisPembayaran() {
  try {
    const data = await prisma.jenisPembayaran.findMany({
      include: {
        detailJenisPembayarans: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data metode pembayaran" };
  }
}

// Alias for checkout page
export async function getJenisPembayaran() {
  try {
    const data = await prisma.jenisPembayaran.findMany({
      include: {
        detailJenisPembayarans: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal mengambil data metode pembayaran" };
  }
}

// GET ALL PELANGGAN
export async function getAllPelanggan() {
  try {
    const data = await prisma.pelanggan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data pelanggan" };
  }
}

// GET PELANGGAN BY ID
export async function getPelangganById(id: number) {
  try {
    const data = await prisma.pelanggan.findUnique({
      where: { id: BigInt(id) },
    });
    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data pelanggan" };
  }
}

// DELETE PELANGGAN
export async function deletePelanggan(id: number) {
  try {
    await prisma.pelanggan.delete({
      where: { id: BigInt(id) },
    });

    revalidatePath("/admin/pelanggan");
    return { success: "Pelanggan berhasil dihapus" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus pelanggan" };
  }
}
