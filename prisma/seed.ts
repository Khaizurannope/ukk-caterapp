import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database...");

  // =====================================
  // 1. SEED USERS (Admin, Owner, Kurir)
  // =====================================
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@catering.com" },
    update: {},
    create: {
      name: "Admin Catering",
      email: "admin@catering.com",
      password: hashedPassword,
      level: "admin",
    },
  });
  console.log("✅ Admin created:", admin.email);

  const owner = await prisma.user.upsert({
    where: { email: "owner@catering.com" },
    update: {},
    create: {
      name: "Owner Catering",
      email: "owner@catering.com",
      password: hashedPassword,
      level: "owner",
    },
  });
  console.log("✅ Owner created:", owner.email);

  const kurir1 = await prisma.user.upsert({
    where: { email: "kurir1@catering.com" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "kurir1@catering.com",
      password: hashedPassword,
      level: "kurir",
    },
  });
  console.log("✅ Kurir 1 created:", kurir1.email);

  const kurir2 = await prisma.user.upsert({
    where: { email: "kurir2@catering.com" },
    update: {},
    create: {
      name: "Andi Wijaya",
      email: "kurir2@catering.com",
      password: hashedPassword,
      level: "kurir",
    },
  });
  console.log("✅ Kurir 2 created:", kurir2.email);

  // =====================================
  // 2. SEED PELANGGAN (Customer)
  // =====================================
  const pelanggan1 = await prisma.pelanggan.upsert({
    where: { email: "siti@gmail.com" },
    update: {},
    create: {
      namaPelanggan: "Siti Nurhaliza",
      email: "siti@gmail.com",
      password: hashedPassword,
      telepon: "081234567890",
      alamat1: "Jl. Merdeka No. 123, Kel. Babakan Ciamis, Kec. Sumur Bandung, Bandung 40117",
      alamat2: "Jl. Asia Afrika No. 65, Bandung",
      alamat3: null,
      tglLahir: new Date("1995-05-15"),
      foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      kartuId: "https://images.unsplash.com/photo-1578670812003-60745e2c2ea9?w=400&h=250&fit=crop",
    },
  });
  console.log("✅ Pelanggan 1 created:", pelanggan1.email);

  const pelanggan2 = await prisma.pelanggan.upsert({
    where: { email: "joko@gmail.com" },
    update: {},
    create: {
      namaPelanggan: "Joko Widodo",
      email: "joko@gmail.com",
      password: hashedPassword,
      telepon: "081298765432",
      alamat1: "Jl. Asia Afrika No. 45, Kel. Braga, Kec. Sumur Bandung, Bandung 40111",
      alamat2: "Jl. Braga No. 10, Bandung",
      alamat3: "Jl. Dago No. 88, Bandung",
      tglLahir: new Date("1990-10-20"),
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      kartuId: "https://images.unsplash.com/photo-1578670812003-60745e2c2ea9?w=400&h=250&fit=crop",
    },
  });
  console.log("✅ Pelanggan 2 created:", pelanggan2.email);

  // =====================================
  // 3. SEED JENIS PEMBAYARAN
  // =====================================
  const transferBank = await prisma.jenisPembayaran.upsert({
    where: { id: BigInt(1) },
    update: {},
    create: {
      metodePembayaran: "Transfer Bank",
    },
  });

  const eWallet = await prisma.jenisPembayaran.upsert({
    where: { id: BigInt(2) },
    update: {},
    create: {
      metodePembayaran: "E-Wallet",
    },
  });

  await prisma.jenisPembayaran.upsert({
    where: { id: BigInt(3) },
    update: {},
    create: {
      metodePembayaran: "COD",
    },
  });
  console.log("✅ Jenis Pembayaran created");

  // =====================================
  // 4. SEED DETAIL JENIS PEMBAYARAN
  // =====================================
  // Hapus detail lama agar tidak duplikat (karena tidak ada unique constraint)
  await prisma.detailJenisPembayaran.deleteMany({
    where: {
      idJenisPembayaran: { in: [transferBank.id, eWallet.id] }
    }
  });

  await prisma.detailJenisPembayaran.createMany({
    data: [
      {
        idJenisPembayaran: transferBank.id,
        noRek: "1234567890",
        tempatBayar: "BCA",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png",
      },
      {
        idJenisPembayaran: transferBank.id,
        noRek: "0987654321",
        tempatBayar: "Mandiri",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/1200px-Bank_Mandiri_logo_2016.svg.png",
      },
      {
        idJenisPembayaran: eWallet.id,
        noRek: "081234567890",
        tempatBayar: "GoPay",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1200px-Gopay_logo.svg.png",
      },
      {
        idJenisPembayaran: eWallet.id,
        noRek: "081298765432",
        tempatBayar: "OVO",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/1200px-Logo_ovo_purple.svg.png",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Detail Jenis Pembayaran created");

  // =====================================
  // 5. SEED PAKET (Menu Catering)
  // =====================================
  const pakets = [
    {
      namaPaket: "Paket Pernikahan Mewah",
      jenis: "Prasmanan" as const,
      kategori: "Pernikahan" as const,
      jumlahPax: 500,
      hargaPaket: 75000,
      deskripsi: "Paket prasmanan mewah untuk acara pernikahan. Termasuk 10 menu pilihan, dekorasi meja prasmanan, dan pelayanan profesional.",
      foto1: "", // Kosongkan, nanti isi URL
      foto2: "",
      foto3: "",
    },
    {
      namaPaket: "Paket Pernikahan Hemat",
      jenis: "Box" as const,
      kategori: "Pernikahan" as const,
      jumlahPax: 100,
      hargaPaket: 35000,
      deskripsi: "Paket nasi box ekonomis untuk acara pernikahan. Berisi nasi, ayam goreng, sayur, sambal, dan kerupuk.",
      foto1: "",
      foto2: "",
      foto3: "",
    },
    {
      namaPaket: "Paket Selamatan Tradisional",
      jenis: "Prasmanan" as const,
      kategori: "Selamatan" as const,
      jumlahPax: 100,
      hargaPaket: 50000,
      deskripsi: "Paket prasmanan untuk acara selamatan dengan menu tradisional Sunda. Termasuk nasi tumpeng dan lauk pauk khas.",
      foto1: "",
      foto2: "",
      foto3: "",
    },
    {
      namaPaket: "Nasi Box Ulang Tahun",
      jenis: "Box" as const,
      kategori: "Ulang_Tahun" as const,
      jumlahPax: 50,
      hargaPaket: 30000,
      deskripsi: "Paket nasi box spesial untuk acara ulang tahun. Dilengkapi dengan dessert mini dan minuman.",
      foto1: "",
      foto2: "",
      foto3: "",
    },
    {
      namaPaket: "Paket Studi Tour Pelajar",
      jenis: "Box" as const,
      kategori: "Studi_Tour" as const,
      jumlahPax: 40,
      hargaPaket: 25000,
      deskripsi: "Paket nasi box praktis untuk kegiatan studi tour sekolah. Mudah dibawa dan bergizi lengkap.",
      foto1: "",
      foto2: "",
      foto3: "",
    },
    {
      namaPaket: "Paket Rapat Kantor",
      jenis: "Box" as const,
      kategori: "Rapat" as const,
      jumlahPax: 20,
      hargaPaket: 40000,
      deskripsi: "Paket nasi box premium untuk meeting kantor. Presentasi elegan dengan menu premium.",
      foto1: "",
      foto2: "",
      foto3: "",
    },
    {
      namaPaket: "Prasmanan Rapat VIP",
      jenis: "Prasmanan" as const,
      kategori: "Rapat" as const,
      jumlahPax: 50,
      hargaPaket: 85000,
      deskripsi: "Paket prasmanan eksklusif untuk rapat direksi atau tamu VIP. Menu internasional dengan pelayanan butler.",
      foto1: "",
      foto2: "",
      foto3: "",
    },
  ];

  for (const paket of pakets) {
    const existing = await prisma.paket.findFirst({
      where: { namaPaket: paket.namaPaket },
    });

    if (existing) {
      await prisma.paket.update({
        where: { id: existing.id },
        data: paket,
      });
      console.log(`🔄 Paket '${paket.namaPaket}' updated`);
    } else {
      await prisma.paket.create({
        data: paket,
      });
      console.log(`✅ Paket '${paket.namaPaket}' created`);
    }
  }
  console.log("✅ Paket (Menu) seeded");

  console.log("\n🎉 Seeding selesai!");
  console.log("\n📝 Akun Login:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("STAFF:");
  console.log("  Admin  : admin@catering.com / password123");
  console.log("  Owner  : owner@catering.com / password123");
  console.log("  Kurir  : kurir1@catering.com / password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("CUSTOMER:");
  console.log("  Siti   : siti@gmail.com / password123");
  console.log("  Joko   : joko@gmail.com / password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
