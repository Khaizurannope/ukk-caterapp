import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DeletePaketButton from "./delete-button";

async function getAllPaket() {
  return await prisma.paket.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminPaketPage() {
  const pakets = await getAllPaket();

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const kategoriLabel = (kategori: string) => {
    return kategori.replace(/_/g, " ");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Paket</h1>
          <p className="text-muted-foreground">Daftar menu catering yang tersedia</p>
        </div>
        <Link href="/admin/paket/tambah">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" /> Tambah Paket
          </Button>
        </Link>
      </div>

      {pakets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">Belum ada paket catering</p>
            <Link href="/admin/paket/tambah">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tambah Paket Pertama
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pakets.map((paket) => (
            <Card key={paket.id.toString()} className="overflow-hidden">
              <div className="aspect-video relative bg-gray-100">
                {paket.foto1 ? (
                  <Image
                    src={paket.foto1}
                    alt={paket.namaPaket}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Tidak ada foto
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{paket.namaPaket}</CardTitle>
                  <Badge variant="outline">{paket.jenis}</Badge>
                </div>
                <Badge className="w-fit bg-orange-100 text-orange-800 hover:bg-orange-100">
                  {kategoriLabel(paket.kategori)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {paket.deskripsi}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{paket.jumlahPax} pax</span>
                  <span className="font-bold text-orange-600">
                    {formatRupiah(paket.hargaPaket)}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/admin/paket/${paket.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </Link>
                  <DeletePaketButton id={Number(paket.id)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
