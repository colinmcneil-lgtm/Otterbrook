import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, website, userName, userEmail, userPassword } = body;

  if (!name || !userName || !userEmail || !userPassword) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (userPassword.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
  if (existingUser) {
    return NextResponse.json({ error: "A user with that email already exists." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(userPassword, 10);

  const company = await prisma.company.create({
    data: {
      name,
      website: website || null,
      users: {
        create: {
          name: userName,
          email: userEmail,
          password: hashedPassword,
          role: "CLIENT",
        },
      },
    },
  });

  return NextResponse.json(company, { status: 201 });
}
