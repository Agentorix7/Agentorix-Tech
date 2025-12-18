import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    users.map((u: typeof users[0]) => ({ ...u, createdAt: u.createdAt.toISOString() }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { name, email, password, isAdmin } = body as {
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;
  };

  if (!name || !email || !password) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const passwordHash = await hash(password, 12);

  const created = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      isAdmin: Boolean(isAdmin),
    },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    ...created,
    createdAt: created.createdAt.toISOString(),
  });
}


