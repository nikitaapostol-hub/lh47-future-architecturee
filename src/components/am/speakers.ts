/* Спикеры форума. Список берётся из админки («Настройки → Форум»).
   Портреты из макета лежат в public/img и подбираются по фамилии вместе с
   кадрированием из макета; если в админке загружен свой портрет — берётся он.
   Пустой список в админке — показываем состав из макета. */
import type { Lang } from '@/i18n/links'

export type SpeakerIn = {
  name?: string | null
  company?: string | null
  role?: string | null
  photo?: { url?: string | null } | string | number | null
}

export type SpeakerCard = {
  name: string
  role: string
  img: string | null
  /** left, top, width в процентах — как в макете */
  crop: [string, string, string] | null
  initials: string
}

type Known = { match: RegExp; img: string; crop: [string, string, string] }

const KNOWN: Known[] = [
  { match: /волошин|voloshin|woloshin|voloșin/i, img: '/img/sp-voloshin.jpg', crop: ['-57.5%', '-3.7%', '167.9%'] },
  { match: /разлога|razloga/i, img: '/img/sp-razloga.jpg', crop: ['-36.6%', '-12.6%', '163.3%'] },
  { match: /мырза|mîrza|mirza|myrza|mârza/i, img: '/img/sp-myrza.jpg', crop: ['-36.1%', '0%', '165.5%'] },
  { match: /ионицэ|ионица|ioniță|ionita|ionitsa|ionitse/i, img: '/img/sp-ionita.jpg', crop: ['-13%', '4.6%', '120%'] },
]

const DEFAULTS: Record<Lang, { name: string; role: string }[]> = {
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

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export function speakerCards(list: SpeakerIn[] | undefined, lang: Lang): SpeakerCard[] {
  const src = Array.isArray(list) && list.some((s) => s?.name?.trim()) ? list : DEFAULTS[lang]
  return src
    .filter((s) => s?.name && String(s.name).trim())
    .map((s) => {
      const name = String(s.name).trim()
      const role = String(s.role || (s as SpeakerIn).company || '').trim()
      const photo = (s as SpeakerIn).photo
      const uploaded = photo && typeof photo === 'object' && photo.url ? photo.url : null
      const known = KNOWN.find((k) => k.match.test(name))
      return {
        name,
        role,
        img: uploaded || known?.img || null,
        crop: uploaded ? null : known?.crop || null,
        initials: initials(name),
      }
    })
}
