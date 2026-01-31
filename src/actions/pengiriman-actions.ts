"use server";

import { prisma } from "@/lib/prisma";
import { AssignKurirInput, UpdatePengirimanInput, UpdatePengirimanSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// Tipe alias untuk status pengiriman
type StatusKirim = "Sedang_Dikirim" | "Tiba_Ditujuan";

// AMBIL PENGIRIMAN BERDASARKAN ID KURIR
export async function getPengirimanByKurirId(idUser: number) {
  try {
    const pengirimans = await prisma.pengiriman.findMany({
      where: { idUser: BigInt(idUser) },
      include: {
        pemesanan: {
          include: {
            pelanggan: true,
            detailPemesanans: {
              include: {
                paket: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { data: pengirimans };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data pengiriman" };
  }
}

// AMBIL SEMUA PENGIRIMAN (ADMIN)
export async function getAllPengiriman() {
  try {
    const pengirimans = await prisma.pengiriman.findMany({
      include: {
        user: true,
        pemesanan: {
          include: {
            pelanggan: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { data: pengirimans };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data pengiriman" };
  }
}

// TUGASKAN KURIR (ADMIN)
export async function assignKurir(data: AssignKurirInput) {
  try {
    const { idPesan, idUser } = data;

    // Buat data pengiriman
    await prisma.pengiriman.create({
      data: {
        idPesan: BigInt(idPesan),
        idUser: BigInt(idUser),
        statusKirim: "Sedang_Dikirim",
        tglKirim: new Date(),
      },
    });

    // Perbarui status pemesanan
    await prisma.pemesanan.update({
      where: { id: BigInt(idPesan) },
      data: { statusPesan: "Sedang_Dikirim" },
    });

    revalidatePath("/admin/pesanan");
    revalidatePath("/admin/pengiriman");
    revalidatePath("/kurir");
    return { success: "Kurir berhasil ditugaskan" };
  } catch (error: any) {
    console.error("Assign kurir error:", error);
    return { error: `Gagal: ${error.message}` };
  }
}

// PERBARUI PENGIRIMAN (KURIR)
export async function updatePengiriman(data: UpdatePengirimanInput) {
  try {
    const validatedData = UpdatePengirimanSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    const { id, statusKirim, buktiFoto } = validatedData.data;

    const updateData: {
      statusKirim: StatusKirim;
      buktiFoto?: string;
      tglTiba?: Date;
    } = {
      statusKirim: statusKirim as StatusKirim,
    };

    if (buktiFoto) {
      updateData.buktiFoto = buktiFoto;
    }

    if (statusKirim === "Tiba_Ditujuan") {
      updateData.tglTiba = new Date();
    }

    const updatedPengiriman = await prisma.pengiriman.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    // Perbarui Status Pesanan menjadi Selesai jika sudah Tiba
    if (statusKirim === "Tiba_Ditujuan") {
        await prisma.pemesanan.update({
            where: { id: updatedPengiriman.idPesan },
            data: { statusPesan: "Selesai" }
        })
    }

    revalidatePath("/kurir");
    revalidatePath("/kurir/pengiriman");
    revalidatePath("/admin/pengiriman");
    return { success: "Status pengiriman berhasil diupdate" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengupdate pengiriman" };
  }
}

// AMBIL SEMUA KURIR
export async function getAllKurir() {
  try {
    const kurirs = await prisma.user.findMany({
      where: { level: "kurir" },
      orderBy: { name: "asc" },
    });
    return { data: kurirs };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data kurir" };
  }
}
