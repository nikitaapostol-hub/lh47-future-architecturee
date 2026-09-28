import { getPayload } from 'payload'
import config from '@payload-config'

/** Разделы админки (глобалы) для сайта. Если база недоступна (первый деплой,
    локальный запуск без DATABASE_URI), сайт рендерится на текстах из кода. */
export async function getGlobal<T = any>(slug: string): Promise<Partial<T>> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({ slug: slug as any, depth: 1 })) as Partial<T>
  } catch (e) {
    console.warn(`[settings] falling back to defaults for "${slug}":`, (e as Error).message)
    return {}
  }
}
