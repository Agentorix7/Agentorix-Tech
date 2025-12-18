import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const services = await prisma.service.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      overview: true,
      image: true,
      icon: true,
      isMainService: true,
      isActive: true,
      displayOrder: true,
      sections: true,
      features: true,
      benefits: true,
      useCases: true,
      caseStudies: true,
      pricing: true,
      cta: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const {
    slug,
    title,
    shortDescription,
    overview,
    image,
    icon,
    isMainService,
    isActive,
    displayOrder,
    sections,
    features,
    benefits,
    useCases,
    caseStudies,
    pricing,
    cta,
  } = body as any;

  if (!slug || !title || !shortDescription || !overview) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const created = await prisma.service.create({
    data: {
      slug,
      title,
      shortDescription,
      overview,
      image: image || "",
      icon: icon || "",
      isMainService: Boolean(isMainService),
      isActive: isActive ?? true,
      displayOrder: displayOrder ?? null,
      sections: sections ?? null,
      features: features ?? null,
      benefits: benefits ?? null,
      useCases: useCases ?? null,
      caseStudies: caseStudies ?? null,
      pricing: pricing ?? null,
      cta: cta ?? null,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      shortDescription: true,
      overview: true,
      image: true,
      icon: true,
      isMainService: true,
      isActive: true,
      displayOrder: true,
      sections: true,
      features: true,
      benefits: true,
      useCases: true,
      caseStudies: true,
      pricing: true,
      cta: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

