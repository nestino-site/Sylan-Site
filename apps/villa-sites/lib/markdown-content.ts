import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const EXCERPT_MAX_LENGTH = 165;

const SANITIZE_OPTS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "article",
    "section",
    "figure",
    "figcaption",
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "blockquote",
    "hr",
    "pre",
    "code",
    "br",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "name", "target", "rel", "class"],
    img: ["src", "alt", "width", "height", "loading", "class"],
    p: ["class"],
    div: ["class"],
    span: ["class"],
    table: ["class"],
    th: ["align"],
    td: ["align"],
    code: ["class"],
    pre: ["class"],
  },
  transformTags: {
    h1: "h2",
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
};

function stripMarkdownSyntax(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[\s-*+]+/gm, "")
    .replace(/\|/g, " ")
    .replace(/[-*_]{3,}/g, " ");
}

export function renderPublishedMarkdown(markdown: string): string {
  const html = marked.parse(markdown, {
    async: false,
    breaks: false,
    gfm: true,
  }) as string;

  return sanitizeHtml(html, SANITIZE_OPTS);
}

export function buildContentExcerpt(markdownOrHtml: string): string {
  const text = sanitizeHtml(stripMarkdownSyntax(markdownOrHtml), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= EXCERPT_MAX_LENGTH) return text;

  const truncated = text.slice(0, EXCERPT_MAX_LENGTH + 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 90 ? lastSpace : EXCERPT_MAX_LENGTH).trim()}...`;
}
