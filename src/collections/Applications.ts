import type { CollectionConfig } from 'payload'

/** Read-only-ish inbox collections: the site writes, admins read. */
const inboxAccess = {
  create: () => true,          // public form POST
  read: ({ req }: any) => Boolean(req.user),
  update: ({ req }: any) => Boolean(req.user),
  delete: ({ req }: any) => Boolean(req.user),
}

const meta = [
  {
    name: 'submittedAt',
    type: 'date' as const,
    label: 'Отправлено',
    admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' as const } },
    hooks: {
      beforeChange: [({ operation, value }: any) =>
        operation === 'create' ? new Date().toISOString() : value],
    },
  },
]

export const ForumApplications: CollectionConfig = {
  slug: 'forum-applications',
  labels: { singular: 'Заявка на форум', plural: 'Заявки — Форум' },
  admin: { useAsTitle: 'name', group: 'Заявки', defaultColumns: ['name', 'company', 'kind', 'email', 'submittedAt'] },
  access: inboxAccess,
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    { name: 'company', type: 'text', label: 'Компания', required: true },
    { name: 'role', type: 'text', label: 'Роль' },
    { name: 'kind', type: 'text', label: 'Тип обращения' },
    { name: 'email', type: 'email', label: 'Почта', required: true },
    { name: 'phone', type: 'text', label: 'Телефон' },
    ...meta,
  ],
}

export const CommunityApplications: CollectionConfig = {
  slug: 'community-applications',
  labels: { singular: 'Заявка в сообщество', plural: 'Заявки — Сообщество' },
  admin: { useAsTitle: 'name', group: 'Заявки', defaultColumns: ['name', 'company', 'role', 'email', 'submittedAt'] },
  access: inboxAccess,
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    { name: 'company', type: 'text', label: 'Компания', required: true },
    { name: 'role', type: 'text', label: 'Роль' },
    { name: 'email', type: 'email', label: 'Почта', required: true },
    { name: 'phone', type: 'text', label: 'Телефон' },
    ...meta,
  ],
}

export const AwardApplications: CollectionConfig = {
  slug: 'award-applications',
  labels: { singular: 'Заявка на премию', plural: 'Заявки — Премия' },
  admin: { useAsTitle: 'name', group: 'Заявки', defaultColumns: ['name', 'org', 'track', 'nomination', 'submittedAt'] },
  access: inboxAccess,
  fields: [
    { name: 'name', type: 'text', label: 'Имя и фамилия', required: true },
    { name: 'org', type: 'text', label: 'Компания / учебное заведение', required: true },
    { name: 'track', type: 'text', label: 'Куда подаёт' },
    { name: 'nomination', type: 'text', label: 'Номинация' },
    { name: 'email', type: 'email', label: 'Почта', required: true },
    { name: 'phone', type: 'text', label: 'Телефон' },
    { name: 'url', type: 'text', label: 'Ссылка на проект' },
    { name: 'desc', type: 'textarea', label: 'Описание проекта' },
    ...meta,
  ],
}
