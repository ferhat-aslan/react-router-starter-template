import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const i18nDir = path.join(projectRoot, "app", "i18n");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectKeys(obj, prefix = "") {
  if (!isPlainObject(obj)) return [];
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) keys.push(...collectKeys(value, next));
    else keys.push(next);
  }
  return keys;
}

function sorted(arr) {
  return [...arr].sort((a, b) => a.localeCompare(b));
}

const files = fs
  .readdirSync(i18nDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => path.join(i18nDir, f));

const enPath = path.join(i18nDir, "en.json");
if (!fs.existsSync(enPath)) {
  console.error(`[i18n:check] Missing base dictionary: ${path.relative(projectRoot, enPath)}`);
  process.exit(1);
}

const enJson = readJson(enPath);
const baseKeys = new Set(collectKeys(enJson));

let hasErrors = false;

for (const filePath of files) {
  const locale = path.basename(filePath, ".json");
  const json = readJson(filePath);
  const keys = new Set(collectKeys(json));

  const missing = sorted([...baseKeys].filter((k) => !keys.has(k)));
  const extra = sorted([...keys].filter((k) => !baseKeys.has(k)));

  if (missing.length || extra.length) {
    hasErrors = true;
    console.log(`\n${locale}.json`);
    if (missing.length) console.log(`  Missing (${missing.length}): ${missing.join(", ")}`);
    if (extra.length) console.log(`  Extra (${extra.length}): ${extra.join(", ")}`);
  }
}

if (hasErrors) {
  console.error("\n[i18n:check] Key mismatch detected. Fix translations to match app/i18n/en.json.");
  process.exit(1);
}

console.log("[i18n:check] OK: All locale JSON files match app/i18n/en.json keys.");
