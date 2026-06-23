export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  if (body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, message: 'Mot de passe incorrect.' })
  }

  setCookie(event, 'admin_session', config.adminPassword as string, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return { ok: true }
})
