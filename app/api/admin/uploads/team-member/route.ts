import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { imagekit } from "@/lib/imagekit";

export async function POST(req: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const fileName = (formData.get("fileName") as string) || "team-member";

  if (!(file instanceof Blob)) {
    return new NextResponse("Missing file", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const uploaded = await imagekit.upload({
      file: buffer,
      fileName,
      folder: `${process.env.NEXT_PUBLIC_SITE_NAME}/team-members`,
    });

    return NextResponse.json({
      url: uploaded.url,
      thumbnailUrl: uploaded.thumbnailUrl,
      fileId: uploaded.fileId,
    });
  } catch (err) {
    console.error("ImageKit upload error", err);
    return new NextResponse("Upload failed", { status: 500 });
  }
}


