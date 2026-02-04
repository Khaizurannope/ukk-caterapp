"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateProfileSchema, UpdateProfileInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: UpdateProfileInput) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Anda harus login terlebih dahulu" };
  }

  const validatedFields = UpdateProfileSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Data tidak valid" };
  }

  const { namaPelanggan, tglLahir, telepon, alamat1, alamat2, alamat3, foto } = validatedFields.data;

  try {
    await prisma.pelanggan.update({
      where: {
        email: session.user.email,
      },
      data: {
        namaPelanggan,
        tglLahir: tglLahir ? new Date(tglLahir) : null,
        telepon,
        alamat1,
        alamat2: alamat2 || null, // Ensure empty string becomes null if desired, or keep as string
        alamat3: alamat3 || null,
        foto,
      },
    });

    revalidatePath("/pelanggan/profil");
    return { success: "Profil berhasil diperbarui" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Gagal memperbarui profil" };
  }
}
