import { ru } from './ru'
import { ro } from './ro'
import { en } from './en'
import type { Dict } from './dict'
import type { Lang } from './links'

export const dict: Record<Lang, Dict> = { ru, ro, en }
