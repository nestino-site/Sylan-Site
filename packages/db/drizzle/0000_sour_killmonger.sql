CREATE TABLE "content_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"page_type" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"language_code" text NOT NULL,
	"version" integer NOT NULL,
	"title" text NOT NULL,
	"body_json" jsonb NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"schema_json" jsonb,
	"is_current" boolean DEFAULT false NOT NULL,
	"status" text NOT NULL,
	"source" text NOT NULL,
	"approved_by_user_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "engine_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid,
	"job_type" text NOT NULL,
	"idempotency_key" text,
	"status" text NOT NULL,
	"triggered_by" text NOT NULL,
	"priority" text DEFAULT 'default' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"payload_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"language_code" text NOT NULL,
	"channel" text NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"message" text,
	"metadata_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"storage_key_original" text NOT NULL,
	"public_url_primary" text NOT NULL,
	"width" integer,
	"height" integer,
	"alt_text" text DEFAULT '' NOT NULL,
	"role" text DEFAULT 'gallery' NOT NULL,
	"variants_json" jsonb,
	"dominant_color_hex" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"language_code" text NOT NULL,
	"tier" integer NOT NULL,
	"status" text NOT NULL,
	"launched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"subdomain" text NOT NULL,
	"custom_domain" text,
	"custom_domain_verified" boolean DEFAULT false NOT NULL,
	"status" text NOT NULL,
	"default_language" text DEFAULT 'en' NOT NULL,
	"theme" text DEFAULT 'light' NOT NULL,
	"accent_hex" text,
	"robots_template" text,
	"gsc_site_url" text,
	"gsc_verification_token" text,
	"cms_api_key_hash" text NOT NULL,
	"cms_api_key_prefix" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sites_tenant_id_unique" UNIQUE("tenant_id"),
	CONSTRAINT "sites_subdomain_unique" UNIQUE("subdomain"),
	CONSTRAINT "sites_custom_domain_unique" UNIQUE("custom_domain")
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"destination" text NOT NULL,
	"location_label" text,
	"adr_min" numeric(12, 2),
	"status" text NOT NULL,
	"property_url" text,
	"owner_email" text,
	"owner_phone" text,
	"host_voice_notes" text,
	"writing_style" text,
	"guest_review_snippets" jsonb,
	"brand_avoid_words" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "trials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"converted_at" timestamp with time zone,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trials_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "content_pages" ADD CONSTRAINT "content_pages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_page_id_content_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."content_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_approved_by_user_id_users_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engine_jobs" ADD CONSTRAINT "engine_jobs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_images" ADD CONSTRAINT "site_images_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_languages" ADD CONSTRAINT "site_languages_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trials" ADD CONSTRAINT "trials_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "content_pages_site_id_slug" ON "content_pages" USING btree ("site_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "content_versions_page_lang_version" ON "content_versions" USING btree ("page_id","language_code","version");--> statement-breakpoint
CREATE UNIQUE INDEX "content_versions_current_unq" ON "content_versions" USING btree ("page_id","language_code") WHERE "content_versions"."is_current" = true;--> statement-breakpoint
CREATE INDEX "content_versions_page_lang_status" ON "content_versions" USING btree ("page_id","language_code","status");--> statement-breakpoint
CREATE INDEX "content_versions_status_created" ON "content_versions" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "inquiries_site_id_created_at" ON "inquiries" USING btree ("site_id","created_at");--> statement-breakpoint
CREATE INDEX "site_images_site_id" ON "site_images" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "site_images_site_id_role" ON "site_images" USING btree ("site_id","role");--> statement-breakpoint
CREATE UNIQUE INDEX "site_languages_site_id_language_code" ON "site_languages" USING btree ("site_id","language_code");