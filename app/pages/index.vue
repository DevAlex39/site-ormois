<!-- ============================================================
     index.vue — Accueil en une seule page à défilement plein écran
     (Accueil → La Ferme → Produits → Galerie → Contact)
     À coller dans : app/pages/index.vue
     Images attendues dans /public : Accueil.jpg, Serre.jpg, photo_XX.jpg
     ============================================================ -->
<template>
  <div class="home">

    <!-- ===== ACCUEIL / HERO ===== -->
    <section id="sec-accueil" data-section="accueil" class="hero">
      <img src="/Accueil.jpg" alt="Serre de la Ferme de l'Ormois" class="hero-bg" />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="hero-kicker">{{ c.general_slogan || 'Maraîchage en circuit court · Marandeuil, Côte-d\'Or' }}</p>
        <h1 class="hero-title">La Ferme<br />de l'Ormois</h1>
        <p class="hero-sub">Des légumes frais et de saison, cultivés avec soin et récoltés au bon moment.</p>
        <div class="hero-actions">
          <button class="btn btn-cream" @click="scrollTo('produits')">Découvrir nos produits</button>
          <NuxtLink to="/commander" class="btn btn-ghost">Passer commande</NuxtLink>
          <a href="https://www.facebook.com/lafermedelormois" target="_blank" rel="noopener" class="btn btn-fb">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            Suivez-nous
          </a>
        </div>
      </div>
      <button class="scroll-cue" @click="scrollTo('ferme')" aria-label="Découvrir">
        <span>DÉCOUVRIR</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
    </section>

    <!-- ===== LA FERME ===== -->
    <section id="sec-ferme" data-section="ferme" class="ferme">
      <div class="ferme-grid">
        <div>
          <span class="eyebrow">Notre exploitation</span>
          <h2 class="section-title">{{ c.ferme_titre || 'Une agriculture biologique, au rythme des saisons' }}</h2>
          <p class="lead" v-if="c.ferme_lead1">{{ c.ferme_lead1 }}</p>
          <p class="lead" v-if="c.ferme_lead2">{{ c.ferme_lead2 }}</p>
          <NuxtLink to="/contact" class="btn btn-outline">Nous rendre visite</NuxtLink>
        </div>
        <div class="ferme-media">
          <div class="ferme-photo">
            <img :src="c.ferme_image || '/Serre.jpg'" alt="Serre de tomates en pleine culture" />
          </div>
          <div class="value-card">
            <span class="value-icon" v-html="icons.leaf"></span>
            <h4>Culture raisonnée</h4>
            <p>Des méthodes respectueuses des sols et de l'environnement.</p>
          </div>
          <div class="value-card">
            <span class="value-icon accent" v-html="icons.sun"></span>
            <h4>Fraîcheur du jour</h4>
            <p>Récoltés à maturité, disponibles juste après la cueillette.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== À PROPOS DE NOUS ===== -->
    <section id="sec-apropos" data-section="apropos" class="apropos">
      <div class="apropos-grid">
        <div class="apropos-media">
          <img :src="c.apropos_image || '/Serre.jpg'" alt="La Ferme de l'Ormois" />
          <div class="apropos-badge">
            <span class="badge-line1">{{ c.apropos_badge1 || 'Du semis' }}</span>
            <span class="badge-line2">{{ c.apropos_badge2 || "jusqu'à votre panier" }}</span>
          </div>
        </div>
        <div class="apropos-body">
          <span class="eyebrow">À propos de nous</span>
          <h2 class="section-title">{{ c.apropos_titre || "L'histoire de la Ferme de l'Ormois" }}</h2>
          <p class="lead" v-if="c.apropos_para1">{{ c.apropos_para1 }}</p>
          <p class="lead" v-if="c.apropos_para2">{{ c.apropos_para2 }}</p>
          <p class="lead" v-if="c.apropos_para3">{{ c.apropos_para3 }}</p>
          <p class="apropos-signature" v-if="c.apropos_signature">— <em>{{ c.apropos_signature }}</em></p>
        </div>
      </div>
    </section>

    <!-- ===== PRODUITS ===== -->
    <section id="sec-produits" data-section="produits" class="produits">
      <div class="inner">
        <div class="center-head">
          <span class="eyebrow">Au panier</span>
          <h2 class="section-title">Nos produits du moment</h2>
          <p class="section-subtitle">Disponibles selon la saison et les récoltes</p>
        </div>

        <div class="categories">
          <button
            v-for="cat in ['Tous', ...categories]"
            :key="cat"
            class="cat-pill"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >{{ cat }}</button>
        </div>

        <div class="products-grid" v-if="filtered.length">
          <article
            v-for="(p, i) in filtered"
            :key="p.id"
            class="prod-card"
            @click="order(p)"
          >
            <div class="prod-img">
              <img :src="p.image || fallbackImg(i)" :alt="p.nom" loading="lazy" />
              <span class="prod-cat" v-if="p.categorie">{{ p.categorie }}</span>
            </div>
            <div class="prod-body">
              <h3>{{ p.nom }}</h3>
              <p class="prod-desc">{{ p.description }}</p>
              <div class="prod-meta">
                <span class="prod-price" v-if="p.prix">{{ formatPrice(p.prix) }} € / {{ p.unite }}</span>
                <span class="prod-price" v-else>{{ p.unite }}</span>
                <span class="prod-order">Commander
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="empty">Aucun produit disponible pour le moment.</p>
      </div>
    </section>

    <!-- ===== GALERIE ===== -->
    <section id="sec-galerie" data-section="galerie" class="galerie">
      <div class="inner">
        <div class="center-head">
          <span class="eyebrow" style="color:var(--orange)">En images</span>
          <h2 class="section-title" style="color:var(--beige)">La ferme au fil des saisons</h2>
        </div>
        <div class="gallery-grid">
          <div
            v-for="(item, i) in galleryPhotos"
            :key="item.id"
            class="gallery-item"
            :class="'g' + i"
            @click="openPhoto(i)"
          >
            <img :src="item.path" alt="Photo de la ferme" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONTACT + FOOTER ===== -->
    <section id="sec-contact" data-section="contact" class="contact">
      <div class="contact-grid">
        <div>
          <span class="eyebrow" style="color:var(--orange)">Nous trouver</span>
          <h2 class="section-title" style="color:var(--beige)">Venez nous rencontrer</h2>
          <div class="info-list">
            <div class="info-block">
              <span class="info-icon" v-html="icons.pin"></span>
              <div><strong>Adresse</strong><span v-html="(c.contact_adresse || '7 BIS Route de l\'Ormois\n21270 Marandeuil, France').replace(/\n/g, '<br />')"></span></div>
            </div>
            <div class="info-block">
              <span class="info-icon" v-html="icons.phone"></span>
              <div><strong>Téléphone</strong><a :href="'tel:+33' + (c.contact_telephone || '0620499321').replace(/^0/, '').replace(/\s/g, '')">{{ c.contact_telephone || '06 20 49 93 21' }}</a></div>
            </div>
            <div class="info-block">
              <span class="info-icon" v-html="icons.mail"></span>
              <div><strong>Email</strong><a :href="'mailto:' + (c.contact_email || 'lafermedelormois@gmail.com')">{{ c.contact_email || 'lafermedelormois@gmail.com' }}</a></div>
            </div>
            <div class="info-block" v-if="c.contact_horaires">
              <span class="info-icon" v-html="icons.clock"></span>
              <div><strong>Horaires</strong><span style="white-space:pre-line">{{ c.contact_horaires }}</span></div>
            </div>
          </div>
          <div class="contact-actions">
            <NuxtLink to="/commander" class="btn btn-accent">Passer commande</NuxtLink>
            <a :href="c.contact_facebook || 'https://www.facebook.com/lafermedelormois'" target="_blank" rel="noopener" class="btn btn-fb">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Facebook
            </a>
          </div>
        </div>
        <div class="map-frame">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=5.1,47.28,5.2,47.36&layer=mapnik&marker=47.328,5.151"
            width="100%" height="420" frameborder="0" scrolling="no"
            title="Localisation de la Ferme de l'Ormois"
          ></iframe>
        </div>
      </div>

      <footer class="home-footer">
        <div class="home-footer-brand">
          <span v-html="footerLogo"></span>
          <span>La Ferme de l'Ormois</span>
        </div>
        <span class="home-footer-copy">© {{ year }} La Ferme de l'Ormois — Maraîchage en circuit court, Marandeuil</span>
      </footer>
    </section>

    <!-- ===== LIGHTBOX ===== -->
    <div v-if="lightbox !== null" class="lightbox" @click.self="lightbox = null">
      <button class="lb-btn lb-close" @click="lightbox = null" aria-label="Fermer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <button class="lb-btn lb-prev" @click="prevPhoto" aria-label="Précédent">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <img :src="galleryPhotos[lightbox!]?.path" alt="Photo de la ferme" class="lb-img" />
      <button class="lb-btn lb-next" @click="nextPhoto" aria-label="Suivant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: produits } = await useFetch<any[]>('/api/produits')
const { data: contenu } = await useFetch<Record<string, string>>('/api/contenu')
const { data: galerieItems } = await useFetch<{ id: number; path: string }[]>('/api/galerie')
const c = computed(() => contenu.value ?? {})
const router = useRouter()

/* Active le snap plein écran uniquement sur cette page */
useHead({
  title: 'La Ferme de l\'Ormois — Maraîchage local à Marandeuil',
  htmlAttrs: { class: 'snap' },
})

const year = new Date().getFullYear()

/* ----- Produits ----- */
const activeCategory = ref('Tous')
const categories = computed(() => {
  if (!produits.value) return []
  return [...new Set(produits.value.map((p) => p.categorie))].filter(Boolean)
})
const filtered = computed(() => {
  if (!produits.value) return []
  if (activeCategory.value === 'Tous') return produits.value
  return produits.value.filter((p) => p.categorie === activeCategory.value)
})
function order(p: any) {
  router.push({ path: '/commander', query: { produit: p.id } })
}
function formatPrice(v: number) { return Number(v).toFixed(2).replace('.', ',') }

/* Images de secours tant que le champ `image` est vide en base.
   Remplacez par vos vraies photos produits dès qu'elles sont en ligne. */
const productFallbacks = ['/photo_15.jpg', '/photo_19.jpg', '/photo_23.jpg', '/photo_17.jpg', '/photo_21.jpg', '/photo_20.jpg']
function fallbackImg(i: number) { return productFallbacks[i % productFallbacks.length] }

/* ----- Galerie + lightbox ----- */
const galleryPhotos = computed(() => galerieItems.value ?? [])
const lightbox = ref<number | null>(null)
function openPhoto(i: number) { lightbox.value = i }
function prevPhoto() { lightbox.value = (lightbox.value! - 1 + galleryPhotos.value.length) % galleryPhotos.value.length }
function nextPhoto() { lightbox.value = (lightbox.value! + 1) % galleryPhotos.value.length }

/* ----- Défilement doux vers une section ----- */
function scrollTo(id: string) {
  const el = document.getElementById('sec-' + id)
  if (!el) return
  const top = id === 'accueil' ? 0 : el.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: 'smooth' })
}

/* ----- Icônes inline ----- */
const icons = {
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
}
const footerLogo = `<svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#2f6b39"/><path d="M24 37 V21" fill="none" stroke="#f4ecdc" stroke-width="2" stroke-linecap="round"/><path d="M24 28 C17.5 28 13 23.5 13 16.5 C20 16.5 24 21 24 28 Z" fill="#f4ecdc"/><path d="M24 25 C30.5 25 35 20.5 35 13.5 C28 13.5 24 18 24 25 Z" fill="#cfe3b8"/></svg>`
</script>

<style scoped>
.home > section { scroll-snap-align: start; }

/* ---------- HERO ---------- */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}
.hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(28,52,30,0.55) 0%, rgba(28,52,30,0.28) 38%, rgba(34,40,22,0.62) 100%);
}
.hero-content { position: relative; z-index: 2; color: #fff; padding: 0 1.5rem; max-width: 860px; }
.hero-kicker { font-style: italic; font-size: clamp(0.95rem, 2vw, 1.2rem); letter-spacing: 1px; color: #f0d9b8; margin-bottom: 1.1rem; }
.hero-title { font-size: clamp(2.8rem, 8vw, 6rem); color: #fff; text-shadow: 0 4px 30px rgba(0,0,0,0.35); }
.hero-sub { font-weight: 300; font-size: clamp(1rem, 2vw, 1.3rem); line-height: 1.6; max-width: 560px; margin: 1.6rem auto 0; color: rgba(255,255,255,0.92); }
.hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2.4rem; }
.scroll-cue {
  position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
  z-index: 2; cursor: pointer; background: none; border: none;
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  color: rgba(255,255,255,0.85); font-family: 'Spectral', serif;
}
.scroll-cue span { font-size: 0.75rem; letter-spacing: 2px; }
.scroll-cue svg { animation: bob 1.8s ease-in-out infinite; }
@keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }

/* ---------- LA FERME ---------- */
.ferme {
  min-height: 100vh; display: flex; align-items: center;
  background: var(--beige);
  padding: calc(var(--header-h) + 2rem) clamp(1.25rem, 5vw, 4.5rem) 4rem;
}
.ferme-grid {
  max-width: 1180px; margin: 0 auto; width: 100%;
  display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(2rem, 5vw, 5rem); align-items: center;
}
.ferme .lead { font-size: clamp(1rem, 1.4vw, 1.13rem); line-height: 1.85; color: #4a4537; margin-bottom: 1.1rem; }
.ferme .btn-outline { margin-top: 1rem; }
.ferme-media { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.ferme-photo { grid-column: 1 / -1; border-radius: 16px; overflow: hidden; height: 210px; box-shadow: var(--ombre-forte); }
.ferme-photo img { width: 100%; height: 100%; object-fit: cover; }
.value-card { background: var(--creme); border-radius: 16px; padding: 1.4rem 1.25rem; box-shadow: var(--ombre); }
.value-icon { display: inline-flex; color: var(--vert); margin-bottom: 0.6rem; }
.value-icon.accent { color: var(--terre); }
.value-icon :deep(svg) { width: 30px; height: 30px; }
.value-card h4 { font-size: 1.2rem; margin-bottom: 0.35rem; color: var(--vert-fonce); }
.value-card p { font-size: 0.88rem; line-height: 1.6; color: var(--texte-doux); }

/* ---------- À PROPOS ---------- */
.apropos {
  min-height: 100vh; display: flex; align-items: center;
  background: var(--creme);
  padding: calc(var(--header-h) + 2rem) clamp(1.25rem, 5vw, 4.5rem) 4rem;
}
.apropos-grid {
  max-width: 1180px; margin: 0 auto; width: 100%;
  display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(2rem, 5vw, 5rem); align-items: center;
}
.apropos-media {
  position: relative; border-radius: 20px; overflow: hidden;
  box-shadow: var(--ombre-forte); aspect-ratio: 4/5; max-height: 540px;
}
.apropos-media img { width: 100%; height: 100%; object-fit: cover; }
.apropos-badge {
  position: absolute; bottom: 24px; right: -16px;
  background: var(--vert-fonce); color: #fff;
  padding: 1rem 1.4rem; border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  display: flex; flex-direction: column; gap: 0.15rem;
}
.badge-line1 { font-family: 'Marcellus', serif; font-size: 1.25rem; }
.badge-line2 { font-size: 0.82rem; color: rgba(255,255,255,0.75); font-style: italic; }
.apropos-body .eyebrow { margin-bottom: 0.8rem; }
.apropos-body .section-title { margin-bottom: 1.4rem; }
.apropos-body .lead { font-size: clamp(1rem, 1.4vw, 1.1rem); line-height: 1.85; color: #4a4537; margin-bottom: 1rem; }
.apropos-signature { margin-top: 1.5rem; font-family: 'Marcellus', serif; font-size: 1.05rem; color: var(--vert); }

/* ---------- PRODUITS ---------- */
.produits {
  min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
  background: var(--beige-fonce);
  padding: calc(var(--header-h) + 2rem) clamp(1.25rem, 5vw, 4.5rem) 3.5rem;
}
.produits .inner { max-width: 1180px; margin: 0 auto; width: 100%; }
.center-head { text-align: center; margin-bottom: 2rem; }
.categories { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; margin-bottom: 2rem; }
.cat-pill {
  font-family: 'Spectral', serif; font-size: 0.9rem;
  padding: 0.5rem 1.1rem; border-radius: 40px;
  border: 1.5px solid #d8cdb5; background: var(--creme); color: #5a5446;
  cursor: pointer; transition: all 0.2s;
}
.cat-pill.active, .cat-pill:hover { background: var(--vert); color: #fff; border-color: var(--vert); }

.prod-card {
  background: var(--creme); border-radius: 18px; overflow: hidden;
  box-shadow: var(--ombre); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;
}
.prod-card:hover { transform: translateY(-5px); box-shadow: var(--ombre-forte); }
.prod-img { height: 168px; overflow: hidden; position: relative; background: #e7dcc6; }
.prod-img img { width: 100%; height: 100%; object-fit: cover; }
.prod-cat {
  position: absolute; top: 12px; left: 12px;
  font-size: 0.7rem; letter-spacing: 0.5px;
  background: rgba(47,107,57,0.92); color: #fff; padding: 0.25rem 0.7rem; border-radius: 30px;
}
.prod-body { padding: 1rem 1.1rem 1.15rem; }
.prod-body h3 { font-size: 1.3rem; margin-bottom: 0.3rem; }
.prod-desc { font-size: 0.85rem; line-height: 1.5; color: #837a68; margin-bottom: 0.9rem; min-height: 40px; }
.prod-meta { display: flex; align-items: center; justify-content: space-between; }
.prod-price { font-family: 'Marcellus', serif; font-size: 1.2rem; color: var(--terre); }
.prod-order { display: inline-flex; align-items: center; gap: 0.3rem; font-weight: 600; font-size: 0.82rem; color: var(--vert); }
.empty { text-align: center; color: var(--texte-doux); padding: 2rem; }

/* ---------- GALERIE ---------- */
.galerie {
  min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
  background: var(--vert-galerie);
  padding: calc(var(--header-h) + 1.5rem) clamp(1.25rem, 5vw, 4.5rem) 4rem;
}
.galerie .inner { max-width: 1180px; margin: 0 auto; width: 100%; }
.gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 158px; gap: 0.9rem; }
.gallery-item { overflow: hidden; border-radius: 14px; cursor: pointer; background: #2c5236; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; }
.gallery-item:hover img { transform: scale(1.07); }
.gallery-item.g0 { grid-row: span 2; grid-column: span 2; }
.gallery-item.g3 { grid-column: span 2; }

/* ---------- CONTACT ---------- */
.contact {
  min-height: 100vh; display: flex; flex-direction: column;
  background: var(--vert-nuit);
  padding: calc(var(--header-h) + 1.5rem) clamp(1.25rem, 5vw, 4.5rem) 0;
}
.contact-grid {
  max-width: 1180px; margin: 0 auto; width: 100%; flex: 1;
  display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(2rem, 5vw, 4.5rem); align-items: center;
}
.info-list { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem; }
.info-block { display: flex; gap: 0.95rem; align-items: flex-start; }
.info-icon {
  flex-shrink: 0; width: 42px; height: 42px; border-radius: 50%;
  background: rgba(232,160,106,0.18); color: var(--orange);
  display: inline-flex; align-items: center; justify-content: center;
}
.info-icon :deep(svg) { width: 20px; height: 20px; }
.info-block strong { display: block; font-family: 'Marcellus', serif; font-weight: 400; color: var(--beige); font-size: 1.05rem; margin-bottom: 0.2rem; }
.info-block span, .info-block a { color: #c2cdbb; font-size: 0.95rem; line-height: 1.6; }
.contact-actions { display: flex; gap: 0.9rem; margin-top: 1.9rem; flex-wrap: wrap; }
.map-frame { border-radius: 18px; overflow: hidden; box-shadow: 0 18px 48px rgba(0,0,0,0.4); border: 6px solid rgba(255,255,255,0.06); }
.map-frame iframe { display: block; }

.home-footer {
  border-top: 1px solid rgba(255,255,255,0.12); margin-top: 3.5rem; padding: 1.6rem 0;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
}
.home-footer-brand { display: flex; align-items: center; gap: 0.7rem; }
.home-footer-brand > span:last-child { font-family: 'Marcellus', serif; font-size: 1rem; letter-spacing: 1px; color: var(--beige); }
.home-footer-copy { font-size: 0.8rem; color: #8fa088; }

/* ---------- LIGHTBOX ---------- */
.lightbox { position: fixed; inset: 0; z-index: 200; background: rgba(20,28,18,0.92); display: flex; align-items: center; justify-content: center; }
.lb-img { max-width: 88vw; max-height: 84vh; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
.lb-btn { position: absolute; border: none; background: rgba(255,255,255,0.14); color: #fff; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.lb-btn:hover { background: rgba(255,255,255,0.28); }
.lb-btn svg { width: 22px; height: 22px; }
.lb-close { top: 22px; right: 26px; width: 46px; height: 46px; }
.lb-prev { left: 24px; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; }
.lb-next { right: 24px; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; }

/* ---------- RESPONSIVE ---------- */
@media (max-width: 860px) {
  html.snap { scroll-snap-type: none; }
  .home > section { min-height: auto; }
  .ferme-grid, .apropos-grid, .contact-grid { grid-template-columns: 1fr; }
  .apropos-badge { right: 12px; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .gallery-item.g0, .gallery-item.g3 { grid-row: auto; grid-column: auto; }
  .hero { min-height: 100vh; }
}

@media (max-width: 600px) {
  /* Espace suffisant pour que le contenu ne chevauche pas le scroll-cue absolu */
  .hero-content { padding-bottom: 5rem; }
  /* Boutons en colonne centrée, pleine largeur */
  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  .hero-actions .btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}
</style>
