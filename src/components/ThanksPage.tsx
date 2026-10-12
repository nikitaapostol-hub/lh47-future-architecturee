'use client'

/* Страница «Спасибо» после отправки любой формы.
   Форма кладёт в sessionStorage, что отправили (fa-lead), и переходит сюда.
   Здесь один раз уходит событие form_success в dataLayer — по нему GTM
   отправляет в GA4 generate_lead. Обновление страницы или прямой заход
   событие не повторяют: запись из sessionStorage сразу удаляется. */
import { useEffect, useState } from 'react'
import type { Dict } from '@/i18n/dict'
import type { Lang } from '@/i18n/links'
import { path } from '@/i18n/links'
import { Arrow, Footer, Header, W, fill } from './am/ui'
import type { Page } from './am/ui'
import { LEAD_KEY, track } from '@/lib/submit'
import type { FormName } from '@/lib/submit'

type Lead = { form: FormName; nomination?: string; page?: string }

const PAGE_OF: Record<FormName, Page> = {
  community_resident: 'home',
  community_partner: 'home',
  forum_guest: 'forum',
  forum_partner: 'forum',
  award_nomination: 'award',
  award_student: 'award',
}

export default function ThanksPage({ t, lang }: { t: Dict; lang: Lang }) {
  const [lead, setLead] = useState<Lead | null>(null)

  useEffect(() => {
    let l: Lead | null = null
    try {
      const raw = sessionStorage.getItem(LEAD_KEY)
      if (raw) {
        l = JSON.parse(raw)
        sessionStorage.removeItem(LEAD_KEY)
        if (l && PAGE_OF[l.form]) {
          track('form_success', {
            form_name: l.form,
            form_page: l.page || '',
            form_language: lang,
            nomination: l.nomination || '',
          })
        }
      }
    } catch {}
    if (!l) {
      // прямой заход по ссылке ?form=… — показываем нужный текст, событие не шлём
      const f = new URLSearchParams(window.location.search).get('form') as FormName | null
      if (f && PAGE_OF[f]) l = { form: f }
    }
    if (l && PAGE_OF[l.form]) setLead(l)
  }, [lang])

  const page: Page = lead ? PAGE_OF[lead.form] : 'home'
  const text = !lead
    ? ''
    : page === 'home'
      ? t.hSentText
      : page === 'forum'
        ? t.fSentText
        : lead.form === 'award_student'
          ? t.aStudentSent
          : fill(t.aSentText, { nom: lead.nomination || '—' })
  const accent = page === 'forum' ? '#E8461E' : page === 'award' ? '#E5D900' : '#1A52A0'
  const cta =
    page === 'forum'
      ? { cta: t.fCta, menu: t.fCtaMenu, href: path(lang, '/forum') + '#apply' }
      : page === 'award'
        ? { cta: t.aCta, menu: t.aCta, href: path(lang, '/award') + '#apply' }
        : { cta: t.hCta, menu: t.hCtaMenu, href: path(lang, '/') + '#join' }
  const links: [string, string][] = [
    [t.cNavCommunity, path(lang, '/')],
    [t.cNavForum, path(lang, '/forum')],
    [t.cNavAward, path(lang, '/award')],
  ]

  return (
    <div lang={lang} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', color: '#000', overflowX: 'clip' }}>
      <Header t={t} lang={lang} page={page} cta={cta.cta} ctaHref={cta.href} ctaMenu={cta.menu} />
      <main style={{ flex: 1 }}>
        <section style={{ maxWidth: '1440px', margin: '0 auto', padding: 'clamp(48px,8vw,128px) clamp(20px,4vw,64px)' }}>
          <div role="status" style={{ position: 'relative', maxWidth: '880px' }}>
            <span aria-hidden="true" style={{ display: 'block', width: '64px', height: '12px', background: accent }} />
            <h1 style={{ marginTop: '28px', fontFamily: W, fontWeight: 800, fontSize: 'clamp(34px,5vw,72px)', lineHeight: 0.98, letterSpacing: '-.03em', textTransform: 'uppercase' }}>{t.cSent}</h1>
            {text ? <p style={{ marginTop: '22px', maxWidth: '52ch', fontSize: 'clamp(17px,1.4vw,20px)', lineHeight: 1.55, color: '#2A2A28' }}>{text}</p> : null}
            {lead?.form === 'award_nomination' ? (
              <a href={path(lang, '/award') + '#apply'} className="hv-black" style={{ display: 'inline-flex', marginTop: '28px', fontFamily: W, fontWeight: 700, fontSize: '15px', borderBottom: '1px solid #000', paddingBottom: '4px' }}>
                {t.aAgain}
              </a>
            ) : null}
          </div>
          <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1px', marginTop: 'clamp(48px,6vw,88px)', background: '#E6E6E3', border: '1px solid #E6E6E3' }}>
            {links.map(([label, href], i) => (
              <a key={href} href={href} className="hv-bgyellow" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px', minHeight: '120px', padding: 'clamp(20px,2vw,28px)', background: '#fff', color: '#000', fontFamily: W, fontWeight: 800, fontSize: 'clamp(18px,1.6vw,24px)', letterSpacing: '-.02em', transition: 'background 200ms' }}>
                <span style={{ fontSize: '14px', color: '#1A52A0' }}>{'0' + (i + 1)}</span>
                <Arrow s={label} />
              </a>
            ))}
          </nav>
        </section>
      </main>
      <Footer t={t} lang={lang} />
    </div>
  )
}
