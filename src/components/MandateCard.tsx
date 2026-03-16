import Link from "next/link";
import { Mandate, CandidateOnMandate } from "@prisma/client";
import { StatusBadge } from "./StatusBadge";
import { formatStage } from "@/lib/utils";

type MandateWithCandidates = Mandate & {
  candidates: CandidateOnMandate[];
  company?: { name: string };
};

interface MandateCardProps {
  mandate: MandateWithCandidates;
  href: string;
  showCompany?: boolean;
}

export function MandateCard({ mandate, href, showCompany = false }: MandateCardProps) {
  const stageCounts = mandate.candidates.reduce<Record<string, number>>((acc, c) => {
    acc[c.stage] = (acc[c.stage] ?? 0) + 1;
    return acc;
  }, {});

  const activeStages: string[] = ["SOURCED", "SCREENING", "SUBMITTED", "CLIENT_INTERVIEW", "OFFER"];
  const activeCandidates = mandate.candidates.filter((c) => activeStages.includes(c.stage));

  return (
    <Link href={href} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-navy-400 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-navy-700 truncate">
              {mandate.title}
            </h3>
            {showCompany && mandate.company && (
              <p className="text-sm text-gray-500 mt-0.5">{mandate.company.name}</p>
            )}
          </div>
          <StatusBadge status={mandate.status} className="ml-3 flex-shrink-0" />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {mandate.location}
          </span>
          {mandate.salaryRange && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {mandate.salaryRange}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              {mandate.candidates.length} candidate{mandate.candidates.length !== 1 ? "s" : ""}
            </span>
            {activeCandidates.length > 0 && (
              <span className="text-xs text-gray-400">
                · {activeCandidates.length} active
              </span>
            )}
          </div>

          {Object.keys(stageCounts).length > 0 && (
            <div className="flex items-center gap-1.5">
              {Object.entries(stageCounts)
                .slice(0, 3)
                .map(([stage, count]) => (
                  <span key={stage} className="text-xs text-gray-500">
                    {formatStage(stage)}: {count}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
