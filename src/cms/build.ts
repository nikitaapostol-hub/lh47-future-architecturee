/* Сборка Payload-глобала из описания страницы и обратная операция —
   наложение сохранённых значений на словарь. */
import type { GlobalConfig, Field as PayloadField, Tab } from 'payload'
import type { Dict } from '@/i18n/dict'
import type { Field, PageContent, Section } from './types'
import { dict } from '@/i18n'
import { typo } from '@/i18n/typo'
import type { Lang } from '@/i18n/links'

/** Дефолт берём из русского словаря: пустое поле в админке = «как было». */
const base = dict.ru as Record<string, string>

function payloadField(f: Field): PayloadField {
  if (f.kind === 'text') {
    return {
      name: f.name,
      type: f.area ? 'textarea' : 'text',
      label: f.label,
      localized: true,
      admin: {
        description: f.desc ?? placeholderHint(base[f.key as string]),
        placeholder: base[f.key as string],
      },
    } as PayloadField
  }
  return {
    name: f.name,
    type: 'array',
    label: f.label,
    localized: true,
    labels: { singular: f.itemLabel, plural: f.label },
    minRows: f.rows.length,
    maxRows: f.rows.length,
    admin: { description: f.desc, initCollapsed: true },
    defaultValue: f.rows.map((row) =>
      Object.fromEntries(f.cols.map((c) => [c.name, base[row[c.name] as string] ?? ''])),
    ),
    fields: f.cols.map((c) => ({
      name: c.name,
      type: c.area ? 'textarea' : 'text',
      label: c.label,
    })) as PayloadField[],
  } as PayloadField
}

function placeholderHint(v?: string) {
  if (!v) return undefined
  const short = v.length > 90 ? v.slice(0, 90) + '…' : v
  return 'Сейчас на сайте: «' + short + '»'
}

/* Именованные вкладки: данные каждой секции лежат в своём объекте,
   поэтому одинаковые имена полей в разных секциях не конфликтуют. */
function tab(s: Section): Tab {
  return {
    name: s.name,
    label: s.label,
    description: s.desc,
    fields: s.fields.map(payloadField),
  } as Tab
}

export function buildGlobal(p: PageContent): GlobalConfig {
  return {
    slug: p.slug,
    label: p.label,
    admin: { group: 'Тексты страниц', description: p.desc },
    access: { read: () => true },
    fields: [{ type: 'tabs', tabs: p.sections.map(tab) }],
  }
}

/** Значения из админки поверх словаря. Пустые поля пропускаем —
    остаётся исходный текст, поэтому сайт никогда не «обнуляется». */
export function applyContent(p: PageContent, data: any, lang = 'ru'): Partial<Dict> {
  const out: Record<string, string> = {}
  if (!data) return out as Partial<Dict>
  for (const s of p.sections) {
    const scope = data[s.name]
    if (!scope) continue
    for (const f of s.fields) {
      if (f.kind === 'text') {
        const v = scope[f.name]
        if (typeof v === 'string' && v.trim()) out[f.key as string] = typo(v, lang)
      } else {
        const rows = scope[f.name]
        if (!Array.isArray(rows)) continue
        f.rows.forEach((map, i) => {
          const row = rows[i]
          if (!row) return
          for (const c of f.cols) {
            const v = row[c.name]
            const key = map[c.name]
            if (key && typeof v === 'string' && v.trim()) out[key as string] = typo(v, lang)
          }
        })
      }
    }
  }
  return out as Partial<Dict>
}

export type { Lang }
