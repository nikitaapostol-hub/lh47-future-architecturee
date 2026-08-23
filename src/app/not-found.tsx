/* Глобальная 404. В проекте несколько корневых layout-ов (ru/ro/en/payload),
   поэтому Next рендерит этот файл без обёртки — html и body он задаёт сам. */
import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import './(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Страница не найдена · Future Architecture',
  description: 'Такой страницы на сайте нет.',
  robots: { index: false, follow: true },
}

const MONO = "'JetBrains Mono',ui-monospace,monospace"
const SANS = 'Montserrat,Manrope,sans-serif'

const LINKS: { href: string; no: string; label: string; note: string }[] = [
  { href: '/', no: '01', label: 'Сообщество', note: 'Архитекторы и дизайнеры Молдовы' },
  { href: '/forum', no: '02', label: 'Форум 2026', note: '3 декабря · Кишинёв' },
  { href: '/award', no: '03', label: 'Премия', note: 'Заявки до 20 ноября' },
]

export default function NotFound() {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <main
          style={{
            minHeight: '100svh',
            background: '#16181D',
            color: '#F7F6F3',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(28px,6vw,96px) clamp(20px,4.8vw,108px)',
            overflowX: 'hidden',
          } as CSSProperties}
        >
          <div style={{ width: '100%', maxWidth: '1720px', margin: '0 auto' } as CSSProperties}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: MONO,
                fontSize: '11px',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: '#FF4002',
              } as CSSProperties}
            >
              <span
                aria-hidden="true"
                style={{ width: '32px', height: '2px', background: '#FF4002' } as CSSProperties}
              />
              Ошибка 404
            </div>

            <div
              aria-hidden="true"
              style={{
                marginTop: 'clamp(16px,2vw,28px)',
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 'min(30vw,300px)',
                lineHeight: '.86',
                letterSpacing: '-.06em',
                color: '#FF4002',
              } as CSSProperties}
            >
              404
            </div>

            <h1
              style={{
                margin: 'clamp(20px,3vw,40px) 0 0',
                maxWidth: '18ch',
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 'clamp(28px,4.6vw,64px)',
                lineHeight: '1.02',
                letterSpacing: '-.035em',
                textTransform: 'uppercase',
              } as CSSProperties}
            >
              Такой страницы нет
            </h1>

            <p
              style={{
                margin: '18px 0 0',
                maxWidth: '46ch',
                fontSize: '17px',
                lineHeight: '1.6',
                color: '#8E9198',
              } as CSSProperties}
            >
              Адрес набран с опечаткой или страницу перенесли. Ниже — то, что точно
              работает.
            </p>

            <nav
              aria-label="Разделы сайта"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
                gap: '1px',
                marginTop: 'clamp(36px,5vw,68px)',
                background: '#2A2D34',
                outline: '1px solid #2A2D34',
              } as CSSProperties}
            >
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  className="fa-404-card"
                  href={l.href}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minHeight: 'clamp(128px,10vw,168px)',
                    padding: 'clamp(18px,1.8vw,28px)',
                    background: '#16181D',
                    color: '#F7F6F3',
                    textDecoration: 'none',
                    transition: 'background 240ms ease, color 240ms ease',
                  } as CSSProperties}
                >
                  <span style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '.12em', color: '#FF4002' } as CSSProperties}>
                    {l.no}
                  </span>
                  <span
                    style={{
                      marginTop: 'auto',
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: 'clamp(18px,1.6vw,24px)',
                      letterSpacing: '-.02em',
                    } as CSSProperties}
                  >
                    {l.label}
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.45', color: '#8E9198' } as CSSProperties}>
                    {l.note}
                  </span>
                </a>
              ))}
            </nav>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px 28px',
                marginTop: 'clamp(28px,3.4vw,48px)',
                fontFamily: MONO,
                fontSize: '12px',
                letterSpacing: '.06em',
                color: '#6E7278',
              } as CSSProperties}
            >
              <a className="fa-404-link" href="/ro" style={{ color: '#6E7278', textDecoration: 'none' } as CSSProperties}>
                RO
              </a>
              <a className="fa-404-link" href="/en" style={{ color: '#6E7278', textDecoration: 'none' } as CSSProperties}>
                EN
              </a>
              <a
                className="fa-404-link"
                href="mailto:marketing@lh47arch.com"
                style={{ color: '#6E7278', textDecoration: 'none' } as CSSProperties}
              >
                marketing@lh47arch.com
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
