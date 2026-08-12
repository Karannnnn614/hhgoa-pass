import { ImageResponse } from "next/og";
import { builderId } from "@/lib/builderClass";
import plate from "@/lib/plate.json";
import { getPhoto } from "@/lib/photoStore";

export const runtime = "nodejs";

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

/**
 * Link-preview card. Renders the actual badge artwork (public/plate.png) as
 * the left panel with the user's details beside it, so a shared link previews
 * as the pass rather than a generic banner.
 *
 * Satori supports flexbox only — no grid, no CSS filters.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("n") || "A Builder").slice(0, 26);
  const title = (searchParams.get("t") || "Builder").slice(0, 24);
  const team = (searchParams.get("g") || "").slice(0, 22);
  const stack = (searchParams.get("s") || "").slice(0, 34);
  const handle = (searchParams.get("h") || "").slice(0, 20).replace(/^@/, "");
  const id = builderId(name, handle);
  const storedPhoto = await getPhoto(searchParams.get("p") || "").catch(() => null);

  const parts = name.trim().split(/\s+/).filter(Boolean);
  const line1 = parts[0] ?? "YOUR";
  const line2 = parts.slice(1).join(" ");
  const longest = Math.max(line1.length, line2.length);
  let nameSize = 78;
  if (longest > 12) nameSize = 54;
  else if (longest > 9) nameSize = 66;

  const details = [title, stack, handle ? `@${handle}` : ""]
    .filter(Boolean)
    .join("  ·  ");

  /* Badge geometry: the plate scaled down to fit the preview's left panel.
     K converts plate pixels -> preview pixels so the text lands in the same
     places as on the real card. */
  const PH = 546;
  const K = PH / plate.H;
  const PW = Math.round(plate.W * K);
  const photo = {
    cx: plate.photo.cx * K,
    cy: plate.photo.cy * K,
    r: plate.photo.r * K,
  };
  const badgeName = (longest > 12 ? 74 : longest > 9 ? 86 : 96) * K;

  const initials =
    parts
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "HH";

  // The badge art, inlined so Satori can draw it.
  let plateSrc = "";
  try {
    const res = await fetch(new URL("/plate.png", req.url));
    if (res.ok) {
      plateSrc = `data:image/png;base64,${toBase64(new Uint8Array(await res.arrayBuffer()))}`;
    }
  } catch {
    /* fall through — the layout still reads as the event without it */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0A2622",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* sunset disc, bled off the right edge */}
        <div
          style={{
            position: "absolute",
            right: -190,
            top: 190,
            width: 380,
            height: 380,
            borderRadius: 999,
            background: "#F2762F",
            display: "flex",
          }}
        />

        {/* ---- left: the badge ---- */}
        <div
          style={{
            width: 470,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 40,
          }}
        >
          {/* the badge, with this person's details drawn onto it */}
          <div
            style={{
              position: "relative",
              width: PW,
              height: PH,
              display: "flex",
              // no radius here: the plate art already carries its own
              // rounded corners, and a second one leaves white notches
            }}
          >
            {plateSrc && (
              // Satori renders raw JSX to an image; next/image does not exist
              // in this context, so a plain <img> is required here.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={plateSrc}
                width={PW}
                height={PH}
                style={{ position: "absolute", left: 0, top: 0 }}
                alt=""
              />
            )}

            {storedPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={storedPhoto.src}
                width={photo.r * 2}
                height={photo.r * 2}
                style={{
                  position: "absolute",
                  left: photo.cx - photo.r,
                  top: photo.cy - photo.r,
                  borderRadius: 999,
                  objectFit: "cover",
                }}
                alt=""
              />
            ) : <div
              style={{
                position: "absolute",
                left: photo.cx - photo.r,
                top: photo.cy - photo.r,
                width: photo.r * 2,
                height: photo.r * 2,
                borderRadius: 999,
                background: "#0B211E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: photo.r * 0.8,
                fontWeight: 900,
                color: "#F2E2BC",
              }}
            >
              {initials}
            </div>}

            {/* name + title, in the open area above the box */}
            <div
              style={{
                position: "absolute",
                left: 78 * K,
                top: 1060 * K,
                display: "flex",
                flexDirection: "column",
                fontSize: badgeName,
                fontWeight: 900,
                color: "#F2E2BC",
                lineHeight: 1.02,
              }}
            >
              <span>{line1.toUpperCase()}</span>
              {line2 && <span>{line2.toUpperCase()}</span>}
            </div>
            <div
              style={{
                position: "absolute",
                left: 78 * K,
                top: 1210 * K,
                fontSize: 30 * K,
                fontWeight: 700,
                color: "#F2762F",
                display: "flex",
              }}
            >
              {[title, stack]
                .flatMap((value) => value.split(","))
                .map((value) => value.trim())
                .filter(Boolean)
                .map((value, index) => (
                  <span key={`${value}-${index}`}>
                    {index > 0 && <span style={{ color: "#FF3F68", margin: "0 12px" }}>•</span>}
                    {value}
                  </span>
                ))}
            </div>

            {/* bottom box: team name + X username */}
            <div
              style={{
                position: "absolute",
                left: 170 * K,
                top: 1306 * K,
                fontSize: 32 * K,
                fontWeight: 700,
                color: "#F2EDE3",
                display: "flex",
              }}
            >
              {team || "—"}
            </div>
            <div
              style={{
                position: "absolute",
                left: 170 * K,
                top: 1402 * K,
                fontSize: 32 * K,
                fontWeight: 700,
                color: "#F2EDE3",
                display: "flex",
              }}
            >
              {handle ? `@${handle}` : "—"}
            </div>

            {/* builder id, right side of the box */}
            <div
              style={{
                position: "absolute",
                right: 96 * K,
                top: 1306 * K,
                fontSize: 30 * K,
                fontWeight: 700,
                color: "#F2762F",
                display: "flex",
              }}
            >
              {id}
            </div>
          </div>
        </div>

        {/* ---- right: the details ---- */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 60px 0 20px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#E8336E",
              letterSpacing: 5,
              display: "flex",
            }}
          >
            HACKER HOUSE · GOA 2026
          </div>

          <div
            style={{
              fontSize: nameSize,
              fontWeight: 900,
              color: "#F2E2BC",
              lineHeight: 1.05,
              letterSpacing: -1,
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>{line1.toUpperCase()}</span>
            {line2 && <span>{line2.toUpperCase()}</span>}
          </div>

          <div
            style={{
              fontSize: 27,
              color: "#F2EDE3",
              opacity: 0.9,
              marginTop: 20,
              display: "flex",
            }}
          >
            {details}
          </div>

          <div
            style={{
              marginTop: 34,
              paddingTop: 24,
              borderTop: "2px solid rgba(242,237,227,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#F2762F",
                display: "flex",
              }}
            >
              {id}
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#F2EDE3",
                opacity: 0.85,
                display: "flex",
              }}
            >
              28 — 31 OCT 2026
            </span>
          </div>

          <div style={{ marginTop: 22, fontSize: 22, fontWeight: 700, display: "flex" }}>
            <span style={{ color: "#F2EDE3" }}>CODE. BUILD.&nbsp;</span>
            <span style={{ color: "#F2762F" }}>Party.&nbsp;</span>
            <span style={{ color: "#F2EDE3" }}>REPEAT.</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
