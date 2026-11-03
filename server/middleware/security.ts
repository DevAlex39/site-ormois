/*
 * En-têtes de sécurité sur toutes les réponses + protection CSRF.
 * La CSP (pages HTML) est ajoutée par server/plugins/csp.ts.
 */
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Strict-Transport-Security': 'max-age=31536000',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  })

  // CSRF : une requête qui modifie des données doit venir du site lui-même.
  // Les navigateurs envoient toujours l'en-tête Origin sur POST/PUT/DELETE.
  const method = event.method
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const origin = getRequestHeader(event, 'origin')
    if (origin) {
      let originHost = ''
      try { originHost = new URL(origin).host } catch {}
      if (originHost !== getRequestHeader(event, 'host')) {
        throw createError({ statusCode: 403, message: 'Origine refusée.' })
      }
    }
  }
})
