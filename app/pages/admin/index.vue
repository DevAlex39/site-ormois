<template>
  <div class="admin-layout">
    <AdminSidebar />

    <main class="admin-main">
      <div class="admin-topbar">
        <h1>Tableau de bord</h1>
      </div>

      <div class="dash-cards">
        <NuxtLink to="/admin/produits" class="dash-card">
          <div class="dash-icon vert" v-html="icons.leaf"></div>
          <div>
            <h3>Produits</h3>
            <p>Gérer le catalogue en ligne</p>
          </div>
          <span class="dash-arrow" v-html="icons.chevron"></span>
        </NuxtLink>
        <NuxtLink to="/admin/commandes" class="dash-card">
          <div class="dash-icon terre" v-html="icons.orders"></div>
          <div>
            <h3>Commandes</h3>
            <p>Consulter les demandes reçues</p>
          </div>
          <span class="dash-arrow" v-html="icons.chevron"></span>
        </NuxtLink>
        <NuxtLink to="/admin/personnalisation" class="dash-card">
          <div class="dash-icon olive" v-html="icons.paint"></div>
          <div>
            <h3>Personnalisation</h3>
            <p>Modifier les textes et la galerie</p>
          </div>
          <span class="dash-arrow" v-html="icons.chevron"></span>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const icons = {
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  orders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  paint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>`,
}

useHead({ title: 'Admin — La Ferme de l\'Ormois' })
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }

.admin-main { flex: 1; background: var(--beige-fonce); display: flex; flex-direction: column; }
.admin-topbar {
  background: var(--creme); border-bottom: 1px solid #e0d9ca;
  padding: 1.25rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.admin-topbar h1 { font-family: 'Marcellus', serif; font-size: 1.5rem; color: var(--vert-fonce); }

.dash-cards {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem; padding: 2rem;
}
.dash-card {
  background: var(--creme); border-radius: 16px; padding: 1.5rem 1.75rem;
  box-shadow: var(--ombre); display: flex; align-items: center; gap: 1.25rem;
  border: 1.5px solid transparent; transition: border-color 0.2s, transform 0.2s;
}
.dash-card:hover { border-color: var(--vert); transform: translateY(-2px); }
.dash-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.dash-icon.vert { background: #e0f0e3; color: var(--vert); }
.dash-icon.terre { background: #f5e6db; color: var(--terre); }
.dash-icon.olive { background: #e8eedd; color: var(--vert-fonce); }
.dash-card h3 { font-family: 'Marcellus', serif; font-size: 1.1rem; color: var(--vert-fonce); margin-bottom: 0.2rem; }
.dash-card p { font-size: 0.85rem; color: var(--texte-doux); }
.dash-arrow { margin-left: auto; color: #ccc; }
</style>
