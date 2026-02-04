import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import UploadBukti from "./upload-bukti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Utensils,
  CheckCircle,
} from "lucide-react";

async function getPesananDetail(pesananId: string, pelangganId: number) {
  return await prisma.pemesanan.findFirst({
    where: {
      id: BigInt(pesananId),
      idPelanggan: BigInt(pelangganId),
    },
    include: {
      pelanggan: true,
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
      jenisPembayaran: {
        include: {
          detailJenisPembayarans: true,
        },
      },
    },
  });
}

export default async function PesananDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session || session.user?.type !== "customer") {
    redirect("/login");
  }

  const { id: pesananId } = await params;
  const pelangganId = Number(session.user.id);
  const pesanan = await getPesananDetail(pesananId, pelangganId);

  if (!pesanan) {
    notFound();
  }

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
        return "bg-yellow-100 text-yellow-800";
      case "Sedang_Diproses":
        return "bg-blue-100 text-blue-800";
      case "Sedang_Dikirim":
        return "bg-orange-100 text-orange-800";
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

  const totalHarga = pesanan.detailPemesanans.reduce(
    (sum, detail) => sum + Number(detail.subtotal),
    0
  );

  const pengiriman = pesanan.pengirimans[0];

  // Order status steps
  const steps = [
    {
      label: "Pesanan Dibuat",
      description: "Menunggu konfirmasi",
      icon: Package,
      completed: true,
    },
    {
      label: "Diproses",
      description: "Pesanan sedang disiapkan",
      icon: CheckCircle,
      completed: pesanan.statusPesan !== "Menunggu_Konfirmasi",
    },
    {
      label: "Dikirim",
      description: "Pesanan dalam pengiriman",
      icon: Truck,
      completed: pesanan.statusPesan === "Sedang_Dikirim" || 
                 pesanan.statusPesan === "Selesai",
    },
    {
      label: "Selesai",
      description: "Pesanan telah sampai",
      icon: CheckCircle,
      completed: pesanan.statusPesan === "Selesai",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/pelanggan"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-orange-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Link>
        <Badge className={getStatusColor(pesanan.statusPesan)}>
          {pesanan.statusPesan}
        </Badge>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Pesanan #{pesanan.id.toString()}</h2>
        <p className="text-muted-foreground">
          {format(new Date(pesanan.tglPesan), "EEEE, dd MMMM yyyy", {
            locale: id,
          })}
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <p
                  className={`text-xs mt-2 text-center ${
                    step.completed
                      ? "text-green-600 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute h-0.5 w-full top-5 left-1/2 -z-10 ${
                      step.completed ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-orange-500" />
            Item Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pesanan.detailPemesanans.map((detail) => (
            <div
              key={`${detail.idPemesanan}-${detail.idPaket}`}
              className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
            >
              <div className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {detail.paket.foto1 ? (
                  <Image
                    src={detail.paket.foto1}
                    alt={detail.paket.namaPaket}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Utensils className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{detail.paket.namaPaket}</h4>
                <p className="text-sm text-muted-foreground">
                  {detail.paket.jenis} • {detail.paket.jumlahPax} pax/paket
                </p>
              </div>
              <p className="font-semibold">
                {formatRupiah(Number(detail.subtotal))}
              </p>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-orange-600">{formatRupiah(totalHarga)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              Alamat Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{pesanan.pelanggan.alamat1 || "-"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-500" />
              Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">
                {pesanan.jenisPembayaran?.metodePembayaran || "-"}
              </p>
              {pesanan.jenisPembayaran?.detailJenisPembayarans[0] && (
                <p className="text-sm text-muted-foreground mt-1">
                  {pesanan.jenisPembayaran.detailJenisPembayarans[0].tempatBayar} -{" "}
                  {pesanan.jenisPembayaran.detailJenisPembayarans[0].noRek}
                </p>
              )}
            </div>

            <Separator />

            <div>
              <div className="flex justify-between items-center mb-3">
                 <p className="text-sm font-semibold">Bukti Transfer</p>
                 {pesanan.buktiTransfer && (
                     <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Terupload
                     </Badge>
                 )}
              </div>
               
              {pesanan.buktiTransfer && (
                   <div className="relative aspect-video w-full bg-gray-100 rounded-md overflow-hidden border mb-3">
                       <Image 
                           src={pesanan.buktiTransfer}
                           alt="Bukti Transfer"
                           fill
                           className="object-cover"
                       />
                   </div>
               )}
               
               <UploadBukti pesananId={Number(pesanan.id)} currentBukti={pesanan.buktiTransfer} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Tracking */}
      {pengiriman && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-500" />
              Informasi Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge className={getDeliveryStatus(pengiriman.statusKirim)}>
                {pengiriman.statusKirim?.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kurir</span>
              <span>{pengiriman.user?.name || "-"}</span>
            </div>
            {pengiriman.tglKirim && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal Kirim</span>
                <span>
                  {format(
                    new Date(pengiriman.tglKirim),
                    "dd MMMM yyyy",
                    { locale: id }
                  )}
                </span>
              </div>
            )}
            {pengiriman.buktiFoto && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Bukti Pengiriman:
                </p>
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={pengiriman.buktiFoto}
                    alt="Bukti pengiriman"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
