export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'admin_session')
  const config = useRuntimeConfig()
  if (!cookie || cookie !== config.adminPassword) {
    throw createError({ statusCode: 401, message: 'Non autorisé' })
  }

  const id = getRouterParam(event, 'id')
  const { statut } = await readBody(event)

  const VALID = ['en_attente', 'confirmee', 'prete', 'recuperee']
  if (!VALID.includes(statut)) throw createError({ statusCode: 400, message: 'Statut invalide' })

  await initDb()
  const db = getDb()

  await db.execute({ sql: 'UPDATE commandes SET statut = ? WHERE id = ?', args: [statut, id] })

  const { rows } = await db.execute({
    sql: `SELECT c.*, GROUP_CONCAT(cl.produit_nom || '|' || cl.quantite || '|' || cl.unite || '|' || COALESCE(cl.prix_unitaire,''), ';;') as lignes_raw
          FROM commandes c LEFT JOIN commande_lignes cl ON cl.commande_id = c.id WHERE c.id = ? GROUP BY c.id`,
    args: [id],
  })
  const cmd = rows[0] as any
  if (!cmd) return { ok: true }

  const lignes = (cmd.lignes_raw || '').split(';;').filter(Boolean).map((s: string) => {
    const [produit_nom, quantite, unite, prix] = s.split('|')
    return { produit_nom, quantite: Number(quantite), unite, prix_unitaire: prix ? Number(prix) : undefined }
  })

  const { rows: contenuRows } = await db.execute("SELECT cle, valeur FROM contenu WHERE cle IN ('contact_telephone', 'contact_email', 'mail_actif')")
  const cm = Object.fromEntries(contenuRows.map((r: any) => [r.cle, r.valeur]))

  if (cm.mail_actif === '1') {
    try {
      await sendStatutMail({
        prenom: String(cmd.prenom), nom: String(cmd.nom), email: String(cmd.email),
        date_souhaitee: String(cmd.date_souhaitee), statut,
        lignes,
        telephone_ferme: cm.contact_telephone,
        email_ferme: cm.contact_email,
      })
    } catch (e) {
      console.error('Erreur envoi mail statut:', e)
    }
  }

  return { ok: true }
})
