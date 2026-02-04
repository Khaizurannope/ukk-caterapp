"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  ChefHat,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  FileText,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import LogoutDialog from "@/components/logout-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const adminLinks: SidebarLink[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/admin/paket", label: "Kelola Paket", icon: <Package className="h-5 w-5" /> },
  { href: "/admin/pelanggan", label: "Data Pelanggan", icon: <Users className="h-5 w-5" /> },
  { href: "/admin/pesanan", label: "Pesanan Masuk", icon: <ShoppingCart className="h-5 w-5" /> },
  { href: "/admin/pengiriman", label: "Pengiriman", icon: <Truck className="h-5 w-5" /> },
  { href: "/admin/pembayaran", label: "Metode Bayar", icon: <CreditCard className="h-5 w-5" /> },
];

const ownerLinks: SidebarLink[] = [
  { href: "/owner", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/owner/laporan", label: "Laporan Transaksi", icon: <FileText className="h-5 w-5" /> },
];

const kurirLinks: SidebarLink[] = [
  { href: "/kurir", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/kurir/pengiriman", label: "Daftar Pengiriman", icon: <Truck className="h-5 w-5" /> },
];

interface SidebarContentProps {
  session: { user?: { name?: string | null; role?: string } } | null;
  links: SidebarLink[];
  pathname: string;
  roleLabel: string;
  onLinkClick: () => void;
}

function SidebarContent({ session, links, pathname, roleLabel, onLinkClick }: SidebarContentProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-6 border-b">
        <ChefHat className="h-8 w-8 text-orange-500" />
        <span className="text-lg font-bold text-gray-800">
          Go<span className="text-orange-500">-Ring</span>
        </span>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-orange-100 text-orange-600">
              {getInitials(session?.user?.name || "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-orange-100 text-orange-600"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <LogoutDialog variant="sidebar" />
      </div>
    </>
  );
}

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = session?.user?.role;

  const links =
    role === "admin"
      ? adminLinks
      : role === "owner"
      ? ownerLinks
      : role === "kurir"
      ? kurirLinks
      : [];

  const roleLabel =
    role === "admin" ? "Administrator" : role === "owner" ? "Pemilik" : "Kurir";

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-gray-800">CateringApp</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={closeMobileMenu}>
          <div
            className="w-64 h-full bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              session={session}
              links={links}
              pathname={pathname}
              roleLabel={roleLabel}
              onLinkClick={closeMobileMenu}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r">
        <SidebarContent
          session={session}
          links={links}
          pathname={pathname}
          roleLabel={roleLabel}
          onLinkClick={closeMobileMenu}
        />
      </aside>
    </>
  );
}
