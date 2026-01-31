import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

async function getPelanggan(pelangganId: number) {
  return await prisma.pelanggan.findUnique({
    where: { id: BigInt(pelangganId) },
  });
}

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profil Saya</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            Informasi Akun
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
                Bergabung Sejak
              </p>
              <p className="font-medium">
                {format(new Date(pelanggan.createdAt), "dd MMMM yyyy", {
                  locale: id,
                })}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Alamat
            </p>
            <p className="font-medium">{pelanggan.alamat1 || "-"}</p>
          </div>
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
              <p className="text-2xl font-bold text-orange-600">-</p>
              <p className="text-sm text-muted-foreground">Total Pesanan</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">-</p>
              <p className="text-sm text-muted-foreground">Pesanan Selesai</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
