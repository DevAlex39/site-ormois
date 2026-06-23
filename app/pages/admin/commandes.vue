<template>
  <div class="container" style="padding-top:2rem;padding-bottom:3rem;max-width:960px">
    <div class="page-header">
      <NuxtLink to="/admin" class="back-link">← Retour</NuxtLink>
      <h1>Commandes reçues</h1>
    </div>

    <div v-if="pending" class="loading">Chargement…</div>
    <div v-else-if="!commandes?.length" class="empty">Aucune commande pour le moment.</div>
    <div v-else class="commandes-list">
      <div v-for="c in commandes" :key="c.id" class="commande-card">
        <div class="commande-header">
          <div>
            <strong>{{ c.prenom }} {{ c.nom }}</strong>
            <span class="type-badge">{{ c.type }}</span>
          </div>
          <div class="commande-date">
            <span>Commande le {{ formatDate(c.created_at) }}</span>
            <span class="date-souhaitee">Retrait souhaité : <strong>{{ formatDate(c.date_souhaitee) }}</strong></span>
          </div>
        </div>
        <div class="commande-body">
          <div class="commande-contact">
            <span>📞 {{ c.telephone }}</span>
            <span>✉ {{ c.email }}</span>
            <span v-if="c.entreprise">🏢 {{ c.entreprise }}</span>
          </div>
          <table class="lignes-table">
            <thead><tr><th>Produit</th><th>Quantité</th></tr></thead>
            <tbody>
              <tr v-for="l in c.lignes" :key="l.produit_nom">
                <td>{{ l.produit_nom }}</td>
                <td>{{ l.quantite }} {{ l.unite }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="c.message" class="commande-message">💬 {{ c.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin-auth' })

const { data: commandes, pending } = await useFetch<any[]>('/api/admin/commandes')

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

useHead({ title: 'Commandes — Admin Ferme de l\'Ormois' })
</script>

<style scoped>
.page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.5rem; color: var(--vert-fonce); }
.back-link { color: var(--vert); font-size: 0.9rem; }
.commandes-list { display: flex; flex-direction: column; gap: 1.25rem; }
.commande-card { background: var(--blanc); border-radius: 10px; box-shadow: var(--ombre); overflow: hidden; }
.commande-header {
  background: var(--vert-fonce); color: var(--blanc);
  padding: 0.9rem 1.25rem;
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 0.5rem;
}
.commande-header strong { font-size: 1.05rem; }
.type-badge {
  margin-left: 0.75rem; padding: 2px 8px; border-radius: 20px;
  background: rgba(255,255,255,0.15); font-size: 0.8rem; text-transform: capitalize;
}
.commande-date { font-size: 0.85rem; opacity: 0.85; text-align: right; }
.date-souhaitee { display: block; }
.commande-body { padding: 1.25rem; }
.commande-contact { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem; font-size: 0.9rem; color: #555; }
.lignes-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.lignes-table th { text-align: left; padding: 0.4rem 0.75rem; background: var(--beige-fonce); color: var(--vert-fonce); }
.lignes-table td { padding: 0.4rem 0.75rem; border-bottom: 1px solid var(--beige-fonce); }
.commande-message { margin-top: 1rem; padding: 0.75rem; background: var(--beige); border-radius: 6px; font-size: 0.9rem; color: #555; }
.loading, .empty { text-align: center; padding: 3rem; color: #888; }
</style>
