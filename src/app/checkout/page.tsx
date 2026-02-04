"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingCart,
  Utensils,
  CreditCard,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { createPemesanan } from "@/actions/pemesanan-actions";
import { getJenisPembayaran, getPelangganById } from "@/actions/data-actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Pelanggan {
  id: bigint;
  namaPelanggan: string;
  alamat1: string | null;
  alamat2: string | null;
  alamat3: string | null;
}

interface CartItem {
  paketId: string;
  namaPaket: string;
  hargaPaket: number;
  jumlahPax: number;
  jenis: string;
  foto1: string | null;
  quantity: number;
}

interface JenisPembayaran {
  id: bigint;
  metodePembayaran: string;
  detailJenisPembayarans: {
    id: bigint;
    tempatBayar: string;
    noRek: string;
    logo?: string | null;
  }[];
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jenisPembayaran, setJenisPembayaran] = useState<JenisPembayaran[]>([]);
  const [pelanggan, setPelanggan] = useState<Pelanggan | null>(null);

  // Form state
  const [tglPesan, setTglPesan] = useState("");
  const [selectedPembayaran, setSelectedPembayaran] = useState("");

  const loadCart = useCallback(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart.length === 0) {
        router.push("/cart");
        return;
      }
      setCart(parsedCart);
    } else {
      router.push("/cart");
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (session?.user?.type !== "customer") {
      toast.error("Halaman ini hanya untuk pelanggan");
      router.push("/");
      return;
    }

    loadCart();
    loadPembayaran();
    if (session?.user?.id) {
      loadPelanggan(Number(session.user.id));
    }
  }, [status, session, router, loadCart]);

  const loadPembayaran = async () => {
    const result = await getJenisPembayaran();
    if (result.success && result.data) {
      setJenisPembayaran(result.data as unknown as JenisPembayaran[]);
    }
  };

  const loadPelanggan = async (id: number) => {
    const result = await getPelangganById(id);
    if (result.data) {
      setPelanggan(result.data as unknown as Pelanggan);
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.hargaPaket * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tglPesan || !selectedPembayaran) {
      toast.error("Mohon lengkapi semua data");
      return;
    }

    if (!session?.user?.id) {
      toast.error("Session tidak valid");
      return;
    }

    if (!pelanggan?.alamat1) {
      toast.error("Alamat pengiriman belum diisi. Silakan lengkapi di Profil Saya.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        pelangganId: Number(session.user.id),
        tglPesan: new Date(tglPesan),
        jenisPembayaranId: Number(selectedPembayaran),
        items: cart.map((item) => ({
          paketId: Number(item.paketId),
          jumlahOrder: item.quantity,
          hargaPaket: item.hargaPaket,
        })),
      };

      const result = await createPemesanan(orderData);

      if (result.success) {
        // Clear cart
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        
        toast.success("Pesanan berhasil dibuat!");
        router.push(`/pelanggan/pesanan/${result.data?.id}`);
      } else {
        toast.error(result.error || "Gagal membuat pesanan");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-white/90">Lengkapi data pesanan Anda</p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-orange-500 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Keranjang
          </Link>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informasi Alamat Pengiriman */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <MapPin className="h-5 w-5 text-orange-500" />
                      Alamat Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted rounded-md text-sm text-foreground">
                        <p className="font-semibold text-orange-600 mb-1">Alamat Utama:</p>
                        <p>{pelanggan?.alamat1 || "-"}</p>
                      </div>
                      
                      {(pelanggan?.alamat2 || pelanggan?.alamat3) && (
                         <div className="text-xs text-muted-foreground">
                            <p>* Pesanan akan dikirim ke Alamat Utama.</p>
                            <p>* Untuk mengubah alamat pengiriman, silakan edit di menu Profil Saya sebelum memesan.</p>
                         </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Date */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      Tanggal Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="date"
                      value={tglPesan}
                      onChange={(e) => setTglPesan(e.target.value)}
                      min={getMinDate()}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Minimal pemesanan H-1 sebelum acara
                    </p>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-orange-500" />
                      Metode Pembayaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={selectedPembayaran}
                      onValueChange={setSelectedPembayaran}
                      className="grid gap-4"
                    >
                      {jenisPembayaran.map((jp) => {
                        const isSelected = selectedPembayaran === jp.id.toString();
                        return (
                          <div
                            key={jp.id.toString()}
                            className={`relative flex flex-col space-y-2 rounded-lg border p-4 transition-all ${
                              isSelected
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem
                                value={jp.id.toString()}
                                id={`jp-${jp.id}`}
                                className="text-orange-600 border-gray-400"
                              />
                              <Label
                                htmlFor={`jp-${jp.id}`}
                                className="font-semibold cursor-pointer flex-1 text-base text-gray-800"
                              >
                                {jp.metodePembayaran}
                              </Label>
                            </div>

                            {/* Detail Pembayaran (Logos & Rekening) */}
                            {isSelected && (
                              <div className="pl-7 mt-2 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                {jp.detailJenisPembayarans.length > 0 ? (
                                  jp.detailJenisPembayarans.map((detail) => (
                                    <div
                                      key={detail.id.toString()}
                                      className="flex items-center gap-4 p-3 bg-white rounded-md border text-sm shadow-sm"
                                    >
                                      {detail.logo ? (
                                        <div className="w-20 h-10 relative flex-shrink-0 flex items-center justify-center p-1 bg-white">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={detail.logo}
                                            alt={detail.tempatBayar}
                                            className="max-h-full max-w-full object-contain"
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-20 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-muted-foreground font-medium">
                                          {detail.tempatBayar}
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <p className="font-bold text-gray-900">
                                          {detail.tempatBayar}
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <p className="font-mono text-gray-600 tracking-wide text-base">
                                            {detail.noRek}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-600 bg-white p-3 rounded border border-dashed border-gray-300">
                                    {jp.metodePembayaran.toLowerCase() === "cod"
                                      ? "Bayar tunai saat pesanan diterima di lokasi pengiriman."
                                      : "Belum ada detail rekening untuk metode ini."}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-orange-500" />
                      Item Pesanan ({totalItems})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.paketId}
                        className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                      >
                        <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.foto1 ? (
                            <Image
                              src={item.foto1}
                              alt={item.namaPaket}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Utensils className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.namaPaket}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatRupiah(item.hargaPaket)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatRupiah(item.hargaPaket * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Ringkasan Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div
                          key={item.paketId}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground line-clamp-1">
                            {item.namaPaket} x{item.quantity}
                          </span>
                          <span>
                            {formatRupiah(item.hargaPaket * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">
                        {formatRupiah(totalPrice)}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      size="lg"
                    >
                      {isSubmitting ? "Memproses..." : "Buat Pesanan"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Dengan menekan tombol di atas, Anda menyetujui syarat dan
                      ketentuan yang berlaku
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
