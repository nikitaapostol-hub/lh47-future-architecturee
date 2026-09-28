import type { CollectionConfig } from 'payload'

/** Фото спикеров и картинки для соцсетей. На сайте они хранятся в Vercel Blob
    (хранилище arch-makers-media, см. payload.config.ts). */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { hideAPIURL: true, group: 'Файлы и доступ', defaultColumns: ['filename', 'alt', 'updatedAt'] },
  labels: { singular: 'Фото', plural: 'Фото и картинки' },
  access: { read: () => true },
  upload: { staticDir: 'media', mimeTypes: ['image/*'] },
  fields: [{ name: 'alt', type: 'text', label: 'Что на картинке (для слабовидящих и Google)' }],
}
