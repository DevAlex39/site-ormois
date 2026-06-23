export default defineEventHandler((event) => {
  const query = getQuery(event)
  const db = getDb()

  if (query.all === '1') {
    return db.prepare('SELECT * FROM produits ORDER BY categorie, nom').all()
  }
  return db.prepare('SELECT * FROM produits WHERE disponible = 1 ORDER BY categorie, nom').all()
})
