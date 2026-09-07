import type { PageContent } from './types'

/** Тексты, общие для всех страниц: меню, контакты, подвал, полоса сверху. */
export const COMMON: PageContent = {
  slug: 'content-common',
  label: 'Общее — меню, контакты, подвал',
  desc: 'Меняется сразу на всех страницах и во всех языках (переключатель локали — вверху справа).',
  sections: [
    {
      name: 'nav',
      label: 'Меню',
      desc: 'Пункты верхнего меню и подписи кнопок. Набор пунктов на разных страницах разный — здесь только их названия.',
      fields: [
        { kind: 'text', name: 'navPosition', label: 'Позиция', key: 'k7' },
        { kind: 'text', name: 'navFormats', label: 'Форматы', key: 'k8' },
        { kind: 'text', name: 'navForum', label: 'Форум', key: 'k9' },
        { kind: 'text', name: 'navAward', label: 'Премия', key: 'k10' },
        { kind: 'text', name: 'navParticipation', label: 'Участие', key: 'k11' },
        { kind: 'text', name: 'navContacts', label: 'Контакты', key: 'k12' },
        { kind: 'text', name: 'navCommunity', label: 'Сообщество', key: 'k35' },
        { kind: 'text', name: 'navProgram', label: 'Программа', key: 'k129' },
        { kind: 'text', name: 'navApplication', label: 'Заявка', key: 'k130' },
        { kind: 'text', name: 'ctaJoin', label: 'Кнопка «Вступить»', key: 'k14' },
        { kind: 'text', name: 'ctaApply', label: 'Кнопка «Подать заявку»', key: 'k38' },
        { kind: 'text', name: 'ctaAbout', label: 'Ссылка «О сообществе»', key: 'k243' },
        { kind: 'text', name: 'scrollHint', label: 'Подсказка «листайте»', key: 'k42' },
      ],
    },
    {
      name: 'notice',
      label: 'Полоса над шапкой',
      desc: 'Узкая строка над меню. Ведёт на форму заявки на премию. Закрывается пользователем на время сессии.',
      fields: [
        { kind: 'text', name: 'noticeTitle', label: 'Текст', key: 'noticeTitle' },
        { kind: 'text', name: 'noticeCta', label: 'Кнопка', key: 'noticeCta' },
      ],
    },
    {
      name: 'contacts',
      label: 'Контакты',
      desc: 'Показываются в подвале всех страниц.',
      fields: [
        { kind: 'text', name: 'email1', label: 'Почта — основная', key: 'k457' },
        { kind: 'text', name: 'email2', label: 'Почта — вторая', key: 'k458' },
        { kind: 'text', name: 'phone1', label: 'Телефон 1', key: 'k459' },
        { kind: 'text', name: 'phone1Label', label: 'Телефон 1 — подпись', key: 'k460' },
        { kind: 'text', name: 'phone2', label: 'Телефон 2', key: 'k461' },
        { kind: 'text', name: 'phone2Label', label: 'Телефон 2 — подпись', key: 'k462' },
        { kind: 'text', name: 'social1', label: 'Соцсеть 1', key: 'k463' },
        { kind: 'text', name: 'social2', label: 'Соцсеть 2', key: 'k464' },
        { kind: 'text', name: 'social3', label: 'Соцсеть 3', key: 'k465' },
      ],
    },
    {
      name: 'footer',
      label: 'Подвал',
      fields: [
        { kind: 'text', name: 'taglineHome', label: 'Описание в подвале — главная', key: 'k456', area: true },
        { kind: 'text', name: 'taglineInner', label: 'Описание в подвале — форум и премия', key: 'k251', area: true },
        { kind: 'text', name: 'partners', label: 'Заголовок «Партнёры»', key: 'k126' },
        { kind: 'text', name: 'privacy', label: 'Ссылка на политику данных', key: 'k127' },
        { kind: 'text', name: 'copyright', label: 'Копирайт', key: 'k466' },
      ],
    },
  ],
}
