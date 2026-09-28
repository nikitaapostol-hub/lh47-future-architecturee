/* Время последнего сохранения в админке — для живого просмотра:
   окно с сайтом внутри админки спрашивает его раз в пару секунд
   и обновляется, когда оно поменялось. */
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SLUGS = ['home', 'forum', 'award', 'common', 'settings']

export async function GET(): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })
    const docs = await Promise.all(
      SLUGS.map((slug) => payload.findGlobal({ slug: slug as any, depth: 0, select: { updatedAt: true } as any }).catch(() => null)),
    )
    const v = docs.map((d: any) => (d?.updatedAt ? Date.parse(d.updatedAt) : 0)).reduce((a, b) => Math.max(a, b), 0)
    return NextResponse.json({ v }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ v: 0 }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
