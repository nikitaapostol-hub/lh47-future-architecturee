/* Короткие конструкторы полей, чтобы описания страниц читались как оглавление. */
import type { K, ListField, TextField } from './types'

export const text = (name: string, label: string, key: K, area = false): TextField => ({
  kind: 'text',
  name,
  label,
  key,
  ...(area ? { area: true } : {}),
})

export const list = (
  name: string,
  label: string,
  itemLabel: string,
  cols: ListField['cols'],
  rows: ListField['rows'],
  desc?: string,
): ListField => ({ kind: 'list', name, label, itemLabel, cols, rows, ...(desc ? { desc } : {}) })
