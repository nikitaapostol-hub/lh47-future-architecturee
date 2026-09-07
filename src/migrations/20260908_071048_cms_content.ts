import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ru', 'ro', 'en');
  CREATE TYPE "public"."enum_community_applications_status" AS ENUM('new', 'progress', 'accepted', 'declined');
  CREATE TYPE "public"."enum_forum_applications_status" AS ENUM('new', 'progress', 'accepted', 'declined');
  CREATE TYPE "public"."enum_award_applications_status" AS ENUM('new', 'progress', 'accepted', 'declined');
  CREATE TABLE "content_common" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "content_common_locales" (
  	"nav_nav_position" varchar,
  	"nav_nav_formats" varchar,
  	"nav_nav_forum" varchar,
  	"nav_nav_award" varchar,
  	"nav_nav_participation" varchar,
  	"nav_nav_contacts" varchar,
  	"nav_nav_community" varchar,
  	"nav_nav_program" varchar,
  	"nav_nav_application" varchar,
  	"nav_cta_join" varchar,
  	"nav_cta_apply" varchar,
  	"nav_cta_about" varchar,
  	"nav_scroll_hint" varchar,
  	"notice_notice_title" varchar,
  	"notice_notice_cta" varchar,
  	"contacts_email1" varchar,
  	"contacts_email2" varchar,
  	"contacts_phone1" varchar,
  	"contacts_phone1_label" varchar,
  	"contacts_phone2" varchar,
  	"contacts_phone2_label" varchar,
  	"contacts_social1" varchar,
  	"contacts_social2" varchar,
  	"contacts_social3" varchar,
  	"footer_tagline_home" varchar,
  	"footer_tagline_inner" varchar,
  	"footer_partners" varchar,
  	"footer_privacy" varchar,
  	"footer_copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "content_home_formats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "content_home_founders_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "content_home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "content_home_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title1" varchar,
  	"hero_title2" varchar,
  	"hero_kicker" varchar,
  	"hero_entry" varchar,
  	"hero_note" varchar,
  	"tags_tag_architecture" varchar,
  	"tags_tag_design" varchar,
  	"tags_tag_interior" varchar,
  	"tags_tag_urban" varchar,
  	"tags_tag_practice" varchar,
  	"tags_tag_studios" varchar,
  	"tags_tag_circle" varchar,
  	"tags_tag_recs" varchar,
  	"tags_tag_archiminds" varchar,
  	"tags_tag_expertise" varchar,
  	"tags_tag_networking" varchar,
  	"tags_tag_city" varchar,
  	"tags_tag_country" varchar,
  	"position_title1" varchar,
  	"position_title2" varchar,
  	"position_title3" varchar,
  	"position_text" varchar,
  	"composition_label" varchar,
  	"composition_title1" varchar,
  	"composition_title2" varchar,
  	"composition_residents_label" varchar,
  	"composition_residents_title1" varchar,
  	"composition_residents_title2" varchar,
  	"composition_residents_text" varchar,
  	"composition_partners_title" varchar,
  	"composition_partners_text" varchar,
  	"formats_label" varchar,
  	"formats_title1" varchar,
  	"formats_title2" varchar,
  	"forum_label" varchar,
  	"forum_venue" varchar,
  	"forum_title1" varchar,
  	"forum_title2" varchar,
  	"forum_text" varchar,
  	"forum_stat_value" varchar,
  	"forum_stat_label" varchar,
  	"forum_cta" varchar,
  	"founders_label" varchar,
  	"founders_title" varchar,
  	"founders_bureau_label" varchar,
  	"founders_bureau_name" varchar,
  	"founders_media_label" varchar,
  	"founders_media_name" varchar,
  	"founders_media_value" varchar,
  	"founders_media_text" varchar,
  	"participation_label" varchar,
  	"participation_title" varchar,
  	"participation_resident_title" varchar,
  	"participation_resident_text" varchar,
  	"participation_partner_title" varchar,
  	"participation_terms" varchar,
  	"participation_partner_cta" varchar,
  	"participation_side_word" varchar,
  	"form_label" varchar,
  	"form_title1" varchar,
  	"form_title2" varchar,
  	"form_field_name" varchar,
  	"form_field_company" varchar,
  	"form_field_role_hint" varchar,
  	"form_field_email" varchar,
  	"form_field_phone" varchar,
  	"form_submit" varchar,
  	"form_sent_title" varchar,
  	"form_sent_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "content_forum_chain_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"role" varchar
  );
  
  CREATE TABLE "content_forum_hall_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"share" varchar
  );
  
  CREATE TABLE "content_forum_topics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "content_forum_program_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "content_forum" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "content_forum_locales" (
  	"hero_year" varchar,
  	"hero_place" varchar,
  	"hero_format" varchar,
  	"hero_title1" varchar,
  	"hero_title2" varchar,
  	"hero_claim" varchar,
  	"hero_cta_apply" varchar,
  	"hero_cta_partner" varchar,
  	"hero_status" varchar,
  	"hero_countdown_note" varchar,
  	"hero_date_line" varchar,
  	"marquee_m1" varchar,
  	"marquee_m2" varchar,
  	"marquee_m3" varchar,
  	"marquee_m4" varchar,
  	"marquee_m5" varchar,
  	"marquee_m6" varchar,
  	"marquee_m7" varchar,
  	"marquee_m8" varchar,
  	"chain_label" varchar,
  	"chain_title" varchar,
  	"chain_text" varchar,
  	"chain_note" varchar,
  	"chain_note2" varchar,
  	"chain_tag2" varchar,
  	"chain_tag3" varchar,
  	"chain_tag4" varchar,
  	"chain_tag5" varchar,
  	"chain_tag6" varchar,
  	"hall_label" varchar,
  	"hall_stat_value" varchar,
  	"hall_stat_label" varchar,
  	"hall_entry" varchar,
  	"topics_label" varchar,
  	"topics_title1" varchar,
  	"topics_title2" varchar,
  	"program_title" varchar,
  	"program_note" varchar,
  	"program_speakers_title" varchar,
  	"program_speakers_text" varchar,
  	"program_speakers_note" varchar,
  	"award_label" varchar,
  	"award_title2" varchar,
  	"award_text1" varchar,
  	"award_text2" varchar,
  	"award_note" varchar,
  	"award_cta" varchar,
  	"participation_label" varchar,
  	"participation_title1" varchar,
  	"participation_title2" varchar,
  	"participation_text" varchar,
  	"participation_a_label" varchar,
  	"participation_a_title" varchar,
  	"participation_a_item1" varchar,
  	"participation_a_item2" varchar,
  	"participation_a_item3" varchar,
  	"participation_a_item4" varchar,
  	"participation_a_cta" varchar,
  	"participation_b_label" varchar,
  	"participation_b_title" varchar,
  	"participation_b_text" varchar,
  	"participation_b_item1" varchar,
  	"participation_b_item2" varchar,
  	"participation_b_cta" varchar,
  	"participation_b_note" varchar,
  	"participation_outro" varchar,
  	"form_side_word" varchar,
  	"form_title1" varchar,
  	"form_title2" varchar,
  	"form_note" varchar,
  	"form_note2" varchar,
  	"form_field_name" varchar,
  	"form_field_company" varchar,
  	"form_field_email" varchar,
  	"form_field_phone" varchar,
  	"form_field_kind" varchar,
  	"form_select_placeholder" varchar,
  	"form_option_architect" varchar,
  	"form_option_developer" varchar,
  	"form_option_manufacturer" varchar,
  	"form_option_investor" varchar,
  	"form_submit" varchar,
  	"form_sent_title" varchar,
  	"form_sent_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "content_award" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "content_award_locales" (
  	"hero_eyebrow" varchar,
  	"hero_event" varchar,
  	"hero_title1" varchar,
  	"hero_title2" varchar,
  	"hero_lead_name" varchar,
  	"hero_lead_text" varchar,
  	"hero_deadline_line" varchar,
  	"hero_countdown_note" varchar,
  	"hero_cta_company" varchar,
  	"hero_cta_student" varchar,
  	"tracks_label" varchar,
  	"tracks_title" varchar,
  	"tracks_a_title" varchar,
  	"tracks_a_text1" varchar,
  	"tracks_a_text2" varchar,
  	"tracks_b_title" varchar,
  	"tracks_b_text1" varchar,
  	"tracks_b_text2" varchar,
  	"nominations_label" varchar,
  	"nominations_title" varchar,
  	"nominations_note" varchar,
  	"nominations_link" varchar,
  	"result_label" varchar,
  	"result_title" varchar,
  	"result_item1" varchar,
  	"result_item1_value" varchar,
  	"result_item1_unit" varchar,
  	"result_item2" varchar,
  	"result_item3" varchar,
  	"result_item4" varchar,
  	"how_label" varchar,
  	"how_title" varchar,
  	"how_step1" varchar,
  	"how_step2" varchar,
  	"how_step3" varchar,
  	"how_step4" varchar,
  	"how_note" varchar,
  	"how_marquee1" varchar,
  	"how_marquee2" varchar,
  	"how_marquee3" varchar,
  	"form_title1" varchar,
  	"form_title2" varchar,
  	"form_note" varchar,
  	"form_field_name" varchar,
  	"form_field_org" varchar,
  	"form_field_track" varchar,
  	"form_field_nomination" varchar,
  	"form_field_email" varchar,
  	"form_field_phone" varchar,
  	"form_field_url" varchar,
  	"form_field_desc" varchar,
  	"form_hint" varchar,
  	"form_submit" varchar,
  	"form_sent_title" varchar,
  	"form_sent_text" varchar,
  	"form_outro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forum_settings_speakers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer
  );
  
  CREATE TABLE "forum_settings_speakers_locales" (
  	"name" varchar NOT NULL,
  	"company" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "award_settings_nominations_locales" (
  	"title" varchar NOT NULL,
  	"hint" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "award_settings_student_nominations_locales" (
  	"title" varchar NOT NULL,
  	"hint" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "award_settings_jury_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "award_settings_locales" (
  	"deadline_label" varchar DEFAULT '20 ноября',
  	"form_closed_text" varchar DEFAULT 'Приём заявок завершён. Победителей объявим 9 декабря на форуме в Кишинёве.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "seo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_image_id" integer,
  	"forum_image_id" integer,
  	"award_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_locales" (
  	"home_title" varchar,
  	"home_description" varchar,
  	"forum_title" varchar,
  	"forum_description" varchar,
  	"award_title" varchar,
  	"award_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "analytics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"gtm_id" varchar,
  	"ga4_id" varchar,
  	"search_console_token" varchar,
  	"yandex_id" varchar,
  	"meta_pixel_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "mail" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"to" varchar DEFAULT 'marketing-team@lh47arch.com' NOT NULL,
  	"subject_prefix" varchar DEFAULT '[future-arch.md]',
  	"autoreply" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "mail_locales" (
  	"autoreply_subject" varchar DEFAULT 'Заявка получена — Future Architecture',
  	"autoreply_body" varchar DEFAULT 'Здравствуйте!
  
  Мы получили вашу заявку и вернёмся с ответом на этот адрес.
  
  Future Architecture — сообщество архитекторов и дизайнеров Молдовы.
  future-arch.md',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "forum_settings" ALTER COLUMN "forum_date" SET DEFAULT '2026-12-09T10:00:00';
  ALTER TABLE "award_settings_jury" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "forum_applications" ADD COLUMN "status" "enum_forum_applications_status" DEFAULT 'new';
  ALTER TABLE "forum_applications" ADD COLUMN "note" varchar;
  ALTER TABLE "forum_applications" ADD COLUMN "lang" varchar;
  ALTER TABLE "forum_applications" ADD COLUMN "source" varchar;
  ALTER TABLE "forum_applications" ADD COLUMN "utm" varchar;
  ALTER TABLE "community_applications" ADD COLUMN "status" "enum_community_applications_status" DEFAULT 'new';
  ALTER TABLE "community_applications" ADD COLUMN "note" varchar;
  ALTER TABLE "community_applications" ADD COLUMN "lang" varchar;
  ALTER TABLE "community_applications" ADD COLUMN "source" varchar;
  ALTER TABLE "community_applications" ADD COLUMN "utm" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "status" "enum_award_applications_status" DEFAULT 'new';
  ALTER TABLE "award_applications" ADD COLUMN "note" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "lang" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "source" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "utm" varchar;
  ALTER TABLE "award_settings" ADD COLUMN "form_open" boolean DEFAULT true;
  ALTER TABLE "content_common_locales" ADD CONSTRAINT "content_common_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_common"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_home_formats_items" ADD CONSTRAINT "content_home_formats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_home_founders_stats" ADD CONSTRAINT "content_home_founders_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_home_locales" ADD CONSTRAINT "content_home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_forum_chain_stages" ADD CONSTRAINT "content_forum_chain_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_forum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_forum_hall_groups" ADD CONSTRAINT "content_forum_hall_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_forum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_forum_topics_items" ADD CONSTRAINT "content_forum_topics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_forum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_forum_program_items" ADD CONSTRAINT "content_forum_program_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_forum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_forum_locales" ADD CONSTRAINT "content_forum_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_forum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_award_locales" ADD CONSTRAINT "content_award_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_award"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forum_settings_speakers" ADD CONSTRAINT "forum_settings_speakers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forum_settings_speakers" ADD CONSTRAINT "forum_settings_speakers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forum_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forum_settings_speakers_locales" ADD CONSTRAINT "forum_settings_speakers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forum_settings_speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "award_settings_nominations_locales" ADD CONSTRAINT "award_settings_nominations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."award_settings_nominations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "award_settings_student_nominations_locales" ADD CONSTRAINT "award_settings_student_nominations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."award_settings_student_nominations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "award_settings_jury_locales" ADD CONSTRAINT "award_settings_jury_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."award_settings_jury"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "award_settings_locales" ADD CONSTRAINT "award_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."award_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_home_image_id_media_id_fk" FOREIGN KEY ("home_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_forum_image_id_media_id_fk" FOREIGN KEY ("forum_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_award_image_id_media_id_fk" FOREIGN KEY ("award_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mail_locales" ADD CONSTRAINT "mail_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mail"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "content_common_locales_locale_parent_id_unique" ON "content_common_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "content_home_formats_items_order_idx" ON "content_home_formats_items" USING btree ("_order");
  CREATE INDEX "content_home_formats_items_parent_id_idx" ON "content_home_formats_items" USING btree ("_parent_id");
  CREATE INDEX "content_home_formats_items_locale_idx" ON "content_home_formats_items" USING btree ("_locale");
  CREATE INDEX "content_home_founders_stats_order_idx" ON "content_home_founders_stats" USING btree ("_order");
  CREATE INDEX "content_home_founders_stats_parent_id_idx" ON "content_home_founders_stats" USING btree ("_parent_id");
  CREATE INDEX "content_home_founders_stats_locale_idx" ON "content_home_founders_stats" USING btree ("_locale");
  CREATE UNIQUE INDEX "content_home_locales_locale_parent_id_unique" ON "content_home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "content_forum_chain_stages_order_idx" ON "content_forum_chain_stages" USING btree ("_order");
  CREATE INDEX "content_forum_chain_stages_parent_id_idx" ON "content_forum_chain_stages" USING btree ("_parent_id");
  CREATE INDEX "content_forum_chain_stages_locale_idx" ON "content_forum_chain_stages" USING btree ("_locale");
  CREATE INDEX "content_forum_hall_groups_order_idx" ON "content_forum_hall_groups" USING btree ("_order");
  CREATE INDEX "content_forum_hall_groups_parent_id_idx" ON "content_forum_hall_groups" USING btree ("_parent_id");
  CREATE INDEX "content_forum_hall_groups_locale_idx" ON "content_forum_hall_groups" USING btree ("_locale");
  CREATE INDEX "content_forum_topics_items_order_idx" ON "content_forum_topics_items" USING btree ("_order");
  CREATE INDEX "content_forum_topics_items_parent_id_idx" ON "content_forum_topics_items" USING btree ("_parent_id");
  CREATE INDEX "content_forum_topics_items_locale_idx" ON "content_forum_topics_items" USING btree ("_locale");
  CREATE INDEX "content_forum_program_items_order_idx" ON "content_forum_program_items" USING btree ("_order");
  CREATE INDEX "content_forum_program_items_parent_id_idx" ON "content_forum_program_items" USING btree ("_parent_id");
  CREATE INDEX "content_forum_program_items_locale_idx" ON "content_forum_program_items" USING btree ("_locale");
  CREATE UNIQUE INDEX "content_forum_locales_locale_parent_id_unique" ON "content_forum_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "content_award_locales_locale_parent_id_unique" ON "content_award_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forum_settings_speakers_order_idx" ON "forum_settings_speakers" USING btree ("_order");
  CREATE INDEX "forum_settings_speakers_parent_id_idx" ON "forum_settings_speakers" USING btree ("_parent_id");
  CREATE INDEX "forum_settings_speakers_photo_idx" ON "forum_settings_speakers" USING btree ("photo_id");
  CREATE UNIQUE INDEX "forum_settings_speakers_locales_locale_parent_id_unique" ON "forum_settings_speakers_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "award_settings_nominations_locales_locale_parent_id_unique" ON "award_settings_nominations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "award_settings_student_nominations_locales_locale_parent_id_" ON "award_settings_student_nominations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "award_settings_jury_locales_locale_parent_id_unique" ON "award_settings_jury_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "award_settings_locales_locale_parent_id_unique" ON "award_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "seo_home_image_idx" ON "seo" USING btree ("home_image_id");
  CREATE INDEX "seo_forum_image_idx" ON "seo" USING btree ("forum_image_id");
  CREATE INDEX "seo_award_image_idx" ON "seo" USING btree ("award_image_id");
  CREATE UNIQUE INDEX "seo_locales_locale_parent_id_unique" ON "seo_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "mail_locales_locale_parent_id_unique" ON "mail_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "award_settings_jury" DROP COLUMN "role";
  ALTER TABLE "award_settings_nominations" DROP COLUMN "title";
  ALTER TABLE "award_settings_student_nominations" DROP COLUMN "title";
  ALTER TABLE "award_settings" DROP COLUMN "deadline_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "content_common" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_common_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_home_formats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_home_founders_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_home_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_forum_chain_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_forum_hall_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_forum_topics_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_forum_program_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_forum" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_forum_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_award" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_award_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forum_settings_speakers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forum_settings_speakers_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "award_settings_nominations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "award_settings_student_nominations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "award_settings_jury_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "award_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seo" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seo_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "analytics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mail" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mail_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "content_common" CASCADE;
  DROP TABLE "content_common_locales" CASCADE;
  DROP TABLE "content_home_formats_items" CASCADE;
  DROP TABLE "content_home_founders_stats" CASCADE;
  DROP TABLE "content_home" CASCADE;
  DROP TABLE "content_home_locales" CASCADE;
  DROP TABLE "content_forum_chain_stages" CASCADE;
  DROP TABLE "content_forum_hall_groups" CASCADE;
  DROP TABLE "content_forum_topics_items" CASCADE;
  DROP TABLE "content_forum_program_items" CASCADE;
  DROP TABLE "content_forum" CASCADE;
  DROP TABLE "content_forum_locales" CASCADE;
  DROP TABLE "content_award" CASCADE;
  DROP TABLE "content_award_locales" CASCADE;
  DROP TABLE "forum_settings_speakers" CASCADE;
  DROP TABLE "forum_settings_speakers_locales" CASCADE;
  DROP TABLE "award_settings_nominations_locales" CASCADE;
  DROP TABLE "award_settings_student_nominations_locales" CASCADE;
  DROP TABLE "award_settings_jury_locales" CASCADE;
  DROP TABLE "award_settings_locales" CASCADE;
  DROP TABLE "seo" CASCADE;
  DROP TABLE "seo_locales" CASCADE;
  DROP TABLE "analytics" CASCADE;
  DROP TABLE "mail" CASCADE;
  DROP TABLE "mail_locales" CASCADE;
  ALTER TABLE "forum_settings" ALTER COLUMN "forum_date" SET DEFAULT '2026-12-03T10:00:00';
  ALTER TABLE "award_settings_jury" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "award_settings_nominations" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "award_settings_student_nominations" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "award_settings_jury" ADD COLUMN "role" varchar;
  ALTER TABLE "award_settings" ADD COLUMN "deadline_label" varchar DEFAULT '20 ноября';
  ALTER TABLE "community_applications" DROP COLUMN "status";
  ALTER TABLE "community_applications" DROP COLUMN "note";
  ALTER TABLE "community_applications" DROP COLUMN "lang";
  ALTER TABLE "community_applications" DROP COLUMN "source";
  ALTER TABLE "community_applications" DROP COLUMN "utm";
  ALTER TABLE "forum_applications" DROP COLUMN "status";
  ALTER TABLE "forum_applications" DROP COLUMN "note";
  ALTER TABLE "forum_applications" DROP COLUMN "lang";
  ALTER TABLE "forum_applications" DROP COLUMN "source";
  ALTER TABLE "forum_applications" DROP COLUMN "utm";
  ALTER TABLE "award_applications" DROP COLUMN "status";
  ALTER TABLE "award_applications" DROP COLUMN "note";
  ALTER TABLE "award_applications" DROP COLUMN "lang";
  ALTER TABLE "award_applications" DROP COLUMN "source";
  ALTER TABLE "award_applications" DROP COLUMN "utm";
  ALTER TABLE "award_settings" DROP COLUMN "form_open";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_community_applications_status";
  DROP TYPE "public"."enum_forum_applications_status";
  DROP TYPE "public"."enum_award_applications_status";`)
}
