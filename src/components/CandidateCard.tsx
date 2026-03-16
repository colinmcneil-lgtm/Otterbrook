import { Candidate, CandidateOnMandate } from "@prisma/client";
import { StageBadge } from "./StageBadge";

type CandidateWithStage = CandidateOnMandate & {
  candidate: Candidate;
};

interface CandidateCardProps {
  entry: CandidateWithStage;
  showNotes?: boolean;
}

export function CandidateCard({ entry, showNotes = false }: CandidateCardProps) {
  const initials = entry.candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {entry.candidate.name}
            </p>
            <StageBadge stage={entry.stage} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{entry.candidate.email}</p>
          {entry.candidate.linkedinUrl && (
            <a
              href={entry.candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-navy-600 hover:text-navy-800 hover:underline mt-0.5 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              LinkedIn →
            </a>
          )}
          {showNotes && entry.notes && (
            <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded p-2 leading-relaxed">
              {entry.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
