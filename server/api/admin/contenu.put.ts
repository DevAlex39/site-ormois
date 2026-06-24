import { requireAdminSession } from '../../utils/admin'
import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const { cle, valeur } = await readBody(event)
  if (!cle || valeur === undefined) throw createError({ statusCode: 400, message: 'Paramètres manquants' })
  const db = getDb()
  await db.execute({ sql: 'INSERT INTO contenu (cle, valeur) VALUES (?, ?) ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur', args: [cle, valeur] })
  return { ok: true }
})
