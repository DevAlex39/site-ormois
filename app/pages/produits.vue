<template>
  <div class="container" style="padding-top:2.5rem;padding-bottom:3rem">
    <h1 class="section-title">Nos produits</h1>
    <p class="section-subtitle">Sélectionnez les produits qui vous intéressent pour passer commande</p>

    <!-- Filtres catégories -->
    <div class="categories" v-if="categories.length > 1">
      <button
        v-for="cat in ['Tous', ...categories]"
        :key="cat"
        class="cat-btn"
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
      <NuxtLink to="/commander" class="btn btn-primary">Passer une commande →</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: produits, pending } = await useFetch('/api/produits')
const activeCategory = ref('Tous')
const router = useRouter()

const categories = computed(() => {
  if (!produits.value) return []
  return [...new Set(produits.value.map((p: any) => p.categorie))].filter(Boolean)
})

const filtered = computed(() => {
  if (!produits.value) return []
  if (activeCategory.value === 'Tous') return produits.value
  return produits.value.filter((p: any) => p.categorie === activeCategory.value)
})

function goOrder(p: any) {
  router.push({ path: '/commander', query: { produit: p.id } })
}

useHead({ title: 'Nos produits — La Ferme de l\'Ormois' })
</script>

<style scoped>
.categories { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
.cat-btn {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
  background: var(--blanc);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.cat-btn.active, .cat-btn:hover { background: var(--vert); color: var(--blanc); border-color: var(--vert); }
.loading, .empty { text-align: center; padding: 3rem; color: #888; }
.order-cta { margin-top: 2.5rem; text-align: center; }
</style>
