import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UpdateStatusForm from "./update-status-form";
import AssignKurirForm from "./assign-kurir-form";
import ViewBukti from "./view-bukti";

async function getAllPesanan() {
  return await prisma.pemesanan.findMany({
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
}

async function getAllKurir() {
  return await prisma.user.findMany({
    where: { level: "kurir" },
  });
}

export default async function AdminPesananPage() {
  const [pesanans, kurirs] = await Promise.all([
    getAllPesanan(),
    getAllKurir(),
  ]);

  const statusColor = (status: string) => {
    switch (status) {
      case "Menunggu_Konfirmasi":
        return "bg-yellow-100 text-yellow-800";
      case "Sedang_Diproses":
        return "bg-blue-100 text-blue-800";
      case "Menunggu_Kurir":
        return "bg-purple-100 text-purple-800";
      case "Sedang_Dikirim":
        return "bg-orange-100 text-orange-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

  const formatRupiah = (value: number | bigint) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pesanan Masuk</h1>
        <p className="text-muted-foreground">Kelola pesanan dari pelanggan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          {pesanans.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada pesanan
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Resi</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Bukti Bayar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kurir</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pesanans.map((pesanan) => (
                    <TableRow key={pesanan.id.toString()}>
                      <TableCell className="font-mono text-sm">
                        {pesanan.noResi}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pesanan.pelanggan.namaPelanggan}</p>
                          <p className="text-sm text-muted-foreground">
                            {pesanan.pelanggan.telepon}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(pesanan.createdAt, "dd MMM yyyy", { locale: id })}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {format(pesanan.createdAt, "HH:mm", { locale: id })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {pesanan.detailPemesanans.map((detail) => (
                            <p key={detail.idPaket.toString()} className="text-sm">
                              {detail.paket.namaPaket}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatRupiah(pesanan.totalBayar)}
                      </TableCell>
                      <TableCell>
                        <ViewBukti buktiUrl={pesanan.buktiTransfer} />
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(pesanan.statusPesan)}>
                          {statusLabel(pesanan.statusPesan)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pesanan.pengirimans.length > 0 ? (
                          <div>
                            <p className="font-medium">
                              {pesanan.pengirimans[0].user.name}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {statusLabel(pesanan.pengirimans[0].statusKirim)}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          {pesanan.statusPesan === "Menunggu_Konfirmasi" && (
                            <UpdateStatusForm
                              id={Number(pesanan.id)}
                              currentStatus="Menunggu_Konfirmasi"
                              nextStatus="Sedang_Diproses"
                              label="Konfirmasi"
                            />
                          )}
                          {pesanan.statusPesan === "Sedang_Diproses" && (
                            <AssignKurirForm
                              idPesan={Number(pesanan.id)}
                              kurirs={kurirs.map((k) => ({
                                id: Number(k.id),
                                name: k.name,
                              }))}
                            />
                          )}
                        </div>
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
