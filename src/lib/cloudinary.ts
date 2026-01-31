import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const extractedPublicId = (url: string) => {
    try {
        const parts = url.split("/");
        const lastPart = parts[parts.length - 1];
        const publicIdWithExtension = lastPart.split(".")[0];
        
        // Menangani folder jika ada (asumsi sederhana: segmen terakhir adalah id)
        // Jika gambar ada di folder, split standar mungkin tidak cukup.
        // Pendekatan regex yang lebih baik untuk URL Cloudinary:
        const regex = /\/v\d+\/(.+)\.[a-z]+$/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        
        return publicIdWithExtension;
    } catch (error) {
        return null;
    }
}

export const deleteImage = async (url: string) => {
  if (!url) return;
  
  const publicId = extractedPublicId(url);
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary gagal menghapus:", error);
    return null;
  }
};
