import { getPhoto, savePhoto } from "@/lib/photoStore";

export const runtime = "nodejs";

type Params = Promise<{ key: string }>;

export async function POST(request: Request, { params }: { params: Params }) {
  const { key } = await params;
  const body = await request.json();
  if (
    typeof body?.src !== "string" ||
    !body.src.startsWith("data:image/") ||
    typeof body.width !== "number" ||
    typeof body.height !== "number"
  ) {
    return Response.json({ error: "Invalid photo" }, { status: 400 });
  }
  savePhoto(key, { src: body.src, width: body.width, height: body.height });
  return Response.json({ ok: true });
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const { key } = await params;
  const photo = getPhoto(key);
  if (!photo) return Response.json({ error: "Photo expired or unavailable" }, { status: 404 });
  return Response.json(photo, { headers: { "Cache-Control": "no-store" } });
}
