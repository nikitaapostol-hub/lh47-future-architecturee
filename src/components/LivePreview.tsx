'use client'

/* Живой просмотр в админке: страница открыта в окне рядом с формой.
   Окно раз в 2 секунды спрашивает у сайта время последнего сохранения
   и, если оно поменялось, перезагружает данные страницы.
   Вне админки (обычный посетитель) компонент ничего не делает. */
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LivePreview() {
  const router = useRouter()
  useEffect(() => {
    if (window.self === window.top) return
    // сообщаем админке, что страница загрузилась (её штатный протокол)
    try {
      window.parent.postMessage({ type: 'payload-live-preview', ready: true }, window.location.origin)
    } catch {}
    let last = 0
    let stop = false
    const tick = async () => {
      if (stop) return
      try {
        const r = await fetch('/api/site-version', { cache: 'no-store' })
        const { v } = await r.json()
        if (last && v && v !== last) router.refresh()
        if (v) last = v
      } catch {}
      if (!stop) setTimeout(tick, 2000)
    }
    tick()
    return () => {
      stop = true
    }
  }, [router])
  return null
}
