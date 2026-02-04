"use server";

import { prisma } from "@/lib/prisma";
import { PemesananInput, UpdateStatusPesananInput, UpdateStatusPesananSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// Tipe alias untuk status pesanan
type StatusPesan = "Menunggu_Konfirmasi" | "Sedang_Diproses" | "Menunggu_Kurir" | "Sedang_Dikirim" | "Selesai";

// Helper untuk membuat Nomor Resi
function generateNoResi(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CTR-${year}${month}${day}-${random}`;
}

// AMBIL SEMUA PEMESANAN (ADMIN)
export async function getAllPemesanan() {
  try {
    const pemesanans = await prisma.pemesanan.findMany({
      include: {
        pelanggan: true,
        jenisPembayaran: true,
        detailPemesanans: {
          include: {
            paket: true,
          },
        },
        pengirimans: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { data: pemesanans };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data pemesanan" };
  }
}

// AMBIL PEMESANAN BERDASARKAN ID PELANGGAN
export async function getPemesananByPelangganId(idPelanggan: number) {
  try {
    const pemesanans = await prisma.pemesanan.findMany({
      where: { idPelanggan: BigInt(idPelanggan) },
      include: {
        jenisPembayaran: true,
        detailPemesanans: {
          include: {
            paket: true,
          },
        },
        pengirimans: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { data: pemesanans };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data pemesanan" };
  }
}

// AMBIL PEMESANAN BERDASARKAN ID
export async function getPemesananById(id: number) {
  try {
    const pemesanan = await prisma.pemesanan.findUnique({
      where: { id: BigInt(id) },
      include: {
        pelanggan: true,
        jenisPembayaran: true,
        detailPemesanans: {
          include: {
            paket: true,
          },
        },
        pengirimans: {
          include: {
            user: true,
          },
        },
      },
    });
    return { data: pemesanan };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data pemesanan" };
  }
}

// BUAT PEMESANAN (PELANGGAN)
export async function createPemesanan(data: PemesananInput) {
  try {
    const { pelangganId, jenisPembayaranId, tglPesan, items } = data;

    // Hitung total pembayaran
    const totalBayar = items.reduce((acc, item) => acc + (item.hargaPaket * item.jumlahOrder), 0);

    // Buat pemesanan dengan transaksi database
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const pemesanan = await tx.pemesanan.create({
        data: {
          idPelanggan: BigInt(pelangganId),
          idJenisBayar: BigInt(jenisPembayaranId),
          noResi: generateNoResi(),
          tglPesan: new Date(tglPesan),
          statusPesan: "Menunggu_Konfirmasi",
          totalBayar: BigInt(totalBayar),
        },
      });

      // Buat detail pemesanan
      for (const item of items) {
        await tx.detailPemesanan.create({
          data: {
            idPemesanan: pemesanan.id,
            idPaket: BigInt(item.paketId),
            subtotal: BigInt(item.hargaPaket * item.jumlahOrder),
          },
        });
      }

      return pemesanan;
    });

    const serializedResult = JSON.parse(JSON.stringify(result, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    ));

    revalidatePath("/admin/pesanan");
    revalidatePath("/pelanggan");
    return { success: "Pesanan berhasil dibuat", data: serializedResult };
  } catch (error) {
    console.error("Error createPemesanan:", error);
    return { error: "Gagal membuat pesanan. Silakan coba lagi nanti." };
  }
}

// PERBARUI STATUS PEMESANAN (ADMIN)
export async function updateStatusPemesanan(data: UpdateStatusPesananInput) {
  try {
    const validatedData = UpdateStatusPesananSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    const { id, statusPesan } = validatedData.data;

    await prisma.pemesanan.update({
      where: { id: BigInt(id) },
      data: {
        statusPesan: statusPesan as StatusPesan,
      },
    });

    revalidatePath("/admin/pesanan");
    revalidatePath("/pelanggan");
    return { success: "Status pesanan berhasil diupdate" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengupdate status pesanan" };
  }
}

// HAPUS PEMESANAN
export async function deletePemesanan(id: number) {
  try {
    await prisma.pemesanan.delete({
      where: { id: BigInt(id) },
    });

    revalidatePath("/admin/pesanan");
    return { success: "Pesanan berhasil dihapus" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus pesanan" };
  }
}

// UNGGAH BUKTI TRANSFER
export async function uploadBuktiTransfer(pesananId: number, buktiUrl: string) {
  try {
    await prisma.pemesanan.update({
      where: { id: BigInt(pesananId) },
      data: {
        buktiTransfer: buktiUrl,
        statusPesan: "Sedang_Diproses", // Otomatis update status jika sudah upload (opsional)
      },
    });

    revalidatePath(`/pelanggan/pesanan/${pesananId}`);
    revalidatePath("/pelanggan");
    
    return { success: "Bukti transfer berhasil diupload" };
  } catch (error) {
    console.error("Upload bukti error:", error);
    return { error: "Gagal mengupdate bukti transfer" };
  }
}
