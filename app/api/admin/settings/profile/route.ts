import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return new NextResponse(
      error.message || "Failed to update profile",
      { status: 500 }
    );
  }
}

