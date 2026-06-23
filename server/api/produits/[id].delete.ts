export default defineEventHandler((event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const db = getDb()
  db.prepare('DELETE FROM produits WHERE id = ?').run(id)
  return { ok: true }
})
