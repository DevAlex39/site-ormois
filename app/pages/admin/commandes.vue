<template>
  <div class="admin-layout">
    <AdminSidebar active="commandes" />

    <main class="admin-main">
      <div class="admin-topbar">
        <div>
          <h1>Commandes</h1>
          <p class="topbar-sub">{{ commandes?.length ?? 0 }} commande(s) reçue(s)</p>
        </div>
        <div class="view-toggle">
          <button :class="{ active: view === 'calendar' }" @click="view = 'calendar'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Calendrier
          </button>
          <button :class="{ active: view === 'list' }" @click="view = 'list'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Liste
          </button>
        </div>
      </div>

      <div class="main-body">
        <div v-if="pending" class="state-msg">Chargement…</div>

        <!-- ===== VUE CALENDRIER ===== -->
        <div v-else-if="view === 'calendar'" class="calendar-wrap">
          <div class="cal-header">
            <button class="cal-nav" @click="prevMonth">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <h2 class="cal-month">{{ monthLabel }}</h2>
            <button class="cal-nav" @click="nextMonth">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <div class="cal-grid">
            <div v-for="d in ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']" :key="d" class="cal-day-label">{{ d }}</div>
            <div
              v-for="cell in calendarCells"
              :key="cell.key"
              class="cal-cell"
              :class="{ 'other-month': !cell.current, 'has-orders': cell.count > 0, 'selected': selectedDay === cell.date, 'today': cell.isToday }"
              @click="cell.count > 0 && selectDay(cell.date)"
            >
              <span class="cell-num">{{ cell.day }}</span>
              <span v-if="cell.count > 0" class="cell-badge">{{ cell.count }}</span>
            </div>
          </div>
          <div class="cal-legend">
            <span class="legend-dot"></span> Jour avec commande(s) — cliquez pour voir le détail
          </div>
        </div>

        <!-- ===== VUE LISTE ===== -->
        <div v-else-if="!commandes?.length" class="state-msg empty">
          <span v-html="emptyIcon"></span>
          <p>Aucune commande reçue pour le moment.</p>
        </div>
        <div v-else class="commandes-list">
          <div v-for="c in commandes" :key="c.id" class="commande-card">
            <div class="card-header">
              <div class="card-identity">
                <div class="avatar">{{ initials(c.prenom, c.nom) }}</div>
                <div>
                  <strong>{{ c.prenom }} {{ c.nom }}</strong>
                  <span class="type-pill">{{ c.type }}</span>
                  <span v-if="c.entreprise" class="entreprise">{{ c.entreprise }}</span>
                </div>
              </div>
              <div class="card-meta">
                <div class="card-dates">
                  <div class="date-row"><span class="date-label">Commande le</span><span>{{ formatDate(c.created_at) }}</span></div>
                  <div class="date-row retrait"><span class="date-label">Retrait souhaité</span><strong>{{ formatDate(c.date_souhaitee) }}</strong></div>
                </div>
                <span class="statut-badge" :class="c.statut">{{ STATUT_LABELS[c.statut]?.label ?? c.statut }}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="contact-row">
                <a :href="'tel:' + c.telephone" class="contact-chip">📞 {{ c.telephone }}</a>
                <a :href="'mailto:' + c.email" class="contact-chip">✉ {{ c.email }}</a>
              </div>
              <div class="lignes-section">
                <h4>Produits commandés</h4>
                <div class="lignes-grid">
                  <div v-for="l in c.lignes" :key="l.produit_nom" class="ligne-item">
                    <span class="ligne-nom">{{ l.produit_nom }}</span>
                    <span class="ligne-qty">{{ l.quantite }} {{ l.unite }}</span>
                    <span class="ligne-prix" v-if="l.prix_unitaire">{{ formatPrice(l.quantite * l.prix_unitaire) }} €</span>
                  </div>
                </div>
                <div class="lignes-totaux">
                  <span v-if="totalPrix(c) > 0" class="total-chip prix">Total : {{ formatPrice(totalPrix(c)) }} €</span>
                  <span v-if="totalPoids(c) > 0" class="total-chip poids">Poids : {{ formatPoids(totalPoids(c)) }}</span>
                </div>
              </div>
              <div v-if="c.message" class="message-block">{{ c.message }}</div>
              <div class="statut-actions">
                <span class="statut-label">Statut :</span>
                <button
                  v-for="s in STATUT_ORDER" :key="s"
                  class="statut-btn" :class="{ active: c.statut === s, [s]: true }"
                  :disabled="c.statut === s || changingStatut[c.id]"
                  @click="changeStatut(c, s)"
                >{{ STATUT_LABELS[s].label }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ===== SIDE PANEL ===== -->
    <Transition name="panel">
      <div v-if="selectedDay" class="panel-backdrop" @click.self="selectedDay = null">
        <div class="side-panel">
          <div class="panel-head">
            <div>
              <h2>{{ formatDateFull(selectedDay) }}</h2>
              <p class="panel-sub">{{ dayOrders.length }} commande(s)</p>
            </div>
            <button class="panel-close" @click="selectedDay = null">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="panel-totaux" v-if="dayTotalPrix > 0 || dayTotalPoids > 0">
            <div class="day-total" v-if="dayTotalPrix > 0">
              <span>Total du jour</span>
              <strong>{{ formatPrice(dayTotalPrix) }} €</strong>
            </div>
            <div class="day-total" v-if="dayTotalPoids > 0">
              <span>Poids total</span>
              <strong>{{ formatPoids(dayTotalPoids) }}</strong>
            </div>
          </div>

          <div class="panel-orders">
            <div v-for="c in dayOrders" :key="c.id" class="panel-card">
              <div class="panel-card-head">
                <div class="avatar sm">{{ initials(c.prenom, c.nom) }}</div>
                <div class="panel-identity">
                  <strong>{{ c.prenom }} {{ c.nom }}</strong>
                  <span class="type-pill">{{ c.type }}</span>
                </div>
                <div class="panel-contacts">
                  <a :href="'tel:' + c.telephone">{{ c.telephone }}</a>
                  <a :href="'mailto:' + c.email">{{ c.email }}</a>
                </div>
              </div>
              <div class="panel-lignes">
                <div v-for="l in c.lignes" :key="l.produit_nom" class="panel-ligne">
                  <span class="pl-nom">{{ l.produit_nom }}</span>
                  <span class="pl-qty">{{ l.quantite }} {{ l.unite }}</span>
                  <span class="pl-prix" v-if="l.prix_unitaire">{{ formatPrice(l.quantite * l.prix_unitaire) }} €</span>
                </div>
              </div>
              <div class="panel-card-totaux">
                <span v-if="totalPrix(c) > 0" class="total-chip prix">{{ formatPrice(totalPrix(c)) }} €</span>
                <span v-if="totalPoids(c) > 0" class="total-chip poids">{{ formatPoids(totalPoids(c)) }}</span>
              </div>
              <div v-if="c.message" class="panel-msg">{{ c.message }}</div>
              <div class="panel-statut-actions">
                <button
                  v-for="s in STATUT_ORDER" :key="s"
                  class="statut-btn sm" :class="{ active: c.statut === s, [s]: true }"
                  :disabled="c.statut === s || changingStatut[c.id]"
                  @click="changeStatut(c, s)"
                >{{ STATUT_LABELS[s].label }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const STATUT_LABELS: Record<string, { label: string }> = {
  en_attente: { label: 'En attente' },
  confirmee:  { label: 'Confirmée' },
  prete:      { label: 'Prête' },
  recuperee:  { label: 'Récupérée' },
}
const STATUT_ORDER = ['en_attente', 'confirmee', 'prete', 'recuperee']

const { data: commandes, pending, refresh } = await useFetch<any[]>('/api/admin/commandes')

const changingStatut = reactive<Record<number, boolean>>({})
async function changeStatut(c: any, statut: string) {
  changingStatut[c.id] = true
  try {
    await $fetch(`/api/admin/commandes/${c.id}/statut`, { method: 'PUT', body: { statut } })
    c.statut = statut
  } catch (e) {
    console.error(e)
  } finally {
    changingStatut[c.id] = false
  }
}
const view = ref<'calendar' | 'list'>('calendar')
const selectedDay = ref<string | null>(null)

/* ---- Calendrier ---- */
const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())

const monthLabel = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1)
    .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})
function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const todayStr = toDateStr(now)

const ordersByDate = computed(() => {
  const map: Record<string, any[]> = {}
  for (const c of commandes.value ?? []) {
    const key = (c.date_souhaitee ?? '').split('T')[0]
    if (!map[key]) map[key] = []
    map[key].push(c)
  }
  return map
})

const calendarCells = computed(() => {
  const y = currentYear.value; const m = currentMonth.value
  const first = new Date(y, m, 1)
  const last = new Date(y, m + 1, 0)
  const startOffset = (first.getDay() + 6) % 7
  const cells: any[] = []

  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(y, m, -i)
    const date = toDateStr(d)
    cells.push({ key: `p${i}`, day: d.getDate(), date, current: false, count: ordersByDate.value[date]?.length ?? 0, isToday: date === todayStr })
  }
  for (let d = 1; d <= last.getDate(); d++) {
    const date = toDateStr(new Date(y, m, d))
    cells.push({ key: `c${d}`, day: d, date, current: true, count: ordersByDate.value[date]?.length ?? 0, isToday: date === todayStr })
  }
  const rem = 42 - cells.length
  for (let i = 1; i <= rem; i++) {
    const date = toDateStr(new Date(y, m + 1, i))
    cells.push({ key: `n${i}`, day: i, date, current: false, count: ordersByDate.value[date]?.length ?? 0, isToday: date === todayStr })
  }
  return cells
})

function selectDay(date: string) { selectedDay.value = date }
const dayOrders = computed(() => selectedDay.value ? (ordersByDate.value[selectedDay.value] ?? []) : [])

/* ---- Totaux ---- */
function totalPrix(c: any) {
  return (c.lignes ?? []).reduce((s: number, l: any) => s + (l.prix_unitaire ? l.prix_unitaire * l.quantite : 0), 0)
}
function totalPoids(c: any) {
  return (c.lignes ?? []).reduce((s: number, l: any) => {
    if (l.unite === 'kg') return s + l.quantite
    if (l.unite === 'g') return s + l.quantite / 1000
    return s
  }, 0)
}
const dayTotalPrix = computed(() => dayOrders.value.reduce((s, c) => s + totalPrix(c), 0))
const dayTotalPoids = computed(() => dayOrders.value.reduce((s, c) => s + totalPoids(c), 0))

/* ---- Format ---- */
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}
function formatDateFull(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function formatPrice(v: number) { return Number(v).toFixed(2).replace('.', ',') }
function formatPoids(kg: number) { return kg >= 1 ? `${kg.toFixed(1).replace('.', ',')} kg` : `${Math.round(kg * 1000)} g` }
function initials(p: string, n: string) { return ((p?.[0] ?? '') + (n?.[0] ?? '')).toUpperCase() }

const emptyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="52" height="52"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`

useHead({ title: 'Commandes — Admin Ferme de l\'Ormois' })
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-main { flex: 1; background: var(--beige-fonce); display: flex; flex-direction: column; min-width: 0; }

.admin-topbar {
  background: var(--creme); border-bottom: 1px solid #e0d9ca; padding: 1.25rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
}
.admin-topbar h1 { font-family: 'Marcellus', serif; font-size: 1.4rem; color: var(--vert-fonce); }
.topbar-sub { font-size: 0.82rem; color: var(--texte-doux); margin-top: 0.15rem; }

.view-toggle { display: flex; border: 1.5px solid #d8cdb5; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
.view-toggle button { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; border: none; background: none; font-family: 'Spectral', serif; font-size: 0.88rem; color: var(--texte-doux); cursor: pointer; transition: background 0.18s, color 0.18s; }
.view-toggle button.active { background: var(--vert); color: #fff; }

.main-body { padding: 1.75rem 2rem; }
.state-msg { text-align: center; padding: 4rem 2rem; color: var(--texte-doux); }
.state-msg.empty { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }

/* ===== CALENDRIER ===== */
.calendar-wrap { background: var(--creme); border-radius: 18px; box-shadow: var(--ombre); overflow: hidden; max-width: 780px; }
.cal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #e8e0d0; }
.cal-month { font-family: 'Marcellus', serif; font-size: 1.2rem; color: var(--vert-fonce); text-transform: capitalize; }
.cal-nav { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #d8cdb5; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--texte-doux); transition: background 0.18s, color 0.18s; }
.cal-nav:hover { background: var(--vert); color: #fff; border-color: var(--vert); }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); padding: 0.75rem; gap: 0.3rem; }
.cal-day-label { text-align: center; font-size: 0.72rem; font-weight: 600; color: #a89e8c; padding: 0.4rem 0; letter-spacing: 0.5px; }
.cal-cell { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 10px; gap: 0.2rem; transition: background 0.15s; min-height: 48px; }
.cal-cell.other-month .cell-num { color: #ccc; }
.cal-cell.has-orders { cursor: pointer; }
.cal-cell.has-orders:hover { background: #e8f0e9; }
.cal-cell.today .cell-num { background: var(--vert-fonce); color: #fff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
.cal-cell.selected { background: var(--vert) !important; }
.cal-cell.selected .cell-num { color: #fff; background: none; }
.cal-cell.selected .cell-badge { background: rgba(255,255,255,0.3); color: #fff; }
.cell-num { font-size: 0.88rem; color: var(--texte); line-height: 1; }
.cell-badge { font-size: 0.65rem; font-weight: 700; background: var(--vert); color: #fff; border-radius: 20px; padding: 0.1rem 0.45rem; min-width: 18px; text-align: center; }
.cal-legend { padding: 0.75rem 1.5rem; font-size: 0.78rem; color: #a89e8c; display: flex; align-items: center; gap: 0.5rem; border-top: 1px solid #e8e0d0; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--vert); flex-shrink: 0; }

/* ===== LISTE ===== */
.commandes-list { display: flex; flex-direction: column; gap: 1.25rem; }
.commande-card { background: var(--creme); border-radius: 16px; box-shadow: var(--ombre); overflow: hidden; }
.card-header { background: var(--vert-fonce); padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; }
.card-identity { display: flex; align-items: center; gap: 0.9rem; }
.avatar { width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.15); color: #fff; font-family: 'Marcellus', serif; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.avatar.sm { width: 34px; height: 34px; font-size: 0.85rem; }
.card-identity strong { color: #fff; font-size: 1rem; display: block; }
.type-pill { display: inline-block; margin-left: 0.5rem; padding: 1px 8px; border-radius: 20px; background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.85); font-size: 0.75rem; text-transform: capitalize; }
.entreprise { display: block; font-size: 0.82rem; color: rgba(255,255,255,0.65); margin-top: 0.15rem; }
.card-dates { text-align: right; }
.date-row { font-size: 0.82rem; color: rgba(255,255,255,0.7); line-height: 1.6; }
.date-row span, .date-row strong { color: rgba(255,255,255,0.85); }
.date-row.retrait strong { color: var(--orange); font-size: 0.92rem; }
.date-label { margin-right: 0.4rem; opacity: 0.7; }
.card-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.contact-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.contact-chip { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 30px; border: 1.5px solid #e0d9ca; font-size: 0.85rem; color: var(--vert); background: #f0ebe2; }
.contact-chip:hover { background: #e5dfd5; }
.lignes-section h4 { font-family: 'Marcellus', serif; font-size: 0.95rem; color: var(--vert-fonce); margin-bottom: 0.65rem; }
.lignes-grid { display: flex; flex-direction: column; gap: 0.4rem; }
.ligne-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.85rem; background: var(--beige-fonce); border-radius: 8px; }
.ligne-nom { flex: 1; font-size: 0.9rem; }
.ligne-qty { font-family: 'Marcellus', serif; font-size: 0.9rem; color: var(--terre); }
.ligne-prix { font-size: 0.85rem; color: var(--vert-fonce); font-weight: 600; }
.lignes-totaux { display: flex; gap: 0.6rem; margin-top: 0.75rem; flex-wrap: wrap; }
.total-chip { font-size: 0.82rem; font-weight: 600; padding: 0.3rem 0.8rem; border-radius: 20px; }
.total-chip.prix { background: #e3efdf; color: #25551f; }
.total-chip.poids { background: #f5e6db; color: var(--terre); }
.message-block { font-size: 0.88rem; color: var(--texte-doux); padding: 0.85rem 1rem; background: #f0ebe2; border-radius: 10px; line-height: 1.6; font-style: italic; }

/* ===== SIDE PANEL ===== */
.panel-backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(27,40,25,0.45); display: flex; justify-content: flex-end; }
.side-panel { width: min(460px, 100vw); height: 100vh; background: var(--creme); display: flex; flex-direction: column; box-shadow: -8px 0 40px rgba(0,0,0,0.2); }
.panel-head { padding: 1.25rem 1.5rem; border-bottom: 1px solid #e0d9ca; display: flex; align-items: flex-start; justify-content: space-between; flex-shrink: 0; }
.panel-head h2 { font-family: 'Marcellus', serif; font-size: 1.1rem; color: var(--vert-fonce); text-transform: capitalize; }
.panel-sub { font-size: 0.8rem; color: var(--texte-doux); margin-top: 0.1rem; }
.panel-close { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid #d8cdb5; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--texte-doux); transition: background 0.18s; flex-shrink: 0; }
.panel-close:hover { background: #f0ebe2; }
.panel-totaux { display: flex; gap: 0; background: var(--vert-fonce); flex-shrink: 0; }
.day-total { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; padding: 0.9rem 1.5rem; }
.day-total + .day-total { border-left: 1px solid rgba(255,255,255,0.1); }
.day-total span { font-size: 0.73rem; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; }
.day-total strong { font-family: 'Marcellus', serif; font-size: 1.3rem; color: #fff; }
.panel-orders { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.panel-card { background: var(--beige-fonce); border-radius: 12px; overflow: hidden; }
.panel-card-head { padding: 0.8rem 1rem; background: rgba(47,107,57,0.1); display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; }
.panel-identity strong { font-size: 0.92rem; color: var(--vert-fonce); display: block; }
.panel-contacts { display: flex; flex-direction: column; gap: 0.1rem; margin-left: auto; text-align: right; }
.panel-contacts a { font-size: 0.76rem; color: var(--vert); }
.panel-contacts a:hover { text-decoration: underline; }
.panel-lignes { padding: 0.7rem 1rem; display: flex; flex-direction: column; gap: 0.35rem; }
.panel-ligne { display: flex; align-items: center; gap: 0.5rem; font-size: 0.86rem; }
.pl-nom { flex: 1; }
.pl-qty { color: var(--terre); font-family: 'Marcellus', serif; }
.pl-prix { color: var(--vert-fonce); font-weight: 600; }
.panel-card-totaux { display: flex; gap: 0.5rem; padding: 0.4rem 1rem 0.7rem; }
.panel-msg { font-size: 0.8rem; color: var(--texte-doux); padding: 0.5rem 1rem 0.7rem; border-top: 1px solid #ddd8ce; font-style: italic; }

/* ===== STATUT ===== */
.card-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }
.statut-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; }
.statut-badge.en_attente { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
.statut-badge.confirmee  { background: #d4edda; color: #1a6b2a; }
.statut-badge.prete      { background: #fff3cd; color: #856404; }
.statut-badge.recuperee  { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }

.statut-actions { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; padding-top: 0.25rem; border-top: 1px solid #e8e0d0; }
.statut-label { font-size: 0.8rem; color: var(--texte-doux); }
.statut-btn { padding: 0.3rem 0.75rem; border-radius: 20px; border: 1.5px solid #d8cdb5; background: none; font-family: 'Spectral', serif; font-size: 0.78rem; cursor: pointer; transition: background 0.15s, color 0.15s, border-color 0.15s; color: var(--texte-doux); }
.statut-btn:disabled { cursor: default; }
.statut-btn.active.en_attente { background: #e9e3d8; color: #6b6050; border-color: #c8bfa5; }
.statut-btn.active.confirmee  { background: #d4edda; color: #1a6b2a; border-color: #9fcfab; }
.statut-btn.active.prete      { background: #fff3cd; color: #856404; border-color: #ffc107; }
.statut-btn.active.recuperee  { background: #f0ebe2; color: #888; border-color: #ccc; }
.statut-btn:not(.active):not(:disabled):hover { background: #e8f0e9; border-color: var(--vert); color: var(--vert); }
.statut-btn.sm { font-size: 0.74rem; padding: 0.22rem 0.6rem; }
.panel-statut-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; padding: 0.5rem 1rem 0.7rem; border-top: 1px solid #e8e0d0; }

.panel-enter-active { transition: opacity 0.2s; }
.panel-leave-active { transition: opacity 0.2s; }
.panel-enter-from, .panel-leave-to { opacity: 0; }
.panel-enter-active .side-panel { transition: transform 0.28s ease; }
.panel-leave-active .side-panel { transition: transform 0.22s ease; }
.panel-enter-from .side-panel { transform: translateX(100%); }
.panel-leave-to .side-panel { transform: translateX(100%); }

@media (max-width: 860px) {
  .main-body { padding: 1.25rem; }
  .card-header { flex-direction: column; }
  .card-dates { text-align: left; }
}
</style>
