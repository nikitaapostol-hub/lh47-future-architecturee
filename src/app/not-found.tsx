/* Глобальная 404. В проекте несколько корневых layout-ов (ru/ro/en/payload),
   поэтому Next рендерит этот файл без обёртки — html и body он задаёт сам. */
import type { Metadata } from 'next'
import './(frontend)/globals.css'
import NotFoundPage from '@/components/NotFoundPage'

export const metadata: Metadata = {
  title: 'Страница не найдена · ARCH MAKERS',
  description: 'Такой страницы на сайте нет.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <NotFoundPage />
      </body>
    </html>
  )
}
