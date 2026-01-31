"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaketSchema } from "@/lib/validations";
import { createPaket, updatePaket } from "@/actions/paket-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

// Define type explicitly for form values
interface PaketFormValues {
  namaPaket: string;
  jenis: "Prasmanan" | "Box";
  kategori: "Pernikahan" | "Selamatan" | "Ulang_Tahun" | "Studi_Tour" | "Rapat";
  jumlahPax: number;
  hargaPaket: number;
  deskripsi: string;
  foto1?: string;
  foto2?: string;
  foto3?: string;
}

interface PaketFormProps {
  initialData?: {
    id: number;
    namaPaket: string;
    jenis: string;
    kategori: string;
    jumlahPax: number;
    hargaPaket: number;
    deskripsi: string;
    foto1?: string | null;
    foto2?: string | null;
    foto3?: string | null;
  };
}

// Helper untuk upload manual ke Cloudinary (Client-Side Unsigned Upload)
const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "catering_preset");
  // Pastikan cloud name ada
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Cloud Name not configured");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Upload Failed");
  return data.secure_url;
};

export default function PaketForm({ initialData }: PaketFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!initialData;
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [previews, setPreviews] = useState<{ [key: string]: string }>({
    foto1: initialData?.foto1 || "",
    foto2: initialData?.foto2 || "",
    foto3: initialData?.foto3 || "",
  });

  const form = useForm<PaketFormValues>({
    resolver: zodResolver(PaketSchema) as never,
    defaultValues: {
      namaPaket: initialData?.namaPaket || "",
      jenis: (initialData?.jenis as "Prasmanan" | "Box") || "Box",
      kategori: (initialData?.kategori as PaketFormValues["kategori"]) || "Pernikahan",
      jumlahPax: initialData?.jumlahPax || 50,
      hargaPaket: initialData?.hargaPaket || 25000,
      deskripsi: initialData?.deskripsi || "",
      foto1: initialData?.foto1 || "",
      foto2: initialData?.foto2 || "",
      foto3: initialData?.foto3 || "",
    },
  });

  const handleFileChange = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
      // Kita set value sementara agar tidak error required (jika ada), tapi nanti akan ditimpa URL asli saat submit
      form.setValue(field as any, "pending_upload"); 
    }
  };

  const handleRemoveImage = (field: string) => {
    setFiles((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: "" }));
    form.setValue(field as any, "");
  };

  const onSubmit: SubmitHandler<PaketFormValues> = (values) => {
    startTransition(async () => {
      try {
        // Upload semua file yang dipilih
        let uploadedUrls: { [key: string]: string } = {};
        
        for (const field of ["foto1", "foto2", "foto3"]) {
            if (files[field]) {
               // Jika ada file baru dipilih, upload
               const url = await uploadToCloudinary(files[field]!);
               uploadedUrls[field] = url;
            } else {
               // Jika tidak ada file baru, tapi masih ada preview (berarti gambar lama/tidak diubah), pakai prev value atau kosong
               // Hati-hati: jika user tidak ubah, values[field] akan berisi URL lama.
               // Jika user hapus, values[field] akan "".
               // Namun tadi di handleFileChange kita set "pending_upload".
               // Jadi logikanya: 
               // 1. Jika files[field] ada -> Upload -> pake URL baru.
               // 2. Jika files[field] tidak ada -> Cek values[field]. Jika "pending_upload" (aneh), ignore.
               //    Ambil values[field] apa adanya.
               uploadedUrls[field] = values[field as keyof PaketFormValues] === "pending_upload" ? "" : values[field as keyof PaketFormValues] as string;
            }
        }

        const finalValues = {
            ...values,
            foto1: uploadedUrls.foto1 || "",
            foto2: uploadedUrls.foto2 || "",
            foto3: uploadedUrls.foto3 || "",
        };

        const result = isEditing
            ? await updatePaket(initialData?.id!, finalValues)
            : await createPaket(finalValues);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success(result.success);
        router.push("/admin/paket");
        
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengupload gambar atau menyimpan paket");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/paket">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Paket" : "Tambah Paket Baru"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Ubah informasi paket catering" : "Buat menu catering baru"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Paket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="namaPaket">Nama Paket</Label>
                <Input
                  id="namaPaket"
                  placeholder="Contoh: Paket Pernikahan Mewah"
                  {...form.register("namaPaket")}
                  disabled={isPending}
                />
                {form.formState.errors.namaPaket && (
                  <p className="text-sm text-red-500">{form.formState.errors.namaPaket.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jenis">Jenis Paket</Label>
                <Select
                  value={form.watch("jenis")}
                  onValueChange={(value) => form.setValue("jenis", value as "Prasmanan" | "Box")}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prasmanan">Prasmanan</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Select
                  value={form.watch("kategori")}
                  onValueChange={(value) => form.setValue("kategori", value as PaketFormValues["kategori"])}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pernikahan">Pernikahan</SelectItem>
                    <SelectItem value="Selamatan">Selamatan</SelectItem>
                    <SelectItem value="Ulang_Tahun">Ulang Tahun</SelectItem>
                    <SelectItem value="Studi_Tour">Studi Tour</SelectItem>
                    <SelectItem value="Rapat">Rapat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jumlahPax">Jumlah Pax (Porsi)</Label>
                <Input
                  id="jumlahPax"
                  type="number"
                  placeholder="50"
                  {...form.register("jumlahPax")}
                  disabled={isPending}
                />
                {form.formState.errors.jumlahPax && (
                  <p className="text-sm text-red-500">{form.formState.errors.jumlahPax.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hargaPaket">Harga per Paket (Rp)</Label>
                <Input
                  id="hargaPaket"
                  type="number"
                  placeholder="25000"
                  {...form.register("hargaPaket")}
                  disabled={isPending}
                />
                {form.formState.errors.hargaPaket && (
                  <p className="text-sm text-red-500">{form.formState.errors.hargaPaket.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Jelaskan menu dan isi paket catering..."
                  rows={4}
                  {...form.register("deskripsi")}
                  disabled={isPending}
                />
                {form.formState.errors.deskripsi && (
                  <p className="text-sm text-red-500">{form.formState.errors.deskripsi.message}</p>
                )}
              </div>
            </div>

            {/* Foto URLs - Revised Logic: Selected File Only, Upload on Submit */}
            <div className="space-y-4">
              <h3 className="font-medium">Foto Paket</h3>
              <p className="text-sm text-muted-foreground">
                Pilih foto menu catering (akan diupload saat tombol Simpan ditekan).
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(["foto1", "foto2", "foto3"] as const).map((field, index) => {
                  const previewUrl = previews[field];
                  
                  return (
                    <div key={field} className="space-y-2">
                      <Label>Foto {index + 1} {index === 0 && "(Utama)"}</Label>
                      
                      {previewUrl ? (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-gray-100">
                          <Image 
                            src={previewUrl} 
                            alt={`Preview ${field}`}
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => handleRemoveImage(field)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor={`file-${field}`}
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">Klik untuk upload</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PNG, JPG (MAX. 5MB)
                                </p>
                            </div>
                            <input 
                              id={`file-${field}`} 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleFileChange(field, e)}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            </div>

            <div className="flex gap-4 pt-2 border-t mt-4">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : isEditing ? (
                  "Update Paket"
                ) : (
                  "Simpan Paket"
                )}
              </Button>
              <Link href="/admin/paket">
                <Button type="button" variant="outline" disabled={isPending}>
                  Batal
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
