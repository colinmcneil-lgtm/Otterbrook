import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CandidateStage } from "@prisma/client";

// POST /api/admin/stage-update
// Body: { candidateOnMandateId, stage, notes? }
// OR: { candidateId, mandateId, stage, notes? }  (to add a new CandidateOnMandate)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const validStages: CandidateStage[] = [
    "SOURCED", "SCREENING", "SUBMITTED", "CLIENT_INTERVIEW", "OFFER", "PLACED", "REJECTED",
  ];

  if (body.candidateOnMandateId) {
    // Update existing
    const { candidateOnMandateId, stage, notes } = body;

    if (!validStages.includes(stage)) {
      return NextResponse.json({ error: "Invalid stage." }, { status: 400 });
    }

    const entry = await prisma.candidateOnMandate.update({
      where: { id: candidateOnMandateId },
      data: {
        stage,
        ...(notes !== undefined && { notes: notes || null }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(entry);
  } else {
    // Add candidate to mandate
    const { candidateId, mandateId, stage, notes } = body;

    if (!candidateId || !mandateId) {
      return NextResponse.json({ error: "candidateId and mandateId required." }, { status: 400 });
    }

    const stageValue: CandidateStage = validStages.includes(stage) ? stage : "SOURCED";

    const entry = await prisma.candidateOnMandate.upsert({
      where: { candidateId_mandateId: { candidateId, mandateId } },
      update: {
        stage: stageValue,
        ...(notes !== undefined && { notes: notes || null }),
        updatedAt: new Date(),
      },
      create: {
        candidateId,
        mandateId,
        stage: stageValue,
        notes: notes || null,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  }
}
