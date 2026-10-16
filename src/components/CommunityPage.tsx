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

        {/* Старт в 2027 и предпродажа — сразу под первым экраном */}
        <section aria-labelledby="am-presale" style={{ position: 'relative', overflow: 'hidden', background: '#E5D900', color: '#000' }}>
          <span aria-hidden="true" className="am-presale-year" style={{ position: 'absolute', right: 'clamp(-12px,-1vw,0px)', bottom: '-0.2em', fontFamily: W, fontWeight: 900, fontSize: 'clamp(120px,19vw,300px)', lineHeight: 0.8, letterSpacing: '-.06em', color: 'rgba(0,0,0,.07)', pointerEvents: 'none', userSelect: 'none' }}>
            2027
          </span>
          <div className="am-split" style={{ position: 'relative', ...WRAP, display: 'grid', gap: '20px clamp(40px,6vw,112px)', alignItems: 'end', padding: 'clamp(36px,4vw,64px) clamp(20px,4vw,64px)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                <span aria-hidden="true" style={{ width: '10px', height: '10px', background: '#000' }} />
                {t.hPresaleLabel}
              </div>
              <h2 id="am-presale" style={{ marginTop: '16px', maxWidth: '16ch', fontFamily: W, fontWeight: 800, fontSize: 'clamp(28px,3.4vw,52px)', lineHeight: 1.02, letterSpacing: '-.03em' }}>{t.hPresaleTitle}</h2>
            </div>
            <div>
              <p style={{ maxWidth: '44ch', fontSize: 'clamp(17px,1.35vw,20px)', lineHeight: 1.5 }}>{t.hPresaleText}</p>
              <a href="#join" onClick={pickResident} className="hv-blue" style={{ ...BTN, marginTop: '24px' }}>
                <Arrow s={t.hPresaleCta + ' →'} />
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
