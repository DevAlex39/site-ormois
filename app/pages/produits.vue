<!-- ============================================================
     produits.vue — page produits dédiée (accès direct /produits)
     Câblage inchangé. À coller dans : app/pages/produits.vue
     ============================================================ -->
<template>
  <div class="page">
    <div class="container">
      <div class="page-head">
        <span class="eyebrow">Au panier</span>
        <h1 class="section-title">Nos produits</h1>
        <p class="section-subtitle">Sélectionnez les produits qui vous intéressent pour passer commande</p>
      </div>

      <div class="categories" v-if="categories.length > 1">
        <button
          v-for="cat in ['Tous', ...categories]"
          :key="cat"
          class="cat-pill"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >{{ cat }}</button>
      </div>

      <div v-if="pending" class="loading">Chargement des produits…</div>
      <div v-else-if="!filtered.length" class="empty">Aucun produit disponible pour le moment.</div>
      <div v-else class="products-grid">
        <div v-for="p in filtered" :key="p.id" @click="goOrder(p)">
          <ProductCard :product="p" />
        </div>
      </div>

      <div class="order-cta" v-if="filtered.length">
        <NuxtLink to="/commander" class="btn btn-accent">Passer une commande →</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: produits, pending } = await useFetch<any[]>('/api/produits')
const activeCategory = ref('Tous')
const router = useRouter()

const categories = computed(() => {
  if (!produits.value) return []
  return [...new Set(produits.value.map((p) => p.categorie))].filter(Boolean)
})
const filtered = computed(() => {
  if (!produits.value) return []
  if (activeCategory.value === 'Tous') return produits.value
  return produits.value.filter((p) => p.categorie === activeCategory.value)
})
function goOrder(p: any) {
  router.push({ path: '/commander', query: { produit: p.id } })
}

useHead({ title: 'Nos produits — La Ferme de l\'Ormois' })
</script>

<style scoped>
.page { padding: calc(var(--header-h) + 2.5rem) 0 4rem; min-height: 100vh; }
.page-head { text-align: center; margin-bottom: 2rem; }
.categories { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; margin-bottom: 2.5rem; }
.cat-pill {
  font-family: 'Spectral', serif; font-size: 0.9rem;
  padding: 0.5rem 1.1rem; border-radius: 40px;
  border: 1.5px solid #d8cdb5; background: var(--creme); color: #5a5446;
  cursor: pointer; transition: all 0.2s;
}
.cat-pill.active, .cat-pill:hover { background: var(--vert); color: #fff; border-color: var(--vert); }
.loading, .empty { text-align: center; padding: 3rem; color: var(--texte-doux); }
.order-cta { margin-top: 2.5rem; text-align: center; }
</style>
