import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  User, 
  Clock 
} from "lucide-react";
import LogoutDialogWrapper from "./logout-dialog-wrapper";

export default async function PelangganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.type !== "customer") {
    redirect("/login");
  }

  const menuItems = [
    {
      href: "/pelanggan",
      label: "Pesanan Saya",
      icon: ShoppingBag,
    },
    {
      href: "/pelanggan/riwayat",
      label: "Riwayat Pesanan",
      icon: Clock,
    },
    {
      href: "/pelanggan/profil",
      label: "Profil",
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Halo, {session.user?.name || "Pelanggan"}!</h1>
          <p className="text-white/90">Kelola pesanan dan akun Anda di sini</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-orange-50 hover:text-orange-600"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <LogoutDialogWrapper />
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
