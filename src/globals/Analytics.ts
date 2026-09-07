import type { GlobalConfig } from 'payload'

/** Счётчики и подтверждение прав на сайт. Значения можно задать здесь
    или переменными окружения — поле в админке имеет приоритет. */
export const Analytics: GlobalConfig = {
  slug: 'analytics',
  label: 'Аналитика и счётчики',
  admin: {
    group: 'Настройки',
    description:
      'Идентификаторы вставляются в код всех страниц. Скрипты не грузятся, пока поле пустое, — сайт не тормозит зря.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Включить счётчики',
      defaultValue: true,
      admin: { description: 'Снимите галочку, чтобы временно отключить всю аналитику.' },
    },
    {
      name: 'gtmId',
      type: 'text',
      label: 'Google Tag Manager',
      admin: {
        placeholder: 'GTM-XXXXXXX',
        description:
          'Контейнер GTM. Если он заполнен, GA4 удобнее подключать внутри GTM, а поле ниже оставить пустым.',
      },
    },
    {
      name: 'ga4Id',
      type: 'text',
      label: 'Google Analytics 4',
      admin: {
        placeholder: 'G-XXXXXXXXXX',
        description: 'Прямое подключение gtag.js — если GTM не используется.',
      },
    },
    {
      name: 'searchConsoleToken',
      type: 'text',
      label: 'Google Search Console — код подтверждения',
      admin: {
        placeholder: 'google-site-verification токен',
        description:
          'Только значение content из мета-тега, без самого тега. Нужно один раз, чтобы подтвердить права на сайт.',
      },
    },
    {
      name: 'yandexId',
      type: 'text',
      label: 'Яндекс.Метрика',
      admin: { placeholder: '00000000', description: 'Необязательно.' },
    },
    {
      name: 'metaPixelId',
      type: 'text',
      label: 'Meta Pixel',
      admin: { placeholder: '000000000000000', description: 'Необязательно — для рекламы в Instagram и Facebook.' },
    },
  ],
}
