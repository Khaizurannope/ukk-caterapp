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
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

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
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (data: UpdateProfileInput) => {
    startTransition(() => {
      updateProfile(data).then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Profil berhasil diperbarui");
          setOpen(false);
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                    {field.value && (
                      <div className="relative w-20 h-20">
                        <Image
                          src={field.value}
                          alt="Foto profil"
                          fill
                          className="rounded-full object-cover border"
                        />
                        <button
                          type="button"
                          onClick={() => field.onChange("")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <CldUploadButton
                      options={{ maxFiles: 1 }}
                      onSuccess={(result: any) => {
                        field.onChange(result.info.secure_url);
                        toast.success("Foto berhasil diunggah");
                      }}
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                      className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Foto
                    </CldUploadButton>
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
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
