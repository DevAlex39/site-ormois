export default defineEventHandler(async (event) => {
  await initDb()
  const query = getQuery(event)
  const db = getDb()

  const sql = query.all === '1'
    ? 'SELECT * FROM produits ORDER BY categorie, nom'
    : 'SELECT * FROM produits WHERE disponible = 1 ORDER BY categorie, nom'

  const { rows } = await db.execute(sql)
  return rows
})
