"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET DASHBOARD DATA (OWNER)
export async function getDashboardOwner() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total pesanan hari ini
    const pesananHariIni = await prisma.pemesanan.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Total pendapatan hari ini
    const pendapatanHariIni = await prisma.pemesanan.aggregate({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _sum: {
        totalBayar: true,
      },
    });

    // Total pesanan bulan ini
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const pesananBulanIni = await prisma.pemesanan.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });

    // Total pendapatan bulan ini
    const pendapatanBulanIni = await prisma.pemesanan.aggregate({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _sum: {
        totalBayar: true,
      },
    });

    // Total pelanggan
    const totalPelanggan = await prisma.pelanggan.count();

    // Total paket
    const totalPaket = await prisma.paket.count();

    // Pesanan terbaru (5)
    const pesananTerbaru = await prisma.pemesanan.findMany({
      take: 5,
      include: {
        pelanggan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      data: {
        pesananHariIni,
        pendapatanHariIni: Number(pendapatanHariIni._sum.totalBayar || 0),
        pesananBulanIni,
        pendapatanBulanIni: Number(pendapatanBulanIni._sum.totalBayar || 0),
        totalPelanggan,
        totalPaket,
        pesananTerbaru,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data dashboard" };
  }
}

// GET LAPORAN TRANSAKSI (OWNER)
export async function getLaporanTransaksi(startDate?: Date, endDate?: Date) {
  try {
    const where: {
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const transaksi = await prisma.pemesanan.findMany({
      where,
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

    // Hitung total
    const total = transaksi.reduce((acc: number, t: { totalBayar: bigint | null }) => acc + Number(t.totalBayar || 0), 0);

    revalidatePath("/owner/laporan");
    return { data: transaksi, total };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil laporan transaksi" };
  }
}
