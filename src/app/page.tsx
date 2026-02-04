import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ChefHat, Truck, Clock, Star, ArrowRight, Utensils } from "lucide-react";

async function getFeaturedPaket() {
  return await prisma.paket.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

export default async function HomePage() {
  const featuredPaket = await getFeaturedPaket();

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
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-none">
                #1 Catering Terpercaya
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Hidangan Lezat untuk Momen Spesial Anda
              </h1>
              <p className="text-lg lg:text-xl mb-8 text-white/90 max-w-2xl mx-auto lg:mx-0">
                Layanan catering profesional untuk pernikahan, selamatan, ulang tahun, 
                studi tour, dan berbagai acara penting lainnya. Cita rasa autentik 
                dengan pelayanan terbaik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/menu">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 w-full sm:w-auto">
                    Lihat Menu <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="hidden lg:block relative transform hover:scale-105 transition-transform duration-500">
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
                  alt="Professional Catering Service & Make Up"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Decoration */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl text-gray-800 animate-bounce delay-1000">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">4.9/5</p>
                    <p className="text-xs text-gray-500">Rating Pelanggan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kami berkomitmen memberikan layanan catering terbaik dengan kualitas 
              bahan premium dan rasa yang tak terlupakan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <ChefHat className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Chef Berpengalaman</h3>
                <p className="text-sm text-muted-foreground">
                  Tim chef profesional dengan pengalaman lebih dari 10 tahun
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Pengiriman Tepat Waktu</h3>
                <p className="text-sm text-muted-foreground">
                  Garansi pengiriman tepat waktu dengan armada terpercaya
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Kualitas Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Bahan-bahan segar dan berkualitas tinggi setiap hari
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Layanan 24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Customer service siap membantu kapan saja
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Menu Catering Pilihan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Berbagai pilihan paket catering untuk memenuhi kebutuhan acara Anda
            </p>
          </div>

          {featuredPaket.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Menu akan segera tersedia
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPaket.map((paket) => (
                  <Card key={paket.id.toString()} className="overflow-hidden group">
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
                      <Badge className="absolute top-3 left-3 bg-orange-500">
                        {paket.jenis}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{paket.namaPaket}</CardTitle>
                      <Badge variant="outline" className="w-fit">
                        {kategoriLabel(paket.kategori)}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {paket.deskripsi}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">{paket.jumlahPax} pax</span>
                        </div>
                        <span className="text-lg font-bold text-orange-600">
                          {formatRupiah(paket.hargaPaket)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/menu">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    Lihat Semua Menu <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">500+</div>
              <p className="text-orange-100">Acara Sukses</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">50K+</div>
              <p className="text-orange-100">Porsi Terjual</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">100+</div>
              <p className="text-orange-100">Menu Pilihan</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">98%</div>
              <p className="text-orange-100">Kepuasan</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-none">
            <CardContent className="p-8 lg:p-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">
                  Siap Memesan untuk Acara Anda?
                </h2>
                <p className="text-gray-300 mb-6">
                  Hubungi kami sekarang atau langsung pesan melalui website. 
                  Tim kami siap membantu merencanakan catering untuk acara spesial Anda.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/menu">
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                      Pesan Sekarang
                    </Button>
                  </Link>
                  <Link href="/kontak">
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                      Hubungi Kami
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
