import {
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  destination: text("destination").notNull(),
  locationLabel: text("location_label"),
  adrMin: numeric("adr_min", { precision: 12, scale: 2 }),
  status: text("status").notNull(),
  propertyUrl: text("property_url"),
  ownerEmail: text("owner_email"),
  ownerPhone: text("owner_phone"),
  hostVoiceNotes: text("host_voice_notes"),
  writingStyle: text("writing_style"),
  guestReviewSnippets: jsonb("guest_review_snippets").$type<string[] | null>(),
  brandAvoidWords: jsonb("brand_avoid_words").$type<string[] | null>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
