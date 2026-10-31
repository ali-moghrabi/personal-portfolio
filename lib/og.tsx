import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Ali Moghrabi, full-stack web developer";

export function ogImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        color: "white",
        background:
          "radial-gradient(circle at 85% 20%, rgba(122,87,219,0.55), transparent 45%), radial-gradient(circle at 10% 110%, rgba(202,47,140,0.35), transparent 45%), #030412",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 26,
          color: "#a3a3a3",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#57db96",
          }}
        />
        Available for new projects
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 40, color: "#d4d4d4" }}>Hi, I&apos;m</div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.05,
          }}
        >
          Ali Moghrabi
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 46,
            backgroundImage:
              "linear-gradient(90deg, #7a57db, #ca2f8c, #cc6033)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Full-stack web developer
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
          color: "#a3a3a3",
        }}
      >
        <div>React · Next.js · NestJS · Node.js · MongoDB</div>
        <div>ali-moghrabi.vercel.app</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
