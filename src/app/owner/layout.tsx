import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "owner") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
