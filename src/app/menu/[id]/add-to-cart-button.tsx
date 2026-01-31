"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface Paket {
  id: string;
  namaPaket: string;
  hargaPaket: number;
  jumlahPax: number;
  jenis: string;
  foto1: string | null;
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

export default function AddToCartButton({ paket }: { paket: Paket }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // Check if user is logged in
    if (status !== "authenticated" || !session) {
      toast.error("Silakan login atau daftar terlebih dahulu untuk memesan", {
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    // Check if user is a customer
    if (session.user.type !== "customer") {
      toast.error("Hanya pelanggan yang dapat memesan");
      return;
    }

    setIsLoading(true);

    try {
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem("cart");
      const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

      // Check if item already exists
      const existingIndex = cart.findIndex(
        (item) => item.paketId === paket.id
      );

      if (existingIndex >= 0) {
        // Update quantity
        cart[existingIndex].quantity += quantity;
      } else {
        // Add new item
        cart.push({
          paketId: paket.id,
          namaPaket: paket.namaPaket,
          hargaPaket: paket.hargaPaket,
          jumlahPax: paket.jumlahPax,
          jenis: paket.jenis,
          foto1: paket.foto1,
          quantity,
        });
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Dispatch custom event for cart update
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Berhasil ditambahkan ke keranjang!");
    } catch {
      toast.error("Gagal menambahkan ke keranjang");
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const subtotal = paket.hargaPaket * quantity;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Jumlah Paket</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center"
            min={1}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleIncrement}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Total Porsi</span>
        <span>{paket.jumlahPax * quantity} pax</span>
      </div>

      <div className="flex items-center justify-between font-semibold">
        <span>Subtotal</span>
        <span className="text-xl text-orange-600">{formatRupiah(subtotal)}</span>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600"
        size="lg"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        {isLoading ? "Menambahkan..." : "Tambah ke Keranjang"}
      </Button>
    </div>
  );
}
