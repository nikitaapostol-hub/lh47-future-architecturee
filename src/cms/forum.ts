import type { PageContent } from './types'
import { list, text } from './fields'

/** Страница форума. Дата, таймер и спикеры — в «Настройки → Форум». */
export const FORUM: PageContent = {
  slug: 'page-forum',
  label: 'Форум — тексты',
  desc: 'Страница future-arch.md/forum. Дата, таймер и спикеры — в разделе «Настройки → Форум». Пустое поле = остаётся текст, который стоит на сайте сейчас.',
  sections: [
    {
      name: 'hero',
      label: '00 · Первый экран',
      fields: [
        text('datePlace', 'Дата и место (строка сверху)', 'fDatePlace'),
        text('selection', 'Условие участия', 'fSelection'),
        text('lead', 'Подзаголовок', 'fLead', true),
        text('text', 'Текст', 'fText', true),
        text('cta', 'Кнопка «Подать заявку»', 'fCta'),
        text('ctaMenu', 'Кнопка в мобильном меню', 'fCtaMenu'),
        text('partnerOffer', 'Кнопка для партнёров', 'fPartnerOffer'),
        text('days', 'Таймер — дней', 'fDays'),
        text('hours', 'Таймер — часов', 'fHours'),
        text('minutes', 'Таймер — минут', 'fMinutes'),
        text('seconds', 'Таймер — секунд', 'fSeconds'),
        text('alt', 'Описание иллюстрации (alt)', 'fHeroAlt'),
      ],
    },
    {
      name: 'chain',
      label: '01 · Цепочка стоимости',
      fields: [
        text('label', 'Надзаголовок', 'fChainLabel'),
        text('title', 'Заголовок', 'fChainTitle'),
        text('text', 'Текст', 'fChainText', true),
        list('stages', 'Звенья', 'Звено', [{ name: 'title', label: 'Название' }], [
          { title: 'fChain1' },
          { title: 'fChain2' },
          { title: 'fChain3' },
          { title: 'fChain4' },
          { title: 'fChain5' },
          { title: 'fChain6' },
        ]),
      ],
    },
    {
      name: 'count',
      label: '02 · 250+',
      fields: [
        text('number', 'Число', 'fCount'),
        text('text', 'Подпись', 'fCountText'),
        text('alt', 'Описание фото (alt)', 'fPhotoAlt'),
      ],
    },
    {
      name: 'topics',
      label: '03 · Темы форума',
      fields: [
        text('title', 'Заголовок', 'fTopicsTitle'),
        list(
          'items',
          'Темы',
          'Тема',
          [
            { name: 'tag', label: 'Метка (alt картинки)' },
            { name: 'title', label: 'Заголовок', area: true },
            { name: 'text', label: 'Описание', area: true },
          ],
          [
            { tag: 'fTopic1Tag', title: 'fTopic1', text: 'fTopic1Text' },
            { tag: 'fTopic2Tag', title: 'fTopic2', text: 'fTopic2Text' },
            { tag: 'fTopic3Tag', title: 'fTopic3', text: 'fTopic3Text' },
            { tag: 'fTopic4Tag', title: 'fTopic4', text: 'fTopic4Text' },
          ],
        ),
        text('speakers', 'Заголовок «Спикеры»', 'fSpeakers'),
      ],
    },
    {
      name: 'program',
      label: '04 · Программа дня',
      fields: [
        text('title1', 'Заголовок — строка 1', 'fProgram1'),
        text('title2', 'Заголовок — строка 2', 'fProgram2'),
        list('items', 'Пункты программы', 'Пункт', [{ name: 'title', label: 'Название' }], [
          { title: 'fProg1' },
          { title: 'fProg2' },
          { title: 'fProg3' },
          { title: 'fProg4' },
          { title: 'fProg5' },
          { title: 'fProg6' },
          { title: 'fProg7' },
          { title: 'fProg8' },
        ]),
        text('alt', 'Описание фото (alt)', 'fProgramAlt'),
      ],
    },
    {
      name: 'partners',
      label: '05 · Партнёрам',
      fields: [
        text('label', 'Надзаголовок', 'fPartnersLabel'),
        text('title', 'Заголовок', 'fPartnersTitle'),
        text('text', 'Текст', 'fPartnersText', true),
        text('benefit1', 'Преимущество 1', 'fBenefit1'),
        text('benefit2', 'Преимущество 2', 'fBenefit2'),
        text('before', 'Метка «До»', 'fBefore'),
        text('during', 'Метка «Во время»', 'fDuring'),
        text('after', 'Метка «После»', 'fAfter'),
        text('cta', 'Кнопка', 'fGetOffer'),
        text('alt', 'Описание иллюстрации (alt)', 'fFacadeAlt'),
      ],
    },
    {
      name: 'apply',
      label: '06 · Заявка',
      fields: [
        text('title', 'Заголовок', 'fApplyTitle'),
        text('date', 'Дата', 'fApplyDate'),
        text('place', 'Место', 'fApplyPlace'),
        text('guest', 'Переключатель «Участник»', 'fGuest'),
        text('companyRole', 'Поле «Компания и должность»', 'fCompanyRole'),
        text('sentText', 'Текст после отправки', 'fSentText', true),
      ],
    },
  ],
}
