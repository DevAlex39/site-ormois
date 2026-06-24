<!-- ============================================================
     commander.vue — écran de commande dédié (restylé)
     Le câblage API est conservé à l'identique :
       GET  /api/produits      (liste)
       POST /api/commande      ({ ...form, lignes:[{produitId, quantite}] })
       ?produit=<id>           pré-sélection depuis une carte produit
     À coller dans : app/pages/commander.vue
     ============================================================ -->
<template>
  <div class="order-page">
    <!-- Bandeau -->
    <div class="order-hero">
      <img src="/photo_17.jpg" alt="Légumes de la ferme" class="order-hero-bg" />
      <div class="order-hero-overlay"></div>
      <div class="order-hero-content">
        <NuxtLink to="/" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
          Retour au site
        </NuxtLink>
        <h1>Passer une commande</h1>
      </div>
    </div>

    <div class="order-body">
      <!-- Confirmation -->
      <div v-if="success" class="success-card">
        <span class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="38" height="38"><polyline points="20 6 9 17 4 12"/></svg>
        </span>
        <h2>Commande envoyée&nbsp;!</h2>
        <p>Merci&nbsp;! Nous vous contacterons rapidement pour confirmer votre commande et convenir d'une date de retrait.</p>
        <NuxtLink to="/" class="btn btn-primary">Retour à l'accueil</NuxtLink>
      </div>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form v-if="!success" @submit.prevent="submit">
        <!-- Étape 1 -->
        <section class="step">
          <div class="step-head"><span class="step-num">1</span><h2>Choisissez vos produits</h2></div>
          <div v-if="!produits?.length" class="empty">Aucun produit disponible.</div>
          <div v-else class="order-rows">
            <div
              v-for="p in produits"
              :key="p.id"
              class="order-row"
              :class="{ on: selectedIds.includes(p.id) }"
            >
              <div class="check" @click="toggle(p.id)">
                <svg v-if="selectedIds.includes(p.id)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div class="row-name" @click="toggle(p.id)">
                <span class="nm">{{ p.nom }}</span>
                <span class="un">· {{ p.unite }}</span>
              </div>
              <span class="row-price" v-if="p.prix">{{ formatPrice(p.prix) }} €</span>
              <div class="stepper" v-if="selectedIds.includes(p.id)">
                <button type="button" @click="dec(p.id)">−</button>
                <span>{{ quantities[p.id] || 1 }}</span>
                <button type="button" @click="inc(p.id)">+</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Étape 2 -->
        <section class="step">
          <div class="step-head"><span class="step-num">2</span><h2>Date de retrait souhaitée</h2></div>
          <div class="form-group" style="max-width:280px">
            <input type="date" v-model="form.date" :min="minDate" required />
          </div>
        </section>

        <!-- Étape 3 -->
        <section class="step">
          <div class="step-head"><span class="step-num">3</span><h2>Vos coordonnées</h2></div>
          <div class="grid2">
            <div class="form-group"><label>Prénom *</label><input type="text" v-model="form.prenom" required /></div>
            <div class="form-group"><label>Nom *</label><input type="text" v-model="form.nom" required /></div>
            <div class="form-group"><label>Téléphone *</label><input type="tel" v-model="form.telephone" required /></div>
            <div class="form-group"><label>Email *</label><input type="email" v-model="form.email" required /></div>
            <div class="form-group span2">
              <label>Type de client *</label>
              <select v-model="form.type" required>
                <option value="">-- Choisir --</option>
                <option value="particulier">Particulier</option>
                <option value="professionnel">Professionnel / Restaurant</option>
                <option value="association">Association / Collectivité</option>
              </select>
            </div>
            <div class="form-group span2" v-if="form.type === 'professionnel'">
              <label>Nom de l'entreprise</label>
              <input type="text" v-model="form.entreprise" />
            </div>
            <div class="form-group span2">
              <label>Message / informations complémentaires</label>
              <textarea v-model="form.message" rows="4" placeholder="Allergies, préférences, questions…"></textarea>
            </div>
          </div>
        </section>

        <div class="submit-bar">
          <span class="summary">{{ summary }}</span>
          <button type="submit" class="btn btn-accent" :disabled="sending || selectedIds.length === 0">
            {{ sending ? 'Envoi en cours…' : 'Envoyer ma commande' }}
          </button>
        </div>
      </form>
    </div>
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

const summary = computed(() => {
  const n = selectedIds.value.length
  if (n === 0) return 'Sélectionnez au moins un produit'
  return n === 1 ? '1 produit sélectionné' : `${n} produits sélectionnés`
})

function formatPrice(v: number) { return Number(v).toFixed(2).replace('.', ',') }

function toggle(id: number) {
  const i = selectedIds.value.indexOf(id)
  if (i >= 0) selectedIds.value.splice(i, 1)
  else { selectedIds.value.push(id); if (!quantities.value[id]) quantities.value[id] = 1 }
}
function inc(id: number) { quantities.value[id] = (quantities.value[id] || 1) + 1 }
function dec(id: number) { quantities.value[id] = Math.max(1, (quantities.value[id] || 1) - 1) }

onMounted(() => {
  const id = Number(route.query.produit)
  if (id && produits.value?.find((p) => p.id === id)) {
    selectedIds.value = [id]
    quantities.value[id] = 1
  }
})

async function submit() {
  sending.value = true
  error.value = ''
  try {
    const lignes = selectedIds.value.map((id) => ({ produitId: id, quantite: quantities.value[id] || 1 }))
    await $fetch('/api/commande', { method: 'POST', body: { ...form, lignes } })
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
.order-page { background: var(--beige); min-height: 100vh; }

/* Bandeau */
.order-hero { height: 240px; position: relative; overflow: hidden; }
.order-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 60%; }
.order-hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(27,54,34,0.55), rgba(27,54,34,0.78)); }
.order-hero-content {
  position: relative; z-index: 2; max-width: 920px; margin: 0 auto; height: 100%;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 0 1.5rem 1.6rem;
}
.back-link {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 0.45rem;
  background: rgba(255,255,255,0.16); color: #fff; font-size: 0.9rem;
  padding: 0.5rem 1rem; border-radius: 40px; margin-bottom: 1rem; transition: background 0.2s;
}
.back-link:hover { background: rgba(255,255,255,0.3); }
.order-hero-content h1 { color: #fff; font-size: clamp(2rem, 5vw, 2.9rem); text-shadow: 0 2px 14px rgba(0,0,0,0.3); }

/* Corps */
.order-body { max-width: 920px; margin: 0 auto; padding: 2.5rem 1.5rem 5rem; }

.step { margin-bottom: 2.25rem; }
.step-head { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1.15rem; }
.step-num {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%;
  background: var(--vert); color: #fff; font-family: 'Marcellus', serif; font-size: 1.05rem;
  display: inline-flex; align-items: center; justify-content: center;
}
.step-head h2 { font-size: 1.5rem; }

.order-rows { display: flex; flex-direction: column; gap: 0.75rem; }
.order-row {
  background: var(--creme); border-radius: 14px; padding: 1rem 1.1rem;
  box-shadow: 0 4px 14px rgba(47,59,31,0.07); border: 2px solid transparent;
  display: flex; align-items: center; gap: 0.9rem; transition: border-color 0.2s; flex-wrap: wrap;
}
.order-row.on { border-color: var(--vert); }
.check {
  flex-shrink: 0; width: 26px; height: 26px; border-radius: 8px;
  border: 2px solid #c9bda3; background: var(--creme); cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: #fff;
}
.order-row.on .check { background: var(--vert); border-color: var(--vert); }
.row-name { flex: 1; cursor: pointer; min-width: 120px; }
.row-name .nm { font-family: 'Marcellus', serif; font-size: 1.2rem; color: var(--vert-fonce); }
.row-name .un { font-size: 0.88rem; color: #9a9080; margin-left: 0.4rem; }
.row-price { font-family: 'Marcellus', serif; font-size: 1.05rem; color: var(--terre); white-space: nowrap; }
.stepper { display: flex; align-items: center; border: 1.5px solid #d8cdb5; border-radius: 40px; overflow: hidden; background: #fff; }
.stepper button { border: none; background: transparent; width: 34px; height: 34px; font-size: 1.25rem; color: var(--vert); cursor: pointer; }
.stepper span { min-width: 30px; text-align: center; font-weight: 600; font-size: 0.95rem; }

.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.span2 { grid-column: 1 / -1; }

.submit-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding-top: 0.5rem; }
.summary { font-size: 0.95rem; color: var(--texte-doux); }

.success-card {
  background: var(--creme); border-radius: 20px; padding: 3.5rem 2.5rem; text-align: center;
  box-shadow: 0 12px 40px rgba(47,59,31,0.12);
}
.success-icon {
  display: inline-flex; width: 76px; height: 76px; border-radius: 50%;
  background: rgba(47,107,57,0.12); color: var(--vert);
  align-items: center; justify-content: center; margin-bottom: 1.4rem;
}
.success-card h2 { font-size: 1.9rem; margin-bottom: 0.75rem; }
.success-card p { font-size: 1.05rem; color: var(--texte-doux); line-height: 1.7; max-width: 480px; margin: 0 auto 1.75rem; }
.empty { color: var(--texte-doux); }

@media (max-width: 600px) {
  .grid2 { grid-template-columns: 1fr; }
}
</style>
