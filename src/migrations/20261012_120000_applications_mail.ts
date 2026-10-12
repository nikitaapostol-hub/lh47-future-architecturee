import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Заявки — на info@future-arch.md (оттуда Cloudflare пересылает командам),
   тема письма — Future Architecture "Заявка — …", в тексте ошибки формы — новый адрес.
   Меняем только то, что стоит по умолчанию; свои правки в админке не трогаем. */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  try {
    const s: any = await payload.findGlobal({ slug: 'settings' as any, depth: 0, req })
    const data: any = {}
    const to = String(s?.mailTo || '').trim()
    if (!to || to === 'marketing-team@lh47arch.com') data.mailTo = 'info@future-arch.md'
    const pre = String(s?.subjectPrefix || '').trim()
    if (!pre || pre === '[future-arch.md]') data.subjectPrefix = 'Future Architecture'
    if (Object.keys(data).length) {
      await payload.updateGlobal({ slug: 'settings' as any, data, req, context: { skipRevalidate: true } })
      payload.logger.info('[mail] настройки почты: ' + JSON.stringify(data))
    }
  } catch (e) {
    payload.logger.warn('[mail] settings: ' + (e as Error).message)
  }

  try {
    const c: any = await payload.findGlobal({ slug: 'common' as any, depth: 0, req })
    const err = c?.forms?.error
    const sec = Object.keys(c || {}).find((k) => c[k] && typeof c[k] === 'object' && c[k].error && typeof c[k].error === 'object')
    const target = err ? c.forms : sec ? c[sec] : null
    const key = err ? 'forms' : sec
    if (target && key) {
      const next: any = {}
      let changed = false
      for (const l of ['ru', 'ro', 'en']) {
        const v = target.error?.[l]
        if (typeof v === 'string' && v.includes('marketing@lh47arch.com')) {
          next[l] = v.replace('marketing@lh47arch.com', 'info@future-arch.md')
          changed = true
        } else next[l] = v
      }
      if (changed) {
        await payload.updateGlobal({ slug: 'common' as any, data: { [key]: { ...target, error: next } }, req, context: { skipRevalidate: true } })
        payload.logger.info('[mail] текст ошибки формы: новый адрес')
      }
    }
  } catch (e) {
    payload.logger.warn('[mail] common: ' + (e as Error).message)
  }
}

export async function down(_: MigrateDownArgs): Promise<void> {}
