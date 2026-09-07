/* Микротипографика. Прогоняется один раз на старте по всем словарям
   и по значениям из админки, поэтому редактору не нужно ставить
   неразрывные пробелы руками.

   Что делает:
   — короткие слова (предлоги, союзы, частицы) приклеивает к следующему слову,
     чтобы строки не заканчивались на «в», «и», «по»;
   — числа приклеивает к единице измерения: «250 участников», «9 декабря»;
   — дефис между словами превращает в тире и не даёт ему уехать на новую строку;
   — убирает двойные пробелы.

   Правила про предлоги — для русского и румынского, где это норма набора.
   В английском строку после «the» рвать можно, поэтому там только числа и тире. */

const NB = ' '

const SHORT: Record<string, string> = {
  ru: 'а|и|в|о|с|к|у|я|не|ни|но|же|бы|ли|то|из|от|до|за|на|по|со|во|об|их|им|ко|чем|что|как|для|или|при|про|над|под|без|уже|это|где|там|все|всё',
  ro: 'a|o|și|în|la|cu|pe|de|un|nu|se|al|ai|ale|din|prin|sub|dar|sau|ca|că|ce|iar|mai|său|its',
  en: '',
}

const RE_NUM = /(\d)\s+(?=[A-Za-zА-Яа-яĂÂÎȘȚăâîșț])/g
const RE_DASH = /\s+[–-]\s+/g
const RE_BEFORE_DASH = /\s+—\s*/g
const RE_SPACES = /[ \t]{2,}/g

const cache: Record<string, RegExp | null> = {}
function shortRe(lang: string) {
  if (!(lang in cache)) {
    const list = SHORT[lang] ?? SHORT.ru
    cache[lang] = list ? new RegExp('(^|[\\s(«"—-])(' + list + ')\\s+', 'gi') : null
  }
  return cache[lang]
}

export function typo(s: string, lang = 'ru'): string {
  if (typeof s !== 'string' || s.length < 2) return s
  let out = s
    .replace(RE_SPACES, ' ')
    .replace(RE_DASH, ' — ')
    .replace(RE_BEFORE_DASH, NB + '— ')
  const re = shortRe(lang)
  if (re) out = out.replace(re, (_m, pre, w) => pre + w + NB)
  return out.replace(RE_NUM, '$1' + NB)
}

/** Тот же проход по всем строкам объекта. */
export function typoAll<T extends Record<string, any>>(o: T, lang = 'ru'): T {
  const out: Record<string, any> = {}
  for (const k of Object.keys(o)) {
    const v = o[k]
    out[k] = typeof v === 'string' ? typo(v, lang) : v
  }
  return out as T
}
