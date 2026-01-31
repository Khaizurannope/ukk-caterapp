"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  ChefHat
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function KontakPage() {
  const [loading, setLoading] = useState(false);

  // Nomor WhatsApp tujuan (ganti dengan nomor yang sebenarnya)
  const whatsappNumber = "6281234567890";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Ambil data form
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Format pesan WhatsApp
    const waMessage = `*PESAN DARI WEBSITE GO-RING*

*Nama:* ${name}
*No. HP:* ${phone}
*Email:* ${email}

*Subjek:* ${subject}

*Pesan:*
${message}`;

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(waMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, "_blank");

    toast.success("Mengalihkan ke WhatsApp...");
    setLoading(false);
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat",
      content: "Jl. Merdeka No. 123, Bandung, Jawa Barat 40123",
      link: "https://maps.google.com",
      linkText: "Lihat di Google Maps",
    },
    {
      icon: Phone,
      title: "Telepon",
      content: "+62 812-3456-7890",
      link: "tel:+6281234567890",
      linkText: "Hubungi Sekarang",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@go-ring.com",
      link: "mailto:info@go-ring.com",
      linkText: "Kirim Email",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      content: "Senin - Sabtu: 08:00 - 17:00",
      link: null,
      linkText: "Minggu: Tutup",
    },
  ];

  const socialMedia = [
    { icon: Facebook, label: "Facebook", href: "#", color: "hover:bg-blue-600" },
    { icon: Instagram, label: "Instagram", href: "#", color: "hover:bg-pink-600" },
    { icon: Twitter, label: "Twitter", href: "#", color: "hover:bg-sky-500" },
    { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/6281234567890", color: "hover:bg-green-600" },
  ];

  const faq = [
    {
      question: "Berapa minimal pesanan untuk catering?",
      answer: "Minimal pesanan kami adalah 50 porsi untuk nasi box dan 100 porsi untuk prasmanan.",
    },
    {
      question: "Apakah bisa request menu khusus?",
      answer: "Ya, kami menerima request menu khusus. Silakan hubungi kami untuk konsultasi lebih lanjut.",
    },
    {
      question: "Berapa lama sebelum acara harus memesan?",
      answer: "Kami menyarankan pemesanan minimal 1 minggu sebelum acara untuk persiapan yang optimal.",
    },
    {
      question: "Apakah ada biaya pengiriman?",
      answer: "Pengiriman gratis untuk area Bandung dan sekitarnya. Untuk area luar kota, akan dikenakan biaya tambahan.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Ada pertanyaan atau ingin berkonsultasi tentang kebutuhan catering Anda? 
            Tim kami siap membantu Anda.
          </p>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L60 45.7C120 41 240 33 360 35.3C480 38 600 52 720 55C840 58 960 52 1080 48.3C1200 45 1320 45 1380 45L1440 45V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{info.content}</p>
                  {info.link ? (
                    <a 
                      href={info.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-500 text-sm font-medium hover:underline"
                    >
                      {info.linkText}
                    </a>
                  ) : (
                    <p className="text-gray-500 text-sm">{info.linkText}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-orange-500" />
                  Kirim Pesan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Masukkan nama Anda" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">No. Telepon *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        placeholder="08xx-xxxx-xxxx" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="email@example.com" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek *</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      placeholder="Contoh: Konsultasi Menu Pernikahan" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan *</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Tuliskan pesan atau pertanyaan Anda di sini..." 
                      rows={5}
                      required 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Mengirim...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Kirim Pesan
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Additional Info */}
            <div className="space-y-6">
              {/* Map Placeholder */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Peta Lokasi</p>
                    <p className="text-sm text-gray-400">
                      Ganti dengan embed Google Maps
                    </p>
                  </div>
                </div>
                {/* Uncomment and replace with your actual Google Maps embed */}
                {/* <iframe 
                  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_URL"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                /> */}
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ikuti Kami</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {socialMedia.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center transition-colors ${social.color} hover:text-white`}
                        title={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <ChefHat className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Butuh Respon Cepat?</h3>
                      <p className="text-white/90 text-sm mb-3">
                        Hubungi kami langsung via WhatsApp untuk konsultasi lebih cepat.
                      </p>
                      <a 
                        href="https://wa.me/6281234567890" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat WhatsApp
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faq.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
