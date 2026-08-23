'use client'

/* Award — ported from the original dc bundle.
   Markup and inline styles are carried over verbatim; the values the old
   runtime computed in JS are now CSS custom properties (see globals.css). */

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Dict } from '@/i18n/dict'
import { path as langPath } from '@/i18n/links'
import type { Lang } from '@/i18n/links'

async function post(collection, body) {
  const res = await fetch('/api/' + collection, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('submit failed: ' + res.status)
  return res.json()
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/

type Nom = { no?: string; title: string }
type Member = { no?: string; name: string; role?: string }
type Props = {
  t: Dict
  lang: Lang
  deadlineLabel?: string
  deadlineDate?: string
  countdownVisible?: boolean
  juryVisible?: boolean
  jury?: Member[]
  nominations?: Nom[]
  studentNominations?: Nom[]
}

const AWARD_TRACK = 'Премия отрасли'
const STUDENT_TRACK = 'Студенческий конкурс'

export default function AwardPage({
  t,
  lang,
  deadlineLabel, deadlineDate, countdownVisible = true, juryVisible = false,
  jury: juryProp = [], nominations: nomProp = [], studentNominations: studentProp = [],
}: Props) {
  // "/forum" stays "/forum" in Russian and becomes "/ro/forum" elsewhere
  const lp = (p: string) => langPath(lang, p)
  const lhref = (c: Lang) => langPath(c, "/award")


  const [menu, setMenu] = useState(false)
  const toggleMenu = useCallback(() => setMenu((m) => !m), [])
  const closeMenu = useCallback(() => setMenu(false), [])
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1080px)')
    const off = () => setMenu(false)
    mq.addEventListener('change', off)
    return () => mq.removeEventListener('change', off)
  }, [])

  const [err, setErr] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [track, setTrack] = useState('')
  const [descLen, setDescLen] = useState(0)
  const [nomination, setNomination] = useState('')
  const [cols, setCols] = useState(4)
  const [axisDir, setAxisDir] = useState('x')
  const data = useRef({ name: '', org: '', track: '', nomination: '', email: '', phone: '', url: '', desc: '' })

  // the two things that genuinely still need JS: reveal-delay grid position
  // and the timeline axis direction attribute read by fa-motion.js
  useEffect(() => {
    const mqN = window.matchMedia('(max-width: 1080px)')
    const mqT = window.matchMedia('(max-width: 640px)')
    const sync = () => {
      setCols(mqT.matches ? 1 : mqN.matches ? 2 : 4)
      setAxisDir(mqN.matches ? 'y' : 'x')
    }
    sync()
    mqN.addEventListener('change', sync)
    mqT.addEventListener('change', sync)
    return () => { mqN.removeEventListener('change', sync); mqT.removeEventListener('change', sync) }
  }, [])

  // headline lines scaled to fill their box
  useEffect(() => {
    const fitHead = () => {
      document.querySelectorAll('[data-fit-head]').forEach((head) => {
        const box = head.getBoundingClientRect().width
        if (!box) return
        head.querySelectorAll('[data-fit-line]').forEach((line: any) => {
          line.style.fontSize = '100px'
          const w = line.scrollWidth
          if (!w) return
          line.style.fontSize = Math.max(20, (box / w) * 100) + 'px'
        })
      })
    }
    fitHead()
    if (document.fonts?.ready) document.fonts.ready.then(fitHead)
    let t: any
    const onResize = () => { clearTimeout(t); t = setTimeout(() => requestAnimationFrame(fitHead), 150) }
    window.addEventListener('resize', onResize, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize) }
  })

  useEffect(() => {
    const FA = (window as any).FA
    if (FA) { FA.scan(); FA.refresh() }
  })

  const updateFill = () => {
    const keys = ['name', 'org', 'track', 'nomination', 'email', 'phone', 'url', 'desc']
    const done = keys.filter((k) => String((data.current as any)[k] || '').trim().length > 0).length
    document.querySelectorAll('[data-formfill]').forEach((el: any) => {
      el.style.transform = 'scaleX(' + (done / keys.length).toFixed(3) + ')'
    })
  }

  const field = (k: string) => (e: any) => {
    ;(data.current as any)[k] = e.target.value
    updateFill()
    if (k === 'desc') setDescLen(e.target.value.length)
    setErr((prev) => { if (!prev[k]) return prev; const n = { ...prev }; delete n[k]; return n })
  }

  const pick = (t: string) => {
    data.current.track = t
    data.current.nomination = ''
    setTimeout(updateFill, 0)
    setTrack(t)
    setNomination('')
    setErr((prev) => { const n = { ...prev }; delete n.track; return n })
  }
  const scrollToForm = () => {
    const target = document.getElementById('apply')
    if (!target) return
    const y = target.getBoundingClientRect().top + window.scrollY - 80
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
  }
  const pickAward = () => pick(AWARD_TRACK)
  const pickStudent = () => pick(STUDENT_TRACK)
  const goAward = () => { pick(AWARD_TRACK); scrollToForm() }
  const goStudent = () => { pick(STUDENT_TRACK); scrollToForm() }

  const onNomination = (e: any) => {
    data.current.nomination = e.target.value
    updateFill()
    setNomination(e.target.value)
    setErr((prev) => { const n = { ...prev }; delete n.nomination; return n })
  }

  const submit = async (e: any) => {
    e.preventDefault()
    const d = data.current
    const n: Record<string, string> = {}
    if (!d.name.trim()) n.name = t.k253
    if (!d.org.trim()) n.org = t.k254
    if (!d.track) n.track = t.k255
    if (!d.nomination) n.nomination = t.k256
    if (!EMAIL_RE.test(d.email.trim())) n.email = t.k4
    if (d.phone.replace(/\D/g, '').length < 8) n.phone = t.k5
    if (!/^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(d.url.trim())) n.url = t.k257
    if (!d.desc.trim()) n.desc = t.k258
    if (Object.keys(n).length) {
      setErr(n)
      ;(document.getElementById('aw-' + Object.keys(n)[0]) as any)?.focus?.()
      return
    }
    try { await post('award-applications', d) } catch { /* noop */ }
    setErr({})
    setSent(true)
  }

  const baseNoms: Nom[] = nomProp.length ? nomProp
    : Array.from({ length: 8 }, (_, i) => ({ no: String(i + 1).padStart(2, '0'), title: t.nomDefault + ' ' + String(i + 1).padStart(2, '0') }))
  const studentNoms: Nom[] = studentProp.length ? studentProp
    : [{ no: '01', title: t.studentNomPlaceholder }]

  const nominations = baseNoms.map((x, i) => ({ ...x, delay: (Math.floor(i / cols) + (i % cols)) * 60 }))
  const nomOptions = track === STUDENT_TRACK ? studentNoms : track === AWARD_TRACK ? baseNoms : []
  const jury = juryVisible ? juryProp : []

  const onName = field('name'), onOrg = field('org'), onEmail = field('email')
  const onPhone = field('phone'), onUrl = field('url'), onDesc = field('desc')
  const errName = err.name || '', errOrg = err.org || '', errTrack = err.track || ''
  const errNomination = err.nomination || '', errEmail = err.email || ''
  const errPhone = err.phone || '', errUrl = err.url || '', errDesc = err.desc || ''
  const nominationPlaceholder = track ? t.k256 : t.k255
  const menuDisplay = menu ? ('var(--menuDisplay)' as any) : 'none'
  const notSent = !sent
  const descCount = descLen + ' / 300'
  const isAward = track === AWARD_TRACK
  const isStudent = track === STUDENT_TRACK
  const awardBg = isAward ? '#16181D' : '#FFFFFF'
  const awardFg = isAward ? '#F7F6F3' : '#16181D'
  const studentBg = isStudent ? '#16181D' : '#FFFFFF'
  const studentFg = isStudent ? '#F7F6F3' : '#16181D'
  const countdownDisplay = countdownVisible === false ? 'none' : 'flex'
  const nominationValue = nomination
  const resolvedDeadlineLabel = deadlineLabel || t.deadlineDefault
  const resolvedDeadlineDate = deadlineDate || '2026-11-20T23:59:00+02:00'

  return (
    <>
          <div style={{ background: "#F7F6F3", color: "#16181D", overflowX: "hidden" } as CSSProperties}>
            <header data-header="" data-header-solid="" style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "60", background: "rgba(247,246,243,.94)", borderBottom: "1px solid #DCDAD4", transition: "background 300ms ease,border-color 300ms ease" } as CSSProperties}>
              <div data-header-inner="" style={{ maxWidth: "1720px", margin: "0 auto", padding: "20px clamp(20px,4.8vw,108px)", display: "flex", alignItems: "center", gap: "24px", transition: "padding 300ms ease" } as CSSProperties}>
                <a href={lp("/")} style={{ display: "flex", alignItems: "center", gap: "12px" } as CSSProperties}>
                  <img src="/img/5dd2fe9c60.png" alt="" style={{ height: "30px", width: "auto", display: "block" } as CSSProperties} />
                  <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "13px", letterSpacing: ".14em", textTransform: "uppercase", whiteSpace: "nowrap" } as CSSProperties}>
                    {t.k401}
                  </span>
                </a>
                <nav aria-label={t.k6} style={{ marginLeft: "auto", minWidth: "0", display: ("var(--navDisplay)" as any), alignItems: "center", gap: "24px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
                  <a className="fa-h6ae611c" href={lp("/")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                    {t.k35}
                  </a>
                  <a className="fa-h6ae611c" href={lp("/forum")} style={{ transition: "color 200ms ease", color: "#FF4002", fontWeight: "600" } as CSSProperties}>
                    {t.k9}
                  </a>
                  <a href="#top" aria-current="page" style={{ color: "#16181D", fontWeight: "600" } as CSSProperties}>
                    {t.k10}
                  </a>
                  <a className="fa-h6ae611c" href="#contacts" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    {t.k12}
                  </a>
                </nav>
                <div style={{ display: ("var(--navDisplay)" as any), alignItems: "center", gap: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em" } as CSSProperties}>
                  <a href={lhref("ro")} style={{ color: "#6E7278" } as CSSProperties}>
                    {t.k402}
                  </a>
                  <span style={{ color: "#DCDAD4" } as CSSProperties}>
                    {t.k403}
                  </span>
                  <a href={lhref("ru")} style={{ color: "#16181D" } as CSSProperties}>
                    {t.k404}
                  </a>
                  <span style={{ color: "#DCDAD4" } as CSSProperties}>
                    {t.k403}
                  </span>
                  <a href={lhref("en")} style={{ color: "#6E7278" } as CSSProperties}>
                    {t.k405}
                  </a>
                </div>
                <a className="fa-h88f6f23" href="#apply" style={{ display: ("var(--navDisplay)" as any), flex: "0 0 auto", alignItems: "center", padding: "12px 22px", background: "#16181D", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2", whiteSpace: "nowrap", border: "1px solid #16181D", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                  {t.k38}
                </a>
                <button type="button" aria-label={t.k15} onClick={toggleMenu} style={{ display: ("var(--burgerDisplay)" as any), marginLeft: "auto", flexDirection: "column", justifyContent: "center", gap: "6px", width: "44px", height: "44px", padding: "0", background: "transparent", border: "0", cursor: "pointer" } as CSSProperties}>
                  <span style={{ display: "block", width: "22px", height: "1px", background: "#16181D" } as CSSProperties}>
                  </span>
                  <span style={{ display: "block", width: "22px", height: "1px", background: "#16181D" } as CSSProperties}>
                  </span>
                </button>
              </div>
              <div style={{ display: menuDisplay, background: "#F7F6F3", borderTop: "1px solid #DCDAD4", padding: "8px clamp(20px,4.8vw,108px) 32px" } as CSSProperties}>
                <nav aria-label={t.k16} style={{ display: "flex", flexDirection: "column", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "22px" } as CSSProperties}>
                  <a href={lp("/")} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {t.k35}
                  </a>
                  <a href={lp("/forum")} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4", color: "#FF4002" } as CSSProperties}>
                    {t.k9}
                  </a>
                  <a href="#top" aria-current="page" style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4", fontWeight: "700" } as CSSProperties}>
                    {t.k10}
                  </a>
                  <a href="#contacts" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {t.k12}
                  </a>
                </nav>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "24px" } as CSSProperties}>
                  <div style={{ display: "flex", gap: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em" } as CSSProperties}>
                    <a href={lhref("ro")} style={{ color: "#6E7278" } as CSSProperties}>
                      {t.k402}
                    </a>
                    <span style={{ color: "#DCDAD4" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("ru")} style={{ color: "#16181D" } as CSSProperties}>
                      {t.k404}
                    </a>
                    <span style={{ color: "#DCDAD4" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("en")} style={{ color: "#6E7278" } as CSSProperties}>
                      {t.k405}
                    </a>
                  </div>
                  <a href="#apply" onClick={closeMenu} style={{ display: "inline-flex", alignItems: "center", padding: "12px 24px", background: "#16181D", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2" } as CSSProperties}>
                    {t.k38}
                  </a>
                </div>
              </div>
              <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "2px", overflow: "hidden" } as CSSProperties}>
                <div data-progress="" style={{ width: "100%", height: "2px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                </div>
              </div>
            </header>
            <main>
              <section id="top" style={{ position: "relative", overflow: "hidden", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(128px,17vh,188px) 0 clamp(24px,3vw,40px)", backgroundColor: "#FFFFFF", color: "#16181D" } as CSSProperties}>
                <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "repeating-linear-gradient(90deg,rgba(22,24,29,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(22,24,29,.06) 0 1px,transparent 1px 80px)" } as CSSProperties}>
                </div>
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)", width: "100%" } as CSSProperties}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "12px 32px", paddingBottom: "14px", borderBottom: "1px solid #DCDAD4", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(10px,.9vw,12px)", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k420}
                      </span>
                      <span style={{ width: "40px", height: "1px", background: "#C9C6BE" } as CSSProperties}>
                      </span>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k259}
                      </span>
                    </div>
                    <span>
                      {t.k477}
                    </span>
                  </div>
                  <h1 style={{ margin: "clamp(22px,2.8vw,44px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
                    <span style={{ display: "block", overflow: "hidden", paddingBottom: ".04em" } as CSSProperties}>
                      <span style={{ display: "block", fontSize: "clamp(48px,11.5vw,190px)", lineHeight: ".84", letterSpacing: "-.055em" } as CSSProperties}>
                        {t.k478}
                      </span>
                    </span>
                    <span style={{ display: "block", overflow: "hidden", paddingBottom: ".05em" } as CSSProperties}>
                      <span style={{ display: "block", fontSize: "clamp(26px,5.4vw,94px)", lineHeight: ".98", letterSpacing: "-.04em", color: "#FF4002", whiteSpace: "nowrap" } as CSSProperties}>
                        {t.k479}
                      </span>
                    </span>
                  </h1>
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--twoCols)" as any), gap: "clamp(24px,3vw,56px)", alignItems: "start", marginTop: "clamp(28px,3.4vw,52px)" } as CSSProperties}>
                    <p style={{ margin: "0", maxWidth: "52ch", fontSize: "clamp(16px,1.4vw,22px)", lineHeight: "1.5", letterSpacing: "-.01em", color: "#5C5F66" } as CSSProperties}>
                      <span style={{ color: "#16181D", fontWeight: "600" } as CSSProperties}>
                        {t.k480}
                      </span>
                      {t.k481}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "clamp(10px,1.2vw,18px)", borderTop: "1px solid #DCDAD4", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(11px,1vw,13px)", letterSpacing: ".12em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
                      <span style={{ flex: "0 0 8px", width: "8px", height: "8px", background: "#FF4002", animation: "faPulse 2s ease-in-out infinite" } as CSSProperties}>
                      </span>
                      <span>
                        {t.k482}
                      </span>
                    </div>
                  </div>
                  <div data-countdown="" data-target="2026-11-20T23:59:00+02:00" style={{ display: "flex", flexWrap: "wrap", marginTop: "clamp(28px,3.6vw,52px)", borderTop: "1px solid #DCDAD4", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    <div style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)" } as CSSProperties}>
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                        <span data-cd="d">
                          {t.k469}
                        </span>
                      </div>
                      <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k143}
                      </div>
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid #DCDAD4" } as CSSProperties}>
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                        <span data-cd="h">
                          {t.k469}
                        </span>
                      </div>
                      <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k144}
                      </div>
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid #DCDAD4" } as CSSProperties}>
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                        <span data-cd="m">
                          {t.k469}
                        </span>
                      </div>
                      <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k145}
                      </div>
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid #DCDAD4" } as CSSProperties}>
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                        <span data-cd="s">
                          {t.k469}
                        </span>
                      </div>
                      <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k146}
                      </div>
                    </div>
                    <div style={{ flex: "1 1 200px", minWidth: "180px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "8px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid #DCDAD4" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k264}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(15px,1.4vw,20px)", letterSpacing: "-.01em" } as CSSProperties}>
                        {t.k483}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "clamp(24px,3vw,40px)" } as CSSProperties}>
                    <button className="fa-h9cd382b" type="button" onClick={goAward} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "19px 38px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease,box-shadow 220ms ease" } as CSSProperties}>
                      {t.k265}
                    </button>
                    <button className="fa-hbb9d53c" type="button" onClick={goStudent} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "19px 38px", background: "transparent", border: "1px solid #16181D", color: "#16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 220ms ease,color 220ms ease,transform 220ms ease" } as CSSProperties}>
                      {t.k266}
                    </button>
                  </div>
                  <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "clamp(20px,2.4vw,32px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    <span style={{ display: "block", width: "1px", height: "34px", background: "#16181D" } as CSSProperties}>
                    </span>
                    <span>
                      {t.k42}
                    </span>
                  </div>
                </div>
              </section>
              <section id="tracks" style={{ padding: "clamp(64px,8vw,120px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
                <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#16181D" } as CSSProperties}>
                        {t.k422}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k267}
                    </span>
                  </div>
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,6.4vw,104px)", lineHeight: ".88", letterSpacing: "-.05em", textTransform: "uppercase" } as CSSProperties}>
                    {t.k268}
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--twoCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,60px)", background: "#DCDAD4", borderTop: "1px solid #DCDAD4", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    <div className="fa-h77c075a" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", padding: "clamp(28px,3.2vw,52px) clamp(24px,3vw,48px) clamp(32px,3.6vw,56px)", background: "#F7F6F3", transition: "background 260ms ease" } as CSSProperties}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".12em", color: "#FF4002" } as CSSProperties}>
                        <span>
                          {t.k420}
                        </span>
                        <span style={{ flex: "1 1 auto", height: "1px", background: "#DCDAD4" } as CSSProperties}>
                        </span>
                      </div>
                      <h3 style={{ margin: "clamp(20px,2.2vw,32px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(26px,3vw,44px)", lineHeight: "1.02", letterSpacing: "-.035em" } as CSSProperties}>
                        {t.k269}
                      </h3>
                      <p style={{ margin: "clamp(18px,2vw,28px) 0 0", fontSize: "clamp(17px,1.4vw,22px)", lineHeight: "1.45", letterSpacing: "-.01em", color: "#16181D", maxWidth: "34ch" } as CSSProperties}>
                        {t.k270}
                      </p>
                      <p style={{ margin: "clamp(16px,1.6vw,22px) 0 0", fontSize: "clamp(15px,1.15vw,18px)", lineHeight: "1.6", color: "#6E7278", maxWidth: "38ch" } as CSSProperties}>
                        {t.k271}
                      </p>
                    </div>
                    <div className="fa-h77c075a" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", padding: "clamp(28px,3.2vw,52px) clamp(24px,3vw,48px) clamp(32px,3.6vw,56px)", background: "#F7F6F3", transition: "background 260ms ease" } as CSSProperties}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".12em", color: "#FF4002" } as CSSProperties}>
                        <span>
                          {t.k422}
                        </span>
                        <span style={{ flex: "1 1 auto", height: "1px", background: "#DCDAD4" } as CSSProperties}>
                        </span>
                      </div>
                      <h3 style={{ margin: "clamp(20px,2.2vw,32px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(26px,3vw,44px)", lineHeight: "1.02", letterSpacing: "-.035em" } as CSSProperties}>
                        {t.k272}
                      </h3>
                      <p style={{ margin: "clamp(18px,2vw,28px) 0 0", fontSize: "clamp(17px,1.4vw,22px)", lineHeight: "1.45", letterSpacing: "-.01em", color: "#16181D", maxWidth: "34ch" } as CSSProperties}>
                        {t.k273}
                      </p>
                      <p style={{ margin: "clamp(16px,1.6vw,22px) 0 0", fontSize: "clamp(15px,1.15vw,18px)", lineHeight: "1.6", color: "#6E7278", maxWidth: "38ch" } as CSSProperties}>
                        {t.k274}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="nominations" style={{ padding: "clamp(64px,8vw,120px) 0", backgroundColor: "#EFEDE8" } as CSSProperties}>
                <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #C9C6BE" } as CSSProperties}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#16181D" } as CSSProperties}>
                        {t.k428}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k276}
                    </span>
                  </div>
                  <div data-reveal="" data-delay="40" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(32px,4vw,48px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    {t.k269}
                  </div>
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(16px,1.6vw,22px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(40px,7vw,110px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase" } as CSSProperties}>
                    {t.k277}
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--nomCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,60px)", background: "#C9C6BE", borderTop: "1px solid #C9C6BE" } as CSSProperties}>
                    <div className="fa-ha311dfc" data-reveal="" data-delay="0" style={{ opacity: "0", transform: "translateY(14px)", display: "flex", alignItems: "baseline", gap: "16px", padding: "clamp(22px,2.4vw,32px) clamp(18px,2vw,28px)", background: "#EFEDE8", transition: "background 240ms ease,color 240ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                        {t.k420}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.18", letterSpacing: "-.022em" } as CSSProperties}>
                        {t.k484}
                      </span>
                    </div>
                    <div className="fa-ha311dfc" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(14px)", display: "flex", alignItems: "baseline", gap: "16px", padding: "clamp(22px,2.4vw,32px) clamp(18px,2vw,28px)", background: "#EFEDE8", transition: "background 240ms ease,color 240ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                        {t.k422}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.18", letterSpacing: "-.022em" } as CSSProperties}>
                        {t.k485}
                      </span>
                    </div>
                    <div className="fa-ha311dfc" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(14px)", display: "flex", alignItems: "baseline", gap: "16px", padding: "clamp(22px,2.4vw,32px) clamp(18px,2vw,28px)", background: "#EFEDE8", transition: "background 240ms ease,color 240ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                        {t.k428}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.18", letterSpacing: "-.022em" } as CSSProperties}>
                        {t.k486}
                      </span>
                    </div>
                    <div className="fa-ha311dfc" data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(14px)", display: "flex", alignItems: "baseline", gap: "16px", padding: "clamp(22px,2.4vw,32px) clamp(18px,2vw,28px)", background: "#EFEDE8", transition: "background 240ms ease,color 240ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                        {t.k429}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.18", letterSpacing: "-.022em" } as CSSProperties}>
                        {t.k487}
                      </span>
                    </div>
                    <div className="fa-ha311dfc" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(14px)", display: "flex", alignItems: "baseline", gap: "16px", padding: "clamp(22px,2.4vw,32px) clamp(18px,2vw,28px)", background: "#EFEDE8", transition: "background 240ms ease,color 240ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                        {t.k431}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.18", letterSpacing: "-.022em" } as CSSProperties}>
                        {t.k488}
                      </span>
                    </div>
                    <div className="fa-ha311dfc" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(14px)", display: "flex", alignItems: "baseline", gap: "16px", padding: "clamp(22px,2.4vw,32px) clamp(18px,2vw,28px)", background: "#EFEDE8", transition: "background 240ms ease,color 240ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                        {t.k434}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.18", letterSpacing: "-.022em" } as CSSProperties}>
                        {t.k489}
                      </span>
                    </div>
                    <div className="fa-ha311dfc" data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(14px)", display: "flex", alignItems: "baseline", gap: "16px", padding: "clamp(22px,2.4vw,32px) clamp(18px,2vw,28px)", background: "#EFEDE8", transition: "background 240ms ease,color 240ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                        {t.k436}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.18", letterSpacing: "-.022em" } as CSSProperties}>
                        {t.k490}
                      </span>
                    </div>
                    <div className="fa-ha311dfc" data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(14px)", display: "flex", alignItems: "baseline", gap: "16px", padding: "clamp(22px,2.4vw,32px) clamp(18px,2vw,28px)", background: "#EFEDE8", transition: "background 240ms ease,color 240ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                        {t.k438}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.18", letterSpacing: "-.022em" } as CSSProperties}>
                        {t.k491}
                      </span>
                    </div>
                  </div>
                  <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "12px 32px", marginTop: "24px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    <span>
                      {t.k278}
                    </span>
                    <a className="fa-h4c6dd28" href={lp("/forum") + "#participation"} style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "#16181D", borderBottom: "1px solid #C9C6BE", paddingBottom: "2px", transition: "border-color 200ms ease" } as CSSProperties}>
                      {t.k279}
                      <span aria-hidden="true">
                        {t.k416}
                      </span>
                    </a>
                  </div>
                </div>
              </section>
              <section id="result" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,132px) 0", backgroundColor: "#FF4002", color: "#F7F6F3" } as CSSProperties}>
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  <div data-reveal="" data-delay="620" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,.45)" } as CSSProperties}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#F7F6F3" } as CSSProperties}>
                        {t.k429}
                      </span>
                      <span data-draw="" data-delay="700" style={{ width: "40px", height: "1px", background: "#F7F6F3", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#F7F6F3" } as CSSProperties}>
                      {t.k280}
                    </span>
                  </div>
                  <h2 data-reveal="" data-delay="700" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(34px,6vw,92px)", lineHeight: ".9", letterSpacing: "-.045em", textTransform: "uppercase", maxWidth: "20ch", color: "#F7F6F3" } as CSSProperties}>
                    {t.k281}
                  </h2>
                  <div style={{ marginTop: "clamp(40px,5vw,72px)", borderTop: "1px solid rgba(255,255,255,.4)" } as CSSProperties}>
                    <div data-reveal="" data-delay="740" style={{ opacity: "0", transform: "translateY(16px)", paddingTop: "clamp(18px,2vw,26px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#F7F6F3" } as CSSProperties}>
                      {t.k269}
                    </div>
                    <div data-reveal="" data-delay="780" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px", padding: "clamp(20px,2.2vw,30px) 0", borderBottom: "1px solid rgba(255,255,255,.4)" } as CSSProperties}>
                      <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#F7F6F3" } as CSSProperties}>
                        {t.k420}
                      </span>
                      <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(19px,2vw,30px)", lineHeight: "1.16", letterSpacing: "-.022em", color: "#F7F6F3" } as CSSProperties}>
                        {t.k282}
                        <span data-count="250" style={{ fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                          {t.k442}
                        </span>
                        {t.k283}
                      </span>
                    </div>
                    <div data-reveal="" data-delay="840" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px", padding: "clamp(20px,2.2vw,30px) 0", borderBottom: "1px solid rgba(255,255,255,.4)" } as CSSProperties}>
                      <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#F7F6F3" } as CSSProperties}>
                        {t.k422}
                      </span>
                      <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(19px,2vw,30px)", lineHeight: "1.16", letterSpacing: "-.022em", color: "#F7F6F3" } as CSSProperties}>
                        {t.k284}
                      </span>
                    </div>
                    <div data-reveal="" data-delay="900" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px", padding: "clamp(20px,2.2vw,30px) 0", borderBottom: "1px solid rgba(255,255,255,.4)" } as CSSProperties}>
                      <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#F7F6F3" } as CSSProperties}>
                        {t.k428}
                      </span>
                      <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(19px,2vw,30px)", lineHeight: "1.16", letterSpacing: "-.022em", color: "#F7F6F3" } as CSSProperties}>
                        {t.k285}
                      </span>
                    </div>
                    <div data-reveal="" data-delay="960" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px", padding: "clamp(20px,2.2vw,30px) 0", borderBottom: "1px solid rgba(255,255,255,.4)" } as CSSProperties}>
                      <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#F7F6F3" } as CSSProperties}>
                        {t.k429}
                      </span>
                      <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(19px,2vw,30px)", lineHeight: "1.16", letterSpacing: "-.022em", color: "#F7F6F3" } as CSSProperties}>
                        {t.k492}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              <section id="how" style={{ padding: "clamp(64px,8vw,120px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
                <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#16181D" } as CSSProperties}>
                        {t.k431}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k288}
                    </span>
                  </div>
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,6.4vw,104px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase" } as CSSProperties}>
                    {t.k289}
                  </h2>
                  <div style={{ position: "relative", display: "flex", flexDirection: ("var(--chainDir)" as any), marginTop: "clamp(44px,5.6vw,84px)", height: ("var(--chainHeight)" as any), padding: ("var(--chainPad)" as any) } as CSSProperties}>
                    <span className="fa-axis" aria-hidden="true" data-draw="" data-ms="900" data-ease="cubic-bezier(.16,1,.3,1)" data-dir="x">
                    </span>
                    <div className="fa-node">
                      <span className="fa-tick" aria-hidden="true">
                      </span>
                      <div className="fa-label" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(10px)" } as CSSProperties}>
                        <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                          {t.k420}
                        </span>
                        <span style={{ display: "block", marginTop: "12px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.14", letterSpacing: "-.025em", color: "#16181D" } as CSSProperties}>
                          {t.k493}
                        </span>
                      </div>
                    </div>
                    <div className="fa-node">
                      <span className="fa-tick" aria-hidden="true">
                      </span>
                      <div className="fa-label" data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(10px)" } as CSSProperties}>
                        <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                          {t.k422}
                        </span>
                        <span style={{ display: "block", marginTop: "12px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.14", letterSpacing: "-.025em", color: "#16181D" } as CSSProperties}>
                          {t.k291}
                        </span>
                      </div>
                    </div>
                    <div className="fa-node">
                      <span className="fa-tick" aria-hidden="true">
                      </span>
                      <div className="fa-label" data-reveal="" data-delay="360" style={{ opacity: "0", transform: "translateY(10px)" } as CSSProperties}>
                        <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                          {t.k428}
                        </span>
                        <span style={{ display: "block", marginTop: "12px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.14", letterSpacing: "-.025em", color: "#16181D" } as CSSProperties}>
                          {t.k292}
                        </span>
                      </div>
                    </div>
                    <div className="fa-node">
                      <span className="fa-tick-on" aria-hidden="true">
                      </span>
                      <div className="fa-label" data-reveal="" data-delay="480" style={{ opacity: "0", transform: "translateY(10px)" } as CSSProperties}>
                        <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#16181D" } as CSSProperties}>
                          {t.k429}
                        </span>
                        <span style={{ display: "block", marginTop: "12px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.14", letterSpacing: "-.025em", color: "#16181D" } as CSSProperties}>
                          {t.k293}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(32px,4vw,48px)", paddingTop: "20px", borderTop: "1px solid #DCDAD4", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    {t.k294}
                  </div>
                </div>
              </section>
              <div aria-hidden="true" style={{ overflow: "hidden", background: "#16181D", color: "#F7F6F3", padding: "16px 0" } as CSSProperties}>
                <div data-marquee="" style={{ display: "flex", width: "max-content", animation: "faMarquee 38s linear infinite", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(11px,1.1vw,14px)", letterSpacing: ".18em", textTransform: "uppercase" } as CSSProperties}>
                  <div style={{ display: "flex", gap: "2.2em", paddingRight: "2.2em", whiteSpace: "nowrap" } as CSSProperties}>
                    <span>
                      {t.k494}
                    </span>
                    <span>
                      {t.k417}
                    </span>
                    <span>
                      {t.k495}
                    </span>
                    <span>
                      {t.k417}
                    </span>
                    <span>
                      {t.k297}
                    </span>
                    <span>
                      {t.k417}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "2.2em", paddingRight: "2.2em", whiteSpace: "nowrap" } as CSSProperties}>
                    <span>
                      {t.k494}
                    </span>
                    <span>
                      {t.k417}
                    </span>
                    <span>
                      {t.k495}
                    </span>
                    <span>
                      {t.k417}
                    </span>
                    <span>
                      {t.k297}
                    </span>
                    <span>
                      {t.k417}
                    </span>
                  </div>
                </div>
              </div>
              <section id="apply" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,140px) 0 clamp(64px,8vw,120px)", backgroundColor: "#16181D", color: "#F7F6F3" } as CSSProperties}>
                <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)" } as CSSProperties}>
                </div>
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #3A3D44" } as CSSProperties}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FFFFFF" } as CSSProperties}>
                        {t.k434}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FFFFFF", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                      {t.k130}
                    </span>
                  </div>
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,5.4vw,80px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase", maxWidth: "20ch" } as CSSProperties}>
                    {t.k298}
                    <br />
                    {t.k496}
                  </h2>
                  <div data-reveal="" data-delay="100" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", marginTop: "24px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#FFFFFF" } as CSSProperties}>
                    <span aria-hidden="true" style={{ width: "8px", height: "8px", background: "#FFFFFF" } as CSSProperties}>
                    </span>
                    <span>
                      {t.k247}
                    </span>
                  </div>
                  {notSent ? (
                  <>
                    <form onSubmit={submit} noValidate data-reveal="" data-delay="160" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(36px,4.4vw,56px)", maxWidth: "820px", background: "#FFFFFF", color: "#16181D", padding: "clamp(26px,3.2vw,52px)", boxShadow: "14px 14px 0 rgba(255,255,255,.16)" } as CSSProperties}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,28px)" } as CSSProperties}>
                        <div>
                          <label htmlFor="aw-name" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k300}
                          </label>
                          <input className="fa-hbd8acac" id="aw-name" name="name" type="text" autoComplete="name" onInput={onName} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                            {errName}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="aw-org" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k301}
                          </label>
                          <input className="fa-hbd8acac" id="aw-org" name="org" type="text" autoComplete="organization" onInput={onOrg} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                            {errOrg}
                          </div>
                        </div>
                        <div>
                          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k302}
                          </span>
                          <div role="radiogroup" aria-label={t.k302} style={{ display: "flex", flexWrap: "wrap", gap: "1px", marginTop: "12px", background: "#C9C6BE", outline: "1px solid #C9C6BE" } as CSSProperties}>
                            <button type="button" role="radio" aria-checked={isAward} onClick={pickAward} style={{ flex: "1 1 200px", padding: "15px 22px", background: awardBg, color: awardFg, border: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", textAlign: "left", cursor: "pointer", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                              {t.k269}
                            </button>
                            <button type="button" role="radio" aria-checked={isStudent} onClick={pickStudent} style={{ flex: "1 1 200px", padding: "15px 22px", background: studentBg, color: studentFg, border: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", textAlign: "left", cursor: "pointer", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                              {t.k272}
                            </button>
                          </div>
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                            {errTrack}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="aw-nomination" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k303}
                          </label>
                          <select className="fa-hbd8acac" id="aw-nomination" name="nomination" onChange={onNomination} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "#FFFFFF", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", appearance: "none", borderRadius: "0", transition: "border-color 200ms ease" } as CSSProperties}>
                            <option value="">
                              {nominationPlaceholder}
                            </option>
                            {nomOptions.map((opt, i) => (
                            <Fragment key={i}>
                              <option value={opt.title}>
                                {opt.title}
                              </option>
                            </Fragment>
                            ))}
                          </select>
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                            {errNomination}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="aw-email" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k455}
                          </label>
                          <input className="fa-hbd8acac" id="aw-email" name="email" type="email" autoComplete="email" onInput={onEmail} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                            {errEmail}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="aw-phone" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k120}
                          </label>
                          <input className="fa-hbd8acac" id="aw-phone" name="phone" type="tel" autoComplete="tel" onInput={onPhone} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                            {errPhone}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="aw-url" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k305}
                          </label>
                          <input className="fa-hbd8acac" id="aw-url" name="url" type="url" inputMode="url" placeholder={t.k497} onInput={onUrl} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                            {errUrl}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="aw-desc" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k306}
                          </label>
                          <textarea className="fa-hbd8acac" id="aw-desc" name="desc" rows={4} maxLength={300} onInput={onDesc} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", lineHeight: "1.5", resize: "vertical", outline: "none", transition: "border-color 200ms ease" } as CSSProperties}>
                          </textarea>
                          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em" } as CSSProperties}>
                            <span style={{ fontWeight: "500", color: "#16181D" } as CSSProperties}>
                              {errDesc}
                            </span>
                            <span style={{ color: "#6E7278" } as CSSProperties}>
                              {descCount}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: "clamp(28px,3vw,40px)", paddingTop: "20px", borderTop: "1px solid #DCDAD4", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k307}
                      </div>
                      <button className="fa-h88f6f23" type="submit" style={{ marginTop: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "18px 36px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                        {t.k121}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                          {t.k416}
                        </span>
                      </button>
                    </form>
                  </>
                  ) : null}
                  {sent ? (
                  <>
                    <div style={{ marginTop: "clamp(36px,4.4vw,56px)", padding: "clamp(26px,3.2vw,48px)", background: "#FFFFFF", color: "#16181D", maxWidth: "65ch", boxShadow: "14px 14px 0 rgba(255,255,255,.16)" } as CSSProperties}>
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,1.9vw,24px)" } as CSSProperties}>
                        {t.k122}
                      </div>
                      <p style={{ margin: "16px 0 0", fontSize: "16px", lineHeight: "1.6", color: "#5C5F66" } as CSSProperties}>
                        {t.k308}
                      </p>
                    </div>
                  </>
                  ) : null}
                </div>
              </section>
              <section style={{ padding: "clamp(56px,7vw,96px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
                <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px 48px", padding: "clamp(28px,3.4vw,56px)", background: "#16181D", color: "#F7F6F3" } as CSSProperties}>
                    <h3 style={{ margin: "0", flex: "1 1 420px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.4vw,36px)", lineHeight: "1.1", letterSpacing: "-.025em", maxWidth: "26ch" } as CSSProperties}>
                      {t.k309}
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" } as CSSProperties}>
                      <a className="fa-hcb630f1" href={lp("/forum")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "19px 38px", border: "1px solid #F7F6F3", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                        {t.k9}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                          {t.k416}
                        </span>
                      </a>
                      <a className="fa-hdf939ad" href={lp("/")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "19px 38px", border: "1px solid #3A3D44", color: "#B9BBC0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                        {t.k243}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                          {t.k416}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </main>
            <footer id="contacts" style={{ position: "relative", overflow: "hidden", backgroundColor: "#16181D", color: "#F7F6F3", padding: "clamp(40px,5vw,64px) 0 40px", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)" } as CSSProperties}>
              <div aria-hidden="true" style={{ position: "relative", overflow: "hidden", paddingBottom: "clamp(28px,3.4vw,48px)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)" } as CSSProperties}>
                <div data-marquee="" style={{ display: "flex", width: "max-content", animation: "faMarquee 44s linear infinite", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(34px,6.4vw,104px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase", color: "rgba(247,246,243,.17)" } as CSSProperties}>
                  <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                    <span>
                      {t.k401}
                    </span>
                    <span style={{ color: "#FFFFFF" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k498}
                    </span>
                    <span style={{ color: "#FFFFFF" } as CSSProperties}>
                      {t.k417}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                    <span>
                      {t.k401}
                    </span>
                    <span style={{ color: "#FFFFFF" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k498}
                    </span>
                    <span style={{ color: "#FFFFFF" } as CSSProperties}>
                      {t.k417}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "48px", borderTop: "1px solid #3A3D44", paddingTop: "clamp(40px,5vw,56px)" } as CSSProperties}>
                  <div style={{ flex: "1 1 300px", minWidth: "0" } as CSSProperties}>
                    <img src="/img/0ce5b0d8a0.png" alt={t.k401} style={{ height: "104px", width: "auto", maxWidth: "100%", display: "block" } as CSSProperties} />
                    <p style={{ margin: "24px 0 0", fontSize: "15px", lineHeight: "1.6", color: "#8E9198", maxWidth: "none" } as CSSProperties}>
                      {t.k251}
                    </p>
                  </div>
                  <nav aria-label={t.k125} style={{ flex: "0 1 176px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#B9BBC0" } as CSSProperties}>
                    <a className="fa-hc3889f8" href={lp("/")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k35}
                    </a>
                    <a className="fa-hc3889f8" href={lp("/forum")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k9}
                    </a>
                    <a className="fa-hc3889f8" href="#nominations" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k277}
                    </a>
                    <a className="fa-hc3889f8" href="#apply" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k130}
                    </a>
                  </nav>
                  <div style={{ flex: "0 1 280px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#B9BBC0" } as CSSProperties}>
                    <a className="fa-hc3889f8" href="mailto:marketing@lh47arch.com" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k457}
                    </a>
                    <a className="fa-hc3889f8" href="mailto:marketing@instylehome.md" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k458}
                    </a>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" } as CSSProperties}>
                      <a className="fa-hc3889f8" href="tel:+37368199951" style={{ transition: "color 200ms ease" } as CSSProperties}>
                        {t.k459}
                      </a>
                      <span style={{ color: "#8E9198" } as CSSProperties}>
                        {t.k460}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" } as CSSProperties}>
                      <a className="fa-hc3889f8" href="tel:+37368059311" style={{ transition: "color 200ms ease" } as CSSProperties}>
                        {t.k461}
                      </a>
                      <span style={{ color: "#8E9198" } as CSSProperties}>
                        {t.k462}
                      </span>
                    </div>
                  </div>
                  <div className="fa-social" style={{ flex: "0 1 160px", color: "#B9BBC0" } as CSSProperties}>
                    <a href="#" aria-label={t.k463}>
                      <svg sc-camel-view-box="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="5">
                        </rect>
                        <circle cx="12" cy="12" r="4.2">
                        </circle>
                        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none">
                        </circle>
                      </svg>
                      <span className="fa-sr">
                        {t.k463}
                      </span>
                    </a>
                    <a href="#" aria-label={t.k464}>
                      <svg sc-camel-view-box="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.3-.13-2.47-.13-2.44 0-4.11 1.49-4.11 4.23V9.9H7.4V13h2.72v8h3.38z">
                        </path>
                      </svg>
                      <span className="fa-sr">
                        {t.k464}
                      </span>
                    </a>
                    <a href="#" aria-label={t.k465}>
                      <svg sc-camel-view-box="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M6.94 8.6H3.9V21h3.04V8.6zM5.42 3A1.8 1.8 0 105.4 6.6 1.8 1.8 0 005.42 3zM21 14.2c0-3.4-1.82-4.98-4.24-4.98-1.96 0-2.83 1.08-3.32 1.84V8.6H10.4c.04.86 0 12.4 0 12.4h3.04v-6.92c0-.33.02-.66.12-.9.27-.66.87-1.34 1.9-1.34 1.33 0 1.87 1.02 1.87 2.5V21H21v-6.8z">
                        </path>
                      </svg>
                      <span className="fa-sr">
                        {t.k465}
                      </span>
                    </a>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 32px", marginTop: "clamp(40px,5vw,64px)", paddingTop: "24px", borderTop: "1px solid #3A3D44" } as CSSProperties}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                    {t.k126}
                  </span>
                  <img src="/img/d65b278e9b.png" alt={t.k444} style={{ height: "24px", width: "auto", display: "block", filter: "brightness(0) invert(.62)", opacity: ".9" } as CSSProperties} />
                  <img src="/img/d7f7cfad4d.png" alt={t.k450} style={{ height: "18px", width: "auto", display: "block", filter: "brightness(0) invert(.62)", opacity: ".9" } as CSSProperties} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px 32px", marginTop: "32px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                  <div style={{ display: "flex", gap: "8px" } as CSSProperties}>
                    <a href={lhref("ro")} style={{ color: "inherit" } as CSSProperties}>
                      {t.k402}
                    </a>
                    <span style={{ color: "#3A3D44" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("ru")} style={{ color: "#16181D" } as CSSProperties}>
                      {t.k404}
                    </a>
                    <span style={{ color: "#3A3D44" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("en")} style={{ color: "inherit" } as CSSProperties}>
                      {t.k405}
                    </a>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" } as CSSProperties}>
                    <span>
                      {t.k466}
                    </span>
                    <a className="fa-hc3889f8" href={lp("/privacy")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k127}
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
    </>
  )
}
