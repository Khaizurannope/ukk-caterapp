import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Utensils, ShoppingCart } from "lucide-react";

interface SearchParams {
  jenis?: string;
  kategori?: string;
}

type KategoriType = "Pernikahan" | "Selamatan" | "Ulang_Tahun" | "Studi_Tour" | "Rapat";
type JenisType = "Prasmanan" | "Box";

async function getAllPaket(jenis?: string, kategori?: string) {
  const where: { jenis?: JenisType; kategori?: KategoriType } = {};
  
  if (jenis && jenis !== "all") {
    where.jenis = jenis as JenisType;
  }
  if (kategori && kategori !== "all") {
    where.kategori = kategori as KategoriType;
  }

  return await prisma.paket.findMany({
    where,
    orderBy: { namaPaket: "asc" },
  });
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const paketList = await getAllPaket(params.jenis, params.kategori);

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

  const jenisList = ["all", "Prasmanan", "Box"];
  const kategoriList = [
    "all",
    "Pernikahan",
    "Selamatan",
    "Ulang_Tahun",
    "Studi_Tour",
    "Rapat",
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Menu Catering</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Pilih paket catering sesuai kebutuhan acara Anda. Kami menyediakan
            berbagai pilihan menu dengan cita rasa terbaik.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Jenis:</span>
              <div className="flex gap-2">
                {jenisList.map((jenis) => (
                  <Link
                    key={jenis}
                    href={`/menu?jenis=${jenis}&kategori=${params.kategori || "all"}`}
                  >
                    <Badge
                      variant={
                        (params.jenis || "all") === jenis ? "default" : "outline"
                      }
                      className={`cursor-pointer ${
                        (params.jenis || "all") === jenis
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      {jenis === "all" ? "Semua" : jenis}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-gray-300 hidden md:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Kategori:</span>
              <div className="flex flex-wrap gap-2">
                {kategoriList.map((kategori) => (
                  <Link
                    key={kategori}
                    href={`/menu?jenis=${params.jenis || "all"}&kategori=${kategori}`}
                  >
                    <Badge
                      variant={
                        (params.kategori || "all") === kategori
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer ${
                        (params.kategori || "all") === kategori
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "hover:bg-orange-50"
                      }`}
                    >
                      {kategori === "all" ? "Semua" : kategoriLabel(kategori)}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {paketList.length === 0 ? (
            <div className="text-center py-16">
              <Utensils className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Tidak ada menu ditemukan
              </h3>
              <p className="text-muted-foreground mb-4">
                Coba ubah filter untuk melihat menu lainnya
              </p>
              <Link href="/menu">
                <Button variant="outline">Reset Filter</Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Menampilkan {paketList.length} menu
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paketList.map((paket, index) => (
                  <Card
                    key={paket.id.toString()}
                    className="overflow-hidden group hover-lift animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="aspect-video relative bg-gray-100">
                      {paket.foto1 ? (
                        <Image
                          src={paket.foto1}
                          alt={paket.namaPaket}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Utensils className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-orange-500">{paket.jenis}</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-1">
                        {paket.namaPaket}
                      </CardTitle>
                      <Badge variant="outline" className="w-fit">
                        {kategoriLabel(paket.kategori)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {paket.deskripsi}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {paket.jumlahPax} pax
                        </span>
                        <span className="text-lg font-bold text-orange-600">
                          {formatRupiah(paket.hargaPaket)}
                        </span>
                      </div>
                      <Link href={`/menu/${paket.id}`}>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Lihat Detail
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
