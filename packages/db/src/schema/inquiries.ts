import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sites } from "./sites";

export type InquiryMetadata = {
  page_path?: string;
  villa_preference?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id),
    languageCode: text("language_code").notNull(),
    // 'form' | 'whatsapp_intent' | 'phone_click'
    channel: text("channel").notNull(),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    message: text("message"),
    metadataJson: jsonb("metadata_json").$type<InquiryMetadata>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    siteCreatedIdx: index("inquiries_site_id_created_at").on(
      t.siteId,
      t.createdAt
    ),
  })
);