import type { Field, GlobalConfig, Tab } from 'payload'

const page = (name: string, label: string, hint: string): Tab => ({
  label,
  description: hint,
  fields: [
    {
      name: name + 'Title',
      type: 'text' as const,
      label: 'Title — заголовок в выдаче',
      localized: true,
      admin: { description: 'До 60 знаков. Пусто — берётся заголовок по умолчанию.' },
    },
    {
      name: name + 'Description',
      type: 'textarea' as const,
      label: 'Description — описание в выдаче',
      localized: true,
      admin: { description: 'До 160 знаков. Одно предложение с пользой и конкретикой.' },
    },
    {
      name: name + 'Image',
      type: 'upload' as const,
      relationTo: 'media' as const,
      label: 'Картинка для соцсетей (1200×630)',
      admin: { description: 'Что видно, когда ссылку кидают в чат. Пусто — общая og.png.' },
    },
  ] as Field[],
})

export const Seo: GlobalConfig = {
  slug: 'seo',
  label: 'SEO — заголовки и описания',
  admin: {
    group: 'Настройки',
    description:
      'Title и description для поиска и соцсетей. Пустые поля — остаются значения по умолчанию, зашитые в коде.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        page('home', 'Главная', 'future-arch.md'),
        page('forum', 'Форум', 'future-arch.md/forum'),
        page('award', 'Премия', 'future-arch.md/award'),
      ],
    },
  ],
}
