import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      company,
      website,
      services,
      projectDescription,
      timeline,
      budget,
    } = body as {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      website?: string;
      services?: string[];
      projectDescription?: string;
      timeline?: string;
      budget?: string;
    };

    if (!name || !email || !phone || !services || services.length === 0 || !projectDescription || !timeline || !budget) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const created = await prisma.quoteRequest.create({
      data: {
        name,
        email,
        phone,
        company: company || null,
        website: website || null,
        services,
        projectDescription,
        timeline,
        budget,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[QUOTE_REQUEST_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


