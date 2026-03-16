import { formatStage, stageColor } from "@/lib/utils";

interface StageBadgeProps {
  stage: string;
  className?: string;
}

export function StageBadge({ stage, className = "" }: StageBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stageColor(stage)} ${className}`}
    >
      {formatStage(stage)}
    </span>
  );
}
