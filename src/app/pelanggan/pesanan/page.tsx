import { auth } from "@/lib/auth";
import { getPemesananByPelangganId } from "@/actions/pemesanan-actions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Package, ChevronRight, AlertCircle } from "lucide-react";
import Navbar from "@/components/navbar";

export default async function PesananSayaPage() {
  const session = await auth();

  if (!session || session.user.type !== "customer") {
    redirect("/login");
  }

  const { data: pesananList, error } = await getPemesananByPelangganId(
    parseInt(session.user.id)
  );

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu_Konfirmasi":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Sedang_Diproses":
        return "bg-blue-500 hover:bg-blue-600";
      case "Menunggu_Kurir":
        return "bg-orange-500 hover:bg-orange-600";
      case "Selesai":
        return "bg-green-500 hover:bg-green-600";
      case "Dibatalkan":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : !pesananList || pesananList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Belum ada pesanan
            </h3>
            <p className="text-muted-foreground mb-6">
              Anda belum melakukan pemesanan apapun.
            </p>
            <Link href="/menu">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Pesan Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pesananList.map((pesanan) => (
              <Card key={pesanan.id.toString()} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                          {pesanan.noResi}
                        </span>
                        <Badge className={`${getStatusColor(pesanan.statusPesan)} text-white`}>
                          {formatStatus(pesanan.statusPesan)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(pesanan.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      <div className="font-medium text-lg text-orange-600">
                        {/* TypeScript safety for BigInt */}
                        {formatRupiah(Number(pesanan.totalBayar))}
                      </div>
                    </div>

                    <div className="flex-1 md:px-8">
                       <ul className="text-sm space-y-1">
                          {pesanan.detailPemesanans.slice(0, 2).map((detail, idx) => (
                            <li key={idx} className="flex justify-between text-gray-600">
                              <span>{detail.paket.namaPaket} x{Number(detail.subtotal) / detail.paket.hargaPaket}</span>
                            </li>
                          ))}
                          {pesanan.detailPemesanans.length > 2 && (
                            <li className="text-xs text-muted-foreground italic">
                              + {pesanan.detailPemesanans.length - 2} item lainnya
                            </li>
                          )}
                       </ul>
                    </div>

                    <div>
                      <Link href={`/pelanggan/pesanan/${pesanan.id}`}>
                        <Button variant="outline" className="w-full md:w-auto">
                          Detail Pesanan <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
