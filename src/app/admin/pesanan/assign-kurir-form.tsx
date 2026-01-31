"use client";

import { useState, useTransition } from "react";
import { assignKurir } from "@/actions/pengiriman-actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Truck } from "lucide-react";
import { toast } from "sonner";

interface AssignKurirFormProps {
  idPesan: number;
  kurirs: { id: number; name: string }[];
}

export default function AssignKurirForm({ idPesan, kurirs }: AssignKurirFormProps) {
  const [selectedKurir, setSelectedKurir] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleAssign = () => {
    if (!selectedKurir) {
      toast.error("Pilih kurir terlebih dahulu");
      return;
    }

    startTransition(async () => {
      const result = await assignKurir({
        idPesan,
        idUser: parseInt(selectedKurir),
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Select value={selectedKurir} onValueChange={setSelectedKurir}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Pilih Kurir" />
        </SelectTrigger>
        <SelectContent>
          {kurirs.map((kurir) => (
            <SelectItem key={kurir.id} value={kurir.id.toString()}>
              {kurir.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        onClick={handleAssign}
        disabled={isPending || !selectedKurir}
        className="bg-purple-500 hover:bg-purple-600"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Truck className="mr-1 h-4 w-4" />
            Kirim
          </>
        )}
      </Button>
    </div>
  );
}
