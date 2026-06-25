export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  await initDb()
  const db = getDb()

  const { rows: commandes } = await db.execute(
    `SELECT c.*, GROUP_CONCAT(cl.produit_nom || ' x' || cl.quantite || ' ' || cl.unite || ' (' || COALESCE(ROUND(cl.quantite * cl.prix_unitaire, 2), '?') || 'EUR)', ' | ') as detail,
     COALESCE(SUM(cl.quantite * cl.prix_unitaire), 0) as total_prix
     FROM commandes c LEFT JOIN commande_lignes cl ON cl.commande_id = c.id
     GROUP BY c.id ORDER BY c.date_souhaitee DESC`
  )

  const headers = ['ID', 'Date commande', 'Date retrait', 'Statut', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Type', 'Entreprise', 'Total (€)', 'Détail produits', 'Message']

  function esc(v: unknown) {
    const s = String(v ?? '')
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  const rows = commandes.map((c: any) => [
    c.id,
    new Date(c.created_at).toLocaleDateString('fr-FR'),
    new Date(c.date_souhaitee).toLocaleDateString('fr-FR'),
    c.statut,
    c.prenom,
    c.nom,
    c.email,
    c.telephone,
    c.type,
    c.entreprise ?? '',
    Number(c.total_prix).toFixed(2).replace('.', ','),
    c.detail ?? '',
    c.message ?? '',
  ].map(esc).join(','))

  const csv = '﻿' + [headers.join(','), ...rows].join('\r\n')

  const date = new Date().toISOString().slice(0, 10)
  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename="commandes-ormois-${date}.csv"`)
  return csv
})
