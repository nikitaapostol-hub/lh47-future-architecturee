import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Главная: вместо «ценностей» в миссии и пяти пунктов у резидентов —
   блок «Что даёт сообщество» в карточках резидентов и партнёров. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "home_who_residents_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_ru" varchar,
  	"title_ro" varchar,
  	"title_en" varchar,
  	"text_ru" varchar,
  	"text_ro" varchar,
  	"text_en" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "home_who_partners_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title_ru" varchar,
  	"title_ro" varchar,
  	"title_en" varchar,
  	"text_ru" varchar,
  	"text_ro" varchar,
  	"text_en" varchar
  );
  
  DROP TABLE IF EXISTS "home_mission_values" CASCADE;
  DROP TABLE IF EXISTS "home_who_perks" CASCADE;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "who_benefits_label_ru" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "who_benefits_label_ro" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "who_benefits_label_en" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "who_residents_text_ru" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "who_residents_text_ro" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "who_residents_text_en" varchar;
  ALTER TABLE "home_who_residents_benefits" ADD CONSTRAINT "home_who_residents_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_who_partners_benefits" ADD CONSTRAINT "home_who_partners_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_who_residents_benefits_order_idx" ON "home_who_residents_benefits" USING btree ("_order");
  CREATE INDEX "home_who_residents_benefits_parent_id_idx" ON "home_who_residents_benefits" USING btree ("_parent_id");
  CREATE INDEX "home_who_partners_benefits_order_idx" ON "home_who_partners_benefits" USING btree ("_order");
  CREATE INDEX "home_who_partners_benefits_parent_id_idx" ON "home_who_partners_benefits" USING btree ("_parent_id");
  ALTER TABLE "home" DROP COLUMN IF EXISTS "mission_label_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "mission_label_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "mission_label_en";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_label_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_label_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_label_en";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_residents_term_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_residents_term_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_residents_term_en";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_partners_term_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_partners_term_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_partners_term_en";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "formats_label_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "formats_label_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "formats_label_en";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "join_label_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "join_label_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "join_label_en";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "home_who_residents_benefits" CASCADE;
  DROP TABLE IF EXISTS "home_who_partners_benefits" CASCADE;
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_benefits_label_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_benefits_label_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_benefits_label_en";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_residents_text_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_residents_text_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "who_residents_text_en";`)
}
