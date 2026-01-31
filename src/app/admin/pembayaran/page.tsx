import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

async function getJenisPembayaran() {
  return await prisma.jenisPembayaran.findMany({
    include: {
      detailJenisPembayarans: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminPembayaranPage() {
  const jenisPembayarans = await getJenisPembayaran();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Metode Pembayaran</h1>
        <p className="text-muted-foreground">Daftar metode pembayaran yang tersedia</p>
      </div>

      {jenisPembayarans.map((jenis) => (
        <Card key={jenis.id.toString()}>
          <CardHeader>
            <CardTitle>{jenis.metodePembayaran}</CardTitle>
          </CardHeader>
          <CardContent>
            {jenis.detailJenisPembayarans.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Belum ada rekening untuk metode ini
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank/Platform</TableHead>
                    <TableHead>No. Rekening</TableHead>
                    <TableHead>Logo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jenis.detailJenisPembayarans.map((detail) => (
                    <TableRow key={detail.id.toString()}>
                      <TableCell className="font-medium">
                        {detail.tempatBayar}
                      </TableCell>
                      <TableCell className="font-mono">
                        {detail.noRek}
                      </TableCell>
                      <TableCell>
                        {detail.logo ? (
                          <img
                            src={detail.logo}
                            alt={detail.tempatBayar}
                            className="h-8 w-auto"
                          />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ))}

      {jenisPembayarans.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Belum ada metode pembayaran. Data akan muncul setelah seeding.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
