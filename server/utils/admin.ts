export function requireAdminSession(event: any) {
  const config = useRuntimeConfig()
  const cookie = getCookie(event, 'admin_session')
  if (cookie !== config.adminPassword) {
    throw createError({ statusCode: 401, message: 'Non autorisé.' })
  }
}
