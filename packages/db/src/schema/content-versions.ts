import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { contentPages } from "./content-pages";
import { users } from "./users";

// Portable block format — version field required on all new writes.
// v1 block types: paragraph, h2, h3, bullet_list, image, faq, cta
export type BodyJsonBlock =
  | { type: "paragraph"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "bullet_list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "cta"; label: string; href: string; variant: "primary" | "secondary" };

export type BodyJson = {
  version: number;
  blocks: BodyJsonBlock[];
};

export const contentVersions = pgTable(
  "content_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => contentPages.id),
    languageCode: text("language_code").notNull(),
    version: integer("version").notNull(),
    title: text("title").notNull(),
    bodyJson: jsonb("body_json").notNull().$type<BodyJson>(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    schemaJson: jsonb("schema_json").$type<Record<string, unknown> | Record<string, unknown>[]>(),
    // Exactly one true per (page_id, language_code) — only published rows may be true.
    // Enforced by partial unique index below.
    isCurrent: boolean("is_current").notNull().default(false),
    // 'draft' | 'pending_review' | 'approved' | 'published'
    status: text("status").notNull(),
    // 'engine' | 'human' | 'import'
    source: text("source").notNull(),
    approvedByUserId: uuid("approved_by_user_id").references(() => users.id),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pageVersionUnq: uniqueIndex("content_versions_page_lang_version").on(
      t.pageId,
      t.languageCode,
      t.version
    ),
    // Only one current published version per (page, language) at a time.
    currentVersionUnq: uniqueIndex("content_versions_current_unq")
      .on(t.pageId, t.languageCode)
      .where(sql`${t.isCurrent} = true`),
    pageLangStatusIdx: index("content_versions_page_lang_status").on(
      t.pageId,
      t.languageCode,
      t.status
    ),
    statusCreatedIdx: index("content_versions_status_created").on(
      t.status,
      t.createdAt
    ),
  })
);