import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { ru } from '../i18n/ru'
import { ro } from '../i18n/ro'
import { en } from '../i18n/en'

/* Главная, «Кто входит в сообщество»: тексты «Что даёт сообщество» для
   резидентов и партнёров — сразу в админку, чтобы их было видно и можно было
   править. Текст партнёров меняется, только если в админке он прежний. */

const D = { ru, ro, en } as const
const l3 = (k: keyof typeof ru) => ({ ru: D.ru[k], ro: D.ro[k], en: D.en[k] })

const OLD_PARTNERS = [
  'Партнёры — представители индустрии, которые помогают идеям расти: знакомят с материалами и технологиями, участвуют в проектах и событиях сообщества.',
  'Partenerii sunt reprezentanți ai industriei care ajută ideile să crească: prezintă materiale și tehnologii, participă la proiectele și evenimentele comunității.',
  'Partners are industry representatives who help ideas grow: they introduce materials and technologies and take part in community projects and events.',
  'Партнёры и представители индустрии, которые помогают идеям расти: знакомят с материалами и технологиями, участвуют в проектах и событиях сообщества.',
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  let doc: any
  try {
    doc = await payload.findGlobal({ slug: 'home' as any, depth: 0, req })
  } catch {
    return
  }
  if (!doc) return
  const data: any = Object.fromEntries(Object.entries(doc).filter(([k]) => !['id', 'globalType', 'createdAt', 'updatedAt'].includes(k)))
  const who = { ...(data.who || {}) }
  if (!who.benefitsLabel?.ru) who.benefitsLabel = l3('hBenefitsLabel')
  if (!who.residentsText?.ru) who.residentsText = l3('hResidentsText')
  if (!Array.isArray(who.residentsBenefits) || who.residentsBenefits.length === 0)
    who.residentsBenefits = ([1, 2, 3] as const).map((i) => ({
      title: l3(`hRBen${i}` as keyof typeof ru),
      text: l3(`hRBen${i}Text` as keyof typeof ru),
    }))
  if (!Array.isArray(who.partnersBenefits) || who.partnersBenefits.length === 0)
    who.partnersBenefits = ([1, 2, 3] as const).map((i) => ({
      title: l3(`hPBen${i}` as keyof typeof ru),
      text: l3(`hPBen${i}Text` as keyof typeof ru),
    }))
  const pt = who.partnersText || {}
  const next = l3('hPartnersText')
  who.partnersText = Object.fromEntries(
    (['ru', 'ro', 'en'] as const).map((l) => [l, !pt[l] || OLD_PARTNERS.includes(pt[l]) ? next[l] : pt[l]]),
  )
  data.who = who
  await payload.updateGlobal({ slug: 'home' as any, data, req, context: { skipRevalidate: true } })
  payload.logger.info('[14.10] home: «Что даёт сообщество» для резидентов и партнёров')
}

export async function down(_: MigrateDownArgs): Promise<void> {}
