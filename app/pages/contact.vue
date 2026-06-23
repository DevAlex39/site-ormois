<template>
  <div class="container" style="padding-top:2.5rem;padding-bottom:3rem;max-width:800px">
    <h1 class="section-title">Contact</h1>

    <div class="contact-grid">
      <div class="contact-info">
        <div class="info-block">
          <span class="info-icon">📍</span>
          <div>
            <strong>Adresse</strong>
            <p>7 BIS Route de l'Ormois<br>21270 Marandeuil, France</p>
          </div>
        </div>
        <div class="info-block">
          <span class="info-icon">📞</span>
          <div>
            <strong>Téléphone</strong>
            <p><a href="tel:+33620499321">06 20 49 93 21</a></p>
          </div>
        </div>
        <div class="info-block">
          <span class="info-icon">✉️</span>
          <div>
            <strong>Email</strong>
            <p><a href="mailto:lafermedelormois@gmail.com">lafermedelormois@gmail.com</a></p>
          </div>
        </div>
        <div class="info-block">
          <span class="info-icon">📘</span>
          <div>
            <strong>Facebook</strong>
            <p><a href="https://www.facebook.com/lafermedelormois" target="_blank" rel="noopener">
              /lafermedelormois
            </a></p>
          </div>
        </div>
      </div>

      <div class="contact-map">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=5.1,47.28,5.2,47.36&layer=mapnik&marker=47.328,5.151"
          width="100%" height="320" frameborder="0" scrolling="no"
          style="border-radius:10px"
          title="Carte"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Contact — La Ferme de l\'Ormois' })
</script>

<style scoped>
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
.info-block { display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: flex-start; }
.info-icon { font-size: 1.5rem; flex-shrink: 0; }
.info-block strong { display: block; margin-bottom: 0.2rem; color: var(--vert-fonce); }
.info-block a { color: var(--vert); }
.info-block a:hover { text-decoration: underline; }
@media (max-width: 640px) { .contact-grid { grid-template-columns: 1fr; } }
</style>
