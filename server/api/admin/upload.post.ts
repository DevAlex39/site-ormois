import { writeFileSync, mkdirSync } from 'fs'
import { join, extname } from 'path'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const form = await readMultipartFormData(event)
  if (!form) throw createError({ statusCode: 400, message: 'Aucun fichier reçu.' })

  const fileField = form.find((f) => f.name === 'file')
  if (!fileField?.data) throw createError({ statusCode: 400, message: 'Fichier manquant.' })

  const maxSize = 5 * 1024 * 1024
  if (fileField.data.length > maxSize) {
    throw createError({ statusCode: 400, message: 'Fichier trop volumineux (max 5 Mo).' })
  }

  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.avif']
  const ext = extname(fileField.filename || '').toLowerCase()
  if (!allowed.includes(ext)) {
    throw createError({ statusCode: 400, message: 'Format non autorisé. JPG, PNG ou WebP uniquement.' })
  }

  const filename = `produit_${Date.now()}${ext}`
  // Écrire dans public/uploads (dev) ET .output/public/uploads (prod Nuxt)
  const dirs = [
    join(process.cwd(), 'public', 'uploads'),
    join(process.cwd(), '.output', 'public', 'uploads'),
  ]
  for (const dir of dirs) {
    try { mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, filename), fileField.data) } catch {}
  }

  return { path: `/uploads/${filename}` }
})
