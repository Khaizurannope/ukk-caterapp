import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import UpdateDeliveryButton from "./update-button";

async function getPengirimanByKurir(idUser: number) {
  return await prisma.pengiriman.findMany({
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
}

export default async function KurirPengirimanPage() {
  const session = await auth();
  const idUser = parseInt(session?.user?.id || "0");
  const pengirimans = await getPengirimanByKurir(idUser);

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
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pengiriman</h1>
        <p className="text-muted-foreground">Riwayat pengiriman Anda</p>
      </div>

      {pengirimans.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <p className="text-center text-muted-foreground">
              Belum ada penugasan pengiriman
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pengirimans.map((pengiriman) => (
            <Card key={pengiriman.id.toString()}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">
                      {pengiriman.pemesanan.noResi}
                    </p>
                    <CardTitle className="text-lg">
                      {pengiriman.pemesanan.pelanggan.namaPelanggan}
                    </CardTitle>
                  </div>
                  <Badge className={statusColor(pengiriman.statusKirim)}>
                    {statusLabel(pengiriman.statusKirim)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Telepon:</p>
                    <p className="text-sm text-muted-foreground">
                      {pengiriman.pemesanan.pelanggan.telepon || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alamat:</p>
                    <p className="text-sm text-muted-foreground">
                      {pengiriman.pemesanan.pelanggan.alamat1 || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Items:</p>
                  <div className="space-y-1">
                    {pengiriman.pemesanan.detailPemesanans.map((detail) => (
                      <div
                        key={detail.idPaket.toString()}
                        className="flex justify-between text-sm"
                      >
                        <span>{detail.paket.namaPaket}</span>
                        <span className="text-muted-foreground">
                          {detail.paket.jenis}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    {pengiriman.tglKirim && (
                      <p>
                        Dikirim: {format(pengiriman.tglKirim, "dd MMM yyyy, HH:mm", { locale: id })}
                      </p>
                    )}
                    {pengiriman.tglTiba && (
                      <p>
                        Tiba: {format(pengiriman.tglTiba, "dd MMM yyyy, HH:mm", { locale: id })}
                      </p>
                    )}
                  </div>

                  {pengiriman.statusKirim === "Sedang_Dikirim" && (
                    <UpdateDeliveryButton id={Number(pengiriman.id)} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
