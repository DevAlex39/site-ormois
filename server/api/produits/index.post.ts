export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody(event)
  const db = getDb()

  if (!body.nom || !body.unite || !body.categorie) {
    throw createError({ statusCode: 400, message: 'Champs obligatoires manquants.' })
  }

  const result = await db.execute({
    sql: `INSERT INTO produits (nom, categorie, description, prix, unite, image, disponible) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [body.nom, body.categorie, body.description || '', body.prix ?? null, body.unite, body.image || null, body.disponible ? 1 : 0],
  })

  return { id: Number(result.lastInsertRowid) }
})
