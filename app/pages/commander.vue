<template>
  <div class="container" style="padding-top:2.5rem;padding-bottom:3rem;max-width:860px">
    <h1 class="section-title">Passer une commande</h1>
    <p class="section-subtitle">Sélectionnez vos produits et renseignez vos coordonnées. Nous vous contacterons pour confirmer la commande.</p>

    <div v-if="success" class="alert alert-success">
      ✅ Votre commande a bien été envoyée ! Nous vous contacterons rapidement pour confirmer.
    </div>
    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <form v-if="!success" @submit.prevent="submit">
      <!-- Sélection produits -->
      <section class="form-section">
        <h2>1. Choisissez vos produits</h2>
        <div v-if="!produits?.length" class="empty">Aucun produit disponible.</div>
        <div v-else class="order-products">
          <div v-for="p in produits" :key="p.id" class="order-product-row">
            <label class="product-check">
              <input type="checkbox" :value="p.id" v-model="selectedIds" />
              <span class="product-name">{{ p.nom }}</span>
              <span class="product-unit">{{ p.unite }}</span>
              <span class="product-price" v-if="p.prix">{{ p.prix }} €</span>
            </label>
            <div class="qty-field" v-if="selectedIds.includes(p.id)">
              <label>Quantité :</label>
              <input type="number" v-model.number="quantities[p.id]" min="1" step="1" style="width:80px" />
            </div>
          </div>
        </div>
      </section>

      <!-- Date souhaitée -->
      <section class="form-section">
        <h2>2. Date de retrait souhaitée</h2>
        <div class="form-group" style="max-width:280px">
          <label>Date *</label>
          <input type="date" v-model="form.date" :min="minDate" required />
        </div>
      </section>

      <!-- Coordonnées -->
      <section class="form-section">
        <h2>3. Vos coordonnées</h2>
        <div class="form-row">
          <div class="form-group">
            <label>Prénom *</label>
            <input type="text" v-model="form.prenom" required />
          </div>
          <div class="form-group">
            <label>Nom *</label>
            <input type="text" v-model="form.nom" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Téléphone *</label>
            <input type="tel" v-model="form.telephone" required />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" v-model="form.email" required />
          </div>
        </div>
        <div class="form-group">
          <label>Type de client *</label>
          <select v-model="form.type" required>
            <option value="">-- Choisir --</option>
            <option value="particulier">Particulier</option>
            <option value="professionnel">Professionnel / Restaurant</option>
            <option value="association">Association / Collectivité</option>
          </select>
        </div>
        <div class="form-group" v-if="form.type === 'professionnel'">
          <label>Nom de l'entreprise</label>
          <input type="text" v-model="form.entreprise" />
        </div>
        <div class="form-group">
          <label>Message / informations complémentaires</label>
          <textarea v-model="form.message" rows="4" placeholder="Allergies, préférences, questions…"></textarea>
        </div>
      </section>

      <div class="form-submit">
        <p class="submit-note" v-if="selectedIds.length === 0">⚠ Veuillez sélectionner au moins un produit.</p>
        <button type="submit" class="btn btn-primary" :disabled="sending || selectedIds.length === 0">
          {{ sending ? 'Envoi en cours…' : 'Envoyer ma commande' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: produits } = await useFetch<any[]>('/api/produits')

const selectedIds = ref<number[]>([])
const quantities = ref<Record<number, number>>({})
const sending = ref(false)
const success = ref(false)
const error = ref('')

const form = reactive({
  prenom: '', nom: '', telephone: '', email: '',
  type: '', entreprise: '', message: '', date: '',
})

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

// Pré-sélectionner un produit si passé en query
onMounted(() => {
  const id = Number(route.query.produit)
  if (id && produits.value?.find((p: any) => p.id === id)) {
    selectedIds.value = [id]
    quantities.value[id] = 1
  }
})

watch(selectedIds, (ids) => {
  ids.forEach((id) => {
    if (!quantities.value[id]) quantities.value[id] = 1
  })
})

async function submit() {
  sending.value = true
  error.value = ''
  try {
    const lignes = selectedIds.value.map((id) => ({
      produitId: id,
      quantite: quantities.value[id] || 1,
    }))
    await $fetch('/api/commande', {
      method: 'POST',
      body: { ...form, lignes },
    })
    success.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e: any) {
    error.value = e?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    sending.value = false
  }
}

useHead({ title: 'Commander — La Ferme de l\'Ormois' })
</script>

<style scoped>
.form-section { margin-bottom: 2.5rem; padding-bottom: 2rem; border-bottom: 1px solid var(--beige-fonce); }
.form-section h2 { font-size: 1.25rem; color: var(--vert-fonce); margin-bottom: 1.25rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.order-products { display: flex; flex-direction: column; gap: 0.75rem; }
.order-product-row {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--blanc); padding: 0.75rem 1rem; border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  flex-wrap: wrap; gap: 0.5rem;
}
.product-check { display: flex; align-items: center; gap: 0.75rem; flex: 1; cursor: pointer; }
.product-check input[type=checkbox] { width: 18px; height: 18px; accent-color: var(--vert); }
.product-name { font-weight: bold; }
.product-unit, .product-price { font-size: 0.85rem; color: #888; }
.product-price { color: var(--vert); font-weight: bold; }
.qty-field { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
.empty { color: #888; }
.form-submit { padding-top: 1rem; }
.submit-note { color: #c0392b; margin-bottom: 0.75rem; font-size: 0.9rem; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
