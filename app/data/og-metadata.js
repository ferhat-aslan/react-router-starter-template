//@ts-nocheck
const ROUTE_META_KEYS = {
  "": "home.meta",
  home: "home.meta",
  search: "search.meta",
  "all-tools": "all_tools.meta",
  about: "about.page",
  amazon: "amazon.meta",
  "invoice-editor": "home.meta",
  "docx-tools": "docx.meta",
  "latex-tools": "latex.meta",
  "text-tools": "text.meta",
  "text-tools/chatgpt-editor": "chatgpt.meta",
  "text-tools/gemini-editor": "gemini.meta",
  "text-tools/editor": "editor.meta",
  "spreadsheet-tools": "spreadsheet.meta",
  "seo-tools": "seo.meta",
  "code-formatter": "formatter.meta",
  "json-tools": "json.meta",
  "api-tools": "api.meta",
  "favicon-maker": "favicon.meta",
  "icon-resizer": "icon.meta",
  privacy: "privacy.meta",
  "privacy-policy": "privacy.meta",
  terms: "terms.meta",
  "terms-and-conditions": "terms.meta",
  blog: "blog.meta",
  "pdf-tools": "pdf.meta",
  "pdf-tools/merge-pdf": "pdf.merge.meta",
  "pdf-tools/split-pdf": "pdf.split.meta",
  "pdf-tools/word-to-pdf": "pdf.word.meta",
  "pdf-tools/pdf-to-images": "pdf.images.meta",
  "pdf-tools/pdf-to-text": "pdf.text.meta",
  "pdf-tools/compress-pdf": "pdf.compress.meta",
  tools: "tools.meta",
  "tools/image-converter": "image.converter.meta",
  "tools/file-converter": "file.convert.meta",
  "tools/qr-generator": "qr.gen.meta",
  "tools/bg-remover": "bg.remover.meta",
  "tools/video-compressor": "video.meta",
  "image-tools": "image.meta",
  "image-tools/images-to-pdf": "image.pdf.meta",
  "subtitle-tools": "subtitle.meta",
  "subtitle-tools/editor": "subtitle.edit.meta",
  "subtitle-tools/convert": "subtitle.convert.meta",
  "subtitle-tools/converter": "subtitle.convert.meta",
  "subtitle-tools/merger": "subtitle.merge.meta",
};

const translationLoaders = {
  en: () => import("../i18n/en.json").then(({ default: messages }) => messages),
  de: () => import("../i18n/de.json").then(({ default: messages }) => messages),
  es: () => import("../i18n/es.json").then(({ default: messages }) => messages),
  ar: () => import("../i18n/ar.json").then(({ default: messages }) => messages),
  tr: () => import("../i18n/tr.json").then(({ default: messages }) => messages),
  pt: () => import("../i18n/pt.json").then(({ default: messages }) => messages),
  fr: () => import("../i18n/fr.json").then(({ default: messages }) => messages),
  it: () => import("../i18n/it.json").then(({ default: messages }) => messages),
  ru: () => import("../i18n/ru.json").then(({ default: messages }) => messages),
};

let englishMessagesPromise;

function cleanSlug(slug = "") {
  return decodeURIComponent(slug)
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.(?:png|tsx)$/i, "");
}

function getMessage(messages, key) {
  return messages[key] || "";
}

export async function getOgMetadata(slug, locale = "en") {
  const routeSlug = cleanSlug(slug);
  const metaPrefix =
    ROUTE_META_KEYS[routeSlug] ||
    (routeSlug.startsWith("blog/")
      ? ROUTE_META_KEYS.blog
      : ROUTE_META_KEYS["all-tools"]);
  const requestedLoader = translationLoaders[locale] || translationLoaders.en;
  const messages = await requestedLoader();

  englishMessagesPromise ||= translationLoaders.en();
  const englishMessages =
    locale === "en" ? messages : await englishMessagesPromise;

  const title =
    getMessage(messages, `${metaPrefix}.title`) ||
    getMessage(englishMessages, `${metaPrefix}.title`);
  const description =
    getMessage(messages, `${metaPrefix}.description`) ||
    getMessage(englishMessages, `${metaPrefix}.description`);

  return {
    title: title || "Kleinbyte",
    description: description || "Free online tools for everyday work.",
  };
}

export { ROUTE_META_KEYS };
