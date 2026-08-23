/* Политика обработки персональных данных.
   Текст лежит здесь, а не в общем словаре: это юридический документ,
   его правят целиком и отдельно от интерфейсных строк. */
import type { CSSProperties } from 'react'
import { path as langPath } from '@/i18n/links'
import type { Lang } from '@/i18n/links'

const MONO = "'JetBrains Mono',ui-monospace,monospace"
const SANS = 'Montserrat,Manrope,sans-serif'

/** Реквизиты оператора. Заполнить юридические данные до публикации ссылки в формах. */
export const OPERATOR = {
  brand: 'Future Architecture',
  founder: 'LH47 ARCH',
  email: 'marketing@lh47arch.com',
  phone: '(+373) 68 059 311',
  city: 'Chișinău',
  /** ЮРЛИЦО: полное наименование, IDNO и юридический адрес — от заказчика. */
  legalEntity: '',
  idno: '',
  address: '',
  updated: '2026-08-23',
}

type Block = { h: string; p?: string[]; list?: string[] }
type Copy = {
  kicker: string
  title: string
  lead: string
  updated: string
  back: string
  blocks: Block[]
  contactsH: string
}

const COPY: Record<Lang, Copy> = {
  ru: {
    kicker: 'Правовая информация',
    title: 'Политика обработки персональных данных',
    lead: 'Документ объясняет, какие данные собирает сайт future-arch.md, зачем они нужны, сколько хранятся и как их удалить.',
    updated: 'Редакция от',
    back: 'На главную',
    contactsH: 'Как связаться и отозвать согласие',
    blocks: [
      {
        h: 'Кто обрабатывает данные',
        p: [
          'Оператор — архитектурное бюро LH47 ARCH, организатор профессионального сообщества Future Architecture, город Кишинёв, Республика Молдова.',
          'Вопросы по обработке данных: marketing@lh47arch.com.',
        ],
      },
      {
        h: 'Какие данные мы собираем',
        p: ['Сайт не требует регистрации. Данные попадают к нам только когда вы сами заполняете одну из форм заявки.'],
        list: [
          'Заявка в сообщество: имя, компания, должность или позиция, e-mail, телефон.',
          'Заявка на форум: имя, компания, позиция, тип обращения, e-mail, телефон.',
          'Заявка на премию: имя, организация, трек и номинация, e-mail, телефон, ссылка на проект, описание проекта.',
          'Технические данные, которые браузер передаёт любому сайту: IP-адрес, тип устройства и браузера, время запроса. Они нужны хостингу для защиты от атак и для работы сайта.',
        ],
      },
      {
        h: 'Зачем мы их используем',
        list: [
          'Рассмотреть вашу заявку и ответить на неё.',
          'Связаться по поводу участия в сообществе, форуме или премии.',
          'Подтвердить участие и прислать организационные детали мероприятия.',
          'Вести внутренний учёт заявок.',
        ],
        p: ['Мы не используем эти данные для рассылок, не связанных с вашей заявкой, и не строим на их основе рекламные профили.'],
      },
      {
        h: 'На каком основании',
        p: [
          'Отправляя форму, вы даёте согласие на обработку указанных в ней данных. Согласие добровольное: без него мы не сможем рассмотреть заявку, но никакие другие разделы сайта от этого не закрываются.',
          'Обработка ведётся в соответствии с законодательством Республики Молдова о защите персональных данных.',
        ],
      },
      {
        h: 'Кому мы их передаём',
        p: ['Мы не продаём данные и не передаём их третьим лицам для их собственных целей. Доступ к заявкам имеют только сотрудники организаторов, которым он нужен по работе.'],
        list: [
          'Хостинг и доставка сайта — Vercel Inc.',
          'База данных заявок — Neon Inc.',
          'Рабочая почта организаторов — Google Workspace.',
        ],
      },
      {
        h: 'Сколько храним',
        p: [
          'Заявки храним, пока идёт работа по соответствующему направлению, и до трёх лет после завершения мероприятия — чтобы вести историю участия и не запрашивать одно и то же повторно.',
          'По вашему требованию удаляем раньше.',
        ],
      },
      {
        h: 'Ваши права',
        list: [
          'Узнать, какие ваши данные у нас есть.',
          'Исправить неточные данные.',
          'Удалить данные или ограничить их обработку.',
          'Отозвать согласие в любой момент.',
          'Подать жалобу в надзорный орган по защите персональных данных Республики Молдова.',
        ],
      },
      {
        h: 'Файлы cookie',
        p: [
          'Рекламных и аналитических трекеров сторонних сетей на сайте нет. Браузер сохраняет одну техническую отметку в памяти вкладки — чтобы заставка не повторялась при переходе между страницами. Она исчезает вместе с закрытием вкладки и никуда не передаётся.',
        ],
      },
      {
        h: 'Изменения',
        p: ['Если документ поменяется, обновлённая редакция появится на этой странице с новой датой. Существенные изменения мы сообщим отдельно тем, чьи заявки в работе.'],
      },
    ],
  },
  ro: {
    kicker: 'Informații juridice',
    title: 'Politica de prelucrare a datelor cu caracter personal',
    lead: 'Documentul explică ce date colectează site-ul future-arch.md, de ce sunt necesare, cât timp se păstrează și cum pot fi șterse.',
    updated: 'Ediția din',
    back: 'Pagina principală',
    contactsH: 'Cum ne contactați și cum retrageți consimțământul',
    blocks: [
      {
        h: 'Cine prelucrează datele',
        p: [
          'Operator — biroul de arhitectură LH47 ARCH, organizatorul comunității profesionale Future Architecture, Chișinău, Republica Moldova.',
          'Întrebări privind prelucrarea datelor: marketing@lh47arch.com.',
        ],
      },
      {
        h: 'Ce date colectăm',
        p: ['Site-ul nu necesită înregistrare. Datele ajung la noi doar când completați personal unul dintre formulare.'],
        list: [
          'Cerere de aderare: nume, companie, funcție sau poziție, e-mail, telefon.',
          'Cerere pentru forum: nume, companie, poziție, tipul solicitării, e-mail, telefon.',
          'Cerere pentru premiu: nume, organizație, secțiune și nominalizare, e-mail, telefon, link către proiect, descrierea proiectului.',
          'Date tehnice pe care browserul le transmite oricărui site: adresa IP, tipul dispozitivului și al browserului, ora solicitării. Sunt necesare găzduirii pentru protecție și pentru funcționarea site-ului.',
        ],
      },
      {
        h: 'De ce le folosim',
        list: [
          'Pentru a examina cererea și a vă răspunde.',
          'Pentru a vă contacta privind participarea în comunitate, la forum sau la premiu.',
          'Pentru a confirma participarea și a trimite detaliile organizatorice.',
          'Pentru evidența internă a cererilor.',
        ],
        p: ['Nu folosim aceste date pentru comunicări fără legătură cu cererea dumneavoastră și nu construim profiluri publicitare.'],
      },
      {
        h: 'Temeiul juridic',
        p: [
          'Prin trimiterea formularului vă exprimați consimțământul pentru prelucrarea datelor indicate în el. Consimțământul este voluntar: fără el nu putem examina cererea, dar restul site-ului rămâne accesibil.',
          'Prelucrarea se face în conformitate cu legislația Republicii Moldova privind protecția datelor cu caracter personal.',
        ],
      },
      {
        h: 'Cui le transmitem',
        p: ['Nu vindem datele și nu le transmitem terților pentru scopurile lor proprii. Acces la cereri au doar angajații organizatorilor care au nevoie de el pentru muncă.'],
        list: [
          'Găzduire și livrarea site-ului — Vercel Inc.',
          'Baza de date a cererilor — Neon Inc.',
          'Poșta de lucru a organizatorilor — Google Workspace.',
        ],
      },
      {
        h: 'Cât timp păstrăm',
        p: [
          'Păstrăm cererile pe durata activității pe direcția respectivă și până la trei ani după încheierea evenimentului — pentru istoricul participării și pentru a nu solicita din nou aceleași informații.',
          'La cererea dumneavoastră ștergem mai devreme.',
        ],
      },
      {
        h: 'Drepturile dumneavoastră',
        list: [
          'Să aflați ce date deținem despre dumneavoastră.',
          'Să corectați datele inexacte.',
          'Să ștergeți datele sau să limitați prelucrarea lor.',
          'Să retrageți consimțământul în orice moment.',
          'Să depuneți o plângere la autoritatea de supraveghere pentru protecția datelor din Republica Moldova.',
        ],
      },
      {
        h: 'Cookie-uri',
        p: [
          'Site-ul nu are trackere publicitare sau de analiză ale rețelelor terțe. Browserul păstrează o singură marcă tehnică în memoria filei — pentru ca ecranul de întâmpinare să nu se repete la navigarea între pagini. Aceasta dispare odată cu închiderea filei și nu se transmite nicăieri.',
        ],
      },
      {
        h: 'Modificări',
        p: ['Dacă documentul se schimbă, ediția actualizată apare pe această pagină cu o dată nouă. Modificările esențiale le comunicăm separat celor ale căror cereri sunt în lucru.'],
      },
    ],
  },
  en: {
    kicker: 'Legal information',
    title: 'Personal data processing policy',
    lead: 'This document explains what data future-arch.md collects, why it is needed, how long it is kept and how to have it deleted.',
    updated: 'Version of',
    back: 'Home',
    contactsH: 'How to reach us and withdraw consent',
    blocks: [
      {
        h: 'Who processes the data',
        p: [
          'The operator is LH47 ARCH architecture bureau, organiser of the Future Architecture professional community, Chișinău, Republic of Moldova.',
          'Questions about data processing: marketing@lh47arch.com.',
        ],
      },
      {
        h: 'What we collect',
        p: ['The site requires no registration. Data reaches us only when you fill in one of the application forms yourself.'],
        list: [
          'Community application: name, company, role or position, e-mail, phone.',
          'Forum application: name, company, position, type of request, e-mail, phone.',
          'Award application: name, organisation, track and category, e-mail, phone, project link, project description.',
          'Technical data any browser sends to any website: IP address, device and browser type, request time. The hosting provider needs these to keep the site running and protected.',
        ],
      },
      {
        h: 'Why we use it',
        list: [
          'To review your application and reply to it.',
          'To contact you about taking part in the community, the forum or the award.',
          'To confirm participation and send event details.',
          'To keep an internal record of applications.',
        ],
        p: ['We do not use this data for mailings unrelated to your application and do not build advertising profiles from it.'],
      },
      {
        h: 'Legal basis',
        p: [
          'By submitting a form you consent to the processing of the data it contains. Consent is voluntary: without it we cannot review the application, but no other part of the site becomes unavailable.',
          'Processing follows the personal data protection legislation of the Republic of Moldova.',
        ],
      },
      {
        h: 'Who we share it with',
        p: ['We do not sell data and do not pass it to third parties for their own purposes. Only staff of the organisers who need it for their work have access to applications.'],
        list: [
          'Hosting and site delivery — Vercel Inc.',
          'Application database — Neon Inc.',
          'Organisers’ work email — Google Workspace.',
        ],
      },
      {
        h: 'How long we keep it',
        p: [
          'We keep applications while work on the relevant track is ongoing, and for up to three years after the event — to maintain a participation history and avoid asking for the same information twice.',
          'On your request we delete it sooner.',
        ],
      },
      {
        h: 'Your rights',
        list: [
          'Find out what data we hold about you.',
          'Correct inaccurate data.',
          'Delete the data or restrict its processing.',
          'Withdraw consent at any time.',
          'Lodge a complaint with the data protection supervisory authority of the Republic of Moldova.',
        ],
      },
      {
        h: 'Cookies',
        p: [
          'There are no third-party advertising or analytics trackers on the site. The browser stores one technical flag in tab memory so the intro screen does not repeat when moving between pages. It disappears when the tab is closed and is never transmitted anywhere.',
        ],
      },
      {
        h: 'Changes',
        p: ['If the document changes, an updated version appears on this page with a new date. We notify people with applications in progress about material changes separately.'],
      },
    ],
  },
}

export default function PrivacyPage({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  const lp = (p: string) => langPath(lang, p)

  return (
    <div style={{ background: '#F7F6F3', color: '#16181D', overflowX: 'hidden' } as CSSProperties}>
      <header
        style={{
          borderBottom: '1px solid #DCDAD4',
          background: '#F7F6F3',
        } as CSSProperties}
      >
        <div
          style={{
            maxWidth: '1720px',
            margin: '0 auto',
            padding: '20px clamp(20px,4.8vw,108px)',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          } as CSSProperties}
        >
          <a href={lp('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#16181D' } as CSSProperties}>
            <img src="/img/5dd2fe9c60.png" alt="" style={{ height: '30px', width: 'auto', display: 'block' } as CSSProperties} />
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: '13px', letterSpacing: '.14em', textTransform: 'uppercase', whiteSpace: 'nowrap' } as CSSProperties}>
              {OPERATOR.brand}
            </span>
          </a>
          <a
            className="fa-404-link"
            href={lp('/')}
            style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: '#6E7278', textDecoration: 'none' } as CSSProperties}
          >
            {c.back} →
          </a>
        </div>
      </header>

      <main
        style={{
          maxWidth: '1720px',
          margin: '0 auto',
          padding: 'clamp(48px,7vw,110px) clamp(20px,4.8vw,108px) clamp(60px,8vw,130px)',
        } as CSSProperties}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: MONO, fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: '#FF4002' } as CSSProperties}>
          <span aria-hidden="true" style={{ width: '32px', height: '2px', background: '#FF4002' } as CSSProperties} />
          {c.kicker}
        </div>

        <h1
          style={{
            margin: 'clamp(18px,2.4vw,32px) 0 0',
            maxWidth: '20ch',
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 'clamp(30px,4.6vw,68px)',
            lineHeight: '1.02',
            letterSpacing: '-.035em',
            textTransform: 'uppercase',
          } as CSSProperties}
        >
          {c.title}
        </h1>

        <p style={{ margin: 'clamp(20px,2.4vw,32px) 0 0', maxWidth: '62ch', fontSize: '18px', lineHeight: '1.6', color: '#5C5F66' } as CSSProperties}>
          {c.lead}
        </p>

        <p style={{ margin: '20px 0 0', fontFamily: MONO, fontSize: '12px', letterSpacing: '.06em', color: '#8E8B83' } as CSSProperties}>
          {c.updated} {OPERATOR.updated}
        </p>

        <div style={{ marginTop: 'clamp(40px,5vw,72px)', borderTop: '2px solid #16181D' } as CSSProperties}>
          {c.blocks.map((b, i) => (
            <section
              key={i}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px 48px',
                padding: 'clamp(26px,3vw,44px) 0',
                borderBottom: '1px solid #DCDAD4',
              } as CSSProperties}
            >
              <div style={{ flex: '0 0 44px', fontFamily: MONO, fontSize: '12px', letterSpacing: '.1em', color: '#FF4002' } as CSSProperties}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h2
                style={{
                  flex: '1 1 300px',
                  margin: '0',
                  maxWidth: '18ch',
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 'clamp(20px,2vw,30px)',
                  lineHeight: '1.12',
                  letterSpacing: '-.025em',
                } as CSSProperties}
              >
                {b.h}
              </h2>
              <div style={{ flex: '1 1 420px', maxWidth: '62ch' } as CSSProperties}>
                {(b.p || []).map((p, j) => (
                  <p key={'p' + j} style={{ margin: j ? '14px 0 0' : '0', fontSize: '16px', lineHeight: '1.62', color: '#5C5F66' } as CSSProperties}>
                    {p}
                  </p>
                ))}
                {b.list ? (
                  <ul style={{ margin: (b.p || []).length ? '16px 0 0' : '0', padding: '0', listStyle: 'none' } as CSSProperties}>
                    {b.list.map((li, j) => (
                      <li
                        key={'l' + j}
                        style={{
                          position: 'relative',
                          padding: '0 0 0 22px',
                          marginTop: j ? '10px' : '0',
                          fontSize: '16px',
                          lineHeight: '1.62',
                          color: '#5C5F66',
                        } as CSSProperties}
                      >
                        <span aria-hidden="true" style={{ position: 'absolute', left: '0', top: '.62em', width: '8px', height: '2px', background: '#FF4002' } as CSSProperties} />
                        {li}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <section
          style={{
            marginTop: 'clamp(40px,5vw,72px)',
            padding: 'clamp(26px,3.2vw,48px)',
            background: '#16181D',
            color: '#F7F6F3',
          } as CSSProperties}
        >
          <h2 style={{ margin: '0', maxWidth: '22ch', fontFamily: SANS, fontWeight: 800, fontSize: 'clamp(20px,2.2vw,32px)', lineHeight: '1.1', letterSpacing: '-.025em' } as CSSProperties}>
            {c.contactsH}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px 56px', marginTop: 'clamp(20px,2.4vw,32px)' } as CSSProperties}>
            <a className="fa-404-link" href={'mailto:' + OPERATOR.email} style={{ fontFamily: MONO, fontSize: '15px', color: '#F7F6F3', textDecoration: 'none' } as CSSProperties}>
              {OPERATOR.email}
            </a>
            <a className="fa-404-link" href={'tel:' + OPERATOR.phone.replace(/\D/g, '')} style={{ fontFamily: MONO, fontSize: '15px', color: '#F7F6F3', textDecoration: 'none' } as CSSProperties}>
              {OPERATOR.phone}
            </a>
            <span style={{ fontFamily: MONO, fontSize: '15px', color: '#8E9198' } as CSSProperties}>
              {OPERATOR.founder} · {OPERATOR.city}
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}
