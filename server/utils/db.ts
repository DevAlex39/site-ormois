import { createClient } from '@libsql/client'
import { mkdirSync } from 'fs'
import { resolve } from 'path'

let _client: ReturnType<typeof createClient> | null = null

export function getDb() {
  if (_client) return _client

  const config = useRuntimeConfig()
  const dbPath = resolve(config.dbPath as string)
  const dir = dbPath.substring(0, dbPath.lastIndexOf('\\') + 1) || dbPath.substring(0, dbPath.lastIndexOf('/') + 1)
  if (dir) mkdirSync(dir, { recursive: true })

  _client = createClient({ url: `file:${dbPath}` })
  return _client
}

export async function initDb() {
  const db = getDb()
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS produits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      categorie TEXT NOT NULL DEFAULT '',
      description TEXT DEFAULT '',
      prix REAL,
      unite TEXT NOT NULL DEFAULT 'kg',
      image TEXT,
      disponible INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS commandes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prenom TEXT NOT NULL,
      nom TEXT NOT NULL,
      telephone TEXT NOT NULL,
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      entreprise TEXT,
      message TEXT,
      date_souhaitee TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS commande_lignes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commande_id INTEGER NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
      produit_id INTEGER REFERENCES produits(id) ON DELETE SET NULL,
      produit_nom TEXT NOT NULL,
      quantite REAL NOT NULL DEFAULT 1,
      unite TEXT NOT NULL DEFAULT ''
    );
  `)

  const { rows } = await db.execute('SELECT COUNT(*) as c FROM produits')
  if (Number(rows[0].c) === 0) {
    const ins = 'INSERT INTO produits (nom, categorie, description, prix, unite, disponible) VALUES (?, ?, ?, ?, ?, ?)'
    const seeds = [
      ['Tomates',        'Légumes',         'Tomates fraîches de saison',                  3.50, 'kg',    1],
      ['Courgettes',     'Légumes',         'Courgettes vertes ou jaunes',                 2.00, 'kg',    1],
      ['Salade',         'Légumes feuilles','Laitue, batavia, roquette selon disponibilité',1.20, 'pièce', 1],
      ['Haricots verts', 'Légumes',         'Haricots verts fins',                         4.00, 'kg',    1],
      ['Pommes de terre','Légumes racines', 'Variétés de saison',                          1.50, 'kg',    1],
      ['Oignons',        'Légumes racines', '',                                             1.80, 'kg',    1],
    ]
    for (const args of seeds) {
      await db.execute({ sql: ins, args })
    }
  }
}
