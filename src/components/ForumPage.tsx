'use client'

/* Форум 2026 (/forum) — макет design/Forum.dc.html
   (варианты макета по умолчанию: цепочка «Линия», темы «Графит»). */

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Dict } from '@/i18n/dict'
import type { Lang } from '@/i18n/links'
import { post } from '@/lib/submit'
import { Consent, EMAIL_RE, Footer, FormError, Header, INPUT, LABEL, W, no2 } from './am/ui'
import type { S } from './am/ui'
import Preloader from './Preloader'
import { speakerCards } from './am/speakers'
import type { SpeakerIn } from './am/speakers'

type Props = {
  t: Dict
  lang: Lang
  forumDate?: string
  countdownVisible?: boolean
  speakers?: SpeakerIn[]
}

const CAP: S = { fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#55554F' }
const H2: S = { fontFamily: W, fontWeight: 700, fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1.05, letterSpacing: '-.025em' }
const WRAP: S = { maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px,4vw,64px)' }
const BTN: S = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '14px', minHeight: '52px', padding: '0 26px', background: '#000', color: '#fff', fontFamily: W, fontWeight: 700, fontSize: '14px', textAlign: 'center', transition: 'background 200ms,color 200ms' }
const PILL: S = { display: 'inline-flex', alignItems: 'center', height: '32px', padding: '0 12px', border: '1px solid rgba(255,255,255,.5)', fontSize: '12px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }

const CHAIN_SQ = ['#E5D900', '#E8461E', '#1A52A0', '#000', '#E5D900', '#E8461E']
/** Уголок на картинке темы: цвета бренда, чёрный заменён оранжевым (вариант «Графит»). */
const TOPIC_ACC = ['#E8461E', '#1A52A0', '#E5D900', '#E8461E']
const PHOTOS = ['/img/fo-photo-panel.jpg', '/img/fo-photo-group.jpg', '/img/0c1ebc8a38.jpg', '/img/ec5233a8df.jpg']

const pad = (n: number) => String(n).padStart(2, '0')

export default function ForumPage({ t, lang, forumDate, countdownVisible = true, speakers }: Props) {
  const [track, setTrack] = useState<'guest' | 'partner'>('guest')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [v, setV] = useState<Record<string, string>>({})
  const [now, setNow] = useState(() => Date.now())
  const [prog, setProg] = useState(0)
  const progRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // заполнение шкалы программы по мере прокрутки
  useEffect(() => {
    let last = -1
    const onS = () => {
      const el = progRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height))
      if (Math.abs(p - last) > 0.004) {
        last = p
        setProg(p)
      }
    }
    window.addEventListener('scroll', onS, { passive: true })
    window.addEventListener('resize', onS)
    onS()
    return () => {
      window.removeEventListener('scroll', onS)
      window.removeEventListener('resize', onS)
    }
  }, [])

  const pickGuest = () => setTrack('guest')
  const pickPartner = () => setTrack('partner')
  const partner = track === 'partner'

  const target = new Date(forumDate || '2026-12-09T10:00:00+02:00').getTime()
  const sec = Math.max(0, target - now) / 1000
  const countdown = [
    [Math.floor(sec / 86400), t.fDays],
    [Math.floor((sec % 86400) / 3600), t.fHours],
    [Math.floor((sec % 3600) / 60), t.fMinutes],
    [Math.floor(sec % 60), t.fSeconds],
  ] as const

  const chain = [t.fChain1, t.fChain2, t.fChain3, t.fChain4, t.fChain5, t.fChain6]
  const topics = [
    [t.fTopic1Tag, t.fTopic1, t.fTopic1Text],
    [t.fTopic2Tag, t.fTopic2, t.fTopic2Text],
    [t.fTopic3Tag, t.fTopic3, t.fTopic3Text],
    [t.fTopic4Tag, t.fTopic4, t.fTopic4Text],
  ]
  const program = [t.fProg1, t.fProg2, t.fProg3, t.fProg4, t.fProg5, t.fProg6, t.fProg7, t.fProg8]
  const cards = speakerCards(speakers, lang)

  const fields = partner
    ? [
        { k: 'company', label: t.cCompanyName, type: 'text', auto: 'organization' },
        { k: 'name', label: t.cContactPerson, type: 'text', auto: 'name' },
        { k: 'phone', label: t.cFieldPhone, type: 'tel', auto: 'tel' },
        { k: 'email', label: t.cFieldEmail, type: 'email', auto: 'email' },
      ]
    : [
        { k: 'name', label: t.cFullName, type: 'text', auto: 'name' },
        { k: 'company', label: t.fCompanyRole, type: 'text', auto: 'organization' },
        { k: 'phone', label: t.cFieldPhone, type: 'tel', auto: 'tel' },
        { k: 'email', label: t.cFieldEmail, type: 'email', auto: 'email' },
      ]
  const set = (k: string) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const email = (v.email || '').trim()
    if (!EMAIL_RE.test(email)) {
      document.getElementById('am-apply-email')?.focus()
      return
    }
    setBusy(true)
    setError('')
    try {
      await post('forum-applications', { kind: partner ? 'Партнёр' : 'Участник', name: v.name, company: v.company, phone: v.phone, email }, lang)
      setSent(true)
    } catch {
      setError(t.cError)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div lang={lang} className="sel-orange" style={{ background: '#fff', color: '#000', overflowX: 'clip' }}>
      <Preloader label={t.cNavForum} accent="#E8461E" />
      <Header t={t} lang={lang} page="forum" cta={t.fCta} ctaHref="#apply" ctaMenu={t.fCtaMenu} onCta={pickGuest} />

      <main>
        <section className="am-split am-hero" style={{ display: 'grid', background: '#E8461E', color: '#fff' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: 'clamp(28px,3.4vw,48px) clamp(20px,4vw,64px) clamp(28px,3vw,44px) max(clamp(20px,4vw,64px),calc((100vw - 1440px)/2 + 64px))' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px 24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,.55)', fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>
              <span>{t.fDatePlace}</span>
              <span>{t.fSelection}</span>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <h1 style={{ fontFamily: W, fontWeight: 800, fontSize: 'clamp(36px,4.6vw,72px)', lineHeight: 0.94, letterSpacing: '-.03em', textTransform: 'uppercase' }}>
                Arch
                <br />
                Makers
                <br />
                Forum <span style={{ color: '#000' }}>2026</span>
              </h1>
              <p style={{ marginTop: '18px', maxWidth: '34ch', fontFamily: W, fontWeight: 700, fontSize: 'clamp(19px,1.6vw,24px)', lineHeight: 1.25, letterSpacing: '-.01em' }}>{t.fLead}</p>
              <p style={{ marginTop: '12px', maxWidth: '46ch', fontSize: '16px', fontWeight: 500, lineHeight: 1.55, color: '#fff' }}>{t.fText}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
                <a href="#apply" onClick={pickGuest} className="hv-white" style={BTN}>
                  {t.fCta}
                </a>
                <a href="#apply" onClick={pickPartner} className="hv-white" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '52px', padding: '0 26px', border: '1px solid #fff', color: '#fff', fontFamily: W, fontWeight: 700, fontSize: '14px', textAlign: 'center', transition: 'background 200ms,color 200ms' }}>
                  {t.fPartnerOffer}
                </a>
              </div>
            </div>
            {countdownVisible && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', borderTop: '1px solid #fff' }} aria-live="off">
                {countdown.map(([n, l], i) => (
                  <div key={i} style={{ padding: '16px 8px 0 0' }}>
                    <div suppressHydrationWarning style={{ fontFamily: W, fontWeight: 800, fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      {pad(n)}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>{l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="am-ar-f" style={{ position: 'relative', minHeight: '100%', background: '#F3F3F1', overflow: 'hidden' }}>
            <img src="/img/il-forum-hero.jpg" alt={t.fHeroAlt} fetchPriority="high" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'scaleX(-1)', objectFit: 'cover', display: 'block' }} />
          </div>
        </section>

        <section style={{ padding: 'clamp(48px,5vw,88px) 0' }}>
          <div style={WRAP}>
            <div style={CAP}>{t.fChainLabel}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px 64px', marginTop: '14px' }}>
              <div>
                <h2 style={{ maxWidth: '18ch', ...H2 }}>{t.fChainTitle}</h2>
              </div>
              <p style={{ maxWidth: '44ch', fontSize: '17px', lineHeight: 1.6, color: '#55554F' }}>{t.fChainText}</p>
            </div>
            <div className="am-g6 am-chain" style={{ display: 'grid', gap: '48px 0', marginTop: 'clamp(40px,4vw,64px)' }}>
              {chain.map((title, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', paddingRight: '24px' }}>
                  <div style={{ position: 'relative', height: '18px', marginRight: '-24px' }}>
                    <span className="am-chain-line" style={{ position: 'absolute', left: 0, top: '8px', height: '2px', background: '#000' }} />
                    <span style={{ position: 'absolute', left: 0, top: 0, width: '18px', height: '18px', background: CHAIN_SQ[i] }} />
                  </div>
                  <span style={{ marginTop: '28px', fontFamily: W, fontWeight: 800, fontSize: 'clamp(44px,4.4vw,72px)', lineHeight: 0.85, letterSpacing: '-.04em' }}>{no2(i)}</span>
                  <h3 style={{ marginTop: '20px', maxWidth: '14ch', fontFamily: W, fontWeight: 700, fontSize: 'clamp(17px,1.3vw,20px)', lineHeight: 1.2 }}>{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#000', color: '#fff' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'clamp(48px,5vw,80px) clamp(20px,4vw,64px) clamp(32px,4vw,56px)', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '24px 56px' }}>
            <div style={{ fontFamily: W, fontWeight: 800, fontSize: 'clamp(80px,11vw,168px)', lineHeight: 0.8, letterSpacing: '-.05em' }}>
              {t.fCount}
              <span style={{ color: '#E8461E' }}>+</span>
            </div>
            <p style={{ flex: '1 1 280px', maxWidth: '24ch', fontFamily: W, fontWeight: 700, fontSize: 'clamp(20px,2vw,30px)', lineHeight: 1.2 }}>{t.fCountText}</p>
          </div>
          <div className="am-g4p" style={{ display: 'grid', gap: '2px' }}>
            {PHOTOS.map((src, i) => (
              <div key={src} style={{ position: 'relative', aspectRatio: '4/3', background: '#1A1A1A', overflow: 'hidden' }}>
                <div className="am-zoom am-gray" style={{ position: 'absolute', inset: 0, filter: 'grayscale(1)' }}>
                  <img src={src} alt={t.fPhotoAlt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                {i === 3 && (
                  <>
                    <span aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: 0, width: '26%', height: '10%', background: '#E8461E', pointerEvents: 'none' }} />
                    <span aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: 0, width: '9%', height: '28%', background: '#E8461E', pointerEvents: 'none' }} />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: 'clamp(48px,5vw,88px) 0' }}>
          <div style={WRAP}>
            <h2 style={H2}>{t.fTopicsTitle}</h2>
            <div className="am-f2" style={{ display: 'grid', gap: '24px', marginTop: '32px' }}>
              {topics.map(([tag, title, text], i) => (
                <article key={i} className="am-card" style={{ display: 'flex', flexDirection: 'column', background: '#F3F3F1', color: '#000' }}>
                  <div className="am-zoom" style={{ position: 'relative', aspectRatio: '16/9', background: '#D9D9D6', overflow: 'hidden' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, zIndex: 1, width: '64px', height: '12px', background: TOPIC_ACC[i] }} />
                    <span aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, zIndex: 1, width: '12px', height: '64px', background: TOPIC_ACC[i] }} />
                    <img src={`/img/forum-topic-${i + 1}.jpg`} alt={tag} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 'clamp(24px,3vw,40px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', paddingBottom: '14px', borderBottom: '1px solid #000', fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                      <span style={{ color: '#E8461E' }}>{no2(i)}</span>
                    </div>
                    <h3 style={{ marginTop: '24px', maxWidth: '28ch', fontFamily: W, fontWeight: 700, fontSize: 'clamp(20px,1.8vw,28px)', lineHeight: 1.15, letterSpacing: '-.015em' }}>{title}</h3>
                    <p style={{ marginTop: 'auto', paddingTop: '24px', maxWidth: '52ch', fontSize: '16px', lineHeight: 1.55, fontWeight: 500 }}>{text}</p>
                  </div>
                </article>
              ))}
            </div>

            {cards.length > 0 && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px 48px', marginTop: 'clamp(56px,6vw,96px)' }}>
                  <h2 style={H2}>{t.fSpeakers}</h2>
                </div>
                <div className="am-g4p" style={{ display: 'grid', gap: '32px 24px', marginTop: '28px' }}>
                  {cards.map((s, i) => (
                    <div key={i} className="am-card" style={{ position: 'relative' }}>
                      <div className="am-zoom" style={{ position: 'relative', aspectRatio: '4/5', background: '#E4E4E2', overflow: 'hidden' }}>
                        {s.img ? (
                          <div className="am-gray" style={{ position: 'absolute', inset: 0, filter: 'grayscale(1)' }}>
                            {s.crop ? (
                              <img src={s.img} alt={s.name} loading="lazy" style={{ position: 'absolute', left: s.crop[0], top: s.crop[1], width: s.crop[2], maxWidth: 'none', height: 'auto', display: 'block' }} />
                            ) : (
                              <img src={s.img} alt={s.name} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', display: 'block' }} />
                            )}
                          </div>
                        ) : (
                          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 'clamp(16px,1.6vw,24px)', background: '#1A52A0', color: '#fff', fontFamily: W, fontWeight: 900, fontSize: 'clamp(56px,6vw,96px)', lineHeight: 0.85, letterSpacing: '-.04em' }}>
                            {s.initials}
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: '16px', paddingRight: '16px', fontFamily: W, fontWeight: 700, fontSize: '18px', lineHeight: 1.2 }}>{s.name}</div>
                      {s.role && <p style={{ marginTop: '6px', paddingRight: '16px', fontSize: '14px', lineHeight: 1.45, color: '#55554F' }}>{s.role}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section style={{ position: 'relative', overflow: 'hidden', padding: '0 0 clamp(48px,5vw,88px)' }}>
          <div style={{ position: 'relative', ...WRAP }}>
            <div className="am-split" style={{ display: 'grid', gap: '32px clamp(40px,6vw,112px)', alignItems: 'start', paddingTop: 'clamp(48px,5vw,72px)', borderTop: '1px solid #E6E6E3' }}>
              <div style={{ position: 'relative', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 'clamp(24px,3vw,40px)' }}>
                <div style={{ position: 'relative', padding: 'clamp(28px,3vw,48px) 0 clamp(28px,3vw,48px) clamp(28px,3vw,48px)' }}>
                  <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: 'clamp(56px,5vw,88px)', height: '12px', background: '#E8461E' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: '12px', height: 'clamp(56px,5vw,88px)', background: '#E8461E' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: 0, width: 'clamp(56px,5vw,88px)', height: '12px', background: '#000' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: 0, width: '12px', height: 'clamp(56px,5vw,88px)', background: '#000' }} />
                  <h2 style={{ fontFamily: W, fontWeight: 800, fontSize: 'clamp(40px,5.4vw,88px)', lineHeight: 0.92, letterSpacing: '-.04em', textTransform: 'uppercase' }}>
                    {t.fProgram1}
                    <br />
                    {t.fProgram2}
                  </h2>
                </div>
                <div className="am-prog-img" style={{ position: 'relative', flex: 1, background: '#E8461E', overflow: 'hidden' }}>
                  <img src="/img/fo-program-photo.jpg" alt={t.fProgramAlt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 70%', display: 'block' }} />
                </div>
              </div>
              <div ref={progRef} style={{ position: 'relative', borderTop: '2px solid #000' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: '6px', top: '36px', bottom: '36px', width: '2px', background: '#D9D9D6' }} />
                <span aria-hidden="true" style={{ position: 'absolute', left: '6px', top: '36px', width: '2px', height: 'calc((100% - 72px) * ' + prog.toFixed(3) + ')', maxHeight: 'calc(100% - 72px)', background: '#E8461E', transition: 'height 200ms linear' }} />
                {program.map((title, i) => {
                  const on = (i + 0.5) / program.length <= prog
                  return (
                    <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '24px 0 24px 44px', borderBottom: '1px solid #D9D9D6' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: '50%', width: '14px', height: '14px', marginTop: '-7px', background: on ? '#E8461E' : '#fff', border: '2px solid ' + (on ? '#E8461E' : '#C9C9C5'), transition: 'background 300ms,border-color 300ms' }} />
                      <h3 style={{ fontFamily: W, fontWeight: 700, fontSize: 'clamp(19px,1.7vw,26px)', lineHeight: 1.2, letterSpacing: '-.01em', color: on ? '#000' : '#8A8A86', transition: 'color 300ms' }}>{title}</h3>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="am-split" style={{ display: 'grid', background: '#1A52A0', color: '#fff' }}>
          <div className="am-ar-fside" style={{ position: 'relative', minHeight: '100%', background: '#123C78', overflow: 'hidden' }}>
            <img src="/img/il-facade.jpg" alt={t.fFacadeAlt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: 'clamp(40px,4.4vw,72px) max(clamp(20px,4vw,64px),calc((100vw - 1440px)/2 + 64px)) clamp(40px,4.4vw,72px) clamp(20px,4vw,64px)' }}>
            <div style={{ ...CAP, color: '#C8D6EC' }}>{t.fPartnersLabel}</div>
            <h2 style={{ marginTop: '14px', maxWidth: '16ch', ...H2 }}>{t.fPartnersTitle}</h2>
            <p style={{ marginTop: '24px', maxWidth: '40ch', fontSize: 'clamp(18px,1.4vw,21px)', lineHeight: 1.5 }}>{t.fPartnersText}</p>
            <div style={{ marginTop: '36px', paddingTop: '18px', borderTop: '1px solid #fff', display: 'grid', gridTemplateColumns: '44px minmax(0,1fr)', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#E5D900' }}>01</span>
              <span style={{ fontSize: '17px', lineHeight: 1.45 }}>{t.fBenefit1}</span>
            </div>
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #fff', display: 'grid', gridTemplateColumns: '44px minmax(0,1fr)', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#E5D900' }}>02</span>
              <div>
                <div style={{ fontSize: '17px', lineHeight: 1.45 }}>{t.fBenefit2}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                  <span style={PILL}>{t.fBefore}</span>
                  <span style={PILL}>{t.fDuring}</span>
                  <span style={PILL}>{t.fAfter}</span>
                </div>
              </div>
            </div>
            <a href="#apply" onClick={pickPartner} className="hv-yellow" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '14px', minHeight: '56px', marginTop: '40px', padding: '0 28px', background: '#fff', color: '#000', fontFamily: W, fontWeight: 700, fontSize: '14px', textAlign: 'center', transition: 'background 200ms' }}>
              {t.fGetOffer}
            </a>
          </div>
        </section>

        <section id="apply" style={{ padding: 'clamp(48px,5vw,88px) 0' }}>
          <div className="am-split" style={{ ...WRAP, display: 'grid', gap: 'clamp(40px,6vw,112px)', alignItems: 'start' }}>
            <div>
              <h2 style={{ maxWidth: '14ch', ...H2 }}>{t.fApplyTitle}</h2>
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #000', fontFamily: W, fontWeight: 700, fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.3 }}>
                {t.fApplyDate}
                <br />
                <span style={{ color: '#55554F' }}>{t.fApplyPlace}</span>
              </div>
            </div>
            <div style={{ position: 'relative', background: '#F3F3F1', padding: 'clamp(24px,3.4vw,56px)' }}>
              <span aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, width: '64px', height: '12px', background: '#E8461E' }} />
              <span aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, width: '12px', height: '64px', background: '#E8461E' }} />
              {sent ? (
                <div role="status" style={{ padding: '32px 0' }}>
                  <div style={{ fontFamily: W, fontWeight: 700, fontSize: '28px' }}>{t.cSent}</div>
                  <p style={{ marginTop: '14px', fontSize: '16px', lineHeight: 1.6, color: '#55554F' }}>{t.fSentText}</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div role="radiogroup" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', border: '1px solid #000', maxWidth: '420px' }}>
                    <button type="button" role="radio" aria-checked={!partner} onClick={pickGuest} style={{ height: '48px', border: 0, cursor: 'pointer', fontFamily: W, fontWeight: 700, fontSize: '13px', background: partner ? '#fff' : '#000', color: partner ? '#000' : '#fff' }}>
                      {t.fGuest}
                    </button>
                    <button type="button" role="radio" aria-checked={partner} onClick={pickPartner} style={{ height: '48px', border: 0, cursor: 'pointer', fontFamily: W, fontWeight: 700, fontSize: '13px', background: partner ? '#000' : '#fff', color: partner ? '#fff' : '#000' }}>
                      {t.cPartner}
                    </button>
                  </div>
                  <div className="am-f2" style={{ display: 'grid', gap: '24px 32px', marginTop: '36px' }}>
                    {fields.map((f) => (
                      <label key={track + f.k} style={{ display: 'block' }}>
                        <span style={LABEL}>{f.label}</span>
                        <input id={'am-apply-' + f.k} name={f.k} required type={f.type} autoComplete={f.auto} value={v[f.k] || ''} onChange={set(f.k)} className="fc-orange" style={INPUT} />
                      </label>
                    ))}
                  </div>
                  <button type="submit" disabled={busy} className="hv-orange" style={{ marginTop: '40px', ...BTN, border: 0, cursor: busy ? 'wait' : 'pointer' }}>
                    {busy ? t.cSending : partner ? t.fGetOffer : t.fCta}
                  </button>
                  <FormError>{error}</FormError>
                  <Consent t={t} lang={lang} />
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} lang={lang} />
    </div>
  )
}
