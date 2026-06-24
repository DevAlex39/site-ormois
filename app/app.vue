<!-- ============================================================
     app.vue
     Le footer global est masqué sur l'accueil : la section Contact
     de la page d'accueil intègre déjà son propre pied de page.
     ============================================================ -->
<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main>
      <NuxtPage />
    </main>
    <AppFooter v-if="route.path !== '/'" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
