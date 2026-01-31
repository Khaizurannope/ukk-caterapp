"use server";

import { prisma } from "@/lib/prisma";
import { RegisterPelangganSchema, RegisterPelangganInput } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerPelanggan(data: RegisterPelangganInput) {
  try {
    const validatedData = RegisterPelangganSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    const { email, password, namaPelanggan, telepon, alamat1 } = validatedData.data;

    // Cek email sudah ada atau belum
    const existingPelanggan = await prisma.pelanggan.findUnique({
      where: { email },
    });

    if (existingPelanggan) {
      return { error: "Email sudah terdaftar" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create pelanggan
    await prisma.pelanggan.create({
      data: {
        namaPelanggan,
        email,
        password: hashedPassword,
        telepon,
        alamat1,
      },
    });

    revalidatePath("/login");
    return { success: "Registrasi berhasil! Silakan login" };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan sistem" };
  }
}
