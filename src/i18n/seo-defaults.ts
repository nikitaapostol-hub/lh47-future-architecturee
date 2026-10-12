/* Заголовки и описания страниц для Google, AI-поиска и превью ссылок —
   значения по умолчанию. В админке их можно поменять: «Настройки сайта → SEO».

   Тексты — прежние, с финальным названием; у форума в заголовке
   «архитектурный форум в Молдове» — так его ищут. */
import type { Lang } from './links'

export type SeoPage = '/' | '/forum' | '/award'

export const SEO_COPY: Record<SeoPage, Record<Lang, { title: string; description: string }>> = {
  '/': {
    ru: {
      title: 'Future Architecture — сообщество архитекторов и дизайнеров Молдовы',
      description:
        'Профессиональное сообщество архитекторов, дизайнеров и представителей индустрий Молдовы: форум, премия, встречи ArchiMinds, журнал и поездки. Вступление по заявке.',
    },
    ro: {
      title: 'Future Architecture — comunitatea arhitecților și designerilor din Moldova',
      description:
        'Comunitatea profesională a arhitecților, designerilor și reprezentanților industriilor din Moldova: forum, premiu, întâlniri ArchiMinds, revistă și călătorii. Aderare pe bază de cerere.',
    },
    en: {
      title: 'Future Architecture — community of architects and designers in Moldova',
      description:
        'A professional community of architects, designers and industry representatives in Moldova: a forum, an award, ArchiMinds meetings, a magazine and trips. Membership by application.',
    },
  },
  '/forum': {
    ru: {
      title: 'Future Architecture Forum 2026 — архитектурный форум в Молдове',
      description:
        'Закрытая встреча тех, кто определяет будущее недвижимости Молдовы. Более 250 девелоперов, инвесторов, архитекторов и производителей. 9 декабря 2026, Range Rover Moldova. Участие по отбору.',
    },
    ro: {
      title: 'Future Architecture Forum 2026 — forum de arhitectură în Moldova',
      description:
        'O întâlnire închisă a celor care definesc viitorul imobiliarelor din Moldova. Peste 250 de dezvoltatori, investitori, arhitecți și producători. 9 decembrie 2026, Range Rover Moldova. Participare pe bază de selecție.',
    },
    en: {
      title: 'Future Architecture Forum 2026 — architecture forum in Moldova',
      description:
        'A closed meeting of the people shaping the future of real estate in Moldova. More than 250 developers, investors, architects and manufacturers. 9 December 2026, Range Rover Moldova. Attendance by selection.',
    },
  },
  '/award': {
    ru: {
      title: 'Future Architecture Award 2026 — премия и студенческий конкурс',
      description:
        'Премия для архитекторов и дизайнеров в четырёх номинациях и студенческий конкурс. Заявки до 20 ноября, победителей объявят 9 декабря на сцене Future Architecture Forum.',
    },
    ro: {
      title: 'Future Architecture Award 2026 — premiu și concurs studențesc',
      description:
        'Premiu pentru arhitecți și designeri în patru nominalizări și un concurs studențesc. Cereri până pe 20 noiembrie, câștigătorii vor fi anunțați pe 9 decembrie pe scena Future Architecture Forum.',
    },
    en: {
      title: 'Future Architecture Award 2026 — award and student competition',
      description:
        'An award for architects and designers in four categories, plus a student competition. Applications until 20 November, winners announced on 9 December on stage at Future Architecture Forum.',
    },
  },
}

/** Картинка превью ссылки (1200×630): логотип и короткая подпись на языке страницы. */
export function ogImage(page: SeoPage | '/privacy', lang: Lang) {
  const k = page === '/forum' ? 'forum' : page === '/award' ? 'award' : 'home'
  return `/og/${k}-${lang}.jpg`
}

/** Короткое имя и описание проекта — для разметки schema.org и llms.txt. */
export const BRAND = {
  name: 'Future Architecture',
  about: {
    ru: 'Future Architecture — профессиональное сообщество архитекторов и дизайнеров Молдовы, форум и премия.',
    ro: 'Future Architecture — comunitatea profesională a arhitecților și designerilor din Moldova, forum și premiu.',
    en: 'Future Architecture — a professional community of architects and designers in Moldova, a forum and an award.',
  } as Record<Lang, string>,
}
