// 20 mots de passe faux en 15 minutes (tous visiteurs confondus) → connexion bloquée 15 minutes.
const failures = createLimiter({ windowMs: 15 * 60 * 1000, max: 20 })

export default defineEventHandler(async (event) => {
  if (failures.blocked('all')) {
    throw createError({ statusCode: 429, message: 'Trop de tentatives. Réessayez dans 15 minutes.' })
  }

  const body = await readBody(event)
  if (!checkAdminPassword(body?.password)) {
    failures.hit('all')
    throw createError({ statusCode: 401, message: 'Mot de passe incorrect.' })
  }

  createAdminSession(event)
  return { ok: true }
})
