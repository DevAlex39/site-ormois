import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const COOKIE = 'admin_session'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000

/*
 * Sessions admin en mémoire : jeton aléatoire → date d'expiration.
 * Le cookie ne contient plus le mot de passe ; un redémarrage du serveur
 * déconnecte simplement l'admin.
 */
const sessions = new Map<string, number>()

/** Compare le mot de passe en temps constant (hash des deux côtés = même longueur). */
export function checkAdminPassword(password: unknown) {
  const expected = String(useRuntimeConfig().adminPassword || '')
  if (!expected || typeof password !== 'string') return false
  const a = createHash('sha256').update(password).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

export function createAdminSession(event: H3Event) {
  const now = Date.now()
  for (const [token, exp] of sessions) if (exp <= now) sessions.delete(token)

  const token = randomBytes(32).toString('hex')
  sessions.set(token, now + SESSION_TTL_MS)
  setCookie(event, COOKIE, token, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'strict',
    maxAge: SESSION_TTL_MS / 1000,
    path: '/',
  })
}

export function destroyAdminSession(event: H3Event) {
  const token = getCookie(event, COOKIE)
  if (token) sessions.delete(token)
  deleteCookie(event, COOKIE, { path: '/' })
}

export function requireAdminSession(event: H3Event) {
  const token = getCookie(event, COOKIE)
  const exp = token ? sessions.get(token) : undefined
  if (!exp || exp <= Date.now()) {
    if (token) sessions.delete(token)
    throw createError({ statusCode: 401, message: 'Non autorisé.' })
  }
}
