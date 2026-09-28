import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Итоговая схема админки ARCH MAKERS (сентябрь 2026): без переключателя языков,
   разделы home / forum / award / common / settings.

   Сама миграция ничего не делает — она нужна ради снимка схемы
   (…_cleanup.json), от которого будут считаться будущие миграции.
   Старые таблицы (content_*, page_*, forum_settings, award_settings, seo,
   analytics, mail и их *_locales) и тип _locales сознательно НЕ удаляются:
   так откат на прежнюю версию сайта остаётся безопасным. Удалить их можно
   отдельной миграцией, когда новая админка поживёт. */

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info('[arch-makers] схема зафиксирована, старые таблицы оставлены')
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
