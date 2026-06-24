import { getDb, initDb } from '../utils/db'

export default defineEventHandler(async () => {
  await initDb()
  const db = getDb()
  const { rows } = await db.execute('SELECT cle, valeur FROM contenu')
  return Object.fromEntries(rows.map((r) => [r.cle as string, r.valeur as string]))
})
