import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const engineJobs = pgTable("engine_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  jobType: text("job_type").notNull(),
  idempotencyKey: text("idempotency_key"),
  status: text("status").notNull(),
  triggeredBy: text("triggered_by").notNull(),
  priority: text("priority").notNull().default("default"),
  attemptCount: integer("attempt_count").notNull().default(0),
  lastError: text("last_error"),
  payloadJson: jsonb("payload_json")
    .notNull()
    .default({}),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
