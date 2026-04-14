import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sites } from "./sites";

export const siteLanguages = pgTable(
  "site_languages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id),
    languageCode: text("language_code").notNull(),
    tier: integer("tier").notNull(),
    status: text("status").notNull(),
    launchedAt: timestamp("launched_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    siteLangUnq: uniqueIndex("site_languages_site_id_language_code").on(
      t.siteId,
      t.languageCode
    ),
  })
);
