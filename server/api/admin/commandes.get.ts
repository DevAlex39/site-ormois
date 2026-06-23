export default defineEventHandler((event) => {
  requireAdminSession(event)
  const db = getDb()

  const commandes = db.prepare(`
    SELECT * FROM commandes ORDER BY created_at DESC
  `).all() as any[]

  return commandes.map((c) => ({
    ...c,
    lignes: db.prepare(`
      SELECT cl.*, p.nom as produit_nom FROM commande_lignes cl
      LEFT JOIN produits p ON p.id = cl.produit_id
      WHERE cl.commande_id = ?
    `).all(c.id),
  }))
})
