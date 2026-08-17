/* Заставка: кубик собирается из четырёх частей. Четверти слетаются по
   диагоналям и смыкаются в один квадрат, последняя — оранжевая.
   Всё на CSS: если JavaScript не отработает, экран всё равно уедет сам. */
export default function Preloader() {
  return (
    <div className="fa-pre" aria-hidden="true">
      <div className="fa-pre-stage">
        <i className="fa-pre-b fa-pre-b1" />
        <i className="fa-pre-b fa-pre-b2" />
        <i className="fa-pre-b fa-pre-b3" />
        <i className="fa-pre-b fa-pre-b4" />
        <i className="fa-pre-line" />
      </div>
    </div>
  )
}
