import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Главная: убраны надзаголовки «01 / Миссия» … «04 / Участие» и подписи
   «По заявке» / «По договорённости» — их поля больше не нужны в базе. */
const COLS = ['mission_label', 'who_label', 'who_residents_term', 'who_partners_term', 'formats_label', 'join_label'].flatMap((c) =>
  ['ru', 'ro', 'en'].map((l) => `${c}_${l}`),
)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const c of COLS) await db.execute(sql.raw(`ALTER TABLE "home" DROP COLUMN IF EXISTS "${c}";`))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const c of COLS) await db.execute(sql.raw(`ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "${c}" varchar;`))
}
