import type { GlobalConfig } from 'payload'

/** Куда уходят заявки с форм и что видит человек в ответном письме. */
export const Mail: GlobalConfig = {
  slug: 'mail',
  label: 'Заявки — уведомления',
  admin: {
    group: 'Настройки',
    description:
      'Каждая отправленная форма сохраняется в разделе «Заявки» и дублируется письмом. Даже если почта не отправится, заявка не потеряется.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'to',
      type: 'text',
      label: 'Кому приходят заявки',
      defaultValue: 'marketing-team@lh47arch.com',
      required: true,
      admin: { description: 'Несколько адресов — через запятую.' },
    },
    {
      name: 'subjectPrefix',
      type: 'text',
      label: 'Префикс темы письма',
      defaultValue: '[future-arch.md]',
      admin: { description: 'По нему удобно ставить фильтр в почте.' },
    },
    {
      name: 'autoreply',
      type: 'checkbox',
      label: 'Отправлять автоответ заявителю',
      defaultValue: true,
    },
    {
      name: 'autoreplySubject',
      type: 'text',
      label: 'Автоответ — тема',
      localized: true,
      defaultValue: 'Заявка получена — Future Architecture',
      admin: { condition: (d) => d?.autoreply !== false },
    },
    {
      name: 'autoreplyBody',
      type: 'textarea',
      label: 'Автоответ — текст',
      localized: true,
      defaultValue:
        'Здравствуйте!\n\nМы получили вашу заявку и вернёмся с ответом на этот адрес.\n\nFuture Architecture — сообщество архитекторов и дизайнеров Молдовы.\nfuture-arch.md',
      admin: {
        condition: (d) => d?.autoreply !== false,
        description: 'Обычный текст. Абзацы — пустой строкой.',
      },
    },
  ],
}
