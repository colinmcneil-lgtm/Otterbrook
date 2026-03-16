import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CandidateStage } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; entryId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { stage, notes } = await req.json();

  const validStages: CandidateStage[] = [
    "SOURCED", "SCREENING", "SUBMITTED", "CLIENT_INTERVIEW", "OFFER", "PLACED", "REJECTED",
  ];

  const entry = await prisma.candidateOnMandate.update({
    where: { id: params.entryId },
    data: {
      ...(stage && validStages.includes(stage) && { stage }),
      ...(notes !== undefined && { notes: notes || null }),
    },
  });

  return NextResponse.json(entry);
}
