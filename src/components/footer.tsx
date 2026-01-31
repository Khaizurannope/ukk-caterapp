import Link from "next/link";
import { ChefHat, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">
                Go<span className="text-orange-500">-Ring</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              Layanan catering profesional untuk berbagai acara spesial Anda. 
              Kami menyediakan menu prasmanan dan nasi box dengan cita rasa 
              terbaik untuk pernikahan, selamatan, ulang tahun, dan acara lainnya.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Menu Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-orange-500 transition-colors">
                  Menu Catering
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-orange-500 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-orange-500 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-orange-500" />
                <span>Jl. Merdeka No. 123, Bandung, Jawa Barat 40123</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>info@cateringnusantara.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Go-Ring. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
