import type { GlobalConfig } from 'payload'

/* Даты, таймеры, номинации и жюри. Тексты страниц — в группе «Тексты страниц». */

export const ForumSettings: GlobalConfig = {
  slug: 'forum-settings',
  label: 'Форум — настройки',
  admin: {
    group: 'Настройки',
    description: 'Дата форума и обратный отсчёт на всех страницах.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Дата',
          fields: [
            {
              name: 'forumDate',
              type: 'date',
              label: 'Дата и время форума',
              defaultValue: '2026-12-09T10:00:00',
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
                description:
                  'От неё считается таймер обратного отсчёта и микроразметка события для Google.',
              },
            },
            {
              name: 'countdownVisible',
              type: 'checkbox',
              label: 'Показывать обратный отсчёт',
              defaultValue: true,
            },
          ],
        },
        {
          label: 'Спикеры',
          description:
            'Появляются на странице форума под блоком «Спикеры». Пустой список — блока с карточками нет. Порядок в списке = порядок на сайте.',
          fields: [
            {
              name: 'speakers',
              type: 'array',
              label: 'Спикеры',
              labels: { singular: 'Спикер', plural: 'Спикеры' },
              admin: { initCollapsed: false },
              defaultValue: [
                {
                  name: 'Дмитрий Разлога',
                  company: 'LOCAL',
                  role: 'Генеральный директор сети магазинов LOCAL — более 120 точек по Молдове. Запустил программу поддержки локальных производителей.',
                },
                {
                  name: 'Дмитрий Волошин',
                  company: 'Simpals',
                  role: 'Основатель Simpals (999.md, Point.md) и Sporter, президент Федерации триатлона Молдовы.',
                },
              ],
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Имя и фамилия',
                  required: true,
                  localized: true,
                  admin: { description: 'В версиях RO и EN можно поставить латиницу.' },
                },
                {
                  name: 'company',
                  type: 'text',
                  label: 'Компания',
                  localized: true,
                  admin: { description: 'Короткое название — печатается оранжевым под именем.' },
                },
                {
                  name: 'role',
                  type: 'textarea',
                  label: 'Кто он',
                  localized: true,
                  admin: { description: 'Одно-два предложения: должность и чем известен.' },
                },
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media' as const,
                  label: 'Портрет',
                  admin: {
                    description:
                      'Вертикальный кадр 4:5, от 800 px по короткой стороне. Пока фото нет, в карточке стоят инициалы.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const NOMINATION_FIELDS = [
  {
    name: 'no',
    type: 'text' as const,
    label: 'Номер',
    admin: { width: '20%', description: 'Двузначный: 01, 02…' },
  },
  { name: 'title', type: 'text' as const, label: 'Название', required: true, localized: true },
  {
    name: 'hint',
    type: 'text' as const,
    label: 'Уточнение',
    localized: true,
    admin: { description: 'Короткая расшифровка. Показывается в списке номинаций под названием.' },
  },
]

export const AwardSettings: GlobalConfig = {
  slug: 'award-settings',
  label: 'Премия — настройки',
  admin: {
    group: 'Настройки',
    description: 'Дедлайн приёма заявок, номинации и жюри. Номинации сразу попадают и в список на странице, и в выпадающий список формы.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Сроки',
          fields: [
            {
              name: 'deadlineLabel',
              type: 'text',
              label: 'Дедлайн — подпись',
              localized: true,
              defaultValue: '20 ноября',
              admin: { description: 'Как дата выглядит в тексте: «Заявки до 20 ноября».' },
            },
            {
              name: 'deadlineDate',
              type: 'date',
              label: 'Дедлайн — дата',
              defaultValue: '2026-11-20T23:59:00+02:00',
              admin: {
                date: { pickerAppearance: 'dayAndTime' },
                description: 'От неё считается таймер.',
              },
            },
            {
              name: 'countdownVisible',
              type: 'checkbox',
              label: 'Показывать обратный отсчёт',
              defaultValue: true,
            },
            {
              name: 'formOpen',
              type: 'checkbox',
              label: 'Приём заявок открыт',
              defaultValue: true,
              admin: {
                description: 'Снимите галочку, когда приём закрыт: форма заменится сообщением ниже.',
              },
            },
            {
              name: 'formClosedText',
              type: 'textarea',
              label: 'Текст вместо формы',
              localized: true,
              defaultValue: 'Приём заявок завершён. Победителей объявим 9 декабря на форуме в Кишинёве.',
              admin: { condition: (data) => data?.formOpen === false },
            },
          ],
        },
        {
          label: 'Номинации',
          description: 'Порядок в списке = порядок на странице и в форме.',
          fields: [
            {
              name: 'nominations',
              type: 'array',
              label: 'Номинации — премия отрасли',
              labels: { singular: 'Номинация', plural: 'Номинации' },
              admin: { initCollapsed: false },
              defaultValue: [
                { no: '01', title: 'Архитектура частного дома', hint: 'ИЖС · экстерьер и объём' },
                { no: '02', title: 'Интерьер частного дома', hint: 'ИЖС · интерьер' },
                { no: '03', title: 'Интерьер коммерческого пространства', hint: 'Офисы, ретейл, HoReCa' },
                { no: '04', title: 'Экстерьер жилого комплекса', hint: 'ЖК · архитектура и благоустройство' },
              ],
              fields: NOMINATION_FIELDS,
            },
            {
              name: 'studentNominations',
              type: 'array',
              label: 'Номинации — студенческий конкурс',
              labels: { singular: 'Номинация', plural: 'Номинации' },
              defaultValue: [
                {
                  no: '01',
                  title: 'Общественное пространство',
                  hint: 'Идеи для городов Молдовы',
                },
              ],
              fields: NOMINATION_FIELDS,
            },
          ],
        },
        {
          label: 'Жюри',
          fields: [
            {
              name: 'juryVisible',
              type: 'checkbox',
              label: 'Показывать блок жюри',
              defaultValue: false,
              admin: { description: 'Пока состав не утверждён — держите выключенным.' },
            },
            {
              name: 'jury',
              type: 'array',
              label: 'Жюри',
              labels: { singular: 'Член жюри', plural: 'Члены жюри' },
              admin: { condition: (data) => data?.juryVisible === true },
              fields: [
                { name: 'no', type: 'text', label: 'Номер', admin: { width: '20%' } },
                { name: 'name', type: 'text', label: 'Имя', required: true },
                { name: 'role', type: 'text', label: 'Роль / компания', localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
