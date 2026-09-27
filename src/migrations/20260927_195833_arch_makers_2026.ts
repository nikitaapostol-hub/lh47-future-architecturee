/* ARCH MAKERS — схема под новый дизайн.
   Миграция только ДОБАВЛЯЕТ: новые таблицы текстов страниц (page_*), новые поля заявок.
   Старые таблицы content_* и их колонки не трогаем, чтобы откат на прежнюю версию сайта
   работал без потерь. «Почта» в премии и «компания» в сообществе стали необязательными. */
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_common" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_common_locales" (
  	"nav_community" varchar,
  	"nav_forum" varchar,
  	"nav_award" varchar,
  	"nav_contacts" varchar,
  	"nav_menu" varchar,
  	"nav_close" varchar,
  	"contacts_email1" varchar,
  	"contacts_email2" varchar,
  	"contacts_phone1" varchar,
  	"contacts_phone1_label" varchar,
  	"contacts_phone2" varchar,
  	"contacts_phone2_label" varchar,
  	"contacts_instagram" varchar,
  	"contacts_facebook" varchar,
  	"contacts_linkedin" varchar,
  	"footer_tagline" varchar,
  	"footer_email_label" varchar,
  	"footer_phone_label" varchar,
  	"footer_founders" varchar,
  	"footer_privacy" varchar,
  	"footer_copyright" varchar,
  	"forms_sent" varchar,
  	"forms_full_name" varchar,
  	"forms_company_name" varchar,
  	"forms_contact_person" varchar,
  	"forms_phone" varchar,
  	"forms_email" varchar,
  	"forms_partner" varchar,
  	"forms_send" varchar,
  	"forms_consent" varchar,
  	"forms_consent_link" varchar,
  	"forms_sending" varchar,
  	"forms_error" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_home_mission_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_home_who_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "page_home_formats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_home_locales" (
  	"hero_eyebrow" varchar,
  	"hero_place" varchar,
  	"hero_lead" varchar,
  	"hero_be_resident" varchar,
  	"hero_be_partner" varchar,
  	"hero_word1" varchar,
  	"hero_word2" varchar,
  	"hero_word3" varchar,
  	"hero_cta" varchar,
  	"hero_cta_menu" varchar,
  	"hero_alt" varchar,
  	"mission_label" varchar,
  	"mission_title" varchar,
  	"mission_text" varchar,
  	"who_label" varchar,
  	"who_title" varchar,
  	"who_note" varchar,
  	"who_residents" varchar,
  	"who_residents_term" varchar,
  	"who_residents_title" varchar,
  	"who_residents_link" varchar,
  	"who_residents_alt" varchar,
  	"who_partners" varchar,
  	"who_partners_term" varchar,
  	"who_partners_title" varchar,
  	"who_partners_text" varchar,
  	"who_partners_link" varchar,
  	"who_partners_alt" varchar,
  	"formats_label" varchar,
  	"formats_title" varchar,
  	"join_label" varchar,
  	"join_title" varchar,
  	"join_text" varchar,
  	"join_resident" varchar,
  	"join_partners_short" varchar,
  	"join_emp_question" varchar,
  	"join_emp_self" varchar,
  	"join_emp_company" varchar,
  	"join_which_company" varchar,
  	"join_studio_name" varchar,
  	"join_optional" varchar,
  	"join_profession" varchar,
  	"join_profession_ph" varchar,
  	"join_field" varchar,
  	"join_site" varchar,
  	"join_send_partner" varchar,
  	"join_sent_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_forum_chain_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "page_forum_topics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "page_forum_program_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "page_forum" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_forum_locales" (
  	"hero_date_place" varchar,
  	"hero_selection" varchar,
  	"hero_lead" varchar,
  	"hero_text" varchar,
  	"hero_cta" varchar,
  	"hero_cta_menu" varchar,
  	"hero_partner_offer" varchar,
  	"hero_days" varchar,
  	"hero_hours" varchar,
  	"hero_minutes" varchar,
  	"hero_seconds" varchar,
  	"hero_alt" varchar,
  	"chain_label" varchar,
  	"chain_title" varchar,
  	"chain_text" varchar,
  	"count_number" varchar,
  	"count_text" varchar,
  	"count_alt" varchar,
  	"topics_title" varchar,
  	"topics_speakers" varchar,
  	"program_title1" varchar,
  	"program_title2" varchar,
  	"program_alt" varchar,
  	"partners_label" varchar,
  	"partners_title" varchar,
  	"partners_text" varchar,
  	"partners_benefit1" varchar,
  	"partners_benefit2" varchar,
  	"partners_before" varchar,
  	"partners_during" varchar,
  	"partners_after" varchar,
  	"partners_cta" varchar,
  	"partners_alt" varchar,
  	"apply_title" varchar,
  	"apply_date" varchar,
  	"apply_place" varchar,
  	"apply_guest" varchar,
  	"apply_company_role" varchar,
  	"apply_sent_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "page_award_prize_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "page_award" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_award_locales" (
  	"hero_eyebrow" varchar,
  	"hero_open" varchar,
  	"hero_lead" varchar,
  	"hero_deadline_label" varchar,
  	"hero_days_left" varchar,
  	"hero_winners" varchar,
  	"hero_winners_text" varchar,
  	"hero_choose" varchar,
  	"hero_award" varchar,
  	"hero_award_note" varchar,
  	"hero_student" varchar,
  	"hero_student_note" varchar,
  	"hero_cta" varchar,
  	"hero_alt" varchar,
  	"nominations_label" varchar,
  	"nominations_title" varchar,
  	"nominations_text" varchar,
  	"prize_label" varchar,
  	"prize_title" varchar,
  	"form_label" varchar,
  	"form_title" varchar,
  	"form_nomination" varchar,
  	"form_choose_nom" varchar,
  	"form_project" varchar,
  	"form_authors" varchar,
  	"form_authors_ph" varchar,
  	"form_company" varchar,
  	"form_company_ph" varchar,
  	"form_location" varchar,
  	"form_location_ph" varchar,
  	"form_area" varchar,
  	"form_area_ph" varchar,
  	"form_year" varchar,
  	"form_year_ph" varchar,
  	"form_desc" varchar,
  	"form_desc_ph" varchar,
  	"form_attach" varchar,
  	"form_files_hint" varchar,
  	"form_send" varchar,
  	"form_sent_text" varchar,
  	"form_again" varchar,
  	"student_label" varchar,
  	"student_title1" varchar,
  	"student_title2" varchar,
  	"student_question" varchar,
  	"student_text" varchar,
  	"student_author" varchar,
  	"student_school" varchar,
  	"student_faculty" varchar,
  	"student_study_year" varchar,
  	"student_location_ph" varchar,
  	"student_area_ph" varchar,
  	"student_send" varchar,
  	"student_sent_text" varchar,
  	"student_alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "community_applications" ALTER COLUMN "company" DROP NOT NULL;
  ALTER TABLE "award_applications" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "mail_locales" ALTER COLUMN "autoreply_subject" SET DEFAULT 'Заявка получена — ARCH MAKERS';
  ALTER TABLE "mail_locales" ALTER COLUMN "autoreply_body" SET DEFAULT 'Здравствуйте!
  
  Мы получили вашу заявку и вернёмся с ответом на этот адрес.
  
  ARCH MAKERS — сообщество архитекторов и дизайнеров Молдовы.
  future-arch.md';
  ALTER TABLE "community_applications" ADD COLUMN "track" varchar;
  ALTER TABLE "community_applications" ADD COLUMN "employment" varchar;
  ALTER TABLE "community_applications" ADD COLUMN "field" varchar;
  ALTER TABLE "community_applications" ADD COLUMN "website" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "project" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "faculty" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "study_start" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "location" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "area" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "year" varchar;
  ALTER TABLE "award_applications" ADD COLUMN "files" varchar;
  ALTER TABLE "page_common_locales" ADD CONSTRAINT "page_common_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_common"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_home_mission_values" ADD CONSTRAINT "page_home_mission_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_home_who_perks" ADD CONSTRAINT "page_home_who_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_home_formats_items" ADD CONSTRAINT "page_home_formats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_home_locales" ADD CONSTRAINT "page_home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_forum_chain_stages" ADD CONSTRAINT "page_forum_chain_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_forum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_forum_topics_items" ADD CONSTRAINT "page_forum_topics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_forum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_forum_program_items" ADD CONSTRAINT "page_forum_program_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_forum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_forum_locales" ADD CONSTRAINT "page_forum_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_forum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_award_prize_items" ADD CONSTRAINT "page_award_prize_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_award"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_award_locales" ADD CONSTRAINT "page_award_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_award"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "page_common_locales_locale_parent_id_unique" ON "page_common_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_home_mission_values_order_idx" ON "page_home_mission_values" USING btree ("_order");
  CREATE INDEX "page_home_mission_values_parent_id_idx" ON "page_home_mission_values" USING btree ("_parent_id");
  CREATE INDEX "page_home_mission_values_locale_idx" ON "page_home_mission_values" USING btree ("_locale");
  CREATE INDEX "page_home_who_perks_order_idx" ON "page_home_who_perks" USING btree ("_order");
  CREATE INDEX "page_home_who_perks_parent_id_idx" ON "page_home_who_perks" USING btree ("_parent_id");
  CREATE INDEX "page_home_who_perks_locale_idx" ON "page_home_who_perks" USING btree ("_locale");
  CREATE INDEX "page_home_formats_items_order_idx" ON "page_home_formats_items" USING btree ("_order");
  CREATE INDEX "page_home_formats_items_parent_id_idx" ON "page_home_formats_items" USING btree ("_parent_id");
  CREATE INDEX "page_home_formats_items_locale_idx" ON "page_home_formats_items" USING btree ("_locale");
  CREATE UNIQUE INDEX "page_home_locales_locale_parent_id_unique" ON "page_home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_forum_chain_stages_order_idx" ON "page_forum_chain_stages" USING btree ("_order");
  CREATE INDEX "page_forum_chain_stages_parent_id_idx" ON "page_forum_chain_stages" USING btree ("_parent_id");
  CREATE INDEX "page_forum_chain_stages_locale_idx" ON "page_forum_chain_stages" USING btree ("_locale");
  CREATE INDEX "page_forum_topics_items_order_idx" ON "page_forum_topics_items" USING btree ("_order");
  CREATE INDEX "page_forum_topics_items_parent_id_idx" ON "page_forum_topics_items" USING btree ("_parent_id");
  CREATE INDEX "page_forum_topics_items_locale_idx" ON "page_forum_topics_items" USING btree ("_locale");
  CREATE INDEX "page_forum_program_items_order_idx" ON "page_forum_program_items" USING btree ("_order");
  CREATE INDEX "page_forum_program_items_parent_id_idx" ON "page_forum_program_items" USING btree ("_parent_id");
  CREATE INDEX "page_forum_program_items_locale_idx" ON "page_forum_program_items" USING btree ("_locale");
  CREATE UNIQUE INDEX "page_forum_locales_locale_parent_id_unique" ON "page_forum_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_award_prize_items_order_idx" ON "page_award_prize_items" USING btree ("_order");
  CREATE INDEX "page_award_prize_items_parent_id_idx" ON "page_award_prize_items" USING btree ("_parent_id");
  CREATE INDEX "page_award_prize_items_locale_idx" ON "page_award_prize_items" USING btree ("_locale");
  CREATE UNIQUE INDEX "page_award_locales_locale_parent_id_unique" ON "page_award_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_common" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_common_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_home_mission_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_home_who_perks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_home_formats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_home_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_forum_chain_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_forum_topics_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_forum_program_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_forum" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_forum_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_award_prize_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_award" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_award_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_common" CASCADE;
  DROP TABLE "page_common_locales" CASCADE;
  DROP TABLE "page_home_mission_values" CASCADE;
  DROP TABLE "page_home_who_perks" CASCADE;
  DROP TABLE "page_home_formats_items" CASCADE;
  DROP TABLE "page_home" CASCADE;
  DROP TABLE "page_home_locales" CASCADE;
  DROP TABLE "page_forum_chain_stages" CASCADE;
  DROP TABLE "page_forum_topics_items" CASCADE;
  DROP TABLE "page_forum_program_items" CASCADE;
  DROP TABLE "page_forum" CASCADE;
  DROP TABLE "page_forum_locales" CASCADE;
  DROP TABLE "page_award_prize_items" CASCADE;
  DROP TABLE "page_award" CASCADE;
  DROP TABLE "page_award_locales" CASCADE;
  ALTER TABLE "community_applications" ALTER COLUMN "company" SET NOT NULL;
  ALTER TABLE "award_applications" ALTER COLUMN "email" SET NOT NULL;
  ALTER TABLE "mail_locales" ALTER COLUMN "autoreply_subject" SET DEFAULT 'Заявка получена — Future Architecture';
  ALTER TABLE "mail_locales" ALTER COLUMN "autoreply_body" SET DEFAULT 'Здравствуйте!
  
  Мы получили вашу заявку и вернёмся с ответом на этот адрес.
  
  Future Architecture — сообщество архитекторов и дизайнеров Молдовы.
  future-arch.md';
  ALTER TABLE "community_applications" DROP COLUMN "track";
  ALTER TABLE "community_applications" DROP COLUMN "employment";
  ALTER TABLE "community_applications" DROP COLUMN "field";
  ALTER TABLE "community_applications" DROP COLUMN "website";
  ALTER TABLE "award_applications" DROP COLUMN "project";
  ALTER TABLE "award_applications" DROP COLUMN "faculty";
  ALTER TABLE "award_applications" DROP COLUMN "study_start";
  ALTER TABLE "award_applications" DROP COLUMN "location";
  ALTER TABLE "award_applications" DROP COLUMN "area";
  ALTER TABLE "award_applications" DROP COLUMN "year";
  ALTER TABLE "award_applications" DROP COLUMN "files";`)
}
