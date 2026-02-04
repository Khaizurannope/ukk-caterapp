import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChefHat, 
  Users, 
  Award, 
  Clock, 
  Heart,
  Utensils,
  Star,
  Target,
  Eye
} from "lucide-react";
import Image from "next/image";

export default function TentangKamiPage() {
  const stats = [
    { icon: Users, value: "5000+", label: "Pelanggan Puas" },
    { icon: Utensils, value: "50+", label: "Menu Tersedia" },
    { icon: Award, value: "10+", label: "Tahun Pengalaman" },
    { icon: Star, value: "4.9", label: "Rating Pelanggan" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Kualitas Terbaik",
      description: "Kami hanya menggunakan bahan-bahan segar dan berkualitas tinggi untuk setiap hidangan.",
    },
    {
      icon: Clock,
      title: "Tepat Waktu",
      description: "Komitmen kami untuk selalu mengantarkan pesanan tepat waktu sesuai jadwal acara Anda.",
    },
    {
      icon: Users,
      title: "Pelayanan Prima",
      description: "Tim profesional kami siap melayani dengan sepenuh hati untuk kepuasan pelanggan.",
    },
  ];

  const team = [
    {
      name: "Budi Santoso",
      role: "Founder & Head Chef",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop",
      description: "Berpengalaman lebih dari 15 tahun di industri kuliner.",
    },
    {
      name: "Siti Rahayu",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
      description: "Memastikan setiap pesanan berjalan lancar dan tepat waktu.",
    },
    {
      name: "Agus Wijaya",
      role: "Executive Chef",
      image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&h=400&fit=crop",
      description: "Ahli dalam menciptakan menu-menu kreatif dan lezat.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Mengenal lebih dekat Go-Ring, partner catering terpercaya untuk 
            berbagai acara spesial Anda sejak tahun 2015.
          </p>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L60 45.7C120 41 240 33 360 35.3C480 38 600 52 720 55C840 58 960 52 1080 48.3C1200 45 1320 45 1380 45L1440 45V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
                Cerita Kami
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">
                Dari Dapur Kecil Menjadi Catering Terpercaya
              </h2>
              <p className="text-gray-600 mb-4">
                Go-Ring bermula dari sebuah dapur kecil di Bandung pada tahun 2015. 
                Berawal dari kecintaan terhadap masakan tradisional Indonesia, 
                kami mulai melayani pesanan catering untuk acara-acara kecil 
                di lingkungan sekitar.
              </p>
              <p className="text-gray-600 mb-4">
                Seiring berjalannya waktu, dengan konsistensi rasa dan pelayanan 
                yang prima, kami dipercaya untuk melayani berbagai acara besar 
                seperti pernikahan, acara perusahaan, dan gathering dengan 
                ratusan hingga ribuan porsi.
              </p>
              <p className="text-gray-600">
                Kini, Go-Ring telah menjadi salah satu penyedia layanan catering 
                terpercaya di Jawa Barat dengan tim profesional yang siap 
                membantu menyukseskan acara spesial Anda.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=600&fit=crop"
                  alt="Tim Go-Ring Catering"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating card */}
              <Card className="absolute -bottom-6 -left-6 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Tersertifikasi</p>
                      <p className="text-sm text-gray-500">Halal & Higienis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-orange-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h3>
                <p className="text-gray-600">
                  Menjadi penyedia layanan catering terdepan di Indonesia yang 
                  menghadirkan cita rasa terbaik dengan pelayanan berkelas untuk 
                  setiap momen spesial pelanggan.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Menyajikan hidangan berkualitas dengan bahan segar</li>
                  <li>• Memberikan pelayanan profesional dan tepat waktu</li>
                  <li>• Terus berinovasi dalam menu dan presentasi</li>
                  <li>• Menjaga kepercayaan pelanggan dengan konsistensi</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
              Nilai-Nilai Kami
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Mengapa Memilih Kami?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
              Tim Kami
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Orang-Orang di Balik Layar
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-orange-500 font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Mewujudkan Acara Impian Anda?
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Hubungi kami sekarang untuk konsultasi gratis dan dapatkan 
            penawaran terbaik untuk acara spesial Anda.
          </p>
          <a
            href="/kontak"
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
