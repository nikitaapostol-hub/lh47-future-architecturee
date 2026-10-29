'use client'

/* Сообщество (/) — макет design/Community.dc.html. */

import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Dict } from '@/i18n/dict'
import type { Lang } from '@/i18n/links'
import { checkForm, hpValue, post, thanks } from '@/lib/submit'
import { Arrow, Consent, EMAIL_RE, Footer, FormError, Header, Honeypot, INPUT, LABEL, W, no2 } from './am/ui'
import type { S } from './am/ui'
import Preloader from './Preloader'

type Props = { t: Dict; lang: Lang }

const CAP: S = { fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#55554F' }
const H2: S = { marginTop: '14px', fontFamily: W, fontWeight: 700, fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1.05, letterSpacing: '-.025em' }
const BTN: S = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '14px', minHeight: '52px', padding: '0 26px', background: '#000', color: '#fff', fontFamily: W, fontWeight: 700, fontSize: '14px', textAlign: 'center', transition: 'background 200ms' }
const WRAP: S = { maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px,4vw,64px)' }

type Track = 'resident' | 'partner'
type FieldDef = { k: string; label: string; type: string; ph: string; wide: boolean; auto?: string }

export default function CommunityPage({ t, lang }: Props) {
  const [track, setTrack] = useState<Track>('resident')
  const [emp, setEmp] = useState<'' | 'self' | 'company'>('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [v, setV] = useState<Record<string, string>>({})

  const pickResident = () => setTrack('resident')
  const pickPartner = () => setTrack('partner')
  const isResident = track === 'resident'

  const residentBenefits = [
    [t.hRBen1, t.hRBen1Text],
    [t.hRBen2, t.hRBen2Text],
    [t.hRBen3, t.hRBen3Text],
  ]
  const partnerBenefits = [
    [t.hPBen1, t.hPBen1Text],
    [t.hPBen2, t.hPBen2Text],
    [t.hPBen3, t.hPBen3Text],
  ]
  const formats = [
    [t.hFormat1, t.hFormat1Text],
    [t.hFormat2, t.hFormat2Text],
    [t.hFormat3, t.hFormat3Text],
    [t.hFormat4, t.hFormat4Text],
    [t.hFormat5, t.hFormat5Text],
    [t.hFormat6, t.hFormat6Text],
    [t.hFormat7, t.hFormat7Text],
    [t.hFormat8, t.hFormat8Text],
    [t.hFormat9, t.hFormat9Text],
  ]

  const fields: FieldDef[] = isResident
    ? [
        { k: 'name', label: t.cFullName, type: 'text', ph: '', wide: true, auto: 'name' },
        { k: 'role', label: t.hProfession, type: 'text', ph: t.hProfessionPh, wide: true, auto: 'organization-title' },
        { k: 'phone', label: t.cFieldPhone, type: 'tel', ph: '+373', wide: false, auto: 'tel' },
        { k: 'email', label: t.cFieldEmail, type: 'email', ph: '', wide: false, auto: 'email' },
      ]
    : [
        { k: 'company', label: t.cCompanyName, type: 'text', ph: '', wide: true, auto: 'organization' },
        { k: 'field', label: t.hField, type: 'text', ph: '', wide: false },
        { k: 'website', label: t.hSite, type: 'url', ph: 'https://', wide: false, auto: 'url' },
        { k: 'name', label: t.cContactPerson, type: 'text', ph: '', wide: true, auto: 'name' },
        { k: 'phone', label: t.cFieldPhone, type: 'tel', ph: '+373', wide: false, auto: 'tel' },
        { k: 'email', label: t.cFieldEmail, type: 'email', ph: '', wide: false, auto: 'email' },
      ]

  const set = (k: string) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const form = e.currentTarget as HTMLFormElement
    if (!checkForm(form, lang)) return
    const email = (v.email || '').trim()
    if (!EMAIL_RE.test(email)) {
      document.getElementById('am-join-email')?.focus()
      return
    }
    setBusy(true)
    setError('')
    const body = isResident
      ? {
          track: 'Резидент',
          name: v.name,
          role: v.role,
          phone: v.phone,
          email,
          employment: emp === 'self' ? 'Работает на себя' : emp === 'company' ? 'Работает в компании' : '',
          company: emp ? v.company || '' : '',
        }
      : {
          track: 'Партнёр',
          company: v.company,
          field: v.field,
          website: v.website,
          name: v.name,
          phone: v.phone,
          email,
        }
    try {
      await post('community-applications', { ...body, hp: hpValue(form) }, lang)
      setSent(true)
      thanks(isResident ? 'community_resident' : 'community_partner', lang)
    } catch {
      setError(t.cError)
    } finally {
      setBusy(false)
    }
  }

  const compLabel = emp === 'company' ? t.hWhichCompany : t.hStudioName
  const compPh = emp === 'company' ? t.cCompanyName : t.hOptional

  return (
    <div lang={lang} className="sel-blue" style={{ background: '#fff', color: '#000', overflowX: 'clip' }}>
      <Preloader label={t.cNavCommunity} accent="#1A52A0" />
      <Header t={t} lang={lang} page="home" cta={t.hCta} ctaHref="#join" ctaMenu={t.hCtaMenu} />

      <main>
        <section className="am-split am-hero" style={{ display: 'grid', borderBottom: '1px solid #E6E6E3' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: 'clamp(28px,3.4vw,48px) clamp(20px,4vw,64px) clamp(28px,3vw,44px) max(clamp(20px,4vw,64px),calc((100vw - 1440px)/2 + 64px))' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px 24px', paddingBottom: '16px', borderBottom: '1px solid #E6E6E3', ...CAP }}>
              <span>{t.hEyebrow}</span>
              <span style={{ color: '#1A52A0' }}>{t.hPlace}</span>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <h1 style={{ fontFamily: W, fontWeight: 800, fontSize: 'clamp(38px,5vw,80px)', lineHeight: 0.92, letterSpacing: '-.035em', textTransform: 'uppercase' }}>
                Future
                <br />
                Architecture
              </h1>
              <p style={{ marginTop: '18px', maxWidth: '36ch', fontSize: 'clamp(16px,1.3vw,19px)', lineHeight: 1.45, color: '#2A2A28' }}>{t.hLead}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '28px' }}>
                <a href="#join" onClick={pickResident} className="hv-blue" style={BTN}>
                  {t.hBeResident}
                </a>
                <a href="#join" onClick={pickPartner} className="hv-black" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '52px', padding: '0 26px', border: '1px solid #000', fontFamily: W, fontWeight: 700, fontSize: '14px', textAlign: 'center', transition: 'background 200ms,color 200ms' }}>
                  {t.hBePartner}
                </a>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', fontSize: '13px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#55554F' }}>
              <span>{t.hWord1}</span>
              <span style={{ color: '#C9C9C5' }}>/</span>
              <span>{t.hWord2}</span>
              <span style={{ color: '#C9C9C5' }}>/</span>
              <span>{t.hWord3}</span>
            </div>
          </div>
          <div className="am-ar-c" style={{ position: 'relative', minHeight: '100%', background: '#F3F3F1', overflow: 'hidden' }}>
            <img src="/img/il-community-hero.jpg" alt={t.hHeroAlt} fetchPriority="high" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </section>

        {/* Старт в 2027 и предпродажа — сразу под первым экраном, спокойно, в цветах сайта */}
        <section aria-labelledby="am-presale" style={{ background: '#F3F3F1', color: '#000', borderBottom: '1px solid #E6E6E3' }}>
          <div className="am-split" style={{ ...WRAP, display: 'grid', gap: '20px clamp(40px,6vw,112px)', alignItems: 'end', paddingTop: 'clamp(28px,3.2vw,52px)', paddingBottom: 'clamp(28px,3.2vw,52px)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...CAP }}>
                <span aria-hidden="true" style={{ width: '10px', height: '10px', background: '#E5D900' }} />
                {t.hPresaleLabel}
              </div>
              <h2 id="am-presale" style={{ marginTop: '14px', maxWidth: '18ch', fontFamily: W, fontWeight: 800, fontSize: 'clamp(24px,2.4vw,36px)', lineHeight: 1.04, letterSpacing: '-.03em' }}>{t.hPresaleTitle}</h2>
            </div>
            <div>
              <p style={{ maxWidth: '46ch', fontSize: '16px', lineHeight: 1.6, color: '#3A3A37' }}>{t.hPresaleText}</p>
              <a href="#join" onClick={pickResident} className="am-link" style={{ display: 'inline-block', marginTop: '16px', fontFamily: W, fontWeight: 700, fontSize: '14px' }}>
                <Arrow s={t.hPresaleCta + ' →'} line />
              </a>
            </div>
          </div>
        </section>

        <section style={{ position: 'relative', overflow: 'hidden', background: '#000', color: '#fff', padding: 'clamp(56px,6vw,104px) 0 calc(min(11vw,150px) + clamp(32px,4vw,56px))' }}>
          {/* жёлтый уголок — в пустом поле под текстом, ни с чем не пересекается */}
          <span aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: 0, width: 'min(20vw,280px)', height: 'min(4vw,56px)', background: '#E5D900', pointerEvents: 'none' }} />
          <span aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: 0, width: 'min(4vw,56px)', height: 'min(11vw,150px)', background: '#E5D900', pointerEvents: 'none' }} />
          <div className="am-split" style={{ position: 'relative', ...WRAP, display: 'grid', gap: '24px clamp(40px,6vw,112px)', alignItems: 'start' }}>
            <h2 style={{ maxWidth: '14ch', fontFamily: W, fontWeight: 800, fontSize: 'clamp(32px,4vw,60px)', lineHeight: 1.02, letterSpacing: '-.03em' }}>{t.hMissionTitle}</h2>
            <p style={{ maxWidth: '40ch', paddingTop: 'clamp(0px,0.6vw,10px)', fontSize: 'clamp(18px,1.55vw,22px)', lineHeight: 1.55, color: '#C9C9C5' }}>{t.hMissionText}</p>
          </div>
        </section>

        <section style={{ padding: 'clamp(48px,5vw,88px) 0' }}>
          <div style={WRAP}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px 64px' }}>
              <h2 style={{ ...H2, marginTop: 0 }}>{t.hWhoTitle}</h2>
              <p style={{ maxWidth: '44ch', fontSize: '17px', lineHeight: 1.6, color: '#55554F' }}>{t.hWhoNote}</p>
            </div>
            <div className="am-g2 am-who" style={{ display: 'grid', gap: '24px', marginTop: '32px' }}>
              <WhoCard
                dark={false}
                img="/img/il-residents.jpg"
                alt={t.hResidentsAlt}
                label={t.hResidents}
                title={t.hResidentsTitle}
                text={t.hResidentsText}
                benefitsLabel={t.hBenefitsLabel}
                benefits={residentBenefits}
                link={t.hBeResidentArrow}
                onLink={pickResident}
              />
              <WhoCard
                dark
                img="/img/il-partners.jpg"
                alt={t.hPartnersAlt}
                label={t.hPartners}
                title={t.hPartnersTitle}
                text={t.hPartnersText}
                benefitsLabel={t.hBenefitsLabel}
                benefits={partnerBenefits}
                link={t.hBePartnerArrow}
                onLink={pickPartner}
              />
            </div>
          </div>
        </section>

        <section style={{ padding: '0 0 clamp(48px,5vw,88px)' }}>
          <div style={WRAP}>
            <div style={{ paddingTop: 'clamp(48px,5vw,72px)', borderTop: '1px solid #E6E6E3' }}>
              <h2 style={{ ...H2, marginTop: 0 }}>{t.hFormatsTitle}</h2>
            </div>
            <div className="am-g3" style={{ display: 'grid', marginTop: '32px', borderTop: '1px solid #000', borderLeft: '1px solid #E6E6E3' }}>
              {formats.map(([title, text], i) => (
                <article key={i} className="hv-bgblue" style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '150px', padding: '24px', borderRight: '1px solid #E6E6E3', borderBottom: '1px solid #E6E6E3', transition: 'background 240ms,color 240ms' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '.06em' }}>{no2(i)}</span>
                  <h3 style={{ marginTop: 'auto', fontFamily: W, fontWeight: 700, fontSize: '21px', lineHeight: 1.15 }}>{title}</h3>
                  <p style={{ maxWidth: '36ch', fontSize: '15px', lineHeight: 1.55, opacity: 0.78 }}>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Founders t={t} />

        <section id="join" style={{ background: '#F3F3F1', padding: 'clamp(48px,5vw,88px) 0' }}>
          <div className="am-split" style={{ ...WRAP, display: 'grid', gap: 'clamp(40px,6vw,112px)', alignItems: 'start' }}>
            <div>
              <h2 style={{ ...H2, marginTop: 0 }}>{t.hJoinTitle}</h2>
              <p style={{ marginTop: '24px', maxWidth: '42ch', fontSize: '17px', lineHeight: 1.6, color: '#3A3A37' }}>{t.hJoinText}</p>
              <div style={{ marginTop: '40px', borderTop: '1px solid #000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '16px 0', borderBottom: '1px solid #DADAD6', fontSize: '15px' }}>
                  <span style={{ color: '#55554F' }}>{t.hResidents}</span>
                  <span style={{ textAlign: 'right' }}>{t.hResidentsTitle}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '16px 0', borderBottom: '1px solid #DADAD6', fontSize: '15px' }}>
                  <span style={{ color: '#55554F' }}>{t.hPartners}</span>
                  <span style={{ textAlign: 'right' }}>{t.hPartnersShort}</span>
                </div>
              </div>
            </div>
            <div style={{ position: 'relative', background: '#fff', padding: 'clamp(24px,3.4vw,56px)' }}>
              <span aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, width: '64px', height: '12px', background: '#1A52A0' }} />
              <span aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, width: '12px', height: '64px', background: '#1A52A0' }} />
              {sent ? (
                <div role="status" style={{ padding: '32px 0' }}>
                  <div style={{ fontFamily: W, fontWeight: 700, fontSize: '28px' }}>{t.cSent}</div>
                  <p style={{ marginTop: '14px', fontSize: '16px', lineHeight: 1.6, color: '#55554F' }}>{t.hSentText}</p>
                </div>
              ) : (
                <form onSubmit={submit} style={{ position: 'relative' }}>
                  <Honeypot />
                  <div role="radiogroup" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', border: '1px solid #000', maxWidth: '420px' }}>
                    <button type="button" role="radio" aria-checked={isResident} onClick={pickResident} style={{ height: '48px', border: 0, cursor: 'pointer', fontFamily: W, fontWeight: 700, fontSize: '13px', background: isResident ? '#000' : '#fff', color: isResident ? '#fff' : '#000' }}>
                      {t.hResident}
                    </button>
                    <button type="button" role="radio" aria-checked={!isResident} onClick={pickPartner} style={{ height: '48px', border: 0, cursor: 'pointer', fontFamily: W, fontWeight: 700, fontSize: '13px', background: isResident ? '#fff' : '#1A52A0', color: isResident ? '#000' : '#fff' }}>
                      {t.cPartner}
                    </button>
                  </div>
                  <div className="am-f2" style={{ display: 'grid', gap: '24px 32px', marginTop: '36px' }}>
                    {fields.map((f) => (
                      <label key={track + f.k} style={{ display: 'block', gridColumn: f.wide ? '1/-1' : 'auto' }}>
                        <span style={LABEL}>{f.label}</span>
                        <input
                          id={'am-join-' + f.k}
                          name={f.k}
                          required
                          type={f.type}
                          placeholder={f.ph}
                          autoComplete={f.auto}
                          value={v[f.k] || ''}
                          onChange={set(f.k)}
                          className="fc-blue"
                          style={INPUT}
                        />
                      </label>
                    ))}
                    {isResident && (
                      <div style={{ gridColumn: '1/-1' }}>
                        <span style={LABEL}>{t.hEmpQuestion}</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                          {([['self', t.hEmpSelf], ['company', t.hEmpCompany]] as const).map(([k, label]) => {
                            const on = emp === k
                            return (
                              <button key={k} type="button" aria-pressed={on} onClick={() => setEmp(k)} style={{ height: '44px', padding: '0 18px', border: '1px solid ' + (on ? '#000' : '#C9C9C5'), background: on ? '#000' : 'transparent', color: on ? '#fff' : '#000', cursor: 'pointer', fontSize: '15px' }}>
                                {label}
                              </button>
                            )
                          })}
                        </div>
                        {emp && (
                          <label style={{ display: 'block', marginTop: '20px' }}>
                            <span style={LABEL}>{compLabel}</span>
                            <input name="company" required={emp === 'company'} type="text" placeholder={compPh} autoComplete="organization" value={v.company || ''} onChange={set('company')} className="fc-blue" style={INPUT} />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={busy} className="hv-blue" style={{ marginTop: '40px', ...BTN, border: 0, cursor: busy ? 'wait' : 'pointer' }}>
                    {busy ? t.cSending : <Arrow s={(isResident ? t.cSendApplication : t.hSendPartner) + ' →'} />}
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

/** «Люди за идеей» — основатели сообщества (макет design_handoff_founders, в шрифтах и цветах сайта).
    Вторая карточка зеркальная: текст сверху, фото снизу; на телефоне обе — фото сверху. */
function Founders({ t }: { t: Dict }) {
  const people = [
    {
      no: '01',
      tag: t.hFd1Tag,
      first: t.hFd1First,
      name: t.hFd1Name,
      role: t.hFd1Role,
      img: '/img/fd-myrza.jpg',
      stats: [
        [t.hFd1N1, t.hFd1C1],
        [t.hFd1N2, t.hFd1C2],
        [t.hFd1N3, t.hFd1C3],
        [t.hFd1N4, t.hFd1C4],
      ],
      quote: t.hFd1Quote,
      href: 'https://lh47arch.com/',
      link: t.hFd1Link,
      reverse: false,
    },
    {
      no: '02',
      tag: t.hFd2Tag,
      first: t.hFd2First,
      name: t.hFd2Name,
      role: t.hFd2Role,
      img: '/img/fd-okulskaya.jpg',
      stats: [
        [t.hFd2N1, t.hFd2C1],
        [t.hFd2N2, t.hFd2C2],
        [t.hFd2N3, t.hFd2C3],
      ],
      quote: t.hFd2Quote,
      href: 'https://instylehome.md/',
      link: t.hFd2Link,
      reverse: true,
    },
  ]
  return (
    <section id="founders" aria-labelledby="am-founders" style={{ padding: '0 0 clamp(56px,6vw,112px)' }}>
      <div style={WRAP}>
        <div className="am-split" style={{ display: 'grid', gap: '20px clamp(40px,6vw,112px)', alignItems: 'end', paddingTop: 'clamp(48px,5vw,72px)', paddingBottom: '28px', borderTop: '1px solid #E6E6E3', borderBottom: '1px solid #000' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...CAP }}>
              <span aria-hidden="true" style={{ width: '10px', height: '10px', background: '#1A52A0' }} />
              {t.hFdEyebrow}
            </div>
            <h2 id="am-founders" style={{ marginTop: '16px', fontFamily: W, fontWeight: 800, fontSize: 'clamp(38px,5.6vw,88px)', lineHeight: 0.95, letterSpacing: '-.04em' }}>{t.hFdTitle}</h2>
          </div>
          <div style={{ maxWidth: '520px' }}>
            <p style={{ fontFamily: W, fontWeight: 700, fontSize: 'clamp(20px,1.9vw,28px)', lineHeight: 1.2, letterSpacing: '-.02em' }}>{t.hFdLead}</p>
            <p style={{ marginTop: '10px', fontSize: '17px', lineHeight: 1.55, color: '#55554F' }}>{t.hFdSub}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(56px,6vw,104px)', marginTop: 'clamp(40px,5vw,72px)' }}>
          {people.map((p) => (
            <article key={p.no} className={'am-g2 am-fd' + (p.reverse ? ' am-fd-rev' : '')} style={{ display: 'grid', gap: '32px clamp(24px,4vw,64px)', alignItems: 'center' }}>
              <a href={p.href} target="_blank" rel="noopener" className="am-zoom" style={{ position: 'relative', display: 'block', aspectRatio: '4/5', overflow: 'hidden', background: '#E6E6E3' }}>
                <img src={p.img} alt={p.name} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 0%', display: 'block', filter: 'grayscale(1) contrast(1.04)' }} />
                <span style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '12px', padding: '8px 12px', background: '#fff', color: '#000', whiteSpace: 'nowrap', ...CAP }}>
                  <span style={{ color: '#1A52A0' }}>{p.no}</span>
                  <span style={{ color: '#000' }}>{p.tag}</span>
                </span>
                <span aria-hidden="true" style={{ position: 'absolute', left: '20px', right: '20px', bottom: '16px', fontFamily: W, fontWeight: 800, fontSize: 'clamp(44px,5.6vw,92px)', lineHeight: 0.85, letterSpacing: '-.04em', color: '#fff', mixBlendMode: 'difference' }}>{p.first}</span>
              </a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
                <div>
                  <h3 style={{ fontFamily: W, fontWeight: 700, fontSize: 'clamp(26px,2.6vw,38px)', lineHeight: 1.05, letterSpacing: '-.03em' }}>{p.name}</h3>
                  <p style={{ marginTop: '14px', maxWidth: '54ch', fontSize: '17px', lineHeight: 1.55, color: '#3A3A37' }}>{p.role}</p>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', borderTop: '1px solid #000' }}>
                  {p.stats.map(([n, c]) => (
                    <li key={n + c} style={{ display: 'grid', gridTemplateColumns: 'clamp(92px,10vw,140px) minmax(0,1fr)', gap: '20px', alignItems: 'baseline', padding: '16px 0', borderBottom: '1px solid #E6E6E3' }}>
                      <span style={{ fontFamily: W, fontWeight: 700, fontSize: 'clamp(28px,2.8vw,40px)', lineHeight: 1, letterSpacing: '-.03em' }}>{n}</span>
                      <span style={{ fontSize: '15px', lineHeight: 1.4, color: '#3A3A37' }}>{c}</span>
                    </li>
                  ))}
                </ul>
                <blockquote style={{ margin: 0, maxWidth: '30ch', paddingLeft: '18px', borderLeft: '3px solid #E5D900', fontFamily: W, fontWeight: 700, fontSize: 'clamp(19px,1.7vw,23px)', lineHeight: 1.3, letterSpacing: '-.01em' }}>{p.quote}</blockquote>
                <a href={p.href} target="_blank" rel="noopener" className="am-link" style={{ alignSelf: 'flex-start', fontFamily: W, fontWeight: 700, fontSize: '14px' }}>
                  <Arrow s={p.link + ' ↗'} line />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: 'clamp(64px,8vw,128px)', textAlign: 'center' }}>
          <span style={CAP}>{t.hFdMissionLabel}</span>
          <p style={{ display: 'flex', flexDirection: 'column', gap: '.1em', maxWidth: '1100px', fontFamily: W, fontWeight: 700, fontSize: 'clamp(22px,2.6vw,38px)', lineHeight: 1.2, letterSpacing: '-.03em', textWrap: 'balance' }}>
            <span>{t.hFdMission1}</span>
            <span style={{ color: '#8A8A85' }}>{t.hFdMission2}</span>
          </p>
        </div>
      </div>
    </section>
  )
}

/** Карточка «Резиденты» / «Партнёры»: кто это, коротко и что даёт сообщество.
    Строки двух карточек выровнены между собой (subgrid в .am-who). */
function WhoCard(p: {
  dark: boolean
  img: string
  alt: string
  label: string
  title: string
  text: string
  benefitsLabel: string
  benefits: string[][]
  link: string
  onLink: () => void
}) {
  const PAD = 'clamp(24px,3vw,44px)'
  const ink = p.dark ? '#fff' : '#000'
  const soft = p.dark ? '#DCE5F3' : '#3A3A37'
  const line = p.dark ? 'rgba(255,255,255,.28)' : '#DADAD6'
  const accent = p.dark ? '#E5D900' : '#1A52A0'
  return (
    <article className="am-card" style={{ display: 'flex', flexDirection: 'column', background: p.dark ? '#1A52A0' : '#F3F3F1', color: ink }}>
      <div className="am-zoom" style={{ position: 'relative', aspectRatio: '2/1', overflow: 'hidden', background: p.dark ? '#123C78' : '#D9D9D6' }}>
        <img src={p.img} alt={p.alt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: `${PAD} ${PAD} 0` }}>
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>{p.label}</div>
        <h3 style={{ marginTop: '20px', maxWidth: '22ch', fontFamily: W, fontWeight: 700, fontSize: 'clamp(24px,2.2vw,34px)', lineHeight: 1.1, letterSpacing: '-.02em' }}>{p.title}</h3>
      </div>
      <p style={{ padding: `16px ${PAD} 0`, maxWidth: 'calc(46ch + 88px)', fontSize: '17px', lineHeight: 1.55, color: soft }}>{p.text}</p>
      <div style={{ padding: `32px ${PAD} 0` }}>
        <div style={{ paddingBottom: '12px', borderBottom: '1px solid ' + ink, fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: p.dark ? '#fff' : '#55554F' }}>{p.benefitsLabel}</div>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {p.benefits.map(([title, text], i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '40px minmax(0,1fr)', gap: '8px', padding: '18px 0', borderBottom: '1px solid ' + line }}>
              <span style={{ fontWeight: 600, fontSize: '15px', lineHeight: 1.5, color: accent }}>{no2(i)}</span>
              <span>
                <span style={{ display: 'block', fontFamily: W, fontWeight: 700, fontSize: '18px', lineHeight: 1.3 }}>{title}</span>
                <span style={{ display: 'block', marginTop: '6px', fontSize: '15px', lineHeight: 1.55, color: soft }}>{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', padding: `32px ${PAD} ${PAD}` }}>
        <a href="#join" onClick={p.onLink} className="am-link" style={{ fontFamily: W, fontWeight: 700, fontSize: '14px', color: ink }}>
          <Arrow s={p.link} line />
        </a>
      </div>
    </article>
  )
}
