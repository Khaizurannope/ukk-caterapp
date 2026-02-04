import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Eye } from "lucide-react";
import Link from "next/link";
import DeletePelangganButton from "./delete-button";

async function getAllPelanggan() {
  return await prisma.pelanggan.findMany({
    include: {
      _count: {
        select: { pemesanans: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminPelangganPage() {
  const pelanggans = await getAllPelanggan();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Pelanggan</h1>
        <p className="text-muted-foreground">Daftar pelanggan yang terdaftar - Klik detail untuk melihat profil lengkap termasuk KTP</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pelanggan ({pelanggans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pelanggans.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada pelanggan terdaftar
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead>Alamat Utama</TableHead>
                    <TableHead>KTP</TableHead>
                    <TableHead>Total Pesanan</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pelanggans.map((pelanggan) => (
                    <TableRow key={pelanggan.id.toString()}>
                      <TableCell className="font-medium">
                        {pelanggan.namaPelanggan}
                      </TableCell>
                      <TableCell>{pelanggan.email}</TableCell>
                      <TableCell>{pelanggan.telepon || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {pelanggan.alamat1 || "-"}
                      </TableCell>
                      <TableCell>
                        {pelanggan.kartuId ? (
                          <span className="text-green-600 text-sm">✓ Ada</span>
                        ) : (
                          <span className="text-red-500 text-sm">✗ Tidak ada</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {pelanggan._count.pemesanans} pesanan
                      </TableCell>
                      <TableCell>
                        {format(pelanggan.createdAt, "dd MMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/pelanggan/${pelanggan.id.toString()}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Detail
                            </Button>
                          </Link>
                          <DeletePelangganButton 
                            id={Number(pelanggan.id)} 
                            nama={pelanggan.namaPelanggan}
                            hasPesanan={pelanggan._count.pemesanans > 0}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
