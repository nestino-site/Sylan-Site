import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sites } from "./sites";

export type ImageVariants = {
  "400w_webp"?: string;
  "800w_webp"?: string;
  "1200w_webp"?: string;
  "2400w_webp"?: string;
};

export const siteImages = pgTable(
  "site_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id),
    // e.g. '{tenant_id}/originals/{uuid}.webp'
    storageKeyOriginal: text("storage_key_original").notNull(),
    // Default CDN URL for the primary variant (e.g. 1200w WebP)
    publicUrlPrimary: text("public_url_primary").notNull(),
    width: integer("width"),
    height: integer("height"),
    // Required for publish-ready; may be empty on draft upload
    altText: text("alt_text").notNull().default(""),
    // 'hero' | 'gallery' | 'room' | 'og' | 'other'
    role: text("role").notNull().default("gallery"),
    // Map of descriptor → URL
    variantsJson: jsonb("variants_json").$type<ImageVariants>(),
    // Suggested accent colour from image — operator confirms → sites.accent_hex
    dominantColorHex: text("dominant_color_hex"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    siteIdx: index("site_images_site_id").on(t.siteId),
    siteRoleIdx: index("site_images_site_id_role").on(t.siteId, t.role),
  })
);