import { requireAdminSession } from '../../../utils/admin'
import { getDb } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide' })
  const db = getDb()
  await db.execute({ sql: 'DELETE FROM galerie WHERE id = ?', args: [id] })
  return { ok: true }
})
