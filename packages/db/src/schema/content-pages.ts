import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sites } from "./sites";

export const contentPages = pgTable(
  "content_pages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id),
    // Without locale prefix — e.g. 'villas/badem', 'location', ''
    slug: text("slug").notNull(),
    // 'home' | 'room' | 'location' | 'guide' | 'faq' | 'contact' | 'custom'
    pageType: text("page_type").notNull(),
    // 'active' | 'archived'
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    siteSlugUnq: uniqueIndex("content_pages_site_id_slug").on(
      t.siteId,
      t.slug
    ),
  })
);