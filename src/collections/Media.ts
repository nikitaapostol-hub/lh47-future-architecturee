import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Система' },
  labels: { singular: 'Файл', plural: 'Медиа' },
  access: { read: () => true },
  upload: { staticDir: 'media' },
  fields: [
    { name: 'alt', type: 'text', label: 'Альт-текст' },
  ],
}
