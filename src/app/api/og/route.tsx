import { ImageResponse } from "next/og";
import { builderClass, builderId } from "@/lib/builderClass";

export const runtime = "nodejs";

/**
 * Server-side card for link previews. Satori supports flexbox only —
 * this is a deliberately simplified sibling of PassCard, not a reuse of it.
 * The user's photo can't ride along in a URL, so the photo slot becomes a
 * branded monogram. Never a blank thumbnail.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("n") || "A Builder").slice(0, 24);
  const stack = (searchParams.get("s") || "Full-stack").slice(0, 28);
  const handle = (searchParams.get("h") || "").slice(0, 20).replace(/^@/, "");
  const title = builderClass(stack, name);
  const id = builderId(name, handle);
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "HH";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(150deg,#0E2620 0%,#123329 45%,#071613 100%)",
          padding: "56px 64px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* sunset disc */}
        <div
          style={{
            position: "absolute",
            right: -110,
            top: 190,
            width: 300,
            height: 300,
            borderRadius: 999,
            background: "linear-gradient(180deg,#F5A03C 0%,#E8663C 65%,#E8336E 100%)",
            opacity: 0.9,
            display: "flex",
          }}
        />

        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 46,
                fontWeight: 900,
                color: "#F5E9CF",
                letterSpacing: -1,
                lineHeight: 1,
                display: "flex",
              }}
            >
              HACKER HOUSE
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#E8336E",
                letterSpacing: 6,
                marginTop: 10,
                display: "flex",
              }}
            >
              GOA · INDIA · 2026
            </div>
          </div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: "#F5A03C",
              letterSpacing: 6,
              display: "flex",
            }}
          >
            BUILDER PASS
          </div>
        </div>

        {/* body */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div
            style={{
              width: 190,
              height: 190,
              borderRadius: 999,
              background: "linear-gradient(150deg,#F5A03C,#E8336E)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 172,
                height: 172,
                borderRadius: 999,
                background: "#071613",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 68,
                fontWeight: 900,
                color: "#F5E9CF",
              }}
            >
              {initials}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                fontSize: name.length > 14 ? 62 : 76,
                fontWeight: 900,
                color: "#F5E9CF",
                lineHeight: 1,
                letterSpacing: -2,
                display: "flex",
              }}
            >
              {name.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 26,
                color: "#F5E9CF",
                opacity: 0.85,
                marginTop: 14,
                display: "flex",
              }}
            >
              {stack}
              {handle ? `  ·  @${handle}` : ""}
            </div>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "center",
                gap: 14,
                border: "2px solid rgba(232,51,110,0.6)",
                background: "rgba(232,51,110,0.12)",
                borderRadius: 999,
                padding: "10px 22px",
                alignSelf: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#E8336E",
                  letterSpacing: 4,
                  display: "flex",
                }}
              >
                CLASS
              </span>
              <span
                style={{
                  fontSize: 27,
                  fontWeight: 900,
                  color: "#F5E9CF",
                  display: "flex",
                }}
              >
                {title}
              </span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgba(245,233,207,0.2)",
            paddingTop: 22,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: "#F5A03C", display: "flex" }}>
            {id}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#F5E9CF", opacity: 0.8, display: "flex" }}>
            28 — 31 OCT 2026
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, display: "flex" }}>
            <span style={{ color: "#F5E9CF" }}>BUILD. SHIP.&nbsp;</span>
            <span style={{ color: "#F5A03C" }}>SUNSET.</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
