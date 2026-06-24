<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo" v-html="logoSvg"></div>
      <h1>La Ferme de l'Ormois</h1>
      <p class="login-sub">Espace administration</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="login">
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" required autofocus placeholder="••••••••" />
        </div>
        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <NuxtLink to="/" class="back-site">← Retour au site</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const password = ref('')
const loading = ref(false)
const error = ref('')

const logoSvg = `<svg viewBox="0 0 48 48" width="64" height="64" aria-hidden="true">
  <circle cx="24" cy="24" r="23" fill="#1f4527"/>
  <circle cx="24" cy="24" r="19.5" fill="none" stroke="#f4ecdc" stroke-width="1" opacity="0.4"/>
  <path d="M24 37 V21" fill="none" stroke="#f4ecdc" stroke-width="2" stroke-linecap="round"/>
  <path d="M24 28 C17.5 28 13 23.5 13 16.5 C20 16.5 24 21 24 28 Z" fill="#f4ecdc"/>
  <path d="M24 25 C30.5 25 35 20.5 35 13.5 C28 13.5 24 18 24 25 Z" fill="#cfe3b8"/>
</svg>`

async function login() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    navigateTo('/admin')
  } catch {
    error.value = 'Mot de passe incorrect.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Connexion — Admin Ferme de l\'Ormois' })
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--vert-nuit);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.login-card {
  background: var(--creme);
  border-radius: 20px;
  padding: 2.75rem 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.3);
  text-align: center;
}
.login-logo { margin-bottom: 1.25rem; }
.login-card h1 {
  font-family: 'Marcellus', serif;
  font-size: 1.5rem;
  color: var(--vert-fonce);
  margin-bottom: 0.3rem;
}
.login-sub { color: var(--texte-doux); font-size: 0.9rem; margin-bottom: 1.75rem; }
.btn-full { width: 100%; justify-content: center; border-radius: 12px; }
.back-site {
  display: inline-block;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--texte-doux);
}
.back-site:hover { color: var(--vert); }
</style>
