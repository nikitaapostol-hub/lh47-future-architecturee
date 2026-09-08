import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Разовое наполнение: если на боевой базе глобалы уже существуют,
   значения по умолчанию из конфига к ним не применяются — Payload
   отдаёт пустые массивы. Эта миграция кладёт стартовые данные,
   но только туда, где пусто: ничего из введённого руками не затрёт. */

const SPEAKERS = [
  {
    name: 'Дмитрий Разлога',
    company: 'LOCAL',
    role: 'Генеральный директор сети магазинов LOCAL — более 120 точек по Молдове. Запустил программу поддержки локальных производителей.',
  },
  {
    name: 'Дмитрий Волошин',
    company: 'Simpals',
    role: 'Основатель Simpals (999.md, Point.md) и Sporter, президент Федерации триатлона Молдовы.',
  },
]

const NOMINATIONS = [
  { no: '01', title: 'Архитектура частного дома', hint: 'ИЖС · экстерьер и объём' },
  { no: '02', title: 'Интерьер частного дома', hint: 'ИЖС · интерьер' },
  { no: '03', title: 'Интерьер коммерческого пространства', hint: 'Офисы, ретейл, HoReCa' },
  { no: '04', title: 'Экстерьер жилого комплекса', hint: 'ЖК · архитектура и благоустройство' },
]

const STUDENT_NOMINATIONS = [
  { no: '01', title: 'Общественное пространство', hint: 'Идеи для городов Молдовы' },
]

/** Заглушки прежнего вида — их заменяем, всё остальное считаем ручным вводом. */
const isPlaceholder = (list: any[]) =>
  Array.isArray(list) &&
  list.length > 0 &&
  list.every((n) => typeof n?.title === 'string' && /^Номинация\s+\d+$/i.test(n.title.trim()))

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  try {
    const forum: any = await payload.findGlobal({ slug: 'forum-settings' as any, locale: 'ru' as any, req })
    if (!Array.isArray(forum?.speakers) || forum.speakers.length === 0) {
      await payload.updateGlobal({
        slug: 'forum-settings' as any,
        locale: 'ru' as any,
        data: { speakers: SPEAKERS } as any,
        req,
      })
      payload.logger.info('[seed] спикеры форума добавлены')
    }
  } catch (e) {
    payload.logger.warn('[seed] спикеры не добавлены: ' + (e as Error).message)
  }

  try {
    const award: any = await payload.findGlobal({ slug: 'award-settings' as any, locale: 'ru' as any, req })
    const data: Record<string, unknown> = {}
    if (!Array.isArray(award?.nominations) || award.nominations.length === 0 || isPlaceholder(award.nominations)) {
      data.nominations = NOMINATIONS
    }
    if (!Array.isArray(award?.studentNominations) || award.studentNominations.length === 0) {
      data.studentNominations = STUDENT_NOMINATIONS
    }
    if (Object.keys(data).length) {
      await payload.updateGlobal({ slug: 'award-settings' as any, locale: 'ru' as any, data: data as any, req })
      payload.logger.info('[seed] номинации премии добавлены')
    }
  } catch (e) {
    payload.logger.warn('[seed] номинации не добавлены: ' + (e as Error).message)
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Данные заведены один раз; откат ничего не удаляет, чтобы не потерять правки редактора.
  payload.logger.info('[seed] откат не требуется')
}
