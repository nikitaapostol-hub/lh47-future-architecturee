'use client'

/* Community — ported from the original dc bundle.
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

type Props = { indexVisible?: boolean; bandMotion?: boolean }

export default function CommunityPage({ indexVisible = true, bandMotion = true }: Props) {

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
    if (!d.name.trim()) n.name = 'Укажите имя'
    if (!d.company.trim()) n.company = 'Укажите компанию'
    if (!d.role) n.role = 'Выберите роль'
    if (!EMAIL_RE.test(d.email.trim())) n.email = 'Проверьте адрес почты'
    if (d.phone.replace(/\D/g, '').length < 8) n.phone = 'Проверьте номер телефона'
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
            <nav aria-label="Основная навигация" style={{ marginLeft: "auto", minWidth: "0", display: ("var(--navDisplay)" as any), alignItems: "center", gap: "26px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
              {" "}
              <a className="fa-hb09baf5" href="#manifest" style={{ transition: "color 200ms ease" } as CSSProperties}>
                Позиция
              </a>
              {" "}
              <a className="fa-hb09baf5" href="#formats" style={{ transition: "color 200ms ease" } as CSSProperties}>
                Форматы
              </a>
              {" "}
              <a className="fa-hb09baf5" href="/forum" data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                Форум 2026
              </a>
              {" "}
              <a className="fa-hb09baf5" href="/award" data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                Премия
              </a>
              {" "}
              <a className="fa-hb09baf5" href="#join" style={{ transition: "color 200ms ease" } as CSSProperties}>
                Участие
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
            <a className="fa-h3635ec6" href="#apply" style={{ display: ("var(--navDisplay)" as any), flex: "0 0 auto", alignItems: "center", padding: "12px 22px", background: "#16181D", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "14px", lineHeight: "1.2", whiteSpace: "nowrap", border: "1px solid #16181D", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
              Вступить
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
              <a href="#manifest" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                Позиция
              </a>
              {" "}
              <a href="#formats" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                Форматы
              </a>
              {" "}
              <a href="/forum" data-page="" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                Форум 2026
              </a>
              {" "}
              <a href="/award" data-page="" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                Премия
              </a>
              {" "}
              <a href="#join" onClick={closeMenu} style={{ padding: "16px 0", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
                Участие
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
                Вступить
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
        <nav data-rail="" aria-label="Разделы страницы" style={{ position: "fixed", left: "26px", top: "50%", transform: "translateY(-50%)", zIndex: "40", display: ("var(--railDisplay)" as any), flexDirection: "column", gap: "13px", opacity: "0", transition: "opacity 300ms ease", pointerEvents: "none", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase" } as CSSProperties}>
          {" "}
          <a href="#manifest" data-rail-item="" data-target="manifest" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            Позиция
          </a>
          {" "}
          <a href="#members" data-rail-item="" data-target="members" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            Состав
          </a>
          {" "}
          <a href="#formats" data-rail-item="" data-target="formats" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            Форматы
          </a>
          {" "}
          <a href="#forum" data-rail-item="" data-target="forum" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            Форум 2026
          </a>
          {" "}
          <a href="#base" data-rail-item="" data-target="base" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            Основа
          </a>
          {" "}
          <a href="#join" data-rail-item="" data-target="join" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            Участие
          </a>
          {" "}
          <a href="#apply" data-rail-item="" data-target="apply" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#5C5F66", pointerEvents: "auto" } as CSSProperties}>
            <span data-rail-dot="" style={{ width: "6px", height: "6px", background: "transparent", flex: "0 0 6px" } as CSSProperties} />
            Вступление
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
            <div aria-hidden="true" data-anim="" style={{ position: "absolute", inset: "-64px", pointerEvents: "none", backgroundImage: "radial-gradient(rgba(247,246,243,.09) 1px,transparent 1px)", backgroundSize: "80px 80px", animation: "faDrift 30s linear infinite" } as CSSProperties} />
            {" "}
            <div aria-hidden="true" data-parallax="0.05" style={{ position: "absolute", right: "clamp(-40px,-2vw,0px)", top: "clamp(96px,16vh,200px)", pointerEvents: "none", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(140px,20vw,300px)", lineHeight: ".76", letterSpacing: "-.06em", color: "#1D2027" } as CSSProperties}>
              FA
            </div>
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "44vh", pointerEvents: "none", background: "linear-gradient(to top,rgba(22,24,29,.96),rgba(22,24,29,0))" } as CSSProperties} />
            {" "}
            <div aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none", overflow: "hidden" } as CSSProperties}>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "7%", top: "15%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(16px,2.14vw,30px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 700ms both,faFloatA 27s ease-in-out 1600ms infinite" } as CSSProperties}>
                Архитекторы
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "33%", top: "8%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.43vw,20px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 820ms both,faFloatB 31s ease-in-out 1720ms infinite" } as CSSProperties}>
                Дизайнеры
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "60%", top: "13%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(18px,2.43vw,34px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 940ms both,faFloatC 24s ease-in-out 1840ms infinite" } as CSSProperties}>
                Девелоперы
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "82%", top: "23%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.57vw,22px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 1060ms both,faFloatA 33s ease-in-out 1960ms infinite" } as CSSProperties}>
                Инвесторы
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "44%", top: "27%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.29vw,18px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 1180ms both,faFloatB 28s ease-in-out 2080ms infinite" } as CSSProperties}>
                Производители
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "70%", top: "37%", display: "block", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(14px,1.86vw,26px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 1300ms both,faFloatC 30s ease-in-out 2200ms infinite" } as CSSProperties}>
                Поставщики
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "20%", top: "33%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.14vw,16px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 1420ms both,faFloatA 25s ease-in-out 2320ms infinite" } as CSSProperties}>
                Бюро и студии
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "54%", top: "47%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.43vw,20px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 1540ms both,faFloatB 34s ease-in-out 2440ms infinite" } as CSSProperties}>
                Подрядчики
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "64%", top: "60%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.07vw,15px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 1660ms both,faFloatC 29s ease-in-out 2560ms infinite" } as CSSProperties}>
                Управляющие компании
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "11%", top: "45%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.57vw,22px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 1780ms both,faFloatA 26s ease-in-out 2680ms infinite" } as CSSProperties}>
                Город
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "38%", top: "57%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.21vw,17px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 1900ms both,faFloatB 32s ease-in-out 2800ms infinite" } as CSSProperties}>
                Медиа
              </span>
              {" "}
              <span data-anim="" style={{ position: "absolute", left: "88%", top: "50%", display: ("var(--wordsExtra)" as any), fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(12px,1.14vw,16px)", letterSpacing: "-.02em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(247,246,243,.17)", animation: "faFade 900ms ease 2020ms both,faFloatC 27s ease-in-out 2920ms infinite" } as CSSProperties}>
                Производство
              </span>
              {" "}
            </div>
            {" "}
            <div style={{ position: "relative", width: "100%", maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)", display: "flex", flexDirection: "column", gap: "clamp(22px,2.8vw,40px)" } as CSSProperties}>
              {" "}
              <div data-anim="" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px 32px", paddingBottom: "14px", borderBottom: "1px solid rgba(247,246,243,.34)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(12px,.9vw,12px)", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.86)", animation: "faFade 700ms ease 120ms both" } as CSSProperties}>
                {" "}
                <span>
                  Профессиональное сообщество · Молдова
                </span>
                {" "}
                <span>
                  Est. 2026 · Кишинёв
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
                  Сообщество
                </span>
                {" "}
                <span style={{ flex: "1 1 120px", height: "1px", background: "rgba(247,246,243,.34)" } as CSSProperties} />
                {" "}
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(12px,.9vw,12px)", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.78)" } as CSSProperties}>
                  Вступление по заявке
                </span>
                {" "}
              </div>
              {" "}
              <div data-anim="" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "28px 56px", animation: "faFade 800ms ease 620ms both" } as CSSProperties}>
                {" "}
                <p style={{ flex: "1 1 420px", maxWidth: "46ch", fontSize: "clamp(17px,1.5vw,25px)", lineHeight: "1.42", letterSpacing: "-.012em", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                  Архитектура, дизайн и девелопмент Молдовы за одним столом. Закрытый круг практиков, которые формируют рынок.
                </p>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" } as CSSProperties}>
                  {" "}
                  <a className="fa-hf42e924" href="#apply" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "19px 38px", background: "#F7F6F3", color: "#16181D", border: "1px solid #F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                    Подать заявку
                  </a>
                  {" "}
                  <a className="fa-hf2ea20d" href="/forum" data-page="" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "19px 38px", border: "1px solid rgba(247,246,243,.6)", color: "#F7F6F3", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                    Форум 2026
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" } as CSSProperties}>
                      →
                    </span>
                  </a>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "0", marginTop: "clamp(6px,1vw,16px)" } as CSSProperties}>
                {" "}
                <div style={{ padding: "16px 20px 12px 0", borderTop: "2px solid #FF4002", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(247,246,243,.86)" } as CSSProperties}>
                  Архитектура
                </div>
                {" "}
                <div style={{ padding: "16px 20px 12px 0", borderTop: "1px solid rgba(247,246,243,.34)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(247,246,243,.72)" } as CSSProperties}>
                  Девелопмент
                </div>
                {" "}
                <div style={{ padding: "16px 20px 12px 0", borderTop: "1px solid rgba(247,246,243,.34)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(247,246,243,.72)" } as CSSProperties}>
                  Производство
                </div>
                {" "}
                <div style={{ padding: "16px 20px 12px 0", borderTop: "1px solid rgba(247,246,243,.34)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(247,246,243,.72)" } as CSSProperties}>
                  Инвестиции
                </div>
                {" "}
              </div>
              {" "}
              <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,246,243,.7)" } as CSSProperties}>
                {" "}
                <span data-anim="" style={{ display: "block", width: "1px", height: "32px", background: "#FF4002", animation: "faScroll 2.6s ease-in-out infinite" } as CSSProperties} />
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
          <div aria-hidden="true" style={{ overflow: "hidden", background: "#FF4002", padding: "clamp(14px,1.8vw,26px) 0" } as CSSProperties}>
            {" "}
            <div className="fa-h932431b" data-marquee="" style={{ display: "flex", width: "max-content", animation: "faMarquee 64s linear infinite", animationPlayState: bandPlay, fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(26px,4.4vw,68px)", lineHeight: "1", letterSpacing: "-.04em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: ".28em", paddingRight: ".28em" } as CSSProperties}>
                <span>
                  Архитектура
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Девелопмент
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Производство
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Инвестиции
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Закрытый круг
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
              </div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: ".28em", paddingRight: ".28em" } as CSSProperties}>
                <span>
                  Архитектура
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Девелопмент
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Производство
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Инвестиции
                </span>
                <span style={{ color: "#F7F6F3" } as CSSProperties}>
                  ◆
                </span>
                <span>
                  Закрытый круг
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
          <nav aria-label="Разделы" style={{ display: indexDisplay, background: "#F7F6F3", borderBottom: "1px solid #DCDAD4" } as CSSProperties}>
            {" "}
            <div style={{ maxWidth: "1720px", margin: "0 auto", padding: "0 clamp(20px,4.8vw,108px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))" } as CSSProperties}>
              {" "}
              <a className="fa-h3bf4555" href="#manifest" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#FF4002" } as CSSProperties}>
                  01
                </span>
                Позиция
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#members" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  02
                </span>
                Состав
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#formats" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  03
                </span>
                Форматы
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#forum" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  04
                </span>
                Форум 2026
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#base" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  05
                </span>
                Основа
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#join" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  06
                </span>
                Участие
              </a>
              {" "}
              <a className="fa-h3bf4555" href="#apply" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 16px 18px 0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278", borderTop: "2px solid transparent", transition: "color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                <span style={{ color: "#C9C6BE" } as CSSProperties}>
                  07
                </span>
                Вступление
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
                  Позиция
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(40px,5vw,84px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(34px,7.6vw,124px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase", textWrap: "initial" } as CSSProperties}>
                Архитектура
                <br />
                больше не работает
                <br />
                <span style={{ color: "#FF4002" } as CSSProperties}>
                  в одиночку
                </span>
              </h2>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "36px 8%", marginTop: "clamp(44px,5.4vw,88px)", paddingTop: "28px", borderTop: "1px solid #DCDAD4" } as CSSProperties}>
                {" "}
                <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", flex: "1 1 420px", maxWidth: "54ch", fontSize: "clamp(17px,1.4vw,23px)", lineHeight: "1.5", color: "#4A4D53" } as CSSProperties}>
                  Сильный проект рождается на пересечении девелопмента, инвестиций, производства и городской стратегии. Сообщество соединяет тех, кто раньше решал задачи порознь.
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
                    Стороны
                    <br />
                    одного проекта
                    <br />
                    <span style={{ color: "#16181D" } as CSSProperties}>
                      за одним столом
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
                  Состав
                </span>
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "20px 48px", marginTop: "clamp(36px,4.4vw,68px)" } as CSSProperties}>
                {" "}
                <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,5.4vw,86px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase", textWrap: "initial" } as CSSProperties}>
                  Четыре стороны
                  <br />
                  одного проекта
                </h2>
                {" "}
                <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", maxWidth: "38ch", fontSize: "clamp(15px,1.15vw,18px)", lineHeight: "1.55", color: "#5C5F66" } as CSSProperties}>
                  Каждая категория отвечает за свой участок цепочки. Сообщество замыкает её целиком.
                </p>
                {" "}
              </div>
              {" "}
              <div style={{ marginTop: "clamp(36px,4.4vw,64px)", borderTop: "2px solid #16181D" } as CSSProperties}>
                {" "}
                <div className="fa-h52a5cac" data-reveal="" style={{ opacity: "0", transform: "translateY(16px)", position: "relative", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 40px", padding: "clamp(22px,2.6vw,40px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 44px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#FF4002" } as CSSProperties}>
                    01
                  </span>
                  {" "}
                  <h3 style={{ flex: "1 1 340px", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.8vw,44px)", lineHeight: "1.06", letterSpacing: "-.03em" } as CSSProperties}>
                    Архитекторы и дизайнеры
                  </h3>
                  {" "}
                  <p style={{ flex: "1 1 260px", maxWidth: "34ch", fontSize: "16px", lineHeight: "1.5", color: "#5C5F66" } as CSSProperties}>
                    Бюро, студии и независимая практика
                  </p>
                  {" "}
                  <div data-draw="" data-delay="180" aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "2px", background: "#FF4002", transform: "scaleX(0)", transformOrigin: "left" } as CSSProperties} />
                  {" "}
                </div>
                {" "}
                <div className="fa-h52a5cac" data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 40px", padding: "clamp(22px,2.6vw,40px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 44px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                    02
                  </span>
                  {" "}
                  <h3 style={{ flex: "1 1 340px", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.8vw,44px)", lineHeight: "1.06", letterSpacing: "-.03em" } as CSSProperties}>
                    Девелоперы и застройщики
                  </h3>
                  {" "}
                  <p style={{ flex: "1 1 260px", maxWidth: "34ch", fontSize: "16px", lineHeight: "1.5", color: "#5C5F66" } as CSSProperties}>
                    Те, кто запускает и ведёт проекты
                  </p>
                  {" "}
                </div>
                {" "}
                <div className="fa-h52a5cac" data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 40px", padding: "clamp(22px,2.6vw,40px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 44px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                    03
                  </span>
                  {" "}
                  <h3 style={{ flex: "1 1 340px", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.8vw,44px)", lineHeight: "1.06", letterSpacing: "-.03em" } as CSSProperties}>
                    Производители и поставщики
                  </h3>
                  {" "}
                  <p style={{ flex: "1 1 260px", maxWidth: "34ch", fontSize: "16px", lineHeight: "1.5", color: "#5C5F66" } as CSSProperties}>
                    Материалы, инженерия, оборудование
                  </p>
                  {" "}
                </div>
                {" "}
                <div className="fa-h52a5cac" data-reveal="" data-delay="180" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 40px", padding: "clamp(22px,2.6vw,40px) 0", borderBottom: "1px solid #DCDAD4", transition: "padding 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ flex: "0 0 44px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: ".1em", color: "#8E8B83" } as CSSProperties}>
                    04
                  </span>
                  {" "}
                  <h3 style={{ flex: "1 1 340px", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(22px,2.8vw,44px)", lineHeight: "1.06", letterSpacing: "-.03em" } as CSSProperties}>
                    Инвесторы и бизнес
                  </h3>
                  {" "}
                  <p style={{ flex: "1 1 260px", maxWidth: "34ch", fontSize: "16px", lineHeight: "1.5", color: "#5C5F66" } as CSSProperties}>
                    Капитал и владельцы площадок
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
                  Инструменты
                </span>
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "20px 48px", marginTop: "clamp(36px,4.4vw,68px)" } as CSSProperties}>
                {" "}
                <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,6.6vw,104px)", lineHeight: ".9", letterSpacing: "-.05em", textTransform: "uppercase", textWrap: "initial" } as CSSProperties}>
                  Семь рабочих
                  <br />
                  <span style={{ color: "#FF4002" } as CSSProperties}>
                    форматов
                  </span>
                </h2>
                {" "}
                <p data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", maxWidth: "38ch", fontSize: "clamp(15px,1.15vw,18px)", lineHeight: "1.6", color: "#B9BBC0" } as CSSProperties}>
                  Только то, что уже работает. Каждый формат ведёт к конкретному контакту или проекту.
                </p>
                {" "}
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: ("var(--formatCols)" as any), gap: "1px", marginTop: "clamp(36px,4.4vw,64px)", background: "#3A3D44", outline: "1px solid #3A3D44" } as CSSProperties}>
                {" "}
                <div className="fa-h80081ee" data-reveal="" data-delay="0" style={{ opacity: "0", transform: "translateY(16px)", gridColumn: ("var(--forumSpan)" as any), display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    01
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(26px,2.8vw,44px)", lineHeight: "1.04", letterSpacing: "-.03em" } as CSSProperties}>
                    Форум
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", maxWidth: "34ch", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    Главное событие года. 250 участников, 3 декабря 2026.
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
                    Двенадцать встреч в год. Разбор реального проекта в узком составе.
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
                    Партнёрская программа
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    Производитель показывает материал проектировщику до выхода на рынок.
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
                    Каталог участников
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    Подрядчик находится за один вопрос, а не за месяц поиска.
                  </p>
                  {" "}
                </div>
                {" "}
                <a className="fa-h80081ee" href="/award" data-page="" data-reveal="" data-delay="240" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexDirection: "column", gap: "16px", minHeight: "clamp(184px,13vw,236px)", padding: "clamp(20px,2vw,30px)", background: "#16181D", transition: "color 260ms ease" } as CSSProperties}>
                  {" "}
                  <span style={{ alignSelf: "flex-end", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", color: "#6E7278" } as CSSProperties}>
                    05
                  </span>
                  {" "}
                  <h3 style={{ margin: "0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "800", fontSize: "clamp(19px,1.7vw,26px)", lineHeight: "1.1", letterSpacing: "-.025em" } as CSSProperties}>
                    Премия
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    Раз в год рынок называет вслух лучшие проекты. Заявки и номинации — на странице премии.
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
                    Медиа
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    Реализованный проект выходит журналом, интервью и подкастом.
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
                    Поездки
                  </h3>
                  {" "}
                  <p style={{ marginTop: "auto", fontSize: "15px", lineHeight: "1.55", color: "#8E9198" } as CSSProperties}>
                    Фабрика, биеннале, объект. Составом сообщества.
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
                  Главное событие
                </span>
                {" "}
              </div>
              {" "}
              <div data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", alignItems: "center", gap: "12px", marginTop: "clamp(28px,3.4vw,48px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "clamp(12px,.9vw,12px)", letterSpacing: ".14em", textTransform: "uppercase", color: "#16181D" } as CSSProperties}>
                {" "}
                <span data-pulse="" style={{ width: "8px", height: "8px", background: "#16181D", animation: "faPulse 2s ease-in-out infinite" } as CSSProperties} />
                {" "}
                <span>
                  Кишинёв · 3 декабря 2026 · по приглашению
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
                  Один день, в котором инвестор, девелопер, архитектор и производитель принимают решения за одним столом.
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
                      участников
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "14px" } as CSSProperties}>
                    {" "}
                    <span style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(48px,5.4vw,84px)", lineHeight: ".9", letterSpacing: "-.05em" } as CSSProperties}>
                      <span data-count="4">
                        4
                      </span>
                    </span>
                    {" "}
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(247,246,243,.92)" } as CSSProperties}>
                      направления
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <a className="fa-hf2ea20d" href="/forum" data-page="" style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: "20px", padding: "19px 32px", background: "#16181D", color: "#F7F6F3", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "15px", lineHeight: "1.2", transition: "background 220ms ease,color 220ms ease,border-color 220ms ease,transform 220ms ease" } as CSSProperties}>
                    Страница форума
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
                  Основание
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,68px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,5.4vw,86px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                Кем создано сообщество
              </h2>
              {" "}
              <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", marginTop: "clamp(36px,4.4vw,64px)", paddingTop: "24px", borderTop: "2px solid #16181D" } as CSSProperties}>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px 40px" } as CSSProperties}>
                  {" "}
                  <img src="/img/d65b278e9b.png" alt="LH47 arch." style={{ height: "32px", width: "auto", display: "block", filter: "brightness(0) invert(.14)" } as CSSProperties} />
                  {" "}
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    Архитектурное бюро
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
                      лет
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
                      офисов
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
                      специалистов
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
                      страны
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div className="fa-hea007e6" style={{ padding: "clamp(20px,2vw,28px)", background: "#F7F6F3", transition: "background 260ms ease,color 260ms ease" } as CSSProperties}>
                    {" "}
                    <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(38px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-.045em" } as CSSProperties}>
                      <span data-count="200" data-suffix="+">
                        200+
                      </span>
                    </div>
                    {" "}
                    <div style={{ marginTop: "12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".62" } as CSSProperties}>
                      реализованных проектов
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
                    Медиа-партнёр
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
                      лет
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <p style={{ flex: "1 1 380px", maxWidth: "44ch", fontSize: "16px", lineHeight: "1.6", color: "#5C5F66" } as CSSProperties}>
                    Медиа об архитектуре и интерьере. Публикации проектов участников сообщества.
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
                  Форматы участия
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,68px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(30px,5.4vw,86px)", lineHeight: ".94", letterSpacing: "-.045em", textTransform: "uppercase" } as CSSProperties}>
                Два способа быть внутри
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
                    Архитекторы и дизайнеры
                  </h3>
                  {" "}
                  <div style={{ minHeight: "32px", marginTop: "14px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                    Условия участия – по запросу
                  </div>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "clamp(20px,2.4vw,30px) 0 0", padding: "0", display: "flex", flexDirection: "column", fontSize: "16px", lineHeight: "1.5", color: "#B9BBC0" } as CSSProperties}>
                    {" "}
                    <li className="fa-hf6acb64" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                        01
                      </span>
                      <span>
                        Профиль в каталоге участников
                      </span>
                    </li>
                    {" "}
                    <li className="fa-hf6acb64" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                        02
                      </span>
                      <span>
                        Закрытые встречи ArchiMinds
                      </span>
                    </li>
                    {" "}
                    <li className="fa-hf6acb64" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                        03
                      </span>
                      <span>
                        Участие в форуме без взноса
                      </span>
                    </li>
                    {" "}
                    <li className="fa-hf6acb64" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #3A3D44", borderBottom: "1px solid #3A3D44", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E9198" } as CSSProperties}>
                        04
                      </span>
                      <span>
                        Прямой контакт с производителями
                      </span>
                    </li>
                    {" "}
                  </ul>
                  {" "}
                  <a className="fa-h7eab1cf" href="#apply" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "auto", padding: "18px 34px", background: "#FF4002", color: "#F7F6F3", border: "1px solid #FF4002", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease,border-color 200ms ease" } as CSSProperties}>
                    Подать заявку
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
                    Производители, девелоперы, бренды
                  </h3>
                  {" "}
                  <div style={{ minHeight: "32px", marginTop: "14px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                    Условия участия – по запросу
                  </div>
                  {" "}
                  <ul style={{ listStyle: "none", margin: "clamp(20px,2.4vw,30px) 0 0", padding: "0", display: "flex", flexDirection: "column", fontSize: "16px", lineHeight: "1.5", color: "#5C5F66" } as CSSProperties}>
                    {" "}
                    <li className="fa-h112782f" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #DCDAD4", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8B83" } as CSSProperties}>
                        01
                      </span>
                      <span>
                        Доступ к бюро и студиям напрямую
                      </span>
                    </li>
                    {" "}
                    <li className="fa-h112782f" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #DCDAD4", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8B83" } as CSSProperties}>
                        02
                      </span>
                      <span>
                        Участие в форуме и премии
                      </span>
                    </li>
                    {" "}
                    <li className="fa-h112782f" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #DCDAD4", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8B83" } as CSSProperties}>
                        03
                      </span>
                      <span>
                        Совместные мероприятия и разборы
                      </span>
                    </li>
                    {" "}
                    <li className="fa-h112782f" style={{ display: "flex", gap: "16px", padding: "15px 0", borderTop: "1px solid #DCDAD4", borderBottom: "1px solid #DCDAD4", transition: "color 200ms ease,transform 200ms ease" } as CSSProperties}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8B83" } as CSSProperties}>
                        04
                      </span>
                      <span>
                        Публикация в InStyle Home
                      </span>
                    </li>
                    {" "}
                  </ul>
                  {" "}
                  <a className="fa-hea007e6" href="#apply" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "auto", padding: "18px 34px", background: "transparent", color: "#16181D", border: "1px solid #16181D", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "600", fontSize: "15px", lineHeight: "1.2", whiteSpace: "nowrap", transition: "background 200ms ease,color 200ms ease" } as CSSProperties}>
                    Запросить условия
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
            <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "-2%", pointerEvents: "none", overflow: "hidden" } as CSSProperties}>
              {" "}
              <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "min(22vw,300px)", lineHeight: ".78", letterSpacing: "-.06em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(255,64,2,.18)", paddingLeft: "clamp(20px,4.8vw,108px)" } as CSSProperties}>
                Сообщество
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
                  Вступление
                </span>
                {" "}
              </div>
              {" "}
              <h2 data-reveal="" data-delay="60" style={{ opacity: "0", transform: "translateY(16px)", margin: "clamp(36px,4.4vw,64px) 0 0", fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "900", fontSize: "clamp(32px,5.8vw,92px)", lineHeight: ".92", letterSpacing: "-.05em", textTransform: "uppercase", maxWidth: "20ch", textWrap: "initial" } as CSSProperties}>
                Вступление
                <br />
                по заявке и{" "}
                <span style={{ color: "#FF4002" } as CSSProperties}>
                  модерации
                </span>
              </h2>
              {" "}
              <div data-reveal="" data-delay="120" style={{ opacity: "0", transform: "translateY(16px)", display: "flex", flexWrap: "wrap", gap: "10px 20px", marginTop: "clamp(24px,3vw,36px)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8E9198" } as CSSProperties}>
                {" "}
                <span>
                  01 Заявка
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  →
                </span>
                {" "}
                <span>
                  02 Модерация
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  →
                </span>
                {" "}
                <span>
                  03 Знакомство
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  →
                </span>
                {" "}
                <span>
                  04 Контакты
                </span>
                <span style={{ color: "#3A3D44" } as CSSProperties}>
                  →
                </span>
                {" "}
                <span style={{ color: "#FF4002" } as CSSProperties}>
                  05 Проекты
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
                        Имя
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
                        Компания
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
                        Роль
                      </label>
                      {" "}
                      <select className="fa-f0988020" id="fa-role" name="role" onChange={onRole} style={{ width: "100%", marginTop: "8px", padding: "12px 0", background: "#F7F6F3", border: "0", borderBottom: "1px solid #C9C6BE", color: "#16181D", fontSize: "16px", outline: "none", appearance: "none", borderRadius: "0", transition: "border-color 200ms ease" } as CSSProperties}>
                        {" "}
                        <option value="">
                          Выберите
                        </option>
                        {" "}
                        <option value="Архитектор или дизайнер">
                          Архитектор или дизайнер
                        </option>
                        {" "}
                        <option value="Девелопер или застройщик">
                          Девелопер или застройщик
                        </option>
                        {" "}
                        <option value="Производитель или поставщик">
                          Производитель или поставщик
                        </option>
                        {" "}
                        <option value="Инвестор или бизнес">
                          Инвестор или бизнес
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
                        Телефон
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
                <div style={{ marginTop: "clamp(36px,4.4vw,56px)", padding: "clamp(26px,3.2vw,48px)", background: "#F7F6F3", color: "#16181D", maxWidth: "65ch", boxShadow: "14px 14px 0 #FF4002" } as CSSProperties}>
                  {" "}
                  <div style={{ fontFamily: "Montserrat,Manrope,sans-serif", fontWeight: "700", fontSize: "clamp(20px,1.9vw,26px)" } as CSSProperties}>
                    Заявка отправлена
                  </div>
                  {" "}
                  <p style={{ margin: "16px 0 0", fontSize: "16px", lineHeight: "1.6", color: "#5C5F66" } as CSSProperties}>
                    Ответ придёт на указанную почту после модерации.
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
                  Профессиональное сообщество архитектуры, дизайна и девелопмента в Молдове
                </p>
                {" "}
              </div>
              {" "}
              <nav aria-label="Навигация в подвале" style={{ flex: "0 1 168px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
                {" "}
                <a className="fa-h80081ee" href="#manifest" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Позиция
                </a>
                {" "}
                <a className="fa-h80081ee" href="#formats" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Форматы
                </a>
                {" "}
                <a className="fa-h80081ee" href="#join" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Участие
                </a>
                {" "}
                <a className="fa-h80081ee" href="/forum" data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Форум 2026
                </a>
                {" "}
                <a className="fa-h80081ee" href="/award" data-page="" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Премия
                </a>
                {" "}
              </nav>
              {" "}
              <div style={{ flex: "0 1 240px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
                {" "}
                <a className="fa-h80081ee" href="mailto:join@futurearchitecture.md" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  join@futurearchitecture.md
                </a>
                {" "}
                <a className="fa-h80081ee" href="tel:+37368199951" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  (+373) 68 199 951
                </a>
                {" "}
                <a className="fa-h80081ee" href="tel:+37368059311" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  (+373) 68 059 311
                </a>
                {" "}
              </div>
              {" "}
              <div style={{ flex: "0 1 160px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "#5C5F66" } as CSSProperties}>
                {" "}
                <a className="fa-h80081ee" href="#" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Instagram
                </a>
                {" "}
                <a className="fa-h80081ee" href="#" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  Facebook
                </a>
                {" "}
                <a className="fa-h80081ee" href="#" style={{ transition: "color 200ms ease" } as CSSProperties}>
                  LinkedIn
                </a>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 32px", marginTop: "clamp(36px,4.4vw,56px)", paddingTop: "20px", borderTop: "1px solid #DCDAD4" } as CSSProperties}>
              {" "}
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6E7278" } as CSSProperties}>
                Партнёры
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
                <span>
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
                <a className="fa-hb09baf5" href="#" style={{ transition: "color 200ms ease" } as CSSProperties}>
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
