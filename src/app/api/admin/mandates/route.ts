import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MandateStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { companyId, title, description, location, salaryRange, status } = body;

  if (!companyId || !title || !description || !location) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const validStatuses: MandateStatus[] = ["OPEN", "CLOSED", "ON_HOLD"];
  const mandateStatus: MandateStatus = validStatuses.includes(status) ? status : "OPEN";

  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) {
    return NextResponse.json({ error: "Company not found." }, { status: 404 });
  }

  const mandate = await prisma.mandate.create({
    data: {
      title,
      description,
      location,
      salaryRange: salaryRange || null,
      status: mandateStatus,
      companyId,
    },
  });

  return NextResponse.json(mandate, { status: 201 });
}
