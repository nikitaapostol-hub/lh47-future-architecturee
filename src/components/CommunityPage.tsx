'use client'

/* Сообщество (/) — макет design/Community.dc.html. */

import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Dict } from '@/i18n/dict'
import type { Lang } from '@/i18n/links'
import { post } from '@/lib/submit'
import { Consent, EMAIL_RE, Footer, FormError, Header, INPUT, LABEL, W, no2 } from './am/ui'
import type { S } from './am/ui'

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

  const values = [
    [t.hValue1, t.hValue1Text],
    [t.hValue2, t.hValue2Text],
    [t.hValue3, t.hValue3Text],
    [t.hValue4, t.hValue4Text],
  ]
  const perks = [t.hPerk1, t.hPerk2, t.hPerk3, t.hPerk4, t.hPerk5]
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
      await post('community-applications', body, lang)
      setSent(true)
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
      <Header t={t} lang={lang} page="home" cta={t.hCta} ctaHref="#join" ctaMenu={t.hCtaMenu} />

      <main>
        <section className="am-split am-hero" style={{ display: 'grid', borderBottom: '1px solid #E6E6E3' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: 'clamp(28px,3.4vw,48px) clamp(20px,4vw,64px) clamp(28px,3vw,44px) max(clamp(20px,4vw,64px),calc((100vw - 1440px)/2 + 64px))' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px 24px', paddingBottom: '16px', borderBottom: '1px solid #E6E6E3', ...CAP }}>
              <span>{t.hEyebrow}</span>
              <span style={{ color: '#1A52A0' }}>{t.hPlace}</span>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <h1 style={{ fontFamily: W, fontWeight: 800, fontSize: 'clamp(40px,5.6vw,92px)', lineHeight: 0.9, letterSpacing: '-.035em', textTransform: 'uppercase' }}>
                Arch
                <br />
                Makers
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

        <section style={{ position: 'relative', overflow: 'hidden', background: '#000', color: '#fff', padding: 'clamp(48px,5vw,88px) 0' }}>
          <span aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: 0, width: 'min(20vw,280px)', height: 'min(5vw,64px)', background: '#E5D900', pointerEvents: 'none' }} />
          <span aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: 0, width: 'min(5vw,64px)', height: 'min(16vw,220px)', background: '#E5D900', pointerEvents: 'none' }} />
          <div className="am-split" style={{ position: 'relative', ...WRAP, display: 'grid', gap: '40px clamp(40px,6vw,112px)', alignItems: 'start' }}>
            <div>
              <div style={{ ...CAP, color: '#9A9A96' }}>{t.hMissionLabel}</div>
              <h2 style={{ marginTop: '28px', maxWidth: '20ch', fontFamily: W, fontWeight: 700, fontSize: 'clamp(26px,2.8vw,42px)', lineHeight: 1.1, letterSpacing: '-.025em' }}>{t.hMissionTitle}</h2>
              <p style={{ marginTop: '20px', maxWidth: '48ch', fontSize: '17px', lineHeight: 1.6, color: '#C9C9C5' }}>{t.hMissionText}</p>
            </div>
            <div className="am-f2" style={{ display: 'grid', gap: '0 32px', borderTop: '1px solid #333' }}>
              {values.map(([title, text], i) => (
                <div key={i} style={{ padding: '20px 0 4px', borderBottom: '1px solid #333' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#E5D900' }}>{no2(i)}</div>
                  <h3 style={{ marginTop: '12px', fontFamily: W, fontWeight: 700, fontSize: '20px', lineHeight: 1.15 }}>{title}</h3>
                  <p style={{ marginTop: '8px', marginBottom: '16px', maxWidth: '30ch', fontSize: '16px', lineHeight: 1.55, color: '#B5B5B1' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: 'clamp(48px,5vw,88px) 0' }}>
          <div style={WRAP}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px 64px' }}>
              <div>
                <div style={CAP}>{t.hWhoLabel}</div>
                <h2 style={H2}>{t.hWhoTitle}</h2>
              </div>
              <p style={{ maxWidth: '44ch', fontSize: '17px', lineHeight: 1.6, color: '#55554F' }}>{t.hWhoNote}</p>
            </div>
            <div className="am-g2" style={{ display: 'grid', gap: '24px', marginTop: '32px' }}>
              <article style={{ display: 'flex', flexDirection: 'column', background: '#F3F3F1' }}>
                <div style={{ position: 'relative', aspectRatio: '2/1', overflow: 'hidden', background: '#D9D9D6' }}>
                  <img src="/img/il-residents.jpg" alt={t.hResidentsAlt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 'clamp(24px,3vw,44px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                    <span>{t.hResidents}</span>
                    <span style={{ color: '#55554F' }}>{t.hResidentsTerm}</span>
                  </div>
                  <h3 style={{ marginTop: '24px', fontFamily: W, fontWeight: 700, fontSize: 'clamp(24px,2.2vw,34px)', lineHeight: 1.1, letterSpacing: '-.02em' }}>{t.hResidentsTitle}</h3>
                  <div style={{ marginTop: '28px', borderTop: '1px solid #000' }}>
                    {perks.map((p, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px minmax(0,1fr)', gap: '8px', padding: '14px 0', borderBottom: '1px solid #DADAD6', fontSize: '16px', lineHeight: 1.45 }}>
                        <span style={{ fontWeight: 600, color: '#1A52A0' }}>{no2(i)}</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#join" onClick={pickResident} style={{ alignSelf: 'flex-start', marginTop: 'auto', paddingTop: '32px', fontFamily: W, fontWeight: 700, fontSize: '14px' }}>
                    {t.hBeResidentArrow}
                  </a>
                </div>
              </article>
              <article style={{ display: 'flex', flexDirection: 'column', background: '#1A52A0', color: '#fff' }}>
                <div style={{ position: 'relative', aspectRatio: '2/1', overflow: 'hidden', background: '#123C78' }}>
                  <img src="/img/il-partners.jpg" alt={t.hPartnersAlt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 'clamp(24px,3vw,44px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                    <span>{t.hPartners}</span>
                    <span style={{ color: '#C8D6EC' }}>{t.hPartnersTerm}</span>
                  </div>
                  <h3 style={{ marginTop: '24px', fontFamily: W, fontWeight: 700, fontSize: 'clamp(24px,2.2vw,34px)', lineHeight: 1.1, letterSpacing: '-.02em' }}>{t.hPartnersTitle}</h3>
                  <p style={{ marginTop: '20px', maxWidth: '44ch', fontSize: '17px', lineHeight: 1.6, color: '#E3EAF5' }}>{t.hPartnersText}</p>
                  <a href="#join" onClick={pickPartner} className="lk-white" style={{ alignSelf: 'flex-start', marginTop: 'auto', paddingTop: '32px', fontFamily: W, fontWeight: 700, fontSize: '14px', color: '#fff' }}>
                    {t.hBePartnerArrow}
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section style={{ padding: '0 0 clamp(48px,5vw,88px)' }}>
          <div style={WRAP}>
            <div style={{ paddingTop: 'clamp(48px,5vw,72px)', borderTop: '1px solid #E6E6E3' }}>
              <div style={CAP}>{t.hFormatsLabel}</div>
              <h2 style={H2}>{t.hFormatsTitle}</h2>
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
              <div style={CAP}>{t.hJoinLabel}</div>
              <h2 style={H2}>{t.hJoinTitle}</h2>
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
                <form onSubmit={submit}>
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
                    {busy ? t.cSending : (isResident ? t.cSendApplication : t.hSendPartner) + ' →'}
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
