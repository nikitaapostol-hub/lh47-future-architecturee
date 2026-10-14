import type { PageContent } from './types'
import { list, text } from './fields'

/** Главная — сообщество. Порядок секций = порядок на странице. */
export const HOME: PageContent = {
  slug: 'home',
  label: 'Главная — тексты',
  desc: 'Страница future-arch.md. Пустое поле = остаётся текст, который стоит на сайте сейчас.',
  sections: [
    {
      name: 'hero',
      label: '00 · Первый экран',
      fields: [
        text('eyebrow', 'Строка над заголовком', 'hEyebrow'),
        text('place', 'Город и год', 'hPlace'),
        text('lead', 'Текст под заголовком', 'hLead', true),
        text('beResident', 'Кнопка «Стать резидентом»', 'hBeResident'),
        text('bePartner', 'Кнопка «Стать партнёром»', 'hBePartner'),
        text('word1', 'Слово внизу 1', 'hWord1'),
        text('word2', 'Слово внизу 2', 'hWord2'),
        text('word3', 'Слово внизу 3', 'hWord3'),
        text('cta', 'Кнопка в шапке', 'hCta'),
        text('ctaMenu', 'Кнопка в мобильном меню', 'hCtaMenu'),
      ],
    },
    {
      name: 'mission',
      label: '01 · Миссия',
      fields: [
        text('title', 'Заголовок', 'hMissionTitle'),
        text('text', 'Текст', 'hMissionText', true),
      ],
    },
    {
      name: 'who',
      label: '02 · Кто внутри',
      fields: [
        text('title', 'Заголовок', 'hWhoTitle'),
        text('note', 'Подпись справа', 'hWhoNote'),
        text('benefitsLabel', 'Подзаголовок списка в карточках', 'hBenefitsLabel'),
        text('residents', 'Резиденты — метка', 'hResidents'),
        text('residentsTitle', 'Резиденты — заголовок', 'hResidentsTitle'),
        text('residentsText', 'Резиденты — короткий текст', 'hResidentsText', true),
        list('residentsBenefits', 'Резиденты — что даёт сообщество', 'Пункт', [{ name: 'title', label: 'Название' }, { name: 'text', label: 'Описание', area: true }], [
          { title: 'hRBen1', text: 'hRBen1Text' },
          { title: 'hRBen2', text: 'hRBen2Text' },
          { title: 'hRBen3', text: 'hRBen3Text' },
        ]),
        text('residentsLink', 'Резиденты — ссылка', 'hBeResidentArrow'),
        text('partners', 'Партнёры — метка', 'hPartners'),
        text('partnersTitle', 'Партнёры — заголовок', 'hPartnersTitle'),
        text('partnersText', 'Партнёры — короткий текст', 'hPartnersText', true),
        list('partnersBenefits', 'Партнёры — что даёт сообщество', 'Пункт', [{ name: 'title', label: 'Название' }, { name: 'text', label: 'Описание', area: true }], [
          { title: 'hPBen1', text: 'hPBen1Text' },
          { title: 'hPBen2', text: 'hPBen2Text' },
          { title: 'hPBen3', text: 'hPBen3Text' },
        ]),
        text('partnersLink', 'Партнёры — ссылка', 'hBePartnerArrow'),
      ],
    },
    {
      name: 'formats',
      label: '03 · Форматы',
      fields: [
        text('title', 'Заголовок', 'hFormatsTitle'),
        list('items', 'Форматы', 'Формат', [{ name: 'title', label: 'Название' }, { name: 'text', label: 'Описание' }], [
          { title: 'hFormat1', text: 'hFormat1Text' },
          { title: 'hFormat2', text: 'hFormat2Text' },
          { title: 'hFormat3', text: 'hFormat3Text' },
          { title: 'hFormat4', text: 'hFormat4Text' },
          { title: 'hFormat5', text: 'hFormat5Text' },
          { title: 'hFormat6', text: 'hFormat6Text' },
          { title: 'hFormat7', text: 'hFormat7Text' },
          { title: 'hFormat8', text: 'hFormat8Text' },
          { title: 'hFormat9', text: 'hFormat9Text' },
        ]),
      ],
    },
    {
      name: 'join',
      label: '04 · Вступление и форма',
      fields: [
        text('title', 'Заголовок', 'hJoinTitle'),
        text('text', 'Текст', 'hJoinText', true),
        text('resident', 'Переключатель «Резидент»', 'hResident'),
        text('partnersShort', 'Партнёры — кратко', 'hPartnersShort'),
        text('empQuestion', 'Вопрос о месте работы', 'hEmpQuestion'),
        text('empSelf', 'Ответ «на себя»', 'hEmpSelf'),
        text('empCompany', 'Ответ «в компании»', 'hEmpCompany'),
        text('whichCompany', 'Поле «В какой компании»', 'hWhichCompany'),
        text('studioName', 'Поле «Название студии»', 'hStudioName'),
        text('optional', 'Подсказка «Необязательно»', 'hOptional'),
        text('profession', 'Поле «Профессия»', 'hProfession'),
        text('professionPh', 'Подсказка в поле «Профессия»', 'hProfessionPh'),
        text('field', 'Поле «Направление деятельности»', 'hField'),
        text('site', 'Поле «Сайт»', 'hSite'),
        text('sendPartner', 'Кнопка для партнёра', 'hSendPartner'),
        text('sentText', 'Текст после отправки', 'hSentText', true),
      ],
    },
  ],
}
