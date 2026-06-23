export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = getDb()

  const { prenom, nom, telephone, email, type, entreprise, message, date, lignes } = body

  if (!prenom || !nom || !telephone || !email || !type || !date || !lignes?.length) {
    throw createError({ statusCode: 400, message: 'Informations incomplètes.' })
  }

  const insertCommande = db.prepare(`
    INSERT INTO commandes (prenom, nom, telephone, email, type, entreprise, message, date_souhaitee)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const insertLigne = db.prepare(`
    INSERT INTO commande_lignes (commande_id, produit_id, produit_nom, quantite, unite)
    VALUES (?, ?, ?, ?, ?)
  `)

  const lignesDetail: { produit_nom: string; quantite: number; unite: string }[] = []

  const transaction = db.transaction(() => {
    const cmdResult = insertCommande.run(prenom, nom, telephone, email, type, entreprise || null, message || null, date)
    const cmdId = cmdResult.lastInsertRowid

    for (const l of lignes) {
      const produit = db.prepare('SELECT * FROM produits WHERE id = ?').get(l.produitId) as any
      if (!produit) continue
      insertLigne.run(cmdId, produit.id, produit.nom, l.quantite, produit.unite)
      lignesDetail.push({ produit_nom: produit.nom, quantite: l.quantite, unite: produit.unite })
    }
  })

  transaction()

  try {
    await sendCommandeMail({ prenom, nom, telephone, email, type, entreprise, message, date_souhaitee: date, lignes: lignesDetail })
  } catch (e) {
    console.error('Erreur envoi mail:', e)
  }

  return { ok: true }
})
