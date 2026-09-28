import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { hideAPIURL: true, useAsTitle: 'email', group: 'Файлы и доступ' },
  auth: true,
  labels: { singular: 'Пользователь', plural: 'Кто может входить в админку' },
  fields: [
    { name: 'name', type: 'text', label: 'Имя' },
  ],
}
