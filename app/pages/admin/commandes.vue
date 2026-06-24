<template>
  <div class="admin-layout">
    <AdminSidebar active="commandes" />

    <main class="admin-main">
      <div class="admin-topbar">
        <div>
          <h1>Commandes</h1>
          <p class="topbar-sub">{{ commandes?.length ?? 0 }} commande(s) reçue(s)</p>
        </div>
      </div>

      <div class="main-body">
        <div v-if="pending" class="state-msg">Chargement…</div>
        <div v-else-if="!commandes?.length" class="state-msg empty">
          <span v-html="emptyIcon"></span>
          <p>Aucune commande reçue pour le moment.</p>
        </div>
        <div v-else class="commandes-list">
          <div v-for="c in commandes" :key="c.id" class="commande-card">
            <div class="card-header">
              <div class="card-identity">
                <div class="avatar">{{ initials(c.prenom, c.nom) }}</div>
                <div>
                  <strong>{{ c.prenom }} {{ c.nom }}</strong>
                  <span class="type-pill">{{ c.type }}</span>
                  <span v-if="c.entreprise" class="entreprise">{{ c.entreprise }}</span>
                </div>
              </div>
              <div class="card-dates">
                <div class="date-row">
                  <span class="date-label">Commande le</span>
                  <span>{{ formatDate(c.created_at) }}</span>
                </div>
                <div class="date-row retrait">
                  <span class="date-label">Retrait souhaité</span>
                  <strong>{{ formatDate(c.date_souhaitee) }}</strong>
                </div>
              </div>
            </div>

            <div class="card-body">
              <div class="contact-row">
                <a :href="'tel:' + c.telephone" class="contact-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {{ c.telephone }}
                </a>
                <a :href="'mailto:' + c.email" class="contact-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
                  {{ c.email }}
                </a>
              </div>

              <div class="lignes-section">
                <h4>Produits commandés</h4>
                <div class="lignes-grid">
                  <div v-for="l in c.lignes" :key="l.produit_nom" class="ligne-item">
                    <span class="ligne-nom">{{ l.produit_nom }}</span>
                    <span class="ligne-qty">{{ l.quantite }} {{ l.unite }}</span>
                  </div>
                </div>
              </div>

              <div v-if="c.message" class="message-block">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {{ c.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin-auth' })

const { data: commandes, pending } = await useFetch<any[]>('/api/admin/commandes')

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}
function initials(prenom: string, nom: string) {
  return ((prenom?.[0] ?? '') + (nom?.[0] ?? '')).toUpperCase()
}

const emptyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="52" height="52"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`

useHead({ title: 'Commandes — Admin Ferme de l\'Ormois' })
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-main { flex: 1; background: var(--beige-fonce); display: flex; flex-direction: column; min-width: 0; }
.admin-topbar {
  background: var(--creme); border-bottom: 1px solid #e0d9ca;
  padding: 1.25rem 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.admin-topbar h1 { font-family: 'Marcellus', serif; font-size: 1.4rem; color: var(--vert-fonce); }
.topbar-sub { font-size: 0.82rem; color: var(--texte-doux); margin-top: 0.15rem; }
.main-body { padding: 1.75rem 2rem; }

.state-msg { text-align: center; padding: 4rem 2rem; color: var(--texte-doux); }
.state-msg.empty { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.state-msg.empty svg { color: #ccc; }

.commandes-list { display: flex; flex-direction: column; gap: 1.25rem; }

.commande-card { background: var(--creme); border-radius: 16px; box-shadow: var(--ombre); overflow: hidden; }

.card-header {
  background: var(--vert-fonce); padding: 1rem 1.5rem;
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 0.75rem;
}
.card-identity { display: flex; align-items: center; gap: 0.9rem; }
.avatar {
  width: 42px; height: 42px; border-radius: 50%;
  background: rgba(255,255,255,0.15); color: #fff;
  font-family: 'Marcellus', serif; font-size: 1rem;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.card-identity strong { color: #fff; font-size: 1rem; display: block; }
.type-pill {
  display: inline-block; margin-left: 0.5rem; padding: 1px 8px; border-radius: 20px;
  background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.85);
  font-size: 0.75rem; text-transform: capitalize;
}
.entreprise { display: block; font-size: 0.82rem; color: rgba(255,255,255,0.65); margin-top: 0.15rem; }
.card-dates { text-align: right; }
.date-row { font-size: 0.82rem; color: rgba(255,255,255,0.7); line-height: 1.6; }
.date-row span, .date-row strong { color: rgba(255,255,255,0.85); }
.date-row.retrait strong { color: var(--orange); font-size: 0.92rem; }
.date-label { margin-right: 0.4rem; opacity: 0.7; }

.card-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

.contact-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.contact-chip {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.35rem 0.85rem; border-radius: 30px;
  border: 1.5px solid #e0d9ca; font-size: 0.85rem; color: var(--vert);
  background: #f0ebe2; transition: background 0.15s;
}
.contact-chip:hover { background: #e5dfd5; }

.lignes-section h4 { font-family: 'Marcellus', serif; font-size: 0.95rem; color: var(--vert-fonce); margin-bottom: 0.65rem; }
.lignes-grid { display: flex; flex-direction: column; gap: 0.4rem; }
.ligne-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.45rem 0.85rem; background: var(--beige-fonce); border-radius: 8px;
}
.ligne-nom { font-size: 0.9rem; }
.ligne-qty { font-family: 'Marcellus', serif; font-size: 0.9rem; color: var(--terre); }

.message-block {
  display: flex; gap: 0.6rem; align-items: flex-start;
  padding: 0.85rem 1rem; background: #f0ebe2; border-radius: 10px;
  font-size: 0.88rem; color: var(--texte-doux); line-height: 1.6;
}
.message-block svg { color: var(--vert); flex-shrink: 0; margin-top: 2px; }

@media (max-width: 860px) {
  .main-body { padding: 1.25rem; }
  .card-header { flex-direction: column; }
  .card-dates { text-align: left; }
}
</style>
