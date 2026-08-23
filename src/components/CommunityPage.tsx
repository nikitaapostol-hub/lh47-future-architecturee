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
  const menuDisplay = menu ? ('var(--menuDisplay)' as any) : 'none'
  const notSent = !sent
  const indexDisplay = indexVisible === false ? 'none' : 'block'
  const bandPlay = bandMotion === false ? 'paused' : 'running'

  return (
    <>
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
                    {t.k401}
                  </span>
                  {" "}
                </a>
                {" "}
                <nav aria-label={t.k6} style={{ marginLeft: "auto", minWidth: "0", display: ("var(--navDisplay)" as any), alignItems: "center", gap: "26px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
                  {" "}
                  <a className="fa-h6ae611c" href="#manifest" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    {t.k7}
                  </a>
                  {" "}
                  <a className="fa-h6ae611c" href="#formats" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    {t.k8}
                  </a>
                  {" "}
                  <a className="fa-h6ae611c" href={lp("/forum")} style={{ transition: "color 200ms ease", color: "#FF4002", fontWeight: "600" } as CSSProperties}>
                    {t.k9}
                  </a>
                  {" "}
                  <a className="fa-h6ae611c" href={lp("/award")} style={{ transition: "color 200ms ease", position: "relative" } as CSSProperties}>
                    {t.k10}
                    <span aria-hidden="true" style={{ position: "absolute", top: "-2px", right: "-9px", width: "5px", height: "5px", background: "#FF4002" } as CSSProperties}>
                    </span>
                  </a>
                  {" "}
                  <a className="fa-h6ae611c" href="#join" style={{ transition: "color 200ms ease" } as CSSProperties}>
                    {t.k11}
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
                  {" "}
                  <a href={lhref("ru")} style={{ color: langColor("ru", "#16181D", "#6E7278") } as CSSProperties}>
                    {t.k404}
                  </a>
                  <span style={{ color: "#DCDAD4" } as CSSProperties}>
                    {t.k403}
                  </span>
                  {" "}
                  <a href={lhref("en")} style={{ color: langColor("en", "#16181D", "#6E7278") } as CSSProperties}>
                    {t.k405}
                  </a>
                  {" "}
                </div>
                {" "}
                <a className="fa-h230b4f3" href="#apply" style={{ display: ("var(--navDisplay)" as any), flex: "0 0 auto", alignItems: "center", padding: "12px 22px", background: "#16181D", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2", whiteSpace: "nowrap", border: "1px solid #16181D", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                  {t.k14}
                </a>
                {" "}
                <button type="button" aria-label={t.k15} onClick={toggleMenu} style={{ display: ("var(--burgerDisplay)" as any), marginLeft: "auto", flexDirection: "column", justifyContent: "center", gap: "6px", width: "44px", height: "44px", padding: "0", background: "transparent", border: "0", cursor: "pointer" } as CSSProperties}>
                  {" "}
                  <span style={{ display: "block", width: "22px", height: "1px", background: "#16181D" } as CSSProperties}>
                  </span>
                  {" "}
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
                  <a href="#manifest" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {t.k7}
                  </a>
                  {" "}
                  <a href="#formats" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {t.k8}
                  </a>
                  {" "}
                  <a href={lp("/forum")} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4", color: "#FF4002" } as CSSProperties}>
                    {t.k9}
                  </a>
                  {" "}
                  <a href={lp("/award")} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
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
                    <a href={lhref("ro")} style={{ color: langColor("ro", "#16181D", "#6E7278") } as CSSProperties}>
                      {t.k402}
                    </a>
                    <span style={{ color: "#DCDAD4" } as CSSProperties}>
                      {t.k403}
                    </span>
                    {" "}
                    <a href={lhref("ru")} style={{ color: langColor("ru", "#16181D", "#6E7278") } as CSSProperties}>
                      {t.k404}
                    </a>
                    <span style={{ color: "#DCDAD4" } as CSSProperties}>
                      {t.k403}
                    </span>
                    {" "}
                    <a href={lhref("en")} style={{ color: langColor("en", "#16181D", "#6E7278") } as CSSProperties}>
                      {t.k405}
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
                <div data-progress="" style={{ width: "100%", height: "2px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                </div>
                {" "}
              </div>
              {" "}
            </header>
            {" "}
            <main>
              {" "}
              <section id="top" data-screen-label="Хиро" style={{ position: "relative", overflow: "hidden", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(132px,18vh,196px) 0 clamp(24px,3vw,44px)", backgroundColor: "#16181D", color: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", top: "-10%", left: "-10%", right: "-10%", bottom: "-10%", pointerEvents: "none", backgroundImage: "repeating-linear-gradient(90deg,rgba(247,246,243,.10) 0 1px,transparent 1px 96px)", animation: "faPan 26s linear infinite" } as CSSProperties}>
                </div>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", inset: "-64px", pointerEvents: "none", backgroundImage: "radial-gradient(rgba(247,246,243,.06) 1px,transparent 1px)", backgroundSize: "80px 80px", animation: "faDrift 13s linear infinite" } as CSSProperties}>
                </div>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", right: "clamp(-40px,-2vw,0px)", top: "clamp(96px,16vh,200px)", pointerEvents: "none", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(140px,20vw,300px)", lineHeight: ".76", letterSpacing: "-.06em", color: "#1D2027" } as CSSProperties}>
                  {t.k406}
                </div>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "44vh", pointerEvents: "none", background: "linear-gradient(to top,rgba(22,24,29,.96),rgba(22,24,29,0))" } as CSSProperties}>
                </div>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none", overflow: "hidden" } as CSSProperties}>
                  {" "}
                  <span style={{ position: "absolute", left: "4%", top: "6%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(16px,2.14vw,30px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 700ms both,faFloatA 11s ease-in-out 1600ms infinite" } as CSSProperties}>
                    {t.k39}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "78%", top: "7%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.43vw,20px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 820ms both,faFloatB 12s ease-in-out 1720ms infinite" } as CSSProperties}>
                    {t.k407}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "30%", top: "9%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.57vw,22px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1060ms both,faFloatA 13s ease-in-out 1960ms infinite" } as CSSProperties}>
                    {t.k28}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "55%", top: "8%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(14px,1.86vw,26px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1300ms both,faFloatC 12s ease-in-out 2200ms infinite" } as CSSProperties}>
                    {t.k24}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "12%", top: "20%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.14vw,16px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1420ms both,faFloatA 10s ease-in-out 2320ms infinite" } as CSSProperties}>
                    {t.k27}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "42%", top: "22%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.43vw,20px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1540ms both,faFloatB 14s ease-in-out 2440ms infinite" } as CSSProperties}>
                    {t.k43}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "66%", top: "19%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.57vw,22px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1780ms both,faFloatA 10s ease-in-out 2680ms infinite" } as CSSProperties}>
                    {t.k408}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "85%", top: "24%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.21vw,17px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 1900ms both,faFloatB 13s ease-in-out 2800ms infinite" } as CSSProperties}>
                    {t.k409}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "25%", top: "31%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.3vw,18px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 2020ms both,faFloatC 11s ease-in-out 2920ms infinite" } as CSSProperties}>
                    {t.k410}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "58%", top: "33%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.5vw,21px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.09)", animation: "faFade 900ms ease 2140ms both,faFloatA 12s ease-in-out 3040ms infinite" } as CSSProperties}>
                    {t.k411}
                  </span>
                  {" "}
                </div>
                {" "}
                <div style={{ position: "relative", width: "100%", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)", display: "flex", flexDirection: "column", gap: "clamp(22px,2.8vw,40px)" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px 32px", paddingBottom: "14px", borderBottom: "1px solid rgba(247,246,243,.34)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                    {" "}
                    <span>
                      {t.k34}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h1 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", textTransform: "uppercase", lineHeight: ".9", letterSpacing: "-.03em" } as CSSProperties}>
                    {" "}
                    <span style={{ display: "block", overflow: "hidden", paddingBottom: ".03em" } as CSSProperties}>
                      <span data-fit="" data-fit-max="150" style={{ display: "inline-block", whiteSpace: "nowrap", fontSize: "clamp(28px,6.2vw,100px)" } as CSSProperties}>
                        {t.k412}
                      </span>
                    </span>
                    {" "}
                    <span style={{ display: "block", overflow: "hidden", paddingBottom: ".03em" } as CSSProperties}>
                      <span data-fit="" data-fit-max="150" style={{ display: "inline-block", whiteSpace: "nowrap", fontSize: "clamp(28px,6.2vw,100px)" } as CSSProperties}>
                        {t.k413}
                      </span>
                    </span>
                    {" "}
                  </h1>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 28px" } as CSSProperties}>
                    {" "}
                    <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(22px,3.6vw,58px)", lineHeight: ".9", letterSpacing: "-.03em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                      {t.k414}
                    </span>
                    {" "}
                    <span style={{ flex: "1 1 120px", height: "1px", background: "rgba(247,246,243,.34)" } as CSSProperties}>
                    </span>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.78)" } as CSSProperties}>
                      {t.k36}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "28px 56px" } as CSSProperties}>
                    {" "}
                    <p style={{ flex: "1 1 420px", maxWidth: "46ch", fontSize: "clamp(17px,1.5vw,25px)", lineHeight: "1.42", letterSpacing: "-.012em", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                      {t.k415}
                    </p>
                    {" "}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" } as CSSProperties}>
                      {" "}
                      <a className="fa-h879d62b" href="#apply" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "19px 38px", background: "#F7F6F3", color: "#16181D", border: "1px solid #F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                        {t.k38}
                      </a>
                      {" "}
                      <a className="fa-h7189809" href={lp("/forum")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "19px 38px", border: "1px solid rgba(247,246,243,.6)", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                        {t.k9}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                          {t.k416}
                        </span>
                      </a>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.7)" } as CSSProperties}>
                    {" "}
                    <span style={{ display: "block", width: "1px", height: "32px", background: "#FF4002", animation: "faScroll 2.6s ease-in-out infinite" } as CSSProperties}>
                    </span>
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
                <div className="fa-h6bd4330" data-marquee="" style={{ display: "flex", width: "max-content", animation: "faMarquee 64s linear infinite", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(26px,4.4vw,68px)", lineHeight: "1", letterSpacing: "-.04em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center", gap: ".28em", paddingRight: ".28em" } as CSSProperties}>
                    <span>
                      {t.k39}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k418}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k35}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k43}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k151}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k419}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                  </div>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center", gap: ".28em", paddingRight: ".28em" } as CSSProperties}>
                    <span>
                      {t.k39}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k418}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k35}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k43}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k151}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                    <span>
                      {t.k419}
                    </span>
                    <span style={{ color: "#F7F6F3" } as CSSProperties}>
                      {t.k417}
                    </span>
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <section id="manifest" data-screen-label="Позиция" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,10vw,168px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                        {t.k420}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k7}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(40px,5vw,84px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(34px,7.6vw,124px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase" } as CSSProperties}>
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
                    <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", flex: "1 1 420px", maxWidth: "60ch", fontSize: "clamp(17px,1.4vw,23px)", lineHeight: "1.5", color: "#4A4D53" } as CSSProperties}>
                      {t.k421}
                    </p>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </section>
              {" "}
              <section id="members" data-screen-label="Состав" style={{ padding: "0 0 clamp(72px,10vw,168px)", backgroundColor: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
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
                      {t.k18}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--twoCols)" as any), alignItems: "start", gap: "20px 48px", marginTop: "clamp(36px,4.4vw,68px)" } as CSSProperties}>
                    {" "}
                    <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,5.4vw,86px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                      {t.k315}
                      <br />
                      {t.k316}
                    </h2>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ marginTop: "clamp(36px,4.4vw,64px)", borderTop: "2px solid #16181D" } as CSSProperties}>
                    {" "}
                    <div className="fa-h4ed6486" data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "grid", gridTemplateColumns: ("var(--memberCols)" as any), alignItems: "start", gap: ("var(--memberGap)" as any), padding: "clamp(24px,2.8vw,44px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 260ms ease" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "14px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#FF4002" } as CSSProperties}>
                        <span>
                          {t.k423}
                        </span>
                        <span aria-hidden="true" style={{ color: "#C9C7C1" } as CSSProperties}>
                          {t.k420}
                        </span>
                      </div>
                      {" "}
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.8vw,44px)", lineHeight: "1.02", letterSpacing: "-.03em" } as CSSProperties}>
                        {t.k21}
                        <br />
                        {t.k424}
                      </h3>
                      {" "}
                      <p style={{ margin: "0", maxWidth: "34ch", fontSize: "16px", lineHeight: "1.55", color: "#5C5F66" } as CSSProperties}>
                        {t.k425}
                      </p>
                      {" "}
                      <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "2px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="fa-h4ed6486" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "grid", gridTemplateColumns: ("var(--memberCols)" as any), alignItems: "start", gap: ("var(--memberGap)" as any), padding: "clamp(24px,2.8vw,44px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 260ms ease" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "14px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        <span>
                          {t.k126}
                        </span>
                        <span aria-hidden="true" style={{ color: "#C9C7C1" } as CSSProperties}>
                          {t.k422}
                        </span>
                      </div>
                      {" "}
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.8vw,44px)", lineHeight: "1.02", letterSpacing: "-.03em", color: "#4A4D53" } as CSSProperties}>
                        {t.k426}
                      </h3>
                      {" "}
                      <p style={{ margin: "0", maxWidth: "34ch", fontSize: "16px", lineHeight: "1.55", color: "#5C5F66" } as CSSProperties}>
                        {t.k427}
                      </p>
                      {" "}
                      <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "2px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
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
              <section id="formats" data-screen-label="Форматы" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,144px) 0", backgroundColor: "#16181D", color: "#F7F6F3", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)", backgroundAttachment: "fixed" } as CSSProperties}>
                {" "}
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #3A3D44" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                        {t.k428}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                      {t.k61}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--twoCols)" as any), alignItems: "start", gap: "20px 48px", marginTop: "clamp(36px,4.4vw,68px)" } as CSSProperties}>
                    {" "}
                    <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,6.6vw,104px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase" } as CSSProperties}>
                      {t.k62}
                      <br />
                      <span style={{ color: "#FF4002" } as CSSProperties}>
                        {t.k63}
                      </span>
                    </h2>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--formatCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,64px)", background: "#3A3D44", outline: "1px solid #3A3D44" } as CSSProperties}>
                    {" "}
                    <div className="fa-hc3889f8" data-reveal="" data-delay="0" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                      <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                        {t.k420}
                      </span>
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                        {t.k65}
                      </h3>
                      <p style={{ marginTop: "auto", maxWidth: "34ch", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                        {t.k66}
                      </p>
                    </div>
                    {" "}
                    <div className="fa-hc3889f8" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                      <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                        {t.k422}
                      </span>
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                        {t.k409}
                      </h3>
                      <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                        {t.k67}
                      </p>
                    </div>
                    {" "}
                    <div className="fa-hc3889f8" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                      <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                        {t.k428}
                      </span>
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                        {t.k68}
                      </h3>
                      <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                        {t.k69}
                      </p>
                    </div>
                    {" "}
                    <div className="fa-hc3889f8" data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                      <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                        {t.k429}
                      </span>
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                        {t.k70}
                      </h3>
                      <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                        {t.k430}
                      </p>
                    </div>
                    {" "}
                    <a className="fa-hc3889f8" href={lp("/award")} data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                      <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                        {t.k431}
                      </span>
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                        {t.k432}
                      </h3>
                      <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                        {t.k433}
                      </p>
                      <span aria-hidden="true" style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", color: "#FF4002" } as CSSProperties}>
                        {t.k416}
                      </span>
                    </a>
                    {" "}
                    <div className="fa-hc3889f8" data-reveal="" data-delay="300" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                      <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                        {t.k434}
                      </span>
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                        {t.k310}
                      </h3>
                      <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                        {t.k435}
                      </p>
                    </div>
                    {" "}
                    <div className="fa-hc3889f8" data-reveal="" data-delay="360" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                      <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                        {t.k436}
                      </span>
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                        {t.k437}
                      </h3>
                      <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                        {t.k311}
                      </p>
                    </div>
                    {" "}
                    <div className="fa-hc3889f8" data-reveal="" data-delay="420" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                      <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                        {t.k438}
                      </span>
                      <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                        {t.k74}
                      </h3>
                      <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                        {t.k439}
                      </p>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </section>
              {" "}
              <section id="forum" data-screen-label="Форум 2026" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,144px) 0", backgroundColor: "#FF4002", color: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", top: "-10%", left: "-10%", right: "-10%", bottom: "-10%", pointerEvents: "none", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.14) 0 1px,transparent 1px 96px)", animation: "faPan 22s linear infinite" } as CSSProperties}>
                </div>
                {" "}
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,.45)" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#16181D" } as CSSProperties}>
                        {t.k429}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#16181D", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(247,246,243,.92)" } as CSSProperties}>
                      {t.k76}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "center", gap: "12px", marginTop: "clamp(28px,3.4vw,48px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
                    {" "}
                    <span style={{ width: "8px", height: "8px", background: "#16181D", animation: "faPulse 2s ease-in-out infinite" } as CSSProperties}>
                    </span>
                    {" "}
                    <span>
                      {t.k77}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h2 data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(20px,2.4vw,32px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,8.2vw,132px)", lineHeight: ".86", letterSpacing: "-.05em", textTransform: "uppercase", maxWidth: "15ch" } as CSSProperties}>
                    {t.k401}
                    {" "}
                    <span style={{ color: "#16181D" } as CSSProperties}>
                      {t.k440}
                    </span>
                  </h2>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "36px 56px", marginTop: "clamp(36px,4.4vw,64px)" } as CSSProperties}>
                    {" "}
                    <p data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", flex: "1 1 440px", maxWidth: "48ch", fontSize: "clamp(16px,1.35vw,22px)", lineHeight: "1.5" } as CSSProperties}>
                      {t.k441}
                    </p>
                    {" "}
                    <div data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "28px 44px" } as CSSProperties}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "14px" } as CSSProperties}>
                        <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(48px,5.4vw,84px)", lineHeight: ".9", letterSpacing: "-.05em" } as CSSProperties}>
                          <span data-count="250">
                            {t.k442}
                          </span>
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(247,246,243,.92)" } as CSSProperties}>
                          {t.k79}
                        </span>
                      </div>
                      {" "}
                      <a className="fa-h7189809" href={lp("/forum")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: "20px", padding: "19px 32px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                        {t.k81}
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
              <section id="base" data-screen-label="Основа" style={{ padding: "clamp(72px,10vw,168px) 0", backgroundColor: "#F7F6F3" } as CSSProperties}>
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
                      {t.k82}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,68px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,5.4vw,86px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                    {t.k443}
                  </h2>
                  {" "}
                  <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(36px,4.4vw,64px)", paddingTop: "24px", borderTop: "2px solid #16181D" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px 40px" } as CSSProperties}>
                      {" "}
                      <img src="/img/d65b278e9b.png" alt={t.k444} style={{ height: "32px", width: "auto", display: "block", filter: "brightness(0) invert(.14)" } as CSSProperties} />
                      {" "}
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k84}
                      </span>
                      {" "}
                    </div>
                    {" "}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "1px", marginTop: "clamp(26px,3vw,40px)", background: "#DCDAD4", outline: "1px solid #DCDAD4" } as CSSProperties}>
                      {" "}
                      <div className="fa-h6d4f325" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                        <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                          <span data-count="10">
                            {t.k445}
                          </span>
                        </div>
                        <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k85}
                        </div>
                      </div>
                      {" "}
                      <div className="fa-h6d4f325" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                        <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                          <span data-count="5">
                            {t.k446}
                          </span>
                        </div>
                        <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k86}
                        </div>
                      </div>
                      {" "}
                      <div className="fa-h6d4f325" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                        <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                          <span data-count="100" data-suffix="+">
                            {t.k447}
                          </span>
                        </div>
                        <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k87}
                        </div>
                      </div>
                      {" "}
                      <div className="fa-h6d4f325" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                        <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                          <span data-count="4">
                            {t.k448}
                          </span>
                        </div>
                        <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k88}
                        </div>
                      </div>
                      {" "}
                      <div className="fa-h6d4f325" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                        <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                          <span data-count="800" data-suffix="+">
                            {t.k449}
                          </span>
                        </div>
                        <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                          {t.k89}
                        </div>
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
                      <img src="/img/d7f7cfad4d.png" alt={t.k450} style={{ height: "26px", width: "auto", display: "block", filter: "brightness(0) invert(.14)" } as CSSProperties} />
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
                        <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                          <span data-count="20">
                            {t.k451}
                          </span>
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                          {t.k85}
                        </div>
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
              <section id="join" data-screen-label="Участие" style={{ padding: "0 0 clamp(72px,10vw,168px)", backgroundColor: "#F7F6F3" } as CSSProperties}>
                {" "}
                <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                        {t.k434}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                      {t.k92}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,68px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,5.4vw,86px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                    {t.k452}
                  </h2>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: ("var(--twoCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,64px)", background: "#DCDAD4", outline: "1px solid #DCDAD4" } as CSSProperties}>
                    {" "}
                    <div data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", padding: "clamp(28px,3vw,48px)", background: "#16181D", color: "#F7F6F3" } as CSSProperties}>
                      {" "}
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,4.6vw,72px)", lineHeight: ".92", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                        {t.k453}
                      </div>
                      {" "}
                      <h3 style={{ margin: "clamp(16px,1.8vw,24px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.16", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k53}
                      </h3>
                      {" "}
                      <div style={{ margin: "14px 0 clamp(32px,4vw,56px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                        {t.k94}
                      </div>
                      {" "}
                      <a className="fa-h011a976" href="#apply" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "auto", padding: "18px 34px", background: "#FF4002", color: "#F7F6F3", border: "1px solid #FF4002", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                        {t.k38}
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                          {t.k416}
                        </span>
                      </a>
                      {" "}
                    </div>
                    {" "}
                    <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", padding: "clamp(28px,3vw,48px)", background: "#F7F6F3", color: "#16181D" } as CSSProperties}>
                      {" "}
                      <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,4.6vw,72px)", lineHeight: ".92", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                        {t.k237}
                      </div>
                      {" "}
                      <h3 style={{ margin: "clamp(16px,1.8vw,24px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.16", letterSpacing: "-.02em" } as CSSProperties}>
                        {t.k426}
                      </h3>
                      {" "}
                      <div style={{ margin: "14px 0 clamp(32px,4vw,56px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                        {t.k94}
                      </div>
                      {" "}
                      <a className="fa-h6d4f325" href="#apply" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "auto", padding: "18px 34px", background: "transparent", color: "#16181D", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                        {t.k104}
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
              <section id="apply" data-screen-label="Вступление" style={{ position: "relative", overflow: "hidden", padding: "clamp(72px,9vw,140px) 0 clamp(64px,8vw,120px)", backgroundColor: "#16181D", color: "#F7F6F3", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 80px)" } as CSSProperties}>
                {" "}
                <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", pointerEvents: "none", overflow: "hidden", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <svg viewBox="0 0 1400 200" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "auto" } as CSSProperties}>
                    {" "}
                    <text x="0" y="170" font-family="Montserrat,Manrope,sans-serif" font-weight="900" letter-spacing="-8" font-size="180" fill="rgba(255,64,2,.18)" textLength="1400" lengthAdjust="spacingAndGlyphs">
                      {t.k454}
                    </text>
                    {" "}
                  </svg>
                  {" "}
                </div>
                {" "}
                <div style={{ position: "relative", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)" } as CSSProperties}>
                  {" "}
                  <div data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "24px", paddingBottom: "16px", borderBottom: "1px solid #3A3D44" } as CSSProperties}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".08em", color: "#FF4002" } as CSSProperties}>
                        {t.k436}
                      </span>
                      <span data-draw="" style={{ width: "40px", height: "1px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties}>
                      </span>
                    </div>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                      {t.k20}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,64px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,5.8vw,92px)", lineHeight: ".92", letterSpacing: "-.05em", textTransform: "uppercase", maxWidth: "20ch" } as CSSProperties}>
                    {t.k11}
                    <br />
                    {t.k105}
                    {" "}
                    <span style={{ color: "#FF4002" } as CSSProperties}>
                      {t.k106}
                    </span>
                  </h2>
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
                          <input className="fa-hd277039" id="fa-role" name="role" type="text" autoComplete="organization-title" placeholder={t.k312} onInput={onRole} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "transparent", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", transition: "border-color 200ms ease" } as CSSProperties} />
                          <div style={{ minHeight: "16px", marginTop: "8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".06em", color: "#FF4002" } as CSSProperties}>
                            {errRole}
                          </div>
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
                      <button className="fa-h230b4f3" type="submit" style={{ marginTop: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "18px 36px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", cursor: "pointer", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
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
                    <img src="/img/93a4df84e5.png" alt={t.k401} style={{ height: "92px", width: "auto", display: "block" } as CSSProperties} />
                    {" "}
                    <p style={{ margin: "24px 0 0", fontSize: "15px", lineHeight: "1.6", color: "#6E7278", maxWidth: "32ch" } as CSSProperties}>
                      {t.k456}
                    </p>
                    {" "}
                  </div>
                  {" "}
                  <nav aria-label={t.k125} style={{ flex: "0 1 168px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
                    {" "}
                    <a className="fa-hc3889f8" href="#manifest" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k7}
                    </a>
                    {" "}
                    <a className="fa-hc3889f8" href="#formats" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k8}
                    </a>
                    {" "}
                    <a className="fa-hc3889f8" href="#join" style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k11}
                    </a>
                    {" "}
                    <a className="fa-hc3889f8" href={lp("/forum")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k9}
                    </a>
                    {" "}
                    <a className="fa-hc3889f8" href={lp("/award")} style={{ transition: "color 200ms ease" } as CSSProperties}>
                      {t.k10}
                    </a>
                    {" "}
                  </nav>
                  {" "}
                  <div style={{ flex: "0 1 280px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
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
                      <span style={{ color: "#8E8B83" } as CSSProperties}>
                        {t.k460}
                      </span>
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" } as CSSProperties}>
                      <a className="fa-hc3889f8" href="tel:+37368059311" style={{ transition: "color 200ms ease" } as CSSProperties}>
                        {t.k461}
                      </a>
                      <span style={{ color: "#8E8B83" } as CSSProperties}>
                        {t.k462}
                      </span>
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div className="fa-social" style={{ flex: "0 1 160px", color: "#5C5F66" } as CSSProperties}>
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
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 32px", marginTop: "clamp(36px,4.4vw,56px)", paddingTop: "20px", borderTop: "1px solid #DCDAD4" } as CSSProperties}>
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    {t.k126}
                  </span>
                  {" "}
                  <img className="fa-hbb70728" src="/img/d65b278e9b.png" alt={t.k444} style={{ height: "22px", width: "auto", display: "block", filter: "brightness(0) invert(.4)", transition: "filter 200ms ease" } as CSSProperties} />
                  {" "}
                  <img className="fa-hbb70728" src="/img/d7f7cfad4d.png" alt={t.k450} style={{ height: "17px", width: "auto", display: "block", filter: "brightness(0) invert(.4)", transition: "filter 200ms ease" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px 32px", marginTop: "28px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E8B83" } as CSSProperties}>
                  {" "}
                  <div style={{ display: "flex", gap: "8px" } as CSSProperties}>
                    <a href={lhref("ro")} style={{ color: langColor("ro", "#16181D", "inherit") } as CSSProperties}>
                      {t.k402}
                    </a>
                    <span style={{ color: "#DCDAD4" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("ru")} style={{ color: langColor("ru", "#16181D", "inherit") } as CSSProperties}>
                      {t.k404}
                    </a>
                    <span style={{ color: "#DCDAD4" } as CSSProperties}>
                      {t.k403}
                    </span>
                    <a href={lhref("en")} style={{ color: langColor("en", "#16181D", "inherit") } as CSSProperties}>
                      {t.k405}
                    </a>
                  </div>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" } as CSSProperties}>
                    <span>
                      {t.k466}
                    </span>
                    <a className="fa-h6ae611c" href={lp("/privacy")} style={{ transition: "color 200ms ease" } as CSSProperties}>
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
