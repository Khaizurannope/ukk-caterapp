"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image as ImageIcon, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ViewBukti({ buktiUrl }: { buktiUrl?: string | null }) {
  if (!buktiUrl) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:inline-block">Lihat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Bukti Transfer</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-lg overflow-hidden border mt-2">
            <Image 
                src={buktiUrl} 
                alt="Bukti Transfer" 
                fill 
                className="object-contain" 
            />
        </div>
        <div className="flex justify-end pt-2">
            <Button variant="secondary" size="sm" asChild>
                <Link href={buktiUrl} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buka Original
                </Link>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}