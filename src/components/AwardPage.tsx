'use client'

/* Премия и конкурсы (/award) — макет design/Award.dc.html. */

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { Dict } from '@/i18n/dict'
import type { Lang } from '@/i18n/links'
import { post, uploadFiles } from '@/lib/submit'
import { Consent, Footer, FormError, Header, W, fill, no2 } from './am/ui'
import type { S } from './am/ui'

type Nomination = { no?: string | null; title?: string | null; hint?: string | null }

type Props = {
  t: Dict
  lang: Lang
  deadlineDate?: string
  forumDate?: string
  nominations?: Nomination[]
  studentNominations?: Nomination[]
  formOpen?: boolean
  formClosedText?: string
}

const CAP: S = { fontSize: '12px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#55554F' }
const WRAP: S = { maxWidth: '1440px', margin: '0 auto', padding: '0 clamp(20px,4vw,64px)' }
const LBL: S = { fontSize: '12px', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#55554F' }
const FIELD: S = { display: 'block', width: '100%', marginTop: '4px', height: '44px', padding: 0, background: 'transparent', border: 0, borderBottom: '1px solid #BDBDB8', borderRadius: 0, fontSize: '16px', outline: 'none' }
const SFIELD: S = { display: 'block', width: '100%', marginTop: '4px', height: '42px', padding: 0, background: 'transparent', border: 0, borderBottom: '1px solid rgba(255,255,255,.5)', borderRadius: 0, fontSize: '16px', color: '#fff', outline: 'none' }
const SUBMIT: S = { display: 'inline-flex', alignItems: 'center', gap: '14px', minHeight: '52px', padding: '0 26px', border: 0, fontFamily: W, fontWeight: 700, fontSize: '14px', transition: 'background 200ms,color 200ms' }

const MAX = 20 * 1024 * 1024
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.zip'

const DEFAULT_NOMS: Record<Lang, [string, string][]> = {
  ru: [
    ['Архитектура', 'Архитектура частного дома'],
    ['Архитектура', 'Архитектура жилого комплекса'],
    ['Интерьер', 'Интерьер жилого пространства'],
    ['Интерьер', 'Интерьер коммерческого пространства'],
  ],
  ro: [
    ['Arhitectură', 'Arhitectura casei private'],
    ['Arhitectură', 'Arhitectura complexului rezidențial'],
    ['Interior', 'Interiorul spațiului rezidențial'],
    ['Interior', 'Interiorul spațiului comercial'],
  ],
  en: [
    ['Architecture', 'Private house architecture'],
    ['Architecture', 'Residential complex architecture'],
    ['Interior', 'Residential interior'],
    ['Interior', 'Commercial interior'],
  ],
}

/** Дата в формате 20.11.2026 по кишинёвскому времени — одинаково на сервере и в браузере. */
function dmy(iso: string | undefined, fallback: string) {
  const d = new Date(iso || fallback)
  if (isNaN(d.getTime())) return ''
  const p = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Chisinau', day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(d)
  const g = (k: string) => p.find((x) => x.type === k)?.value || ''
  return `${g('day')}.${g('month')}.${g('year')}`
}

type Files = { list: File[]; error: string }

export default function AwardPage({ t, lang, deadlineDate, forumDate, nominations, formOpen = true, formClosedText }: Props) {
  const fromAdmin = (nominations || []).filter((n) => n?.title && n.title.trim())
  const noms = (fromAdmin.length ? fromAdmin.map((n) => [n.hint || '', n.title as string]) : DEFAULT_NOMS[lang]).map(([kind, title], i) => ({ no: no2(i), kind, title }))

  const [nom, setNom] = useState('')
  const [a, setA] = useState<Record<string, string>>({})
  const [s, setS] = useState<Record<string, string>>({})
  const [filesA, setFilesA] = useState<Files>({ list: [], error: '' })
  const [filesS, setFilesS] = useState<Files>({ list: [], error: '' })
  const [sentA, setSentA] = useState(false)
  const [sentNom, setSentNom] = useState('')
  const [sentS, setSentS] = useState(false)
  const [busyA, setBusyA] = useState('')
  const [busyS, setBusyS] = useState('')
  const [errA, setErrA] = useState('')
  const [errS, setErrS] = useState('')

  const deadline = deadlineDate || '2026-11-20T23:59:00+02:00'
  const daysLeft = Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 864e5))

  const pick = (set: (f: Files) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || [])
    const big = list.find((f) => f.size > MAX)
    set(big ? { list: list.filter((f) => f.size <= MAX), error: fill(t.aFileTooBig, { name: big.name }) } : { list, error: '' })
  }

  const awardFields = [
    { k: 'project', label: t.aProject, type: 'text', ph: '', wide: true },
    { k: 'name', label: t.aAuthors, type: 'text', ph: t.aAuthorsPh, wide: false, auto: 'name' },
    { k: 'org', label: t.aCompany, type: 'text', ph: t.aCompanyPh, wide: false, auto: 'organization' },
    { k: 'location', label: t.aLocation, type: 'text', ph: t.aLocationPh, wide: false },
    { k: 'area', label: t.aArea, type: 'text', ph: t.aAreaPh, wide: false },
    { k: 'year', label: t.aYear, type: 'text', ph: t.aYearPh, wide: false },
    { k: 'phone', label: t.cFieldPhone, type: 'tel', ph: '+373', wide: false, auto: 'tel' },
  ]
  const studentFields = [
    { k: 'name', label: t.aAuthor, type: 'text', ph: t.aAuthorsPh, auto: 'name' },
    { k: 'phone', label: t.cFieldPhone, type: 'tel', ph: '+373', auto: 'tel' },
    { k: 'org', label: t.aSchool, type: 'text', ph: '' },
    { k: 'faculty', label: t.aFaculty, type: 'text', ph: '' },
    { k: 'studyStart', label: t.aStudyYear, type: 'text', ph: '2022' },
    { k: 'project', label: t.aProject, type: 'text', ph: '' },
    { k: 'location', label: t.aLocation, type: 'text', ph: t.aStudentLocationPh },
    { k: 'area', label: t.aArea, type: 'text', ph: t.aStudentAreaPh },
  ]

  const submitA = async (e: FormEvent) => {
    e.preventDefault()
    if (busyA) return
    setErrA('')
    let files = ''
    try {
      if (filesA.list.length) {
        setBusyA(t.aUploading)
        files = await uploadFiles(filesA.list, 'award')
      }
    } catch {
      setBusyA('')
      setErrA(t.aUploadError)
      return
    }
    setBusyA(t.cSending)
    try {
      await post('award-applications', { track: 'Премия', nomination: nom, ...a, files }, lang)
      setSentNom(nom)
      setSentA(true)
    } catch {
      setErrA(t.cError)
    } finally {
      setBusyA('')
    }
  }

  const submitS = async (e: FormEvent) => {
    e.preventDefault()
    if (busyS) return
    setErrS('')
    let files = ''
    try {
      if (filesS.list.length) {
        setBusyS(t.aUploading)
        files = await uploadFiles(filesS.list, 'student')
      }
    } catch {
      setBusyS('')
      setErrS(t.aUploadError)
      return
    }
    setBusyS(t.cSending)
    try {
      await post('award-applications', { track: 'Студенческий конкурс', ...s, files }, lang)
      setSentS(true)
    } catch {
      setErrS(t.cError)
    } finally {
      setBusyS('')
    }
  }

  const againA = () => {
    setSentA(false)
    setNom('')
    setFilesA({ list: [], error: '' })
    setA((p) => ({ name: p.name || '', org: p.org || '', phone: p.phone || '' }))
  }

  const closed = <p style={{ marginTop: '24px', padding: '24px', background: '#fff', color: '#000', fontSize: '16px', lineHeight: 1.6 }}>{formClosedText}</p>

  return (
    <div lang={lang} className="sel-yellow" style={{ background: '#fff', color: '#000', overflowX: 'clip' }}>
      <Header t={t} lang={lang} page="award" cta={t.aCta} ctaHref="#apply" ctaMenu={t.aCta} />

      <main>
        <section className="am-split am-hero" style={{ display: 'grid', borderBottom: '1px solid #E6E6E3' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: 'clamp(28px,3.4vw,48px) clamp(20px,4vw,64px) clamp(28px,3vw,44px) max(clamp(20px,4vw,64px),calc((100vw - 1440px)/2 + 64px))' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px 24px', paddingBottom: '14px', borderBottom: '1px solid #E6E6E3', ...CAP }}>
              <span>{t.aEyebrow}</span>
              {formOpen && <span style={{ display: 'inline-flex', alignItems: 'center', height: '26px', padding: '0 10px', background: '#E5D900', color: '#000' }}>{t.aOpen}</span>}
            </div>
            <div style={{ marginTop: 'auto' }}>
              <h1 style={{ fontFamily: W, fontWeight: 800, fontSize: 'clamp(36px,4.6vw,72px)', lineHeight: 0.94, letterSpacing: '-.03em', textTransform: 'uppercase' }}>
                Arch
                <br />
                Makers
                <br />
                Award 2026
              </h1>
              <p style={{ marginTop: '18px', maxWidth: '34ch', fontSize: 'clamp(16px,1.3vw,19px)', lineHeight: 1.5, color: '#2A2A28' }}>{t.aLead}</p>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', borderTop: '1px solid #000' }}>
                <div style={{ padding: '14px 16px 0 0', borderRight: '1px solid #E6E6E3' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#55554F' }}>{t.aDeadlineLabel}</div>
                  <div style={{ marginTop: '8px', fontFamily: W, fontWeight: 800, fontSize: 'clamp(26px,2.6vw,38px)', lineHeight: 1 }}>{dmy(deadlineDate, '2026-11-20T23:59:00+02:00')}</div>
                  {formOpen && (
                    <div suppressHydrationWarning style={{ marginTop: '6px', fontSize: '14px', color: '#55554F' }}>
                      {fill(t.aDaysLeft, { days: daysLeft })}
                    </div>
                  )}
                </div>
                <div style={{ padding: '14px 0 0 20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#55554F' }}>{t.aWinners}</div>
                  <div style={{ marginTop: '8px', fontFamily: W, fontWeight: 800, fontSize: 'clamp(26px,2.6vw,38px)', lineHeight: 1 }}>{dmy(forumDate, '2026-12-09T10:00:00+02:00')}</div>
                  <div style={{ marginTop: '6px', fontSize: '14px', lineHeight: 1.4, color: '#55554F' }}>{t.aWinnersText}</div>
                </div>
              </div>
              <div style={{ marginTop: '24px', fontSize: '12px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#55554F' }}>{t.aChoose}</div>
              <div className="am-f2" style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                <a href="#apply" className="hv-yellow" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '16px 18px', background: '#000', color: '#fff', transition: 'background 200ms,color 200ms' }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontFamily: W, fontWeight: 700, fontSize: '15px' }}>
                    {t.aAward} <span aria-hidden="true">→</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: 1.35, opacity: 0.8 }}>{t.aAwardNote}</span>
                </a>
                <a href="#student" className="hv-black" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '16px 18px', background: '#1A52A0', color: '#fff', transition: 'background 200ms' }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontFamily: W, fontWeight: 700, fontSize: '15px' }}>
                    {t.aStudent} <span aria-hidden="true">→</span>
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: 1.35, opacity: 0.85 }}>{t.aStudentNote}</span>
                </a>
              </div>
            </div>
          </div>
          <div className="am-ar-a" style={{ position: 'relative', minHeight: '100%', background: '#F3F3F1', overflow: 'hidden' }}>
            <img src="/img/il-award-hero.jpg" alt={t.aHeroAlt} fetchPriority="high" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </section>

        <section id="nominations" style={{ padding: 'clamp(48px,5vw,88px) 0' }}>
          <div style={WRAP}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px 64px' }}>
              <div>
                <div style={CAP}>{t.aNomLabel}</div>
                <h2 style={{ marginTop: '14px', fontFamily: W, fontWeight: 700, fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1.05, letterSpacing: '-.025em' }}>{t.aNomTitle}</h2>
              </div>
              <p style={{ maxWidth: '42ch', fontSize: '16px', lineHeight: 1.6, color: '#55554F' }}>{t.aNomText}</p>
            </div>
            <div className="am-g4" style={{ display: 'grid', marginTop: '32px', borderTop: '1px solid #000', borderLeft: '1px solid #E6E6E3' }}>
              {noms.map((n) => (
                <a key={n.no} href="#apply" onClick={() => setNom(n.title)} className="hv-bgyellow" style={{ display: 'flex', flexDirection: 'column', minHeight: '200px', padding: '22px', borderRight: '1px solid #E6E6E3', borderBottom: '1px solid #E6E6E3', color: '#000', transition: 'background 240ms' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: W, fontWeight: 800, fontSize: '30px', lineHeight: 1 }}>{n.no}</span>
                    <span aria-hidden="true" style={{ position: 'relative', display: 'block', width: '24px', height: '24px' }}>
                      <i style={{ position: 'absolute', right: 0, top: 0, width: '100%', height: '28%', background: '#000' }} />
                      <i style={{ position: 'absolute', right: 0, top: 0, width: '28%', height: '100%', background: '#000' }} />
                    </span>
                  </div>
                  <div style={{ marginTop: 'auto', ...CAP }}>{n.kind}</div>
                  <h3 style={{ marginTop: '8px', fontFamily: W, fontWeight: 700, fontSize: '20px', lineHeight: 1.2 }}>{n.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="apply" style={{ padding: '0 0 clamp(48px,5vw,88px)' }}>
          <div className="am-split-form" style={{ ...WRAP, display: 'grid', gap: '2px', background: '#fff' }}>
            <div style={{ position: 'relative', overflow: 'hidden', background: '#000', color: '#fff', padding: 'clamp(28px,3vw,48px)' }}>
              <span aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: 0, width: '38%', height: '48px', background: '#E5D900' }} />
              <span aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: 0, width: '48px', height: '34%', background: '#E5D900' }} />
              <div style={{ ...CAP, color: '#9A9A96' }}>{t.aPrizeLabel}</div>
              <h2 style={{ marginTop: '14px', maxWidth: '14ch', fontFamily: W, fontWeight: 700, fontSize: 'clamp(26px,2.6vw,38px)', lineHeight: 1.08, letterSpacing: '-.02em' }}>{t.aPrizeTitle}</h2>
              <div style={{ marginTop: '28px', marginBottom: '64px', borderTop: '1px solid #333' }}>
                {[t.aPrize1, t.aPrize2, t.aPrize3, t.aPrize4].map((p, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px minmax(0,1fr)', gap: '8px', padding: '14px 0', borderBottom: '1px solid #333' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#E5D900', paddingTop: '2px' }}>{no2(i)}</span>
                    <div style={{ fontSize: '16px', fontWeight: 600, lineHeight: 1.45 }}>{p}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#F3F3F1', padding: 'clamp(28px,3vw,48px)' }}>
              <div style={CAP}>{t.aFormLabel}</div>
              <h2 style={{ marginTop: '14px', fontFamily: W, fontWeight: 700, fontSize: 'clamp(26px,2.6vw,38px)', lineHeight: 1.08, letterSpacing: '-.02em' }}>{t.aFormTitle}</h2>
              {!formOpen ? (
                closed
              ) : sentA ? (
                <div role="status" style={{ marginTop: '24px', padding: '24px', background: '#fff' }}>
                  <div style={{ fontFamily: W, fontWeight: 700, fontSize: '20px' }}>{t.cSent}</div>
                  <p style={{ marginTop: '10px', fontSize: '16px', lineHeight: 1.6, color: '#3A3A37' }}>{fill(t.aSentText, { nom: sentNom })}</p>
                  <button type="button" onClick={againA} className="hv-yellow" style={{ marginTop: '20px', ...SUBMIT, background: '#000', color: '#fff', cursor: 'pointer' }}>
                    {t.aAgain}
                  </button>
                </div>
              ) : (
                <form onSubmit={submitA} className="am-f2" style={{ display: 'grid', gap: '16px 28px', marginTop: '24px' }}>
                  <label style={{ gridColumn: '1/-1', display: 'block' }}>
                    <span style={LBL}>{t.aNomination}</span>
                    <select name="nomination" required value={nom} onChange={(e) => setNom(e.target.value)} className="fc-black" style={{ ...FIELD, cursor: 'pointer' }}>
                      <option value="">{t.aChooseNom}</option>
                      {noms.map((n) => (
                        <option key={n.no} value={n.title}>
                          {n.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  {awardFields.map((f) => (
                    <label key={f.k} style={{ display: 'block', gridColumn: f.wide ? '1/-1' : 'auto' }}>
                      <span style={LBL}>{f.label}</span>
                      <input name={f.k} required type={f.type} placeholder={f.ph} autoComplete={f.auto} value={a[f.k] || ''} onChange={(e) => setA((p) => ({ ...p, [f.k]: e.target.value }))} className="fc-black" style={FIELD} />
                    </label>
                  ))}
                  <label style={{ gridColumn: '1/-1', display: 'block' }}>
                    <span style={LBL}>{t.aDesc}</span>
                    <textarea name="desc" required rows={2} placeholder={t.aDescPh} value={a.desc || ''} onChange={(e) => setA((p) => ({ ...p, desc: e.target.value }))} className="fc-black" style={{ display: 'block', width: '100%', marginTop: '4px', padding: '10px 0', background: 'transparent', border: 0, borderBottom: '1px solid #BDBDB8', borderRadius: 0, fontSize: '16px', lineHeight: 1.5, outline: 'none', resize: 'vertical' }} />
                  </label>
                  <label className="am-file" style={{ position: 'relative', gridColumn: '1/-1', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 16px', cursor: 'pointer' }}>
                    <input type="file" multiple accept={ACCEPT} onChange={pick(setFilesA)} style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0 }} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', height: '40px', padding: '0 16px', background: '#000', color: '#fff', fontFamily: W, fontWeight: 700, fontSize: '13px' }}>{t.aAttach}</span>
                    <span style={{ flex: '1 1 200px', fontSize: '14px', lineHeight: 1.4, color: filesA.error ? '#B3261E' : '#55554F' }}>
                      {filesA.error || (filesA.list.length ? filesA.list.map((f) => f.name).join(', ') : t.aFilesHint)}
                    </span>
                  </label>
                  <div style={{ gridColumn: '1/-1', paddingTop: '8px' }}>
                    <button type="submit" disabled={!!busyA} className="hv-yellow" style={{ ...SUBMIT, background: '#000', color: '#fff', cursor: busyA ? 'wait' : 'pointer' }}>
                      {busyA || t.aSend}
                    </button>
                    <FormError>{errA}</FormError>
                    <Consent t={t} lang={lang} />
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <section id="student" style={{ background: '#1A52A0', color: '#fff' }}>
          <div className="am-split" style={{ display: 'grid' }}>
            <div className="am-ar-aside" style={{ position: 'relative', minHeight: '100%', background: '#123C78', overflow: 'hidden' }}>
              <img src="/img/il-student.jpg" alt={t.aStudentAlt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ padding: 'clamp(40px,4.4vw,72px) max(clamp(20px,4vw,64px),calc((100vw - 1440px)/2 + 64px)) clamp(40px,4.4vw,72px) clamp(20px,4vw,64px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', ...CAP, color: '#C8D6EC' }}>
                <span>04</span>
                <span>{t.aStudentsLabel}</span>
              </div>
              <h2 style={{ marginTop: '16px', fontFamily: W, fontWeight: 800, fontSize: 'clamp(32px,3.6vw,54px)', lineHeight: 1, letterSpacing: '-.03em', textTransform: 'uppercase' }}>
                {t.aStudent1}
                <br />
                {t.aStudent2}
              </h2>
              <h3 style={{ marginTop: '18px', maxWidth: '26ch', fontFamily: W, fontWeight: 700, fontSize: 'clamp(18px,1.6vw,22px)', lineHeight: 1.25 }}>{t.aStudentQ}</h3>
              <p style={{ marginTop: '12px', maxWidth: '48ch', fontSize: '16px', lineHeight: 1.6, color: '#E3EAF5' }}>{t.aStudentText}</p>
              {!formOpen ? (
                closed
              ) : sentS ? (
                <p role="status" style={{ marginTop: '24px', padding: '20px', background: '#fff', color: '#000', fontSize: '16px', lineHeight: 1.6 }}>
                  {t.aStudentSent}
                </p>
              ) : (
                <form onSubmit={submitS} className="am-f2" style={{ display: 'grid', gap: '14px 28px', marginTop: '24px' }}>
                  {studentFields.map((f) => (
                    <label key={f.k} style={{ display: 'block' }}>
                      <span style={{ ...LBL, color: '#C8D6EC' }}>{f.label}</span>
                      <input name={f.k} required type={f.type} placeholder={f.ph} autoComplete={f.auto} value={s[f.k] || ''} onChange={(e) => setS((p) => ({ ...p, [f.k]: e.target.value }))} className="fc-yellow ph-light" style={SFIELD} />
                    </label>
                  ))}
                  <label className="am-file" style={{ position: 'relative', gridColumn: '1/-1', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 16px', cursor: 'pointer' }}>
                    <input type="file" multiple accept={ACCEPT} onChange={pick(setFilesS)} style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0 }} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', height: '40px', padding: '0 16px', background: '#fff', color: '#000', fontFamily: W, fontWeight: 700, fontSize: '13px' }}>{t.aAttach}</span>
                    <span style={{ flex: '1 1 200px', fontSize: '14px', lineHeight: 1.4, color: filesS.error ? '#FFD9D2' : '#E3EAF5' }}>
                      {filesS.error || (filesS.list.length ? filesS.list.map((f) => f.name).join(', ') : t.aFilesHint)}
                    </span>
                  </label>
                  <div style={{ gridColumn: '1/-1', paddingTop: '8px' }}>
                    <button type="submit" disabled={!!busyS} className="hv-yellow" style={{ ...SUBMIT, background: '#fff', color: '#000', cursor: busyS ? 'wait' : 'pointer' }}>
                      {busyS || t.aStudentSend}
                    </button>
                    <FormError dark>{errS}</FormError>
                    <Consent t={t} lang={lang} dark />
                  </div>
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
