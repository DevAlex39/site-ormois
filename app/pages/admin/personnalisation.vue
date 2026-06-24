<template>
  <div class="admin-layout">
    <AdminSidebar active="personnalisation" />

    <main class="admin-main">
      <div class="admin-topbar">
        <div>
          <h1>Personnalisation</h1>
          <p class="topbar-sub">Modifiez les textes et les images du site</p>
        </div>
        <button class="btn-save" :disabled="saving" @click="saveAll">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
      </div>

      <div class="main-body">
        <div v-if="success" class="alert alert-success">✓ Modifications enregistrées</div>
        <div v-if="error" class="alert alert-error">{{ error }}</div>

        <!-- Onglets -->
        <div class="tabs">
          <button v-for="tab in tabs" :key="tab.id" class="tab" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
            <span v-html="tab.icon"></span> {{ tab.label }}
          </button>
        </div>

        <!-- Onglet Général -->
        <div v-if="activeTab === 'general'" class="tab-panel">
          <div class="section-card">
            <h3 class="card-title">Identité du site</h3>
            <div class="form-group">
              <label>Logo</label>
              <div class="image-picker">
                <div class="img-preview logo-preview" v-if="form.general_logo">
                  <img :src="form.general_logo" alt="Logo" />
                  <button class="img-remove" @click="form.general_logo = ''" title="Supprimer">✕</button>
                </div>
                <div class="logo-svg-fallback" v-else>
                  <svg viewBox="0 0 48 48" width="48" height="48"><circle cx="24" cy="24" r="23" fill="#2f6b39"/><path d="M24 37 V21" fill="none" stroke="#f4ecdc" stroke-width="2" stroke-linecap="round"/><path d="M24 28 C17.5 28 13 23.5 13 16.5 C20 16.5 24 21 24 28 Z" fill="#f4ecdc"/><path d="M24 25 C30.5 25 35 20.5 35 13.5 C28 13.5 24 18 24 25 Z" fill="#cfe3b8"/></svg>
                  <span>Logo par défaut</span>
                </div>
                <label class="upload-btn" :class="{ uploading: uploadingLogo }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {{ uploadingLogo ? 'Envoi…' : 'Changer le logo' }}
                  <input type="file" accept="image/*" style="display:none" @change="uploadLogo" />
                </label>
              </div>
              <p class="field-hint">Formats recommandés : PNG ou SVG avec fond transparent. Si vide, le logo vert par défaut est utilisé.</p>
            </div>
            <div class="form-group">
              <label>Nom de la ferme</label>
              <input v-model="form.general_nom" type="text" placeholder="La Ferme de l'Ormois" />
            </div>
            <div class="form-group">
              <label>Slogan (sous le titre sur la page d'accueil)</label>
              <input v-model="form.general_slogan" type="text" placeholder="Maraîchage en circuit court · Marandeuil, Côte-d'Or" />
            </div>
          </div>
        </div>

        <!-- Onglet La Ferme -->
        <div v-if="activeTab === 'ferme'" class="tab-panel">
          <div class="section-card">
            <h3 class="card-title">Section « La Ferme »</h3>
            <div class="form-group">
              <label>Image de la section</label>
              <div class="image-picker">
                <div class="img-preview" v-if="form.ferme_image">
                  <img :src="form.ferme_image" alt="Aperçu" />
                  <button class="img-remove" @click="form.ferme_image = ''" title="Supprimer">✕</button>
                </div>
                <label class="upload-btn" :class="{ uploading: uploadingFerme }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {{ uploadingFerme ? 'Envoi…' : 'Choisir une image' }}
                  <input type="file" accept="image/*" style="display:none" @change="uploadFermeImage" />
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>Titre principal</label>
              <input v-model="form.ferme_titre" type="text" placeholder="Titre de la section La Ferme" />
            </div>
            <div class="form-group">
              <label>Paragraphe 1</label>
              <textarea v-model="form.ferme_lead1" rows="4" placeholder="Premier paragraphe…"></textarea>
            </div>
            <div class="form-group">
              <label>Paragraphe 2</label>
              <textarea v-model="form.ferme_lead2" rows="3" placeholder="Deuxième paragraphe…"></textarea>
            </div>
          </div>
        </div>

        <!-- Onglet À propos -->
        <div v-if="activeTab === 'apropos'" class="tab-panel">
          <div class="section-card">
            <h3 class="card-title">Section « À propos de nous »</h3>
            <div class="form-group">
              <label>Titre principal</label>
              <input v-model="form.apropos_titre" type="text" placeholder="Titre de la section À propos" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Badge ligne 1</label>
                <input v-model="form.apropos_badge1" type="text" placeholder="Du semis" />
              </div>
              <div class="form-group">
                <label>Badge ligne 2</label>
                <input v-model="form.apropos_badge2" type="text" placeholder="jusqu'à votre panier" />
              </div>
            </div>
            <div class="form-group">
              <label>Image de la section</label>
              <div class="image-picker">
                <div class="img-preview" v-if="form.apropos_image">
                  <img :src="form.apropos_image" alt="Aperçu" />
                  <button class="img-remove" @click="form.apropos_image = ''" title="Supprimer">✕</button>
                </div>
                <label class="upload-btn" :class="{ uploading: uploadingApropos }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {{ uploadingApropos ? 'Envoi…' : 'Choisir une image' }}
                  <input type="file" accept="image/*" style="display:none" @change="uploadAproposImage" />
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>Paragraphe 1</label>
              <textarea v-model="form.apropos_para1" rows="4" placeholder="Premier paragraphe…"></textarea>
            </div>
            <div class="form-group">
              <label>Paragraphe 2</label>
              <textarea v-model="form.apropos_para2" rows="4" placeholder="Deuxième paragraphe…"></textarea>
            </div>
            <div class="form-group">
              <label>Paragraphe 3</label>
              <textarea v-model="form.apropos_para3" rows="4" placeholder="Troisième paragraphe…"></textarea>
            </div>
            <div class="form-group">
              <label>Signature</label>
              <input v-model="form.apropos_signature" type="text" placeholder="La famille de la Ferme de l'Ormois" />
            </div>
          </div>
        </div>

        <!-- Onglet Contact -->
        <div v-if="activeTab === 'contact'" class="tab-panel">
          <div class="section-card">
            <h3 class="card-title">Informations de contact</h3>
            <div class="form-group">
              <label>Adresse</label>
              <textarea v-model="form.contact_adresse" rows="2" placeholder="7 BIS Route de l'Ormois&#10;21270 Marandeuil, France"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Téléphone</label>
                <input v-model="form.contact_telephone" type="text" placeholder="06 20 49 93 21" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="form.contact_email" type="email" placeholder="lafermedelormois@gmail.com" />
              </div>
            </div>
            <div class="form-group">
              <label>Lien Facebook</label>
              <input v-model="form.contact_facebook" type="url" placeholder="https://www.facebook.com/lafermedelormois" />
            </div>
            <div class="form-group">
              <label>Horaires / Infos pratiques <span class="label-hint">(optionnel)</span></label>
              <textarea v-model="form.contact_horaires" rows="4" placeholder="Ex : Vente directe à la ferme le samedi matin de 8h à 12h..."></textarea>
            </div>
            <div class="form-group">
              <label>Envoi d'emails automatiques</label>
              <div class="toggle-row">
                <button
                  class="toggle-btn" :class="{ active: form.mail_actif === '1' }"
                  @click="form.mail_actif = form.mail_actif === '1' ? '0' : '1'"
                  type="button"
                >
                  <span class="toggle-dot"></span>
                </button>
                <span class="toggle-label">
                  <template v-if="form.mail_actif === '1'">Activé — les clients reçoivent un email à chaque commande et changement de statut</template>
                  <template v-else>Désactivé — aucun email envoyé (à activer après configuration SMTP)</template>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Galerie -->
        <div v-if="activeTab === 'galerie'" class="tab-panel">
          <div class="section-card">
            <div class="galerie-header">
              <h3 class="card-title">Photos de la galerie</h3>
              <label class="btn-add-photo" :class="{ uploading: uploadingGallery }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {{ uploadingGallery ? 'Envoi…' : 'Ajouter une photo' }}
                <input type="file" accept="image/*" multiple style="display:none" @change="uploadGalleryImages" />
              </label>
            </div>
            <p class="galerie-hint">Faites glisser les photos pour les réorganiser. La première photo occupe une grande place dans la galerie.</p>

            <div v-if="!gallery.length" class="empty-gallery">
              <p>Aucune photo dans la galerie. Ajoutez-en une !</p>
            </div>

            <div class="gallery-grid" v-else>
              <div
                v-for="(item, i) in gallery"
                :key="item.id"
                class="gallery-tile"
                draggable="true"
                @dragstart="dragStart(i)"
                @dragover.prevent
                @drop="dragDrop(i)"
                :class="{ dragging: dragIndex === i }"
              >
                <img :src="item.path" alt="Photo galerie" />
                <div class="tile-overlay">
                  <span class="tile-num">{{ i + 1 }}</span>
                  <button class="tile-delete" @click="deleteGalleryItem(item.id)" title="Supprimer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useHead({ title: 'Personnalisation — Admin Ferme de l\'Ormois' })

const activeTab = ref('ferme')
const saving = ref(false)
const success = ref(false)
const error = ref('')
const uploadingLogo = ref(false)
const uploadingFerme = ref(false)
const uploadingApropos = ref(false)
const uploadingGallery = ref(false)

const tabs = [
  { id: 'general', label: 'Général', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>` },
  { id: 'ferme', label: 'La Ferme', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>` },
  { id: 'apropos', label: 'À propos', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
  { id: 'galerie', label: 'Galerie', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` },
  { id: 'contact', label: 'Contact', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>` },
]

const KEYS = ['general_logo','general_nom','general_slogan','ferme_image','ferme_titre','ferme_lead1','ferme_lead2','apropos_titre','apropos_badge1','apropos_badge2','apropos_image','apropos_para1','apropos_para2','apropos_para3','apropos_signature','contact_adresse','contact_telephone','contact_email','contact_facebook','contact_horaires','mail_actif']

const form = reactive<Record<string, string>>(Object.fromEntries(KEYS.map(k => [k, ''])))
const gallery = ref<{ id: number; path: string; ordre: number }[]>([])

const { data: contenuData } = await useFetch<Record<string, string>>('/api/contenu')
const { data: galerieData } = await useFetch<{ id: number; path: string; ordre: number }[]>('/api/galerie')

watchEffect(() => {
  if (contenuData.value) {
    for (const k of KEYS) {
      if (contenuData.value[k] !== undefined) form[k] = contenuData.value[k]
    }
  }
})
watchEffect(() => {
  if (galerieData.value) gallery.value = [...galerieData.value]
})

async function saveAll() {
  saving.value = true
  error.value = ''
  success.value = false
  try {
    for (const cle of KEYS) {
      await $fetch('/api/admin/contenu', { method: 'PUT', body: { cle, valeur: form[cle] } })
    }
    success.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch {
    error.value = 'Erreur lors de l\'enregistrement.'
  } finally {
    saving.value = false
  }
}

async function uploadLogo(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingLogo.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { path } = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body: fd })
    form.general_logo = path
  } catch { error.value = 'Erreur lors de l\'upload.' }
  finally { uploadingLogo.value = false }
}

async function uploadFermeImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingFerme.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { path } = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body: fd })
    form.ferme_image = path
  } catch { error.value = 'Erreur lors de l\'upload.' }
  finally { uploadingFerme.value = false }
}

async function uploadAproposImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingApropos.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const { path } = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body: fd })
    form.apropos_image = path
  } catch { error.value = 'Erreur lors de l\'upload.' }
  finally { uploadingApropos.value = false }
}

async function uploadGalleryImages(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) return
  uploadingGallery.value = true
  try {
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const { path } = await $fetch<{ path: string }>('/api/admin/upload', { method: 'POST', body: fd })
      const item = await $fetch<{ id: number; path: string; ordre: number }>('/api/admin/galerie', { method: 'POST', body: { path } })
      gallery.value.push(item)
    }
  } catch { error.value = 'Erreur lors de l\'upload.' }
  finally { uploadingGallery.value = false; (e.target as HTMLInputElement).value = '' }
}

async function deleteGalleryItem(id: number) {
  if (!confirm('Supprimer cette photo de la galerie ?')) return
  await $fetch(`/api/admin/galerie/${id}`, { method: 'DELETE' })
  gallery.value = gallery.value.filter(g => g.id !== id)
  await saveGalleryOrder()
}

const dragIndex = ref<number | null>(null)
function dragStart(i: number) { dragIndex.value = i }
function dragDrop(i: number) {
  if (dragIndex.value === null || dragIndex.value === i) return
  const arr = [...gallery.value]
  const [moved] = arr.splice(dragIndex.value, 1)
  arr.splice(i, 0, moved)
  gallery.value = arr
  dragIndex.value = null
  saveGalleryOrder()
}
async function saveGalleryOrder() {
  await $fetch('/api/admin/galerie/reorder', { method: 'PUT', body: { ids: gallery.value.map(g => g.id) } })
}
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-main { flex: 1; background: var(--beige-fonce); display: flex; flex-direction: column; min-width: 0; }

.admin-topbar {
  background: var(--creme); border-bottom: 1px solid #e0d9ca;
  padding: 1.25rem 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 10;
}
.admin-topbar h1 { font-family: 'Marcellus', serif; font-size: 1.4rem; color: var(--vert-fonce); }
.topbar-sub { font-size: 0.82rem; color: var(--texte-doux); margin-top: 0.15rem; }

.btn-save {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.3rem; border-radius: 10px;
  background: var(--vert); color: #fff;
  border: none; cursor: pointer; font-family: inherit; font-size: 0.9rem; font-weight: 600;
  transition: background 0.18s;
}
.btn-save:hover:not(:disabled) { background: var(--vert-fonce); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.main-body { padding: 1.75rem 2rem; }
.alert { padding: 0.9rem 1.2rem; border-radius: 10px; margin-bottom: 1rem; font-size: 0.92rem; }
.alert-success { background: #e3efdf; color: #25551f; border: 1px solid #c3e0bb; }
.alert-error { background: #f8e0dc; color: #7a2e1f; border: 1px solid #f0c4bb; }

.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #e0d9ca; padding-bottom: 0; }
.tab {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.65rem 1.2rem; border-radius: 10px 10px 0 0;
  border: none; background: none; cursor: pointer;
  font-family: 'Spectral', serif; font-size: 0.9rem; color: var(--texte-doux);
  margin-bottom: -2px; border-bottom: 2px solid transparent;
  transition: color 0.18s, border-color 0.18s;
}
.tab:hover { color: var(--vert); }
.tab.active { color: var(--vert-fonce); border-bottom-color: var(--vert); background: var(--creme); font-weight: 600; }

.section-card { background: var(--creme); border-radius: 16px; padding: 1.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.card-title { font-family: 'Marcellus', serif; font-size: 1.1rem; color: var(--vert-fonce); margin-bottom: 1.4rem; }

.form-group { margin-bottom: 1.2rem; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #4a4537; margin-bottom: 0.4rem; }
.form-group input, .form-group textarea {
  width: 100%; padding: 0.7rem 0.9rem;
  border: 1.5px solid #d8cdb5; border-radius: 10px;
  font-family: 'Spectral', serif; font-size: 0.95rem;
  background: var(--beige); color: var(--texte);
  transition: border-color 0.18s; resize: vertical;
}
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--vert); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

/* Image picker */
.image-picker { display: flex; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
.img-preview { position: relative; width: 140px; height: 100px; border-radius: 10px; overflow: hidden; box-shadow: var(--ombre); }
.img-preview img { width: 100%; height: 100%; object-fit: cover; }
.img-remove {
  position: absolute; top: 5px; right: 5px;
  width: 24px; height: 24px; border-radius: 50%;
  background: rgba(0,0,0,0.55); color: #fff;
  border: none; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center;
}
.logo-preview { width: 80px; height: 80px; }
.logo-svg-fallback {
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  padding: 0.75rem 1rem; border-radius: 10px;
  background: var(--beige-fonce); border: 1.5px solid #d8cdb5;
  color: var(--texte-doux); font-size: 0.78rem;
}
.field-hint { font-size: 0.78rem; color: var(--texte-doux); margin-top: 0.4rem; }
.label-hint { font-size: 0.78rem; color: var(--texte-doux); font-weight: 400; }
.toggle-row { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.4rem; }
.toggle-btn { width: 46px; height: 26px; border-radius: 13px; border: none; background: #d8cdb5; cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0; padding: 0; }
.toggle-btn.active { background: var(--vert); }
.toggle-dot { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: transform 0.2s; display: block; }
.toggle-btn.active .toggle-dot { transform: translateX(20px); }
.toggle-label { font-size: 0.85rem; color: var(--texte-doux); line-height: 1.4; }

.upload-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.1rem; border-radius: 10px;
  border: 1.5px dashed #b9a98a; background: var(--beige-fonce);
  color: var(--texte-doux); font-size: 0.88rem; cursor: pointer;
  transition: border-color 0.18s, color 0.18s;
}
.upload-btn:hover, .upload-btn.uploading { border-color: var(--vert); color: var(--vert); }

/* Galerie admin */
.galerie-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
.galerie-hint { font-size: 0.82rem; color: var(--texte-doux); margin-bottom: 1.25rem; }
.btn-add-photo {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.6rem 1.1rem; border-radius: 10px;
  background: var(--vert); color: #fff;
  font-size: 0.88rem; cursor: pointer;
  transition: background 0.18s;
}
.btn-add-photo:hover, .btn-add-photo.uploading { background: var(--vert-fonce); }

.empty-gallery { text-align: center; padding: 3rem; color: var(--texte-doux); background: var(--beige-fonce); border-radius: 12px; border: 1.5px dashed #d0c6b0; }

.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.85rem; }
.gallery-tile {
  position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden;
  cursor: grab; box-shadow: var(--ombre);
  transition: opacity 0.2s, transform 0.2s;
}
.gallery-tile:active { cursor: grabbing; }
.gallery-tile.dragging { opacity: 0.4; transform: scale(0.96); }
.gallery-tile img { width: 100%; height: 100%; object-fit: cover; }
.tile-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 0.5rem; opacity: 0; transition: opacity 0.2s;
}
.gallery-tile:hover .tile-overlay { opacity: 1; }
.tile-num { font-family: 'Marcellus', serif; font-size: 0.85rem; color: rgba(255,255,255,0.8); }
.tile-delete {
  background: rgba(185,102,63,0.85); border: none; border-radius: 6px;
  color: #fff; cursor: pointer; padding: 0.25rem;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.18s;
}
.tile-delete:hover { background: var(--terre); }

@media (max-width: 860px) {
  .main-body { padding: 1.25rem; }
  .form-row { grid-template-columns: 1fr; }
  .admin-topbar { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
}
</style>
