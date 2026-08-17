'use client'

/* Полоса над шапкой: приём заявок на премию. Закрывается — и больше не
   показывается в этой вкладке. Пока она видна, шапка сдвинута вниз
   (правило в globals.css). */
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { dict } from '@/i18n'
import { path } from '@/i18n/links'
import type { Lang } from '@/i18n/links'

export default function Notice({ lang }: { lang: Lang }) {
  const t = dict[lang]
  const [on, setOn] = useState(true)
  // форум — оранжевая страница, на ней полоса тёмная, иначе сливается
  const tone = /\/forum\/?$/.test(usePathname() || '') ? 'dark' : 'orange'

  useEffect(() => {
    try {
      if (sessionStorage.getItem('fa-notice') === 'off') setOn(false)
    } catch {}
  }, [])

  function close() {
    setOn(false)
    try {
      sessionStorage.setItem('fa-notice', 'off')
    } catch {}
  }

  return (
    <div className="fa-notice" data-tone={tone} data-on={on ? '1' : '0'}>
      <a className="fa-notice-link" href={path(lang, '/award') + '#apply'}>
        <span className="fa-notice-dot" aria-hidden="true" />
        <span className="fa-notice-text">{t.noticeTitle}</span>
        <span className="fa-notice-cta">
          {t.noticeCta} <span aria-hidden="true">→</span>
        </span>
      </a>
      <button type="button" className="fa-notice-x" aria-label={t.noticeClose} onClick={close}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" fill="none" />
        </svg>
      </button>
    </div>
  )
}
