'use client'

/* Community — ported from the original dc bundle.
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
  t: Dict; lang: Lang; indexVisible?: boolean; bandMotion?: boolean }

export default function CommunityPage({
  t, lang, indexVisible = true, bandMotion = true }: Props) {

  // "/forum" stays "/forum" in Russian and becomes "/ro/forum" elsewhere
  const lp = (p: string) => langPath(lang, p)
  const lhref = (c: Lang) => langPath(c, "/")

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
  const data = useRef({ name: '', company: '', role: '', email: '', phone: '' })

  useEffect(() => {
    const FA = (window as any).FA
    if (FA) { FA.scan(); FA.refresh() }
  })

  const field = (k: string) => (e: any) => {
    ;(data.current as any)[k] = e.target.value
    setErr((prev) => { if (!prev[k]) return prev; const n = { ...prev }; delete n[k]; return n })
  }

  const submit = async (e: any) => {
    e.preventDefault()
    const d = data.current
    const n: Record<string, string> = {}
    if (!d.name.trim()) n.name = t.k1
    if (!d.company.trim()) n.company = t.k2
    if (!d.role.trim()) n.role = t.k3
    if (!EMAIL_RE.test(d.email.trim())) n.email = t.k4
    if (d.phone.replace(/\D/g, '').length < 8) n.phone = t.k5
    if (Object.keys(n).length) {
      setErr(n)
      document.getElementById('fa-' + Object.keys(n)[0])?.focus()
      return
    }
    try { await post('community-applications', d) } catch { /* noop */ }
    setErr({})
    setSent(true)
  }

  const onName = field('name'), onCompany = field('company'), onRole = field('role')
  const onEmail = field('email'), onPhone = field('phone')
  const errName = err.name || '', errCompany = err.company || '', errRole = err.role || ''
  const errEmail = err.email || '', errPhone = err.phone || ''
  const notSent = !sent
  const indexDisplay = indexVisible === false ? 'none' : 'block'
  const bandPlay = bandMotion === false ? 'paused' : 'running'

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
            <a href="#top" style={{ display: "flex", alignItems: "center", gap: "12px" } as CSSProperties}>
              {" "}
              <img src="/img/5dd2fe9c60.png" alt="" style={{ height: "30px", width: "auto", display: "block" } as CSSProperties} />
              {" "}
              <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "13px", letterSpacing: ".14em", textTransform: "uppercase", whiteSpace: "nowrap" } as CSSProperties}>
                Future Architecture
              </span>
              {" "}
            </a>
            {" "}
            <nav aria-label={t.k6} style={{ marginLeft: "auto", minWidth: "0", display: ("var(--navDisplay)" as any), alignItems: "center", gap: "26px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
              {" "}
              <a className="fa-hb09baf5" href="#manifest" style={{ transition: "color 200ms ease" } as CSSProperties}>
                {t.k7}
              </a>
              {" "}
              <a className="fa-hb09baf5" href="#formats" style={{ transition: "color 200ms ease" } as CSSProperties}>
                {t.k8}
              </a>
              {" "}
              <a className="fa-hb09baf5 fa-nav-hot" href={lp("/forum")} data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                {t.k9}
              </a>
              {" "}
              <a className="fa-hb09baf5 fa-nav-dot" href={lp("/award")} data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                {t.k10}
              </a>
              {" "}
              <a className="fa-hb09baf5" href="#join" style={{ transition: "color 200ms ease" } as CSSProperties}>
                {t.k11}
              </a>
              {" "}
              <a className="fa-hb09baf5" href="#contacts" style={{ transition: "color 200ms ease" } as CSSProperties}>
                {t.k12}
              </a>
              {" "}
            </nav>
            {" "}
            <div style={{ display: ("var(--navDisplay)" as any), alignItems: "center", gap: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em" } as CSSProperties}>
              {" "}
              <a href={lhref('ro')} hrefLang="ro" aria-current={lang === 'ro' ? 'true' : undefined} style={{ color: lang === 'ro' ? "#16181D" : "#6E7278" } as CSSProperties}>
                RO
              </a>
              {" "}
              <span style={{ color: "#DCDAD4" } as CSSProperties}>
                /
              </span>
              {" "}
              <a href={lhref('ru')} hrefLang="ru" aria-current={lang === 'ru' ? 'true' : undefined} style={{ color: lang === 'ru' ? "#16181D" : "#6E7278" } as CSSProperties}>
                RU
              </a>
              {" "}
              <span style={{ color: "#DCDAD4" } as CSSProperties}>
                /
              </span>
              {" "}
              <a href={lhref('en')} hrefLang="en" aria-current={lang === 'en' ? 'true' : undefined} style={{ color: lang === 'en' ? "#16181D" : "#6E7278" } as CSSProperties}>
                EN
              </a>
              {" "}
            </div>
            {" "}
            <a className="fa-h3635ec6" href="#apply" style={{ display: ("var(--navDisplay)" as any), flex: "0 0 auto", alignItems: "center", padding: "12px 22px", background: "#16181D", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2", whiteSpace: "nowrap", border: "1px solid #16181D", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
              {t.k14}
            </a>
            {" "}
            <button type="button" aria-label={t.k15} onClick={toggleMenu} style={{ display: ("var(--burgerDisplay)" as any), marginLeft: "auto", flexDirection: "column", justifyContent: "center", gap: "6px", width: "44px", height: "44px", padding: "0", background: "transparent", border: "0", cursor: "pointer" } as CSSProperties}>
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
            <nav aria-label={t.k16} style={{ display: "flex", flexDirection: "column", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "22px" } as CSSProperties}>
              {" "}
              <a href="#manifest" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {t.k7}
              </a>
              {" "}
              <a href="#formats" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {t.k8}
              </a>
              {" "}
              <a className="fa-nav-hot" href={lp("/forum")} data-page="" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {t.k9}
              </a>
              {" "}
              <a className="fa-nav-dot" href={lp("/award")} data-page="" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {t.k10}
              </a>
              {" "}
              <a href="#join" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {t.k11}
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
                {" "}
                <a href={lhref('ro')} hrefLang="ro" aria-current={lang === 'ro' ? 'true' : undefined} style={{ color: lang === 'ro' ? "#16181D" : "#6E7278" } as CSSProperties}>
                  RO
                </a>
                <span style={{ color: "#DCDAD4" } as CSSProperties}>
                  /
                </span>
                <a href={lhref('ru')} hrefLang="ru" aria-current={lang === 'ru' ? 'true' : undefined} style={{ color: lang === 'ru' ? "#16181D" : "#6E7278" } as CSSProperties}>
                  RU
                </a>
                <span style={{ color: "#DCDAD4" } as CSSProperties}>
                  /
                </span>
                <a href={lhref('en')} hrefLang="en" aria-current={lang === 'en' ? 'true' : undefined} style={{ color: lang === 'en' ? "#16181D" : "#6E7278" } as CSSProperties}>
                  EN
                </a>
                {" "}
              </div>
              {" "}
              <a href="#apply" onClick={closeMenu} style={{ display: "inline-flex", alignItems: "center", padding: "12px 24px", background: "#16181D", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2" } as CSSProperties}>
                {t.k14}
              </a>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "2px", overflow: "hidden" } as CSSProperties}>
            {" "}
            <div data-progress="" style={{ width: "100%", height: "2px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
            {" "}
          </div>
          {" "}
        </header>
        {" "}
        <nav data-rail="" aria-label={t.k17} style={{ position: "fixed", left: "26px", top: "50%", transform: "translateY(-50%)", zIndex: "40", display: ("var(--railDisplay)" as any), flexDirection: "column", gap: "13px", opacity: "0", transition: "opacity 300ms ease", pointerEvents: "none", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase" } as CSSProperties}>
          {" "}
          <a href="#manifest" data-rail-item="" data-target="manifest" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            {t.k7}
          </a>
          {" "}
          <a href="#members" data-rail-item="" data-target="members" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            {t.k18}
          </a>
          {" "}
          <a href="#formats" data-rail-item="" data-target="formats" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            {t.k8}
          </a>
          {" "}
          <a href="#forum" data-rail-item="" data-target="forum" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            {t.k9}
          </a>
          {" "}
          <a href="#base" data-rail-item="" data-target="base" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            {t.k19}
          </a>
          {" "}
          <a href="#join" data-rail-item="" data-target="join" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            {t.k11}
          </a>
          {" "}
          <a href="#apply" data-rail-item="" data-target="apply" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            {t.k20}
          </a>
          {" "}
        </nav>
        {" "}
        <main>
          {" "}
          <section id="top" data-screen-label="Хиро" style={{ position: "relative", overflow: "hidden", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(132px,18vh,196px) 0 clamp(24px,3vw,44px)", backgroundColor: "#16181D", color: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div aria-hidden="true" data-anim="" style={{ position: "absolute", top: "-10%", left: "-10%", right: "-10%", bottom: "-10%", pointerEvents: "none", backgroundImage: "repeating-linear-gradient(90deg,rgba(247,246,243,.10) 0 1px,transparent 1px 96px)", animation: "faPan 26s linear infinite" } as CSSProperties} />
            {" "}
            <div aria-hidden="true" data-anim="" style={{ position: "absolute", inset: "-64px", pointerEvents: "none", backgroundImage: "radial-gradient(rgba(247,246,243,.06) 1px,transparent 1px)", backgroundSize: "80px 80px", animation: "faDrift 13s linear infinite" } as CSSProperties} />
            {" "}
            <div aria-hidden="true" data-parallax="0.05" style={{ position: "absolute", right: "clamp(-40px,-2vw,0px)", top: "clamp(96px,16vh,200px)", pointerEvents: "none", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(140px,20vw,300px)", lineHeight: ".76", letterSpacing: "-.06em", color: "#1D2027" } as CSSProperties}>
              FA
            </div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "44vh", pointerEvents: "none", background: "linear-gradient(to top,rgba(22,24,29,.96),rgba(22,24,29,0))" } as CSSProperties} />
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none", overflow: "hidden" } as CSSProperties}>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "7%", top: "15%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(16px,2.14vw,30px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 700ms both,faFloatA 11s ease-in-out 1600ms infinite" } as CSSProperties}>
                {t.k21}
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "33%", top: "8%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.43vw,20px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 820ms both,faFloatB 12s ease-in-out 1720ms infinite" } as CSSProperties}>
                {t.k22}
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "82%", top: "23%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.57vw,22px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1060ms both,faFloatA 13s ease-in-out 1960ms infinite" } as CSSProperties}>
                {t.k24}
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "70%", top: "37%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(14px,1.86vw,26px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1300ms both,faFloatC 12s ease-in-out 2200ms infinite" } as CSSProperties}>
                {t.k26}
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "20%", top: "33%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.14vw,16px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1420ms both,faFloatA 10s ease-in-out 2320ms infinite" } as CSSProperties}>
                {t.k27}
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "54%", top: "47%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.43vw,20px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1540ms both,faFloatB 14s ease-in-out 2440ms infinite" } as CSSProperties}>
                {t.k28}
              </span>
              {" "}
<span data-anim="" style={{ position: "absolute", left: "11%", top: "45%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.57vw,22px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1780ms both,faFloatA 10s ease-in-out 2680ms infinite" } as CSSProperties}>
                {t.k30}
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "38%", top: "57%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.21vw,17px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1900ms both,faFloatB 13s ease-in-out 2800ms infinite" } as CSSProperties}>
                {t.k31}
              </span>
              {" "}
            </div>
            {" "}
            <div style={{ position: "relative", width: "100%", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)", display: "flex", flexDirection: "column", gap: "clamp(22px,2.8vw,40px)" } as CSSProperties}>
              {" "}
              <div data-anim="" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px 32px", paddingBottom: "14px", borderBottom: "1px solid rgba(247,246,243,.34)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(12px,.9vw,12px)", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.86)", animation: "faFade 700ms ease 120ms both" } as CSSProperties}>
                {" "}
                <span>
                  {t.k33}
                </span>
                {" "}
                <span>
                  {t.k34}
                </span>
                {" "}
              </div>
              {" "}
              <h1 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", textTransform: "uppercase", lineHeight: ".84", letterSpacing: "-.05em" } as CSSProperties}>
                {" "}
                <span style={{ display: "block", overflow: "hidden", paddingBottom: ".03em" } as CSSProperties}>
                  <span data-anim="" style={{ display: "block", fontSize: "clamp(38px,10.4vw,172px)", animation: "faRise 1000ms cubic-bezier(.16,1,.3,1) 160ms both" } as CSSProperties}>
                    Future
                  </span>
                </span>
                {" "}
                <span style={{ display: "block", overflow: "hidden", paddingBottom: ".03em" } as CSSProperties}>
                  <span data-anim="" style={{ display: "block", fontSize: "clamp(38px,10.4vw,172px)", animation: "faRise 1000ms cubic-bezier(.16,1,.3,1) 300ms both" } as CSSProperties}>
                    Architecture
                  </span>
                </span>
                {" "}
              </h1>
              {" "}
              <div data-anim="" style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 28px", animation: "faFade 700ms ease 500ms both" } as CSSProperties}>
                {" "}
                <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(24px,4.6vw,76px)", lineHeight: ".9", letterSpacing: "-.03em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                  {t.k35}
                </span>
                {" "}
                <span style={{ flex: "1 1 120px", height: "1px", background: "rgba(247,246,243,.34)" } as CSSProperties} />
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(12px,.9vw,12px)", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.78)" } as CSSProperties}>
                  {t.k36}
                </span>
                {" "}
              </div>
              {" "}
              <div data-anim="" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "28px 56px", animation: "faFade 800ms ease 620ms both" } as CSSProperties}>
                {" "}
                <p style={{ flex: "1 1 420px", maxWidth: "46ch", fontSize: "clamp(17px,1.5vw,25px)", lineHeight: "1.42", letterSpacing: "-.012em", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                  {t.k37}
                </p>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" } as CSSProperties}>
                  {" "}
                  <a className="fa-hf42e924" href="#apply" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "19px 38px", background: "#F7F6F3", color: "#16181D", border: "1px solid #F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                    {t.k38}
                  </a>
                  {" "}
                  <a className="fa-hf2ea20d" href={lp("/forum")} data-page="" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "19px 38px", border: "1px solid rgba(247,246,243,.6)", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                    {t.k9}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                      →
                    </span>
                  </a>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.7)" } as CSSProperties}>
                {" "}
                <span data-anim="" style={{ display: "block", width: "1px", height: "32px", background: "#FF4002", animation: "faScroll 2.6s ease-in-out infinite" } as CSSProperties} />
                {" "}
                <span>
                  {t.k42}
                </span>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <div aria-hidden="true" style={{ overflow: "hidden", background: "#FF4002", padding: "clamp(14px,1.8vw,26px) 0" } as CSSProperties}>
            {" "}
            <div className="fa-h932431b" data-marquee="" style={{ display: "flex", width: "max-content", animation: "faMarquee 64s linear infinite", animationPlayState: bandPlay, fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(26px,4.4vw,68px)", lineHeight: "1", letterSpacing: "-.04em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: ".28em", paddingRight: ".28em" } as CSSProperties}>
                <span>
                  {t.k39}
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  {t.k43}
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
              </div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: ".28em", paddingRight: ".28em" } as CSSProperties}>
                <span>
                  {t.k39}
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  {t.k43}
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <nav aria-label={t.k44} style={{ display: indexDisplay, background: "#F7F6F3", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
            {" "}
            <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))" } as CSSProperties}>
              {" "}
              <a className="fa-h3bf4555" href="#manifest" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#FF4002" } as CSSProperties}>
                  01
                </span>
                {t.k7}
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#members" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  02
                </span>
                {t.k18}
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#formats" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  03
                </span>
                {t.k8}
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#forum" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  04
                </span>
                {t.k9}
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#base" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  05
                </span>
                {t.k19}
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#join" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  06
                </span>
                {t.k11}
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#apply" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  07
                </span>
                {t.k20}
              </a>
              {" "}
            </div>
            {" "}
          </nav>
          {" "}
          <section id="manifest" data-screen-label="01 Позиция" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,10vw,168px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
            {" "}
            <span aria-hidden="true" data-parallax="0.03" style={{ position: "absolute", right: "clamp(-20px,-1vw,0px)", top: "clamp(20px,3vw,48px)", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(130px,22vw,320px)", lineHeight: ".76", letterSpacing: "-.06em", color: "#EFEDE8", pointerEvents: "none" } as CSSProperties}>
              01
            </span>
            {" "}
            <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                    01
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                  {t.k7}
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(40px,5vw,84px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(34px,7.6vw,124px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase", textWrap: "initial" } as CSSProperties}>
                {t.k39}
                <br />
                {t.k45}
                <br />
                <span style={{ color: "#FF4002" } as CSSProperties}>
                  {t.k46}
                </span>
              </h2>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "36px 8%", marginTop: "clamp(44px,5.4vw,88px)", paddingTop: "28px", borderTop: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", flex: "1 1 420px", maxWidth: "54ch", fontSize: "clamp(17px,1.4vw,23px)", lineHeight: "1.5", color: "#4A4D53" } as CSSProperties}>
                  {t.k47}
                </p>
                {" "}
                <div data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", flex: "0 1 340px", display: "flex", alignItems: "flex-end", gap: "28px" } as CSSProperties}>
                  {" "}
                  <div style={{ flex: "0 0 auto", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(72px,8vw,132px)", lineHeight: ".78", letterSpacing: "-.055em" } as CSSProperties}>
                    <span data-count="4">
                      4
                    </span>
                  </div>
                  {" "}
                  <div style={{ flex: "1 1 auto", paddingBottom: "10px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", lineHeight: "1.65", color: "#6E7278" } as CSSProperties}>
                    {t.k48}
                    <br />
                    {t.k49}
                    <br />
                    <span style={{ color: "#16181D" } as CSSProperties}>
                      {t.k50}
                    </span>
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
          <section id="members" data-screen-label="02 Состав" style={{ padding: "0 0 clamp(72px,10vw,168px)", backgroundColor: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                    02
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                  {t.k18}
                </span>
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "20px 48px", marginTop: "clamp(36px,4.4vw,68px)" } as CSSProperties}>
                {" "}
                <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,5.4vw,86px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase", textWrap: "initial" } as CSSProperties}>
                  {t.k315}
                  <br />
                  {t.k316}
                </h2>
                {" "}
                <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", maxWidth: "38ch", fontSize: "clamp(15px,1.15vw,18px)", lineHeight: "1.55", color: "#5C5F66" } as CSSProperties}>
                  {t.k52}
                </p>
                {" "}
              </div>
              {" "}
              <div style={{ marginTop: "clamp(36px,4.4vw,64px)", borderTop: "2px solid #16181D" } as CSSProperties}>
                {" "}
                <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", paddingTop: "clamp(20px,2.4vw,32px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                  {t.k317}
                </div>
                {" "}
                <div className="fa-h52a5cac" data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 40px", padding: "clamp(22px,2.6vw,40px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 44px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#FF4002" } as CSSProperties}>
                    01
                  </span>
                  {" "}
                  <h3 style={{ flex: "1 1 340px", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.8vw,44px)", lineHeight: "1.06", letterSpacing: "-.03em" } as CSSProperties}>
                    {t.k53}
                  </h3>
                  {" "}
                  <p style={{ flex: "1 1 260px", maxWidth: "34ch", fontSize: "16px", lineHeight: "1.5", color: "#5C5F66" } as CSSProperties}>
                    {t.k54}
                  </p>
                  {" "}
                  <div data-draw="" data-delay="180" aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "2px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <div data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 24px", paddingTop: "clamp(22px,2.6vw,36px)" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8E8B83" } as CSSProperties}>
                    {t.k318}
                  </span>
                  {" "}
                  <p style={{ flex: "1 1 320px", margin: "0", maxWidth: "56ch", fontSize: "16px", lineHeight: "1.55", color: "#5C5F66" } as CSSProperties}>
                    {t.k319}
                  </p>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <section id="formats" data-screen-label="03 Форматы" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,144px) 0", backgroundColor: "#16181D", color: "#F7F6F3", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)", backgroundAttachment: "fixed" } as CSSProperties}>
            {" "}
            <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #3A3D44" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                    03
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                  {t.k61}
                </span>
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "20px 48px", marginTop: "clamp(36px,4.4vw,68px)" } as CSSProperties}>
                {" "}
                <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,6.6vw,104px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase", textWrap: "initial" } as CSSProperties}>
                  {t.k62}
                  <br />
                  <span style={{ color: "#FF4002" } as CSSProperties}>
                    {t.k63}
                  </span>
                </h2>
                {" "}
                <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", maxWidth: "38ch", fontSize: "clamp(15px,1.15vw,18px)", lineHeight: "1.6", color: "#B9BBC0" } as CSSProperties}>
                  {t.k64}
                </p>
                {" "}
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: ("var(--formatCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,64px)", background: "#3A3D44", outline: "1px solid #3A3D44" } as CSSProperties}>
                {" "}
                <div className="fa-h80081ee" data-reveal="" data-delay="0" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    01
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                    {t.k65}
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", maxWidth: "34ch", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    {t.k66}
                  </p>
                  {" "}
                </div>
                {" "}
                <div className="fa-h80081ee" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    02
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                    ArchiMinds
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    {t.k67}
                  </p>
                  {" "}
                </div>
                {" "}
                <div className="fa-h80081ee" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    03
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                    {t.k68}
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    {t.k69}
                  </p>
                  {" "}
                </div>
                {" "}
                <div className="fa-h80081ee" data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    04
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                    {t.k70}
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    {t.k71}
                  </p>
                  {" "}
                </div>
                {" "}
                <a className="fa-h80081ee" href={lp("/award")} data-page="" data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    05
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                    {t.k10}
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    {t.k72}
                  </p>
                  {" "}
                  <span aria-hidden="true" style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", color: "#FF4002" } as CSSProperties}>
                    →
                  </span>
                  {" "}
                </a>
                {" "}
                <div className="fa-h80081ee" data-reveal="" data-delay="300" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    06
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                    {t.k310}
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    {t.k73}
                  </p>
                  {" "}
                </div>
                {" "}
                <div className="fa-h80081ee" data-reveal="" data-delay="360" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    07
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                    YouTube
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    {t.k311}
                  </p>
                  {" "}
                </div>
                {" "}
                <div className="fa-h80081ee" data-reveal="" data-delay="420" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    08
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                    {t.k74}
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    {t.k75}
                  </p>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <section id="forum" data-screen-label="04 Форум 2026" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,144px) 0", backgroundColor: "#FF4002", color: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div aria-hidden="true" data-anim="" style={{ position: "absolute", top: "-10%", left: "-10%", right: "-10%", bottom: "-10%", pointerEvents: "none", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.14) 0 1px,transparent 1px 96px)", animation: "faPan 22s linear infinite" } as CSSProperties} />
            {" "}
            <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,.45)" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#16181D" } as CSSProperties}>
                    04
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(247,246,243,.92)" } as CSSProperties}>
                  {t.k76}
                </span>
                {" "}
              </div>
              {" "}
              <div data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "center", gap: "12px", marginTop: "clamp(28px,3.4vw,48px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(12px,.9vw,12px)", letterSpacing: ".14em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
                {" "}
                <span data-pulse="" style={{ width: "8px", height: "8px", background: "#16181D", animation: "faPulse 2s ease-in-out infinite" } as CSSProperties} />
                {" "}
                <span>
                  {t.k77}
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(20px,2.4vw,32px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,8.2vw,132px)", lineHeight: ".86", letterSpacing: "-.05em", textTransform: "uppercase", maxWidth: "15ch" } as CSSProperties}>
                Future Architecture{" "}
                <span style={{ color: "#16181D" } as CSSProperties}>
                  Forum
                </span>
              </h2>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "36px 56px", marginTop: "clamp(36px,4.4vw,64px)" } as CSSProperties}>
                {" "}
                <p data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", flex: "1 1 440px", maxWidth: "48ch", fontSize: "clamp(16px,1.35vw,22px)", lineHeight: "1.5" } as CSSProperties}>
                  {t.k78}
                </p>
                {" "}
                <div data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "28px 44px" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "14px" } as CSSProperties}>
                    {" "}
                    <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(48px,5.4vw,84px)", lineHeight: ".9", letterSpacing: "-.05em" } as CSSProperties}>
                      <span data-count="250">
                        250
                      </span>
                    </span>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(247,246,243,.92)" } as CSSProperties}>
                      {t.k79}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <a className="fa-hf2ea20d" href={lp("/forum")} data-page="" style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: "20px", padding: "19px 32px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                    {t.k81}
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
          <section id="base" data-screen-label="05 Основа" style={{ padding: "clamp(72px,10vw,168px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                    05
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                  {t.k82}
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,68px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,5.4vw,86px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                {t.k83}
              </h2>
              {" "}
              <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(36px,4.4vw,64px)", paddingTop: "24px", borderTop: "2px solid #16181D" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px 40px" } as CSSProperties}>
                  {" "}
                  <img src="/img/d65b278e9b.png" alt="LH47 arch." style={{ height: "32px", width: "auto", display: "block", filter: "brightness(0) invert(.14)" } as CSSProperties} />
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    {t.k84}
                  </span>
                  {" "}
                </div>
                {" "}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "1px", marginTop: "clamp(26px,3vw,40px)", background: "#DCDAD4", outline: "1px solid #DCDAD4" } as CSSProperties}>
                  {" "}
                  <div className="fa-hea007e6" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                    {" "}
                    <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                      <span data-count="10">
                        10
                      </span>
                    </div>
                    {" "}
                    <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                      {t.k85}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div className="fa-hea007e6" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                    {" "}
                    <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                      <span data-count="5">
                        5
                      </span>
                    </div>
                    {" "}
                    <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                      {t.k86}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div className="fa-hea007e6" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                    {" "}
                    <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                      <span data-count="100" data-suffix="+">
                        100+
                      </span>
                    </div>
                    {" "}
                    <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                      {t.k87}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div className="fa-hea007e6" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                    {" "}
                    <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                      <span data-count="4">
                        4
                      </span>
                    </div>
                    {" "}
                    <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                      {t.k88}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div className="fa-hea007e6" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                    {" "}
                    <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                      <span data-count="800" data-suffix="+">
                        800+
                      </span>
                    </div>
                    {" "}
                    <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                      {t.k89}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(36px,4.4vw,64px)", paddingTop: "24px", borderTop: "2px solid #16181D" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px 40px" } as CSSProperties}>
                  {" "}
                  <img src="/img/d7f7cfad4d.png" alt="InStyle Home" style={{ height: "26px", width: "auto", display: "block", filter: "brightness(0) invert(.14)" } as CSSProperties} />
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    {t.k90}
                  </span>
                  {" "}
                </div>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px 44px", marginTop: "clamp(26px,3vw,40px)" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "18px" } as CSSProperties}>
                    {" "}
                    <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                      <span data-count="20">
                        20
                      </span>
                    </div>
                    {" "}
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k85}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <p style={{ flex: "1 1 380px", maxWidth: "44ch", fontSize: "16px", lineHeight: "1.6", color: "#5C5F66" } as CSSProperties}>
                    {t.k91}
                  </p>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <section id="join" data-screen-label="06 Участие" style={{ padding: "0 0 clamp(72px,10vw,168px)", backgroundColor: "#F7F6F3" } as CSSProperties}>
            {" "}
            <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                    06
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                  {t.k92}
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,68px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,5.4vw,86px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                {t.k93}
              </h2>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: ("var(--twoCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,64px)", background: "#DCDAD4", outline: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <div data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", padding: "clamp(28px,3vw,48px)", background: "#16181D", color: "#F7F6F3" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                    01
                  </span>
                  {" "}
                  <div style={{ marginTop: "clamp(14px,1.6vw,22px)", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,4.6vw,72px)", lineHeight: ".92", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                    Member
                  </div>
                  {" "}
                  <h3 style={{ margin: "clamp(16px,1.8vw,24px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.16", letterSpacing: "-.02em" } as CSSProperties}>
                    {t.k53}
                  </h3>
                  {" "}
                  <div style={{ minHeight: "32px", marginTop: "14px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                    {t.k94}
                  </div>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "clamp(20px,2.4vw,30px) 0 0", padding: "0", display: "flex", flexDirection: "column", fontSize: "16px", lineHeight: "1.5", color: "#B9BBC0" } as CSSProperties}>
                    {" "}
                    <li className="fa-hf6acb64" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                        01
                      </span>
                      <span>
                        {t.k95}
                      </span>
                    </li>
                    {" "}
                    <li className="fa-hf6acb64" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                        02
                      </span>
                      <span>
                        {t.k96}
                      </span>
                    </li>
                    {" "}
                    <li className="fa-hf6acb64" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                        03
                      </span>
                      <span>
                        {t.k97}
                      </span>
                    </li>
                    {" "}
                    <li className="fa-hf6acb64" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #3A3D44", borderBottom: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                        04
                      </span>
                      <span>
                        {t.k98}
                      </span>
                    </li>
                    {" "}
                  </ul>
                  {" "}
                  <a className="fa-h7eab1cf" href="#apply" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "auto", padding: "18px 34px", background: "#FF4002", color: "#F7F6F3", border: "1px solid #FF4002", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                    {t.k38}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                      →
                    </span>
                  </a>
                  {" "}
                </div>
                {" "}
                <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", padding: "clamp(28px,3vw,48px)", background: "#F7F6F3", color: "#16181D" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#8E8B83" } as CSSProperties}>
                    02
                  </span>
                  {" "}
                  <div style={{ marginTop: "clamp(14px,1.6vw,22px)", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,4.6vw,72px)", lineHeight: ".92", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                    Partner
                  </div>
                  {" "}
                  <h3 style={{ margin: "clamp(16px,1.8vw,24px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.16", letterSpacing: "-.02em" } as CSSProperties}>
                    {t.k99}
                  </h3>
                  {" "}
                  <div style={{ minHeight: "32px", marginTop: "14px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    {t.k94}
                  </div>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "clamp(20px,2.4vw,30px) 0 0", padding: "0", display: "flex", flexDirection: "column", fontSize: "16px", lineHeight: "1.5", color: "#5C5F66" } as CSSProperties}>
                    {" "}
                    <li className="fa-h112782f" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #DCDAD4", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8B83" } as CSSProperties}>
                        01
                      </span>
                      <span>
                        {t.k100}
                      </span>
                    </li>
                    {" "}
                    <li className="fa-h112782f" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #DCDAD4", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8B83" } as CSSProperties}>
                        02
                      </span>
                      <span>
                        {t.k101}
                      </span>
                    </li>
                    {" "}
                    <li className="fa-h112782f" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #DCDAD4", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8B83" } as CSSProperties}>
                        03
                      </span>
                      <span>
                        {t.k102}
                      </span>
                    </li>
                    {" "}
                    <li className="fa-h112782f" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #DCDAD4", borderBottom: "1px solid #DCDAD4", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8B83" } as CSSProperties}>
                        04
                      </span>
                      <span>
                        {t.k103}
                      </span>
                    </li>
                    {" "}
                  </ul>
                  {" "}
                  <a className="fa-hea007e6" href="#apply" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "auto", padding: "18px 34px", background: "transparent", color: "#16181D", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                    {t.k104}
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
          <section id="apply" data-screen-label="07 Вступление" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,140px) 0 clamp(64px,8vw,120px)", backgroundColor: "#16181D", color: "#F7F6F3", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)" } as CSSProperties}>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", pointerEvents: "none", overflow: "hidden" } as CSSProperties}>
              {" "}
              <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "min(14vw,190px)", lineHeight: "1", letterSpacing: "-.06em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(255,64,2,.18)", paddingLeft: "clamp(20px,4.8vw,108px)" } as CSSProperties}>
                {t.k35}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
              {" "}
              <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #3A3D44" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                    07
                  </span>
                  {" "}
                  <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                  {t.k20}
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,64px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,5.8vw,92px)", lineHeight: ".92", letterSpacing: "-.05em", textTransform: "uppercase", maxWidth: "20ch", textWrap: "initial" } as CSSProperties}>
                {t.k20}
                <br />
{t.k105}{" "}
                <span style={{ color: "#FF4002" } as CSSProperties}>
                  {t.k106}
                </span>
              </h2>
              {" "}
              <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", gap: "10px 20px", marginTop: "clamp(24px,3vw,36px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                {" "}
                <span>
                  {t.k107}
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  →
                </span>
                {" "}
                <span>
                  {t.k108}
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  →
                </span>
                {" "}
                <span>
                  {t.k109}
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  →
                </span>
                {" "}
                <span>
                  {t.k110}
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  →
                </span>
                {" "}
                <span style={{ color: "#FF4002" } as CSSProperties}>
                  {t.k111}
                </span>
                {" "}
              </div>
              {" "}
              {notSent ? (
                <>
                {" "}
                <form onSubmit={submit} noValidate data-reveal="" data-delay="160" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(36px,4.4vw,56px)", maxWidth: "960px", background: "#F7F6F3", color: "#16181D", padding: "clamp(26px,3.2vw,52px)", boxShadow: "14px 14px 0 #FF4002" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "8px 48px" } as CSSProperties}>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="fa-name" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k112}
                      </label>
                      {" "}
                      <input className="fa-f0988020" id="fa-name" name="name" type="text" autoComplete="name" onInput={onName} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                        {errName}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="fa-company" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k113}
                      </label>
                      {" "}
                      <input className="fa-f0988020" id="fa-company" name="company" type="text" autoComplete="organization" onInput={onCompany} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                        {errCompany}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="fa-role" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k114}
                      </label>
                      {" "}
                      <input className="fa-f0988020" id="fa-role" name="role" type="text" autoComplete="organization-title" placeholder={t.k312} onInput={onRole} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                        {errRole}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="fa-email" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        E-mail
                      </label>
                      {" "}
                      <input className="fa-f0988020" id="fa-email" name="email" type="email" autoComplete="email" onInput={onEmail} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                        {errEmail}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div>
                      {" "}
                      <label htmlFor="fa-phone" style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k120}
                      </label>
                      {" "}
                      <input className="fa-f0988020" id="fa-phone" name="phone" type="tel" autoComplete="tel" onInput={onPhone} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                      {" "}
                      <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                        {errPhone}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <button className="fa-h3635ec6" type="submit" style={{ marginTop: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "18px 36px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                    {t.k121}
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
                <div style={{ marginTop: "clamp(36px,4.4vw,56px)", padding: "clamp(26px,3.2vw,48px)", background: "#F7F6F3", color: "#16181D", maxWidth: "65ch", boxShadow: "14px 14px 0 #FF4002" } as CSSProperties}>
                  {" "}
                  <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,1.9vw,26px)" } as CSSProperties}>
                    {t.k122}
                  </div>
                  {" "}
                  <p style={{ margin: "16px 0 0", fontSize: "16px", lineHeight: "1.6", color: "#5C5F66" } as CSSProperties}>
                    {t.k123}
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
        <footer id="contacts" style={{ backgroundColor: "#F7F6F3", color: "#16181D", padding: "clamp(44px,5.4vw,72px) 0 40px", borderTop: "2px solid #16181D" } as CSSProperties}>
          {" "}
          <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
            {" "}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px 56px" } as CSSProperties}>
              {" "}
              <div style={{ flex: "1 1 300px" } as CSSProperties}>
                {" "}
                <img src="/img/93a4df84e5.png" alt="Future Architecture" style={{ height: "92px", width: "auto", display: "block" } as CSSProperties} />
                {" "}
                <p style={{ margin: "24px 0 0", fontSize: "15px", lineHeight: "1.6", color: "#6E7278", maxWidth: "32ch" } as CSSProperties}>
                  {t.k124}
                </p>
                {" "}
              </div>
              {" "}
              <nav aria-label={t.k125} style={{ flex: "0 1 168px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
                {" "}
                <a className="fa-h80081ee" href="#manifest" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  {t.k7}
                </a>
                {" "}
                <a className="fa-h80081ee" href="#formats" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  {t.k8}
                </a>
                {" "}
                <a className="fa-h80081ee" href="#join" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  {t.k11}
                </a>
                {" "}
                <a className="fa-h80081ee" href={lp("/forum")} data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  {t.k9}
                </a>
                {" "}
                <a className="fa-h80081ee" href={lp("/award")} data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  {t.k10}
                </a>
                {" "}
              </nav>
              {" "}
              <div style={{ flex: "0 1 280px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
                {" "}
                <a className="fa-h80081ee" href="mailto:marketing@lh47arch.com" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  marketing@lh47arch.com
                </a>
                {" "}
                <a className="fa-h80081ee" href="mailto:marketing@instylehome.md" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  marketing@instylehome.md
                </a>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" } as CSSProperties}>
                  <a className="fa-h80081ee" href="tel:+37368199951" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    (+373) 68 199 951
                  </a>
                  <span style={{ color: "#8E8B83" } as CSSProperties}>
                    – InStyle Home
                  </span>
                </div>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" } as CSSProperties}>
                  <a className="fa-h80081ee" href="tel:+37368059311" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    (+373) 68 059 311
                  </a>
                  <span style={{ color: "#8E8B83" } as CSSProperties}>
                    – LH47
                  </span>
                </div>
                {" "}
              </div>
              {" "}
              <div className="fa-social" style={{ flex: "0 1 160px", color: "#5C5F66" } as CSSProperties}>
                {" "}
                <a className="fa-h80081ee" href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg><span className="fa-sr">Instagram</span></a>
                {" "}
                <a className="fa-h80081ee" href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.3-.13-2.47-.13-2.44 0-4.11 1.49-4.11 4.23V9.9H7.4V13h2.72v8h3.38z" /></svg><span className="fa-sr">Facebook</span></a>
                {" "}
                <a className="fa-h80081ee" href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 8.6H3.9V21h3.04V8.6zM5.42 3A1.8 1.8 0 105.4 6.6 1.8 1.8 0 005.42 3zM21 14.2c0-3.4-1.82-4.98-4.24-4.98-1.96 0-2.83 1.08-3.32 1.84V8.6H10.4c.04.86 0 12.4 0 12.4h3.04v-6.92c0-.33.02-.66.12-.9.27-.66.87-1.34 1.9-1.34 1.33 0 1.87 1.02 1.87 2.5V21H21v-6.8z" /></svg><span className="fa-sr">LinkedIn</span></a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 32px", marginTop: "clamp(36px,4.4vw,56px)", paddingTop: "20px", borderTop: "1px solid #DCDAD4" } as CSSProperties}>
              {" "}
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                {t.k126}
              </span>
              {" "}
              <img className="fa-hdb34e45" src="/img/d65b278e9b.png" alt="LH47 arch." style={{ height: "22px", width: "auto", display: "block", filter: "brightness(0) invert(.4)", transition: "filter 200ms ease" } as CSSProperties} />
              {" "}
              <img className="fa-hdb34e45" src="/img/d7f7cfad4d.png" alt="InStyle Home" style={{ height: "17px", width: "auto", display: "block", filter: "brightness(0) invert(.4)", transition: "filter 200ms ease" } as CSSProperties} />
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px 32px", marginTop: "28px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E8B83" } as CSSProperties}>
              {" "}
              <div style={{ display: "flex", gap: "8px" } as CSSProperties}>
                {" "}
                <a href={lhref('ro')} hrefLang="ro" aria-current={lang === 'ro' ? 'true' : undefined} style={{ color: lang === 'ro' ? "#16181D" : "inherit" } as CSSProperties}>
                  RO
                </a>
                <span style={{ color: "#DCDAD4" } as CSSProperties}>
                  /
                </span>
                <a href={lhref('ru')} hrefLang="ru" aria-current={lang === 'ru' ? 'true' : undefined} style={{ color: lang === 'ru' ? "#16181D" : "inherit" } as CSSProperties}>
                  RU
                </a>
                <span style={{ color: "#DCDAD4" } as CSSProperties}>
                  /
                </span>
                <a href={lhref('en')} hrefLang="en" aria-current={lang === 'en' ? 'true' : undefined} style={{ color: lang === 'en' ? "#16181D" : "inherit" } as CSSProperties}>
                  EN
                </a>
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" } as CSSProperties}>
                {" "}
                <span>
                  © 2026 Future Architecture
                </span>
                {" "}
                <a className="fa-hb09baf5" href="#" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  {t.k127}
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
