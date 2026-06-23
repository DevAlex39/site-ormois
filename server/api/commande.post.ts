export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = getDb()

  const { prenom, nom, telephone, email, type, entreprise, message, date, lignes } = body

  if (!prenom || !nom || !telephone || !email || !type || !date || !lignes?.length) {
    throw createError({ statusCode: 400, message: 'Informations incomplètes.' })
  }

  const cmdResult = await db.execute({
    sql: `INSERT INTO commandes (prenom, nom, telephone, email, type, entreprise, message, date_souhaitee) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [prenom, nom, telephone, email, type, entreprise || null, message || null, date],
  })
  const cmdId = Number(cmdResult.lastInsertRowid)

  const lignesDetail: { produit_nom: string; quantite: number; unite: string }[] = []

  for (const l of lignes) {
    const { rows } = await db.execute({ sql: 'SELECT * FROM produits WHERE id = ?', args: [l.produitId] })
    const produit = rows[0] as any
    if (!produit) continue
    await db.execute({
      sql: `INSERT INTO commande_lignes (commande_id, produit_id, produit_nom, quantite, unite) VALUES (?, ?, ?, ?, ?)`,
      args: [cmdId, produit.id, produit.nom, l.quantite, produit.unite],
    })
    lignesDetail.push({ produit_nom: String(produit.nom), quantite: l.quantite, unite: String(produit.unite) })
  }

  try {
    await sendCommandeMail({ prenom, nom, telephone, email, type, entreprise, message, date_souhaitee: date, lignes: lignesDetail })
  } catch (e) {
    console.error('Erreur envoi mail:', e)
  }

  return { ok: true }
})
