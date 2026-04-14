import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const sites = pgTable("sites", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id)
    .unique(),
  subdomain: text("subdomain").notNull().unique(),
  customDomain: text("custom_domain").unique(),
  customDomainVerified: boolean("custom_domain_verified").notNull().default(false),
  status: text("status").notNull(),
  defaultLanguage: text("default_language").notNull().default("en"),
  theme: text("theme").notNull().default("light"),
  accentHex: text("accent_hex"),
  robotsTemplate: text("robots_template"),
  gscSiteUrl: text("gsc_site_url"),
  gscVerificationToken: text("gsc_verification_token"),
  cmsApiKeyHash: text("cms_api_key_hash").notNull(),
  cmsApiKeyPrefix: text("cms_api_key_prefix").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
