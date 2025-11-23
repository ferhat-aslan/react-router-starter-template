import { Resvg } from "@resvg/resvg-wasm";
import type { LoaderFunctionArgs } from "react-router";
import satori from "satori";

// Load the WASM module
import { initWasm } from "@resvg/resvg-wasm";
// We need to initialize the WASM module once. 
// In a worker environment, we might need to do this carefully.
// However, @resvg/resvg-wasm usually handles this if we just import it, 
// but for Cloudflare Workers we might need to provide the .wasm file or use a specific build.
// Let's try the standard approach first. If it fails, we might need to bundle the wasm.
// Actually, for CF Workers, it's often better to use @resvg/resvg-wasm/index_bg.wasm if possible,
// but let's stick to the basic usage and see if the bundler handles it.
// Wait, @resvg/resvg-wasm might need manual initialization in some envs.
// Let's try to just use it.

// Cache fonts in memory to prevent refetching on every request (hot start)
let fontCache: { bold: ArrayBuffer; regular: ArrayBuffer } | null = null;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Tinker";
  const description = url.searchParams.get("description") || "The ultimate developer toolkit.";
  const theme = url.searchParams.get("theme") || "dark";

  // 1. Parallelize Font Fetching & Caching
  // We use a simple in-memory cache. In a serverless env like Workers, 
  // this persists as long as the isolate is alive.
  if (!fontCache) {
    const [boldData, regularData] = await Promise.all([
      fetch("https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf").then((res) =>
        res.arrayBuffer()
      ),
      fetch("https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf").then((res) =>
        res.arrayBuffer()
      ),
    ]);
    fontCache = { bold: boldData, regular: regularData };
  }

  const svg = await satori(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
        backgroundImage: theme === "dark" 
          ? "radial-gradient(circle at 25px 25px, #334155 2%, transparent 0%), radial-gradient(circle at 75px 75px, #334155 2%, transparent 0%)"
          : "radial-gradient(circle at 25px 25px, #e2e8f0 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e2e8f0 2%, transparent 0%)",
        backgroundSize: "100px 100px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
          padding: "40px 80px",
          borderRadius: "20px",
          border: theme === "dark" ? "1px solid #334155" : "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            fontSize: 70,
            fontWeight: 700,
            color: theme === "dark" ? "#f8fafc" : "#0f172a",
            marginBottom: 20,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 32,
            color: theme === "dark" ? "#94a3b8" : "#64748b",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          {description}
        </div>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 40,
          }}
        >
           <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "#8b5cf6", // Purple-500
              marginRight: 10,
            }}
          />
          <div
            style={{
              fontSize: 24,
              color: theme === "dark" ? "#c4b5fd" : "#7c3aed",
              fontWeight: 600,
            }}
          >
            Tinker
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontCache.bold,
          weight: 700,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontCache.regular,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  // Initialize WASM if needed (usually handled by the library, but let's be safe if we need to)
  // await initWasm(wasm); // If we had the wasm file loaded manually.
  // For now, let's rely on the default behavior.
  
  try {
      // Create Resvg instance
      const resvg = new Resvg(svg, {
        fitTo: {
            mode: "width",
            value: 1200,
        },
      });

      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      return new Response(pngBuffer as any, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
  } catch (e) {
      console.error("Resvg error:", e);
      // Fallback or error response
      return new Response("Failed to generate image", { status: 500 });
  }
}
