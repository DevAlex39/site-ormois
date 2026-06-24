<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader v-if="!isAdmin" />
    <main>
      <NuxtPage />
    </main>
    <AppFooter v-if="!isAdmin && route.path !== '/'" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>
