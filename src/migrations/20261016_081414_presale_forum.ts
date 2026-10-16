import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Главная: блок «Старт в 2027 и предпродажа». Форум: убраны метки «До / Во время / После». */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_label_ru" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_label_ro" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_label_en" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_title_ru" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_title_ro" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_title_en" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_text_ru" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_text_ro" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_text_en" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_cta_ru" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_cta_ro" varchar;
  ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "presale_cta_en" varchar;
  ALTER TABLE "forum" DROP COLUMN IF EXISTS "partners_before_ru";
  ALTER TABLE "forum" DROP COLUMN IF EXISTS "partners_before_ro";
  ALTER TABLE "forum" DROP COLUMN IF EXISTS "partners_before_en";
  ALTER TABLE "forum" DROP COLUMN IF EXISTS "partners_during_ru";
  ALTER TABLE "forum" DROP COLUMN IF EXISTS "partners_during_ro";
  ALTER TABLE "forum" DROP COLUMN IF EXISTS "partners_during_en";
  ALTER TABLE "forum" DROP COLUMN IF EXISTS "partners_after_ru";
  ALTER TABLE "forum" DROP COLUMN IF EXISTS "partners_after_ro";
  ALTER TABLE "forum" DROP COLUMN IF EXISTS "partners_after_en";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forum" ADD COLUMN IF NOT EXISTS "partners_before_ru" varchar;
  ALTER TABLE "forum" ADD COLUMN IF NOT EXISTS "partners_before_ro" varchar;
  ALTER TABLE "forum" ADD COLUMN IF NOT EXISTS "partners_before_en" varchar;
  ALTER TABLE "forum" ADD COLUMN IF NOT EXISTS "partners_during_ru" varchar;
  ALTER TABLE "forum" ADD COLUMN IF NOT EXISTS "partners_during_ro" varchar;
  ALTER TABLE "forum" ADD COLUMN IF NOT EXISTS "partners_during_en" varchar;
  ALTER TABLE "forum" ADD COLUMN IF NOT EXISTS "partners_after_ru" varchar;
  ALTER TABLE "forum" ADD COLUMN IF NOT EXISTS "partners_after_ro" varchar;
  ALTER TABLE "forum" ADD COLUMN IF NOT EXISTS "partners_after_en" varchar;
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_label_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_label_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_label_en";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_title_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_title_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_title_en";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_text_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_text_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_text_en";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_cta_ru";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_cta_ro";
  ALTER TABLE "home" DROP COLUMN IF EXISTS "presale_cta_en";`)
}
