'use client'

/* Подписи строк в списках админки: вместо «Спикер 01» — имя спикера. */
import { useRowLabel } from '@payloadcms/ui'

export function SpeakerLabel() {
  const { data, rowNumber } = useRowLabel<{ name?: { ru?: string } }>()
  return <span>{data?.name?.ru || `Спикер ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}

export function NominationLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: { ru?: string } }>()
  const no = String((rowNumber ?? 0) + 1).padStart(2, '0')
  return <span>{no} · {data?.title?.ru || 'Номинация'}</span>
}

export function ItemLabel() {
  const { data, rowNumber } = useRowLabel<Record<string, { ru?: string }>>()
  const no = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const first = data ? Object.values(data).find((v) => v && typeof v === 'object' && typeof v.ru === 'string')?.ru : ''
  const short = first && first.length > 70 ? first.slice(0, 70) + '…' : first
  return <span>{no}{short ? ' · ' + short : ''}</span>
}
