/* Единый источник правды для редактируемых текстов.
   Из одного описания собирается и структура админки (buildGlobal),
   и слой подстановки значений поверх словаря (applyContent).
   Так поля админки и ключи словаря физически не могут разъехаться. */
import type { Dict } from '@/i18n/dict'

export type K = keyof Dict

/** Одиночная строка: одно поле в админке — один ключ словаря. */
export type TextField = {
  kind: 'text'
  name: string
  label: string
  key: K
  /** подсказка под полем в админке */
  desc?: string
  /** многострочное поле */
  area?: boolean
}

/** Повторяющийся блок фиксированной длины (форматы, программа, темы).
    Длина задана списком rows: каждая строка — карта «колонка → ключ». */
export type ListField = {
  kind: 'list'
  name: string
  label: string
  desc?: string
  itemLabel: string
  cols: { name: string; label: string; area?: boolean }[]
  rows: Record<string, K>[]
}

export type Field = TextField | ListField

export type Section = {
  name: string
  label: string
  desc?: string
  fields: Field[]
}

export type PageContent = {
  slug: string
  label: string
  desc?: string
  sections: Section[]
}
