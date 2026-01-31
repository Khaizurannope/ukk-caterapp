"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { uploadBuktiTransfer } from "@/actions/pemesanan-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UploadBuktiProps {
  pesananId: number;
  currentBukti?: string | null;
}

export default function UploadBukti({ pesananId, currentBukti }: UploadBuktiProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
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

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "catering_preset");

      // Upload ke Cloudinary
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

      // Simpan URL ke database
      const result = await uploadBuktiTransfer(pesananId, data.secure_url);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Bukti transfer berhasil diupload");
      setOpen(false);
      router.refresh();
      
      // Reset state
      setFile(null);
      setPreview(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={currentBukti ? "outline" : "default"} 
          className={currentBukti ? "w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800" : "w-full bg-orange-600 hover:bg-orange-700 text-white"}
        >
          {currentBukti ? (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Ulang Bukti
              </>
          ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Bukti Transfer
              </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Bukti Transfer</DialogTitle>
          <DialogDescription>
            Silakan upload foto bukti transfer pembayaran Anda. Pastikan nominal dan nomor rekening terlihat jelas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="bukti">Foto Bukti Transfer</Label>
            <Input id="bukti" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          
          {preview && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-gray-100 mt-2">
              <Image 
                src={preview} 
                alt="Preview bukti transfer" 
                fill 
                className="object-contain" 
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={handleUpload} disabled={!file || uploading} className="bg-orange-600 hover:bg-orange-700">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Simpan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}