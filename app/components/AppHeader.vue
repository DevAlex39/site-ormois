<!-- ============================================================
     AppHeader — en-tête transparent en haut de l'accueil,
     fond vert plein dès qu'on défile / sur les autres pages.
     À coller dans : app/components/AppHeader.vue
     ============================================================ -->
<template>
  <header :class="['header', { solid }]">
    <div class="container header-inner">
      <!-- Logo -->
      <a href="/" class="logo" @click="onLogo">
        <span class="logo-mark" v-html="logoSvg"></span>
        <span class="logo-text">
          <small>LA FERME DE</small>
          <strong>L'ORMOIS</strong>
        </span>
      </a>

      <!-- Burger mobile -->
      <button class="burger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>

      <!-- Navigation -->
      <nav :class="['nav', { open: menuOpen }]">
        <a
          v-for="item in sections"
          :key="item.id"
          href="#"
          :class="{ active: active === item.id }"
          @click.prevent="go(item.id)"
        >{{ item.label }}</a>
        <NuxtLink to="/commander" class="btn btn-accent nav-cta" @click="menuOpen = false">
          Commander
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)
const active = ref('accueil')
const scrolled = ref(false)

const sections = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'ferme', label: 'La Ferme' },
  { id: 'produits', label: 'Produits' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'contact', label: 'Contact' },
]

const isHome = computed(() => route.path === '/')
// Fond plein si : pas sur l'accueil, OU on a quitté la première section
const solid = computed(() => !isHome.value || scrolled.value || active.value !== 'accueil')

const logoSvg = `<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
  <circle cx="24" cy="24" r="23" fill="#2f6b39"/>
  <circle cx="24" cy="24" r="19.5" fill="none" stroke="#f4ecdc" stroke-width="1" opacity="0.55"/>
  <path d="M24 37 V21" fill="none" stroke="#f4ecdc" stroke-width="2" stroke-linecap="round"/>
  <path d="M24 28 C17.5 28 13 23.5 13 16.5 C20 16.5 24 21 24 28 Z" fill="#f4ecdc"/>
  <path d="M24 25 C30.5 25 35 20.5 35 13.5 C28 13.5 24 18 24 25 Z" fill="#cfe3b8"/>
</svg>`

let observer: IntersectionObserver | null = null

function scrollToSection(id: string) {
  const el = document.getElementById('sec-' + id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top: id === 'accueil' ? 0 : top, behavior: 'smooth' })
}

function go(id: string) {
  menuOpen.value = false
  if (isHome.value) {
    scrollToSection(id)
  } else {
    // revenir à l'accueil puis défiler
    router.push('/').then(() => nextTick(() => setTimeout(() => scrollToSection(id), 120)))
  }
}

function onLogo(e: MouseEvent) {
  if (isHome.value) { e.preventDefault(); go('accueil') }
}

function setupObserver() {
  if (observer) observer.disconnect()
  if (!isHome.value) return
  const els = sections
    .map((s) => document.getElementById('sec-' + s.id))
    .filter(Boolean) as HTMLElement[]
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) active.value = (e.target as HTMLElement).dataset.section || 'accueil'
      })
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  )
  els.forEach((el) => observer!.observe(el))
}

function onScroll() { scrolled.value = window.scrollY > 40 }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  nextTick(setupObserver)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (observer) observer.disconnect()
})
// Re-observer quand on change de page (retour sur l'accueil)
watch(() => route.path, () => nextTick(() => setTimeout(setupObserver, 100)))
</script>

<style scoped>
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--header-h);
  display: flex;
  align-items: center;
  background: transparent;
  transition: background 0.3s, box-shadow 0.3s;
}
.header.solid {
  background: var(--vert-fonce);
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* Logo */
.logo { display: flex; align-items: center; gap: 0.7rem; }
.logo-mark { display: inline-flex; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.18)); }
.logo-text { display: flex; flex-direction: column; line-height: 1; color: #fff; }
.logo-text small {
  font-family: 'Spectral', serif; font-weight: 500;
  font-size: 0.62rem; letter-spacing: 3px; color: #f4ecdc;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}
.logo-text strong {
  font-family: 'Marcellus', serif; font-weight: 400;
  font-size: 1.35rem; letter-spacing: 2px; margin-top: 2px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.45);
}

/* Nav */
.nav { display: flex; align-items: center; gap: clamp(0.9rem, 2vw, 1.9rem); }
.nav > a {
  position: relative;
  font-family: 'Spectral', serif;
  font-size: 0.92rem;
  letter-spacing: 0.5px;
  color: #f4ecdc;
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
  padding: 0.4rem 0.1rem;
}
.nav > a::after {
  content: '';
  position: absolute; left: 0; right: 0; bottom: -2px;
  height: 2px; background: var(--orange); border-radius: 2px;
  transform: scaleX(0); transform-origin: left; transition: transform 0.2s;
}
.nav > a:hover::after, .nav > a.active::after { transform: scaleX(1); }
.header.solid .nav > a { text-shadow: none; }

.nav-cta { font-size: 0.92rem; padding: 0.65rem 1.4rem; }

/* Burger */
.burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.burger span { display: block; width: 24px; height: 2px; background: #fff; border-radius: 2px; }

@media (max-width: 860px) {
  .burger { display: flex; }
  .nav {
    display: none;
    position: absolute; top: 100%; left: 0; right: 0;
    background: var(--vert-fonce);
    flex-direction: column; align-items: flex-start;
    padding: 1.2rem 1.5rem; gap: 1.1rem;
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  }
  .nav.open { display: flex; }
  .nav > a { color: #fff; text-shadow: none; }
  .nav-cta { width: 100%; justify-content: center; }
}
</style>
