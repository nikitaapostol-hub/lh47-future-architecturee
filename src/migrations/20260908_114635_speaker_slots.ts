import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "content_forum_locales" ADD COLUMN IF NOT EXISTS "program_slot_title" varchar;
  ALTER TABLE "content_forum_locales" ADD COLUMN IF NOT EXISTS "program_slot_text" varchar;
  ALTER TABLE "forum_settings" ADD COLUMN IF NOT EXISTS "speaker_slots" numeric DEFAULT 4;
  ALTER TABLE "content_forum_locales" DROP COLUMN IF EXISTS "program_speakers_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "content_forum_locales" ADD COLUMN IF NOT EXISTS "program_speakers_text" varchar;
  ALTER TABLE "content_forum_locales" DROP COLUMN IF EXISTS "program_slot_title";
  ALTER TABLE "content_forum_locales" DROP COLUMN IF EXISTS "program_slot_text";
  ALTER TABLE "forum_settings" DROP COLUMN IF EXISTS "speaker_slots";`)
}
