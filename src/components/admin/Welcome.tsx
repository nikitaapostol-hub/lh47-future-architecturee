/* Первый экран админки: новые заявки и быстрые ссылки на страницы. */
import type { PayloadRequest } from 'payload'

const FORMS = [
  { slug: 'community-applications', label: 'Сообщество' },
  { slug: 'forum-applications', label: 'Форум' },
  { slug: 'award-applications', label: 'Премия' },
] as const

const PAGES = [
  { href: '/admin/globals/home', label: 'Главная', note: 'Сообщество' },
  { href: '/admin/globals/forum', label: 'Форум 2026', note: 'Дата, спикеры, тексты' },
  { href: '/admin/globals/award', label: 'Премия и конкурсы', note: 'Приём заявок, номинации' },
  { href: '/admin/globals/common', label: 'Меню и подвал', note: 'Контакты, соцсети, формы' },
  { href: '/admin/globals/settings', label: 'Настройки сайта', note: 'Почта, SEO, счётчики' },
]

const card = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 6,
  padding: '18px 20px',
  border: '1px solid var(--theme-elevation-150)',
  background: 'var(--theme-elevation-0)',
  textDecoration: 'none',
  color: 'var(--theme-text)',
}

export async function Welcome({ req }: { req: PayloadRequest }) {
  const payload = req.payload
  const counts = await Promise.all(
    FORMS.map(async (f) => {
      try {
        const [fresh, all] = await Promise.all([
          payload.count({ collection: f.slug as any, where: { status: { equals: 'new' } }, overrideAccess: true }),
          payload.count({ collection: f.slug as any, overrideAccess: true }),
        ])
        return { ...f, fresh: fresh.totalDocs, all: all.totalDocs }
      } catch {
        return { ...f, fresh: 0, all: 0 }
      }
    }),
  )
  const fresh = counts.reduce((s, c) => s + c.fresh, 0)

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <h1 style={{ margin: 0 }}>ARCH MAKERS</h1>
        <a href="/" target="_blank" rel="noopener" style={{ fontWeight: 600 }}>
          Открыть сайт ↗
        </a>
      </div>

      <h3 style={{ margin: '32px 0 12px' }}>
        Заявки {fresh > 0 ? <span style={{ color: '#E8461E' }}>· новых: {fresh}</span> : null}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
        {counts.map((c) => (
          <a key={c.slug} href={`/admin/collections/${c.slug}`} style={card}>
            <span style={{ fontSize: 13, opacity: 0.7 }}>{c.label}</span>
            <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
              {c.fresh}
              <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6 }}> новых · всего {c.all}</span>
            </span>
          </a>
        ))}
      </div>

      <h3 style={{ margin: '32px 0 12px' }}>Редактировать сайт</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
        {PAGES.map((p) => (
          <a key={p.href} href={p.href} style={card}>
            <span style={{ fontSize: 17, fontWeight: 700 }}>{p.label}</span>
            <span style={{ fontSize: 13, opacity: 0.7 }}>{p.note}</span>
          </a>
        ))}
      </div>
      <p style={{ marginTop: 16, opacity: 0.7, fontSize: 13 }}>
        В каждой странице все три языка стоят рядом: RU · RO · EN. Кнопка «Живой просмотр» наверху показывает страницу
        рядом с формой. После сохранения правка на сайте через пару секунд.
      </p>
    </div>
  )
}
