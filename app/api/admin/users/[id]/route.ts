import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { isAdmin, name, email } = body as {
    isAdmin?: boolean;
    name?: string;
    email?: string;
  };

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(typeof isAdmin === "boolean" ? { isAdmin } : {}),
      ...(name ? { name } : {}),
      ...(email ? { email: email.toLowerCase() } : {}),
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
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.user.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}


