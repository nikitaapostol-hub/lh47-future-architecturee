import type { GlobalConfig } from 'payload'

/** Mirrors exactly the props the original dc components exposed. */

export const ForumSettings: GlobalConfig = {
  slug: 'forum-settings',
  label: 'Форум — настройки',
  admin: { group: 'Контент' },
  access: { read: () => true },
  fields: [
    {
      name: 'forumDate',
      type: 'date',
      label: 'Дата и время форума',
      defaultValue: '2026-12-09T10:00:00',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'От неё считается таймер обратного отсчёта.',
      },
    },
    {
      name: 'countdownVisible',
      type: 'checkbox',
      label: 'Показывать обратный отсчёт',
      defaultValue: true,
    },
  ],
}

export const AwardSettings: GlobalConfig = {
  slug: 'award-settings',
  label: 'Премия — настройки',
  admin: { group: 'Контент' },
  access: { read: () => true },
  fields: [
    {
      name: 'deadlineLabel',
      type: 'text',
      label: 'Дедлайн — подпись',
      defaultValue: '20 ноября',
    },
    {
      name: 'deadlineDate',
      type: 'date',
      label: 'Дедлайн — дата',
      defaultValue: '2026-11-20T23:59:00+02:00',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'countdownVisible',
      type: 'checkbox',
      label: 'Показывать обратный отсчёт',
      defaultValue: true,
    },
    {
      name: 'juryVisible',
      type: 'checkbox',
      label: 'Показывать блок жюри',
      defaultValue: false,
    },
    {
      name: 'jury',
      type: 'array',
      label: 'Жюри',
      labels: { singular: 'Член жюри', plural: 'Члены жюри' },
      admin: { description: 'Показывается, только если включён блок жюри.' },
      fields: [
        { name: 'no', type: 'text', label: 'Номер', admin: { width: '20%' } },
        { name: 'name', type: 'text', label: 'Имя', required: true },
        { name: 'role', type: 'text', label: 'Роль / компания' },
      ],
    },
    {
      name: 'nominations',
      type: 'array',
      label: 'Номинации — премия отрасли',
      labels: { singular: 'Номинация', plural: 'Номинации' },
      defaultValue: Array.from({ length: 8 }, (_, i) => ({
        no: String(i + 1).padStart(2, '0'),
        title: `Номинация ${String(i + 1).padStart(2, '0')}`,
      })),
      fields: [
        { name: 'no', type: 'text', label: 'Номер' },
        { name: 'title', type: 'text', label: 'Название', required: true },
      ],
    },
    {
      name: 'studentNominations',
      type: 'array',
      label: 'Номинации — студенческий конкурс',
      labels: { singular: 'Номинация', plural: 'Номинации' },
      defaultValue: [{ no: '01', title: '[ПЛЕЙСХОЛДЕР · НОМИНАЦИЯ СТУДЕНЧЕСКОГО КОНКУРСА]' }],
      fields: [
        { name: 'no', type: 'text', label: 'Номер' },
        { name: 'title', type: 'text', label: 'Название', required: true },
      ],
    },
  ],
}
