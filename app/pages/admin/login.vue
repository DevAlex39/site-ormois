<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h1>🌿 Administration</h1>
      <p class="login-sub">La Ferme de l'Ormois</p>
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" required autofocus />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%" :disabled="loading">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const password = ref('')
const loading = ref(false)
const error = ref('')

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

useHead({ title: 'Connexion admin — La Ferme de l\'Ormois' })
</script>

<style scoped>
.login-wrapper { min-height: 80vh; display: flex; align-items: center; justify-content: center; }
.login-box {
  background: var(--blanc);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  width: 100%;
  max-width: 380px;
}
.login-box h1 { font-size: 1.5rem; color: var(--vert-fonce); margin-bottom: 0.25rem; }
.login-sub { color: #888; margin-bottom: 1.5rem; font-size: 0.9rem; }
</style>
