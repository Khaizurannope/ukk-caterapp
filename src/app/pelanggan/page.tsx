import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";

async function getActivePesanan(pelangganId: number) {
  return await prisma.pemesanan.findMany({
    where: {
      idPelanggan: BigInt(pelangganId),
      statusPesan: {
        in: ["Menunggu_Konfirmasi", "Sedang_Diproses", "Menunggu_Kurir"],
      },
    },
    include: {
      detailPemesanans: {
        include: {
          paket: true,
        },
      },
      pengirimans: true,
      jenisPembayaran: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function PelangganDashboard() {
  const session = await auth();
  const pelangganId = Number(session?.user?.id);
  const pesananList = await getActivePesanan(pelangganId);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Proses":
        return "bg-blue-100 text-blue-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDeliveryStatus = (status?: string) => {
    switch (status) {
      case "Dikirim":
        return "bg-blue-100 text-blue-800";
      case "Tiba_Ditujuan":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pesanan Aktif</h2>
        <Link href="/menu">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Pesan Lagi
          </Button>
        </Link>
      </div>

      {pesananList.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Belum Ada Pesanan Aktif
            </h3>
            <p className="text-muted-foreground mb-4">
              Anda belum memiliki pesanan yang sedang diproses
            </p>
            <Link href="/menu">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Lihat Menu
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pesananList.map((pesanan) => {
            const totalHarga = pesanan.detailPemesanans.reduce(
              (sum, detail) => sum + Number(detail.subtotal),
              0
            );
            const pengiriman = pesanan.pengirimans[0];

            return (
              <Card key={pesanan.id.toString()}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Pesanan #{pesanan.id.toString()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(pesanan.tglPesan), "dd MMMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(pesanan.statusPesan)}>
                        {pesanan.statusPesan.replace(/_/g, " ")}
                      </Badge>
                      {pengiriman && (
                        <Badge
                          className={getDeliveryStatus(
                            pengiriman.statusKirim
                          )}
                        >
                          {pengiriman.statusKirim?.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-2">
                    {pesanan.detailPemesanans.map((detail) => (
                      <div
                        key={`${detail.idPemesanan}-${detail.idPaket}`}
                        className="flex justify-between text-sm"
                      >
                        <span>{detail.paket.namaPaket}</span>
                        <span>{formatRupiah(Number(detail.subtotal))}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-bold text-orange-600">
                        {formatRupiah(totalHarga)}
                      </p>
                    </div>
                    <Link href={`/pelanggan/pesanan/${pesanan.id}`}>
                      <Button variant="outline" size="sm">
                        Lihat Detail
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
