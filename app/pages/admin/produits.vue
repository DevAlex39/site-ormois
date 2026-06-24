<template>
  <div class="admin-layout">

    <!-- Sidebar -->
    <AdminSidebar active="produits" />

    <!-- Contenu -->
    <main class="admin-main">
      <div class="admin-topbar">
        <div>
          <h1>Produits</h1>
          <p class="topbar-sub">{{ produits?.length ?? 0 }} produit(s) au total</p>
        </div>
        <button class="btn btn-primary" @click="openForm()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouveau produit
        </button>
      </div>

      <div class="main-body">

        <!-- Alerte -->
        <div v-if="alert.msg" :class="['alert', `alert-${alert.type}`]">{{ alert.msg }}</div>

        <!-- Drawer formulaire -->
        <Transition name="slide">
          <div v-if="formOpen" class="form-drawer">
            <div class="form-drawer-header">
              <h2>{{ editId ? 'Modifier le produit' : 'Nouveau produit' }}</h2>
              <button class="close-btn" @click="closeForm" aria-label="Fermer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form @submit.prevent="saveProduct" class="form-body">
              <div class="form-row">
                <div class="form-group">
                  <label>Nom *</label>
                  <input type="text" v-model="form.nom" required placeholder="Tomates cerises…" />
                </div>
                <div class="form-group">
                  <label>Catégorie *</label>
                  <input type="text" v-model="form.categorie" required placeholder="Légumes, Fruits…" list="categories-list" />
                  <datalist id="categories-list">
                    <option v-for="c in existingCategories" :key="c" :value="c" />
                  </datalist>
                </div>
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea v-model="form.description" rows="3" placeholder="Décrivez le produit…"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Prix (€)</label>
                  <input type="number" v-model.number="form.prix" step="0.01" min="0" placeholder="Ex. 3,50 — vide = non affiché" />
                </div>
                <div class="form-group">
                  <label>Unité *</label>
                  <input type="text" v-model="form.unite" required placeholder="kg, botte, pièce…" list="unites-list" />
                  <datalist id="unites-list">
                    <option value="kg" /><option value="botte" /><option value="pièce" /><option value="barquette" /><option value="litre" />
                  </datalist>
                </div>
              </div>

              <!-- Sélecteur image -->
              <div class="form-group">
                <label>Image du produit</label>
                <div class="image-picker">
                  <div class="image-preview" :class="{ 'has-image': previewUrl }">
                    <img v-if="previewUrl" :src="previewUrl" alt="Aperçu" />
                    <span v-else class="preview-placeholder" v-html="placeholderIcon"></span>
                  </div>
                  <div class="image-actions">
                    <label class="btn btn-outline img-upload-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Choisir depuis le PC
                      <input type="file" accept="image/*" @change="onFileChange" class="visually-hidden" ref="fileInput" />
                    </label>
                    <button v-if="previewUrl" type="button" class="btn btn-ghost-dark" @click="clearImage">Supprimer</button>
                    <p class="img-hint">JPG, PNG ou WebP · max 5 Mo</p>
                  </div>
                </div>
              </div>

              <!-- Visibilité -->
              <div class="form-group">
                <label class="toggle-label">
                  <span>Visible sur le site</span>
                  <button type="button" class="toggle" :class="{ on: form.disponible }" @click="form.disponible = !form.disponible" :aria-checked="form.disponible" role="switch">
                    <span class="toggle-knob"></span>
                  </button>
                </label>
                <p class="field-hint">{{ form.disponible ? 'Le produit est affiché dans le catalogue.' : 'Le produit est masqué du catalogue.' }}</p>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  {{ saving ? 'Enregistrement…' : (editId ? 'Mettre à jour' : 'Ajouter le produit') }}
                </button>
                <button type="button" class="btn btn-outline" @click="closeForm">Annuler</button>
              </div>
            </form>
          </div>
        </Transition>

        <!-- Filtres -->
        <div class="filters-bar">
          <div class="filter-group">
            <button
              v-for="f in visibilityFilters"
              :key="f.value"
              class="filter-pill"
              :class="{ active: filterVisible === f.value }"
              @click="filterVisible = f.value"
            >{{ f.label }}</button>
          </div>
          <div class="filter-group">
            <button
              v-for="c in ['Toutes', ...existingCategories]"
              :key="c"
              class="filter-pill"
              :class="{ active: filterCat === c }"
              @click="filterCat = c"
            >{{ c }}</button>
          </div>
        </div>

        <!-- Grille produits -->
        <div v-if="pending" class="state-msg">Chargement…</div>
        <div v-else-if="!filtered.length" class="state-msg">Aucun produit correspondant.</div>
        <div v-else class="products-admin-grid">
          <div v-for="p in filtered" :key="p.id" class="product-tile">
            <div class="tile-img">
              <img v-if="p.image" :src="p.image" :alt="p.nom" />
              <span v-else class="tile-img-placeholder" v-html="placeholderIcon"></span>
              <span class="tile-visibility" :class="p.disponible ? 'vis' : 'hid'">
                {{ p.disponible ? 'Visible' : 'Masqué' }}
              </span>
            </div>
            <div class="tile-body">
              <div class="tile-cat">{{ p.categorie }}</div>
              <h3>{{ p.nom }}</h3>
              <p class="tile-desc">{{ p.description }}</p>
              <div class="tile-price">{{ p.prix ? formatPrice(p.prix) + ' € / ' + p.unite : p.unite }}</div>
            </div>
            <div class="tile-actions">
              <button class="tile-btn" @click="openForm(p)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Modifier
              </button>
              <button class="tile-btn toggle-vis" @click="toggleVisibility(p)">
                {{ p.disponible ? 'Masquer' : 'Afficher' }}
              </button>
              <button class="tile-btn danger" @click="deleteProduct(p.id)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin-auth' })

const { data: produits, pending, refresh } = await useFetch<any[]>('/api/produits?all=1')

/* ---- Filtres ---- */
const filterVisible = ref<'all' | 'visible' | 'hidden'>('all')
const filterCat = ref('Toutes')
const visibilityFilters = [
  { label: 'Tous', value: 'all' },
  { label: 'Visibles', value: 'visible' },
  { label: 'Masqués', value: 'hidden' },
]

const existingCategories = computed(() => {
  if (!produits.value) return []
  return [...new Set(produits.value.map((p: any) => p.categorie))].filter(Boolean) as string[]
})

const filtered = computed(() => {
  if (!produits.value) return []
  return produits.value.filter((p: any) => {
    const visOk = filterVisible.value === 'all'
      || (filterVisible.value === 'visible' && p.disponible)
      || (filterVisible.value === 'hidden' && !p.disponible)
    const catOk = filterCat.value === 'Toutes' || p.categorie === filterCat.value
    return visOk && catOk
  })
})

/* ---- Formulaire ---- */
const formOpen = ref(false)
const editId = ref<number | null>(null)
const saving = ref(false)
const alert = reactive({ msg: '', type: 'success' })
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const uploadedImagePath = ref('')

const defaultForm = () => ({
  nom: '', categorie: '', description: '',
  prix: null as number | null, unite: 'kg', image: '', disponible: true,
})
const form = reactive(defaultForm())

function openForm(p?: any) {
  editId.value = p?.id ?? null
  Object.assign(form, p ? { ...p, disponible: Boolean(p.disponible) } : defaultForm())
  previewUrl.value = p?.image || ''
  uploadedImagePath.value = p?.image || ''
  formOpen.value = true
  nextTick(() => document.querySelector('.form-drawer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function closeForm() {
  formOpen.value = false
  editId.value = null
  previewUrl.value = ''
  uploadedImagePath.value = ''
  Object.assign(form, defaultForm())
}

function showAlert(msg: string, type = 'success') {
  alert.msg = msg
  alert.type = type
  setTimeout(() => { alert.msg = '' }, 4000)
}

/* ---- Upload image ---- */
async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    showAlert('L\'image dépasse 5 Mo.', 'error')
    return
  }
  previewUrl.value = URL.createObjectURL(file)
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body: fd })
    uploadedImagePath.value = res.path
  } catch {
    showAlert('Erreur lors de l\'upload de l\'image.', 'error')
    previewUrl.value = ''
  }
}

function clearImage() {
  previewUrl.value = ''
  uploadedImagePath.value = ''
  form.image = ''
  if (fileInput.value) fileInput.value.value = ''
}

/* ---- Sauvegarde ---- */
async function saveProduct() {
  saving.value = true
  try {
    const body = { ...form, image: uploadedImagePath.value || form.image }
    if (editId.value) {
      await $fetch(`/api/produits/${editId.value}`, { method: 'PUT', body })
      showAlert('Produit mis à jour.')
    } else {
      await $fetch('/api/produits', { method: 'POST', body })
      showAlert('Produit ajouté.')
    }
    closeForm()
    await refresh()
  } catch {
    showAlert('Erreur lors de l\'enregistrement.', 'error')
  } finally {
    saving.value = false
  }
}

/* ---- Toggle visibilité rapide ---- */
async function toggleVisibility(p: any) {
  try {
    await $fetch(`/api/produits/${p.id}`, { method: 'PUT', body: { ...p, disponible: !p.disponible } })
    await refresh()
  } catch {
    showAlert('Erreur lors de la mise à jour.', 'error')
  }
}

/* ---- Suppression ---- */
async function deleteProduct(id: number) {
  if (!confirm('Supprimer ce produit définitivement ?')) return
  try {
    await $fetch(`/api/produits/${id}`, { method: 'DELETE' })
    showAlert('Produit supprimé.')
    await refresh()
  } catch {
    showAlert('Erreur lors de la suppression.', 'error')
  }
}

function formatPrice(v: number) { return Number(v).toFixed(2).replace('.', ',') }

const placeholderIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" width="36" height="36"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`

useHead({ title: 'Produits — Admin Ferme de l\'Ormois' })
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-main { flex: 1; background: var(--beige-fonce); display: flex; flex-direction: column; min-width: 0; }

/* Topbar */
.admin-topbar {
  background: var(--creme); border-bottom: 1px solid #e0d9ca;
  padding: 1.25rem 2rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.admin-topbar h1 { font-family: 'Marcellus', serif; font-size: 1.4rem; color: var(--vert-fonce); }
.topbar-sub { font-size: 0.82rem; color: var(--texte-doux); margin-top: 0.15rem; }
.btn-primary { border-radius: 10px; padding: 0.65rem 1.25rem; font-size: 0.92rem; }

.main-body { padding: 1.75rem 2rem; flex: 1; }

/* Drawer formulaire */
.form-drawer {
  background: var(--creme); border-radius: 16px; box-shadow: var(--ombre-forte);
  margin-bottom: 1.75rem; border-left: 4px solid var(--vert); overflow: hidden;
}
.form-drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e8e0d0;
}
.form-drawer-header h2 { font-family: 'Marcellus', serif; font-size: 1.2rem; color: var(--vert-fonce); }
.close-btn {
  width: 34px; height: 34px; border-radius: 8px; border: none; background: #ede8df;
  color: var(--texte-doux); cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.close-btn:hover { background: #ddd8ce; }
.form-body { padding: 1.5rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

/* Image picker */
.image-picker { display: flex; gap: 1.25rem; align-items: flex-start; }
.image-preview {
  width: 110px; height: 110px; flex-shrink: 0; border-radius: 12px;
  border: 2px dashed #d0c9ba; background: #f0ebe1;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.image-preview.has-image { border-style: solid; border-color: var(--vert); }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }
.preview-placeholder { color: #c5b99d; }
.image-actions { display: flex; flex-direction: column; gap: 0.6rem; justify-content: center; }
.img-upload-btn {
  font-size: 0.88rem; padding: 0.55rem 1rem; border-radius: 8px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.5rem;
}
.btn-ghost-dark {
  background: none; border: 1.5px solid #d0c9ba; color: #c0392b;
  border-radius: 8px; padding: 0.45rem 0.9rem; font-size: 0.85rem;
  font-family: 'Spectral', serif; cursor: pointer; transition: background 0.15s;
}
.btn-ghost-dark:hover { background: #fce8e5; }
.img-hint { font-size: 0.78rem; color: #aaa; }
.visually-hidden { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }

/* Toggle switch */
.toggle-label {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem 1rem; background: #f0ebe2; border-radius: 10px; cursor: pointer;
}
.toggle-label span { font-weight: 600; font-size: 0.9rem; color: #4a4537; }
.toggle {
  width: 44px; height: 24px; border-radius: 40px; background: #d0c9ba;
  border: none; cursor: pointer; padding: 2px; transition: background 0.25s;
  position: relative;
}
.toggle.on { background: var(--vert); }
.toggle-knob {
  display: block; width: 20px; height: 20px; border-radius: 50%; background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s;
}
.toggle.on .toggle-knob { transform: translateX(20px); }
.field-hint { font-size: 0.8rem; color: var(--texte-doux); margin-top: 0.4rem; padding-left: 0.25rem; }

.form-actions { display: flex; gap: 0.75rem; padding-top: 0.5rem; flex-wrap: wrap; }
.form-actions .btn { border-radius: 10px; padding: 0.65rem 1.4rem; }

/* Slide animation */
.slide-enter-active, .slide-leave-active { transition: opacity 0.2s, transform 0.2s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-12px); }

/* Filtres */
.filters-bar {
  display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; align-items: center;
}
.filter-group { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.filter-pill {
  padding: 0.35rem 0.9rem; border-radius: 30px; font-size: 0.85rem;
  font-family: 'Spectral', serif; border: 1.5px solid #d8cdb5;
  background: var(--creme); color: #5a5446; cursor: pointer; transition: all 0.18s;
}
.filter-pill.active, .filter-pill:hover { background: var(--vert); color: #fff; border-color: var(--vert); }

/* Grille produits admin */
.products-admin-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem;
}
.product-tile {
  background: var(--creme); border-radius: 14px; overflow: hidden;
  box-shadow: var(--ombre); display: flex; flex-direction: column;
  border: 1.5px solid transparent; transition: border-color 0.18s;
}
.product-tile:hover { border-color: #d0c9ba; }
.tile-img { height: 140px; background: #e7dcc6; position: relative; overflow: hidden; }
.tile-img img { width: 100%; height: 100%; object-fit: cover; }
.tile-img-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; color: #c5b99d; }
.tile-visibility {
  position: absolute; top: 8px; right: 8px;
  font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 600;
}
.tile-visibility.vis { background: #d4edda; color: #1a6b25; }
.tile-visibility.hid { background: #f8e0dc; color: #a04030; }
.tile-body { padding: 0.9rem 1rem; flex: 1; }
.tile-cat { font-size: 0.72rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--terre); margin-bottom: 0.3rem; }
.tile-body h3 { font-family: 'Marcellus', serif; font-size: 1.05rem; color: var(--vert-fonce); margin-bottom: 0.3rem; }
.tile-desc { font-size: 0.82rem; color: var(--texte-doux); line-height: 1.5; margin-bottom: 0.5rem; min-height: 36px; }
.tile-price { font-family: 'Marcellus', serif; font-size: 1rem; color: var(--terre); }
.tile-actions {
  display: flex; gap: 0.4rem; padding: 0.75rem 1rem;
  border-top: 1px solid #ede8df; flex-wrap: wrap;
}
.tile-btn {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.3rem;
  padding: 0.45rem 0.6rem; border-radius: 8px; border: 1.5px solid #d8cdb5;
  background: var(--beige); color: var(--texte); font-family: 'Spectral', serif;
  font-size: 0.78rem; cursor: pointer; transition: all 0.15s;
}
.tile-btn:hover { background: var(--vert); color: #fff; border-color: var(--vert); }
.tile-btn.toggle-vis { border-color: #c0d8c2; color: var(--vert); }
.tile-btn.toggle-vis:hover { background: var(--vert); color: #fff; }
.tile-btn.danger:hover { background: #c0392b; border-color: #c0392b; color: #fff; }

.state-msg { text-align: center; padding: 3rem; color: var(--texte-doux); font-size: 1.05rem; }

@media (max-width: 860px) {
  .main-body { padding: 1.25rem; }
  .admin-topbar { padding: 1rem 1.25rem; }
  .form-row { grid-template-columns: 1fr; }
  .image-picker { flex-direction: column; }
}
</style>
