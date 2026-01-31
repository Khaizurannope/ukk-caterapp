"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Utensils,
} from "lucide-react";

interface CartItem {
  paketId: string;
  namaPaket: string;
  hargaPaket: number;
  jumlahPax: number;
  jenis: string;
  foto1: string | null;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoading(false);
    
    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem("cart");
      if (updatedCart) {
        setCart(JSON.parse(updatedCart));
      } else {
        setCart([]);
      }
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (paketId: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.paketId === paketId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity >= 1) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (paketId: string) => {
    const newCart = cart.filter((item) => item.paketId !== paketId);
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPax = cart.reduce(
    (sum, item) => sum + item.jumlahPax * item.quantity,
    0
  );
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.hargaPaket * item.quantity,
    0
  );

  if (isLoading) {
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
          <h1 className="text-3xl font-bold mb-2">Keranjang Belanja</h1>
          <p className="text-white/90">
            {totalItems > 0
              ? `${totalItems} paket dalam keranjang`
              : "Keranjang Anda kosong"}
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/menu"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-orange-500 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Lanjut Belanja
          </Link>

          {cart.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Keranjang Anda Kosong
                </h2>
                <p className="text-muted-foreground mb-6">
                  Belum ada paket catering yang ditambahkan
                </p>
                <Link href="/menu">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Lihat Menu
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Item ({totalItems})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus Semua
                  </Button>
                </div>

                {cart.map((item, index) => (
                  <Card key={item.paketId} className="animate-slide-up transition-smooth" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="w-24 h-24 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.foto1 ? (
                            <Image
                              src={item.foto1}
                              alt={item.namaPaket}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Utensils className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold line-clamp-1">
                                {item.namaPaket}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.jenis} • {item.jumlahPax} pax/paket
                              </p>
                              <p className="text-orange-600 font-semibold mt-1">
                                {formatRupiah(item.hargaPaket)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.paketId)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.paketId, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                readOnly
                                className="w-14 h-8 text-center text-sm"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.paketId, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold">
                              {formatRupiah(item.hargaPaket * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Ringkasan Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Paket
                        </span>
                        <span>{totalItems} paket</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Porsi
                        </span>
                        <span>{totalPax} pax</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">
                        {formatRupiah(totalPrice)}
                      </span>
                    </div>

                    <Link href="/checkout" className="block">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        Lanjut ke Pembayaran
                      </Button>
                    </Link>

                    <p className="text-xs text-center text-muted-foreground">
                      Dengan melanjutkan, Anda menyetujui syarat dan ketentuan
                      yang berlaku
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
