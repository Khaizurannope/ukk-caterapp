import { getDashboardOwner } from "@/actions/dashboard-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ShoppingCart, Users, Package, DollarSign, Calendar, Activity } from "lucide-react";
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

      {/* Order Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Status Pesanan (Bulan Ini)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {stats.statusStats && stats.statusStats.length > 0 ? (
               stats.statusStats.map((s: any) => {
                 const percentage = stats.pesananBulanIni > 0 
                   ? Math.min((s.count / stats.pesananBulanIni) * 100, 100) 
                   : 0;
                 
                 // Color mapping for each status
                 const getStatusColor = (status: string) => {
                   switch (status) {
                     case "Menunggu_Konfirmasi":
                       return { bar: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", dot: "bg-yellow-500" };
                     case "Sedang_Diproses":
                       return { bar: "bg-blue-500", badge: "bg-blue-100 text-blue-800 hover:bg-blue-100", dot: "bg-blue-500" };
                     case "Menunggu_Kurir":
                       return { bar: "bg-purple-500", badge: "bg-purple-100 text-purple-800 hover:bg-purple-100", dot: "bg-purple-500" };
                     case "Sedang_Dikirim":
                       return { bar: "bg-orange-500", badge: "bg-orange-100 text-orange-800 hover:bg-orange-100", dot: "bg-orange-500" };
                     case "Selesai":
                       return { bar: "bg-green-500", badge: "bg-green-100 text-green-800 hover:bg-green-100", dot: "bg-green-500" };
                     default:
                       return { bar: "bg-gray-500", badge: "bg-gray-100 text-gray-800 hover:bg-gray-100", dot: "bg-gray-500" };
                   }
                 };
                 
                 const colors = getStatusColor(s.status);
                 
                 return (
                   <div key={s.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        <span className="text-sm font-medium">{statusLabel(s.status)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                           <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                  className={`h-full ${colors.bar}`}
                                  style={{ width: `${percentage}%` }} 
                              />
                           </div>
                           <Badge className={colors.badge}>{s.count}</Badge>
                      </div>
                   </div>
                 );
               })
            ) : (
                <p className="text-sm text-muted-foreground">Belum ada data status pesanan.</p>
            )}
          </CardContent>
        </Card>

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
              stats.pesananTerbaru.map((pesanan: any) => (
                <div
                  key={pesanan.id.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{pesanan.pelanggan.namaPelanggan}</p>
                    <p className="text-sm text-muted-foreground">
                      {pesanan.noResi} • {format(new Date(pesanan.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
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
