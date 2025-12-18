import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const achievements = await prisma.achievementCertification.findMany({
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json(achievements);
}

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const {
    type,
    // Achievement fields
    icon,
    title,
    organization,
    year,
    description,
    image,
    // Certification fields
    name,
    status,
    logo,
    // Common fields
    displayOrder,
    isActive,
  } = body;

  if (!type || (type !== "ACHIEVEMENT" && type !== "CERTIFICATION")) {
    return new NextResponse("Invalid type. Must be ACHIEVEMENT or CERTIFICATION", { status: 400 });
  }

  // Validate required fields based on type
  if (type === "ACHIEVEMENT" && !title) {
    return new NextResponse("Title is required for achievements", { status: 400 });
  }

  if (type === "CERTIFICATION" && !name) {
    return new NextResponse("Name is required for certifications", { status: 400 });
  }

  const created = await prisma.achievementCertification.create({
    data: {
      type,
      // Achievement fields
      icon: icon || null,
      title: title || null,
      organization: organization || null,
      year: year || null,
      description: description || null,
      image: image || null,
      // Certification fields
      name: name || null,
      status: status || null,
      logo: logo || null,
      // Common fields
      displayOrder: displayOrder ?? null,
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(created);
}

