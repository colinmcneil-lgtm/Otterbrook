import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MandateCard } from "@/components/MandateCard";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.companyId) {
    redirect("/login");
  }

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
  });

  const mandates = await prisma.mandate.findMany({
    where: { companyId: session.user.companyId },
    include: {
      candidates: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const openMandates = mandates.filter((m) => m.status === "OPEN");
  const otherMandates = mandates.filter((m) => m.status !== "OPEN");

  const totalCandidates = mandates.reduce((sum, m) => sum + m.candidates.length, 0);
  const activeCandidates = mandates.reduce(
    (sum, m) =>
      sum +
      m.candidates.filter((c) =>
        ["SOURCED", "SCREENING", "SUBMITTED", "CLIENT_INTERVIEW", "OFFER"].includes(c.stage)
      ).length,
    0
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {company?.name ?? "Your"} — Open Roles
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Live view of your recruitment mandates and candidate pipeline.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Open Mandates</p>
          <p className="text-3xl font-bold text-[#0F2240] mt-1">{openMandates.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Candidates</p>
          <p className="text-3xl font-bold text-[#0F2240] mt-1">{totalCandidates}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Active in Pipeline</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{activeCandidates}</p>
        </div>
      </div>

      {/* Open Mandates */}
      {openMandates.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Open Mandates
          </h2>
          <div className="grid gap-4">
            {openMandates.map((mandate) => (
              <MandateCard
                key={mandate.id}
                mandate={mandate}
                href={`/mandates/${mandate.id}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Other Mandates */}
      {otherMandates.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Other Mandates
          </h2>
          <div className="grid gap-4">
            {otherMandates.map((mandate) => (
              <MandateCard
                key={mandate.id}
                mandate={mandate}
                href={`/mandates/${mandate.id}`}
              />
            ))}
          </div>
        </section>
      )}

      {mandates.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No mandates yet</p>
          <p className="text-sm mt-1">Your Otterbrook team will add roles here as they are opened.</p>
        </div>
      )}
    </div>
  );
}
