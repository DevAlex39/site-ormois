// Anti-spam : 30 commandes par heure au total, 3 par heure pour une même adresse e-mail
const parHeure = createLimiter({ windowMs: 60 * 60 * 1000, max: 30 })
const parEmail = createLimiter({ windowMs: 60 * 60 * 1000, max: 3 })

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TYPES = ['particulier', 'professionnel', 'association']

/** Chaîne nettoyée et bornée, ou '' si ce n'est pas une chaîne. */
function texte(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export default defineEventHandler(async (event) => {
  await initDb()
  const body = (await readBody(event)) || {}
  const db = getDb()

  const prenom = texte(body.prenom, 80)
  const nom = texte(body.nom, 80)
  const telephone = texte(body.telephone, 30)
  const email = texte(body.email, 254).toLowerCase()
  const type = texte(body.type, 40)
  const entreprise = texte(body.entreprise, 120)
  const message = texte(body.message, 2000)
  const date = texte(body.date, 10)
  const lignes = Array.isArray(body.lignes) ? body.lignes.slice(0, 50) : []

  if (!prenom || !nom || !telephone || !email || !type || !date || !lignes.length) {
    throw createError({ statusCode: 400, message: 'Informations incomplètes.' })
  }
  if (!EMAIL_RE.test(email)) throw createError({ statusCode: 400, message: 'Adresse e-mail invalide.' })
  if (!TYPES.includes(type)) throw createError({ statusCode: 400, message: 'Type de client invalide.' })
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))) {
    throw createError({ statusCode: 400, message: 'Date de retrait invalide.' })
  }

  if (parHeure.blocked('all') || parEmail.blocked(email)) {
    throw createError({ statusCode: 429, message: 'Trop de commandes envoyées. Réessayez plus tard ou appelez la ferme.' })
  }
  parHeure.hit('all')
  parEmail.hit(email)

  const cmdResult = await db.execute({
    sql: `INSERT INTO commandes (prenom, nom, telephone, email, type, entreprise, message, date_souhaitee) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [prenom, nom, telephone, email, type, entreprise || null, message || null, date],
  })
  const cmdId = Number(cmdResult.lastInsertRowid)

  const lignesDetail: { produit_nom: string; quantite: number; unite: string; prix_unitaire?: number }[] = []

  for (const l of lignes) {
    const produitId = Number(l?.produitId)
    const quantite = Number(l?.quantite)
    if (!Number.isInteger(produitId) || !(quantite > 0 && quantite <= 1000)) continue
    const { rows } = await db.execute({ sql: 'SELECT * FROM produits WHERE id = ?', args: [produitId] })
    const produit = rows[0] as any
    if (!produit) continue
    await db.execute({
      sql: `INSERT INTO commande_lignes (commande_id, produit_id, produit_nom, quantite, unite, prix_unitaire) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [cmdId, produit.id, produit.nom, quantite, produit.unite, produit.prix ?? null],
    })
    lignesDetail.push({ produit_nom: String(produit.nom), quantite, unite: String(produit.unite), prix_unitaire: produit.prix ?? undefined })
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
