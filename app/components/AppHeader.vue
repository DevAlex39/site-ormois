<template>
  <header class="header">
    <div class="container header-inner">
      <NuxtLink to="/" class="logo">
        <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 22V12"/>
          <path d="M12 12C12 12 7 9 7 5a5 5 0 0 1 10 0c0 4-5 7-5 7z"/>
          <path d="M12 12C12 12 17 9 17 5"/>
        </svg>
        <span class="logo-text">La Ferme de l'Ormois</span>
      </NuxtLink>
      <button class="burger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <nav :class="['nav', { open: menuOpen }]">
        <NuxtLink to="/" @click="menuOpen = false">Accueil</NuxtLink>
        <NuxtLink to="/produits" @click="menuOpen = false">Nos produits</NuxtLink>
        <NuxtLink to="/commander" @click="menuOpen = false">Commander</NuxtLink>
        <NuxtLink to="/contact" @click="menuOpen = false">Contact</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false)
</script>

<style scoped>
.header {
  background: var(--vert-fonce);
  color: var(--blanc);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--blanc);
}
.logo-icon { width: 1.6rem; height: 1.6rem; flex-shrink: 0; }
.nav { display: flex; gap: 1.5rem; }
.nav a { color: rgba(255,255,255,0.85); transition: color 0.2s; font-size: 0.95rem; }
.nav a:hover, .nav a.router-link-active { color: var(--blanc); border-bottom: 2px solid var(--vert-clair); }
.burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.burger span { display: block; width: 24px; height: 2px; background: var(--blanc); border-radius: 2px; }

@media (max-width: 640px) {
  .burger { display: flex; }
  .nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0; right: 0;
    background: var(--vert-fonce);
    flex-direction: column;
    padding: 1rem 1.5rem;
    gap: 1rem;
  }
  .nav.open { display: flex; }
}
</style>
