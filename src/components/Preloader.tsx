'use client'

/* Заставка. На каждой странице своя сцена, собранная из простых фигур:
   сообщество — кубик складывается из трёх граней;
   форум — стол и четыре места вокруг него;
   премия — фигура поднимает награду над головой.
   Всё на CSS: если JavaScript не отработает, заставка всё равно уйдёт. */
import { usePathname } from 'next/navigation'

function scene(kind: 'home' | 'forum' | 'award') {
  if (kind === 'forum') {
    return (
      <>
        <i className="fa-fo-table" />
        <i className="fa-fo-seat fa-fo-n" />
        <i className="fa-fo-seat fa-fo-e" />
        <i className="fa-fo-seat fa-fo-s" />
        <i className="fa-fo-seat fa-fo-w" />
      </>
    )
  }
  if (kind === 'award') {
    return (
      <>
        <i className="fa-aw-cup" />
        <i className="fa-aw-ring" />
        <i className="fa-aw-arm fa-aw-arm-l" />
        <i className="fa-aw-arm fa-aw-arm-r" />
        <i className="fa-aw-head" />
        <i className="fa-aw-body" />
        <i className="fa-aw-floor" />
      </>
    )
  }
  return (
    <>
      <i className="fa-pre-f fa-pre-left" />
      <i className="fa-pre-f fa-pre-right" />
      <i className="fa-pre-f fa-pre-top" />
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
