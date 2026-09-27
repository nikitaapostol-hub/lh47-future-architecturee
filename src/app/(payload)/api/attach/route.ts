/* Файлы заявок (премия и студенческий конкурс) — приватное хранилище Vercel Blob.

   POST — выдаёт браузеру одноразовый токен: файл идёт из браузера прямо в хранилище,
          минуя функцию сайта, поэтому проходят файлы до 20 МБ (через функцию Vercel
          пропускает максимум 4,5 МБ).
   GET  ?p=<путь> — отдаёт файл, но только тому, кто вошёл в админку. Ссылки такого
          вида лежат в заявке и в письме команде.

   Нужна переменная BLOB_READ_WRITE_TOKEN — её добавило подключение хранилища
   arch-makers-files к проекту на Vercel. */
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { get } from '@vercel/blob'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

const MAX_BYTES = 20 * 1024 * 1024
const PREFIX = 'applications/'

const TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/zip',
  'application/x-zip-compressed',
  'multipart/x-zip',
]

const configured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)

export async function POST(request: Request): Promise<NextResponse> {
  if (!configured()) {
    return NextResponse.json({ error: 'uploads are not configured' }, { status: 503 })
  }
  let body: HandleUploadBody
  try {
    body = (await request.json()) as HandleUploadBody
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(PREFIX) || pathname.includes('..')) throw new Error('bad path')
        return {
          allowedContentTypes: TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
          // токен живёт 10 минут — хватает на загрузку одного файла
          validUntil: Date.now() + 10 * 60 * 1000,
        }
      },
      // ссылка на файл и так приходит в заявке — отдельно ничего не записываем
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(json)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const p = url.searchParams.get('p') || ''
  if (!p.startsWith(PREFIX) || p.includes('..')) return new Response('Not found', { status: 404 })

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    const back = url.pathname + url.search
    return NextResponse.redirect(new URL('/admin/login?redirect=' + encodeURIComponent(back), url.origin))
  }
  if (!configured()) return new Response('Storage is not configured', { status: 503 })

  const res = await get(p, { access: 'private' })
  if (!res || res.statusCode !== 200) return new Response('Not found', { status: 404 })
  const name = p.split('/').pop() || 'file'
  return new Response(res.stream, {
    headers: {
      'Content-Type': res.blob.contentType || 'application/octet-stream',
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(name)}`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
