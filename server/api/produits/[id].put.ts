export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const db = getDb()

  await db.execute({
    sql: `UPDATE produits SET nom=?, categorie=?, description=?, prix=?, unite=?, image=?, disponible=? WHERE id=?`,
    args: [body.nom, body.categorie, body.description || '', body.prix ?? null, body.unite, body.image || null, body.disponible ? 1 : 0, id],
  })

  return { ok: true }
})
