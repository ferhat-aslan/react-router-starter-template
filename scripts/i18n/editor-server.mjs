import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const projectRoot = process.cwd();
const i18nDir = path.join(projectRoot, "app", "i18n");
const editorHtmlPath = path.join(projectRoot, "scripts", "i18n", "editor.html");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonPretty(filePath, data) {
  const json = JSON.stringify(data, null, 2) + "\n";
  fs.writeFileSync(filePath, json, "utf8");
}

function listLocales() {
  return fs
    .readdirSync(i18nDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.basename(f, ".json"))
    .sort((a, b) => a.localeCompare(b));
}

function localePath(locale) {
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(locale) && !/^[a-z]{2}$/.test(locale)) {
    // Keep this intentionally strict; project currently uses 2-letter locales.
    throw new Error("Invalid locale");
  }
  return path.join(i18nDir, `${locale}.json`);
}

function send(res, status, body, headers = {}) {
  const buf = typeof body === "string" ? Buffer.from(body) : Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    "content-type": typeof body === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers,
  });
  res.end(buf);
}

function sendJson(res, status, obj) {
  send(res, status, obj, { "content-type": "application/json; charset=utf-8" });
}

function sendHtml(res, status, html) {
  res.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(html);
}

async function readBody(req) {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function safeParseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error };
  }
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeDict(dict) {
  if (!isPlainObject(dict)) throw new Error("Dictionary must be a JSON object");
  for (const [key, value] of Object.entries(dict)) {
    if (typeof key !== "string") throw new Error("Invalid key");
    if (typeof value !== "string") throw new Error(`Value for "${key}" must be a string`);
  }
  return dict;
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new url.URL(req.url ?? "/", "http://localhost");
  const { pathname } = reqUrl;

  try {
    if (req.method === "GET" && pathname === "/") {
      const html = fs.readFileSync(editorHtmlPath, "utf8");
      return sendHtml(res, 200, html);
    }

    if (req.method === "GET" && pathname === "/api/locales") {
      return sendJson(res, 200, { locales: listLocales() });
    }

    if (req.method === "GET" && pathname === "/api/messages") {
      const locale = reqUrl.searchParams.get("locale");
      if (!locale) return sendJson(res, 400, { error: "Missing locale" });
      const filePath = localePath(locale);
      if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: "Unknown locale" });
      return sendJson(res, 200, { locale, messages: readJson(filePath) });
    }

    if (req.method === "POST" && pathname === "/api/messages") {
      const locale = reqUrl.searchParams.get("locale");
      if (!locale) return sendJson(res, 400, { error: "Missing locale" });
      const filePath = localePath(locale);
      if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: "Unknown locale" });

      const rawBody = await readBody(req);
      const parsed = safeParseJson(rawBody);
      if (!parsed.ok) return sendJson(res, 400, { error: "Invalid JSON body" });

      const dict = normalizeDict(parsed.value);
      writeJsonPretty(filePath, dict);
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "POST" && pathname === "/api/create-locale") {
      const rawBody = await readBody(req);
      const parsed = safeParseJson(rawBody);
      if (!parsed.ok) return sendJson(res, 400, { error: "Invalid JSON body" });

      const { locale, baseLocale = "en" } = parsed.value ?? {};
      if (typeof locale !== "string") return sendJson(res, 400, { error: "Missing locale" });
      if (typeof baseLocale !== "string") return sendJson(res, 400, { error: "Missing baseLocale" });

      const newPath = localePath(locale);
      if (fs.existsSync(newPath)) return sendJson(res, 409, { error: "Locale already exists" });

      const basePath = localePath(baseLocale);
      if (!fs.existsSync(basePath)) return sendJson(res, 404, { error: "baseLocale not found" });

      const baseDict = normalizeDict(readJson(basePath));
      // Initialize new locale with empty strings for all keys.
      const next = {};
      for (const key of Object.keys(baseDict)) next[key] = "";
      writeJsonPretty(newPath, next);
      return sendJson(res, 201, { ok: true });
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    console.error("[i18n:editor] error", error);
    return sendJson(res, 500, { error: "Internal server error" });
  }
});

const port = Number(process.env.PORT || 8788);
server.on("error", (err) => {
  console.error("[i18n:editor] Failed to start HTTP server:", err?.message || err);
  console.error("[i18n:editor] Fallback: open `scripts/i18n/editor.html` in a Chromium browser and use 'Open app/i18n'.");
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[i18n:editor] http://127.0.0.1:${port}`);
  console.log("[i18n:editor] Reads/writes app/i18n/*.json on save.");
  console.log("[i18n:editor] If the port is blocked, use `scripts/i18n/editor.html` directly with the File System Access API.");
});
