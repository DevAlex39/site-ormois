<template>
  <div class="container" style="padding-top:2rem;padding-bottom:3rem;max-width:900px">
    <div class="page-header">
      <NuxtLink to="/admin" class="back-link">← Retour</NuxtLink>
      <h1>Gestion des produits</h1>
      <button class="btn btn-primary" @click="openForm()">+ Ajouter un produit</button>
    </div>

    <div v-if="alert.msg" :class="['alert', `alert-${alert.type}`]">{{ alert.msg }}</div>

    <!-- Formulaire add/edit -->
    <div v-if="formOpen" class="product-form-card">
      <h2>{{ editId ? 'Modifier le produit' : 'Nouveau produit' }}</h2>
      <form @submit.prevent="saveProduct">
        <div class="form-row">
          <div class="form-group">
            <label>Nom *</label>
            <input type="text" v-model="form.nom" required />
          </div>
          <div class="form-group">
            <label>Catégorie *</label>
            <input type="text" v-model="form.categorie" required placeholder="Légumes, Fruits, Herbes…" />
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" rows="3"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Prix (€)</label>
            <input type="number" v-model.number="form.prix" step="0.01" min="0" placeholder="Laisser vide si non affiché" />
          </div>
          <div class="form-group">
            <label>Unité *</label>
            <input type="text" v-model="form.unite" required placeholder="kg, botte, pièce…" />
          </div>
        </div>
        <div class="form-group">
          <label>URL image</label>
          <input type="url" v-model="form.image" placeholder="https://…" />
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="form.disponible" />
            Produit disponible (visible sur le site)
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button>
          <button type="button" class="btn btn-secondary" @click="closeForm">Annuler</button>
        </div>
      </form>
    </div>

    <!-- Liste produits -->
    <div v-if="pending" class="loading">Chargement…</div>
    <table v-else-if="produits?.length" class="products-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Catégorie</th>
          <th>Prix</th>
          <th>Unité</th>
          <th>Dispo</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in produits" :key="p.id">
          <td>{{ p.nom }}</td>
          <td>{{ p.categorie }}</td>
          <td>{{ p.prix ? p.prix + ' €' : '—' }}</td>
          <td>{{ p.unite }}</td>
          <td>
            <span :class="['badge-dispo', p.disponible ? 'yes' : 'no']">
              {{ p.disponible ? 'Oui' : 'Non' }}
            </span>
          </td>
          <td class="actions">
            <button class="btn-link" @click="openForm(p)">Modifier</button>
            <button class="btn-link danger" @click="deleteProduct(p.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">Aucun produit. Ajoutez-en un !</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin-auth' })

const { data: produits, pending, refresh } = await useFetch<any[]>('/api/produits?all=1')
const formOpen = ref(false)
const editId = ref<number | null>(null)
const saving = ref(false)
const alert = reactive({ msg: '', type: 'success' })

const defaultForm = () => ({ nom: '', categorie: '', description: '', prix: null as number | null, unite: 'kg', image: '', disponible: true })
const form = reactive(defaultForm())

function openForm(p?: any) {
  editId.value = p?.id ?? null
  Object.assign(form, p ? { ...p } : defaultForm())
  formOpen.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function closeForm() { formOpen.value = false; editId.value = null; Object.assign(form, defaultForm()) }

function showAlert(msg: string, type = 'success') {
  alert.msg = msg; alert.type = type
  setTimeout(() => { alert.msg = '' }, 4000)
}

async function saveProduct() {
  saving.value = true
  try {
    if (editId.value) {
      await $fetch(`/api/produits/${editId.value}`, { method: 'PUT', body: { ...form } })
      showAlert('Produit modifié avec succès.')
    } else {
      await $fetch('/api/produits', { method: 'POST', body: { ...form } })
      showAlert('Produit ajouté avec succès.')
    }
    closeForm()
    await refresh()
  } catch {
    showAlert('Erreur lors de l\'enregistrement.', 'error')
  } finally {
    saving.value = false
  }
}

async function deleteProduct(id: number) {
  if (!confirm('Supprimer ce produit ?')) return
  try {
    await $fetch(`/api/produits/${id}`, { method: 'DELETE' })
    showAlert('Produit supprimé.')
    await refresh()
  } catch {
    showAlert('Erreur lors de la suppression.', 'error')
  }
}

useHead({ title: 'Produits — Admin Ferme de l\'Ormois' })
</script>

<style scoped>
.page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.page-header h1 { font-size: 1.5rem; color: var(--vert-fonce); flex: 1; }
.back-link { color: var(--vert); font-size: 0.9rem; }
.product-form-card {
  background: var(--blanc); padding: 1.75rem; border-radius: 10px;
  box-shadow: var(--ombre); margin-bottom: 2rem; border-left: 4px solid var(--vert);
}
.product-form-card h2 { margin-bottom: 1.25rem; color: var(--vert-fonce); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
.products-table { width: 100%; border-collapse: collapse; background: var(--blanc); border-radius: 10px; overflow: hidden; box-shadow: var(--ombre); }
.products-table th { background: var(--vert-fonce); color: var(--blanc); padding: 0.75rem 1rem; text-align: left; font-size: 0.85rem; }
.products-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--beige-fonce); font-size: 0.9rem; }
.products-table tr:last-child td { border-bottom: none; }
.badge-dispo { padding: 2px 8px; border-radius: 20px; font-size: 0.8rem; }
.badge-dispo.yes { background: #d4edda; color: #155724; }
.badge-dispo.no { background: #f8d7da; color: #721c24; }
.actions { display: flex; gap: 0.75rem; }
.btn-link { background: none; border: none; cursor: pointer; font-family: inherit; font-size: 0.85rem; color: var(--vert); padding: 0; }
.btn-link:hover { text-decoration: underline; }
.btn-link.danger { color: #c0392b; }
.empty, .loading { text-align: center; padding: 3rem; color: #888; }
@media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
</style>
