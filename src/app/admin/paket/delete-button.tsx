"use client";

import { useTransition } from "react";
import { deletePaket } from "@/actions/paket-actions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeletePaketButtonProps {
  id: number;
}

export default function DeletePaketButton({ id }: DeletePaketButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return;

    startTransition(async () => {
      const result = await deletePaket(id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
