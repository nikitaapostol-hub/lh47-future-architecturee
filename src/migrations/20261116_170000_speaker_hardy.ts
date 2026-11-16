import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Форум: новый спикер — Алекс Харди (Binghatti, ОАЭ), в конец списка.
   Если он уже есть в админке (по фамилии), ничего не меняется. Фото встроено
   в сайт (public/img/sp-hardy.jpg) и подбирается по фамилии. */

const SPEAKER = {
  name: { ru: 'Алекс Харди', ro: 'Alex Hardy', en: 'Alex Hardy' },
  role: {
    ru: 'Вице-президент по продажам Binghatti, ОАЭ',
    ro: 'Vicepreședinte vânzări Binghatti, EAU',
    en: 'Vice President Sales, Binghatti, UAE',
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
  const has = list.some((s) => /харди|hardy/i.test(JSON.stringify(s?.name || '')))
  if (has || list.length === 0) {
    // пустой список = на сайте состав из макета; не подменяем его одним спикером
    payload.logger.info('[16.11] forum: спикер Харди — без изменений')
    return
  }
  const data: any = Object.fromEntries(Object.entries(doc).filter(([k]) => !['id', 'globalType', 'createdAt', 'updatedAt'].includes(k)))
  data.speakers = [...list, SPEAKER]
  await payload.updateGlobal({ slug: 'forum' as any, data, req, context: { skipRevalidate: true } })
  payload.logger.info('[16.11] forum: добавлен спикер Алекс Харди')
}

export async function down(_: MigrateDownArgs): Promise<void> {}
