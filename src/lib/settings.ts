import { getPayload } from 'payload'
import config from '@payload-config'

/** Globals are optional: the site must still render if the DB is unreachable
    (first deploy, preview build, local run without DATABASE_URI). */
export async function getGlobal<T = any>(slug: string): Promise<Partial<T>> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({ slug: slug as any })) as Partial<T>
  } catch (e) {
    console.warn(`[settings] falling back to defaults for "${slug}":`, (e as Error).message)
    return {}
  }
}
