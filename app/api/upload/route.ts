// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createWriteStream } from "fs";
import { mkdir, stat } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs"; // enable Node APIs

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  // Basic validation: type + size
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Max 5MB" }, { status: 400 });
  }

  // Unique filename
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const hash = crypto
    .createHash("sha1")
    .update(`${session.user.id}-${Date.now()}`)
    .digest("hex")
    .slice(0, 10);
  const filename = `${hash}.${ext}`;

  // Save under public/uploads/<userId>/
  const dir = path.join(process.cwd(), "public", "uploads", session.user.id!);
  const filepath = path.join(dir, filename);

  try {
    await stat(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  await new Promise<void>((resolve, reject) => {
    const stream = createWriteStream(filepath);
    stream.on("error", reject);
    stream.on("finish", () => resolve());
    stream.end(buf);
  });

  const url = `/uploads/${encodeURIComponent(session.user.id!)}/${filename}`;
  return NextResponse.json({ url });
}
