const ORANGE = "#ED6F06";

function CodeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="301" height="314" viewBox="0 0 301 314" fill="none">
      <path d="M87.5737 143.786L112.595 117.643L87.5737 91.5" stroke={ORANGE} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M137.616 169.928H187.658" stroke={ORANGE} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M237.7 39.2144H62.5528C48.7341 39.2144 37.5317 50.9189 37.5317 65.3572V248.357C37.5317 262.795 48.7341 274.5 62.5528 274.5H237.7C251.519 274.5 262.722 262.795 262.722 248.357V65.3572C262.722 50.9189 251.519 39.2144 237.7 39.2144Z" stroke={ORANGE} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function OgImage({ title, description, lang }: { title: string; description: string; lang?: string }) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", padding: "64px 80px", background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 48%, #fed7aa 100%)", color: "#1c1917", fontFamily: "Arial", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", position: "absolute", width: 430, height: 430, borderRadius: 215, right: -120, top: -160, background: "linear-gradient(135deg, rgba(249,115,22,.24), rgba(234,88,12,.05))" }} />
      <div style={{ display: "flex", position: "absolute", width: 280, height: 280, borderRadius: 140, left: -130, bottom: -150, background: "rgba(251,146,60,.18)" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 270, height: 300, flexShrink: 0, borderRadius: 42, background: "linear-gradient(145deg, #ffffff 0%, #fff7ed 100%)", border: "2px solid rgba(234,88,12,.14)", boxShadow: "0 24px 50px rgba(194,65,12,.18)" }}>
        <div style={{ display: "flex", width: 190, height: 198 }}><CodeIcon /></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginLeft: 64, maxWidth: 700 }}>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: ORANGE, marginBottom: 18 }}>
          Kleinbyte{lang ? ` · ${lang}` : ""}
        </div>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 23, lineHeight: 1.25, color: "#78716c", marginTop: 24, maxWidth: 690 }}>{description}</div>
      </div>
    </div>
  );
}
