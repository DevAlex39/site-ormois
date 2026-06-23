<template>
  <div class="container" style="padding-top:2rem;padding-bottom:3rem;max-width:900px">
    <div class="admin-header">
      <h1>Administration</h1>
      <button class="btn btn-secondary" @click="logout">Déconnexion</button>
    </div>

    <div class="admin-cards">
      <NuxtLink to="/admin/produits" class="admin-card">
        <span class="admin-card-icon">🥕</span>
        <h3>Gérer les produits</h3>
        <p>Ajouter, modifier ou supprimer les produits disponibles à la vente.</p>
      </NuxtLink>
      <NuxtLink to="/admin/commandes" class="admin-card">
        <span class="admin-card-icon">📋</span>
        <h3>Voir les commandes</h3>
        <p>Consulter les commandes reçues et leur statut.</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin-auth' })

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  navigateTo('/admin/login')
}

useHead({ title: 'Admin — La Ferme de l\'Ormois' })
</script>

<style scoped>
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.admin-header h1 { font-size: 1.75rem; color: var(--vert-fonce); }
.admin-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
.admin-card {
  background: var(--blanc);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: var(--ombre);
  transition: transform 0.2s;
  display: block;
  border: 2px solid transparent;
}
.admin-card:hover { transform: translateY(-3px); border-color: var(--vert); }
.admin-card-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
.admin-card h3 { color: var(--vert-fonce); margin-bottom: 0.5rem; }
.admin-card p { color: #666; font-size: 0.9rem; }
</style>
