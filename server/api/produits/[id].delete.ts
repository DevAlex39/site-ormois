export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const db = getDb()
  await db.execute({ sql: 'DELETE FROM produits WHERE id = ?', args: [id] })
  return { ok: true }
})
