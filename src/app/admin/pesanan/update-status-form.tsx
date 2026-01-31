"use client";

import { useTransition } from "react";
import { updateStatusPemesanan } from "@/actions/pemesanan-actions";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface UpdateStatusFormProps {
  id: number;
  currentStatus: string;
  nextStatus: "Menunggu_Konfirmasi" | "Sedang_Diproses" | "Menunggu_Kurir";
  label: string;
}

export default function UpdateStatusForm({
  id,
  nextStatus,
  label,
}: UpdateStatusFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(async () => {
      const result = await updateStatusPemesanan({
        id,
        statusPesan: nextStatus,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
    });
  };

  return (
    <Button
      size="sm"
      onClick={handleUpdate}
      disabled={isPending}
      className="bg-green-500 hover:bg-green-600"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <CheckCircle className="mr-1 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
