import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { ru } from '../i18n/ru'
import { ro } from '../i18n/ro'
import { en } from '../i18n/en'

/* 16.10.2026 — правки текстов.
   Главная: блок «Старт в 2027 и предпродажа» сразу появляется в админке.
   Форум: «лидеры промышленной и коммерческой недвижимости» в тексте первого
   экрана, 300 участников, Ионицэ — доктор экономических наук, без «Закрытого
   ужина», присутствие «до, во время и после» одной фразой.
   Премия: «в ежегодном журнале сообщества».
   Тексты меняются, только если в админке они прежние. */

const D = { ru, ro, en } as const
const l3 = (k: keyof typeof ru) => ({ ru: D.ru[k], ro: D.ro[k], en: D.en[k] })
const SKIP = ['id', 'globalType', 'createdAt', 'updatedAt']
const strip = (d: any) => Object.fromEntries(Object.entries(d || {}).filter(([k]) => !SKIP.includes(k)))

const SWAP: [string, string][] = [
  ['Более 300 девелоперов, инвесторов, архитекторов, производителей и представителей города обсудят новые точки роста, прибыльные форматы и решения, которые повышают ценность проектов.', ru.fText],
  ['Более 250 девелоперов, инвесторов, архитекторов, производителей и представителей города обсудят новые точки роста, прибыльные форматы и решения, которые повышают ценность проектов.', ru.fText],
  ['Peste 300 de dezvoltatori, investitori, arhitecți, producători și reprezentanți ai orașului vor discuta noile puncte de creștere, formatele profitabile și soluțiile care sporesc valoarea proiectelor.', ro.fText],
  ['Peste 250 de dezvoltatori, investitori, arhitecți, producători și reprezentanți ai orașului vor discuta noile puncte de creștere, formatele profitabile și soluțiile care sporesc valoarea proiectelor.', ro.fText],
  ['More than 300 developers, investors, architects, manufacturers and city officials will discuss new growth points, profitable formats and solutions that add value to projects.', en.fText],
  ['More than 250 developers, investors, architects, manufacturers and city officials will discuss new growth points, profitable formats and solutions that add value to projects.', en.fText],
  ['Экономический эксперт', 'Доктор экономических наук'],
  ['Expert economic', 'Doctor în științe economice'],
  ['Economic expert', 'Doctor of Economic Sciences'],
  ['Присутствие на форуме, в ежегодном журнале сообщества и в медиаканалах', ru.fBenefit2],
  ['Prezență la forum, în revista anuală a comunității și pe canalele media', ro.fBenefit2],
  ['Presence at the forum, in the community’s annual magazine and across its media channels', en.fBenefit2],
  ['Публикация проекта в ежегодном журнале Future Architecture', ru.aPrize2],
  ['Publicarea proiectului în revista anuală Future Architecture', ro.aPrize2],
  ['The project featured in the Future Architecture annual magazine', en.aPrize2],
]
const MAP = new Map(SWAP)
function swap(v: any): any {
  if (typeof v === 'string') return MAP.has(v) ? MAP.get(v) : v
  if (Array.isArray(v)) return v.map(swap)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, swap(x)]))
  return v
}

async function load(payload: any, req: any, slug: string) {
  try {
    return await payload.findGlobal({ slug, depth: 0, req })
  } catch {
    return null
  }
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Главная — предпродажа
  const home: any = await load(payload, req, 'home')
  if (home) {
    const data: any = strip(home)
    const ps = { ...(data.presale || {}) }
    for (const [f, k] of [['label', 'hPresaleLabel'], ['title', 'hPresaleTitle'], ['text', 'hPresaleText'], ['cta', 'hPresaleCta']] as const)
      if (!ps[f]?.ru) ps[f] = l3(k)
    data.presale = ps
    await payload.updateGlobal({ slug: 'home' as any, data, req, context: { skipRevalidate: true } })
    payload.logger.info('[16.10] home: предпродажа')
  }

  // Форум
  const forum: any = await load(payload, req, 'forum')
  if (forum) {
    const data: any = swap(strip(forum))
    if (data.count?.number) {
      for (const l of ['ru', 'ro', 'en']) if (String(data.count.number[l] || '').trim() === '250') data.count.number[l] = '300'
    }
    const items = data.program?.items
    if (Array.isArray(items)) data.program.items = items.filter((it: any) => !/закрытый ужин|cină privată|private dinner/i.test(JSON.stringify(it?.title || '')))
    await payload.updateGlobal({ slug: 'forum' as any, data, req, context: { skipRevalidate: true } })
    payload.logger.info('[16.10] forum: тексты, программа, спикер')
  }

  // Премия
  const award: any = await load(payload, req, 'award')
  if (award) {
    const before = strip(award)
    const data = swap(before)
    if (JSON.stringify(data) !== JSON.stringify(before)) {
      await payload.updateGlobal({ slug: 'award' as any, data, req, context: { skipRevalidate: true } })
      payload.logger.info('[16.10] award: журнал сообщества')
    }
  }

  // SEO-описание форума: 250 → 300
  const st: any = await load(payload, req, 'settings')
  if (st) {
    const before = strip(st)
    const txt = JSON.stringify(before)
    const next = txt.split('Более 250 ').join('Более 300 ').split('Peste 250 ').join('Peste 300 ').split('More than 250 ').join('More than 300 ')
    if (next !== txt) {
      await payload.updateGlobal({ slug: 'settings' as any, data: JSON.parse(next), req, context: { skipRevalidate: true } })
      payload.logger.info('[16.10] settings: SEO форума — 300')
    }
  }
}

export async function down(_: MigrateDownArgs): Promise<void> {}
