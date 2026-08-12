import { getPhoto, photoTooLarge, savePhoto } from "@/lib/photoStore";

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
  if (photoTooLarge(body.src)) {
    return Response.json({ error: "Photo too large" }, { status: 413 });
  }

  try {
    await savePhoto(key, { src: body.src, width: body.width, height: body.height });
  } catch {
    // savePhoto writes the in-process copy before Mongo, so the photo still
    // works on this instance; only cross-device sharing degrades. Reporting
    // ok:false lets the client know without breaking the flow.
    return Response.json({ ok: false, degraded: true });
  }
  return Response.json({ ok: true });
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const { key } = await params;
  try {
    const photo = await getPhoto(key);
    if (!photo) return Response.json({ error: "Photo unavailable" }, { status: 404 });
    return Response.json(photo, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Photo unavailable" }, { status: 503 });
  }
}
