import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Форум: новый спикер — Виктор Гросу (Hype Project), в конец списка.
   Если он уже есть в админке (по фамилии), ничего не меняется. Фото встроено
   в сайт (public/img/sp-grosu-2.jpg) и подбирается по фамилии. */

const SPEAKER = {
  name: { ru: 'Виктор Гросу', ro: 'Victor Grosu', en: 'Victor Grosu' },
  role: {
    ru: 'Архитектор и дизайнер интерьеров, основатель Hype Project',
    ro: 'Arhitect și designer de interior, fondatorul Hype Project',
    en: 'Architect and interior designer, founder of Hype Project',
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
  const has = list.some((s) => /гросу|гроссу|grosu/i.test(JSON.stringify(s?.name || '')))
  if (has || list.length === 0) {
    // пустой список = на сайте состав из макета; не подменяем его одним спикером
    payload.logger.info('[12.11] forum: спикер Гросу — без изменений')
    return
  }
  const data: any = Object.fromEntries(Object.entries(doc).filter(([k]) => !['id', 'globalType', 'createdAt', 'updatedAt'].includes(k)))
  data.speakers = [...list, SPEAKER]
  await payload.updateGlobal({ slug: 'forum' as any, data, req, context: { skipRevalidate: true } })
  payload.logger.info('[12.11] forum: добавлен спикер Виктор Гросу')
}

export async function down(_: MigrateDownArgs): Promise<void> {}
