export default defineEventHandler(async (event) => {
  await initDb()
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

  const lignesDetail: { produit_nom: string; quantite: number; unite: string; prix_unitaire?: number }[] = []

  for (const l of lignes) {
    const { rows } = await db.execute({ sql: 'SELECT * FROM produits WHERE id = ?', args: [l.produitId] })
    const produit = rows[0] as any
    if (!produit) continue
    await db.execute({
      sql: `INSERT INTO commande_lignes (commande_id, produit_id, produit_nom, quantite, unite, prix_unitaire) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [cmdId, produit.id, produit.nom, l.quantite, produit.unite, produit.prix ?? null],
    })
    lignesDetail.push({ produit_nom: String(produit.nom), quantite: l.quantite, unite: String(produit.unite), prix_unitaire: produit.prix ?? undefined })
  }

  const { rows: contenuRows } = await db.execute("SELECT cle, valeur FROM contenu WHERE cle IN ('contact_telephone', 'contact_email', 'mail_actif')")
  const contenuMap = Object.fromEntries(contenuRows.map((r: any) => [r.cle, r.valeur]))

  if (contenuMap.mail_actif === '1') {
    try {
      await sendCommandeMail({ prenom, nom, telephone, email, type, entreprise, message, date_souhaitee: date, lignes: lignesDetail })
    } catch (e) {
      console.error('Erreur envoi mail ferme:', e)
    }
    try {
      await sendConfirmationClientMail({
        prenom, nom, email, date_souhaitee: date, lignes: lignesDetail,
        telephone_ferme: contenuMap.contact_telephone,
        email_ferme: contenuMap.contact_email,
      })
    } catch (e) {
      console.error('Erreur envoi mail client:', e)
    }
  }

  return { ok: true }
})
