export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  await initDb()
  const db = getDb()

  const now = new Date()
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const monthEnd = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`

  // CA du mois courant
  const { rows: caMoisRows } = await db.execute({
    sql: `SELECT COALESCE(SUM(cl.quantite * cl.prix_unitaire), 0) as total
          FROM commandes c JOIN commande_lignes cl ON cl.commande_id = c.id
          WHERE c.date_souhaitee >= ? AND c.date_souhaitee < ? AND c.statut != 'recuperee'`,
    args: [monthStart, monthEnd],
  })
  const caMois = Number((caMoisRows[0] as any).total)

  // Nb commandes en attente
  const { rows: attenteRows } = await db.execute(
    `SELECT COUNT(*) as c FROM commandes WHERE statut = 'en_attente'`
  )
  const nbAttente = Number((attenteRows[0] as any).c)

  // Nb commandes ce mois
  const { rows: nbMoisRows } = await db.execute({
    sql: `SELECT COUNT(*) as c FROM commandes WHERE date_souhaitee >= ? AND date_souhaitee < ?`,
    args: [monthStart, monthEnd],
  })
  const nbMois = Number((nbMoisRows[0] as any).c)

  // Nb commandes total
  const { rows: totalRows } = await db.execute(`SELECT COUNT(*) as c FROM commandes`)
  const nbTotal = Number((totalRows[0] as any).c)

  // CA par mois sur 6 mois (pour graphique)
  const mois6: { mois: string; ca: number; nb: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
    const end_d = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    const end = `${end_d.getFullYear()}-${String(end_d.getMonth() + 1).padStart(2, '0')}-01`
    const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })

    const { rows: caRows } = await db.execute({
      sql: `SELECT COALESCE(SUM(cl.quantite * cl.prix_unitaire), 0) as ca, COUNT(DISTINCT c.id) as nb
            FROM commandes c JOIN commande_lignes cl ON cl.commande_id = c.id
            WHERE c.date_souhaitee >= ? AND c.date_souhaitee < ?`,
      args: [start, end],
    })
    mois6.push({ mois: label, ca: Number((caRows[0] as any).ca), nb: Number((caRows[0] as any).nb) })
  }

  // Top 5 produits (par quantité totale vendue)
  const { rows: topRows } = await db.execute(
    `SELECT produit_nom, SUM(quantite) as total_qte, SUM(quantite * prix_unitaire) as total_ca, unite
     FROM commande_lignes GROUP BY produit_nom ORDER BY total_qte DESC LIMIT 5`
  )
  const topProduits = topRows.map((r: any) => ({
    nom: String(r.produit_nom),
    qte: Number(r.total_qte),
    ca: Number(r.total_ca),
    unite: String(r.unite),
  }))

  // Répartition statuts
  const { rows: statutRows } = await db.execute(
    `SELECT statut, COUNT(*) as c FROM commandes GROUP BY statut`
  )
  const statuts = Object.fromEntries(statutRows.map((r: any) => [r.statut, Number(r.c)]))

  return { caMois, nbAttente, nbMois, nbTotal, mois6, topProduits, statuts }
})
