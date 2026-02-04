"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema, UpdateProfileInput } from "@/lib/validations";
import { updateProfile } from "@/actions/profile-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

// Helper upload manual (sama seperti PaketForm)
const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "catering_preset"); 
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

interface EditProfileDialogProps {
  user: {
    namaPelanggan: string;
    tglLahir: Date | null;
    telepon: string | null;
    alamat1: string | null;
    alamat2: string | null;
    alamat3: string | null;
    foto: string | null;
  };
}

export function EditProfileDialog({ user }: EditProfileDialogProps) {
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(user.foto || "");

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      namaPelanggan: user.namaPelanggan,
      tglLahir: user.tglLahir ? new Date(user.tglLahir).toISOString().split("T")[0] : "",
      telepon: user.telepon || "",
      alamat1: user.alamat1 || "",
      alamat2: user.alamat2 || "",
      alamat3: user.alamat3 || "",
      foto: user.foto || "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    // startTransition membungkus async logic tapi kita harus handle upload dulu
    setIsLoading(true); // Manual loading state might be safer or use startTransition wrapper
    
    try {
      let finalFotoUrl = data.foto;

      // Jika ada file baru yang dipilih, upload dulu
      if (newFile) {
        finalFotoUrl = await uploadToCloudinary(newFile);
      }

      // Update data dengan URL foto baru
      const finalData = { ...data, foto: finalFotoUrl };

      startTransition(() => {
        updateProfile(finalData).then(async (res) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            // Update session agar avatar di navbar berubah
            await update({ 
              user: { 
                name: finalData.namaPelanggan, 
                image: finalFotoUrl 
              } 
            });
            
            toast.success("Profil berhasil diperbarui");
            setOpen(false);
            setNewFile(null); // Reset file
          }
        });
      });
    } catch (error) {
      toast.error("Gagal mengupload foto");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // State manual untuk loading karena upload terjadi di luar startTransition
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = isPending || isLoading;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreview(url);
      form.setValue("foto", url); // Sementara set ke preview URL agar validasi lewat (opsional) atau biarkan string lama
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if(!val) {
        // Reset form on close if needed, generally fine to keep until saved
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Profil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
          <DialogDescription>
            Perbarui informasi pribadi dan alamat pengiriman Anda.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Foto Profil */}
            <FormField
              control={form.control}
              name="foto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto Profil</FormLabel>
                   <div className="flex items-center gap-4">
                    {preview && (
                      <div className="relative w-20 h-20">
                        <Image
                          src={preview}
                          alt="Foto profil"
                          fill
                          className="rounded-full object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                             setPreview("");
                             setNewFile(null);
                             field.onChange("");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    <div>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full max-w-xs cursor-pointer" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">Format: JPG, PNG (Max 2MB)</p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="namaPelanggan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telepon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="08..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="tglLahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold">Alamat Pengiriman</h4>
              
              <FormField
                control={form.control}
                name="alamat1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Utama (Wajib)</FormLabel>
                    <FormControl>
                      <Input placeholder="Jalan utama..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alamat2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Alternatif 1 (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat kantor/rumah orang tua..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alamat3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Alternatif 2 (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat lainnya..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
