import { getLaporanTransaksi } from "@/actions/dashboard-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Transaksi = {
  id: string | number;
  noResi: string;
  createdAt: string | Date;
  statusPesan: string;
  totalBayar: number | string;
  pelanggan: {
    namaPelanggan: string;
    telepon: string;
  };
  jenisPembayaran: {
    metodePembayaran: string;
  };
};

export default async function OwnerLaporanPage() {
  const result = await getLaporanTransaksi();

  if (result.error || !result.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Gagal memuat laporan</p>
      </div>
    );
  }

  const transaksi = result.data;
  const total = result.total || 0;

  const formatRupiah = (value: number | bigint) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Laporan Transaksi</h1>
        <p className="text-muted-foreground">Riwayat semua transaksi pesanan</p>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardHeader>
          <CardTitle className="text-white/80">Total Pendapatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatRupiah(total)}</div>
          <p className="text-white/80">dari {transaksi.length} transaksi</p>
        </CardContent>
      </Card>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {transaksi.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada transaksi
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Resi</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Pembayaran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(transaksi as Transaksi[]).map((t) => (
                    <TableRow key={t.id.toString()}>
                      <TableCell className="font-mono text-sm">
                        {t.noResi}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{t.pelanggan.namaPelanggan}</p>
                          <p className="text-sm text-muted-foreground">
                            {t.pelanggan.telepon}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(t.createdAt), "dd MMM yyyy", { locale: id })}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(t.createdAt), "HH:mm", { locale: id })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {t.jenisPembayaran.metodePembayaran}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(t.statusPesan)}>
                          {statusLabel(t.statusPesan)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatRupiah(Number(t.totalBayar))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
