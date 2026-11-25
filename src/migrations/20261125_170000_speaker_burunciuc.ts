import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Форум: новый спикер — Михаил Бурунчук (Invest Moldova), в конец списка.
   Если он уже есть в админке (по фамилии), ничего не меняется. Фото встроено
   в сайт (public/img/sp-burunciuc-n.jpg) и подбирается по фамилии. */

const SPEAKER = {
  name: { ru: 'Михаил Бурунчук', ro: 'Mihai Burunciuc', en: 'Mihai Burunciuc' },
  role: {
    ru: 'Старший советник по инвестициям, Invest Moldova',
    ro: 'Senior Investment Advisor, Invest Moldova',
    en: 'Senior Investment Advisor, Invest Moldova',
  },
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  let doc: any
  try {
    doc = await payload.findGlobal({ slug: 'forum' as any, depth: 0, req })
  } catch {
    return
  }
  if (!doc) return
  const list: any[] = Array.isArray(doc.speakers) ? doc.speakers : []
  const has = list.some((s) => /бурунчук|burunciuc/i.test(JSON.stringify(s?.name || '')))
  if (has || list.length === 0) {
    // пустой список = на сайте состав из макета; не подменяем его одним спикером
    payload.logger.info('[25.11] forum: спикер Бурунчук — без изменений')
    return
  }
  const data: any = Object.fromEntries(Object.entries(doc).filter(([k]) => !['id', 'globalType', 'createdAt', 'updatedAt'].includes(k)))
  data.speakers = [...list, SPEAKER]
  await payload.updateGlobal({ slug: 'forum' as any, data, req, context: { skipRevalidate: true } })
  payload.logger.info('[25.11] forum: добавлен спикер Михаил Бурунчук')
}

export async function down(_: MigrateDownArgs): Promise<void> {}
