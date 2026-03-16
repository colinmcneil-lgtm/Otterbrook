import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MandateStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, location, salaryRange, status } = body;

  const validStatuses: MandateStatus[] = ["OPEN", "CLOSED", "ON_HOLD"];

  const mandate = await prisma.mandate.update({
    where: { id: params.id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(location && { location }),
      salaryRange: salaryRange !== undefined ? salaryRange || null : undefined,
      ...(status && validStatuses.includes(status) && { status }),
    },
  });

  return NextResponse.json(mandate);
}
