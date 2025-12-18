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
  const { name, role, department, email, bio, image, linkedinUrl } = body as {
    name?: string;
    role?: string;
    department?: string;
    email?: string;
    bio?: string;
    image?: string;
    linkedinUrl?: string | null;
  };

  const updated = await prisma.teamMember.update({
    where: { id },
    data: {
      name,
      role,
      department,
      email,
      bio,
      image,
      linkedinUrl,
    },
    select: {
      id: true,
      name: true,
      role: true,
      department: true,
      email: true,
      bio: true,
      image: true,
      linkedinUrl: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.teamMember.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}


