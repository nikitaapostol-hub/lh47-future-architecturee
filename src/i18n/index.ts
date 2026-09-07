import { ru } from './ru'
import { ro } from './ro'
import { en } from './en'
import { typoAll } from './typo'
import type { Dict } from './dict'
import type { Lang } from './links'

/* Словари прогоняются через микротипографику один раз при загрузке модуля. */
export const dict: Record<Lang, Dict> = {
  ru: typoAll(ru, 'ru'),
  ro: typoAll(ro, 'ro'),
  en: typoAll(en, 'en'),
}
