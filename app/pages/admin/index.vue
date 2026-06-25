<template>
  <div class="admin-layout">
    <AdminSidebar />

    <main class="admin-main">
      <div class="admin-topbar">
        <div>
          <h1>Tableau de bord</h1>
          <p class="topbar-sub">{{ monthLabel }}</p>
        </div>
      </div>

      <div class="dash-body">
        <!-- KPI cards -->
        <div class="kpi-grid">
          <div class="kpi-card green">
            <div class="kpi-icon" v-html="icons.euro"></div>
            <div class="kpi-info">
              <span class="kpi-label">CA du mois</span>
              <strong class="kpi-val">{{ stats ? formatPrice(stats.caMois) + ' €' : '—' }}</strong>
              <span class="kpi-sub">{{ stats?.nbMois ?? 0 }} commande(s) ce mois</span>
            </div>
          </div>
          <div class="kpi-card orange">
            <div class="kpi-icon" v-html="icons.clock"></div>
            <div class="kpi-info">
              <span class="kpi-label">En attente</span>
              <strong class="kpi-val">{{ stats?.nbAttente ?? 0 }}</strong>
              <span class="kpi-sub">commande(s) à traiter</span>
            </div>
          </div>
          <div class="kpi-card terre">
            <div class="kpi-icon" v-html="icons.orders"></div>
            <div class="kpi-info">
              <span class="kpi-label">Total commandes</span>
              <strong class="kpi-val">{{ stats?.nbTotal ?? 0 }}</strong>
              <span class="kpi-sub">depuis le début</span>
            </div>
          </div>
          <div class="kpi-card olive">
            <div class="kpi-icon" v-html="icons.leaf"></div>
            <div class="kpi-info">
              <span class="kpi-label">Produit phare</span>
              <strong class="kpi-val truncate">{{ stats?.topProduits?.[0]?.nom ?? '—' }}</strong>
              <span class="kpi-sub">{{ stats?.topProduits?.[0] ? stats.topProduits[0].qte + ' ' + stats.topProduits[0].unite + ' vendus' : 'aucune vente' }}</span>
            </div>
          </div>
        </div>

        <!-- Graphiques -->
        <div class="charts-row" v-if="stats">
          <!-- Barres CA mensuel -->
          <div class="chart-card">
            <div class="chart-head">
              <h3>Chiffre d'affaires (6 mois)</h3>
              <span class="chart-legend"><span class="dot green"></span>CA estimé (€)</span>
            </div>
            <div class="bar-chart">
              <div class="bar-col" v-for="m in stats.mois6" :key="m.mois">
                <div class="bar-wrap">
                  <div
                    class="bar"
                    :style="{ height: barHeight(m.ca) + '%' }"
                    :title="formatPrice(m.ca) + ' €'"
                  ></div>
                </div>
                <div class="bar-label">{{ m.mois }}</div>
                <div class="bar-val">{{ m.ca > 0 ? formatPrice(m.ca) + '€' : '—' }}</div>
              </div>
            </div>
          </div>

          <!-- Top produits -->
          <div class="chart-card">
            <div class="chart-head">
              <h3>Top 5 produits vendus</h3>
              <span class="chart-legend"><span class="dot terre"></span>Quantité totale</span>
            </div>
            <div class="top-list" v-if="stats.topProduits.length">
              <div class="top-item" v-for="(p, i) in stats.topProduits" :key="p.nom">
                <div class="top-rank">{{ i + 1 }}</div>
                <div class="top-info">
                  <span class="top-nom">{{ p.nom }}</span>
                  <div class="top-bar-wrap">
                    <div class="top-bar" :style="{ width: topBarWidth(p.qte) + '%' }"></div>
                  </div>
                </div>
                <div class="top-meta">
                  <span class="top-qte">{{ p.qte }} {{ p.unite }}</span>
                  <span class="top-ca" v-if="p.ca > 0">{{ formatPrice(p.ca) }} €</span>
                </div>
              </div>
            </div>
            <p v-else class="empty-chart">Aucune vente enregistrée</p>
          </div>
        </div>

        <!-- Répartition statuts -->
        <div class="statuts-row" v-if="stats">
          <div class="statut-kpi" v-for="s in STATUTS" :key="s.key">
            <span class="statut-dot" :class="s.key"></span>
            <span class="statut-num">{{ stats.statuts[s.key] ?? 0 }}</span>
            <span class="statut-lbl">{{ s.label }}</span>
          </div>
        </div>

        <!-- Raccourcis nav -->
        <div class="dash-cards">
          <NuxtLink to="/admin/produits" class="dash-card">
            <div class="dash-icon vert" v-html="icons.leaf"></div>
            <div><h3>Produits</h3><p>Gérer le catalogue en ligne</p></div>
            <span class="dash-arrow" v-html="icons.chevron"></span>
          </NuxtLink>
          <NuxtLink to="/admin/commandes" class="dash-card">
            <div class="dash-icon terre" v-html="icons.orders"></div>
            <div><h3>Commandes</h3><p>Consulter les demandes reçues</p></div>
            <span class="dash-arrow" v-html="icons.chevron"></span>
          </NuxtLink>
          <NuxtLink to="/admin/personnalisation" class="dash-card">
            <div class="dash-icon olive" v-html="icons.paint"></div>
            <div><h3>Personnalisation</h3><p>Modifier les textes et la galerie</p></div>
            <span class="dash-arrow" v-html="icons.chevron"></span>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { data: stats } = await useFetch<{
  caMois: number; nbAttente: number; nbMois: number; nbTotal: number
  mois6: { mois: string; ca: number; nb: number }[]
  topProduits: { nom: string; qte: number; ca: number; unite: string }[]
  statuts: Record<string, number>
}>('/api/admin/stats')

const monthLabel = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

const STATUTS = [
  { key: 'en_attente', label: 'En attente' },
  { key: 'confirmee',  label: 'Confirmées' },
  { key: 'prete',      label: 'Prêtes' },
  { key: 'recuperee',  label: 'Récupérées' },
]

function formatPrice(v: number) { return Number(v).toFixed(2).replace('.', ',') }

const maxCa = computed(() => Math.max(...(stats.value?.mois6.map(m => m.ca) ?? [1]), 1))
function barHeight(ca: number) { return Math.max((ca / maxCa.value) * 100, ca > 0 ? 4 : 0) }

const maxQte = computed(() => Math.max(...(stats.value?.topProduits.map(p => p.qte) ?? [1]), 1))
function topBarWidth(qte: number) { return Math.max((qte / maxQte.value) * 100, 4) }

const icons = {
  euro: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  orders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  paint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>`,
}

useHead({ title: 'Admin — La Ferme de l\'Ormois' })
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-main { flex: 1; background: var(--beige-fonce); display: flex; flex-direction: column; min-width: 0; }
.admin-topbar {
  background: var(--creme); border-bottom: 1px solid #e0d9ca;
  padding: 1.25rem 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.admin-topbar h1 { font-family: 'Marcellus', serif; font-size: 1.5rem; color: var(--vert-fonce); }
.topbar-sub { font-size: 0.82rem; color: var(--texte-doux); margin-top: 0.15rem; text-transform: capitalize; }

.dash-body { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1.75rem; }

/* ===== KPI ===== */
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.kpi-card {
  background: var(--creme); border-radius: 16px; padding: 1.25rem 1.5rem;
  box-shadow: var(--ombre); display: flex; align-items: center; gap: 1rem;
  border-left: 4px solid transparent;
}
.kpi-card.green  { border-color: var(--vert); }
.kpi-card.orange { border-color: #e8a020; }
.kpi-card.terre  { border-color: var(--terre); }
.kpi-card.olive  { border-color: #7a9e3f; }

.kpi-icon {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.kpi-card.green  .kpi-icon { background: #e0f0e3; color: var(--vert); }
.kpi-card.orange .kpi-icon { background: #fef3e2; color: #e8a020; }
.kpi-card.terre  .kpi-icon { background: #f5e6db; color: var(--terre); }
.kpi-card.olive  .kpi-icon { background: #eef2e6; color: #7a9e3f; }

.kpi-info { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
.kpi-label { font-size: 0.73rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--texte-doux); font-weight: 600; }
.kpi-val { font-family: 'Marcellus', serif; font-size: 1.6rem; color: var(--vert-fonce); line-height: 1.1; }
.kpi-val.truncate { font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kpi-sub { font-size: 0.78rem; color: var(--texte-doux); }

/* ===== CHARTS ===== */
.charts-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: 1.25rem; }
.chart-card { background: var(--creme); border-radius: 16px; padding: 1.5rem; box-shadow: var(--ombre); }
.chart-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
.chart-head h3 { font-family: 'Marcellus', serif; font-size: 1rem; color: var(--vert-fonce); }
.chart-legend { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: var(--texte-doux); }
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }
.dot.green { background: var(--vert); }
.dot.terre { background: var(--terre); }

/* Bar chart CA */
.bar-chart { display: flex; align-items: flex-end; gap: 0.5rem; height: 160px; padding-bottom: 2rem; position: relative; }
.bar-chart::before {
  content: ''; position: absolute; bottom: 2rem; left: 0; right: 0;
  border-top: 1px dashed #e0d9ca;
}
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.3rem; height: 100%; justify-content: flex-end; }
.bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.bar { width: 100%; max-width: 36px; margin: 0 auto; background: linear-gradient(to top, var(--vert), #6aad74); border-radius: 6px 6px 0 0; transition: height 0.4s ease; min-height: 2px; }
.bar-label { font-size: 0.7rem; color: var(--texte-doux); text-align: center; }
.bar-val { font-size: 0.65rem; color: var(--vert-fonce); font-weight: 600; text-align: center; white-space: nowrap; }

/* Top produits */
.top-list { display: flex; flex-direction: column; gap: 0.9rem; }
.top-item { display: flex; align-items: center; gap: 0.75rem; }
.top-rank { width: 22px; height: 22px; border-radius: 50%; background: var(--beige-fonce); font-size: 0.72rem; font-weight: 700; color: var(--texte-doux); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.top-item:first-child .top-rank { background: #fde7b0; color: #a06400; }
.top-info { flex: 1; min-width: 0; }
.top-nom { font-size: 0.85rem; color: var(--texte); display: block; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-bar-wrap { height: 6px; background: #f0ebe2; border-radius: 3px; overflow: hidden; }
.top-bar { height: 100%; background: linear-gradient(to right, var(--terre), #d4845a); border-radius: 3px; transition: width 0.4s ease; }
.top-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.05rem; flex-shrink: 0; }
.top-qte { font-size: 0.78rem; font-weight: 600; color: var(--terre); }
.top-ca { font-size: 0.72rem; color: var(--texte-doux); }
.empty-chart { font-size: 0.85rem; color: var(--texte-doux); text-align: center; padding: 1.5rem 0; }

/* ===== STATUTS ===== */
.statuts-row { display: flex; gap: 1rem; background: var(--creme); border-radius: 14px; padding: 1rem 1.5rem; box-shadow: var(--ombre); flex-wrap: wrap; }
.statut-kpi { display: flex; align-items: center; gap: 0.6rem; flex: 1; min-width: 120px; }
.statut-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.statut-dot.en_attente { background: #c8b89a; }
.statut-dot.confirmee  { background: var(--vert); }
.statut-dot.prete      { background: #e8a020; }
.statut-dot.recuperee  { background: #bbb; }
.statut-num { font-family: 'Marcellus', serif; font-size: 1.4rem; color: var(--vert-fonce); }
.statut-lbl { font-size: 0.78rem; color: var(--texte-doux); }

/* ===== NAV CARDS ===== */
.dash-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
.dash-card {
  background: var(--creme); border-radius: 16px; padding: 1.25rem 1.5rem;
  box-shadow: var(--ombre); display: flex; align-items: center; gap: 1.1rem;
  border: 1.5px solid transparent; transition: border-color 0.2s, transform 0.2s;
}
.dash-card:hover { border-color: var(--vert); transform: translateY(-2px); }
.dash-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dash-icon.vert  { background: #e0f0e3; color: var(--vert); }
.dash-icon.terre { background: #f5e6db; color: var(--terre); }
.dash-icon.olive { background: #eef2e6; color: #7a9e3f; }
.dash-card h3 { font-family: 'Marcellus', serif; font-size: 1rem; color: var(--vert-fonce); margin-bottom: 0.15rem; }
.dash-card p { font-size: 0.82rem; color: var(--texte-doux); }
.dash-arrow { margin-left: auto; color: #ccc; }

@media (max-width: 900px) {
  .charts-row { grid-template-columns: 1fr; }
  .dash-body { padding: 1.25rem; }
}
</style>
