import { getDashboardOwner } from "@/actions/dashboard-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ShoppingCart, Users, Package, DollarSign, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function OwnerDashboardPage() {
  const result = await getDashboardOwner();

  if (result.error || !result.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Gagal memuat data dashboard</p>
      </div>
    );
  }

  const stats = result.data;

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Owner</h1>
        <p className="text-muted-foreground">Ringkasan performa bisnis catering</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Pendapatan Hari Ini
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {formatRupiah(stats.pendapatanHariIni)}
            </div>
            <p className="text-xs text-green-700">
              dari {stats.pesananHariIni} pesanan
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Pendapatan Bulan Ini
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {formatRupiah(stats.pendapatanBulanIni)}
            </div>
            <p className="text-xs text-blue-700">
              dari {stats.pesananBulanIni} pesanan
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Total Pelanggan
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {stats.totalPelanggan}
            </div>
            <p className="text-xs text-purple-700">pelanggan terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Menu Paket
            </CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPaket}</div>
            <p className="text-xs text-muted-foreground">menu tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pesanan Hari Ini
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pesananHariIni}</div>
            <p className="text-xs text-muted-foreground">pesanan masuk</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pesanan Bulan Ini
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pesananBulanIni}</div>
            <p className="text-xs text-muted-foreground">total pesanan</p>
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
                    <Badge variant="outline">
                      {statusLabel(pesanan.statusPesan)}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      {formatRupiah(Number(pesanan.totalBayar))}
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
