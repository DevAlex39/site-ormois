<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div v-html="logoSvg"></div>
      <span>Admin</span>
    </div>
    <nav class="sidebar-nav">
      <NuxtLink to="/admin" class="nav-item" exact-active-class="active">
        <span v-html="icons.home"></span> Tableau de bord
      </NuxtLink>
      <NuxtLink to="/admin/produits" class="nav-item" active-class="active">
        <span v-html="icons.leaf"></span> Produits
      </NuxtLink>
      <NuxtLink to="/admin/commandes" class="nav-item" active-class="active">
        <span v-html="icons.orders"></span> Commandes
      </NuxtLink>
      <NuxtLink to="/admin/personnalisation" class="nav-item" active-class="active">
        <span v-html="icons.paint"></span> Personnalisation
      </NuxtLink>
    </nav>
    <button class="nav-item logout" @click="logout">
      <span v-html="icons.logout"></span> Déconnexion
    </button>
    <NuxtLink to="/" class="nav-item back-site">
      <span v-html="icons.arrow"></span> Voir le site
    </NuxtLink>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ active?: string }>()

const logoSvg = `<svg viewBox="0 0 48 48" width="36" height="36"><circle cx="24" cy="24" r="23" fill="#1f4527"/><path d="M24 37 V21" fill="none" stroke="#f4ecdc" stroke-width="2" stroke-linecap="round"/><path d="M24 28 C17.5 28 13 23.5 13 16.5 C20 16.5 24 21 24 28 Z" fill="#f4ecdc"/><path d="M24 25 C30.5 25 35 20.5 35 13.5 C28 13.5 24 18 24 25 Z" fill="#cfe3b8"/></svg>`
const icons = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  orders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  paint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
}

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  navigateTo('/admin/login')
}
</script>

<style scoped>
.sidebar {
  width: 240px; flex-shrink: 0;
  background: var(--vert-nuit);
  display: flex; flex-direction: column;
  padding: 1.5rem 1rem;
  position: sticky; top: 0; height: 100vh;
}
.sidebar-brand {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.5rem 0.75rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 1rem;
}
.sidebar-brand span { font-family: 'Marcellus', serif; font-size: 1.1rem; color: var(--beige); letter-spacing: 1px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
.nav-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.7rem 0.85rem; border-radius: 10px;
  color: rgba(244,236,220,0.7); font-size: 0.92rem;
  transition: background 0.18s, color 0.18s;
  cursor: pointer; background: none; border: none; font-family: inherit; width: 100%; text-align: left;
}
.nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.1); color: var(--beige); }
.nav-item.active { background: rgba(47,107,57,0.45); color: #fff; }
.logout { margin-top: auto; color: rgba(244,136,110,0.8); }
.logout:hover { background: rgba(185,102,63,0.2); color: #f4a080; }
.back-site { color: rgba(244,236,220,0.45); font-size: 0.85rem; margin-top: 0.5rem; }
.back-site:hover { color: var(--beige); background: rgba(255,255,255,0.06); }
</style>
