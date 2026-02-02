"use server";

import { prisma } from "@/lib/prisma";


// Helper untuk serialisasi BigInt
const serializeData = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// AMBIL DATA DASHBOARD (OWNER)
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
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);

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

    // Statistik Status Pesanan (Monitoring) - Pesanan bulanan dikelompokkan berdasarkan status
    const statusStats = await prisma.pemesanan.groupBy({
      by: ['statusPesan'],
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      _count: {
        id: true
      }
    });

    // Statistik Harian (7 Hari Terakhir) untuk Grafik
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);
    last7Days.setHours(0,0,0,0);
    
    const dailyStats = await prisma.pemesanan.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: last7Days
        }
      },
      _sum: {
        totalBayar: true,
      },
      _count: {
        id: true
      }
    });

    // Normalisasi statistik harian (karena groupBy createdAt termasuk waktu, ini rumit.
    // Prisma tidak mendukung pengelompokan hanya Tanggal tanpa raw query.
    // Solusi: ambil pesanan 7 hari terakhir dan proses di JavaScript)
    const ordersLast7Days = await prisma.pemesanan.findMany({
       where: { createdAt: { gte: last7Days } },
       select: { createdAt: true, totalBayar: true }
    });

    return {
      data: serializeData({
        pesananHariIni,
        pendapatanHariIni: Number(pendapatanHariIni._sum.totalBayar || 0),
        pesananBulanIni,
        pendapatanBulanIni: Number(pendapatanBulanIni._sum.totalBayar || 0),
        totalPelanggan,
        totalPaket,
        pesananTerbaru,
        statusStats: statusStats.map(s => ({ status: s.statusPesan, count: s._count.id })),
        ordersLast7Days
      }),
    };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil data dashboard" };
  }
}

// AMBIL LAPORAN TRANSAKSI (OWNER)
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

    return { data: serializeData(transaksi), total };
  } catch (error) {
    console.error(error);
    return { error: "Gagal mengambil laporan transaksi" };
  }
}
