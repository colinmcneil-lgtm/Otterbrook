import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { StageBadge } from "@/components/StageBadge";
import { ALL_STAGES, formatStage } from "@/lib/utils";
import AdminMandateActions from "./AdminMandateActions";

export default async function AdminMandateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const mandate = await prisma.mandate.findUnique({
    where: { id: params.id },
    include: {
      company: true,
      candidates: {
        include: { candidate: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!mandate) notFound();

  const allCandidates = await prisma.candidate.findMany({
    orderBy: { name: "asc" },
  });

  // Candidates not yet on this mandate
  const assignedIds = new Set(mandate.candidates.map((c) => c.candidateId));
  const unassignedCandidates = allCandidates.filter((c) => !assignedIds.has(c.id));

  const byStage = ALL_STAGES.reduce<
    Record<string, typeof mandate.candidates>
  >((acc, stage) => {
    acc[stage] = mandate.candidates.filter((c) => c.stage === stage);
    return acc;
  }, {} as Record<string, typeof mandate.candidates>);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/admin/mandates" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Mandates
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{mandate.title}</h1>
            <Link href={`/admin/companies/${mandate.company.id}`} className="text-sm text-amber-600 hover:underline mt-0.5 inline-block">
              {mandate.company.name}
            </Link>
          </div>
          <StatusBadge status={mandate.status} />
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm text-slate-600">
          <span>{mandate.location}</span>
          {mandate.salaryRange && <span>{mandate.salaryRange}</span>}
        </div>
        <p className="text-slate-600 text-sm mt-4 leading-relaxed">{mandate.description}</p>
      </div>

      {/* Admin actions: add candidate, update stages */}
      <AdminMandateActions
        mandateId={mandate.id}
        unassignedCandidates={unassignedCandidates}
        candidates={mandate.candidates.map((c) => ({
          id: c.id,
          name: c.candidate.name,
          email: c.candidate.email,
          stage: c.stage,
          notes: c.notes ?? "",
        }))}
      />

      {/* Pipeline */}
      <div className="mt-8 space-y-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pipeline</h2>
        {ALL_STAGES.filter((s) => byStage[s].length > 0).map((stage) => (
          <section key={stage}>
            <div className="flex items-center gap-2 mb-3">
              <StageBadge stage={stage} />
              <span className="text-xs text-slate-400">{byStage[stage].length}</span>
            </div>
            <div className="grid gap-3">
              {byStage[stage].map((entry) => (
                <div key={entry.id} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{entry.candidate.name}</p>
                      <p className="text-xs text-slate-500">{entry.candidate.email}</p>
                    </div>
                    <StageBadge stage={entry.stage} />
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 rounded p-2 leading-relaxed">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
        {mandate.candidates.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
            No candidates assigned yet.
          </div>
        )}
      </div>
    </div>
  );
}
