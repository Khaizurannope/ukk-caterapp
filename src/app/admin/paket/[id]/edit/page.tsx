import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaketForm from "@/components/forms/paket-form";

interface EditPaketPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaketPage({ params }: EditPaketPageProps) {
  const { id } = await params;
  
  const paket = await prisma.paket.findUnique({
    where: { id: BigInt(id) },
  });

  if (!paket) {
    notFound();
  }

  const initialData = {
    id: Number(paket.id),
    namaPaket: paket.namaPaket,
    jenis: paket.jenis,
    kategori: paket.kategori,
    jumlahPax: paket.jumlahPax,
    hargaPaket: paket.hargaPaket,
    deskripsi: paket.deskripsi,
    foto1: paket.foto1,
    foto2: paket.foto2,
    foto3: paket.foto3,
  };

  return <PaketForm initialData={initialData} />;
}
