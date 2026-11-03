export default defineEventHandler((event) => {
  destroyAdminSession(event)
  return { ok: true }
})
