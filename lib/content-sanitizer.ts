import DOMPurify from "isomorphic-dompurify";

const ALLOWED_VIDEO_ORIGINS = [
  "https://www.youtube.com/",
  "https://www.youtube-nocookie.com/",
  "https://player.vimeo.com/",
];

DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
  if (data.attrName === "src" && node.nodeName.toLowerCase() === "iframe") {
    const value = data.attrValue || "";
    if (!ALLOWED_VIDEO_ORIGINS.some((origin) => value.startsWith(origin))) {
      data.keepAttr = false;
    }
  }
});

export function sanitizeRichHtml(value: string | null | undefined): string | null {
  if (value == null) return value ?? null;
  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4",
      "ul", "ol", "li", "blockquote", "table", "thead", "tbody",
      "tr", "th", "td", "img", "a", "figure", "figcaption", "iframe",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "target", "rel", "width", "height",
      "loading", "allow", "allowfullscreen", "frameborder",
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_ATTR: ["style"],
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });
}
