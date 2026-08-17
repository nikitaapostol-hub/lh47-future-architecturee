'use client'

/* Заставка. На каждой странице своя сцена, собранная из простых фигур:
   сообщество — люди встают в один ряд;
   форум — сцена, спикер и зал;
   премия — пьедестал, победитель и кубок.
   Всё на CSS: если JavaScript не отработает, заставка всё равно уйдёт. */
import { usePathname } from 'next/navigation'

const PEOPLE = [0, 1, 2, 3, 4]
const ROW1 = [0, 1, 2, 3, 4]
const ROW2 = [0, 1, 2, 3]

function scene(kind: 'home' | 'forum' | 'award') {
  if (kind === 'forum') {
    return (
      <>
        <i className="fa-fo-screen" />
        <i className="fa-fo-head" />
        <i className="fa-fo-body" />
        <i className="fa-fo-stand" />
        {ROW1.map((i) => (
          <i key={'a' + i} className={`fa-fo-seat fa-fo-r1 fa-fo-s${i}`} />
        ))}
        {ROW2.map((i) => (
          <i key={'b' + i} className={`fa-fo-seat fa-fo-r2 fa-fo-t${i}`} />
        ))}
      </>
    )
  }
  if (kind === 'award') {
    return (
      <>
        <i className="fa-aw-cup" />
        <i className="fa-aw-stem" />
        <i className="fa-aw-foot" />
        <i className="fa-aw-ring" />
        <i className="fa-aw-head" />
        <i className="fa-aw-body" />
        <i className="fa-aw-p1" />
        <i className="fa-aw-p2" />
        <i className="fa-aw-p3" />
        <i className="fa-aw-floor" />
      </>
    )
  }
  return (
    <>
      {PEOPLE.map((i) => (
        <i key={'h' + i} className={`fa-co-head fa-co-h${i}`} />
      ))}
      {PEOPLE.map((i) => (
        <i key={'b' + i} className={`fa-co-body fa-co-b${i}`} />
      ))}
      <i className="fa-co-floor" />
    </>
  )
}

export default function Preloader() {
  const p = usePathname() || '/'
  const kind: 'home' | 'forum' | 'award' = /\/award\/?$/.test(p)
    ? 'award'
    : /\/forum\/?$/.test(p)
      ? 'forum'
      : 'home'

  return (
    <div className="fa-pre" data-scene={kind} aria-hidden="true">
      <div className="fa-pre-stage">
        {scene(kind)}
        <i className="fa-pre-line" />
      </div>
    </div>
  )
}
