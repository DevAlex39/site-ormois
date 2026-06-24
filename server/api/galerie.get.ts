import { getDb, initDb } from '../utils/db'

export default defineEventHandler(async () => {
  await initDb()
  const db = getDb()
  const { rows } = await db.execute('SELECT id, path, ordre FROM galerie ORDER BY ordre ASC')
  return rows
})
