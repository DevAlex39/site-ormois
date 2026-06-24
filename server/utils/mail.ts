import nodemailer from 'nodemailer'

function createTransporter() {
  const config = useRuntimeConfig()
  return nodemailer.createTransport({
    host: config.smtpHost as string,
    port: Number(config.smtpPort),
    secure: false,
    auth: { user: config.smtpUser as string, pass: config.smtpPass as string },
  })
}

function headerHtml(title: string) {
  return `<div style="background:#1f4527;color:white;padding:20px 24px;border-radius:8px 8px 0 0">
    <div style="display:flex;align-items:center;gap:10px">
      <span style="font-size:1.4rem">🌿</span>
      <h1 style="margin:0;font-size:1.2rem;font-family:Georgia,serif">${title}</h1>
    </div>
  </div>`
}

function lignesHtml(lignes: { produit_nom: string; quantite: number; unite: string; prix_unitaire?: number }[]) {
  const rows = lignes.map(l => {
    const prix = l.prix_unitaire ? `${(l.quantite * l.prix_unitaire).toFixed(2).replace('.', ',')} €` : '—'
    return `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${l.produit_nom}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee">${l.quantite} ${l.unite}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${prix}</td>
    </tr>`
  }).join('')
  return `<table style="width:100%;border-collapse:collapse">
    <thead><tr style="background:#f5f0e8">
      <th style="padding:8px 12px;text-align:left">Produit</th>
      <th style="padding:8px 12px;text-align:left">Quantité</th>
      <th style="padding:8px 12px;text-align:right">Prix</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`
}

/* ---- Mail à la ferme : nouvelle commande ---- */
export async function sendCommandeMail(commande: {
  prenom: string; nom: string; telephone: string; email: string
  type: string; entreprise?: string; message?: string; date_souhaitee: string
  lignes: { produit_nom: string; quantite: number; unite: string; prix_unitaire?: number }[]
}) {
  const config = useRuntimeConfig()
  const dateStr = new Date(commande.date_souhaitee).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const html = `<div style="font-family:Georgia,serif;max-width:600px;margin:auto">
    ${headerHtml('Nouvelle commande — La Ferme de l\'Ormois')}
    <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
      <h2 style="color:#1f4527;font-size:1rem;margin-top:0">Client</h2>
      <p style="margin:4px 0"><strong>${commande.prenom} ${commande.nom}</strong>${commande.entreprise ? ` — ${commande.entreprise}` : ''}</p>
      <p style="margin:4px 0">📞 <a href="tel:${commande.telephone}">${commande.telephone}</a> · ✉ <a href="mailto:${commande.email}">${commande.email}</a></p>
      <p style="margin:4px 0">Type : ${commande.type}</p>
      <p style="margin:12px 0;padding:10px;background:#e8f0e9;border-radius:6px;color:#1f4527"><strong>Retrait souhaité : ${dateStr}</strong></p>
      <h2 style="color:#1f4527;font-size:1rem">Produits commandés</h2>
      ${lignesHtml(commande.lignes)}
      ${commande.message ? `<h2 style="color:#1f4527;font-size:1rem;margin-top:1.5rem">Message</h2><p style="background:#f5f0e8;padding:12px;border-radius:6px;margin:0">${commande.message}</p>` : ''}
    </div>
  </div>`

  await createTransporter().sendMail({
    from: `"La Ferme de l'Ormois" <${config.smtpUser}>`,
    to: config.mailTo as string,
    replyTo: commande.email,
    subject: `🛒 Nouvelle commande — ${commande.prenom} ${commande.nom} (retrait ${dateStr})`,
    html,
  })
}

/* ---- Mail au client : confirmation de commande ---- */
export async function sendConfirmationClientMail(commande: {
  prenom: string; nom: string; email: string; date_souhaitee: string
  lignes: { produit_nom: string; quantite: number; unite: string; prix_unitaire?: number }[]
  telephone_ferme?: string; email_ferme?: string
}) {
  const config = useRuntimeConfig()
  const dateStr = new Date(commande.date_souhaitee).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const html = `<div style="font-family:Georgia,serif;max-width:600px;margin:auto">
    ${headerHtml('Votre commande est enregistrée !')}
    <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
      <p style="margin-top:0">Bonjour <strong>${commande.prenom}</strong>,</p>
      <p>Nous avons bien reçu votre commande. Nous vous contacterons prochainement pour confirmer la date de retrait.</p>
      <p style="padding:10px;background:#e8f0e9;border-radius:6px;color:#1f4527"><strong>Retrait souhaité : ${dateStr}</strong></p>
      <h2 style="color:#1f4527;font-size:1rem">Récapitulatif de votre commande</h2>
      ${lignesHtml(commande.lignes)}
      <div style="margin-top:24px;padding:16px;background:#f5f0e8;border-radius:8px;font-size:0.9rem">
        <strong>La Ferme de l'Ormois</strong><br/>
        7 BIS Route de l'Ormois, 21270 Marandeuil<br/>
        ${commande.telephone_ferme ? `📞 ${commande.telephone_ferme}<br/>` : ''}
        ${commande.email_ferme ? `✉ ${commande.email_ferme}` : ''}
      </div>
      <p style="font-size:0.82rem;color:#888;margin-bottom:0">* Les prix indiqués sont estimatifs et peuvent varier selon la récolte du jour.</p>
    </div>
  </div>`

  await createTransporter().sendMail({
    from: `"La Ferme de l'Ormois" <${config.smtpUser}>`,
    to: commande.email,
    subject: `✅ Votre commande à la Ferme de l'Ormois — retrait ${dateStr}`,
    html,
  })
}

/* ---- Mail au client : changement de statut ---- */
const STATUT_LABELS: Record<string, { label: string; emoji: string; message: string }> = {
  confirmee: {
    label: 'Confirmée',
    emoji: '✔️',
    message: 'Votre commande a été <strong>confirmée</strong> par notre équipe. Nous la préparerons pour la date de retrait prévue.',
  },
  prete: {
    label: 'Prête à récupérer',
    emoji: '🎉',
    message: 'Bonne nouvelle — votre commande est <strong>prête à être récupérée</strong> ! Rendez-vous à la ferme quand vous le souhaitez.',
  },
  recuperee: {
    label: 'Récupérée',
    emoji: '👍',
    message: 'Merci pour votre visite ! Votre commande a bien été récupérée. À très bientôt à la ferme.',
  },
}

export async function sendStatutMail(commande: {
  prenom: string; nom: string; email: string; date_souhaitee: string; statut: string
  lignes: { produit_nom: string; quantite: number; unite: string; prix_unitaire?: number }[]
  telephone_ferme?: string; email_ferme?: string
}) {
  const info = STATUT_LABELS[commande.statut]
  if (!info) return
  const config = useRuntimeConfig()
  const dateStr = new Date(commande.date_souhaitee).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const html = `<div style="font-family:Georgia,serif;max-width:600px;margin:auto">
    ${headerHtml(`${info.emoji} Commande ${info.label} — La Ferme de l'Ormois`)}
    <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
      <p style="margin-top:0">Bonjour <strong>${commande.prenom}</strong>,</p>
      <p>${info.message}</p>
      <p style="padding:10px;background:#e8f0e9;border-radius:6px;color:#1f4527"><strong>Date de retrait : ${dateStr}</strong></p>
      <h2 style="color:#1f4527;font-size:1rem">Votre commande</h2>
      ${lignesHtml(commande.lignes)}
      <div style="margin-top:24px;padding:16px;background:#f5f0e8;border-radius:8px;font-size:0.9rem">
        <strong>La Ferme de l'Ormois</strong><br/>
        7 BIS Route de l'Ormois, 21270 Marandeuil<br/>
        ${commande.telephone_ferme ? `📞 ${commande.telephone_ferme}<br/>` : ''}
        ${commande.email_ferme ? `✉ ${commande.email_ferme}` : ''}
      </div>
    </div>
  </div>`

  await createTransporter().sendMail({
    from: `"La Ferme de l'Ormois" <${config.smtpUser}>`,
    to: commande.email,
    subject: `${info.emoji} Commande ${info.label} — La Ferme de l'Ormois`,
    html,
  })
}
