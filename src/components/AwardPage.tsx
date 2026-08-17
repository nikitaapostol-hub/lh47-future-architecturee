'use client'

/* Award — ported from the original dc bundle.
   Markup and inline styles are carried over verbatim; the values the old
   runtime computed in JS are now CSS custom properties (see globals.css). */

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

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
  deadlineLabel, deadlineDate, countdownVisible = true, juryVisible = false,
  jury: juryProp = [], nominations: nomProp = [], studentNominations: studentProp = [],
}: Props) {

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
    if (!d.name.trim()) n.name = 'Укажите имя и фамилию'
    if (!d.org.trim()) n.org = 'Укажите компанию или учебное заведение'
    if (!d.track) n.track = 'Выберите, куда подаёте'
    if (!d.nomination) n.nomination = 'Выберите номинацию'
    if (!EMAIL_RE.test(d.email.trim())) n.email = 'Проверьте адрес почты'
    if (d.phone.replace(/\D/g, '').length < 8) n.phone = 'Проверьте номер телефона'
    if (!/^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(d.url.trim())) n.url = 'Укажите ссылку вида https://'
    if (!d.desc.trim()) n.desc = 'Добавьте короткое описание проекта'
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
    : Array.from({ length: 8 }, (_, i) => ({ no: String(i + 1).padStart(2, '0'), title: 'Номинация ' + String(i + 1).padStart(2, '0') }))
  const studentNoms: Nom[] = studentProp.length ? studentProp
    : [{ no: '01', title: '[ПЛЕЙСХОЛДЕР · НОМИНАЦИЯ СТУДЕНЧЕСКОГО КОНКУРСА]' }]

  const nominations = baseNoms.map((x, i) => ({ ...x, delay: (Math.floor(i / cols) + (i % cols)) * 60 }))
  const nomOptions = track === STUDENT_TRACK ? studentNoms : track === AWARD_TRACK ? baseNoms : []
  const jury = juryVisible ? juryProp : []

  const onName = field('name'), onOrg = field('org'), onEmail = field('email')
  const onPhone = field('phone'), onUrl = field('url'), onDesc = field('desc')
  const errName = err.name || '', errOrg = err.org || '', errTrack = err.track || ''
  const errNomination = err.nomination || '', errEmail = err.email || ''
  const errPhone = err.phone || '', errUrl = err.url || '', errDesc = err.desc || ''
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
  const resolvedDeadlineLabel = deadlineLabel || '20 ноября'
  const resolvedDeadlineDate = deadlineDate || '2026-11-20T23:59:00+02:00'

  return (
    <>
      {" "}
      {" "}
      <div style={{ background: "#F7F6F3", color: "#16181D", overflowX: "hidden" } as CSSProperties}>
        {" "}
        <header data-header="" data-header-solid="" style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "60", background: "rgba(247,246,243,.94)", borderBottom: "1px solid #DCDAD4", transition: "background 300ms ease,border-color 300ms ease" } as CSSProperties}>
          {" "}
          <div data-header-inner="" style={{ maxWidth: "1720px", margin: "0 auto", padding: "20px clamp(20px,4.8vw,108px)", display: "flex", alignItems: "center", gap: "24px", transition: "padding 300ms ease" } as CSSProperties}>
            {" "}
            <a href="/" data-page="" style={{ display: "flex", alignItems: "center", gap: "12px" } as CSSProperties}>
              {" "}
              <img src="/img/5dd2fe9c60.png" alt="" style={{ height: "30px", width: "auto", display: "block" } as CSSProperties} />
              {" "}
              <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "13px", letterSpacing: ".14em", textTransform: "uppercase", whiteSpace: "nowrap" } as CSSProperties}>
                Future Architecture
              </span>
              {" "}
            </a>
            {" "}
            <nav aria-label="Основная навигация" style={{ marginLeft: "auto", minWidth: "0", display: ("var(--navDisplay)" as any), alignItems: "center", gap: "24px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
              {" "}
              <a className="fa-hb09baf5" href="/" data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                Сообщество
              </a>
              {" "}
              <a className="fa-hb09baf5" href="/forum" data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                Форум 2026
              </a>
              {" "}
              <a href="#top" aria-current="page" style={{ color: "#16181D", fontWeight: "600" } as CSSProperties}>
                Премия
              </a>
              {" "}
              <a className="fa-hb09baf5" href="#contacts" style={{ transition: "color 200ms ease" } as CSSProperties}>
                Контакты
              </a>
              {" "}
            </nav>
            {" "}
            <div style={{ display: ("var(--navDisplay)" as any), alignItems: "center", gap: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em" } as CSSProperties}>
              {" "}
              <span title="Перевод готовится" style={{ color: "#6E7278" } as CSSProperties}>
                RO
              </span>
              {" "}
              <span style={{ color: "#DCDAD4" } as CSSProperties}>
                /
              </span>
              {" "}
              <span aria-current="true" style={{ color: "#16181D" } as CSSProperties}>
                RU
              </span>
              {" "}
              <span style={{ color: "#DCDAD4" } as CSSProperties}>
                /
              </span>
              {" "}
              <span title="Перевод готовится" style={{ color: "#6E7278" } as CSSProperties}>
                EN
              </span>
              {" "}
            </div>
            {" "}
            <a className="fa-ha683e68" href="#apply" style={{ display: ("var(--navDisplay)" as any), flex: "0 0 auto", alignItems: "center", padding: "12px 22px", background: "#16181D", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2", whiteSpace: "nowrap", border: "1px solid #16181D", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
              Подать заявку
            </a>
            {" "}
            <button type="button" aria-label="Меню" onClick={toggleMenu} style={{ display: ("var(--burgerDisplay)" as any), marginLeft: "auto", flexDirection: "column", justifyContent: "center", gap: "6px", width: "44px", height: "44px", padding: "0", background: "transparent", border: "0", cursor: "pointer" } as CSSProperties}>
              {" "}
              <span style={{ display: "block", width: "22px", height: "1px", background: "#16181D" } as CSSProperties} />
              {" "}
              <span style={{ display: "block", width: "22px", height: "1px", background: "#16181D" } as CSSProperties} />
              {" "}
            </button>
            {" "}
          </div>
          {" "}
          <div style={{ display: (menu ? "var(--menuDisplay)" : "none"), background: "#F7F6F3", borderTop: "1px solid #DCDAD4", padding: "8px clamp(20px,4.8vw,108px) 32px" } as CSSProperties}>
            {" "}
            <nav aria-label="Мобильная навигация" style={{ display: "flex", flexDirection: "column", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "22px" } as CSSProperties}>
              {" "}
              <a href="/" data-page="" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                Сообщество
              </a>
              {" "}
              <a href="/forum" data-page="" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                Форум 2026
              </a>
              {" "}
              <a href="#top" aria-current="page" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4", fontWeight: "700" } as CSSProperties}>
                Премия
              </a>
              {" "}
              <a href="#contacts" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                Контакты
              </a>
              {" "}
            </nav>
            {" "}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "24px" } as CSSProperties}>
              {" "}
              <div style={{ display: "flex", gap: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em" } as CSSProperties}>
                {" "}
                <span style={{ color: "#6E7278" } as CSSProperties}>
                  RO
                </span>
                <span style={{ color: "#DCDAD4" } as CSSProperties}>
                  /
                </span>
                <span style={{ color: "#16181D" } as CSSProperties}>
                  RU
                </span>
                <span style={{ color: "#DCDAD4" } as CSSProperties}>
                  /
                </span>
                <span style={{ color: "#6E7278" } as CSSProperties}>
                  EN
                </span>
                {" "}
              </div>
              {" "}
              <a href="#apply" onClick={closeMenu} style={{ display: "inline-flex", alignItems: "center", padding: "12px 24px", background: "#16181D", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2" } as CSSProperties}>
                Подать заявку
              </a>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "2px", overflow: "hidden" } as CSSProperties}>
            {" "}
            <div data-progress="" style={{ width: "100%", height: "2px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
            {" "}
          </div>
          {" "}
        </header>
        {" "}
        <main>
          {" "}
          <section id="top" style={{ position: "relative", overflow: "hidden", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(128px,17vh,188px) 0 clamp(24px,3vw,40px)", backgroundColor: "#FFFFFF", color: "#16181D" } as CSSProperties}>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "repeating-linear-gradient(90deg,rgba(22,24,29,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(22,24,29,.06) 0 1px,transparent 1px 80px)" } as CSSProperties} />
            {" "}
            <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)", width: "100%" } as CSSProperties}>
              {" "}
              <div data-anim="" style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "12px 32px", paddingBottom: "14px", borderBottom: "1px solid #DCDAD4", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(10px,.9vw,12px)", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278", animation: "faFade 700ms ease 120ms both" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ color: "#16181D" } as CSSProperties}>
                    01
                  </span>
                  {" "}
                  <span style={{ width: "40px", height: "1px", background: "#C9C6BE" } as CSSProperties} />
                  {" "}
                  <span style={{ color: "#16181D" } as CSSProperties}>
                    Премия отрасли и студенческий конкурс · Кишинёв
                  </span>
                  {" "}
                </div>
                {" "}
                <span>
                  Future Architecture Forum 2026
                </span>
                {" "}
              </div>
              {" "}
              <h1 data-fit-head="" style={{ margin: "clamp(22px,2.8vw,44px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", textTransform: "uppercase", lineHeight: ".86", letterSpacing: "-.05em", fontSize: "clamp(30px,9vw,150px)", whiteSpace: "nowrap" } as CSSProperties}>
                {" "}
                <span style={{ display: "block", overflow: "hidden", paddingBottom: ".03em" } as CSSProperties}>
                  <span data-anim="" data-fit-line="" style={{ display: "block", animation: "faRise 1000ms cubic-bezier(.16,1,.3,1) 180ms both" } as CSSProperties}>
                    Лучшее за год
                  </span>
                </span>
                {" "}
                <span style={{ display: "block", overflow: "hidden", paddingBottom: ".03em" } as CSSProperties}>
                  <span data-anim="" data-fit-line="" style={{ display: "block", animation: "faRise 1000ms cubic-bezier(.16,1,.3,1) 300ms both" } as CSSProperties}>
                    в архитектуре
                  </span>
                </span>
                {" "}
              </h1>
              {" "}
              <div data-anim="" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "28px 48px", marginTop: "clamp(24px,3vw,44px)", animation: "faFade 800ms ease 700ms both" } as CSSProperties}>
                {" "}
                <p style={{ flex: "1 1 420px", maxWidth: "58ch", fontSize: "clamp(16px,1.4vw,22px)", lineHeight: "1.45", letterSpacing: "-.01em", color: "#5C5F66" } as CSSProperties}>
                  Future Architecture Award — награды для проектов, компаний и профессионалов отрасли и конкурс для студентов. Победителей объявляют 3 декабря на форуме в Кишинёве, в зале на 250 человек.
                </p>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "6px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(11px,1vw,13px)", letterSpacing: ".12em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
                  {" "}
                  <span data-pulse="" style={{ width: "8px", height: "8px", background: "#16181D", animation: "faPulse 2s ease-in-out infinite" } as CSSProperties} />
                  {" "}
                  <span>
                    Заявки принимаются до {resolvedDeadlineLabel}
                  </span>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div data-countdown="" data-target={resolvedDeadlineDate} style={{ display: countdownDisplay, flexWrap: "wrap", marginTop: "clamp(28px,3.6vw,52px)", borderTop: "1px solid #DCDAD4", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)" } as CSSProperties}>
                  {" "}
                  <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                    <span data-cd="d">
                      –
                    </span>
                  </div>
                  {" "}
                  <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    дней
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid #DCDAD4" } as CSSProperties}>
                  {" "}
                  <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                    <span data-cd="h">
                      –
                    </span>
                  </div>
                  {" "}
                  <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    часов
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid #DCDAD4" } as CSSProperties}>
                  {" "}
                  <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                    <span data-cd="m">
                      –
                    </span>
                  </div>
                  {" "}
                  <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    минут
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid #DCDAD4" } as CSSProperties}>
                  {" "}
                  <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                    <span data-cd="s">
                      –
                    </span>
                  </div>
                  {" "}
                  <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    секунд
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{ flex: "1 1 200px", minWidth: "180px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "8px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid #DCDAD4" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    осталось до конца приёма заявок
                  </span>
                  {" "}
                  <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(15px,1.4vw,20px)", letterSpacing: "-.01em" } as CSSProperties}>
                    {resolvedDeadlineLabel}
                  </span>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div data-anim="" style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "clamp(24px,3vw,40px)", animation: "faFade 800ms ease 820ms both" } as CSSProperties}>
                {" "}
                <button className="fa-h7a3127f" type="button" onClick={goAward} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "19px 38px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease,box-shadow 220ms ease" } as CSSProperties}>
                  Подать проект компании
                </button>
                {" "}
                <button className="fa-h803f418" type="button" onClick={goStudent} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "19px 38px", background: "transparent", border: "1px solid #16181D", color: "#16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 220ms ease,color 220ms ease,transform 220ms ease" } as CSSProperties}>
                  Подать студенческую работу
                </button>
                {" "}
              </div>
              {" "}
              <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "clamp(20px,2.4vw,32px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                {" "}
                <span aria-hidden="true" style={{ display: "block", width: "1px", height: "34px", background: "#16181D" } as CSSProperties} />
                {" "}
                <span>
                  листайте
                </span>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <section id="tracks" style={{ padding: "clamp(64px,8vw,120px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#16181D" } as CSSProperties}>
                    02
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                  Участники
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,6.4vw,104px)", lineHeight: ".88", letterSpacing: "-.05em", textTransform: "uppercase" } as CSSProperties}>
                Кто может подать заявку
              </h2>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: ("var(--twoCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,60px)", background: "#DCDAD4", borderTop: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "clamp(16px,1.8vw,24px)", padding: "clamp(28px,3vw,44px) clamp(24px,2.6vw,40px) clamp(32px,3.4vw,52px) 0", background: "#F7F6F3" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    01
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(26px,3vw,44px)", lineHeight: "1.02", letterSpacing: "-.035em" } as CSSProperties}>
                    Премия отрасли
                  </h3>
                  {" "}
                  <p style={{ fontSize: "clamp(15px,1.15vw,18px)", lineHeight: "1.55", color: "#6E7278", maxWidth: "40ch" } as CSSProperties}>
                    Для архитектурных бюро, дизайн-студий, девелоперов, производителей и отдельных профессионалов.
                  </p>
                  {" "}
                  <p style={{ fontSize: "clamp(16px,1.3vw,20px)", lineHeight: "1.5", color: "#5C5F66", maxWidth: "40ch" } as CSSProperties}>
                    Подаются объекты и интерьеры, завершённые за последний год, а также продукты и практика компании.
                  </p>
                  {" "}
                </div>
                {" "}
                <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "clamp(16px,1.8vw,24px)", padding: "clamp(28px,3vw,44px) 0 clamp(32px,3.4vw,52px) clamp(24px,2.6vw,40px)", background: "#F7F6F3" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    02
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(26px,3vw,44px)", lineHeight: "1.02", letterSpacing: "-.035em" } as CSSProperties}>
                    Студенческий конкурс
                  </h3>
                  {" "}
                  <p style={{ fontSize: "clamp(15px,1.15vw,18px)", lineHeight: "1.55", color: "#6E7278", maxWidth: "40ch" } as CSSProperties}>
                    Для студентов архитектуры и дизайна.
                  </p>
                  {" "}
                  <p style={{ fontSize: "clamp(16px,1.3vw,20px)", lineHeight: "1.5", color: "#5C5F66", maxWidth: "40ch" } as CSSProperties}>
                    Тема года — идеи для общественных пространств и архитектурного облика городов Молдовы. Принимаются учебные, дипломные и собственные проекты.
                  </p>
                  {" "}
                  <span style={{ marginTop: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    Победителей конкурса награждают на той же сцене, что и компании
                  </span>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <section id="nominations" style={{ padding: "clamp(64px,8vw,120px) 0", backgroundColor: "#EFEDE8" } as CSSProperties}>
            {" "}
            <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #C9C6BE" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#16181D" } as CSSProperties}>
                    03
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                  За что награждают
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(40px,7vw,110px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase" } as CSSProperties}>
                Номинации
              </h2>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: ("var(--nomCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,60px)", background: "#C9C6BE", borderTop: "1px solid #C9C6BE" } as CSSProperties}>
                {" "}
                {(nominations || []).map((nom, nom_i) => (
                  <Fragment key={nom_i}>
                  {" "}
                  <div className="fa-h13caac1" data-reveal="" data-delay={nom.delay} style={{ opacity: "0", transform: "translateY(14px)", display: "flex", alignItems: "baseline", gap: "16px", padding: "clamp(22px,2.4vw,32px) clamp(18px,2vw,28px)", background: "#EFEDE8", transition: "background 240ms ease,color 240ms ease" } as CSSProperties}>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                      {nom.no}
                    </span>
                    {" "}
                    <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.18", letterSpacing: "-.022em" } as CSSProperties}>
                      {nom.title}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
              <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "12px 32px", marginTop: "24px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                {" "}
                <span>
                  Список номинаций дополняется
                </span>
                {" "}
                <a className="fa-hd6ad87b" href="Forum.dc.html#participation" data-page="" style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "#16181D", borderBottom: "1px solid #C9C6BE", paddingBottom: "2px", transition: "border-color 200ms ease" } as CSSProperties}>
                  Именная номинация – в пакете партнёра форума{" "}
                  <span aria-hidden="true">
                    →
                  </span>
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <section id="result" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,132px) 0", backgroundColor: "#FF4002", color: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div data-unfill="" aria-hidden="true" style={{ position: "absolute", inset: "0", background: "#EFEDE8", transform: "scaleY(1)", transformOrigin: "top" } as CSSProperties} />
            {" "}
            <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" data-delay="620" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,.45)" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#F7F6F3" } as CSSProperties}>
                    04
                  </span>
                  {" "}
                  <span data-draw="" data-delay="700" style={{ width: "40px", height: "1px", background: "#F7F6F3", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#F7F6F3" } as CSSProperties}>
                  Награда
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="700" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(34px,6vw,92px)", lineHeight: ".9", letterSpacing: "-.045em", textTransform: "uppercase", maxWidth: "20ch", color: "#F7F6F3" } as CSSProperties}>
                Что получает победитель
              </h2>
              {" "}
              <div style={{ marginTop: "clamp(40px,5vw,72px)", borderTop: "1px solid rgba(255,255,255,.4)" } as CSSProperties}>
                {" "}
                <div className="fa-h56641de" data-reveal="" data-delay="780" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px", padding: "clamp(20px,2.2vw,30px) 0", borderBottom: "1px solid rgba(255,255,255,.4)", transition: "padding 240ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#F7F6F3" } as CSSProperties}>
                    01
                  </span>
                  {" "}
                  <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(19px,2vw,30px)", lineHeight: "1.16", letterSpacing: "-.022em", color: "#F7F6F3" } as CSSProperties}>
                    Награду вручают на сцене форума, в зале{" "}
                    <span data-count="250" style={{ fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                      250
                    </span>
                    {" "}человек
                  </span>
                  {" "}
                </div>
                {" "}
                <div className="fa-h56641de" data-reveal="" data-delay="840" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px", padding: "clamp(20px,2.2vw,30px) 0", borderBottom: "1px solid rgba(255,255,255,.4)", transition: "padding 240ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#F7F6F3" } as CSSProperties}>
                    02
                  </span>
                  {" "}
                  <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(19px,2vw,30px)", lineHeight: "1.16", letterSpacing: "-.022em", color: "#F7F6F3" } as CSSProperties}>
                    Проект выходит публикацией в InStyle Home
                  </span>
                  {" "}
                </div>
                {" "}
                <div className="fa-h56641de" data-reveal="" data-delay="900" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px", padding: "clamp(20px,2.2vw,30px) 0", borderBottom: "1px solid rgba(255,255,255,.4)", transition: "padding 240ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#F7F6F3" } as CSSProperties}>
                    03
                  </span>
                  {" "}
                  <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(19px,2vw,30px)", lineHeight: "1.16", letterSpacing: "-.022em", color: "#F7F6F3" } as CSSProperties}>
                    Фото и видео церемонии — для сайта, соцсетей и презентаций
                  </span>
                  {" "}
                </div>
                {" "}
                <div className="fa-h56641de" data-reveal="" data-delay="960" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px", padding: "clamp(20px,2.2vw,30px) 0", borderBottom: "1px solid rgba(255,255,255,.4)", transition: "padding 240ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#F7F6F3" } as CSSProperties}>
                    04
                  </span>
                  {" "}
                  <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(19px,2vw,30px)", lineHeight: "1.16", letterSpacing: "-.022em", color: "#F7F6F3" } as CSSProperties}>
                    Членство в сообществе Future Architecture
                  </span>
                  {" "}
                </div>
                {" "}
                <div className="fa-h56641de" data-reveal="" data-delay="1020" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px", padding: "clamp(20px,2.2vw,30px) 0", borderBottom: "1px solid rgba(255,255,255,.4)", transition: "padding 240ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#F7F6F3" } as CSSProperties}>
                    05
                  </span>
                  {" "}
                  <span style={{ flex: "1 1 320px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(14px,1.2vw,16px)", lineHeight: "1.5", letterSpacing: ".06em", textTransform: "uppercase", color: "#F7F6F3" } as CSSProperties}>
                    [ПЛЕЙСХОЛДЕР · ПРИЗ СТУДЕНЧЕСКОГО КОНКУРСА]
                  </span>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <section id="how" style={{ padding: "clamp(64px,8vw,120px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#16181D" } as CSSProperties}>
                    05
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                  Отбор
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,6.4vw,104px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase" } as CSSProperties}>
                Как проходит отбор
              </h2>
              {" "}
              <div style={{ position: "relative", display: "flex", flexDirection: ("var(--chainDir)" as any), marginTop: "clamp(44px,5.6vw,84px)", height: ("var(--chainHeight)" as any), padding: ("var(--chainPad)" as any) } as CSSProperties}>
                {" "}
                <span aria-hidden="true" data-draw="" data-ms="900" data-ease="cubic-bezier(.16,1,.3,1)" data-dir={axisDir} className="fa-axis" />
                {" "}
                <div className="fa-node">
                  {" "}
                  <span aria-hidden="true" className="fa-tick" />
                  {" "}
                  <div className="fa-label" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(10px)" } as CSSProperties}>
                    {" "}
                    <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                      01
                    </span>
                    {" "}
                    <span style={{ display: "block", marginTop: "12px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.14", letterSpacing: "-.025em", color: "#16181D" } as CSSProperties}>
                      Заявка до {resolvedDeadlineLabel}
                    </span>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="fa-node">
                  {" "}
                  <span aria-hidden="true" className="fa-tick" />
                  {" "}
                  <div className="fa-label" data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(10px)" } as CSSProperties}>
                    {" "}
                    <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                      02
                    </span>
                    {" "}
                    <span style={{ display: "block", marginTop: "12px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.14", letterSpacing: "-.025em", color: "#16181D" } as CSSProperties}>
                      Проверка материалов
                    </span>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="fa-node">
                  {" "}
                  <span aria-hidden="true" className="fa-tick" />
                  {" "}
                  <div className="fa-label" data-reveal="" data-delay="360" style={{ opacity: "0", transform: "translateY(10px)" } as CSSProperties}>
                    {" "}
                    <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                      03
                    </span>
                    {" "}
                    <span style={{ display: "block", marginTop: "12px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.14", letterSpacing: "-.025em", color: "#16181D" } as CSSProperties}>
                      Оценка жюри
                    </span>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="fa-node">
                  {" "}
                  <span aria-hidden="true" className="fa-tick-on" />
                  {" "}
                  <div className="fa-label" data-reveal="" data-delay="480" style={{ opacity: "0", transform: "translateY(10px)" } as CSSProperties}>
                    {" "}
                    <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#16181D" } as CSSProperties}>
                      04
                    </span>
                    {" "}
                    <span style={{ display: "block", marginTop: "12px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.14", letterSpacing: "-.025em", color: "#16181D" } as CSSProperties}>
                      Победители на форуме 3 декабря
                    </span>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(32px,4vw,48px)", paddingTop: "20px", borderTop: "1px solid #DCDAD4", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                [ПЛЕЙСХОЛДЕР · ТРЕБОВАНИЯ К МАТЕРИАЛАМ – ФОРМАТ, ОБЪЁМ, ЯЗЫК]
              </div>
              {" "}
              {juryVisible ? (
                <>
                {" "}
                <div data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(48px,6vw,88px)" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.4vw,34px)", lineHeight: "1", letterSpacing: "-.03em", textTransform: "uppercase" } as CSSProperties}>
                      Жюри
                    </span>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      Состав объявляется поэтапно
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--juryCols)" as any), gap: "1px", marginTop: "1px", background: "#DCDAD4" } as CSSProperties}>
                    {" "}
                    {(jury || []).map((member, member_i) => (
                      <Fragment key={member_i}>
                      {" "}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "clamp(22px,2.4vw,32px)", background: "#F7F6F3" } as CSSProperties}>
                        {" "}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                          {member.no}
                        </span>
                        {" "}
                        <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.16", letterSpacing: "-.022em" } as CSSProperties}>
                          {member.name}
                        </span>
                        {" "}
                        <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#5C5F66" } as CSSProperties}>
                          {member.role}
                        </span>
                        {" "}
                      </div>
                      {" "}
                      </Fragment>
                    ))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                </>
              ) : null}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <div aria-hidden="true" style={{ overflow: "hidden", background: "#16181D", color: "#F7F6F3", padding: "16px 0" } as CSSProperties}>
            {" "}
            <div data-marquee="" style={{ display: "flex", width: "max-content", animation: "faMarquee 38s linear infinite", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(11px,1.1vw,14px)", letterSpacing: ".18em", textTransform: "uppercase" } as CSSProperties}>
              {" "}
              <div style={{ display: "flex", gap: "2.2em", paddingRight: "2.2em", whiteSpace: "nowrap" } as CSSProperties}>
                <span>
                  Заявки до {resolvedDeadlineLabel}
                </span>
                <span>
                  ◆
                </span>
                <span>
                  Future Architecture Award 2026
                </span>
                <span>
                  ◆
                </span>
                <span>
                  Награждение 3 декабря · Кишинёв
                </span>
                <span>
                  ◆
                </span>
              </div>
              {" "}
              <div style={{ display: "flex", gap: "2.2em", paddingRight: "2.2em", whiteSpace: "nowrap" } as CSSProperties}>
                <span>
                  Заявки до {resolvedDeadlineLabel}
                </span>
                <span>
                  ◆
                </span>
                <span>
                  Future Architecture Award 2026
                </span>
                <span>
                  ◆
                </span>
                <span>
                  Награждение 3 декабря · Кишинёв
                </span>
                <span>
                  ◆
                </span>
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <section id="apply" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,140px) 0 clamp(64px,8vw,120px)", backgroundColor: "#16181D", color: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)" } as CSSProperties} />
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", top: "0", left: "0", right: "0", height: "2px", background: "rgba(255,255,255,.14)", overflow: "hidden" } as CSSProperties}>
              {" "}
              <div data-formfill="" style={{ width: "100%", height: "2px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left", transition: "transform 240ms ease" } as CSSProperties} />
              {" "}
            </div>
            {" "}
            <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #3A3D44" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FFFFFF" } as CSSProperties}>
                    06
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#FFFFFF", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                  Заявка
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,5.4vw,80px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase", maxWidth: "20ch" } as CSSProperties}>
                Заявки принимаются
                <br />
                до {resolvedDeadlineLabel}
              </h2>
              {" "}
              <div data-reveal="" data-delay="100" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", marginTop: "24px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#FFFFFF" } as CSSProperties}>
                {" "}
                <span aria-hidden="true" style={{ width: "8px", height: "8px", background: "#FFFFFF" } as CSSProperties} />
                {" "}
                <span>
                  Заполнение занимает две минуты
                </span>
                {" "}
              </div>
              {" "}
              {notSent ? (
                <>
                {" "}
                <form onSubmit={submit} noValidate data-reveal="" data-delay="160" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(36px,4.4vw,56px)", maxWidth: "820px", background: "#FFFFFF", color: "#16181D", padding: "clamp(26px,3.2vw,52px)", boxShadow: "14px 14px 0 rgba(255,255,255,.16)" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,28px)" } as CSSProperties}>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="aw-name" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        Имя и фамилия
                      </label>
                      {" "}
                      <input className="fa-f27ceb91" id="aw-name" name="name" type="text" autoComplete="name" onInput={onName} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                        {errName}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="aw-org" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        Компания или учебное заведение
                      </label>
                      {" "}
                      <input className="fa-f27ceb91" id="aw-org" name="org" type="text" autoComplete="organization" onInput={onOrg} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                        {errOrg}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        Куда подаёте
                      </span>
                      {" "}
                      <div role="radiogroup" aria-label="Куда подаёте" style={{ display: "flex", flexWrap: "wrap", gap: "1px", marginTop: "12px", background: "#C9C6BE", outline: "1px solid #C9C6BE" } as CSSProperties}>
                        {" "}
                        <button type="button" role="radio" aria-checked={isAward} onClick={pickAward} style={{ flex: "1 1 200px", padding: "15px 22px", background: awardBg, color: awardFg, border: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", textAlign: "left", cursor: "pointer", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                          Премия отрасли
                        </button>
                        {" "}
                        <button type="button" role="radio" aria-checked={isStudent} onClick={pickStudent} style={{ flex: "1 1 200px", padding: "15px 22px", background: studentBg, color: studentFg, border: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", textAlign: "left", cursor: "pointer", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                          Студенческий конкурс
                        </button>
                        {" "}
                      </div>
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                        {errTrack}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="aw-nomination" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        Номинация
                      </label>
                      {" "}
                      <select className="fa-f27ceb91" id="aw-nomination" name="nomination" value={nominationValue} onChange={onNomination} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "#FFFFFF", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", appearance: "none", borderRadius: "0", transition: "border-color 200ms ease" } as CSSProperties}>
                        {" "}
                        <option value="">
                          Сначала выберите, куда подаёте
                        </option>
                        {" "}
                        {(nomOptions || []).map((opt, opt_i) => (
                          <Fragment key={opt_i}>
                          {" "}
                          <option value={opt.title}>
                            {opt.title}
                          </option>
                          {" "}
                          </Fragment>
                        ))}
                        {" "}
                      </select>
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                        {errNomination}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="aw-email" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        E-mail
                      </label>
                      {" "}
                      <input className="fa-f27ceb91" id="aw-email" name="email" type="email" autoComplete="email" onInput={onEmail} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                        {errEmail}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="aw-phone" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        Телефон
                      </label>
                      {" "}
                      <input className="fa-f27ceb91" id="aw-phone" name="phone" type="tel" autoComplete="tel" onInput={onPhone} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                        {errPhone}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="aw-url" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        Ссылка на материалы проекта
                      </label>
                      {" "}
                      <input className="fa-f27ceb91" id="aw-url" name="url" type="url" inputMode="url" placeholder="https://" onInput={onUrl} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: ".06em", color: "#16181D" } as CSSProperties}>
                        {errUrl}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="aw-desc" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        Коротко о проекте
                      </label>
                      {" "}
                      <textarea className="fa-f27ceb91" id="aw-desc" name="desc" rows={4} maxLength={300} onInput={onDesc} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", lineHeight: "1.5", resize: "vertical", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em" } as CSSProperties}>
                        {" "}
                        <span style={{ fontWeight: "500", color: "#16181D" } as CSSProperties}>
                          {errDesc}
                        </span>
                        {" "}
                        <span style={{ color: "#6E7278" } as CSSProperties}>
                          {descCount}
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ marginTop: "clamp(28px,3vw,40px)", paddingTop: "20px", borderTop: "1px solid #DCDAD4", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    Материалы принимаются ссылкой на облако или портфолио — загружать файлы не нужно
                  </div>
                  {" "}
                  <button className="fa-ha683e68" type="submit" style={{ marginTop: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "18px 36px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                    Отправить заявку
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                      →
                    </span>
                  </button>
                  {" "}
                </form>
                {" "}
                </>
              ) : null}
              {" "}
              {sent ? (
                <>
                {" "}
                <div style={{ marginTop: "clamp(36px,4.4vw,56px)", padding: "clamp(26px,3.2vw,48px)", background: "#FFFFFF", color: "#16181D", maxWidth: "65ch", boxShadow: "14px 14px 0 rgba(255,255,255,.16)" } as CSSProperties}>
                  {" "}
                  <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,1.9vw,24px)" } as CSSProperties}>
                    Заявка отправлена
                  </div>
                  {" "}
                  <p style={{ margin: "16px 0 0", fontSize: "16px", lineHeight: "1.6", color: "#5C5F66" } as CSSProperties}>
                    Ответ придёт на указанную почту после проверки материалов.
                  </p>
                  {" "}
                </div>
                {" "}
                </>
              ) : null}
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <section style={{ padding: "clamp(56px,7vw,96px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px 48px", padding: "clamp(28px,3.4vw,56px)", background: "#16181D", color: "#F7F6F3" } as CSSProperties}>
                {" "}
                <h3 style={{ margin: "0", flex: "1 1 420px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.4vw,36px)", lineHeight: "1.1", letterSpacing: "-.025em", maxWidth: "26ch" } as CSSProperties}>
                  Награды вручают на форуме. Сообщество работает между форумами.
                </h3>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" } as CSSProperties}>
                  {" "}
                  <a className="fa-hb2c1ca2" href="/forum" data-page="" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "19px 38px", border: "1px solid #F7F6F3", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                    Форум 2026
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                      →
                    </span>
                  </a>
                  {" "}
                  <a className="fa-h7d2f5f0" href="/" data-page="" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "19px 38px", border: "1px solid #3A3D44", color: "#B9BBC0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                    О сообществе
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                      →
                    </span>
                  </a>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
        </main>
        {" "}
        <footer id="contacts" style={{ position: "relative", overflow: "hidden", backgroundColor: "#16181D", color: "#F7F6F3", padding: "clamp(40px,5vw,64px) 0 40px", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)" } as CSSProperties}>
          {" "}
          <div aria-hidden="true" style={{ position: "relative", overflow: "hidden", paddingBottom: "clamp(28px,3.4vw,48px)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)" } as CSSProperties}>
            {" "}
            <div data-marquee="" style={{ display: "flex", width: "max-content", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(52px,10vw,150px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase", color: "rgba(247,246,243,.17)" } as CSSProperties}>
              {" "}
              <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                <span>
                  Future Architecture
                </span>
                <span style={{ color: "#FFFFFF" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Award 2026
                </span>
                <span style={{ color: "#FFFFFF" } as CSSProperties}>
                  ◆
                </span>
              </div>
              {" "}
              <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                <span>
                  Future Architecture
                </span>
                <span style={{ color: "#FFFFFF" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Award 2026
                </span>
                <span style={{ color: "#FFFFFF" } as CSSProperties}>
                  ◆
                </span>
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
            {" "}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "48px", borderTop: "1px solid #3A3D44", paddingTop: "clamp(40px,5vw,56px)" } as CSSProperties}>
              {" "}
              <div style={{ flex: "1 1 260px" } as CSSProperties}>
                {" "}
                <img src="/img/0ce5b0d8a0.png" alt="Future Architecture" style={{ height: "104px", width: "auto", display: "block" } as CSSProperties} />
                {" "}
                <p style={{ margin: "24px 0 0", fontSize: "15px", lineHeight: "1.6", color: "#8E9198", maxWidth: "32ch" } as CSSProperties}>
                  Форум и профессиональное сообщество архитектуры, дизайна и девелопмента в Молдове
                </p>
                {" "}
              </div>
              {" "}
              <nav aria-label="Навигация в подвале" style={{ flex: "0 1 176px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#B9BBC0" } as CSSProperties}>
                {" "}
                <a className="fa-h8d05fde" href="/" data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Сообщество
                </a>
                {" "}
                <a className="fa-h8d05fde" href="/forum" data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Форум 2026
                </a>
                {" "}
                <a className="fa-h8d05fde" href="#nominations" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Номинации
                </a>
                {" "}
                <a className="fa-h8d05fde" href="#apply" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Заявка
                </a>
                {" "}
              </nav>
              {" "}
              <div style={{ flex: "0 1 280px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#B9BBC0" } as CSSProperties}>
                {" "}
                <a className="fa-h8d05fde" href="mailto:marketing@lh47arch.com" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  marketing@lh47arch.com
                </a>
                {" "}
                <a className="fa-h8d05fde" href="mailto:marketing@instylehome.md" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  marketing@instylehome.md
                </a>
                {" "}
                <span style={{ color: "#8E9198" } as CSSProperties}>
                  future-arch.md/forum2026
                </span>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" } as CSSProperties}>
                  <a className="fa-h8d05fde" href="tel:+37368199951" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    (+373) 68 199 951
                  </a>
                  <span style={{ color: "#8E9198" } as CSSProperties}>
                    – InStyle Home
                  </span>
                </div>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" } as CSSProperties}>
                  <a className="fa-h8d05fde" href="tel:+37368059311" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    (+373) 68 059 311
                  </a>
                  <span style={{ color: "#8E9198" } as CSSProperties}>
                    – LH47
                  </span>
                </div>
                {" "}
              </div>
              {" "}
              <div style={{ flex: "0 1 160px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#B9BBC0" } as CSSProperties}>
                {" "}
                <a className="fa-h8d05fde" href="#" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Instagram
                </a>
                {" "}
                <a className="fa-h8d05fde" href="#" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Facebook
                </a>
                {" "}
                <a className="fa-h8d05fde" href="#" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  LinkedIn
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 32px", marginTop: "clamp(40px,5vw,64px)", paddingTop: "24px", borderTop: "1px solid #3A3D44" } as CSSProperties}>
              {" "}
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                Партнёры
              </span>
              {" "}
              <img src="/img/d65b278e9b.png" alt="LH47 arch." style={{ height: "24px", width: "auto", display: "block", filter: "brightness(0) invert(.62)", opacity: ".9" } as CSSProperties} />
              {" "}
              <img src="/img/d7f7cfad4d.png" alt="InStyle Home" style={{ height: "18px", width: "auto", display: "block", filter: "brightness(0) invert(.62)", opacity: ".9" } as CSSProperties} />
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px 32px", marginTop: "32px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
              {" "}
              <div style={{ display: "flex", gap: "8px" } as CSSProperties}>
                {" "}
                <span>
                  RO
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  /
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  RU
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  /
                </span>
                <span>
                  EN
                </span>
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" } as CSSProperties}>
                {" "}
                <span>
                  © 2026 Future Architecture
                </span>
                {" "}
                <a className="fa-h8d05fde" href="#" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Политика данных
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </footer>
        {" "}
      </div>
      {" "}
    </>
  )
}
