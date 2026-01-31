import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Clock, ArrowRight } from "lucide-react";

async function getPesananHistory(pelangganId: number) {
  return await prisma.pemesanan.findMany({
    where: {
      idPelanggan: BigInt(pelangganId),
      pengirimans: {
        some: {
          statusKirim: "Tiba_Ditujuan",
        },
      },
    },
    include: {
      detailPemesanans: {
        include: {
          paket: true,
        },
      },
      pengirimans: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function RiwayatPesananPage() {
  const session = await auth();
  const pelangganId = Number(session?.user?.id);
  const pesananList = await getPesananHistory(pelangganId);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Riwayat Pesanan</h2>

      {pesananList.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Riwayat</h3>
            <p className="text-muted-foreground mb-4">
              Anda belum memiliki pesanan yang selesai
            </p>
            <Link href="/menu">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Pesan Sekarang
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
                    <Badge className="bg-green-100 text-green-800">
                      Selesai
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {pesanan.detailPemesanans.length} item • Total
                      </p>
                      <p className="font-bold text-orange-600">
                        {formatRupiah(totalHarga)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/pelanggan/pesanan/${pesanan.id}`}>
                        <Button variant="outline" size="sm">
                          Lihat Detail
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      <Link href="/menu">
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Pesan Lagi
                        </Button>
                      </Link>
                    </div>
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
