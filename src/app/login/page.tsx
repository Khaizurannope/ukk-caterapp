"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"customer" | "staff">("customer");

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginInput) => {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          loginType: activeTab,
          redirect: false,
        });

        if (result?.error) {
          // Semua error dari credentials login ditampilkan sebagai invalid email/password
          // NextAuth mengembalikan "CredentialsSignin" atau "Configuration" untuk error autentikasi
          toast.error("Email atau password tidak valid. Silakan coba lagi.");
          return;
        }

        toast.success("Login berhasil!");

        // Redirect based on role
        if (activeTab === "staff") {
          // Fetch session to get role
          const res = await fetch("/api/auth/session");
          const session = await res.json();
          
          if (session?.user?.role === "admin") {
            router.push("/admin");
          } else if (session?.user?.role === "owner") {
            router.push("/owner");
          } else if (session?.user?.role === "kurir") {
            router.push("/kurir");
          }
        } else {
          router.push(callbackUrl === "/login" ? "/" : callbackUrl);
        }

        router.refresh();
      } catch {
        toast.error("Terjadi kesalahan");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4 hover-lift">
            <ChefHat className="h-10 w-10 text-orange-500" />
          </Link>
          <CardTitle className="text-2xl">Selamat Datang</CardTitle>
          <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "customer" | "staff")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="customer">Pelanggan</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="customer" className="mt-0 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Login sebagai pelanggan untuk memesan catering
                </p>
              </TabsContent>

              <TabsContent value="staff" className="mt-0 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Login untuk Admin, Owner, atau Kurir
                </p>
              </TabsContent>

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
                  placeholder="••••••••"
                  {...form.register("password")}
                  disabled={isPending}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
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
                  "Masuk"
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {activeTab === "customer" && (
            <p className="text-sm text-center text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-orange-500 hover:underline font-medium">
                Daftar sekarang
              </Link>
            </p>
          )}
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Kembali ke beranda
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
