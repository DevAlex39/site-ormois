<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-col">
        <h3>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:1.1rem;height:1.1rem;vertical-align:middle;margin-right:0.4rem" aria-hidden="true">
            <path d="M12 22V12"/><path d="M12 12C12 12 7 9 7 5a5 5 0 0 1 10 0c0 4-5 7-5 7z"/><path d="M12 12C12 12 17 9 17 5"/>
          </svg>
          La Ferme de l'Ormois
        </h3>
        <p>Maraîchage en circuit court<br>Marandeuil, Côte-d'Or</p>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <p>7 BIS Route de l'Ormois<br>21270 Marandeuil</p>
        <p><a href="tel:+33620499321">06 20 49 93 21</a></p>
        <p><a href="mailto:lafermedelormois@gmail.com">lafermedelormois@gmail.com</a></p>
      </div>
      <div class="footer-col">
        <h4>Suivez-nous</h4>
        <a href="https://www.facebook.com/lafermedelormois" target="_blank" rel="noopener" class="fb-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:1.1rem;height:1.1rem;flex-shrink:0" aria-hidden="true">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
          Facebook
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} La Ferme de l'Ormois — Tous droits réservés</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--vert-fonce);
  color: rgba(255,255,255,0.85);
  margin-top: 4rem;
}
.footer-inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 3rem 1.5rem 2rem;
}
.footer-col h3, .footer-col h4 { color: var(--blanc); margin-bottom: 0.75rem; }
.footer-col p { margin-bottom: 0.4rem; font-size: 0.9rem; }
.footer-col a { color: rgba(255,255,255,0.8); }
.footer-col a:hover { color: var(--blanc); }
.fb-link { display: inline-flex; align-items: center; gap: 0.5rem; }
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.15);
  text-align: center;
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
}
</style>
