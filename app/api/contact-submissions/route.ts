import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
    };

    if (!name || !email || !subject || !message) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const created = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[CONTACT_SUBMISSION_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


