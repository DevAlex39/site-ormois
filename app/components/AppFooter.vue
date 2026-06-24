<!-- ============================================================
     AppFooter.vue — pied de page (restylé)
     Affiché sur toutes les pages SAUF l'accueil (cf. app.vue),
     car la page d'accueil intègre son propre pied de page.
     À coller dans : app/components/AppFooter.vue
     ============================================================ -->
<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-col">
        <h3>
          <span class="f-logo" v-html="logo"></span>
          La Ferme de l'Ormois
        </h3>
        <p>Maraîchage en circuit court<br />Marandeuil, Côte-d'Or</p>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <p>7 BIS Route de l'Ormois<br />21270 Marandeuil</p>
        <p><a href="tel:+33620499321">06 20 49 93 21</a></p>
        <p><a href="mailto:lafermedelormois@gmail.com">lafermedelormois@gmail.com</a></p>
      </div>
      <div class="footer-col">
        <h4>Suivez-nous</h4>
        <a href="https://www.facebook.com/lafermedelormois" target="_blank" rel="noopener" class="fb-link">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          Facebook
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} La Ferme de l'Ormois — Tous droits réservés</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const logo = `<svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#2f6b39"/><path d="M24 37 V21" fill="none" stroke="#f4ecdc" stroke-width="2" stroke-linecap="round"/><path d="M24 28 C17.5 28 13 23.5 13 16.5 C20 16.5 24 21 24 28 Z" fill="#f4ecdc"/><path d="M24 25 C30.5 25 35 20.5 35 13.5 C28 13.5 24 18 24 25 Z" fill="#cfe3b8"/></svg>`
</script>

<style scoped>
.footer { background: var(--vert-nuit); color: rgba(255,255,255,0.85); margin-top: 0; }
.footer-inner {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem; padding: 3rem 1.5rem 2rem;
}
.footer-col h3 { color: var(--beige); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; font-size: 1.2rem; }
.footer-col h4 { color: var(--beige); margin-bottom: 0.75rem; font-size: 1.05rem; }
.f-logo { display: inline-flex; }
.footer-col p { margin-bottom: 0.4rem; font-size: 0.9rem; }
.footer-col a { color: rgba(255,255,255,0.8); }
.footer-col a:hover { color: var(--beige); }
.fb-link { display: inline-flex; align-items: center; gap: 0.5rem; }
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.12);
  text-align: center; padding: 1rem 1.5rem; font-size: 0.8rem; color: rgba(255,255,255,0.5);
}
</style>
