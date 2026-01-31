import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, Truck, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

async function getAdminStats() {
  const [totalPaket, totalPelanggan, totalPesanan, pesananMenunggu, pesananProses, pengirimanAktif] = await Promise.all([
    prisma.paket.count(),
    prisma.pelanggan.count(),
    prisma.pemesanan.count(),
    prisma.pemesanan.count({ where: { statusPesan: "Menunggu_Konfirmasi" } }),
    prisma.pemesanan.count({ where: { statusPesan: "Sedang_Diproses" } }),
    prisma.pengiriman.count({ where: { statusKirim: "Sedang_Dikirim" } }),
  ]);

  const pesananTerbaru = await prisma.pemesanan.findMany({
    take: 5,
    include: {
      pelanggan: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    totalPaket,
    totalPelanggan,
    totalPesanan,
    pesananMenunggu,
    pesananProses,
    pengirimanAktif,
    pesananTerbaru,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const statusColor = (status: string) => {
    switch (status) {
      case "Menunggu_Konfirmasi":
        return "bg-yellow-100 text-yellow-800";
      case "Sedang_Diproses":
        return "bg-blue-100 text-blue-800";
      case "Menunggu_Kurir":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-muted-foreground">Selamat datang di panel administrasi</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paket
            </CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPaket}</div>
            <p className="text-xs text-muted-foreground">Menu catering tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pelanggan
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPelanggan}</div>
            <p className="text-xs text-muted-foreground">Pelanggan terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pesanan
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPesanan}</div>
            <p className="text-xs text-muted-foreground">Semua pesanan</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">
              Menunggu Konfirmasi
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{stats.pesananMenunggu}</div>
            <p className="text-xs text-yellow-700">Perlu tindakan segera</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Sedang Diproses
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{stats.pesananProses}</div>
            <p className="text-xs text-blue-700">Dalam pengerjaan</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Pengiriman Aktif
            </CardTitle>
            <Truck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{stats.pengirimanAktif}</div>
            <p className="text-xs text-purple-700">Sedang dikirim</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.pesananTerbaru.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada pesanan
              </p>
            ) : (
              stats.pesananTerbaru.map((pesanan) => (
                <div
                  key={pesanan.id.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{pesanan.pelanggan.namaPelanggan}</p>
                    <p className="text-sm text-muted-foreground">
                      {pesanan.noResi} • {format(pesanan.createdAt, "dd MMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={statusColor(pesanan.statusPesan)}>
                      {statusLabel(pesanan.statusPesan)}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      Rp {Number(pesanan.totalBayar).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
