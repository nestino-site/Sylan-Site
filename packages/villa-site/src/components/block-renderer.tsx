import Image from "next/image";
import type { BodyJson, BodyJsonBlock } from "@nestino/db";

// SUPPORTED_MAX for this renderer version
const SUPPORTED_MAX = 1;

type Props = {
  body: BodyJson;
  siteId?: string;
  pageId?: string;
};

function Block({
  block,
  siteId,
  pageId,
}: {
  block: BodyJsonBlock;
  siteId?: string;
  pageId?: string;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {block.text}
        </p>
      );

    case "h2":
      return (
        <h2 className="font-serif font-semibold text-h2 text-[var(--color-text-primary)] mt-8 mb-4">
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mt-6 mb-3">
          {block.text}
        </h3>
      );

    case "bullet_list":
      return (
        <ul className="space-y-2 my-4">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-[var(--color-text-secondary)]">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--accent-500)" }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "image":
      return (
        <figure className="my-6 rounded-md overflow-hidden">
          <Image
            src={block.src}
            alt={block.alt}
            width={1200}
            height={800}
            className="w-full object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          {block.caption && (
            <figcaption className="mt-2 text-xs text-[var(--color-text-muted)] text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "faq":
      return (
        <div className="my-6 space-y-4">
          {block.items.map((item, i) => (
            <details key={i} className="border border-[var(--color-border)] rounded-md group">
              <summary className="px-4 py-3 font-medium text-sm text-[var(--color-text-primary)] cursor-pointer list-none flex items-center justify-between gap-4">
                <span>{item.q}</span>
                <svg
                  className="w-4 h-4 flex-shrink-0 text-[var(--color-text-muted)] transition-transform group-open:rotate-180"
                  viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </summary>
              <p className="px-4 pb-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      );

    case "cta":
      return (
        <div className="my-6">
          <a
            href={block.href}
            className={`inline-flex items-center px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
              block.variant === "primary"
                ? "text-white"
                : "border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:border-[var(--accent-500)]"
            }`}
            style={
              block.variant === "primary"
                ? { backgroundColor: "var(--accent-500)" }
                : {}
            }
          >
            {block.label}
          </a>
        </div>
      );

    default: {
      const t = (block as { type?: string }).type ?? "unknown";
      console.warn("[BlockRenderer] Unknown block type", { siteId, pageId, type: t });
      return null;
    }
  }
}

export default function BlockRenderer({ body, siteId, pageId }: Props) {
  if (body.version > SUPPORTED_MAX) {
    // Best-effort: render known blocks, skip unknown types
    // Log once — done via console in client, structured log needed in server context
    console.warn(
      `[BlockRenderer] body_json.version=${body.version} > SUPPORTED_MAX=${SUPPORTED_MAX}`,
      { siteId, pageId }
    );
  }

  return (
    <div className="space-y-4">
      {body.blocks.map((block, i) => (
        <Block key={i} block={block} siteId={siteId} pageId={pageId} />
      ))}
    </div>
  );
}