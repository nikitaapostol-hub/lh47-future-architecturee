import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { nomKey, nominationMap } from '../lib/nominations'

/* 23.11.2026 — номинации в заявках на премию приводятся к русским названиям
   (заявки с RO/EN версий сайта хранили номинацию на своём языке). Нужно для
   разбивки «По номинациям» над списком заявок. */

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const map = await nominationMap(payload)
  const { docs } = await payload.find({
    collection: 'award-applications' as any,
    depth: 0,
    limit: 5000,
    pagination: false,
    overrideAccess: true,
    req,
  })
  let n = 0
  for (const d of docs as any[]) {
    const cur = String(d?.nomination || '').trim()
    const ru = cur && map.get(nomKey(cur))
    if (!ru || ru === cur) continue
    await payload.update({ collection: 'award-applications' as any, id: d.id, data: { nomination: ru } as any, overrideAccess: true, req })
    n++
  }
  payload.logger.info(`[23.11] award-applications: номинация по-русски у ${n} заявок`)
}

export async function down(_: MigrateDownArgs): Promise<void> {}
