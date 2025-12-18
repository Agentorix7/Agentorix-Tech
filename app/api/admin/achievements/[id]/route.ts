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

  // Validate type if provided
  if (type && type !== "ACHIEVEMENT" && type !== "CERTIFICATION") {
    return new NextResponse("Invalid type. Must be ACHIEVEMENT or CERTIFICATION", { status: 400 });
  }

  // Build update data object based on type
  const updateData: any = {};

  // Always update these if provided
  if (type !== undefined) updateData.type = type;
  if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
  if (isActive !== undefined) updateData.isActive = isActive;

  // Update fields based on the type being updated
  if (type === "ACHIEVEMENT") {
    // For achievements, update achievement fields (set to null if not provided)
    updateData.icon = icon ?? null;
    updateData.title = title ?? null;
    updateData.organization = organization ?? null;
    updateData.year = year ?? null;
    updateData.description = description ?? null;
    updateData.image = image ?? null;
    // Clear certification fields
    updateData.name = null;
    updateData.status = null;
    updateData.logo = null;
  } else if (type === "CERTIFICATION") {
    // For certifications, update certification fields (set to null if not provided)
    updateData.name = name ?? null;
    updateData.status = status ?? null;
    updateData.logo = logo ?? null;
    // Clear achievement fields
    updateData.icon = null;
    updateData.title = null;
    updateData.organization = null;
    updateData.year = null;
    updateData.description = null;
    updateData.image = null;
  } else {
    // If type is not provided, only update fields that are explicitly provided
    if (icon !== undefined) updateData.icon = icon;
    if (title !== undefined) updateData.title = title;
    if (organization !== undefined) updateData.organization = organization;
    if (year !== undefined) updateData.year = year;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (name !== undefined) updateData.name = name;
    if (status !== undefined) updateData.status = status;
    if (logo !== undefined) updateData.logo = logo;
  }

  const updated = await prisma.achievementCertification.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.achievementCertification.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}

