import type { PageContent } from './types'
import { text } from './fields'

/** Общее для всех страниц: меню, подвал, контакты, подписи форм. */
export const COMMON: PageContent = {
  slug: 'page-common',
  label: 'Общее — меню, подвал, формы',
  desc: 'Меняется сразу на всех страницах. Язык — переключатель локали вверху справа. Пустое поле = остаётся текст, который стоит на сайте сейчас.',
  sections: [
    {
      name: 'nav',
      label: 'Меню',
      fields: [
        text('community', 'Сообщество', 'cNavCommunity'),
        text('forum', 'Форум', 'cNavForum'),
        text('award', 'Премия и конкурсы', 'cNavAward'),
        text('contacts', 'Контакты', 'cNavContacts'),
        text('menu', 'Кнопка «Меню» на телефоне', 'cMenu'),
        text('close', 'Кнопка «Закрыть» на телефоне', 'cClose'),
      ],
    },
    {
      name: 'contacts',
      label: 'Контакты',
      desc: 'Подвал всех страниц.',
      fields: [
        text('email1', 'Почта — первая', 'cEmail1'),
        text('email2', 'Почта — вторая', 'cEmail2'),
        text('phone1', 'Телефон 1', 'cPhone1'),
        text('phone1Label', 'Телефон 1 — подпись', 'cPhone1Label'),
        text('phone2', 'Телефон 2', 'cPhone2'),
        text('phone2Label', 'Телефон 2 — подпись', 'cPhone2Label'),
        {
          kind: 'text',
          name: 'instagram',
          label: 'Instagram — ссылка',
          key: 'cInstagram',
          desc: 'Полный адрес, https://… Пустое поле — иконки нет.',
        },
        { kind: 'text', name: 'facebook', label: 'Facebook — ссылка', key: 'cFacebook', desc: 'Пустое поле — иконки нет.' },
        { kind: 'text', name: 'linkedin', label: 'LinkedIn — ссылка', key: 'cLinkedin', desc: 'Пустое поле — иконки нет.' },
      ],
    },
    {
      name: 'footer',
      label: 'Подвал',
      fields: [
        text('tagline', 'Слоган под логотипом', 'cTagline'),
        text('emailLabel', 'Заголовок «Почта»', 'cEmailLabel'),
        text('phoneLabel', 'Заголовок «Телефон»', 'cPhoneLabel'),
        text('founders', 'Заголовок «Основатели»', 'cFounders'),
        text('privacy', 'Ссылка на политику данных', 'cPrivacy'),
        text('copyright', 'Копирайт', 'cCopyright'),
      ],
    },
    {
      name: 'forms',
      label: 'Формы — общие подписи',
      fields: [
        text('sent', 'Заголовок после отправки', 'cSent'),
        text('fullName', 'Поле «Имя и фамилия»', 'cFullName'),
        text('companyName', 'Поле «Название компании»', 'cCompanyName'),
        text('contactPerson', 'Поле «Контактное лицо»', 'cContactPerson'),
        text('phone', 'Поле «Телефон»', 'cFieldPhone'),
        text('email', 'Поле «E-mail»', 'cFieldEmail'),
        text('partner', 'Переключатель «Партнёр»', 'cPartner'),
        text('send', 'Кнопка «Отправить заявку»', 'cSendApplication'),
        text('consent', 'Согласие — текст', 'cConsent'),
        text('consentLink', 'Согласие — ссылка на политику', 'cConsentLink'),
        text('sending', 'Кнопка во время отправки', 'cSending'),
        text('error', 'Сообщение об ошибке', 'cError', true),
      ],
    },
  ],
}
