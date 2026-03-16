export function formatStage(stage: string): string {
  const map: Record<string, string> = {
    SOURCED: "Sourced",
    SCREENING: "Screening",
    SUBMITTED: "Submitted",
    CLIENT_INTERVIEW: "Client Interview",
    OFFER: "Offer",
    PLACED: "Placed",
    REJECTED: "Rejected",
  };
  return map[stage] ?? stage;
}

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    OPEN: "Open",
    CLOSED: "Closed",
    ON_HOLD: "On Hold",
  };
  return map[status] ?? status;
}

export function stageColor(stage: string): string {
  const map: Record<string, string> = {
    SOURCED: "bg-slate-100 text-slate-700 border-slate-200",
    SCREENING: "bg-blue-100 text-blue-700 border-blue-200",
    SUBMITTED: "bg-purple-100 text-purple-700 border-purple-200",
    CLIENT_INTERVIEW: "bg-amber-100 text-amber-700 border-amber-200",
    OFFER: "bg-orange-100 text-orange-700 border-orange-200",
    PLACED: "bg-green-100 text-green-700 border-green-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
  };
  return map[stage] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    OPEN: "bg-green-100 text-green-700 border-green-200",
    CLOSED: "bg-gray-100 text-gray-600 border-gray-200",
    ON_HOLD: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
}

export const ALL_STAGES: string[] = [
  "SOURCED",
  "SCREENING",
  "SUBMITTED",
  "CLIENT_INTERVIEW",
  "OFFER",
  "PLACED",
  "REJECTED",
];
