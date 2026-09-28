/* Заголовки и описания страниц для Google и соцсетей — значения по умолчанию.
   В админке их можно поменять: «Настройки сайта → SEO». */
import type { Lang } from './links'

export const SEO_COPY: Record<'/' | '/forum' | '/award', Record<Lang, { title: string; description: string }>> = {
  '/': {
    ru: {
      title: 'ARCH MAKERS — сообщество архитекторов и дизайнеров Молдовы',
      description:
        'Профессиональное сообщество архитекторов, дизайнеров и представителей индустрий Молдовы: форум, премия, встречи ArchiMinds, журнал и поездки. Вступление по заявке.',
    },
    ro: {
      title: 'ARCH MAKERS — comunitatea arhitecților și designerilor din Moldova',
      description:
        'Comunitatea profesională a arhitecților, designerilor și reprezentanților industriilor din Moldova: forum, premiu, întâlniri ArchiMinds, revistă și călătorii. Aderare pe bază de cerere.',
    },
    en: {
      title: 'ARCH MAKERS — community of architects and designers in Moldova',
      description:
        'A professional community of architects, designers and industry representatives in Moldova: a forum, an award, ArchiMinds meetings, a magazine and trips. Membership by application.',
    },
  },
  '/forum': {
    ru: {
      title: 'ARCH MAKERS Forum 2026 — 9 декабря, Кишинёв',
      description:
        'Закрытая встреча тех, кто определяет будущее недвижимости Молдовы. Более 250 девелоперов, инвесторов, архитекторов и производителей. 9 декабря 2026, Range Rover Moldova. Участие по отбору.',
    },
    ro: {
      title: 'ARCH MAKERS Forum 2026 — 9 decembrie, Chișinău',
      description:
        'O întâlnire închisă a celor care definesc viitorul imobiliarelor din Moldova. Peste 250 de dezvoltatori, investitori, arhitecți și producători. 9 decembrie 2026, Range Rover Moldova. Participare pe bază de selecție.',
    },
    en: {
      title: 'ARCH MAKERS Forum 2026 — 9 December, Chișinău',
      description:
        'A closed meeting of the people shaping the future of real estate in Moldova. More than 250 developers, investors, architects and manufacturers. 9 December 2026, Range Rover Moldova. Attendance by selection.',
    },
  },
  '/award': {
    ru: {
      title: 'ARCH MAKERS Award 2026 — премия и студенческий конкурс',
      description:
        'Премия для архитекторов и дизайнеров в четырёх номинациях и студенческий конкурс. Заявки до 20 ноября, победителей объявят 9 декабря на сцене ARCH MAKERS Forum.',
    },
    ro: {
      title: 'ARCH MAKERS Award 2026 — premiu și concurs studențesc',
      description:
        'Premiu pentru arhitecți și designeri în patru nominalizări și un concurs studențesc. Cereri până pe 20 noiembrie, câștigătorii vor fi anunțați pe 9 decembrie pe scena ARCH MAKERS Forum.',
    },
    en: {
      title: 'ARCH MAKERS Award 2026 — award and student competition',
      description:
        'An award for architects and designers in four categories, plus a student competition. Applications until 20 November, winners announced on 9 December on stage at ARCH MAKERS Forum.',
    },
  },
}

