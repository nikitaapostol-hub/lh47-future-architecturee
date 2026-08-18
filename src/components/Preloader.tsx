'use client'

/* Заставка: на каждой странице своё слово — COMMUNITY, FORUM, AWARDS.
   Буквы выезжают снизу из-под маски, одна за другой, как заголовки на сайте;
   под ними прочерчивается оранжевая линия, затем экран уходит вверх.
   Всё на CSS: если JavaScript не отработает, заставка всё равно уйдёт. */
import { usePathname } from 'next/navigation'

const WORD = { home: 'COMMUNITY', forum: 'FORUM', award: 'AWARDS' }

export default function Preloader() {
  const p = usePathname() || '/'
  const kind: 'home' | 'forum' | 'award' = /\/award\/?$/.test(p)
    ? 'award'
    : /\/forum\/?$/.test(p)
      ? 'forum'
      : 'home'
  const word = WORD[kind]

  return (
    <div className="fa-pre" data-scene={kind} aria-hidden="true">
      <div className="fa-pre-stage">
        <span className="fa-pre-kicker">Future Architecture</span>
        <span className="fa-pre-word">
          {word.split('').map((ch, i) => (
            <span key={i} className="fa-pre-l" style={{ ['--i' as string]: i }}>
              <i>{ch}</i>
            </span>
          ))}
          <span className="fa-pre-dot" />
        </span>
        <span className="fa-pre-rule" />
      </div>
    </div>
  )
}
