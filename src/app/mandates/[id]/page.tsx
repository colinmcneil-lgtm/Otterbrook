import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { CandidateCard } from "@/components/CandidateCard";
import { StatusBadge } from "@/components/StatusBadge";
import { StageBadge } from "@/components/StageBadge";
import { ALL_STAGES, formatStage } from "@/lib/utils";
import { CandidateStage } from "@prisma/client";
import Link from "next/link";

export default async function MandatePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

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

  // Clients can only see their own company's mandates
  if (
    session.user.role === "CLIENT" &&
    mandate.companyId !== session.user.companyId
  ) {
    notFound();
  }

  // Group candidates by stage
  const byStage = ALL_STAGES.reduce<
    Record<CandidateStage, typeof mandate.candidates>
  >((acc, stage) => {
    acc[stage] = mandate.candidates.filter((c) => c.stage === stage);
    return acc;
  }, {} as Record<CandidateStage, typeof mandate.candidates>);

  const activeStages: CandidateStage[] = [
    "SOURCED",
    "SCREENING",
    "SUBMITTED",
    "CLIENT_INTERVIEW",
    "OFFER",
    "PLACED",
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href={session.user.role === "ADMIN" ? `/admin/mandates` : "/dashboard"}
        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{mandate.title}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{mandate.company.name}</p>
          </div>
          <StatusBadge status={mandate.status} />
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {mandate.location}
          </span>
          {mandate.salaryRange && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {mandate.salaryRange}
            </span>
          )}
        </div>

        <p className="text-slate-600 text-sm mt-4 leading-relaxed">{mandate.description}</p>
      </div>

      {/* Pipeline progress bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Pipeline Overview</h2>
        <div className="flex items-center gap-1">
          {activeStages.map((stage, i) => {
            const count = byStage[stage].length;
            const isLast = i === activeStages.length - 1;
            return (
              <div key={stage} className="flex items-center gap-1 flex-1">
                <div className="flex-1 text-center">
                  <div
                    className={`h-2 rounded-full mb-1.5 ${
                      count > 0 ? "bg-[#0F2240]" : "bg-slate-100"
                    }`}
                  />
                  <p className="text-xs text-slate-500 truncate">{formatStage(stage)}</p>
                  <p className={`text-sm font-bold ${count > 0 ? "text-[#0F2240]" : "text-slate-300"}`}>
                    {count}
                  </p>
                </div>
                {!isLast && (
                  <svg className="w-3 h-3 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Candidates by stage */}
      <div className="space-y-6">
        {ALL_STAGES.filter((s) => byStage[s].length > 0).map((stage) => (
          <section key={stage}>
            <div className="flex items-center gap-2 mb-3">
              <StageBadge stage={stage} />
              <span className="text-xs text-slate-400">{byStage[stage].length}</span>
            </div>
            <div className="grid gap-3">
              {byStage[stage].map((entry) => (
                <CandidateCard key={entry.id} entry={entry} showNotes />
              ))}
            </div>
          </section>
        ))}

        {mandate.candidates.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="font-medium">No candidates yet</p>
            <p className="text-sm mt-1">Otterbrook will add candidates as sourcing begins.</p>
          </div>
        )}
      </div>
    </div>
  );
}
