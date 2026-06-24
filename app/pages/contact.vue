<!-- ============================================================
     contact.vue — page contact dédiée (accès direct /contact)
     À coller dans : app/pages/contact.vue
     ============================================================ -->
<template>
  <div class="page">
    <div class="container">
      <div class="page-head">
        <span class="eyebrow">Nous trouver</span>
        <h1 class="section-title">Venez nous rencontrer</h1>
      </div>

      <div class="contact-grid">
        <div class="contact-info">
          <div class="info-block">
            <span class="info-icon" v-html="icons.pin"></span>
            <div><strong>Adresse</strong><p v-html="(c.contact_adresse || '7 BIS Route de l\'Ormois\n21270 Marandeuil, France').replace(/\n/g, '<br />')"></p></div>
          </div>
          <div class="info-block">
            <span class="info-icon" v-html="icons.phone"></span>
            <div><strong>Téléphone</strong><p><a :href="'tel:+33' + (c.contact_telephone || '0620499321').replace(/^0/, '').replace(/\s/g, '')">{{ c.contact_telephone || '06 20 49 93 21' }}</a></p></div>
          </div>
          <div class="info-block">
            <span class="info-icon" v-html="icons.mail"></span>
            <div><strong>Email</strong><p><a :href="'mailto:' + (c.contact_email || 'lafermedelormois@gmail.com')">{{ c.contact_email || 'lafermedelormois@gmail.com' }}</a></p></div>
          </div>
          <div class="info-block" v-if="c.contact_horaires">
            <span class="info-icon" v-html="icons.clock"></span>
            <div><strong>Horaires</strong><p style="white-space:pre-line">{{ c.contact_horaires }}</p></div>
          </div>
          <div class="contact-actions">
            <NuxtLink to="/commander" class="btn btn-accent">Passer commande</NuxtLink>
            <a :href="c.contact_facebook || 'https://www.facebook.com/lafermedelormois'" target="_blank" rel="noopener" class="btn btn-fb">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Facebook
            </a>
          </div>
        </div>

        <div class="contact-map">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=5.1,47.28,5.2,47.36&layer=mapnik&marker=47.328,5.151"
            width="100%" height="380" frameborder="0" scrolling="no"
            title="Localisation de la Ferme de l'Ormois"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: contenu } = await useFetch<Record<string, string>>('/api/contenu', { key: 'site-contenu' })
const c = computed(() => contenu.value ?? {})

const icons = {
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
}
useHead({ title: 'Contact — La Ferme de l\'Ormois' })
</script>

<style scoped>
.page { padding: calc(var(--header-h) + 2.5rem) 0 4rem; min-height: 100vh; }
.page-head { margin-bottom: 2rem; }
.contact-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 2.5rem; align-items: start; }
.info-block { display: flex; gap: 0.95rem; margin-bottom: 1.5rem; align-items: flex-start; }
.info-icon {
  flex-shrink: 0; width: 42px; height: 42px; border-radius: 50%;
  background: rgba(185,102,63,0.12); color: var(--terre);
  display: inline-flex; align-items: center; justify-content: center;
}
.info-icon :deep(svg) { width: 20px; height: 20px; }
.info-block strong { display: block; font-family: 'Marcellus', serif; font-weight: 400; color: var(--vert-fonce); font-size: 1.1rem; margin-bottom: 0.2rem; }
.info-block a { color: var(--vert); }
.info-block a:hover { text-decoration: underline; }
.contact-actions { display: flex; gap: 0.9rem; margin-top: 1.5rem; flex-wrap: wrap; }
.contact-map { border-radius: 18px; overflow: hidden; box-shadow: var(--ombre-forte); }
.contact-map iframe { display: block; }
@media (max-width: 760px) { .contact-grid { grid-template-columns: 1fr; } }
</style>
