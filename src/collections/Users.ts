import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', group: 'Система' },
  auth: true,
  labels: { singular: 'Пользователь', plural: 'Пользователи' },
  fields: [
    { name: 'name', type: 'text', label: 'Имя' },
  ],
}
