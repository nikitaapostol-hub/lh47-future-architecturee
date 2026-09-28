/* «Настройки сайта» — всё служебное в одном месте:
   куда приходят заявки, SEO-заголовки и счётчики. */
import type { Field, GlobalConfig, Tab } from 'payload'
import { l3 } from '@/cms/build'
import { revalidateSite } from './pages'

const seoPage = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    l3('title', 'Заголовок в Google и соцсетях', { desc: 'До 60 знаков. Пусто — стоит заголовок по умолчанию.' }),
    l3('description', 'Описание в Google и соцсетях', { area: true, desc: 'До 160 знаков. Пусто — описание по умолчанию.' }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Картинка, когда ссылку отправляют в мессенджер (1200×630)',
      admin: { description: 'Пусто — стоит картинка по умолчанию.' },
    },
  ] as Field[],
})

const mail: Tab = {
  label: 'Заявки и почта',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'mailTo',
          type: 'text',
          label: 'Куда приходят заявки',
          defaultValue: 'marketing-team@lh47arch.com',
          admin: { width: '50%', description: 'Несколько адресов — через запятую.' },
        },
        {
          name: 'subjectPrefix',
          type: 'text',
          label: 'Начало темы письма',
          defaultValue: '[future-arch.md]',
          admin: { width: '50%', description: 'По нему удобно настроить фильтр в почте.' },
        },
      ],
    },
    {
      name: 'autoreply',
      type: 'checkbox',
      label: 'Отправлять человеку письмо «Заявка получена»',
      defaultValue: true,
    },
    {
      ...l3('autoreplySubject', 'Тема письма «Заявка получена»'),
      admin: { hideGutter: true, condition: (d: any) => d?.autoreply !== false },
    } as Field,
    {
      ...l3('autoreplyBody', 'Текст письма «Заявка получена»', { area: true }),
      admin: {
        hideGutter: true,
        condition: (d: any) => d?.autoreply !== false,
        description: 'Обычный текст. Абзацы — пустой строкой.',
      },
    } as Field,
  ],
}

const seo: Tab = {
  name: 'seo',
  label: 'SEO',
  description: 'Как страницы выглядят в поиске Google и в превью ссылки в мессенджерах.',
  fields: [seoPage('home', 'Главная'), seoPage('forum', 'Форум'), seoPage('award', 'Премия')],
}

const analytics: Tab = {
  label: 'Аналитика',
  description: 'Коды счётчиков. Пустое поле — берётся код из настроек Vercel (так сейчас подключены GTM и GA4), а если нет и там — скрипт не грузится.',
  fields: [
    { name: 'analyticsEnabled', type: 'checkbox', label: 'Счётчики включены', defaultValue: true },
    {
      type: 'row',
      fields: [
        { name: 'gtmId', type: 'text', label: 'Google Tag Manager', admin: { width: '50%', placeholder: 'GTM-XXXXXXX' } },
        { name: 'ga4Id', type: 'text', label: 'Google Analytics 4', admin: { width: '50%', placeholder: 'G-XXXXXXXXXX' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'yandexId', type: 'text', label: 'Яндекс.Метрика', admin: { width: '50%', placeholder: '00000000' } },
        { name: 'metaPixelId', type: 'text', label: 'Meta Pixel', admin: { width: '50%', placeholder: '000000000000000' } },
      ],
    },
    {
      name: 'searchConsoleToken',
      type: 'text',
      label: 'Google Search Console — код подтверждения',
      admin: { description: 'Только значение content из мета-тега.' },
    },
  ],
}

export const SiteSettings: GlobalConfig = {
  slug: 'settings',
  label: 'Настройки сайта',
  admin: {
    group: 'Настройки',
    hideAPIURL: true,
    description: 'Куда приходят заявки, SEO и счётчики.',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateSite] },
  fields: [{ type: 'tabs', tabs: [mail, seo, analytics] }],
}
