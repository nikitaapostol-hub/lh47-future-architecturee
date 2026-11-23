/* Заявки на премию: разбивка по номинациям над списком.
   Карточка — номинация: сколько заявок и сколько новых. Клик — список только этой номинации. */
import type { Payload } from 'payload'
import { nominationList } from '@/lib/nominations'

const SLUG = 'award-applications'
const STUDENT = 'Студенческий конкурс'

type Card = { label: string; all: number; fresh: number; href: string; active: boolean; muted?: boolean }

const base = `/admin/collections/${SLUG}`

export async function AwardByNomination({ payload, searchParams }: { payload: Payload; searchParams?: Record<string, any> }) {
  let docs: any[] = []
  try {
    const r = await payload.find({
      collection: SLUG as any,
      depth: 0,
      limit: 5000,
      pagination: false,
      overrideAccess: true,
      select: { track: true, nomination: true, status: true } as any,
    })
    docs = r.docs as any[]
  } catch {
    return null
  }

  // фильтр из адреса: ?where[nomination][equals]=… (объектом или плоским ключом — зависит от того, кто разобрал адрес)
  const sp: any = searchParams || {}
  const one = (v: any) => (Array.isArray(v) ? v[0] : v)
  const curNom = one(sp?.where?.nomination?.equals ?? sp['where[nomination][equals]'])
  const curTrack = one(sp?.where?.track?.equals ?? sp['where[track][equals]'])
  const isStudent = (d: any) => /студ/i.test(String(d?.track || ''))
  const fresh = (list: any[]) => list.filter((d) => (d?.status || 'new') === 'new').length

  const names = await nominationList(payload)
  const award = docs.filter((d) => !isStudent(d))
  // номинации, которых нет в списке админки (старые названия), тоже показываем
  for (const d of award) {
    const n = String(d?.nomination || '').trim()
    if (n && !names.includes(n)) names.push(n)
  }

  const cards: Card[] = names.map((n) => {
    const list = award.filter((d) => String(d?.nomination || '').trim() === n)
    return {
      label: n,
      all: list.length,
      fresh: fresh(list),
      href: `${base}?where[nomination][equals]=${encodeURIComponent(n)}`,
      active: curNom === n,
      muted: list.length === 0,
    }
  })
  const students = docs.filter(isStudent)
  cards.push({
    label: STUDENT,
    all: students.length,
    fresh: fresh(students),
    href: `${base}?where[track][equals]=${encodeURIComponent(STUDENT)}`,
    active: curTrack === STUDENT,
    muted: students.length === 0,
  })
  const noNom = award.filter((d) => !String(d?.nomination || '').trim()).length

  const anyActive = cards.some((c) => c.active)
  const card = (c: Card) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    gap: 10,
    minHeight: 104,
    padding: '14px 16px',
    border: c.active ? '2px solid var(--theme-text)' : '1px solid var(--theme-elevation-150)',
    background: c.active ? 'var(--theme-elevation-50)' : 'var(--theme-elevation-0)',
    color: 'var(--theme-text)',
    textDecoration: 'none',
    opacity: c.muted && !c.active ? 0.55 : 1,
  })

  return (
    <div style={{ margin: '8px 0 28px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>По номинациям</h3>
        <a href={base} style={{ fontWeight: anyActive ? 600 : 400, opacity: anyActive ? 1 : 0.6 }}>
          {anyActive ? '← Все заявки' : `Все заявки: ${docs.length}`}
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 10 }}>
        {cards.map((c) => (
          <a key={c.label} href={c.href} style={card(c)}>
            <span style={{ fontSize: 13, lineHeight: 1.35 }}>{c.label}</span>
            <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
              {c.all}
              {c.fresh > 0 && <span style={{ fontSize: 13, fontWeight: 400, color: '#E8461E' }}> · новых {c.fresh}</span>}
            </span>
          </a>
        ))}
      </div>
      {noNom > 0 && <p style={{ margin: '10px 0 0', fontSize: 13, opacity: 0.6 }}>Без номинации: {noNom}</p>}
    </div>
  )
}
