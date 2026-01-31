import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Utensils, ArrowLeft, Check } from "lucide-react";
import AddToCartButton from "./add-to-cart-button";

async function getPaket(id: string) {
  const paket = await prisma.paket.findUnique({
    where: { id: BigInt(id) },
  });
  return paket;
}

async function getRelatedPaket(kategori: string, currentId: string) {
  return await prisma.paket.findMany({
    where: {
      kategori: kategori as "Pernikahan" | "Selamatan" | "Ulang_Tahun" | "Studi_Tour" | "Rapat",
      id: { not: BigInt(currentId) },
    },
    take: 4,
  });
}

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paket = await getPaket(id);

  if (!paket) {
    notFound();
  }

  const relatedPaket = await getRelatedPaket(paket.kategori, id);

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

  // Parse menu items from deskripsi (assuming comma or newline separated)
  const menuItems = paket.deskripsi
    ?.split(/[,\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const images = [paket.foto1, paket.foto2, paket.foto3].filter(Boolean);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-orange-500">
              Beranda
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/menu" className="text-muted-foreground hover:text-orange-500">
              Menu
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-gray-900 font-medium">{paket.namaPaket}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/menu"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-orange-500 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Menu
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                {images[0] ? (
                  <Image
                    src={images[0]}
                    alt={paket.namaPaket}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Utensils className="h-20 w-20 text-gray-300" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={img!}
                        alt={`${paket.namaPaket} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <Badge className="bg-orange-500">{paket.jenis}</Badge>
                  <Badge variant="outline">{kategoriLabel(paket.kategori)}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {paket.namaPaket}
                </h1>
                <p className="text-muted-foreground">
                  Cocok untuk {paket.jumlahPax} orang
                </p>
              </div>

              <div className="text-4xl font-bold text-orange-600">
                {formatRupiah(paket.hargaPaket)}
              </div>

              <Separator />

              {/* Menu Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Menu yang Termasuk:</h3>
                {menuItems && menuItems.length > 0 ? (
                  <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">{paket.deskripsi}</p>
                )}
              </div>

              <Separator />

              {/* Add to Cart */}
              <Card className="bg-gray-50 border-none">
                <CardContent className="p-4">
                  <AddToCartButton
                    paket={{
                      id: paket.id.toString(),
                      namaPaket: paket.namaPaket,
                      hargaPaket: paket.hargaPaket,
                      jumlahPax: paket.jumlahPax,
                      jenis: paket.jenis,
                      foto1: paket.foto1,
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedPaket.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Menu Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPaket.map((related) => (
                <Card key={related.id.toString()} className="overflow-hidden group">
                  <div className="aspect-video relative bg-gray-100">
                    {related.foto1 ? (
                      <Image
                        src={related.foto1}
                        alt={related.namaPaket}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Utensils className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1 mb-1">
                      {related.namaPaket}
                    </h3>
                    <p className="text-lg font-bold text-orange-600">
                      {formatRupiah(related.hargaPaket)}
                    </p>
                    <Link href={`/menu/${related.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                      >
                        Lihat Detail
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
