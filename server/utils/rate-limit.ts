/*
 * Limiteur de requêtes en mémoire.
 * Nginx ne transmet pas l'IP du visiteur : on compte donc par clé
 * (adresse e-mail, ou « all » pour un plafond global).
 */
export function createLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const hits = new Map<string, { count: number; reset: number }>()

  return {
    /** true si la clé a atteint son quota sur la fenêtre en cours. */
    blocked(key: string) {
      const e = hits.get(key)
      return !!e && e.reset > Date.now() && e.count >= max
    },
    hit(key: string) {
      const now = Date.now()
      if (hits.size > 10_000) for (const [k, v] of hits) if (v.reset <= now) hits.delete(k)
      const e = hits.get(key)
      if (!e || e.reset <= now) hits.set(key, { count: 1, reset: now + windowMs })
      else e.count++
    },
  }
}
