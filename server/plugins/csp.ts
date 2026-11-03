import { createHash } from 'node:crypto'

/*
 * Content-Security-Policy des pages HTML : seconde barrière si une faille laissait
 * passer du code dans une page. Le navigateur n'exécute que les scripts du site et
 * les scripts en ligne générés par Nuxt (autorisés un par un par leur empreinte).
 * - polices : Google Fonts ;
 * - carte de la page contact : iframe OpenStreetMap.
 * Styles en ligne autorisés : Vue positionne des éléments avec l'attribut style.
 */
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/json")[^>]*>([\s\S]*?)<\/script>/g

export default defineNitroPlugin((nitroApp) => {
  if (import.meta.dev) return // Vite (HMR) injecte ses propres scripts en dev

  nitroApp.hooks.hook('render:response', (response) => {
    if (typeof response.body !== 'string') return
    const hashes = [...response.body.matchAll(INLINE_SCRIPT)]
      .map((m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`)

    response.headers = response.headers || {}
    response.headers['content-security-policy'] = [
      `default-src 'self'`,
      `script-src 'self' ${hashes.join(' ')}`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src 'self' https://fonts.gstatic.com`,
      `img-src 'self' data: https:`,
      `frame-src https://www.openstreetmap.org`,
      `connect-src 'self'`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
    ].join('; ')
  })
})
