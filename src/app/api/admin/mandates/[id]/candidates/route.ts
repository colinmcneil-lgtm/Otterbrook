import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CandidateStage } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { candidateId, stage, notes } = await req.json();

  if (!candidateId) {
    return NextResponse.json({ error: "candidateId is required." }, { status: 400 });
  }

  const validStages: CandidateStage[] = [
    "SOURCED", "SCREENING", "SUBMITTED", "CLIENT_INTERVIEW", "OFFER", "PLACED", "REJECTED",
  ];
  const candidateStage: CandidateStage = validStages.includes(stage) ? stage : "SOURCED";

  const entry = await prisma.candidateOnMandate.create({
    data: {
      mandateId: params.id,
      candidateId,
      stage: candidateStage,
      notes: notes || null,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
