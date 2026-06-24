import { requireAdminSession } from '../../../utils/admin'
import { getDb } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const { ids } = await readBody(event) as { ids: number[] }
  if (!Array.isArray(ids)) throw createError({ statusCode: 400, message: 'ids requis' })
  const db = getDb()
  for (let i = 0; i < ids.length; i++) {
    await db.execute({ sql: 'UPDATE galerie SET ordre = ? WHERE id = ?', args: [i, ids[i]] })
  }
  return { ok: true }
})
