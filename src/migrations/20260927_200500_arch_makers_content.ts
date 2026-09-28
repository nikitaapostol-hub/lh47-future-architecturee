import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* ARCH MAKERS — данные под новый дизайн.
   Меняем только то, что осталось в исходном виде; всё, что редактор уже
   правил руками, не трогаем.
   — спикеры форума: если в списке по-прежнему только стартовые Разлога и Волошин,
     ставим состав из макета (4 человека) на трёх языках;
   — номинации премии: если это стартовые четыре, ставим названия из макета
     и раздел («Архитектура» / «Интерьер») на трёх языках;
   — автоответ заявителю: старое название бренда меняем на ARCH MAKERS. */

type L = 'ru' | 'ro' | 'en'
const LOCALES: L[] = ['ru', 'ro', 'en']

const SPEAKERS: Record<L, { name: string; role: string }[]> = {
  ru: [
    { name: 'Дмитрий Волошин', role: 'Основатель Simpals, 999.md, Point.md и Woloshin Banya' },
    { name: 'Дмитрий Разлога', role: 'Основатель сети магазинов JYSK Bonus Local' },
    { name: 'Сергей Мырза', role: 'Основатель архитектурного бюро LH47 ARCH' },
    { name: 'Вячеслав Ионицэ', role: 'Экономический эксперт' },
  ],
  ro: [
    { name: 'Dmitri Voloșin', role: 'Fondatorul Simpals, 999.md, Point.md și Woloshin Banya' },
    { name: 'Dmitri Razloga', role: 'Fondatorul rețelei de magazine JYSK Bonus Local' },
    { name: 'Serghei Mîrza', role: 'Fondatorul biroului de arhitectură LH47 ARCH' },
    { name: 'Veaceslav Ioniță', role: 'Expert economic' },
  ],
  en: [
    { name: 'Dmitry Voloshin', role: 'Founder of Simpals, 999.md, Point.md and Woloshin Banya' },
    { name: 'Dmitry Razloga', role: 'Founder of the JYSK Bonus Local store chain' },
    { name: 'Sergei Myrza', role: 'Founder of LH47 ARCH architecture bureau' },
    { name: 'Veaceslav Ioniță', role: 'Economic expert' },
  ],
}
const OLD_SPEAKERS = ['Дмитрий Разлога', 'Дмитрий Волошин']

const NOMINATIONS: Record<L, { title: string; hint: string }[]> = {
  ru: [
    { hint: 'Архитектура', title: 'Архитектура частного дома' },
    { hint: 'Архитектура', title: 'Архитектура жилого комплекса' },
    { hint: 'Интерьер', title: 'Интерьер жилого пространства' },
    { hint: 'Интерьер', title: 'Интерьер коммерческого пространства' },
  ],
  ro: [
    { hint: 'Arhitectură', title: 'Arhitectura casei private' },
    { hint: 'Arhitectură', title: 'Arhitectura complexului rezidențial' },
    { hint: 'Interior', title: 'Interiorul spațiului rezidențial' },
    { hint: 'Interior', title: 'Interiorul spațiului comercial' },
  ],
  en: [
    { hint: 'Architecture', title: 'Private house architecture' },
    { hint: 'Architecture', title: 'Residential complex architecture' },
    { hint: 'Interior', title: 'Residential interior' },
    { hint: 'Interior', title: 'Commercial interior' },
  ],
}
const OLD_NOMINATIONS = [
  'Архитектура частного дома',
  'Интерьер частного дома',
  'Интерьер коммерческого пространства',
  'Экстерьер жилого комплекса',
]

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x))

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // С 28.09.2026 этих разделов в админке нет (данные переносит …_admin_data).
  // На боевой базе миграция уже выполнена; на чистой — просто пропускаем.
  if (!payload.config.globals.some((g) => (g.slug as string) === 'forum-settings')) {
    payload.logger.info('[arch-makers] старые разделы настроек уже убраны — пропускаю')
    return
  }
  // ——— спикеры
  const forum: any = await payload.findGlobal({ slug: 'forum-settings' as any, locale: 'ru' as any, fallbackLocale: 'none' as any, req })
  const names: string[] = (forum?.speakers || []).map((s: any) => String(s?.name || '').trim()).filter(Boolean)
  if (names.length === 0 || names.every((n) => OLD_SPEAKERS.includes(n))) {
    await payload.updateGlobal({
      slug: 'forum-settings' as any,
      locale: 'ru' as any,
      data: { speakers: SPEAKERS.ru.map((s) => ({ name: s.name, role: s.role, company: '' })) } as any,
      req,
    })
    const saved: any = await payload.findGlobal({ slug: 'forum-settings' as any, locale: 'ru' as any, req })
    for (const l of ['ro', 'en'] as L[]) {
      await payload.updateGlobal({
        slug: 'forum-settings' as any,
        locale: l as any,
        data: {
          speakers: (saved.speakers || []).map((row: any, i: number) => ({
            id: row.id,
            photo: row.photo?.id ?? row.photo ?? null,
            name: SPEAKERS[l][i]?.name,
            role: SPEAKERS[l][i]?.role,
            company: '',
          })),
        } as any,
        req,
      })
    }
    payload.logger.info('[arch-makers] спикеры форума обновлены под макет')
  } else {
    payload.logger.info('[arch-makers] спикеры правились вручную — оставляем как есть')
  }

  // ——— номинации
  const award: any = await payload.findGlobal({ slug: 'award-settings' as any, locale: 'ru' as any, fallbackLocale: 'none' as any, req })
  const titles: string[] = (award?.nominations || []).map((n: any) => String(n?.title || '').trim()).filter(Boolean)
  if (titles.length === 0 || sameSet(titles, OLD_NOMINATIONS)) {
    await payload.updateGlobal({
      slug: 'award-settings' as any,
      locale: 'ru' as any,
      data: { nominations: NOMINATIONS.ru.map((n, i) => ({ no: '0' + (i + 1), ...n })) } as any,
      req,
    })
    const saved: any = await payload.findGlobal({ slug: 'award-settings' as any, locale: 'ru' as any, req })
    for (const l of ['ro', 'en'] as L[]) {
      await payload.updateGlobal({
        slug: 'award-settings' as any,
        locale: l as any,
        data: {
          nominations: (saved.nominations || []).map((row: any, i: number) => ({ id: row.id, no: row.no, ...NOMINATIONS[l][i] })),
        } as any,
        req,
      })
    }
    payload.logger.info('[arch-makers] номинации обновлены под макет')
  } else {
    payload.logger.info('[arch-makers] номинации правились вручную — оставляем как есть')
  }

  // ——— автоответ
  for (const l of LOCALES) {
    const mail: any = await payload.findGlobal({ slug: 'mail' as any, locale: l as any, fallbackLocale: 'none' as any, req })
    const data: Record<string, string> = {}
    for (const k of ['autoreplySubject', 'autoreplyBody']) {
      const v = mail?.[k]
      if (typeof v === 'string' && v.includes('Future Architecture')) data[k] = v.split('Future Architecture').join('ARCH MAKERS')
    }
    if (Object.keys(data).length) {
      await payload.updateGlobal({ slug: 'mail' as any, locale: l as any, data: data as any, req })
      payload.logger.info(`[arch-makers] автоответ (${l}) — новое название бренда`)
    }
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Данные не откатываем: редактор мог уже поменять их в админке.
  payload.logger.info('[arch-makers] откат данных не требуется')
}
