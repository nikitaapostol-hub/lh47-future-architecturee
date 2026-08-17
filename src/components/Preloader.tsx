'use client'

/* Заставка. На каждой странице своя сцена:
   сообщество — люди сходятся с двух сторон и встают в ряд;
   форум — сцена, спикер за трибуной и зал, который заполняется волной;
   премия — пьедестал, победитель с поднятыми руками и кубок с салютом.
   Фигура собрана из головы, корпуса, рук и ног — у неё есть походка.
   Всё на CSS: если JavaScript не отработает, заставка всё равно уйдёт. */
import { usePathname } from 'next/navigation'

const FIVE = [0, 1, 2, 3, 4]
const ROW1 = [0, 1, 2, 3, 4]
const ROW2 = [0, 1, 2, 3]
const RAYS = [0, 1, 2, 3, 4, 5, 6, 7]

function Figure({ className }: { className: string }) {
  return (
    <i className={'fa-fig ' + className}>
      <i className="fa-fig-h" />
      <i className="fa-fig-t" />
      <i className="fa-fig-al" />
      <i className="fa-fig-ar" />
      <i className="fa-fig-ll" />
      <i className="fa-fig-lr" />
    </i>
  )
}

function scene(kind: 'home' | 'forum' | 'award') {
  if (kind === 'forum') {
    return (
      <>
        <i className="fa-fo-screen" />
        <i className="fa-fo-sweep" />
        <Figure className="fa-fo-speaker" />
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
        {RAYS.map((i) => (
          <i key={'r' + i} className={`fa-aw-ray fa-aw-ray${i}`} />
        ))}
        <i className="fa-aw-cup" />
        <i className="fa-aw-stem" />
        <i className="fa-aw-foot" />
        <Figure className="fa-aw-winner" />
        <i className="fa-aw-p1" />
        <i className="fa-aw-p2" />
        <i className="fa-aw-p3" />
        <i className="fa-aw-floor" />
      </>
    )
  }
  return (
    <>
      {FIVE.map((i) => (
        <Figure key={'p' + i} className={`fa-co-p fa-co-p${i}`} />
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
