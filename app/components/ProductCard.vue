<template>
  <div class="card" :class="{ selected }">
    <div class="card-img">
      <img v-if="product.image" :src="product.image" :alt="product.nom" />
      <div v-else class="card-img-placeholder">🥕</div>
    </div>
    <div class="card-body">
      <h3>{{ product.nom }}</h3>
      <p class="card-desc">{{ product.description }}</p>
      <div class="card-meta">
        <span class="price" v-if="product.prix">{{ product.prix }} € / {{ product.unite }}</span>
        <span class="unit" v-else>{{ product.unite }}</span>
        <span class="badge">{{ product.categorie }}</span>
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
</script>

<style scoped>
.card {
  background: var(--blanc);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--ombre);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 2px solid transparent;
}
.card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
.card.selected { border-color: var(--vert); }
.card-img { height: 160px; background: var(--beige-fonce); overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.card-img-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
.card-body { padding: 1rem; }
.card-body h3 { font-size: 1.05rem; margin-bottom: 0.3rem; color: var(--vert-fonce); }
.card-desc { font-size: 0.85rem; color: #666; margin-bottom: 0.75rem; }
.card-meta { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.price { font-weight: bold; color: var(--vert); }
.unit { font-size: 0.85rem; color: #888; }
.badge {
  font-size: 0.75rem;
  background: var(--beige-fonce);
  color: var(--vert-fonce);
  padding: 2px 8px;
  border-radius: 20px;
}
</style>
