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
      nom TEXT NOT NULL UNIQUE,
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
      statut TEXT NOT NULL DEFAULT 'en_attente',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS commande_lignes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commande_id INTEGER NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
      produit_id INTEGER REFERENCES produits(id) ON DELETE SET NULL,
      produit_nom TEXT NOT NULL,
      quantite REAL NOT NULL DEFAULT 1,
      unite TEXT NOT NULL DEFAULT '',
      prix_unitaire REAL
    );
    CREATE TABLE IF NOT EXISTS contenu (
      cle TEXT PRIMARY KEY,
      valeur TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS galerie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      ordre INTEGER NOT NULL DEFAULT 0
    );
  `)

  const { rows } = await db.execute('SELECT COUNT(*) as c FROM produits')
  if (Number(rows[0].c) === 0) {
    const ins = 'INSERT OR IGNORE INTO produits (nom, categorie, description, prix, unite, disponible) VALUES (?, ?, ?, ?, ?, ?)'
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

  const { rows: cnt } = await db.execute('SELECT COUNT(*) as c FROM contenu')
  if (Number(cnt[0].c) === 0) {
    const insCnt = 'INSERT INTO contenu (cle, valeur) VALUES (?, ?)'
    const contents: [string, string][] = [
      ['ferme_image', '/Serre.jpg'],
      ['ferme_titre', 'Une agriculture biologique, au rythme des saisons'],
      ['ferme_lead1', 'Installée à Marandeuil, en Côte-d\'Or, la Ferme de l\'Ormois cultive des légumes frais dans le respect de la terre et des hommes. Chaque récolte est pensée pour vous offrir le meilleur du moment.'],
      ['ferme_lead2', 'Notre engagement : des produits cultivés avec soin, disponibles en vente directe à la ferme ou sur commande.'],
      ['apropos_titre', 'L\'histoire de la Ferme de l\'Ormois'],
      ['apropos_badge1', 'Du semis'],
      ['apropos_badge2', 'jusqu\'à votre panier'],
      ['apropos_image', '/Serre.jpg'],
      ['apropos_para1', 'Au bout de la route de l\'Ormois, à Marandeuil, notre ferme est née d\'une envie simple : faire pousser des légumes bons et sains, et les partager au plus près de celles et ceux qui les cuisinent.'],
      ['apropos_para2', 'D\'année en année, les serres se sont agrandies et les cultures se sont diversifiées, mais l\'esprit est resté le même : travailler une terre vivante, respecter le rythme des saisons et récolter chaque légume au bon moment.'],
      ['apropos_para3', 'Aujourd\'hui, c\'est toute une histoire de passion et de savoir-faire que nous faisons grandir chaque jour, du semis jusqu\'à votre panier, en vente directe et en circuit court.'],
      ['apropos_signature', 'La famille de la Ferme de l\'Ormois'],
      ['general_logo', ''],
      ['general_nom', 'La Ferme de l\'Ormois'],
      ['general_slogan', 'Maraîchage en circuit court · Marandeuil, Côte-d\'Or'],
      ['contact_adresse', '7 BIS Route de l\'Ormois\n21270 Marandeuil, France'],
      ['contact_telephone', '06 20 49 93 21'],
      ['contact_email', 'lafermedelormois@gmail.com'],
      ['contact_facebook', 'https://www.facebook.com/lafermedelormois'],
      ['contact_horaires', ''],
      ['mail_actif', '0'],
    ]
    for (const args of contents) {
      await db.execute({ sql: insCnt, args })
    }
  }

  const { rows: gal } = await db.execute('SELECT COUNT(*) as c FROM galerie')
  if (Number(gal[0].c) === 0) {
    const insGal = 'INSERT INTO galerie (path, ordre) VALUES (?, ?)'
    const photos = ['/photo_08.jpg', '/photo_04.jpg', '/photo_03.jpg', '/photo_28.jpg', '/photo_30.jpg', '/photo_05.jpg', '/photo_22.jpg', '/photo_14.jpg']
    for (let i = 0; i < photos.length; i++) {
      await db.execute({ sql: insGal, args: [photos[i], i] })
    }
  }
}
