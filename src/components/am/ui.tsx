'use client'

/* Общие части новых страниц ARCH MAKERS: шапка, подвал, поля форм.
   Разметка и инлайновые стили перенесены из макетов design/*.dc.html дословно;
   то, что в макете считалось в JS по ширине окна, — классы am-* в globals.css
   (брейкпоинты макета: ≥1100px — десктоп, 720–1099 — планшет, <720 — телефон). */

import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Dict } from '@/i18n/dict'
import { LANGS, path } from '@/i18n/links'
import type { Lang } from '@/i18n/links'

export type S = CSSProperties

/** Широкий заголовочный шрифт. Пока файла Actay Wide нет, браузер берёт Onest. */
export const W = "'Actay Wide',Onest,sans-serif"

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/

export type Page = 'home' | 'forum' | 'award'
const PAGE_PATH: Record<Page, string> = { home: '/', forum: '/forum', award: '/award' }

/** Акцент страницы: подчёркивание активного пункта меню, кнопки, мобильное меню. */
export type Accent = {
  underline: string
  ctaHover: string
  menuActive: string
  menuCtaBg: string
  menuCtaInk: string
}

export const ACCENT: Record<Page, Accent & { color: string; dark: string }> = {
  home: { underline: 'inset 0 -2px 0 #1A52A0', ctaHover: 'hv-blue', menuActive: '#fff', menuCtaBg: '#fff', menuCtaInk: '#000', color: '#1A52A0', dark: '#E5D900' },
  forum: { underline: 'inset 0 -2px 0 #E8461E', ctaHover: 'hv-orange', menuActive: '#E8461E', menuCtaBg: '#E8461E', menuCtaInk: '#000', color: '#E8461E', dark: '#E8461E' },
  award: { underline: 'inset 0 -3px 0 #E5D900', ctaHover: 'hv-yellow', menuActive: '#E5D900', menuCtaBg: '#E5D900', menuCtaInk: '#000', color: '#E5D900', dark: '#E5D900' },
}

/** Текст со стрелкой в конце: стрелка при наведении уезжает вправо. */
export function Arrow({ s, line = false }: { s: string; line?: boolean }) {
  const m = s.match(/^(.*?)\s*→\s*$/)
  const text = m ? m[1] : s
  return (
    <>
      {line ? <span className="am-link-t">{text}</span> : text}
      {m ? (
        <>
          {' '}
          <span className="am-arr" aria-hidden="true">→</span>
        </>
      ) : null}
    </>
  )
}

/** Числа 01, 02… */
export const no2 = (i: number) => String(i + 1).padStart(2, '0')

/** Подстановка {name} в строку из словаря. */
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))

export function Header({
  t,
  lang,
  page,
  cta,
  ctaHref,
  ctaMenu,
  onCta,
}: {
  t: Dict
  lang: Lang
  page: Page
  cta: string
  ctaHref: string
  ctaMenu: string
  onCta?: () => void
}) {
  const a = ACCENT[page]
  const [menu, setMenu] = useState(false)
  const close = () => setMenu(false)

  // меню открыто на весь экран — прокрутку страницы под ним выключаем
  useEffect(() => {
    document.documentElement.style.overflow = menu ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [menu])
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)')
    const off = () => mq.matches && setMenu(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    mq.addEventListener('change', off)
    window.addEventListener('keydown', esc)
    return () => {
      mq.removeEventListener('change', off)
      window.removeEventListener('keydown', esc)
    }
  }, [])

  const items: { page: Page | null; href: string; label: string }[] = [
    { page: 'home', href: path(lang, '/'), label: t.cNavCommunity },
    { page: 'forum', href: path(lang, '/forum'), label: t.cNavForum },
    { page: 'award', href: path(lang, '/award'), label: t.cNavAward },
    { page: null, href: '#contacts', label: t.cNavContacts },
  ]
  const langs = ['ro', 'ru', 'en'] as Lang[]

  return (
    <>
    <header style={{ ['--am-acc' as string]: a.color, position: 'sticky', top: 0, zIndex: 60, background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #E6E6E3' }}>
      <div style={{ maxWidth: '1440px', height: '72px', margin: '0 auto', padding: '0 clamp(20px,4vw,64px)', display: 'flex', alignItems: 'center', gap: '32px' }}>
        <a href={path(lang, '/')} aria-label="ARCH MAKERS" style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
          <img src="/img/logo-v2.svg" alt="ARCH MAKERS" width={137} height={40} style={{ display: 'block', height: '40px', width: 'auto' }} />
        </a>
        <nav className="am-d" style={{ display: 'flex', alignItems: 'center', gap: '32px', marginLeft: 'auto', fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {items.map((it) =>
            it.page === page ? (
              <a key={it.href} href={it.href} aria-current="page" style={{ padding: '6px 0', boxShadow: a.underline }}>
                {it.label}
              </a>
            ) : (
              <a key={it.href} href={it.href} className="am-nav" style={{ padding: '6px 0', color: '#55554F' }}>
                {it.label}
              </a>
            ),
          )}
        </nav>
        <div className="am-d" style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#8A8A86' }}>
          {langs.map((l) =>
            l === lang ? (
              <a key={l} href={path(l, PAGE_PATH[page])} hrefLang={l} style={{ color: '#000', fontWeight: 600 }}>
                {l.toUpperCase()}
              </a>
            ) : (
              <a key={l} href={path(l, PAGE_PATH[page])} hrefLang={l} className="am-lang" style={{ transition: 'color 200ms' }}>
                {l.toUpperCase()}
              </a>
            ),
          )}
        </div>
        <a
          className={'am-d ' + a.ctaHover}
          href={ctaHref}
          onClick={onCta}
          style={{ display: 'inline-flex', alignItems: 'center', height: '44px', padding: '0 22px', background: '#000', color: '#fff', fontFamily: W, fontWeight: 700, fontSize: '13px', letterSpacing: '.02em', transition: 'background 200ms,color 200ms' }}
        >
          {cta}
        </a>
        <button
          className="am-m"
          type="button"
          onClick={() => setMenu((m) => !m)}
          aria-label={t.cMenu}
          aria-expanded={menu}
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', height: '44px', padding: '0 16px', background: '#000', color: '#fff', border: 0, cursor: 'pointer', fontFamily: W, fontWeight: 700, fontSize: '13px' }}
        >
          {menu ? t.cClose : t.cMenu}
        </button>
      </div>
    </header>
      {/* Меню — вне <header>: у шапки backdrop-filter, а он делает её «коробкой» для
          position:fixed, и меню сжималось до высоты шапки. */}
      {menu && (
        <div className="am-m" role="dialog" aria-modal="true" aria-label={t.cMenu} style={{ ['--am-acc' as string]: a.dark, position: 'fixed', zIndex: 59, left: 0, right: 0, top: '72px', bottom: 0, overscrollBehavior: 'contain', background: '#000', color: '#fff', padding: '32px clamp(20px,4vw,64px)', display: 'flex', flexDirection: 'column', gap: '32px', overflow: 'auto' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', fontFamily: W, fontWeight: 700, fontSize: '28px', lineHeight: 1.1 }}>
            {items.map((it) => (
              <a key={it.href} href={it.href} onClick={close} className="am-menu-link" style={{ padding: '16px 0', borderBottom: '1px solid #2B2B2B', ...(it.page === page ? { color: a.menuActive } : {}) }}>
                {it.label}
              </a>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#9A9A96' }}>
            {langs.map((l) => (
              <a key={l} href={path(l, PAGE_PATH[page])} hrefLang={l} className="am-lang-dark" style={{ transition: 'color 200ms', ...(l === lang ? { color: '#fff' } : {}) }}>
                {l.toUpperCase()}
              </a>
            ))}
          </div>
          <a
            href={ctaHref}
            onClick={() => {
              onCta?.()
              close()
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '56px', background: a.menuCtaBg, color: a.menuCtaInk, fontFamily: W, fontWeight: 700, fontSize: '14px' }}
          >
            {ctaMenu}
          </a>
        </div>
      )}
    </>
  )
}

const CAP: S = { fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9A9A96' }
const SOCIAL: S = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', border: '1px solid #444', color: '#fff', transition: 'background 200ms,border-color 200ms,color 200ms' }

const tel = (s: string) => 'tel:' + s.replace(/[^\d+]/g, '')

export function Footer({ t, lang }: { t: Dict; lang: Lang }) {
  const social = [
    { href: t.cInstagram, label: 'Instagram', body: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg>
    ), style: {} as S },
    { href: t.cFacebook, label: 'Facebook', body: 'f', style: { fontFamily: 'Onest,sans-serif', fontWeight: 800, fontSize: '20px' } as S },
    { href: t.cLinkedin, label: 'LinkedIn', body: 'in', style: { fontFamily: 'Onest,sans-serif', fontWeight: 800, fontSize: '16px' } as S },
  ].filter((s) => s.href && s.href.trim())

  return (
    <footer id="contacts" className="am-foot" style={{ background: '#000', color: '#fff', padding: 'clamp(48px,5vw,80px) 0 28px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px,4vw,64px)' }}>
        <div className="am-g4" style={{ display: 'grid', gap: '32px' }}>
          <div>
            <img src="/img/logo-v2-white.svg" alt="ARCH MAKERS" width={192} height={56} loading="lazy" style={{ display: 'block', height: '56px', width: 'auto' }} />
            <div style={{ marginTop: '20px', ...CAP }}>{t.cTagline}</div>
          </div>
          <div>
            <div style={CAP}>{t.cEmailLabel}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px', fontSize: '16px', overflowWrap: 'anywhere' }}>
              {[t.cEmail1, t.cEmail2].filter(Boolean).map((e) => (
                <a key={e} href={'mailto:' + e}>{e}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={CAP}>{t.cPhoneLabel}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px', fontSize: '16px' }}>
              {[[t.cPhone1, t.cPhone1Label], [t.cPhone2, t.cPhone2Label]].filter(([p]) => p).map(([p, l]) => (
                <a key={p} href={tel(p)}>
                  {p} <span style={{ color: '#9A9A96' }}>{l}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div style={CAP}>{t.cFounders}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px' }}>
              <img src="/img/d65b278e9b.png" alt="LH47 arch." width={26} height={26} loading="lazy" style={{ height: '26px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
              <img src="/img/d7f7cfad4d.png" alt="InStyle Home" width={73} height={18} loading="lazy" style={{ height: '18px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
            </div>
            {social.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                {social.map((s) => (
                  <a key={s.label} className="hv-social" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{ ...SOCIAL, ...s.style }}>
                    {s.body}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #2B2B2B', fontSize: '13px', color: '#9A9A96' }}>
          <span>{t.cCopyright}</span>
          <a href={path(lang, '/privacy')}>{t.cPrivacy}</a>
        </div>
      </div>
    </footer>
  )
}

/** Подпись поля — как в макете. */
export const LABEL: S = { fontSize: '12px', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#55554F' }

/** Нижняя линия поля ввода: сообщество и форум. */
export const INPUT: S = { display: 'block', width: '100%', marginTop: '8px', height: '48px', padding: 0, background: 'transparent', border: 0, borderBottom: '1px solid #C9C9C5', borderRadius: 0, fontSize: '17px', outline: 'none' }

/** Строка согласия под кнопкой отправки. */
export function Consent({ t, lang, dark = false }: { t: Dict; lang: Lang; dark?: boolean }) {
  return (
    <p style={{ marginTop: '14px', maxWidth: '52ch', fontSize: '13px', lineHeight: 1.5, color: dark ? '#C8D6EC' : '#8A8A86' }}>
      {t.cConsent}{' '}
      <a href={path(lang, '/privacy')} target="_blank" style={{ textDecoration: 'underline', textUnderlineOffset: '2px', color: dark ? '#fff' : '#55554F' }}>
        {t.cConsentLink}
      </a>
      .
    </p>
  )
}

/** Сообщение об ошибке отправки. */
export function FormError({ children, dark = false }: { children?: ReactNode; dark?: boolean }) {
  if (!children) return null
  return (
    <p role="alert" style={{ marginTop: '16px', padding: '12px 14px', background: dark ? '#fff' : '#FFF4D6', color: '#000', fontSize: '15px', lineHeight: 1.5 }}>
      {children}
    </p>
  )
}

export { LANGS }
