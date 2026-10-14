import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* 14.10.2026 — правки по сайту.
   1. Контакты в подвале: одна почта info@future-arch.md и один телефон сообщества.
   2. Формулировки на трёх языках. Текст меняется только если в админке он
      ровно такой, как был, — ручные правки не трогаем. */

const CONTACTS = {
  email1: 'info@future-arch.md',
  email2: '',
  phone1: '(+373) 68 059 311',
  phone1Label: '',
  phone2: '',
  phone2Label: '',
}

const TEXT: [string, string][] = [
  // Сообщество
  [
    'Сообщество архитекторов, дизайнеров Молдовы. Объединяем людей для обмена опытом, диалога и совместного развития профессиональной среды.',
    'Сообщество архитекторов и дизайнеров Молдовы. Объединяем людей для обмена опытом, диалога и совместного развития профессиональной среды.',
  ],
  [
    'Сообщество архитекторов, дизайнеров и представителей индустрий Молдовы. Объединяем людей для обмена опытом, диалога и совместного развития профессиональной среды.',
    'Сообщество архитекторов и дизайнеров Молдовы. Объединяем людей для обмена опытом, диалога и совместного развития профессиональной среды.',
  ],
  [
    'Comunitatea arhitecților, designerilor din Moldova. Unim oamenii pentru schimb de experiență, dialog și dezvoltarea comună a mediului profesional.',
    'Comunitatea arhitecților și designerilor din Moldova. Unim oamenii pentru schimb de experiență, dialog și dezvoltarea comună a mediului profesional.',
  ],
  [
    'A community of architects, designers and industry representatives in Moldova. We bring people together to share experience, hold a dialogue and grow the professional environment together.',
    'A community of architects and designers in Moldova. We bring people together to share experience, hold a dialogue and grow the professional environment together.',
  ],
  ['Кто внутри сообщества', 'Кто входит в сообщество'],
  ['Who is inside the community', 'Who is in the community'],
  [
    'Партнёры и представители индустрии, которые помогают идеям расти: знакомят с материалами и технологиями, участвуют в проектах и событиях сообщества.',
    'Партнёры — представители индустрии, которые помогают идеям расти: знакомят с материалами и технологиями, участвуют в проектах и событиях сообщества.',
  ],
  [
    'Parteneri și reprezentanți ai industriei care ajută ideile să crească: prezintă materiale și tehnologii, participă la proiectele și evenimentele comunității.',
    'Partenerii sunt reprezentanți ai industriei care ajută ideile să crească: prezintă materiale și tehnologii, participă la proiectele și evenimentele comunității.',
  ],
  [
    'Partners and industry representatives who help ideas grow: they introduce materials and technologies and take part in community projects and events.',
    'Partners are industry representatives who help ideas grow: they introduce materials and technologies and take part in community projects and events.',
  ],
  ['Новые материалы и технологии раньше, чем они выйдут на рынок', 'Новые материалы и технологии до выхода на рынок'],
  ['Ответ придёт на указанную почту после рассмотрения.', 'Мы рассмотрим заявку и ответим на указанную почту.'],
  ['Răspunsul va veni pe e-mailul indicat după examinare.', 'Vom examina cererea și vă vom răspunde pe e-mailul indicat.'],
  // Форум
  [
    'Для партнёров это возможность представить компанию ключевым игрокам рынка, выстроить новые деловые связи и стать частью будущих проектов.',
    'Форум — это возможность представить компанию ключевым игрокам рынка, выстроить новые деловые связи и стать частью будущих проектов.',
  ],
  [
    'Pentru parteneri este o ocazie de a-și prezenta compania principalilor jucători de pe piață, de a construi noi relații de afaceri și de a deveni parte a proiectelor viitoare.',
    'Forumul este o ocazie de a vă prezenta compania principalilor jucători de pe piață, de a construi noi relații de afaceri și de a deveni parte a proiectelor viitoare.',
  ],
  [
    'For partners it is a chance to present the company to key market players, build new business relationships and become part of future projects.',
    'The forum is a chance to present your company to key market players, build new business relationships and become part of future projects.',
  ],
  [
    'Ответ придёт на указанную почту. Партнёрам в ответном письме отправим презентацию.',
    'Мы ответим на указанную почту. Партнёрам вместе с ответом пришлём презентацию.',
  ],
  [
    'Răspunsul va veni pe e-mailul indicat. Partenerilor le vom trimite prezentarea în scrisoarea de răspuns.',
    'Vă vom răspunde pe e-mailul indicat. Partenerilor le vom trimite prezentarea împreună cu răspunsul.',
  ],
  // Премия
  ['Выберите номинацию — форма заявки откроется с ней.', 'Выберите номинацию — она сразу появится в форме заявки.'],
  [
    'Alegeți o nominalizare — formularul se va deschide cu ea selectată.',
    'Alegeți o nominalizare — aceasta va apărea imediat în formularul de înscriere.',
  ],
  ['Подать ещё одну номинацию →', 'Подать проект в другой номинации →'],
  ['Înscrie în încă o nominalizare →', 'Înscrie un proiect în altă nominalizare →'],
  ['Enter another category →', 'Enter a project in another category →'],
  [
    'Предложите решение для места, где люди встречаются и отдыхают: площади, парка, улицы или набережной. Победитель получает те же награды, что и в основной премии.',
    'Предложите решение для места, где люди встречаются и отдыхают: площади, парка, улицы или набережной. Победитель получает те же награды, что и победители основной премии.',
  ],
  [
    'Propuneți o soluție pentru un loc unde oamenii se întâlnesc și se odihnesc: o piață, un parc, o stradă sau un chei. Câștigătorul primește aceleași premii ca în premiul principal.',
    'Propuneți o soluție pentru un loc unde oamenii se întâlnesc și se odihnesc: o piață, un parc, o stradă sau un chei. Câștigătorul primește aceleași premii ca și câștigătorii premiului principal.',
  ],
  [
    'Propose a design for a place where people meet and relax: a square, a park, a street or an embankment. The winner receives the same prizes as in the main award.',
    'Propose a design for a place where people meet and relax: a square, a park, a street or an embankment. The winner receives the same prizes as the winners of the main award.',
  ],
]
const MAP = new Map(TEXT)
const SKIP = new Set(['id', 'globalType', 'createdAt', 'updatedAt'])

function swap(v: any): any {
  if (typeof v === 'string') return MAP.has(v) ? MAP.get(v) : v
  if (Array.isArray(v)) return v.map(swap)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, swap(x)]))
  return v
}
const strip = (d: any) => Object.fromEntries(Object.entries(d || {}).filter(([k]) => !SKIP.has(k)))

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const slug of ['common', 'home', 'forum', 'award']) {
    let doc: any
    try {
      doc = await payload.findGlobal({ slug: slug as any, depth: 0, req })
    } catch {
      continue
    }
    if (!doc) continue
    const before = strip(doc)
    const data: any = swap(before)
    if (slug === 'common') {
      data.contacts = { ...(data.contacts || {}) }
      for (const [k, v] of Object.entries(CONTACTS)) data.contacts[k] = { ru: v, ro: v, en: v }
    }
    if (JSON.stringify(data) === JSON.stringify(before)) continue
    await payload.updateGlobal({ slug: slug as any, data, req, context: { skipRevalidate: true } })
    payload.logger.info(`[14.10] ${slug}: контакты и формулировки обновлены`)
  }
}

export async function down(_: MigrateDownArgs): Promise<void> {}
