import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function MandatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Admin should manage mandates via /admin routes
  if (session.user.role === "ADMIN") {
    // Allow admins through — they may navigate here from client-facing view
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role={session.user.role}
        userName={session.user.name ?? ""}
        companyName={session.user.companyName}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
