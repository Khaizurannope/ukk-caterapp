import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";

async function getAllPengiriman() {
  return await prisma.pengiriman.findMany({
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
}

export default async function AdminPengirimanPage() {
  const pengirimans = await getAllPengiriman();

  const statusColor = (status: string) => {
    switch (status) {
      case "Sedang_Dikirim":
        return "bg-blue-100 text-blue-800";
      case "Tiba_Ditujuan":
        return "bg-green-100 text-green-800";
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
        <h1 className="text-2xl font-bold text-gray-900">Data Pengiriman</h1>
        <p className="text-muted-foreground">Tracking pengiriman pesanan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengiriman ({pengirimans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pengirimans.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada data pengiriman
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Resi</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Kurir</TableHead>
                    <TableHead>Waktu Kirim</TableHead>
                    <TableHead>Waktu Tiba</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengirimans.map((pengiriman) => (
                    <TableRow key={pengiriman.id.toString()}>
                      <TableCell className="font-mono text-sm">
                        {pengiriman.pemesanan.noResi}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {pengiriman.pemesanan.pelanggan.namaPelanggan}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {pengiriman.pemesanan.pelanggan.telepon}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {pengiriman.pemesanan.pelanggan.alamat1 || "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {pengiriman.user.name}
                      </TableCell>
                      <TableCell>
                        {pengiriman.tglKirim
                          ? format(pengiriman.tglKirim, "dd MMM yyyy, HH:mm", { locale: id })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {pengiriman.tglTiba
                          ? format(pengiriman.tglTiba, "dd MMM yyyy, HH:mm", { locale: id })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(pengiriman.statusKirim)}>
                          {statusLabel(pengiriman.statusKirim)}
                        </Badge>
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
