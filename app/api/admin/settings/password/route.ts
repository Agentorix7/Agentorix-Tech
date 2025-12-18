import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export async function PATCH(req: Request) {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse("Current password and new password are required", { status: 400 });
    }

    if (newPassword.length < 8) {
      return new NextResponse("New password must be at least 8 characters long", { status: 400 });
    }

    // Get current user with password hash
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return new NextResponse("Current password is incorrect", { status: 400 });
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Password change error:", error);
    return new NextResponse(
      error.message || "Failed to change password",
      { status: 500 }
    );
  }
}

