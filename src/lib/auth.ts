import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const loginType = credentials.loginType as string;

        // Login Staff (Admin/Owner/Kurir)
        if (loginType === "staff") {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("Email tidak ditemukan");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error("Password salah");
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.level,
            type: "staff",
          };
        }

        // Login Pelanggan (Customer)
        if (loginType === "customer") {
          const pelanggan = await prisma.pelanggan.findUnique({
            where: { email },
          });

          if (!pelanggan) {
            throw new Error("Email tidak ditemukan");
          }

          const isPasswordValid = await bcrypt.compare(password, pelanggan.password);

          if (!isPasswordValid) {
            throw new Error("Password salah");
          }

          return {
            id: pelanggan.id.toString(),
            email: pelanggan.email,
            name: pelanggan.namaPelanggan,
            role: "pelanggan",
            type: "customer",
          };
        }

        throw new Error("Tipe login tidak valid");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.type = user.type;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.type = token.type as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
