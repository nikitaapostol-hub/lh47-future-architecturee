/* Номинации премии: заявки приходят с RU, RO и EN версий сайта, и одна номинация
   называется по-разному (Residential interior, Interiorul spațiului rezidențial…).
   В базе, в таблице и в разбивке в админке номинация хранится по-русски.
   Сверяем без регистра, диакритики и разницы в тире. */
import { ru } from '@/i18n/ru'
import { ro } from '@/i18n/ro'
import { en } from '@/i18n/en'

export const nomKey = (v: unknown) =>
  String(v || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‒-―\-]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

export type NomMap = Map<string, string>

export const SPECIAL = [ru.aSpec1, ru.aSpec2]

/** Русские названия номинаций по порядку: из админки, затем спецноминации. */
export async function nominationList(payload: any): Promise<string[]> {
  const out: string[] = []
  try {
    const g = await payload?.findGlobal?.({ slug: 'award', depth: 0 })
    for (const n of Array.isArray(g?.nominationList) ? g.nominationList : []) {
      const r = String(n?.title?.ru || '').trim()
      if (r) out.push(r)
    }
  } catch {
    /* без админки — только спецноминации */
  }
  return [...out, ...SPECIAL]
}

/** Словарь «название на любом языке → русское». */
export async function nominationMap(payload: any): Promise<NomMap> {
  const m: NomMap = new Map()
  const add = (t: any) => {
    const r = String(t?.ru || '').trim()
    if (r) for (const l of ['ru', 'ro', 'en']) if (t?.[l]) m.set(nomKey(t[l]), r)
  }
  add({ ru: ru.aSpec1, ro: ro.aSpec1, en: en.aSpec1 })
  add({ ru: ru.aSpec2, ro: ro.aSpec2, en: en.aSpec2 })
  try {
    const g = await payload?.findGlobal?.({ slug: 'award', depth: 0 })
    for (const n of Array.isArray(g?.nominationList) ? g.nominationList : []) add(n?.title)
  } catch {
    /* без админки — только спецноминации */
  }
  return m
}

/** Хук поля «Номинация»: сохраняем русское название. */
export const toRuNomination = async ({ value, req }: any) => {
  if (typeof value !== 'string' || !value.trim()) return value
  const m = await nominationMap(req?.payload)
  return m.get(nomKey(value)) || value
}
