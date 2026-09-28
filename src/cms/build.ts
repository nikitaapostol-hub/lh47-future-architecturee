/* Сборка раздела админки из описания страницы — и обратная операция:
   наложение сохранённых значений на словарь сайта.

   Каждое текстовое поле — это три поля в одну строку: RU · RO · EN.
   Переключать язык в админке не нужно: все переводы видны рядом. */
import type { Field as PayloadField, GlobalConfig, Tab } from 'payload'
import type { Dict } from '@/i18n/dict'
import type { Field, PageContent, Section } from './types'
import { ru } from '@/i18n/ru'
import { ro } from '@/i18n/ro'
import { en } from '@/i18n/en'
import { typo } from '@/i18n/typo'
import type { Lang } from '@/i18n/links'

export const LANGS3: Lang[] = ['ru', 'ro', 'en']
const LABEL3: Record<Lang, string> = { ru: 'RU', ro: 'RO', en: 'EN' }

/** Исходные тексты (без микротипографики) — ими заполняется админка. */
export const RAW: Record<Lang, Record<string, string>> = { ru, ro, en }

/** Поле на трёх языках: группа name → { ru, ro, en }. */
export function l3(
  name: string,
  label: string,
  opts: { area?: boolean; desc?: string; required?: boolean } = {},
): PayloadField {
  return {
    name,
    type: 'group',
    label,
    admin: { hideGutter: true, ...(opts.desc ? { description: opts.desc } : {}) },
    fields: [
      {
        type: 'row',
        fields: LANGS3.map((l) => ({
          name: l,
          type: opts.area ? 'textarea' : 'text',
          label: LABEL3[l],
          ...(opts.required && l === 'ru' ? { required: true } : {}),
          admin: { width: '33.33%', ...(opts.area ? { rows: 3 } : {}) },
        })),
      },
    ],
  } as PayloadField
}

function payloadField(f: Field): PayloadField {
  if (f.kind === 'text') return l3(f.name, f.label, { area: f.area, desc: f.desc })
  return {
    name: f.name,
    type: 'array',
    label: f.label,
    labels: { singular: f.itemLabel, plural: f.label },
    maxRows: f.rows.length,
    admin: {
      initCollapsed: false,
      components: { RowLabel: '/components/admin/RowLabel#ItemLabel' },
      ...(f.desc ? { description: f.desc } : {}),
    },
    fields: f.cols.map((c) => l3(c.name, c.label, { area: c.area })),
  } as PayloadField
}

/** Вкладка с текстами одной секции страницы. */
function textTab(s: Section): Tab {
  return {
    name: s.name,
    label: s.label,
    ...(s.desc ? { description: s.desc } : {}),
    fields: s.fields.map(payloadField),
  } as Tab
}

export type PageGlobalOptions = {
  label: string
  group: string
  description?: string
  /** Адрес страницы на сайте — для кнопки «Предпросмотр» и живого предпросмотра. */
  path?: string
  /** Вкладки перед текстами: дата, спикеры, номинации и т. п. */
  before?: Tab[]
  afterChange?: NonNullable<GlobalConfig['hooks']>['afterChange']
}

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://future-arch.md').replace(/\/$/, '')

/** Адрес страницы на том же домене, где открыта админка (боевой, превью, локальный). */
function siteUrl(req: any, path: string) {
  const host = req?.headers?.get?.('host')
  if (!host) return SITE + path
  const proto = /^(localhost|127\.|\[::1\])/.test(host) ? 'http' : 'https'
  return `${proto}://${host}${path}`
}

export function buildGlobal(p: PageContent, o: PageGlobalOptions): GlobalConfig {
  const url = o.path
  return {
    slug: p.slug,
    label: o.label,
    admin: {
      group: o.group,
      hideAPIURL: true,
      ...(o.description ? { description: o.description } : {}),
      ...(url
        ? {
            preview: (_doc: any, { req }: any) => siteUrl(req, url),
            livePreview: {
              url: ({ req }: any) => siteUrl(req, url),
              breakpoints: [
                { label: 'Телефон', name: 'mobile', width: 390, height: 844 },
                { label: 'Планшет', name: 'tablet', width: 900, height: 1100 },
                { label: 'Компьютер', name: 'desktop', width: 1440, height: 900 },
              ],
            },
          }
        : {}),
    },
    access: { read: () => true },
    ...(o.afterChange ? { hooks: { afterChange: o.afterChange } } : {}),
    fields: [{ type: 'tabs', tabs: [...(o.before || []), ...p.sections.map(textTab)] }],
  }
}

const pick = (v: any, lang: Lang) => (v && typeof v === 'object' && typeof v[lang] === 'string' ? v[lang] : '')

/** Значения из админки поверх словаря. Пустое поле — остаётся текст из кода,
    поэтому сайт никогда не «обнуляется». */
export function applyContent(p: PageContent, data: any, lang: Lang = 'ru'): Partial<Dict> {
  const out: Record<string, string> = {}
  if (!data) return out as Partial<Dict>
  for (const s of p.sections) {
    const scope = data[s.name]
    if (!scope) continue
    for (const f of s.fields) {
      if (f.kind === 'text') {
        const v = pick(scope[f.name], lang)
        if (v.trim()) out[f.key as string] = typo(v, lang)
      } else {
        const rows = scope[f.name]
        if (!Array.isArray(rows)) continue
        f.rows.forEach((map, i) => {
          const row = rows[i]
          if (!row) return
          for (const c of f.cols) {
            const v = pick(row[c.name], lang)
            const key = map[c.name]
            if (key && v.trim()) out[key as string] = typo(v, lang)
          }
        })
      }
    }
  }
  return out as Partial<Dict>
}

/** Данные раздела, заполненные текстами сайта: так в админке сразу видно,
    что стоит на странице. `old(lang, section, field, row?, col?)` может
    вернуть уже сохранённую правку — она важнее текста из кода. */
export function filledData(
  p: PageContent,
  old: (lang: Lang, section: string, field: string, row?: number, col?: string) => string | undefined,
) {
  const data: Record<string, any> = {}
  for (const s of p.sections) {
    const scope: Record<string, any> = {}
    for (const f of s.fields) {
      if (f.kind === 'text') {
        scope[f.name] = Object.fromEntries(
          LANGS3.map((l) => [l, old(l, s.name, f.name) || RAW[l][f.key as string] || '']),
        )
      } else {
        scope[f.name] = f.rows.map((map, i) =>
          Object.fromEntries(
            f.cols.map((c) => [
              c.name,
              Object.fromEntries(LANGS3.map((l) => [l, old(l, s.name, f.name, i, c.name) || RAW[l][map[c.name] as string] || ''])),
            ]),
          ),
        )
      }
    }
    data[s.name] = scope
  }
  return data
}

/** Строка на нужном языке из поля {ru, ro, en}; пусто — русская. */
export function inLang(v: any, lang: Lang): string {
  const own = pick(v, lang).trim()
  return own || pick(v, 'ru').trim()
}

export type { Lang }
