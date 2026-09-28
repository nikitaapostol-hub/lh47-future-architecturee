/* Разделы админки «Страницы»: одна страница сайта — один раздел со всем,
   что на ней есть. Как «Страницы» в WordPress, только все три языка рядом. */
import type { Field, GlobalAfterChangeHook, Tab } from 'payload'
import { buildGlobal, l3 } from '@/cms/build'
import { COMMON } from '@/cms/common'
import { HOME } from '@/cms/home'
import { FORUM } from '@/cms/forum'
import { AWARD } from '@/cms/award'

/** Все адреса сайта: после сохранения их кэш сбрасывается, и правка видна сразу. */
const PATHS = ['/', '/forum', '/award', '/privacy'].flatMap((p) => [
  p,
  '/ro' + (p === '/' ? '' : p),
  '/en' + (p === '/' ? '' : p),
])

export const revalidateSite: GlobalAfterChangeHook = async ({ doc, req, context }) => {
  if (context?.skipRevalidate) return doc
  try {
    const { revalidatePath } = await import('next/cache')
    for (const p of PATHS) revalidatePath(p)
  } catch (e) {
    req.payload.logger.warn('[revalidate] ' + (e as Error).message)
  }
  return doc
}

const PAGES = 'Страницы'

export const HomePage = buildGlobal(HOME, {
  label: 'Главная — Сообщество',
  group: PAGES,
  path: '/',
  description: 'Все тексты главной страницы. Сохраните — и через пару секунд они на сайте.',
  afterChange: [revalidateSite],
})

const forumSettings: Tab[] = [
  {
    label: 'Дата и спикеры',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'forumDate',
            type: 'date',
            label: 'Дата и время форума',
            defaultValue: '2026-12-09T10:00:00+02:00',
            admin: {
              width: '50%',
              date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy, HH:mm' },
              description: 'От неё считается таймер на странице.',
            },
          },
          {
            name: 'countdownVisible',
            type: 'checkbox',
            label: 'Показывать таймер',
            defaultValue: true,
            admin: { width: '50%', style: { alignSelf: 'center' } },
          },
        ],
      },
      {
        name: 'speakers',
        type: 'array',
        label: 'Спикеры',
        labels: { singular: 'Спикер', plural: 'Спикеры' },
        admin: {
          initCollapsed: false,
          description:
            'Порядок в списке = порядок на сайте (перетаскивайте за ⠿). Фото Волошина, Разлоги, Мырзы и Ионицэ уже встроены — загружать не нужно. Новому спикеру без фото сайт покажет инициалы.',
          components: { RowLabel: '/components/admin/RowLabel#SpeakerLabel' },
        },
        fields: [
          l3('name', 'Имя и фамилия', { required: true }),
          l3('role', 'Кто он — строка под именем'),
          {
            name: 'photo',
            type: 'upload',
            relationTo: 'media',
            label: 'Портрет',
            admin: { description: 'Вертикальный кадр 4:5, от 800 px в ширину. Чёрно-белым сайт сделает сам.' },
          },
        ] as Field[],
      },
    ],
  },
]

export const ForumPage = buildGlobal(FORUM, {
  label: 'Форум 2026',
  group: PAGES,
  path: '/forum',
  description: 'Дата, спикеры и все тексты страницы форума.',
  before: forumSettings,
  afterChange: [revalidateSite],
})

const awardSettings: Tab[] = [
  {
    label: 'Приём заявок',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'deadlineDate',
            type: 'date',
            label: 'Заявки принимаются до',
            defaultValue: '2026-11-20T23:59:00+02:00',
            admin: {
              width: '50%',
              date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy, HH:mm' },
              description: 'Дата в первом экране и счётчик «осталось N дней».',
            },
          },
          {
            name: 'formOpen',
            type: 'checkbox',
            label: 'Приём заявок открыт',
            defaultValue: true,
            admin: { width: '50%', style: { alignSelf: 'center' } },
          },
        ],
      },
      {
        ...l3('formClosedText', 'Текст вместо форм, когда приём закрыт', { area: true }),
        admin: { hideGutter: true, condition: (data: any) => data?.formOpen === false },
      } as Field,
      {
        name: 'nominationList',
        type: 'array',
        label: 'Номинации',
        labels: { singular: 'Номинация', plural: 'Номинации' },
        admin: {
          initCollapsed: false,
          description: 'Появляются и карточками на странице, и в выпадающем списке формы. Номер ставится сам.',
          components: { RowLabel: '/components/admin/RowLabel#NominationLabel' },
        },
        fields: [l3('kind', 'Раздел — надпись над названием'), l3('title', 'Название', { required: true })] as Field[],
      },
    ],
  },
]

export const AwardPage = buildGlobal(AWARD, {
  label: 'Премия и конкурсы',
  group: PAGES,
  path: '/award',
  description: 'Приём заявок, номинации и все тексты страницы премии.',
  before: awardSettings,
  afterChange: [revalidateSite],
})

export const CommonPage = buildGlobal(COMMON, {
  label: 'Меню, подвал и формы',
  group: PAGES,
  path: '/',
  description: 'То, что одинаково на всех страницах: пункты меню, контакты в подвале, подписи в формах.',
  afterChange: [revalidateSite],
})
