export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return
  try {
    // useRequestFetch transmet le cookie de session pendant le rendu serveur
    await useRequestFetch()('/api/admin/me')
  } catch {
    return navigateTo('/admin/login')
  }
})
