import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const team = await prisma.teamMember.findMany({
    orderBy: { createdAt: "desc" },
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

  return NextResponse.json(team);
}

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { name, role, department, email, bio, image, linkedinUrl } = body as {
    name: string;
    role: string;
    department: string;
    email: string;
    bio?: string;
    image?: string;
    linkedinUrl?: string;
  };

  if (!name || !role || !department || !email) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const created = await prisma.teamMember.create({
    data: {
      name,
      role,
      department,
      email,
      image: image || "/icon.png",
      bio: bio || "",
      linkedinUrl: linkedinUrl || null,
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

  return NextResponse.json(created);
}


