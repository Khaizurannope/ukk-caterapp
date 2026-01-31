"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterPelangganSchema, RegisterPelangganInput } from "@/lib/validations";
import { registerPelanggan } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterPelangganInput>({
    resolver: zodResolver(RegisterPelangganSchema),
    defaultValues: {
      namaPelanggan: "",
      email: "",
      password: "",
      telepon: "",
      alamat1: "",
    },
  });

  const onSubmit = (values: RegisterPelangganInput) => {
    startTransition(async () => {
      const result = await registerPelanggan(values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      router.push("/login");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="h-10 w-10 text-orange-500" />
          </Link>
          <CardTitle className="text-2xl">Daftar Akun</CardTitle>
          <CardDescription>Buat akun untuk memesan catering</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="namaPelanggan">Nama Lengkap</Label>
              <Input
                id="namaPelanggan"
                placeholder="Masukkan nama lengkap"
                {...form.register("namaPelanggan")}
                disabled={isPending}
              />
              {form.formState.errors.namaPelanggan && (
                <p className="text-sm text-red-500">{form.formState.errors.namaPelanggan.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                {...form.register("email")}
                disabled={isPending}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                {...form.register("password")}
                disabled={isPending}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telepon">Nomor Telepon</Label>
              <Input
                id="telepon"
                placeholder="081234567890"
                {...form.register("telepon")}
                disabled={isPending}
              />
              {form.formState.errors.telepon && (
                <p className="text-sm text-red-500">{form.formState.errors.telepon.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamat1">Alamat</Label>
              <Textarea
                id="alamat1"
                placeholder="Masukkan alamat lengkap"
                {...form.register("alamat1")}
                disabled={isPending}
              />
              {form.formState.errors.alamat1 && (
                <p className="text-sm text-red-500">{form.formState.errors.alamat1.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-center text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-orange-500 hover:underline font-medium">
              Masuk di sini
            </Link>
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Kembali ke beranda
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
