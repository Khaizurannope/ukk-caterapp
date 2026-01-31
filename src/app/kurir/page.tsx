import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, CheckCircle } from "lucide-react";

async function getKurirStats(idUser: number) {
  const [sedangDikirim, selesai] = await Promise.all([
    prisma.pengiriman.count({
      where: { idUser: BigInt(idUser), statusKirim: "Sedang_Dikirim" },
    }),
    prisma.pengiriman.count({
      where: { idUser: BigInt(idUser), statusKirim: "Tiba_Ditujuan" },
    }),
  ]);

  const pengirimanAktif = await prisma.pengiriman.findMany({
    where: { idUser: BigInt(idUser), statusKirim: "Sedang_Dikirim" },
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

  return { sedangDikirim, selesai, pengirimanAktif };
}

export default async function KurirDashboardPage() {
  const session = await auth();
  const idUser = parseInt(session?.user?.id || "0");

  const stats = await getKurirStats(idUser);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Kurir</h1>
        <p className="text-muted-foreground">Selamat datang, {session?.user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Sedang Dikirim
            </CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{stats.sedangDikirim}</div>
            <p className="text-xs text-blue-700">pengiriman aktif</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Selesai
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">{stats.selesai}</div>
            <p className="text-xs text-green-700">pengiriman berhasil</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pengiriman Aktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.pengirimanAktif.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada pengiriman aktif saat ini
            </p>
          ) : (
            <div className="space-y-4">
              {stats.pengirimanAktif.map((pengiriman) => (
                <div
                  key={pengiriman.id.toString()}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">
                        {pengiriman.pemesanan.noResi}
                      </p>
                      <p className="font-medium text-lg">
                        {pengiriman.pemesanan.pelanggan.namaPelanggan}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pengiriman.pemesanan.pelanggan.telepon}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Sedang Dikirim
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Alamat Pengiriman:</p>
                    <p className="text-sm text-muted-foreground">
                      {pengiriman.pemesanan.pelanggan.alamat1 || "Tidak ada alamat"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Items:</p>
                    <div className="space-y-1">
                      {pengiriman.pemesanan.detailPemesanans.map((detail) => (
                        <p key={detail.idPaket.toString()} className="text-sm text-muted-foreground">
                          • {detail.paket.namaPaket}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
