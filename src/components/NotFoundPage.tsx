'use client'

/* 404 — макет design/404.dc.html. Язык берём из адреса (/ro/…, /en/…),
   переключатель меняет его на месте, как в макете. */
import { useEffect, useState } from 'react'
import type { Lang } from '@/i18n/links'
import { path } from '@/i18n/links'

const W = "'Actay Wide',Onest,sans-serif"

type Copy = { kicker: string; title: string; lead: string; nav: string; alt: string; links: [string, string][] }

const COPY: Record<Lang, Copy> = 
{
    ru: { kicker: 'Ошибка 404', title: 'Такой страницы нет', lead: 'Адрес набран с опечаткой или страницу перенесли. Ниже — разделы, которые точно работают.', nav: 'Разделы сайта', alt: 'Иллюстрация: оранжевый портал и лестница, которая обрывается в пустоту',
      links: [['Сообщество', 'Архитекторы и дизайнеры Молдовы'], ['Форум 2026', '9 декабря · Кишинёв'], ['Премия и конкурсы', 'Заявки до 20 ноября']] },
    ro: { kicker: 'Eroare 404', title: 'Această pagină nu există', lead: 'Adresa conține o greșeală sau pagina a fost mutată. Mai jos — secțiunile care funcționează sigur.', nav: 'Secțiunile site-ului', alt: 'Ilustrație: portal portocaliu și o scară care se termină în gol',
      links: [['Comunitatea', 'Arhitecți și designeri din Moldova'], ['Forumul 2026', '9 decembrie · Chișinău'], ['Premiu și concursuri', 'Înscrieri până pe 20 noiembrie']] },
    en: { kicker: 'Error 404', title: 'This page does not exist', lead: 'The address has a typo or the page has moved. Below are the sections that definitely work.', nav: 'Site sections', alt: 'Illustration: an orange portal and a staircase that ends in mid-air',
      links: [['Community', 'Architects and designers of Moldova'], ['Forum 2026', '9 December · Chișinău'], ['Award & competitions', 'Applications until 20 November']] },
  }

const HREFS = ['/', '/forum', '/award']

export default function NotFoundPage() {
  const [lang, setLang] = useState<Lang>('ru')
  useEffect(() => {
    const m = window.location.pathname.match(/^\/(ro|en)(\/|$)/)
    if (m) setLang(m[1] as Lang)
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const c = COPY[lang]

  return (
    <div lang={lang} className="sel-yellow" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', color: '#000', overflowX: 'clip' }}>
      <header style={{ borderBottom: '1px solid #E6E6E3' }}>
        <div style={{ maxWidth: '1440px', height: '72px', margin: '0 auto', padding: '0 clamp(20px,4vw,64px)', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href={path(lang, '/')} aria-label="ARCH MAKERS" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/img/logo-v2.svg" alt="ARCH MAKERS" width={137} height={40} style={{ display: 'block', height: '40px', width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', fontSize: '13px', color: '#8A8A86' }}>
            {(['ro', 'ru', 'en'] as Lang[]).map((k) => (
              <button key={k} type="button" onClick={() => setLang(k)} className={k === lang ? undefined : 'am-lang'} style={{ padding: '6px 2px', background: 'none', border: 0, cursor: 'pointer', font: 'inherit', color: k === lang ? '#000' : '#8A8A86', fontWeight: k === lang ? 600 : 400 }}>
                {k.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: 'clamp(40px,6vw,96px) clamp(20px,4vw,64px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#55554F' }}>
            <span style={{ width: '12px', height: '12px', background: '#E5D900' }} />
            {c.kicker}
          </div>
          <div style={{ position: 'relative', marginTop: 'clamp(16px,2vw,28px)', aspectRatio: '16/7', background: '#000', overflow: 'hidden' }}>
            <img src="/img/il-404.jpg" alt={c.alt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 70%', display: 'block' }} />
            <div aria-hidden="true" style={{ position: 'absolute', left: 'clamp(16px,2.4vw,40px)', top: 'clamp(12px,2vw,32px)', fontFamily: W, fontWeight: 900, fontSize: 'clamp(56px,11vw,176px)', lineHeight: 0.84, letterSpacing: '-.05em', color: '#fff' }}>
              4<span style={{ color: '#E5D900' }}>0</span>4
            </div>
          </div>
          <h1 style={{ marginTop: 'clamp(20px,3vw,40px)', maxWidth: '18ch', fontFamily: W, fontWeight: 900, fontSize: 'clamp(28px,4.2vw,60px)', lineHeight: 1, letterSpacing: '-.03em', textTransform: 'uppercase' }}>{c.title}</h1>
          <p style={{ marginTop: '18px', maxWidth: '46ch', fontSize: '17px', lineHeight: 1.6, color: '#55554F' }}>{c.lead}</p>
          <nav aria-label={c.nav} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1px', marginTop: 'clamp(36px,5vw,64px)', background: '#E6E6E3', border: '1px solid #E6E6E3' }}>
            {c.links.map(([label, note], i) => (
              <a key={i} href={path(lang, HREFS[i])} className="hv-bgyellow" style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '152px', padding: 'clamp(20px,2vw,28px)', background: '#fff', color: '#000', transition: 'background 200ms' }}>
                <span style={{ fontFamily: W, fontWeight: 900, fontSize: '14px', color: '#1A52A0' }}>{'0' + (i + 1)}</span>
                <span style={{ marginTop: 'auto', fontFamily: W, fontWeight: 800, fontSize: 'clamp(20px,1.8vw,26px)', letterSpacing: '-.02em' }}>{label} <span className="am-arr" aria-hidden="true">→</span></span>
                <span style={{ fontSize: '14px', lineHeight: 1.45, color: '#55554F' }}>{note}</span>
              </a>
            ))}
          </nav>
        </div>
      </main>
      <footer style={{ background: '#000', color: '#9A9A96' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px clamp(20px,4vw,64px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', fontSize: '13px' }}>
          <span>© 2026 ARCH MAKERS</span>
          <a href="mailto:marketing@lh47arch.com" style={{ color: '#fff' }}>marketing@lh47arch.com</a>
        </div>
      </footer>
    </div>
  )
}
