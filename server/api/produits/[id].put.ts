export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const db = getDb()

  db.prepare(`
    UPDATE produits SET nom=?, categorie=?, description=?, prix=?, unite=?, image=?, disponible=? WHERE id=?
  `).run(body.nom, body.categorie, body.description || '', body.prix ?? null, body.unite, body.image || null, body.disponible ? 1 : 0, id)

  return { ok: true }
})
