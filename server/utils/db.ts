import Database from 'better-sqlite3'
import { join } from 'path'
import { mkdirSync } from 'fs'

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db

  const config = useRuntimeConfig()
  const dbPath = config.dbPath as string
  const dir = dbPath.substring(0, dbPath.lastIndexOf('/'))
  mkdirSync(dir, { recursive: true })

  _db = new Database(dbPath)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  migrate(_db)
  return _db
}

function migrate(db: Database.Database) {
  db.exec(`
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

  const count = (db.prepare('SELECT COUNT(*) as c FROM produits').get() as any).c
  if (count === 0) {
    const insert = db.prepare(`INSERT INTO produits (nom, categorie, description, prix, unite, disponible) VALUES (?, ?, ?, ?, ?, 1)`)
    insert.run('Tomates', 'Légumes', 'Tomates fraîches de saison', 3.50, 'kg')
    insert.run('Courgettes', 'Légumes', 'Courgettes vertes ou jaunes', 2.00, 'kg')
    insert.run('Salade', 'Légumes feuilles', 'Laitue, batavia, roquette selon disponibilité', 1.20, 'pièce')
    insert.run('Haricots verts', 'Légumes', 'Haricots verts fins', 4.00, 'kg')
    insert.run('Pommes de terre', 'Légumes racines', 'Variétés de saison', 1.50, 'kg')
    insert.run('Oignons', 'Légumes racines', null, 1.80, 'kg')
  }
}
