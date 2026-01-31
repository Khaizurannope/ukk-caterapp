"use client";

import Image from "next/image";
import { useState } from "react";
import { Utensils, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: (string | null)[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  // Filter gambar yang tidak null, undefined, atau string kosong
  const validImages = images.filter((img): img is string => 
    img !== null && img !== undefined && img !== "" && img.trim() !== ""
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Jika tidak ada gambar
  if (validImages.length === 0) {
    return (
      <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <Utensils className="h-20 w-20 text-gray-300" />
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Gambar Utama */}
      <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={validImages[selectedIndex]}
          alt={`${productName} - Gambar ${selectedIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300"
          priority
        />
        
        {/* Navigasi Panah (tampil jika lebih dari 1 gambar) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Gambar selanjutnya"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </>
        )}

        {/* Indikator Gambar */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === selectedIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Lihat gambar ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail (tampil jika lebih dari 1 gambar) */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {validImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 transition-all",
                index === selectedIndex
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : "border-transparent hover:border-gray-300"
              )}
            >
              <Image
                src={img}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
