<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <img src="/photo_01.jpg" alt="La Ferme de l'Ormois" class="hero-bg" />
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
              <span class="value-icon" v-html="v.icon"></span>
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

    <!-- Galerie -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">La ferme en images</h2>
        <p class="section-subtitle">Découvrez notre quotidien et nos récoltes</p>
        <div class="gallery-grid">
          <div v-for="n in galleryPhotos" :key="n" class="gallery-item" @click="openPhoto(n)">
            <img :src="`/photo_${String(n).padStart(2,'0')}.jpg`" :alt="`Photo ferme ${n}`" loading="lazy" />
          </div>
        </div>
      </div>

      <!-- Lightbox -->
      <div v-if="lightbox !== null" class="lightbox" @click.self="lightbox = null">
        <button class="lb-close" @click="lightbox = null" aria-label="Fermer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <button class="lb-prev" @click="prevPhoto" aria-label="Précédent">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <img :src="`/photo_${String(lightbox).padStart(2,'0')}.jpg`" :alt="`Photo ferme ${lightbox}`" class="lb-img" />
        <button class="lb-next" @click="nextPhoto" aria-label="Suivant">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
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

const svgLeaf = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`
const svgCarrot = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.27 16.36C-.4 11.13 2.26 4.6 7.4 2.7c.8-.3 1.44.5 1.1 1.27L5.6 10.1l3.8-1.1c.8-.24 1.5.6 1.1 1.36L7.5 16.5"/><path d="M8.5 16.5c2 1.5 4.5 2 7 1.5"/><path d="M8.5 16.5c-.5 2-1 4 1 5.5"/></svg>`
const svgHandshake = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.36-7.94 1.06-1.06a5.4 5.4 0 0 0 0-7.65z"/></svg>`

const values = [
  { icon: svgLeaf, title: 'Culture raisonnée', desc: 'Nous privilégions des méthodes respectueuses de l\'environnement et des sols.' },
  { icon: svgCarrot, title: 'Produits frais', desc: 'Récoltés à maturité et disponibles rapidement après la cueillette.' },
  { icon: svgHandshake, title: 'Circuit court', desc: 'Vente directe, sans intermédiaire, pour une juste rémunération.' },
]

const galleryPhotos = [2,3,4,5,6,7,8,9,10,11,12]
const lightbox = ref<number|null>(null)

function openPhoto(n: number) { lightbox.value = n }
function prevPhoto() {
  const idx = galleryPhotos.indexOf(lightbox.value!)
  lightbox.value = galleryPhotos[(idx - 1 + galleryPhotos.length) % galleryPhotos.length]
}
function nextPhoto() {
  const idx = galleryPhotos.indexOf(lightbox.value!)
  lightbox.value = galleryPhotos[(idx + 1) % galleryPhotos.length]
}

useHead({ title: 'La Ferme de l\'Ormois — Maraîchage local à Marandeuil' })
</script>

<style scoped>
.hero {
  height: 520px;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}
.hero-overlay {
  position: relative;
  z-index: 1;
  width: 100%;
  color: var(--blanc);
  background: linear-gradient(to right, rgba(20,50,20,0.72) 0%, rgba(20,50,20,0.3) 100%);
  padding: 3rem 0;
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
.value-icon { display: block; margin-bottom: 0.5rem; }
.value-icon :deep(svg) { width: 2rem; height: 2rem; stroke: var(--vert); }
.value-card h4 { color: var(--vert-fonce); margin-bottom: 0.4rem; }
.value-card p { font-size: 0.85rem; color: #666; }

.map-wrapper { border-radius: 10px; overflow: hidden; box-shadow: var(--ombre); }

/* Galerie */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}
.gallery-item {
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.gallery-item:hover img { transform: scale(1.05); }

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.88);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lb-img {
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 6px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}
.lb-close, .lb-prev, .lb-next {
  position: absolute;
  background: rgba(255,255,255,0.12);
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.lb-close:hover, .lb-prev:hover, .lb-next:hover { background: rgba(255,255,255,0.25); }
.lb-close { top: 1rem; right: 1rem; }
.lb-prev { left: 1rem; top: 50%; transform: translateY(-50%); }
.lb-next { right: 1rem; top: 50%; transform: translateY(-50%); }
.lb-close svg, .lb-prev svg, .lb-next svg { width: 1.2rem; height: 1.2rem; }

@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-values { grid-template-columns: 1fr; }
}
</style>
