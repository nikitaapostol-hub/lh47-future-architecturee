'use client'

/* Forum — ported from the original dc bundle.
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

type Props = {
  t: Dict; lang: Lang; forumDate?: string; countdownVisible?: boolean }

export default function ForumPage({
  t, lang, forumDate, countdownVisible = true }: Props) {

  // "/forum" stays "/forum" in Russian and becomes "/ro/forum" elsewhere
  const lp = (p: string) => langPath(lang, p)
  const lhref = (c: Lang) => langPath(c, "/forum")
  /* подсветка активного языка: на светлом фоне тёмная, на тёмном светлая */
  const langColor = (c: Lang, on: string, off: string) => (c === lang ? on : off)

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
  const [hv, setHv] = useState('')
  const data = useRef({ name: '', company: '', role: '', kind: '', email: '', phone: '' })
  const kindEl = useRef<HTMLSelectElement | null>(null)
  const kindRef = useCallback((el: HTMLSelectElement | null) => { kindEl.current = el }, [])

  // hero glow follows the pointer (was componentDidMount in the original)
  useEffect(() => {
    let raf: number | null = null
    const onMove = (e: PointerEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const glow = document.querySelector('[data-hero-glow]') as HTMLElement | null
        const hero = document.getElementById('top')
        if (!glow || !hero) return
        const r = hero.getBoundingClientRect()
        if (r.bottom < 0) return
        glow.style.left = Math.max(0, Math.min(r.width, e.clientX - r.left)) + 'px'
        glow.style.top = Math.max(0, Math.min(r.height, e.clientY - r.top)) + 'px'
        glow.style.transition =
          'left 700ms cubic-bezier(.2,.8,.2,1), top 700ms cubic-bezier(.2,.8,.2,1)'
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const FA = (window as any).FA
    if (FA) { FA.scan(); FA.refresh() }
  })

  const field = (k: string) => (e: any) => {
    ;(data.current as any)[k] = e.target.value
    setErr((prev) => { if (!prev[k]) return prev; const n = { ...prev }; delete n[k]; return n })
  }

  const card = (k: string) => ({
    bg: hv === k ? '#16181D' : '#F7F6F3',
    fg: hv === k ? '#F7F6F3' : '#16181D',
    ghost: hv === k ? 'rgba(255,255,255,.07)' : '#EAE7E0',
    tag: hv === k ? '#FF4002' : '#6E7278',
    dot: hv === k ? '#FF4002' : '#C9C6BE',
  })
  const t1 = card('t1'), t2 = card('t2'), t3 = card('t3'), t4 = card('t4')
  const onT1 = useCallback(() => setHv('t1'), [])
  const onT2 = useCallback(() => setHv('t2'), [])
  const onT3 = useCallback(() => setHv('t3'), [])
  const onT4 = useCallback(() => setHv('t4'), [])
  const hoverOff = useCallback(() => setHv(''), [])

  const goPartner = useCallback(() => {
    data.current.kind = 'Партнёр'
    if (kindEl.current) kindEl.current.value = 'Партнёр'
    const target = document.getElementById('apply')
    if (!target) return
    const y = target.getBoundingClientRect().top + window.scrollY - 80
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
  }, [])

  const submit = async (e: any) => {
    e.preventDefault()
    const d = data.current
    const n: Record<string, string> = {}
    if (!d.name.trim()) n.name = t.k1
    if (!d.company.trim()) n.company = t.k2
    if (!d.role) n.role = t.k3
    if (!d.kind) n.kind = t.k128
    if (!EMAIL_RE.test(d.email.trim())) n.email = t.k4
    if (d.phone.replace(/\D/g, '').length < 8) n.phone = t.k5
    if (Object.keys(n).length) {
      setErr(n)
      document.getElementById('fa-' + Object.keys(n)[0])?.focus()
      return
    }
    try { await post('forum-applications', d) } catch { /* keep the UX, log server-side */ }
    setErr({})
    setSent(true)
  }

  const onName = field('name'), onCompany = field('company'), onRole = field('role')
  const onKind = field('kind'), onEmail = field('email'), onPhone = field('phone')
  const errName = err.name || '', errCompany = err.company || '', errRole = err.role || ''
  const errKind = err.kind || '', errEmail = err.email || '', errPhone = err.phone || ''
  const menuDisplay = menu ? ('var(--menuDisplay)' as any) : 'none'
  const notSent = !sent
  const countdownDisplay = countdownVisible === false ? 'none' : 'flex'
  const forumDateValue = forumDate || '2026-12-03T10:00:00'

  return (
    <>
          <div style={{ background: "#F7F6F3", color: "#16181D", overflowX: "hidden" } as CSSProperties}>
            {" "}
            <header data-header="" data-header-solid="" style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "60", background: "rgba(247,246,243,.94)", borderBottom: "1px solid #DCDAD4", transition: "background 300ms ease,border-color 300ms ease" } as CSSProperties}>
              {" "}
              <div data-header-inner="" style={{ maxWidth: "1720px", margin: "0 auto", padding: "20px clamp(20px,4.8vw,108px)", display: "flex", alignItems: "center", gap: "24px", transition: "padding 300ms ease" } as CSSProperties}>
                {" "}
                <a href={lp("/")} style={{ display: "flex", alignItems: "center", gap: "12px" } as CSSProperties}>
                  {" "}
                  <img src="/img/5dd2fe9c60.png" alt="" style={{ height: "30px", width: "auto", display: "block" } as CSSProperties} />
                  {" "}
                  <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "13px", letterSpacing: ".14em", textTransform: "uppercase", whiteSpace: "nowrap" } as CSSProperties}>
                    {t.k401}
                  </span>
                  {" "}
                </a>
                {" "}
                <nav aria-label={t.k6} style={{ marginLeft: "auto", minWidth: "0", display: ("var(--navDisplay)" as any), alignItems: "center", gap: "24px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
                  {" "}
                  <a className="fa-h6ae611c" href={lp("/")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                    {t.k35}
                  </a>
                  {" "}
                  <a className="fa-h6ae611c" href="#topics" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    {t.k129}
                  </a>
                  {" "}
                  <a className="fa-h6ae611c" href="#participation" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    {t.k11}
                  </a>
                  {" "}
                  <a className="fa-h6ae611c" href={lp("/award")} style={{ transition: "color 200ms ease", position: "relative" } as CSSProperties}>
                    {t.k10}
                    <span aria-hidden="true" style={{ position: "absolute", top: "-2px", right: "-9px", width: "5px", height: "5px", background: "#FF4002" } as CSSProperties}>
                    </span>
                  </a>
                  {" "}
                  <a className="fa-h6ae611c" href="#contacts" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    {t.k12}
                  </a>
                  {" "}
                </nav>
                {" "}
                <div style={{ display: ("var(--navDisplay)" as any), alignItems: "center", gap: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em" } as CSSProperties}>
                  {" "}
                  <a href={lhref("ro")} style={{ color: langColor("ro", "#16181D", "#6E7278") } as CSSProperties}>
                    {t.k402}
                  </a>
                  <span style={{ color: "#DCDAD4" } as CSSProperties}>
                    {t.k403}
                  </span>
                  <a href={lhref("ru")} style={{ color: langColor("ru", "#16181D", "#6E7278") } as CSSProperties}>
                    {t.k404}
                  </a>
                  <span style={{ color: "#DCDAD4" } as CSSProperties}>
                    {t.k403}
                  </span>
                  <a href={lhref("en")} style={{ color: langColor("en", "#16181D", "#6E7278") } as CSSProperties}>
                    {t.k405}
                  </a>
                  {" "}
                </div>
                {" "}
                <a className="fa-h5fa00f1" href="#apply" style={{ display: ("var(--navDisplay)" as any), flex: "0 0 auto", alignItems: "center", padding: "12px 22px", background: "#FF4002", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2", whiteSpace: "nowrap", border: "1px solid #FF4002", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                  {t.k130}
                </a>
                {" "}
                <button type="button" aria-label={t.k15} onClick={toggleMenu} style={{ display: ("var(--burgerDisplay)" as any), marginLeft: "auto", flexDirection: "column", justifyContent: "center", gap: "6px", width: "44px", height: "44px", padding: "0", background: "transparent", border: "0", cursor: "pointer" } as CSSProperties}>
                  {" "}
                  <span style={{ display: "block", width: "22px", height: "1px", background: "#16181D" } as CSSProperties}>
                  </span>
                  <span style={{ display: "block", width: "22px", height: "1px", background: "#16181D" } as CSSProperties}>
                  </span>
                  {" "}
                </button>
                {" "}
              </div>
              {" "}
              <div style={{ display: menuDisplay, background: "#F7F6F3", borderTop: "1px solid #DCDAD4", padding: "8px clamp(20px,4.8vw,108px) 32px" } as CSSProperties}>
                {" "}
                <nav aria-label={t.k16} style={{ display: "flex", flexDirection: "column", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "22px" } as CSSProperties}>
                  {" "}
                  <a href={lp("/")} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {t.k35}
                  </a>
                  {" "}
                  <a href="#topics" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {t.k129}
                  </a>
                  {" "}
                  <a href="#participation" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {t.k11}
                  </a>
                  {" "}
                  <a href={lp("/award")} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {t.k10}
                  </a>
                  {" "}
                  <a href="#contacts" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {t.k12}
                  </a>
                  {" "}
                </nav>
                {" "}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginTop: "24px" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", gap: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em" } as CSSProperties}>
                    <a href={lhref("ro")} style={{ color: langColor("ro", "#16181D", "#6E7278") } as CSSProperties}>
                      {t.k402}
                    </a>
                    <span style={{ color: "#DCDAD4" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("ru")} style={{ color: langColor("ru", "#16181D", "#6E7278") } as CSSProperties}>
                      {t.k404}
                    </a>
                    <span style={{ color: "#DCDAD4" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("en")} style={{ color: langColor("en", "#16181D", "#6E7278") } as CSSProperties}>
                      {t.k405}
                    </a>
                  </div>
                  {" "}
                  <a href="#apply" onClick={closeMenu} style={{ display: "inline-flex", alignItems: "center", padding: "12px 24px", background: "#FF4002", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2" } as CSSProperties}>
                    {t.k130}
                  </a>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "2px", overflow: "hidden" } as CSSProperties}>
                <div data-progress="" style={{ width: "100%", height: "2px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                </div>
              </div>
              {" "}
            </header>
            {" "}
            <main>
              {" "}
              <section id="top" style={{ position: "relative", overflow: "hidden", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(128px,17vh,188px) 0 clamp(24px,3vw,40px)", backgroundColor: "#FF4002", color: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", top: "-10%", left: "-10%", right: "-10%", bottom: "-10%", pointerEvents: "none", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.14) 0 1px,transparent 1px 96px)", animation: "faPan 22s linear infinite" } as CSSProperties}>
                </div>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "42%", transform: "translate(-50%,-50%)", pointerEvents: "none", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "min(44vw,600px)", lineHeight: ".8", letterSpacing: "-.06em", color: "rgba(255,255,255,.16)", animation: "faGhost 9s ease-in-out infinite" } as CSSProperties}>
                  {t.k467}
                </div>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", left: "62%", top: "40%", width: "min(72vw,860px)", height: "min(72vw,860px)", pointerEvents: "none", transform: "translate(-50%,-50%)", background: "radial-gradient(circle,rgba(255,255,255,.30) 0%,rgba(255,255,255,.10) 44%,rgba(255,255,255,0) 68%)", animation: "faBreathe 8s ease-in-out infinite" } as CSSProperties}>
                </div>
                {" "}
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)", width: "100%" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px 32px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,.4)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(10px,.9vw,12px)", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.92)" } as CSSProperties}>
                    {" "}
                    <span>
                      {t.k137}
                    </span>
                    <span>
                      {t.k138}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h1 style={{ margin: "clamp(22px,2.8vw,44px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", textTransform: "uppercase", lineHeight: ".84", letterSpacing: "-.045em" } as CSSProperties}>
                    {" "}
                    <span style={{ display: "block", overflow: "hidden", paddingBottom: ".03em" } as CSSProperties}>
                      <span style={{ display: "block", whiteSpace: "nowrap", fontSize: "clamp(24px,7vw,104px)" } as CSSProperties}>
                        {t.k401}
                      </span>
                    </span>
                    {" "}
                    <span style={{ display: "block", overflow: "hidden", paddingBottom: ".03em" } as CSSProperties}>
                      <span style={{ display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap", alignItems: "baseline", gap: "0 .1em", fontSize: "clamp(46px,14vw,206px)", letterSpacing: "-.055em" } as CSSProperties}>
                        {t.k440}
                        <span style={{ color: "#16181D" } as CSSProperties}>
                          {t.k467}
                        </span>
                      </span>
                    </span>
                    {" "}
                  </h1>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "28px 48px", marginTop: "clamp(24px,3vw,44px)" } as CSSProperties}>
                    {" "}
                    <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "clamp(18px,2vw,28px)" } as CSSProperties}>
                      {" "}
                      <p style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(20px,2.4vw,32px)", lineHeight: "1.12", letterSpacing: "-.025em", maxWidth: "22ch" } as CSSProperties}>
                        {t.k468}
                      </p>
                      {" "}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" } as CSSProperties}>
                        {" "}
                        <a className="fa-hc263921" href="#apply" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "19px 38px", background: "#F7F6F3", color: "#16181D", border: "1px solid #F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                          {t.k140}
                        </a>
                        {" "}
                        <button className="fa-h7189809" type="button" onClick={goPartner} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "19px 38px", background: "transparent", border: "1px solid rgba(255,255,255,.7)", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                          {t.k141}
                        </button>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "6px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(10px,.9vw,12px)", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(247,246,243,.92)" } as CSSProperties}>
                      {" "}
                      <span style={{ width: "8px", height: "8px", background: "#16181D", animation: "faPulse 2s ease-in-out infinite" } as CSSProperties}>
                      </span>
                      <span>
                        {t.k142}
                      </span>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div data-countdown="" data-target="2026-12-03T10:00:00" style={{ display: "flex", flexWrap: "wrap", marginTop: "clamp(28px,3.6vw,52px)", borderTop: "1px solid rgba(255,255,255,.45)", borderBottom: "1px solid rgba(255,255,255,.45)" } as CSSProperties}>
                    {" "}
                    <div className="fa-hbe9e358" style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", transition: "background 260ms ease" } as CSSProperties}>
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                        <span data-cd="d">
                          {t.k469}
                        </span>
                      </div>
                      <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                        {t.k143}
                      </div>
                    </div>
                    {" "}
                    <div className="fa-hbe9e358" style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid rgba(255,255,255,.45)", transition: "background 260ms ease" } as CSSProperties}>
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                        <span data-cd="h">
                          {t.k469}
                        </span>
                      </div>
                      <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                        {t.k144}
                      </div>
                    </div>
                    {" "}
                    <div className="fa-hbe9e358" style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid rgba(255,255,255,.45)", transition: "background 260ms ease" } as CSSProperties}>
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                        <span data-cd="m">
                          {t.k469}
                        </span>
                      </div>
                      <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                        {t.k145}
                      </div>
                    </div>
                    {" "}
                    <div className="fa-hbe9e358" style={{ flex: "1 1 0", minWidth: "96px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid rgba(255,255,255,.45)", transition: "background 260ms ease" } as CSSProperties}>
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,5.6vw,86px)", lineHeight: ".9", letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" } as CSSProperties}>
                        <span data-cd="s">
                          {t.k469}
                        </span>
                      </div>
                      <div style={{ marginTop: "clamp(8px,1vw,14px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                        {t.k146}
                      </div>
                    </div>
                    {" "}
                    <div style={{ flex: "1 1 200px", minWidth: "180px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "8px", padding: "clamp(16px,2vw,26px) clamp(12px,1.6vw,22px)", borderLeft: "1px solid rgba(255,255,255,.45)" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                        {t.k147}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(15px,1.4vw,20px)", letterSpacing: "-.01em" } as CSSProperties}>
                        {t.k148}
                      </span>
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "clamp(20px,2.4vw,32px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.82)" } as CSSProperties}>
                    <span style={{ display: "block", width: "1px", height: "34px", background: "#16181D", animation: "faScroll 2.6s ease-in-out infinite" } as CSSProperties}>
                    </span>
                    <span>
                      {t.k42}
                    </span>
                  </div>
                  {" "}
                </div>
                {" "}
              </section>
              {" "}
              <div style={{ overflow: "hidden", background: "#16181D", padding: "18px 0" } as CSSProperties}>
                {" "}
                <div data-marquee="" style={{ display: "flex", width: "max-content", animation: "faMarquee 60s linear infinite", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "13px", letterSpacing: ".1em", textTransform: "uppercase", color: "#F7F6F3" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", gap: "24px", paddingRight: "24px" } as CSSProperties}>
                    <span>
                      {t.k149}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k150}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k151}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k152}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k153}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k154}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k155}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k156}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                  </div>
                  {" "}
                  <div aria-hidden="true" style={{ display: "flex", gap: "24px", paddingRight: "24px" } as CSSProperties}>
                    <span>
                      {t.k149}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k150}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k151}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k152}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k153}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k154}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k155}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k156}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <section aria-hidden="true" style={{ overflow: "hidden", backgroundColor: "#F7F6F3", padding: "clamp(36px,5vw,80px) 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div data-scrolltext="" data-speed="-4" style={{ overflow: "hidden", willChange: "transform" } as CSSProperties}>
                  {" "}
                  <div data-marquee="" style={{ display: "flex", width: "max-content", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,8.4vw,128px)", lineHeight: ".96", letterSpacing: "-.05em", textTransform: "uppercase", animation: "faMarquee 72s linear infinite" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k157}
                      </span>
                      <span style={{ color: "#C9C6BE" } as CSSProperties}>
                        {t.k158}
                      </span>
                      <span style={{ color: "#FF4002" } as CSSProperties}>
                        {t.k159}
                      </span>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k160}
                      </span>
                      <span style={{ color: "#C9C6BE" } as CSSProperties}>
                        {t.k161}
                      </span>
                    </div>
                    {" "}
                    <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k157}
                      </span>
                      <span style={{ color: "#C9C6BE" } as CSSProperties}>
                        {t.k158}
                      </span>
                      <span style={{ color: "#FF4002" } as CSSProperties}>
                        {t.k159}
                      </span>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k160}
                      </span>
                      <span style={{ color: "#C9C6BE" } as CSSProperties}>
                        {t.k161}
                      </span>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div data-scrolltext="" data-speed="4" style={{ overflow: "hidden", willChange: "transform" } as CSSProperties}>
                  {" "}
                  <div data-marquee="" style={{ display: "flex", width: "max-content", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,8.4vw,128px)", lineHeight: ".96", letterSpacing: "-.05em", textTransform: "uppercase", animation: "faMarquee 88s linear infinite reverse" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k161}
                      </span>
                      <span style={{ color: "#C9C6BE" } as CSSProperties}>
                        {t.k160}
                      </span>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k159}
                      </span>
                      <span style={{ color: "#FF4002" } as CSSProperties}>
                        {t.k158}
                      </span>
                      <span style={{ color: "#C9C6BE" } as CSSProperties}>
                        {t.k157}
                      </span>
                    </div>
                    {" "}
                    <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k161}
                      </span>
                      <span style={{ color: "#C9C6BE" } as CSSProperties}>
                        {t.k160}
                      </span>
                      <span style={{ color: "#16181D" } as CSSProperties}>
                        {t.k159}
                      </span>
                      <span style={{ color: "#FF4002" } as CSSProperties}>
                        {t.k158}
                      </span>
                      <span style={{ color: "#C9C6BE" } as CSSProperties}>
                        {t.k157}
                      </span>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </section>
              {" "}
              <section style={{ position: "relative", overflow: "hidden", padding: "clamp(80px,10vw,160px) 0", backgroundColor: "#16181D", color: "#F7F6F3", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)", backgroundAttachment: "fixed" } as CSSProperties}>
                {" "}
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #3A3D44" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                        {t.k162}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                      {t.k163}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,64px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(40px,7.4vw,116px)", lineHeight: ".9", letterSpacing: "-.045em", textTransform: "uppercase", maxWidth: "13ch" } as CSSProperties}>
                    {t.k164}
                  </h2>
                  {" "}
                  <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(28px,3vw,44px) 0 0", fontSize: "clamp(18px,1.6vw,27px)", lineHeight: "1.45", letterSpacing: "-.01em", color: "#B9BBC0", maxWidth: "50ch" } as CSSProperties}>
                    {t.k165}
                  </p>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "12px 32px", marginTop: "clamp(44px,5.4vw,80px)", paddingBottom: "14px", borderBottom: "2px solid #FF4002", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase" } as CSSProperties}>
                    {" "}
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k166}
                    </span>
                    <span style={{ color: "#8E9198" } as CSSProperties}>
                      {t.k167}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(184px,1fr))", gap: "1px", marginTop: "1px", background: "#3A3D44", outline: "1px solid #3A3D44" } as CSSProperties}>
                    {" "}
                    <div className="fa-h58ee740" data-reveal="" data-delay="0" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px", minHeight: "clamp(188px,13.6vw,236px)", padding: "clamp(22px,2.2vw,30px)", background: "#16181D", transition: "background 280ms ease,color 280ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,3.4vw,54px)", lineHeight: "1", letterSpacing: "-.045em", opacity: ".34" } as CSSProperties}>
                        {t.k420}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,23px)", lineHeight: "1.18", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k168}
                        <span style={{ display: "block", marginTop: "10px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontWeight: "400", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k169}
                        </span>
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h58ee740" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px", minHeight: "clamp(188px,13.6vw,236px)", padding: "clamp(22px,2.2vw,30px)", background: "#16181D", transition: "background 280ms ease,color 280ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,3.4vw,54px)", lineHeight: "1", letterSpacing: "-.045em", opacity: ".34" } as CSSProperties}>
                        {t.k422}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,23px)", lineHeight: "1.18", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k170}
                        <span style={{ display: "block", marginTop: "10px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontWeight: "400", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k171}
                        </span>
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h58ee740" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px", minHeight: "clamp(188px,13.6vw,236px)", padding: "clamp(22px,2.2vw,30px)", background: "#16181D", transition: "background 280ms ease,color 280ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,3.4vw,54px)", lineHeight: "1", letterSpacing: "-.045em", opacity: ".34" } as CSSProperties}>
                        {t.k428}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,23px)", lineHeight: "1.18", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k157}
                        <span style={{ display: "block", marginTop: "10px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontWeight: "400", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k172}
                        </span>
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h58ee740" data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px", minHeight: "clamp(188px,13.6vw,236px)", padding: "clamp(22px,2.2vw,30px)", background: "#16181D", transition: "background 280ms ease,color 280ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,3.4vw,54px)", lineHeight: "1", letterSpacing: "-.045em", opacity: ".34" } as CSSProperties}>
                        {t.k429}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,23px)", lineHeight: "1.18", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k173}
                        <span style={{ display: "block", marginTop: "10px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontWeight: "400", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k174}
                        </span>
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h58ee740" data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px", minHeight: "clamp(188px,13.6vw,236px)", padding: "clamp(22px,2.2vw,30px)", background: "#16181D", transition: "background 280ms ease,color 280ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,3.4vw,54px)", lineHeight: "1", letterSpacing: "-.045em", opacity: ".34" } as CSSProperties}>
                        {t.k431}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,23px)", lineHeight: "1.18", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k175}
                        <span style={{ display: "block", marginTop: "10px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontWeight: "400", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k176}
                        </span>
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h58ee740" data-reveal="" data-delay="300" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px", minHeight: "clamp(188px,13.6vw,236px)", padding: "clamp(22px,2.2vw,30px)", background: "#16181D", transition: "background 280ms ease,color 280ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,3.4vw,54px)", lineHeight: "1", letterSpacing: "-.045em", opacity: ".34" } as CSSProperties}>
                        {t.k434}
                      </span>
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,23px)", lineHeight: "1.18", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k177}
                        <span style={{ display: "block", marginTop: "10px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontWeight: "400", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k178}
                        </span>
                      </span>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </section>
              {" "}
              <section id="audience" style={{ position: "relative", overflow: "hidden", padding: "clamp(80px,10vw,160px) 0", backgroundColor: "#EFEDE8" } as CSSProperties}>
                {" "}
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                        {t.k422}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k182}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "32px 56px", marginTop: "clamp(36px,4.4vw,64px)" } as CSSProperties}>
                    {" "}
                    <div data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "flex-end", gap: "clamp(20px,2.4vw,36px)" } as CSSProperties}>
                      {" "}
                      <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(84px,15vw,232px)", lineHeight: ".8", letterSpacing: "-.055em" } as CSSProperties}>
                        <span data-count="250" data-suffix="+">
                          {t.k442}
                        </span>
                      </span>
                      {" "}
                      <span style={{ paddingBottom: "clamp(10px,1.4vw,22px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(11px,1vw,13px)", lineHeight: "1.7", letterSpacing: ".12em", textTransform: "uppercase", color: "#5C5F66" } as CSSProperties}>
                        {t.k79}
                        <br />
                        {t.k150}
                      </span>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ marginTop: "clamp(48px,6vw,88px)", borderTop: "2px solid #16181D" } as CSSProperties}>
                    {" "}
                    <div className="fa-h21d64df" data-reveal="" data-delay="0" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", padding: "clamp(20px,2.2vw,32px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 240ms ease" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px" } as CSSProperties}>
                        <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#FF4002" } as CSSProperties}>
                          {t.k420}
                        </span>
                        <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,2vw,31px)", lineHeight: "1.14", letterSpacing: "-.022em" } as CSSProperties}>
                          {t.k184}
                        </span>
                        <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(28px,3.2vw,50px)", lineHeight: "1", letterSpacing: "-.035em", color: "#FF4002" } as CSSProperties}>
                          {t.k470}
                        </span>
                      </div>
                      {" "}
                      <div aria-hidden="true" style={{ position: "absolute", left: "0", bottom: "-1px", width: "30%", height: "2px", background: "#FF4002" } as CSSProperties}>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="fa-h21d64df" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", padding: "clamp(20px,2.2vw,32px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 240ms ease" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px" } as CSSProperties}>
                        <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                          {t.k422}
                        </span>
                        <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,2vw,31px)", lineHeight: "1.14", letterSpacing: "-.022em" } as CSSProperties}>
                          {t.k59}
                        </span>
                        <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(28px,3.2vw,50px)", lineHeight: "1", letterSpacing: "-.035em", color: "#16181D" } as CSSProperties}>
                          {t.k471}
                        </span>
                      </div>
                      {" "}
                      <div aria-hidden="true" style={{ position: "absolute", left: "0", bottom: "-1px", width: "25%", height: "2px", background: "#16181D" } as CSSProperties}>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="fa-h21d64df" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", padding: "clamp(20px,2.2vw,32px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 240ms ease" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px" } as CSSProperties}>
                        <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                          {t.k428}
                        </span>
                        <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,2vw,31px)", lineHeight: "1.14", letterSpacing: "-.022em" } as CSSProperties}>
                          {t.k57}
                        </span>
                        <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(28px,3.2vw,50px)", lineHeight: "1", letterSpacing: "-.035em", color: "#16181D" } as CSSProperties}>
                          {t.k472}
                        </span>
                      </div>
                      {" "}
                      <div aria-hidden="true" style={{ position: "absolute", left: "0", bottom: "-1px", width: "20%", height: "2px", background: "#16181D" } as CSSProperties}>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="fa-h21d64df" data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", padding: "clamp(20px,2.2vw,32px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 240ms ease" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px" } as CSSProperties}>
                        <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                          {t.k429}
                        </span>
                        <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,2vw,31px)", lineHeight: "1.14", letterSpacing: "-.022em" } as CSSProperties}>
                          {t.k53}
                        </span>
                        <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(28px,3.2vw,50px)", lineHeight: "1", letterSpacing: "-.035em", color: "#16181D" } as CSSProperties}>
                          {t.k473}
                        </span>
                      </div>
                      {" "}
                      <div aria-hidden="true" style={{ position: "absolute", left: "0", bottom: "-1px", width: "15%", height: "2px", background: "#16181D" } as CSSProperties}>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="fa-h21d64df" data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", padding: "clamp(20px,2.2vw,32px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 240ms ease" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 32px" } as CSSProperties}>
                        <span style={{ flex: "0 0 40px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                          {t.k431}
                        </span>
                        <span style={{ flex: "1 1 320px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,2vw,31px)", lineHeight: "1.14", letterSpacing: "-.022em" } as CSSProperties}>
                          {t.k185}
                        </span>
                        <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(28px,3.2vw,50px)", lineHeight: "1", letterSpacing: "-.035em", color: "#16181D" } as CSSProperties}>
                          {t.k474}
                        </span>
                      </div>
                      {" "}
                      <div aria-hidden="true" style={{ position: "absolute", left: "0", bottom: "-1px", width: "10%", height: "2px", background: "#16181D" } as CSSProperties}>
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </section>
              {" "}
              <section id="topics" style={{ padding: "clamp(64px,8vw,120px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                        {t.k428}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k194}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(34px,6.4vw,96px)", lineHeight: ".9", letterSpacing: "-.045em", textTransform: "uppercase", maxWidth: "24ch" } as CSSProperties}>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k195}
                    </span>
                    {" "}
                    {t.k196}
                  </h2>
                  {" "}
                  <div style={{ position: "relative", marginTop: "clamp(40px,5vw,64px)" } as CSSProperties}>
                    {" "}
                    <div data-strip="" style={{ display: "flex", gap: "1px", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none" } as CSSProperties}>
                      {" "}
                      <article className="fa-h69183df" data-reveal="" data-delay="0" style={{ opacity: "0", transform: "translateY(16px)", flex: "1 0 clamp(240px,21vw,330px)", scrollSnapAlign: "start", position: "relative", overflow: "hidden", outline: "1px solid #DCDAD4", display: "flex", flexDirection: "column", minHeight: "clamp(316px,25vw,372px)", padding: "30px 28px", background: "#F7F6F3", color: "#16181D", transition: "background 300ms ease,color 300ms ease,transform 300ms ease" } as CSSProperties}>
                        {" "}
                        <span aria-hidden="true" style={{ position: "absolute", right: "14px", top: "2px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(84px,7vw,118px)", lineHeight: "1", letterSpacing: "-.055em", color: "#EAE7E0", transition: "color 300ms ease" } as CSSProperties}>
                          {t.k420}
                        </span>
                        {" "}
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" } as CSSProperties}>
                          <span style={{ width: "8px", height: "8px", background: "#C9C6BE" } as CSSProperties}>
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k175}
                          </span>
                        </div>
                        {" "}
                        <h3 style={{ position: "relative", margin: "32px 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(20px,1.8vw,26px)", lineHeight: "1.16", letterSpacing: "-.02em", maxWidth: "20ch" } as CSSProperties}>
                          {t.k197}
                        </h3>
                        {" "}
                        <p style={{ position: "relative", marginTop: "auto", paddingTop: "26px", fontSize: "15px", lineHeight: "1.55", opacity: ".62" } as CSSProperties}>
                          {t.k198}
                        </p>
                        {" "}
                      </article>
                      {" "}
                      <article className="fa-h69183df" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", flex: "1 0 clamp(240px,21vw,330px)", scrollSnapAlign: "start", position: "relative", overflow: "hidden", outline: "1px solid #DCDAD4", display: "flex", flexDirection: "column", minHeight: "clamp(316px,25vw,372px)", padding: "30px 28px", background: "#F7F6F3", color: "#16181D", transition: "background 300ms ease,color 300ms ease,transform 300ms ease" } as CSSProperties}>
                        {" "}
                        <span aria-hidden="true" style={{ position: "absolute", right: "14px", top: "2px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(84px,7vw,118px)", lineHeight: "1", letterSpacing: "-.055em", color: "#EAE7E0", transition: "color 300ms ease" } as CSSProperties}>
                          {t.k422}
                        </span>
                        {" "}
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" } as CSSProperties}>
                          <span style={{ width: "8px", height: "8px", background: "#C9C6BE" } as CSSProperties}>
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k199}
                          </span>
                        </div>
                        {" "}
                        <h3 style={{ position: "relative", margin: "32px 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(20px,1.8vw,26px)", lineHeight: "1.16", letterSpacing: "-.02em", maxWidth: "20ch" } as CSSProperties}>
                          {t.k200}
                        </h3>
                        {" "}
                        <p style={{ position: "relative", marginTop: "auto", paddingTop: "26px", fontSize: "15px", lineHeight: "1.55", opacity: ".62" } as CSSProperties}>
                          {t.k201}
                        </p>
                        {" "}
                      </article>
                      {" "}
                      <article className="fa-h69183df" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", flex: "1 0 clamp(240px,21vw,330px)", scrollSnapAlign: "start", position: "relative", overflow: "hidden", outline: "1px solid #DCDAD4", display: "flex", flexDirection: "column", minHeight: "clamp(316px,25vw,372px)", padding: "30px 28px", background: "#F7F6F3", color: "#16181D", transition: "background 300ms ease,color 300ms ease,transform 300ms ease" } as CSSProperties}>
                        {" "}
                        <span aria-hidden="true" style={{ position: "absolute", right: "14px", top: "2px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(84px,7vw,118px)", lineHeight: "1", letterSpacing: "-.055em", color: "#EAE7E0", transition: "color 300ms ease" } as CSSProperties}>
                          {t.k428}
                        </span>
                        {" "}
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" } as CSSProperties}>
                          <span style={{ width: "8px", height: "8px", background: "#C9C6BE" } as CSSProperties}>
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k30}
                          </span>
                        </div>
                        {" "}
                        <h3 style={{ position: "relative", margin: "32px 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(20px,1.8vw,26px)", lineHeight: "1.16", letterSpacing: "-.02em", maxWidth: "20ch" } as CSSProperties}>
                          {t.k202}
                        </h3>
                        {" "}
                        <p style={{ position: "relative", marginTop: "auto", paddingTop: "26px", fontSize: "15px", lineHeight: "1.55", opacity: ".62" } as CSSProperties}>
                          {t.k203}
                        </p>
                        {" "}
                      </article>
                      {" "}
                      <article className="fa-h69183df" data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", flex: "1 0 clamp(240px,21vw,330px)", scrollSnapAlign: "start", position: "relative", overflow: "hidden", outline: "1px solid #DCDAD4", display: "flex", flexDirection: "column", minHeight: "clamp(316px,25vw,372px)", padding: "30px 28px", background: "#F7F6F3", color: "#16181D", transition: "background 300ms ease,color 300ms ease,transform 300ms ease" } as CSSProperties}>
                        {" "}
                        <span aria-hidden="true" style={{ position: "absolute", right: "14px", top: "2px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(84px,7vw,118px)", lineHeight: "1", letterSpacing: "-.055em", color: "#EAE7E0", transition: "color 300ms ease" } as CSSProperties}>
                          {t.k429}
                        </span>
                        {" "}
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" } as CSSProperties}>
                          <span style={{ width: "8px", height: "8px", background: "#C9C6BE" } as CSSProperties}>
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k204}
                          </span>
                        </div>
                        {" "}
                        <h3 style={{ position: "relative", margin: "32px 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(20px,1.8vw,26px)", lineHeight: "1.16", letterSpacing: "-.02em", maxWidth: "20ch" } as CSSProperties}>
                          {t.k205}
                        </h3>
                        {" "}
                        <p style={{ position: "relative", marginTop: "auto", paddingTop: "26px", fontSize: "15px", lineHeight: "1.55", opacity: ".62" } as CSSProperties}>
                          {t.k206}
                        </p>
                        {" "}
                      </article>
                      {" "}
                    </div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "24px" } as CSSProperties}>
                      {" "}
                      <div style={{ flex: "1 1 auto", height: "1px", background: "#DCDAD4", overflow: "hidden" } as CSSProperties}>
                        <div data-strip-progress="" style={{ height: "1px", background: "#FF4002", transform: "scaleX(.2)", transformOrigin: "left", transition: "transform 140ms linear" } as CSSProperties}>
                        </div>
                      </div>
                      {" "}
                      <span style={{ flex: "0 0 auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k475}
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
              <section id="program" style={{ padding: "clamp(56px,7vw,104px) 0 clamp(64px,8vw,120px)", backgroundColor: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                        {t.k429}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k207}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px 40px", marginTop: "clamp(32px,4vw,48px)" } as CSSProperties}>
                    {" "}
                    <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(34px,6.4vw,96px)", lineHeight: ".9", letterSpacing: "-.045em", textTransform: "uppercase", maxWidth: "18ch" } as CSSProperties}>
                      <span style={{ color: "#FF4002" } as CSSProperties}>
                        {t.k207}
                      </span>
                    </h2>
                    {" "}
                    <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", maxWidth: "40ch", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".1em", textTransform: "uppercase", color: "#5C5F66" } as CSSProperties}>
                      {t.k210}
                    </p>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--programCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,60px)", background: "#DCDAD4", outline: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <div className="fa-h55d5336" data-reveal="" data-delay="0" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexDirection: "column", gap: "12px", minHeight: "clamp(120px,9vw,150px)", padding: "clamp(16px,1.6vw,24px)", background: "#EFEDE8", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#FF4002" } as CSSProperties}>
                        {t.k420}
                      </span>
                      <span style={{ marginTop: "auto", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(14px,1.1vw,18px)", lineHeight: "1.22", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k211}
                      </span>
                      <span aria-hidden="true" style={{ position: "absolute", right: "clamp(10px,1vw,16px)", bottom: "clamp(14px,1.4vw,20px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "13px", color: "#FF4002" } as CSSProperties}>
                        {t.k416}
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h55d5336" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexDirection: "column", gap: "12px", minHeight: "clamp(120px,9vw,150px)", padding: "clamp(16px,1.6vw,24px)", background: "#EFEDE8", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#B4B0A6" } as CSSProperties}>
                        {t.k422}
                      </span>
                      <span style={{ marginTop: "auto", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(14px,1.1vw,18px)", lineHeight: "1.22", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k132}
                      </span>
                      <span aria-hidden="true" style={{ position: "absolute", right: "clamp(10px,1vw,16px)", bottom: "clamp(14px,1.4vw,20px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "13px", color: "#FF4002" } as CSSProperties}>
                        {t.k416}
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h55d5336" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexDirection: "column", gap: "12px", minHeight: "clamp(120px,9vw,150px)", padding: "clamp(16px,1.6vw,24px)", background: "#EFEDE8", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#B4B0A6" } as CSSProperties}>
                        {t.k428}
                      </span>
                      <span style={{ marginTop: "auto", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(14px,1.1vw,18px)", lineHeight: "1.22", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k133}
                      </span>
                      <span aria-hidden="true" style={{ position: "absolute", right: "clamp(10px,1vw,16px)", bottom: "clamp(14px,1.4vw,20px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "13px", color: "#FF4002" } as CSSProperties}>
                        {t.k416}
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h55d5336" data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexDirection: "column", gap: "12px", minHeight: "clamp(120px,9vw,150px)", padding: "clamp(16px,1.6vw,24px)", background: "#EFEDE8", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#B4B0A6" } as CSSProperties}>
                        {t.k429}
                      </span>
                      <span style={{ marginTop: "auto", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(14px,1.1vw,18px)", lineHeight: "1.22", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k213}
                      </span>
                      <span aria-hidden="true" style={{ position: "absolute", right: "clamp(10px,1vw,16px)", bottom: "clamp(14px,1.4vw,20px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "13px", color: "#FF4002" } as CSSProperties}>
                        {t.k416}
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h55d5336" data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexDirection: "column", gap: "12px", minHeight: "clamp(120px,9vw,150px)", padding: "clamp(16px,1.6vw,24px)", background: "#EFEDE8", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#B4B0A6" } as CSSProperties}>
                        {t.k431}
                      </span>
                      <span style={{ marginTop: "auto", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(14px,1.1vw,18px)", lineHeight: "1.22", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k135}
                      </span>
                      <span aria-hidden="true" style={{ position: "absolute", right: "clamp(10px,1vw,16px)", bottom: "clamp(14px,1.4vw,20px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "13px", color: "#FF4002" } as CSSProperties}>
                        {t.k416}
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h55d5336" data-reveal="" data-delay="300" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexDirection: "column", gap: "12px", minHeight: "clamp(120px,9vw,150px)", padding: "clamp(16px,1.6vw,24px)", background: "#EFEDE8", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#B4B0A6" } as CSSProperties}>
                        {t.k434}
                      </span>
                      <span style={{ marginTop: "auto", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(14px,1.1vw,18px)", lineHeight: "1.22", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k215}
                      </span>
                      <span aria-hidden="true" style={{ position: "absolute", right: "clamp(10px,1vw,16px)", bottom: "clamp(14px,1.4vw,20px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "13px", color: "#FF4002" } as CSSProperties}>
                        {t.k416}
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h55d5336" data-reveal="" data-delay="360" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexDirection: "column", gap: "12px", minHeight: "clamp(120px,9vw,150px)", padding: "clamp(16px,1.6vw,24px)", background: "#EFEDE8", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#FF4002" } as CSSProperties}>
                        {t.k436}
                      </span>
                      <span style={{ marginTop: "auto", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(14px,1.1vw,18px)", lineHeight: "1.22", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k136}
                      </span>
                      <span aria-hidden="true" style={{ position: "absolute", right: "clamp(10px,1vw,16px)", bottom: "clamp(14px,1.4vw,20px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "13px", color: "#FF4002" } as CSSProperties}>
                        {t.k416}
                      </span>
                    </div>
                    {" "}
                    <div className="fa-h55d5336" data-reveal="" data-delay="420" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexDirection: "column", gap: "12px", minHeight: "clamp(120px,9vw,150px)", padding: "clamp(16px,1.6vw,24px)", background: "#EFEDE8", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#FF4002" } as CSSProperties}>
                        {t.k438}
                      </span>
                      <span style={{ marginTop: "auto", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(14px,1.1vw,18px)", lineHeight: "1.22", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k216}
                      </span>
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "28px 56px", marginTop: "clamp(48px,6vw,80px)", padding: "clamp(28px,3.4vw,56px)", background: "#16181D", color: "#F7F6F3" } as CSSProperties}>
                    {" "}
                    <div style={{ flex: "1 1 460px" } as CSSProperties}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                        <span style={{ width: "32px", height: "1px", background: "#FF4002" } as CSSProperties}>
                        </span>
                        <span>
                          {t.k217}
                        </span>
                      </div>
                      <p style={{ margin: "20px 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(20px,2.2vw,32px)", lineHeight: "1.14", letterSpacing: "-.025em", maxWidth: "30ch" } as CSSProperties}>
                        {t.k218}
                      </p>
                    </div>
                    {" "}
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".12em", textTransform: "uppercase", color: "#8E9198", maxWidth: "24ch" } as CSSProperties}>
                      {t.k219}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </section>
              {" "}
              <section id="award" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,144px) 0", backgroundColor: "#FF4002", color: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "12px 32px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,.45)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase" } as CSSProperties}>
                    <span>
                      {t.k220}
                    </span>
                  </div>
                  {" "}
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(28px,3.4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(40px,8.4vw,140px)", lineHeight: ".88", letterSpacing: "-.05em", textTransform: "uppercase", maxWidth: "12ch" } as CSSProperties}>
                    {t.k10}
                    {" "}
                    <span style={{ color: "#16181D" } as CSSProperties}>
                      {t.k221}
                    </span>
                  </h2>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(24px,3vw,56px)", marginTop: "clamp(32px,4vw,56px)" } as CSSProperties}>
                    {" "}
                    <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", fontSize: "clamp(16px,1.3vw,20px)", lineHeight: "1.55", maxWidth: "42ch" } as CSSProperties}>
                      {t.k222}
                    </p>
                    {" "}
                    <p data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", fontSize: "clamp(16px,1.3vw,20px)", lineHeight: "1.55", maxWidth: "42ch" } as CSSProperties}>
                      {t.k223}
                    </p>
                    {" "}
                    <div data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "18px" } as CSSProperties}>
                      {" "}
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".1em", textTransform: "uppercase", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,.45)" } as CSSProperties}>
                        {t.k224}
                      </span>
                      {" "}
                      <a className="fa-h55d5336" href={lp("/award")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: "20px", padding: "18px 24px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                        {t.k225}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                          {t.k416}
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
              <section id="participation" style={{ padding: "clamp(64px,8vw,120px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                        {t.k431}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k11}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div data-reveal="" data-delay="40" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(32px,4vw,48px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".16em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                    {t.k97}
                  </div>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px 40px", marginTop: "clamp(20px,2.4vw,32px)" } as CSSProperties}>
                    {" "}
                    <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(40px,8vw,124px)", lineHeight: ".88", letterSpacing: "-.05em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
                      {t.k227}
                      {" "}
                      <span style={{ color: "#FF4002" } as CSSProperties}>
                        {t.k228}
                      </span>
                    </h2>
                    {" "}
                    <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", maxWidth: "52ch", fontSize: "clamp(16px,1.3vw,20px)", lineHeight: "1.5", color: "#5C5F66" } as CSSProperties}>
                      {t.k229}
                    </p>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--twoCols,1fr 1fr)" as any), gap: "1px", marginTop: "clamp(32px,4vw,48px)", background: "#DCDAD4", outline: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <div data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", padding: "clamp(28px,3vw,44px)", background: "#16181D", color: "#F7F6F3" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" } as CSSProperties}>
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                          {t.k230}
                        </span>
                        <span style={{ width: "8px", height: "8px", background: "#FF4002" } as CSSProperties}>
                        </span>
                      </div>
                      {" "}
                      <h3 style={{ margin: "clamp(20px,2.4vw,32px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,3.6vw,52px)", lineHeight: "1", letterSpacing: "-.04em", textTransform: "uppercase" } as CSSProperties}>
                        {t.k231}
                      </h3>
                      {" "}
                      <ul style={{ listStyle: "none", margin: "clamp(24px,3vw,36px) 0 0", padding: "0", display: "flex", flexDirection: "column", fontSize: "16px", lineHeight: "1.5", color: "#B9BBC0" } as CSSProperties}>
                        {" "}
                        <li className="fa-h10f47c2" style={{ display: "flex", gap: "16px", padding: "14px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                            {t.k420}
                          </span>
                          <span>
                            {t.k232}
                          </span>
                        </li>
                        {" "}
                        <li className="fa-h10f47c2" style={{ display: "flex", gap: "16px", padding: "14px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                            {t.k422}
                          </span>
                          <span>
                            {t.k233}
                          </span>
                        </li>
                        {" "}
                        <li className="fa-h10f47c2" style={{ display: "flex", gap: "16px", padding: "14px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                            {t.k428}
                          </span>
                          <span>
                            {t.k234}
                          </span>
                        </li>
                        {" "}
                        <li className="fa-h10f47c2" style={{ display: "flex", gap: "16px", padding: "14px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                            {t.k429}
                          </span>
                          <span>
                            {t.k235}
                          </span>
                        </li>
                        {" "}
                      </ul>
                      {" "}
                      <a className="fa-h011a976" href="#apply" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "clamp(28px,3vw,40px)", padding: "18px 36px", background: "#FF4002", color: "#F7F6F3", border: "1px solid #FF4002", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                        {t.k140}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                          {t.k416}
                        </span>
                      </a>
                      {" "}
                    </div>
                    {" "}
                    <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", padding: "clamp(28px,3vw,44px)", background: "#F7F6F3", color: "#16181D" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" } as CSSProperties}>
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                          {t.k236}
                        </span>
                        <span style={{ width: "8px", height: "8px", border: "1px solid #16181D" } as CSSProperties}>
                        </span>
                      </div>
                      {" "}
                      <h3 style={{ margin: "clamp(20px,2.4vw,32px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,3.6vw,52px)", lineHeight: "1", letterSpacing: "-.04em", textTransform: "uppercase" } as CSSProperties}>
                        {t.k237}
                      </h3>
                      {" "}
                      <p style={{ margin: "clamp(24px,3vw,36px) 0 0", fontSize: "clamp(16px,1.2vw,19px)", lineHeight: "1.6", color: "#5C5F66", maxWidth: "42ch" } as CSSProperties}>
                        {t.k238}
                      </p>
                      {" "}
                      <div style={{ marginTop: "24px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".1em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
                        {t.k314}
                      </div>
                      {" "}
                      <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", lineHeight: "1.7", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k239}
                      </div>
                      {" "}
                      <button className="fa-h6d4f325" type="button" onClick={goPartner} style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "auto", padding: "18px 36px", border: "1px solid #16181D", background: "transparent", color: "#16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                        {t.k240}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                          {t.k416}
                        </span>
                      </button>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "28px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    {t.k241}
                  </div>
                  {" "}
                  <div data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "28px 48px", marginTop: "clamp(48px,6vw,88px)", padding: "clamp(28px,3.4vw,56px)", background: "#16181D", color: "#F7F6F3" } as CSSProperties}>
                    {" "}
                    <h3 style={{ margin: "0", flex: "1 1 420px", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.4vw,36px)", lineHeight: "1.1", letterSpacing: "-.025em", maxWidth: "26ch" } as CSSProperties}>
                      {t.k242}
                    </h3>
                    {" "}
                    <a className="fa-h55d5336" href={lp("/")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "19px 38px", border: "1px solid #F7F6F3", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                      {t.k243}
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                        {t.k416}
                      </span>
                    </a>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </section>
              {" "}
              <section id="apply" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,140px) 0 clamp(64px,8vw,120px)", backgroundColor: "#16181D", color: "#F7F6F3", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)" } as CSSProperties}>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", pointerEvents: "none", overflow: "hidden", lineHeight: "0" } as CSSProperties}>
                  <svg viewBox="0 0 1000 150" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "auto" } as CSSProperties}>
                    <text x="0" y="122" textLength="1000" lengthAdjust="spacingAndGlyphs" style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "150px", textTransform: "uppercase", fill: "rgba(255,64,2,.20)" } as CSSProperties}>
                      {t.k476}
                    </text>
                  </svg>
                </div>
                {" "}
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #3A3D44" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                        {t.k434}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                      {t.k130}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(32px,4vw,48px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(34px,5.6vw,84px)", lineHeight: ".92", letterSpacing: "-.045em", textTransform: "uppercase", maxWidth: "20ch" } as CSSProperties}>
                    {t.k245}
                    {" "}
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k246}
                    </span>
                  </h2>
                  {" "}
                  <div data-reveal="" data-delay="100" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 20px", marginTop: "24px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                    <span style={{ width: "8px", height: "8px", background: "#FF4002", animation: "faPulse 2s ease-in-out infinite" } as CSSProperties}>
                    </span>
                    <span>
                      {t.k247}
                    </span>
                  </div>
                  {" "}
                  <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", margin: "16px 0 0", fontSize: "16px", lineHeight: "1.6", color: "#B9BBC0", maxWidth: "65ch" } as CSSProperties}>
                    {t.k248}
                  </p>
                  {" "}
                  {notSent ? (
                  <>
                    {" "}
                    <form onSubmit={submit} noValidate data-reveal="" data-delay="160" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(36px,4.4vw,56px)", maxWidth: "960px", background: "#F7F6F3", color: "#16181D", padding: "clamp(26px,3.2vw,52px)", boxShadow: "14px 14px 0 #FF4002" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "8px 48px" } as CSSProperties}>
                        {" "}
                        <div>
                          <label htmlFor="fa-name" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k112}
                          </label>
                          <input className="fa-hd277039" id="fa-name" name="name" type="text" autoComplete="name" onInput={onName} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                            {errName}
                          </div>
                        </div>
                        {" "}
                        <div>
                          <label htmlFor="fa-company" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k113}
                          </label>
                          <input className="fa-hd277039" id="fa-company" name="company" type="text" autoComplete="organization" onInput={onCompany} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                            {errCompany}
                          </div>
                        </div>
                        {" "}
                        <div>
                          <label htmlFor="fa-role" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k7}
                          </label>
                          {" "}
                          <select className="fa-hd277039" id="fa-role" name="role" onChange={onRole} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "#F7F6F3", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", appearance: "none", borderRadius: "0", transition: "border-color 200ms ease" } as CSSProperties}>
                            {" "}
                            <option value="">
                              {t.k115}
                            </option>
                            {" "}
                            <option value="Архитектор или дизайнер">
                              {t.k116}
                            </option>
                            {" "}
                            <option value="Девелопер или застройщик">
                              {t.k117}
                            </option>
                            {" "}
                            <option value="Производитель или поставщик">
                              {t.k118}
                            </option>
                            {" "}
                            <option value="Инвестор или бизнес">
                              {t.k119}
                            </option>
                            {" "}
                          </select>
                          {" "}
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                            {errRole}
                          </div>
                          {" "}
                        </div>
                        {" "}
                        <div>
                          <label htmlFor="fa-kind" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k128}
                          </label>
                          {" "}
                          <select className="fa-hd277039" id="fa-kind" name="kind" onChange={onKind} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "#F7F6F3", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", appearance: "none", borderRadius: "0", transition: "border-color 200ms ease" } as CSSProperties}>
                            {" "}
                            <option value="">
                              {t.k115}
                            </option>
                            {" "}
                            <option value="Участник">
                              {t.k231}
                            </option>
                            {" "}
                            <option value="Партнёр">
                              {t.k237}
                            </option>
                            {" "}
                          </select>
                          {" "}
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                            {errKind}
                          </div>
                          {" "}
                        </div>
                        {" "}
                        <div>
                          <label htmlFor="fa-email" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k455}
                          </label>
                          <input className="fa-hd277039" id="fa-email" name="email" type="email" autoComplete="email" onInput={onEmail} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                            {errEmail}
                          </div>
                        </div>
                        {" "}
                        <div>
                          <label htmlFor="fa-phone" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                            {t.k120}
                          </label>
                          <input className="fa-hd277039" id="fa-phone" name="phone" type="tel" autoComplete="tel" onInput={onPhone} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                            {errPhone}
                          </div>
                        </div>
                        {" "}
                      </div>
                      {" "}
                      <button className="fa-h5fa00f1" type="submit" style={{ marginTop: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "18px 36px", background: "#FF4002", color: "#F7F6F3", border: "1px solid #FF4002", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                        {t.k121}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                          {t.k416}
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
                    <div style={{ marginTop: "clamp(36px,4.4vw,56px)", padding: "clamp(26px,3.2vw,48px)", background: "#F7F6F3", color: "#16181D", maxWidth: "65ch", boxShadow: "14px 14px 0 #FF4002" } as CSSProperties}>
                      {" "}
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,1.9vw,24px)" } as CSSProperties}>
                        {t.k122}
                      </div>
                      {" "}
                      <p style={{ margin: "16px 0 0", fontSize: "16px", lineHeight: "1.6", color: "#5C5F66" } as CSSProperties}>
                        {t.k250}
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
            </main>
            {" "}
            <footer id="contacts" style={{ position: "relative", overflow: "hidden", backgroundColor: "#16181D", color: "#F7F6F3", padding: "clamp(40px,5vw,64px) 0 40px", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)", backgroundAttachment: "fixed" } as CSSProperties}>
              {" "}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10%", top: "-30%", width: "min(64vw,720px)", height: "min(64vw,720px)", pointerEvents: "none", borderRadius: "50%", background: "radial-gradient(circle,rgba(255,64,2,.28),rgba(255,64,2,0) 68%)" } as CSSProperties}>
              </div>
              {" "}
              <div aria-hidden="true" style={{ position: "relative", overflow: "hidden", paddingBottom: "clamp(28px,3.4vw,48px)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)" } as CSSProperties}>
                {" "}
                <div data-marquee="" style={{ display: "flex", width: "max-content", animation: "faMarquee 54s linear infinite", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(52px,10vw,150px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase", color: "rgba(247,246,243,.17)" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                    <span>
                      {t.k401}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k9}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                  </div>
                  {" "}
                  <div style={{ display: "flex", gap: ".3em", paddingRight: ".3em" } as CSSProperties}>
                    <span>
                      {t.k401}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k9}
                    </span>
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k417}
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
                    <img src="/img/0ce5b0d8a0.png" alt={t.k401} style={{ height: "104px", width: "auto", display: "block" } as CSSProperties} />
                    {" "}
                    <p style={{ margin: "24px 0 0", fontSize: "15px", lineHeight: "1.6", color: "#8E9198", maxWidth: "32ch" } as CSSProperties}>
                      {t.k251}
                    </p>
                    {" "}
                  </div>
                  {" "}
                  <nav aria-label={t.k125} style={{ flex: "0 1 176px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#B9BBC0" } as CSSProperties}>
                    {" "}
                    <a className="fa-hc3889f8" href={lp("/")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k35}
                    </a>
                    {" "}
                    <a className="fa-hc3889f8" href="#topics" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k194}
                    </a>
                    {" "}
                    <a className="fa-hc3889f8" href="#participation" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k11}
                    </a>
                    {" "}
                    <a className="fa-hc3889f8" href={lp("/award")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k10}
                    </a>
                    {" "}
                    <a className="fa-hc3889f8" href="#apply" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k130}
                    </a>
                    {" "}
                  </nav>
                  {" "}
                  <div style={{ flex: "0 1 280px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#B9BBC0" } as CSSProperties}>
                    {" "}
                    <a className="fa-hc3889f8" href="mailto:marketing@lh47arch.com" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k457}
                    </a>
                    {" "}
                    <a className="fa-hc3889f8" href="mailto:marketing@instylehome.md" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k458}
                    </a>
                    {" "}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" } as CSSProperties}>
                      <a className="fa-hc3889f8" href="tel:+37368199951" style={{ transition: "color 200ms ease" } as CSSProperties}>
                        {t.k459}
                      </a>
                      <span style={{ color: "#8E9198" } as CSSProperties}>
                        {t.k460}
                      </span>
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" } as CSSProperties}>
                      <a className="fa-hc3889f8" href="tel:+37368059311" style={{ transition: "color 200ms ease" } as CSSProperties}>
                        {t.k461}
                      </a>
                      <span style={{ color: "#8E9198" } as CSSProperties}>
                        {t.k462}
                      </span>
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div className="fa-social" style={{ flex: "0 1 160px", color: "#B9BBC0" } as CSSProperties}>
                    {" "}
                    <a href="#" aria-label={t.k463}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
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
                    {" "}
                    <a href="#" aria-label={t.k464}>
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.3-.13-2.47-.13-2.44 0-4.11 1.49-4.11 4.23V9.9H7.4V13h2.72v8h3.38z">
                        </path>
                      </svg>
                      <span className="fa-sr">
                        {t.k464}
                      </span>
                    </a>
                    {" "}
                    <a href="#" aria-label={t.k465}>
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M6.94 8.6H3.9V21h3.04V8.6zM5.42 3A1.8 1.8 0 105.4 6.6 1.8 1.8 0 005.42 3zM21 14.2c0-3.4-1.82-4.98-4.24-4.98-1.96 0-2.83 1.08-3.32 1.84V8.6H10.4c.04.86 0 12.4 0 12.4h3.04v-6.92c0-.33.02-.66.12-.9.27-.66.87-1.34 1.9-1.34 1.33 0 1.87 1.02 1.87 2.5V21H21v-6.8z">
                        </path>
                      </svg>
                      <span className="fa-sr">
                        {t.k465}
                      </span>
                    </a>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 32px", marginTop: "clamp(40px,5vw,64px)", paddingTop: "24px", borderTop: "1px solid #3A3D44" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                    {t.k126}
                  </span>
                  {" "}
                  <img src="/img/d65b278e9b.png" alt={t.k444} style={{ height: "24px", width: "auto", display: "block", filter: "brightness(0) invert(.62)", opacity: ".9" } as CSSProperties} />
                  {" "}
                  <img src="/img/d7f7cfad4d.png" alt={t.k450} style={{ height: "18px", width: "auto", display: "block", filter: "brightness(0) invert(.62)", opacity: ".9" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px 32px", marginTop: "32px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", gap: "8px" } as CSSProperties}>
                    <a href={lhref("ro")} style={{ color: langColor("ro", "#F7F6F3", "inherit") } as CSSProperties}>
                      {t.k402}
                    </a>
                    <span style={{ color: "#3A3D44" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("ru")} style={{ color: langColor("ru", "#F7F6F3", "inherit") } as CSSProperties}>
                      {t.k404}
                    </a>
                    <span style={{ color: "#3A3D44" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("en")} style={{ color: langColor("en", "#F7F6F3", "inherit") } as CSSProperties}>
                      {t.k405}
                    </a>
                  </div>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" } as CSSProperties}>
                    <span>
                      {t.k466}
                    </span>
                    <a className="fa-h9b28a07" href={lp("/privacy")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k127}
                    </a>
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </footer>
            {" "}
          </div>
    </>
  )
}
