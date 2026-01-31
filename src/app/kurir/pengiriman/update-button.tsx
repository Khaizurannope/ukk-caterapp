"use client";

import { useState } from "react";
import { updatePengiriman } from "@/actions/pengiriman-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, CheckCircle, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UpdateDeliveryButtonProps {
  id: number;
}

export default function UpdateDeliveryButton({ id }: UpdateDeliveryButtonProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Format file harus gambar");
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleComplete = async () => {
    try {
      setLoading(true);

      let buktiUrl = "";

      // 1. Upload foto jika ada
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "catering_preset");

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Gagal upload gambar");
        }

        buktiUrl = data.secure_url;
      }

      // 2. Update status pengiriman
      const result = await updatePengiriman({
        id,
        statusKirim: "Tiba_Ditujuan",
        buktiFoto: buktiUrl || undefined,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(result.success);
      setOpen(false);
      setFile(null);
      setPreview(null);
      router.refresh();
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="mr-2 h-4 w-4" />
          Selesai
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pengiriman Selesai</DialogTitle>
          <DialogDescription>
            Tandai pesanan telah sampai di tujuan. Mohon sertakan foto bukti penerimaan jika ada.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="buktiFoto">
              <Camera className="inline mr-2 h-4 w-4" />
              Foto Bukti (Opsional)
            </Label>
            <Input 
                id="buktiFoto" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={loading}
            />
          </div>

          {preview && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-gray-100">
              <Image 
                src={preview} 
                alt="Preview bukti" 
                fill 
                className="object-contain" 
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Batal
          </Button>
          <Button
              onClick={handleComplete}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Konfirmasi Selesai
                </>
              )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
