import { requireAdminSession } from '../../utils/admin'
import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const { path } = await readBody(event)
  if (!path) throw createError({ statusCode: 400, message: 'Paramètre path manquant' })
  const db = getDb()
  const { rows } = await db.execute('SELECT COALESCE(MAX(ordre), -1) + 1 as next FROM galerie')
  const next = Number(rows[0].next)
  const result = await db.execute({ sql: 'INSERT INTO galerie (path, ordre) VALUES (?, ?)', args: [path, next] })
  return { id: Number(result.lastInsertRowid), path, ordre: next }
})
