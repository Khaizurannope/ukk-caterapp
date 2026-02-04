import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Home, 
  ArrowLeft,
  ShoppingBag 
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeletePelangganButton from "../delete-button";

async function getPelangganById(pelangganId: string) {
  return await prisma.pelanggan.findUnique({
    where: { id: BigInt(pelangganId) },
    include: {
      pemesanans: {
        orderBy: { tglPesan: "desc" },
        take: 5,
      },
      _count: {
        select: { pemesanans: true },
      },
    },
  });
}

export default async function AdminPelangganDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pelangganId } = await params;
  const pelanggan = await getPelangganById(pelangganId);

  if (!pelanggan) {
    notFound();
  }

  const totalPesanan = pelanggan._count.pemesanans;
  const pesananSelesai = pelanggan.pemesanans.filter(p => p.statusPesan === "Selesai").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pelanggan">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Pelanggan</h1>
            <p className="text-muted-foreground">Informasi lengkap pelanggan</p>
          </div>
        </div>
        <DeletePelangganButton 
          id={Number(pelanggan.id)} 
          nama={pelanggan.namaPelanggan}
          hasPesanan={totalPesanan > 0}
        />
      </div>

      {/* Foto Profil & Nama */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              {pelanggan.foto ? (
                <AvatarImage src={pelanggan.foto} alt={pelanggan.namaPelanggan} />
              ) : null}
              <AvatarFallback className="text-2xl bg-orange-100 text-orange-600">
                {pelanggan.namaPelanggan.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl font-bold">{pelanggan.namaPelanggan}</h3>
              <p className="text-muted-foreground">{pelanggan.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Bergabung sejak {format(new Date(pelanggan.createdAt), "dd MMMM yyyy", { locale: id })}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{totalPesanan}</p>
                <p className="text-xs text-muted-foreground">Total Pesanan</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{pesananSelesai}</p>
                <p className="text-xs text-muted-foreground">Selesai</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informasi Pribadi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-orange-500" />
              Informasi Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nama Lengkap
                </p>
                <p className="font-medium">{pelanggan.namaPelanggan}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium">{pelanggan.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  No. Telepon
                </p>
                <p className="font-medium">{pelanggan.telepon || "-"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Tanggal Lahir
                </p>
                <p className="font-medium">
                  {pelanggan.tglLahir 
                    ? format(new Date(pelanggan.tglLahir), "dd MMMM yyyy", { locale: id })
                    : "-"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alamat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-orange-500" />
              Alamat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Alamat Utama
              </p>
              <p className="font-medium">{pelanggan.alamat1 || "-"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Alamat Alternatif 1
              </p>
              <p className="font-medium">{pelanggan.alamat2 || "-"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Alamat Alternatif 2
              </p>
              <p className="font-medium">{pelanggan.alamat3 || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KTP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-500" />
            Kartu Identitas (KTP)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pelanggan.kartuId ? (
            <div className="space-y-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✓ KTP Terverifikasi
              </Badge>
              <div className="relative w-full max-w-lg">
                <Image
                  src={pelanggan.kartuId}
                  alt="KTP"
                  width={500}
                  height={300}
                  className="rounded-lg border object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-500">
              <Badge variant="destructive">✗ KTP Belum Diupload</Badge>
              <span className="text-sm">Pelanggan belum mengunggah KTP</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Riwayat Pesanan Terakhir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            Pesanan Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pelanggan.pemesanans.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Belum ada pesanan
            </p>
          ) : (
            <div className="space-y-3">
              {pelanggan.pemesanans.map((pesanan) => (
                <div 
                  key={pesanan.id.toString()} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Pesanan #{pesanan.id.toString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(pesanan.tglPesan), "dd MMM yyyy", { locale: id })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={pesanan.statusPesan === "Selesai" ? "default" : "secondary"}
                    >
                      {pesanan.statusPesan.replace(/_/g, " ")}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      Rp {pesanan.totalBayar.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
              {totalPesanan > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  dan {totalPesanan - 5} pesanan lainnya...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
