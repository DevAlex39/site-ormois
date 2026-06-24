<!-- ============================================================
     ProductCard.vue — carte produit (restylée)
     Câblage et props inchangés.
     À coller dans : app/components/ProductCard.vue
     ============================================================ -->
<template>
  <div class="card" :class="{ selected }">
    <div class="card-img">
      <img v-if="product.image" :src="product.image" :alt="product.nom" />
      <div v-else class="card-img-placeholder" v-html="leaf"></div>
      <span class="badge" v-if="product.categorie">{{ product.categorie }}</span>
    </div>
    <div class="card-body">
      <h3>{{ product.nom }}</h3>
      <p class="card-desc">{{ product.description }}</p>
      <div class="card-meta">
        <span class="price" v-if="product.prix">{{ formatPrice(product.prix) }} € / {{ product.unite }}</span>
        <span class="unit" v-else>{{ product.unite }}</span>
        <span class="order">Commander
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  product: {
    id: number
    nom: string
    description: string
    prix: number | null
    unite: string
    categorie: string
    image: string | null
  }
  selected?: boolean
}>()
function formatPrice(v: number) { return Number(v).toFixed(2).replace('.', ',') }
const leaf = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" width="44" height="44"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`
</script>

<style scoped>
.card {
  background: var(--creme); border-radius: 18px; overflow: hidden;
  box-shadow: var(--ombre); transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer; border: 2px solid transparent;
}
.card:hover { transform: translateY(-5px); box-shadow: var(--ombre-forte); }
.card.selected { border-color: var(--vert); }
.card-img { height: 168px; background: #e7dcc6; overflow: hidden; position: relative; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.card-img-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; color: var(--vert-clair); }
.badge {
  position: absolute; top: 12px; left: 12px;
  font-size: 0.7rem; letter-spacing: 0.5px;
  background: rgba(47,107,57,0.92); color: #fff; padding: 0.25rem 0.7rem; border-radius: 30px;
}
.card-body { padding: 1rem 1.1rem 1.15rem; }
.card-body h3 { font-size: 1.3rem; margin-bottom: 0.3rem; }
.card-desc { font-size: 0.85rem; line-height: 1.5; color: #837a68; margin-bottom: 0.9rem; min-height: 40px; }
.card-meta { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
.price { font-family: 'Marcellus', serif; font-size: 1.2rem; color: var(--terre); }
.unit { font-size: 0.9rem; color: #888; }
.order { display: inline-flex; align-items: center; gap: 0.3rem; font-weight: 600; font-size: 0.82rem; color: var(--vert); }
</style>
