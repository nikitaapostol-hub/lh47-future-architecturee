import { ru } from './ru'

export type Dict = { [K in keyof typeof ru]: string }
