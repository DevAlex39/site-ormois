<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-overlay">
        <div class="container">
          <h1>La Ferme de l'Ormois</h1>
          <p class="hero-sub">Maraîchage en circuit court à Marandeuil, Côte-d'Or</p>
          <div class="hero-actions">
            <NuxtLink to="/produits" class="btn btn-primary">Voir nos produits</NuxtLink>
            <NuxtLink to="/commander" class="btn btn-secondary">Passer une commande</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Présentation -->
    <section class="section">
      <div class="container">
        <div class="about-grid">
          <div class="about-text">
            <h2 class="section-title">Notre exploitation</h2>
            <p>
              Bienvenue à la Ferme de l'Ormois ! Nous sommes une ferme maraîchère familiale installée
              à Marandeuil, en Côte-d'Or. Nous cultivons des légumes frais et de saison, dans le
              respect de la terre et des hommes.
            </p>
            <p>
              Notre engagement : vous proposer des produits cultivés avec soin, récoltés au bon moment
              et disponibles en vente directe à la ferme ou sur commande.
            </p>
            <NuxtLink to="/contact" class="btn btn-secondary" style="margin-top:1rem">Nous contacter</NuxtLink>
          </div>
          <div class="about-values">
            <div class="value-card" v-for="v in values" :key="v.title">
              <span class="value-icon">{{ v.icon }}</span>
              <h4>{{ v.title }}</h4>
              <p>{{ v.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Produits vedettes -->
    <section class="section bg-beige">
      <div class="container">
        <h2 class="section-title">Nos produits du moment</h2>
        <p class="section-subtitle">Disponibles selon la saison et les récoltes</p>
        <div class="products-grid" v-if="produits.length">
          <ProductCard v-for="p in produits.slice(0,4)" :key="p.id" :product="p" />
        </div>
        <NuxtLink to="/produits" class="btn btn-primary" style="margin-top:2rem">Voir tous les produits</NuxtLink>
      </div>
    </section>

    <!-- Carte -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Nous trouver</h2>
        <p class="section-subtitle">7 BIS Route de l'Ormois, 21270 Marandeuil</p>
        <div class="map-wrapper">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=5.1,47.28,5.2,47.36&layer=mapnik&marker=47.328,5.151"
            width="100%" height="400" frameborder="0" scrolling="no"
            style="border-radius:10px"
            title="Localisation de la Ferme de l'Ormois"
          ></iframe>
        </div>
        <p style="margin-top:0.5rem;font-size:0.85rem;color:#666">
          <a href="https://www.openstreetmap.org/?mlat=47.328&mlon=5.151#map=14/47.328/5.151" target="_blank" rel="noopener">
            Ouvrir dans OpenStreetMap ↗
          </a>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: produits } = await useFetch('/api/produits')
const values = [
  { icon: '🌱', title: 'Culture raisonnée', desc: 'Nous privilégions des méthodes respectueuses de l\'environnement et des sols.' },
  { icon: '🥕', title: 'Produits frais', desc: 'Récoltés à maturité et disponibles rapidement après la cueillette.' },
  { icon: '🤝', title: 'Circuit court', desc: 'Vente directe, sans intermédiaire, pour une juste rémunération.' },
]

useHead({ title: 'La Ferme de l\'Ormois — Maraîchage local à Marandeuil' })
</script>

<style scoped>
.hero {
  height: 520px;
  background: linear-gradient(135deg, var(--vert-fonce) 0%, var(--vert) 100%);
  position: relative;
  display: flex;
  align-items: center;
}
.hero-overlay {
  width: 100%;
  color: var(--blanc);
}
.hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 0.5rem; }
.hero-sub { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.hero-actions .btn-secondary { background: rgba(255,255,255,0.15); color: var(--blanc); border-color: rgba(255,255,255,0.4); }
.hero-actions .btn-secondary:hover { background: rgba(255,255,255,0.25); }

.section { padding: 4rem 0; }
.bg-beige { background: var(--beige-fonce); }

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}
.about-text p { margin-bottom: 1rem; line-height: 1.8; }
.about-values { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.value-card {
  background: var(--blanc);
  padding: 1.25rem;
  border-radius: 10px;
  box-shadow: var(--ombre);
}
.value-icon { font-size: 1.75rem; display: block; margin-bottom: 0.5rem; }
.value-card h4 { color: var(--vert-fonce); margin-bottom: 0.4rem; }
.value-card p { font-size: 0.85rem; color: #666; }

.map-wrapper { border-radius: 10px; overflow: hidden; box-shadow: var(--ombre); }

@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-values { grid-template-columns: 1fr; }
}
</style>
