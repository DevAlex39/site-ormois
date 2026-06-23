<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-col">
        <h3>🌿 La Ferme de l'Ormois</h3>
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
          📘 Facebook
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
