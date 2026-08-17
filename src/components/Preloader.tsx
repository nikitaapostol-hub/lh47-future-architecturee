/* Заставка: кубик-конструктор. Три грани прилетают с разных сторон и
   складываются в объём — светлый верх, тёмный бок, оранжевая грань.
   Всё на CSS: если JavaScript не отработает, заставка всё равно уйдёт. */
export default function Preloader() {
  return (
    <div className="fa-pre" aria-hidden="true">
      <div className="fa-pre-stage">
        <i className="fa-pre-f fa-pre-left" />
        <i className="fa-pre-f fa-pre-right" />
        <i className="fa-pre-f fa-pre-top" />
        <i className="fa-pre-line" />
      </div>
    </div>
  )
}
