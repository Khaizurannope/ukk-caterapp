"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterPelangganSchema, RegisterPelangganInput } from "@/lib/validations";
import { registerPelanggan, checkEmailAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Loader2, Upload, X, CreditCard, Camera } from "lucide-react";
import { toast } from "sonner";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [kartuIdFile, setKartuIdFile] = useState<File | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [kartuIdPreview, setKartuIdPreview] = useState<string>("");
  const [fotoPreview, setFotoPreview] = useState<string>("");

  const form = useForm<RegisterPelangganInput>({
    resolver: zodResolver(RegisterPelangganSchema),
    defaultValues: {
      namaPelanggan: "",
      email: "",
      password: "",
      tglLahir: "",
      telepon: "",
      alamat1: "",
      alamat2: "",
      alamat3: "",
      kartuId: "",
      foto: "",
    },
  });

  const uploadToCloudinary = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Gagal upload gambar");
    const data = await res.json();
    return data.secure_url;
  };

  const onSubmit = (values: RegisterPelangganInput) => {
    startTransition(async () => {
      try {
        // Cek email terlebih dahulu sebelum upload file
        const emailCheck = await checkEmailAction(values.email);
        if (emailCheck.error) {
          toast.error(emailCheck.error);
          return;
        }

        let kartuIdUrl = values.kartuId;
        let fotoUrl = values.foto;

        // Upload KTP jika ada file
        if (kartuIdFile) {
          kartuIdUrl = await uploadToCloudinary(kartuIdFile, "catering/ktp");
        }

        // Upload Foto Profil jika ada file
        if (fotoFile) {
          fotoUrl = await uploadToCloudinary(fotoFile, "catering/profil");
        }

        // Update values dengan URL hasil upload
        const result = await registerPelanggan({
          ...values,
          kartuId: kartuIdUrl,
          foto: fotoUrl,
        });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success(result.success);
        router.push("/login");
      } catch (error) {
        console.error(error);
        toast.error("Terjadi kesalahan saat registrasi");
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'ktp' | 'foto') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      
      if (type === 'ktp') {
        setKartuIdFile(file);
        setKartuIdPreview(previewUrl);
        // Set nilai dummy untuk validasi, akan diganti saat submit
        form.setValue("kartuId", "pending_upload");
        form.clearErrors("kartuId");
      } else {
        setFotoFile(file);
        setFotoPreview(previewUrl);
        form.setValue("foto", "pending_upload");
      }
    }
  };

  const removeKartuId = () => {
    setKartuIdFile(null);
    setKartuIdPreview("");
    form.setValue("kartuId", "");
  };

  const removeFoto = () => {
    setFotoFile(null);
    setFotoPreview("");
    form.setValue("foto", "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="h-10 w-10 text-orange-500" />
          </Link>
          <CardTitle className="text-2xl">Daftar Akun</CardTitle>
          <CardDescription>Buat akun untuk memesan catering - Lengkapi semua data yang diperlukan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Data Pribadi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="namaPelanggan">Nama Lengkap *</Label>
                <Input
                  id="namaPelanggan"
                  placeholder="Masukkan nama lengkap"
                  {...form.register("namaPelanggan")}
                  disabled={isPending}
                />
                {form.formState.errors.namaPelanggan && (
                  <p className="text-sm text-red-500">{form.formState.errors.namaPelanggan.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  {...form.register("email")}
                  disabled={isPending}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  {...form.register("password")}
                  disabled={isPending}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tglLahir">Tanggal Lahir *</Label>
                <Input
                  id="tglLahir"
                  type="date"
                  {...form.register("tglLahir")}
                  disabled={isPending}
                />
                {form.formState.errors.tglLahir && (
                  <p className="text-sm text-red-500">{form.formState.errors.tglLahir.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="telepon">Nomor Telepon *</Label>
                <Input
                  id="telepon"
                  placeholder="081234567890"
                  {...form.register("telepon")}
                  disabled={isPending}
                />
                {form.formState.errors.telepon && (
                  <p className="text-sm text-red-500">{form.formState.errors.telepon.message}</p>
                )}
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-gray-700">Alamat</h3>
              
              <div className="space-y-2">
                <Label htmlFor="alamat1">Alamat Utama * (Alamat yang akan digunakan untuk pengiriman)</Label>
                <Textarea
                  id="alamat1"
                  placeholder="Masukkan alamat lengkap utama (RT/RW, Kelurahan, Kecamatan)"
                  {...form.register("alamat1")}
                  disabled={isPending}
                />
                {form.formState.errors.alamat1 && (
                  <p className="text-sm text-red-500">{form.formState.errors.alamat1.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat2">Alamat Alternatif 1 (Opsional)</Label>
                <Textarea
                  id="alamat2"
                  placeholder="Alamat alternatif untuk pengiriman (jika ada)"
                  {...form.register("alamat2")}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat3">Alamat Alternatif 2 (Opsional)</Label>
                <Textarea
                  id="alamat3"
                  placeholder="Alamat alternatif untuk pengiriman (jika ada)"
                  {...form.register("alamat3")}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Upload Dokumen */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-gray-700">Dokumen & Foto</h3>
              
              {/* Upload KTP */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Upload KTP / Kartu Identitas *
                </Label>
                <p className="text-xs text-muted-foreground">
                  KTP wajib diupload untuk verifikasi identitas pelanggan
                </p>
                
                {kartuIdPreview ? (
                  <div className="relative w-full max-w-md">
                    <Image
                      src={kartuIdPreview}
                      alt="Preview KTP"
                      width={400}
                      height={250}
                      className="rounded-lg border object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeKartuId}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full max-w-md">
                    <label htmlFor="ktp-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-gray-500">Klik untuk upload KTP</span>
                        <span className="text-xs text-gray-400 mt-1">Format: JPG, PNG (Max 5MB)</span>
                      </div>
                    </label>
                    <Input
                      id="ktp-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'ktp')}
                      disabled={isPending}
                    />
                  </div>
                )}
                {form.formState.errors.kartuId && (
                  <p className="text-sm text-red-500">{form.formState.errors.kartuId.message}</p>
                )}
              </div>

              {/* Upload Foto Profil */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Upload Foto Profil (Opsional)
                </Label>
                
                {fotoPreview ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={fotoPreview}
                      alt="Preview Foto"
                      width={128}
                      height={128}
                      className="rounded-full border object-cover w-32 h-32"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={removeFoto}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="foto-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-gray-500">Foto</span>
                      </div>
                    </label>
                    <Input
                      id="foto-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'foto')}
                      disabled={isPending}
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-center text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-orange-500 hover:underline font-medium">
              Masuk di sini
            </Link>
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Kembali ke beranda
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
