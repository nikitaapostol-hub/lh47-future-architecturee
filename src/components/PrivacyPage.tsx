/* Политика обработки персональных данных (/privacy) — макет design/Privacy.dc.html.
   Тексты RU/RO/EN — из макета. */
import type { CSSProperties } from 'react'
import { path } from '@/i18n/links'
import type { Lang } from '@/i18n/links'
import Preloader from './Preloader'
import { CookieSettingsLink } from './CookieConsent'

const LABEL: Record<Lang, string> = { ru: 'Политика данных', ro: 'Politica datelor', en: 'Privacy policy' }

type S = CSSProperties
const W = "'Actay Wide',Onest,sans-serif"
const UPDATED = '20.10.2026'

type Block = { h: string; p?: string[]; list?: string[]; id?: string }
type Copy = { kicker: string; title: string; lead: string; updated: string; back: string; contactsH: string; footer: string; alt: string; blocks: Block[] }

export const COPY: Record<Lang, Copy> = 
{
    ru: { kicker: 'Правовая информация', title: 'Политика обработки персональных данных', lead: 'Документ объясняет, какие данные собирает сайт Future Architecture, зачем они нужны, сколько хранятся и как их удалить.', updated: 'Редакция от', back: 'На главную', contactsH: 'Как связаться и отозвать согласие', footer: 'Люди / Идеи / Пространства', alt: 'Иллюстрация: человек входит через узкий проём в закрытый бетонный двор',
      blocks: [
        { h: 'Кто обрабатывает данные', p: ['Операторы — архитектурное бюро LH47 ARCH и InStyle Home, основатели профессионального сообщества Future Architecture, город Кишинёв, Республика Молдова.', 'Вопросы по обработке данных: info@future-arch.md.'] },
        { h: 'Какие данные мы собираем', p: ['Сайт не требует регистрации. Данные попадают к нам только когда вы сами заполняете одну из форм заявки.'], list: ['Заявка в сообщество: имя, профессия или компания, направление деятельности, e-mail, телефон, сайт.', 'Заявка на форум: имя, компания и должность, тип участия, e-mail, телефон.', 'Заявка на премию или студенческий конкурс: автор, компания или учебное заведение, номинация, данные о проекте, файлы проекта, e-mail, телефон.', 'Технические данные, которые браузер передаёт любому сайту: IP-адрес, тип устройства и браузера, время запроса. Они нужны хостингу для защиты от атак и для работы сайта.'] },
        { h: 'Зачем мы их используем', list: ['Рассмотреть вашу заявку и ответить на неё.', 'Связаться по поводу участия в сообществе, форуме или премии.', 'Подтвердить участие и прислать организационные детали мероприятия.', 'Вести внутренний учёт заявок.'], p: ['Мы не используем эти данные для рассылок, не связанных с вашей заявкой, и не строим на их основе рекламные профили.'] },
        { h: 'На каком основании', p: ['Отправляя форму, вы даёте согласие на обработку указанных в ней данных. Согласие добровольное: без него мы не сможем рассмотреть заявку, но другие разделы сайта остаются доступны.', 'Обработка ведётся в соответствии с законодательством Республики Молдова о защите персональных данных.'] },
        { h: 'Кому мы их передаём', p: ['Мы не продаём данные и не передаём их третьим лицам для их собственных целей. Доступ к заявкам имеют только сотрудники организаторов, которым он нужен по работе.'], list: ['Хостинг и доставка сайта — Vercel Inc.', 'База данных заявок — Neon Inc.', 'Рабочая почта организаторов — Google Workspace.', 'Пересылка почты info@future-arch.md — Cloudflare Inc.', 'Отправка писем по заявкам — Resend Inc.', 'Статистика посещений — Google Analytics (Google LLC), только с вашего согласия.', 'Реклама сообщества в Facebook и Instagram — Meta Platforms Ireland Ltd. (Meta Pixel), только с вашего согласия.'] },
        { h: 'Сколько храним', p: ['Заявки храним, пока идёт работа по соответствующему направлению, и до трёх лет после завершения мероприятия — чтобы вести историю участия и не запрашивать одно и то же повторно.', 'По вашему требованию удаляем раньше.'] },
        { h: 'Ваши права', list: ['Узнать, какие ваши данные у нас есть.', 'Исправить неточные данные.', 'Удалить данные или ограничить их обработку.', 'Отозвать согласие в любой момент.', 'Подать жалобу в надзорный орган по защите персональных данных Республики Молдова.'] },
        { id: 'cookies', h: 'Файлы cookie', p: ['При первом заходе сайт спрашивает согласие на cookie. Выбор можно изменить в любой момент — ссылка «Настройки cookie» внизу каждой страницы и под этим разделом.'], list: ['Необходимые: fa_consent запоминает ваш выбор на 12 месяцев. Работают всегда, без них сайт не сможет учесть ваше решение.', 'Аналитика: Google Analytics (cookie _ga и _ga_*, до 2 лет) показывает, какие страницы смотрят и сколько заявок отправляют. Включается только после вашего согласия. Пока согласия нет, Google получает только обезличенные сигналы без cookie.', 'Реклама: Meta Pixel (cookie _fbp и _fbc, до 90 дней) сообщает Meta о посещении сайта и отправке заявки — так мы понимаем, какая реклама сообщества в Facebook и Instagram работает, и показываем её тем, кто уже был на сайте. Включается только после вашего согласия на рекламу; сами данные заявки (имя, телефон, почта) в Meta не передаются.'] },
        { h: 'Изменения', p: ['Если документ поменяется, обновлённая редакция появится на этой странице с новой датой. О существенных изменениях мы сообщим отдельно тем, чьи заявки в работе.'] },
      ] },
    ro: { kicker: 'Informații juridice', title: 'Politica de prelucrare a datelor cu caracter personal', lead: 'Documentul explică ce date colectează site-ul Future Architecture, de ce sunt necesare, cât timp se păstrează și cum pot fi șterse.', updated: 'Ediția din', back: 'Pagina principală', contactsH: 'Cum ne contactați și cum retrageți consimțământul', footer: 'Oameni / Idei / Spații', alt: 'Ilustrație: un om intră printr-o deschidere îngustă într-o curte închisă din beton',
      blocks: [
        { h: 'Cine prelucrează datele', p: ['Operatori — biroul de arhitectură LH47 ARCH și InStyle Home, fondatorii comunității profesionale Future Architecture, Chișinău, Republica Moldova.', 'Întrebări privind prelucrarea datelor: info@future-arch.md.'] },
        { h: 'Ce date colectăm', p: ['Site-ul nu necesită înregistrare. Datele ajung la noi doar când completați personal unul dintre formulare.'], list: ['Cerere de aderare: nume, profesie sau companie, domeniu de activitate, e-mail, telefon, site.', 'Cerere pentru forum: nume, companie și funcție, tipul participării, e-mail, telefon.', 'Cerere pentru premiu sau concursul studențesc: autor, companie sau instituție de învățământ, nominalizare, date despre proiect, fișierele proiectului, e-mail, telefon.', 'Date tehnice pe care browserul le transmite oricărui site: adresa IP, tipul dispozitivului și al browserului, ora solicitării. Sunt necesare găzduirii pentru protecție și pentru funcționarea site-ului.'] },
        { h: 'De ce le folosim', list: ['Pentru a examina cererea și a vă răspunde.', 'Pentru a vă contacta privind participarea în comunitate, la forum sau la premiu.', 'Pentru a confirma participarea și a trimite detaliile organizatorice.', 'Pentru evidența internă a cererilor.'], p: ['Nu folosim aceste date pentru comunicări fără legătură cu cererea dumneavoastră și nu construim profiluri publicitare.'] },
        { h: 'Temeiul juridic', p: ['Prin trimiterea formularului vă exprimați consimțământul pentru prelucrarea datelor indicate în el. Consimțământul este voluntar: fără el nu putem examina cererea, dar restul site-ului rămâne accesibil.', 'Prelucrarea se face în conformitate cu legislația Republicii Moldova privind protecția datelor cu caracter personal.'] },
        { h: 'Cui le transmitem', p: ['Nu vindem datele și nu le transmitem terților pentru scopurile lor proprii. Acces la cereri au doar angajații organizatorilor care au nevoie de el pentru muncă.'], list: ['Găzduire și livrarea site-ului — Vercel Inc.', 'Baza de date a cererilor — Neon Inc.', 'Poșta de lucru a organizatorilor — Google Workspace.', 'Redirecționarea poștei info@future-arch.md — Cloudflare Inc.', 'Trimiterea e-mailurilor privind cererile — Resend Inc.', 'Statistica vizitelor — Google Analytics (Google LLC), doar cu acordul dumneavoastră.', 'Publicitatea comunității pe Facebook și Instagram — Meta Platforms Ireland Ltd. (Meta Pixel), doar cu acordul dumneavoastră.'] },
        { h: 'Cât timp păstrăm', p: ['Păstrăm cererile pe durata activității pe direcția respectivă și până la trei ani după încheierea evenimentului — pentru istoricul participării și pentru a nu solicita din nou aceleași informații.', 'La cererea dumneavoastră ștergem mai devreme.'] },
        { h: 'Drepturile dumneavoastră', list: ['Să aflați ce date deținem despre dumneavoastră.', 'Să corectați datele inexacte.', 'Să ștergeți datele sau să limitați prelucrarea lor.', 'Să retrageți consimțământul în orice moment.', 'Să depuneți o plângere la autoritatea de supraveghere pentru protecția datelor din Republica Moldova.'] },
        { id: 'cookies', h: 'Cookie-uri', p: ['La prima vizită site-ul cere acordul pentru cookie-uri. Alegerea poate fi schimbată oricând — linkul „Setări cookie” din partea de jos a fiecărei pagini și de sub această secțiune.'], list: ['Necesare: fa_consent reține alegerea dumneavoastră timp de 12 luni. Funcționează mereu, fără ele site-ul nu poate ține cont de decizia dumneavoastră.', 'Analiză: Google Analytics (cookie-urile _ga și _ga_*, până la 2 ani) arată ce pagini sunt vizitate și câte cereri se trimit. Se activează doar după acordul dumneavoastră. Până atunci Google primește doar semnale anonime, fără cookie-uri.', 'Publicitate: Meta Pixel (cookie-urile _fbp și _fbc, până la 90 de zile) transmite către Meta vizita pe site și trimiterea cererii — astfel înțelegem ce reclame ale comunității pe Facebook și Instagram funcționează și le arătăm celor care au vizitat deja site-ul. Se activează doar după acordul dumneavoastră pentru publicitate; datele din cerere (nume, telefon, e-mail) nu sunt transmise către Meta.'] },
        { h: 'Modificări', p: ['Dacă documentul se schimbă, ediția actualizată apare pe această pagină cu o dată nouă. Modificările esențiale le comunicăm separat celor ale căror cereri sunt în lucru.'] },
      ] },
    en: { kicker: 'Legal information', title: 'Personal data processing policy', lead: 'This document explains what data the Future Architecture website collects, why it is needed, how long it is kept and how to have it deleted.', updated: 'Version of', back: 'Home', contactsH: 'How to reach us and withdraw consent', footer: 'People / Ideas / Spaces', alt: 'Illustration: a person walks through a narrow opening into an enclosed concrete courtyard',
      blocks: [
        { h: 'Who processes the data', p: ['The operators are LH47 ARCH architecture bureau and InStyle Home, founders of the Future Architecture professional community, Chișinău, Republic of Moldova.', 'Questions about data processing: info@future-arch.md.'] },
        { h: 'What we collect', p: ['The site requires no registration. Data reaches us only when you fill in one of the application forms yourself.'], list: ['Community application: name, profession or company, field of activity, e-mail, phone, website.', 'Forum application: name, company and position, type of participation, e-mail, phone.', 'Award or student competition application: author, company or school, category, project details, project files, e-mail, phone.', 'Technical data any browser sends to any website: IP address, device and browser type, request time. The hosting provider needs these to keep the site running and protected.'] },
        { h: 'Why we use it', list: ['To review your application and reply to it.', 'To contact you about taking part in the community, the forum or the award.', 'To confirm participation and send event details.', 'To keep an internal record of applications.'], p: ['We do not use this data for mailings unrelated to your application and do not build advertising profiles from it.'] },
        { h: 'Legal basis', p: ['By submitting a form you consent to the processing of the data it contains. Consent is voluntary: without it we cannot review the application, but the rest of the site stays available.', 'Processing follows the personal data protection legislation of the Republic of Moldova.'] },
        { h: 'Who we share it with', p: ['We do not sell data and do not pass it to third parties for their own purposes. Only staff of the organisers who need it for their work have access to applications.'], list: ['Hosting and site delivery — Vercel Inc.', 'Application database — Neon Inc.', 'Organisers’ work email — Google Workspace.', 'Forwarding of info@future-arch.md mail — Cloudflare Inc.', 'Sending application emails — Resend Inc.', 'Visit statistics — Google Analytics (Google LLC), only with your consent.', 'Community advertising on Facebook and Instagram — Meta Platforms Ireland Ltd. (Meta Pixel), only with your consent.'] },
        { h: 'How long we keep it', p: ['We keep applications while work on the relevant track is ongoing, and for up to three years after the event — to maintain a participation history and avoid asking for the same information twice.', 'On your request we delete it sooner.'] },
        { h: 'Your rights', list: ['Find out what data we hold about you.', 'Correct inaccurate data.', 'Delete the data or restrict its processing.', 'Withdraw consent at any time.', 'Lodge a complaint with the data protection supervisory authority of the Republic of Moldova.'] },
        { id: 'cookies', h: 'Cookies', p: ['On your first visit the site asks for consent to cookies. You can change your choice at any time with the “Cookie settings” link at the bottom of every page and below this section.'], list: ['Necessary: fa_consent remembers your choice for 12 months. Always on — without it the site cannot respect your decision.', 'Analytics: Google Analytics (_ga and _ga_* cookies, up to 2 years) shows which pages are viewed and how many applications are sent. It is turned on only after you consent. Until then Google receives only anonymous signals without cookies.', 'Advertising: Meta Pixel (_fbp and _fbc cookies, up to 90 days) tells Meta about your visit and about a submitted application — this shows us which community ads on Facebook and Instagram work and lets us show them to people who have already visited the site. It is turned on only after you consent to advertising; the application data itself (name, phone, email) is not sent to Meta.'] },
        { h: 'Changes', p: ['If the document changes, an updated version appears on this page with a new date. We notify people with applications in progress about material changes separately.'] },
      ] },
  }

export default function PrivacyPage({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  return (
    <div lang={lang} className="sel-yellow" style={{ background: '#fff', color: '#000', minHeight: '100vh', overflowX: 'clip' }}>
      <Preloader label={LABEL[lang]} accent="#E5D900" />
      <header style={{ position: 'sticky', top: 0, zIndex: 60, background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #E6E6E3' }}>
        <div style={{ maxWidth: '1440px', height: '72px', margin: '0 auto', padding: '0 clamp(20px,4vw,64px)', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href={path(lang, '/')} aria-label="Future Architecture" style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
            <img src="/img/logo.svg" alt="Future Architecture" width={160} height={40} style={{ display: 'block', height: '40px', width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', fontSize: '13px', color: '#8A8A86' }}>
            {(['ro', 'ru', 'en'] as Lang[]).map((k) => (
              <a key={k} href={path(k, '/privacy')} hrefLang={k} className={k === lang ? undefined : 'am-lang'} style={{ padding: '6px 2px', color: k === lang ? '#000' : '#8A8A86', fontWeight: k === lang ? 600 : 400 }}>
                {k.toUpperCase()}
              </a>
            ))}
          </div>
          <a href={path(lang, '/')} className="hv-yellow" style={{ display: 'inline-flex', alignItems: 'center', height: '44px', padding: '0 22px', background: '#000', color: '#fff', fontFamily: W, fontWeight: 700, fontSize: '13px', transition: 'background 200ms,color 200ms' }}>
            {c.back}
          </a>
        </div>
      </header>
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: 'clamp(48px,7vw,112px) clamp(20px,4vw,64px) clamp(64px,8vw,128px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#55554F' }}>
          <span style={{ width: '12px', height: '12px', background: '#E5D900' }} />
          {c.kicker}
        </div>
        <h1 style={{ marginTop: 'clamp(18px,2.4vw,32px)', maxWidth: '18ch', fontFamily: W, fontWeight: 900, fontSize: 'clamp(32px,4.6vw,68px)', lineHeight: 1, letterSpacing: '-.03em', textTransform: 'uppercase' }}>{c.title}</h1>
        <p style={{ marginTop: 'clamp(20px,2.4vw,32px)', maxWidth: '62ch', fontSize: '18px', lineHeight: 1.6, color: '#55554F' }}>{c.lead}</p>
        <p style={{ marginTop: '16px', fontSize: '13px', color: '#8A8A86' }}>
          {c.updated} {UPDATED}
        </p>
        <div style={{ marginTop: 'clamp(32px,4vw,56px)', aspectRatio: '16/6', background: '#000', overflow: 'hidden' }}>
          <img src="/img/il-privacy.jpg" alt={c.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 62%', display: 'block' }} />
        </div>
        <div style={{ marginTop: 'clamp(40px,5vw,72px)', borderTop: '2px solid #000' }}>
          {c.blocks.map((b, i) => (
            <section key={i} id={b.id} className="am-privacy-row" style={{ scrollMarginTop: '96px', display: 'grid', gap: '12px 48px', padding: 'clamp(26px,3vw,44px) 0', borderBottom: '1px solid #E6E6E3' }}>
              <div style={{ fontFamily: W, fontWeight: 900, fontSize: '14px', color: '#1A52A0' }}>{String(i + 1).padStart(2, '0')}</div>
              <h2 style={{ maxWidth: '18ch', fontFamily: W, fontWeight: 800, fontSize: 'clamp(20px,2vw,28px)', lineHeight: 1.12, letterSpacing: '-.02em' }}>{b.h}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '62ch', fontSize: '16px', lineHeight: 1.62, color: '#3F3F3B' }}>
                {(b.p || []).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {b.list && b.list.length > 0 && (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {b.list.map((li, j) => (
                      <li key={j} style={{ display: 'grid', gridTemplateColumns: '18px 1fr', alignItems: 'baseline' }}>
                        <span style={{ width: '8px', height: '8px', background: '#E5D900', transform: 'translateY(-1px)' }} />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {b.id === 'cookies' ? (
                  <CookieSettingsLink lang={lang} style={{ alignSelf: 'flex-start', fontWeight: 600, color: '#000', textDecoration: 'underline', textUnderlineOffset: '3px' }} />
                ) : null}
              </div>
            </section>
          ))}
        </div>
        <section style={{ marginTop: 'clamp(40px,5vw,72px)', padding: 'clamp(28px,3.2vw,48px)', background: '#000', color: '#fff' }}>
          <h2 style={{ maxWidth: '24ch', fontFamily: W, fontWeight: 800, fontSize: 'clamp(20px,2.2vw,32px)', lineHeight: 1.1, letterSpacing: '-.02em' }}>{c.contactsH}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 48px', marginTop: 'clamp(20px,2.4vw,32px)', fontSize: '16px' }}>
            <a href="mailto:info@future-arch.md" style={{ color: '#fff' }}>info@future-arch.md</a>
            <a href="tel:+37368059311" style={{ color: '#fff' }}>(+373) 68 059 311</a>
            <span style={{ color: '#9A9A96' }}>LH47 ARCH · InStyle Home · Chișinău</span>
          </div>
        </section>
      </main>
      <footer style={{ background: '#000', color: '#9A9A96', borderTop: '1px solid #2B2B2B' } as S}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px clamp(20px,4vw,64px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', fontSize: '13px' }}>
          <span>© 2026 Future Architecture</span>
          <span>{c.footer}</span>
        </div>
      </footer>
    </div>
  )
}
