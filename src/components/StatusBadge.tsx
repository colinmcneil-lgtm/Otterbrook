import { MandateStatus } from "@prisma/client";
import { formatStatus, statusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: MandateStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(status)} ${className}`}
    >
      {formatStatus(status)}
    </span>
  );
}
