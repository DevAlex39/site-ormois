export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const db = getDb()

  const { rows: commandes } = await db.execute('SELECT * FROM commandes ORDER BY created_at DESC')

  const result = await Promise.all(commandes.map(async (c: any) => {
    const { rows: lignes } = await db.execute({
      sql: `SELECT cl.*, p.nom as produit_nom FROM commande_lignes cl LEFT JOIN produits p ON p.id = cl.produit_id WHERE cl.commande_id = ?`,
      args: [c.id],
    })
    return { ...c, lignes }
  }))

  return result
})
