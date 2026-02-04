import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Home } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";

async function getPelanggan(pelangganId: number) {
  return await prisma.pelanggan.findUnique({
    where: { id: BigInt(pelangganId) },
    include: {
      _count: {
        select: { pemesanans: true },
      },
      pemesanans: {
        where: { statusPesan: "Selesai" },
      },
    },
  });
}

import { EditProfileDialog } from "./edit-profile-dialog";

export default async function ProfilPage() {
  const session = await auth();
  const pelangganId = Number(session?.user?.id);
  const pelanggan = await getPelanggan(pelangganId);

  if (!pelanggan) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Data pelanggan tidak ditemukan</p>
      </div>
    );
  }

  const totalPesanan = pelanggan._count.pemesanans;
  const pesananSelesai = pelanggan.pemesanans.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Profil Saya</h2>
        <EditProfileDialog user={pelanggan} />
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
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold">{pelanggan.namaPelanggan}</h3>
              <p className="text-muted-foreground">{pelanggan.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Bergabung sejak {format(new Date(pelanggan.createdAt), "dd MMMM yyyy", { locale: id })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informasi Akun */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            Informasi Pribadi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Alamat Utama
              </p>
              <p className="font-medium">{pelanggan.alamat1 || "-"}</p>
            </div>

            {pelanggan.alamat2 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Alamat Alternatif 1
                </p>
                <p className="font-medium">{pelanggan.alamat2}</p>
              </div>
            )}

            {pelanggan.alamat3 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Alamat Alternatif 2
                </p>
                <p className="font-medium">{pelanggan.alamat3}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
            <div className="relative w-full max-w-md">
              <Image
                src={pelanggan.kartuId}
                alt="KTP"
                width={400}
                height={250}
                className="rounded-lg border object-cover"
              />
            </div>
          ) : (
            <p className="text-muted-foreground">Belum ada KTP yang diunggah</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{totalPesanan}</p>
              <p className="text-sm text-muted-foreground">Total Pesanan</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{pesananSelesai}</p>
              <p className="text-sm text-muted-foreground">Pesanan Selesai</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
