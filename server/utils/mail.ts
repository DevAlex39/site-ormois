import nodemailer from 'nodemailer'

export async function sendCommandeMail(commande: {
  prenom: string; nom: string; telephone: string; email: string
  type: string; entreprise?: string; message?: string; date_souhaitee: string
  lignes: { produit_nom: string; quantite: number; unite: string }[]
}) {
  const config = useRuntimeConfig()

  const transporter = nodemailer.createTransport({
    host: config.smtpHost as string,
    port: Number(config.smtpPort),
    secure: false,
    auth: {
      user: config.smtpUser as string,
      pass: config.smtpPass as string,
    },
  })

  const lignesHtml = commande.lignes.map(l =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${l.produit_nom}</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${l.quantite} ${l.unite}</td></tr>`
  ).join('')

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:auto">
      <div style="background:#2a5a32;color:white;padding:20px 24px;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:1.4rem">🌿 Nouvelle commande — La Ferme de l'Ormois</h1>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #eee;border-top:none">
        <h2 style="color:#2a5a32">Client</h2>
        <p><strong>Nom :</strong> ${commande.prenom} ${commande.nom}</p>
        <p><strong>Téléphone :</strong> ${commande.telephone}</p>
        <p><strong>Email :</strong> ${commande.email}</p>
        <p><strong>Type :</strong> ${commande.type}${commande.entreprise ? ' — ' + commande.entreprise : ''}</p>
        <p><strong>Date de retrait souhaitée :</strong> ${new Date(commande.date_souhaitee).toLocaleDateString('fr-FR')}</p>

        <h2 style="color:#2a5a32;margin-top:1.5rem">Produits commandés</h2>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f5f0e8">
              <th style="padding:8px 12px;text-align:left">Produit</th>
              <th style="padding:8px 12px;text-align:left">Quantité</th>
            </tr>
          </thead>
          <tbody>${lignesHtml}</tbody>
        </table>

        ${commande.message ? `<h2 style="color:#2a5a32;margin-top:1.5rem">Message</h2><p style="background:#f5f0e8;padding:12px;border-radius:6px">${commande.message}</p>` : ''}
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"La Ferme de l'Ormois" <${config.smtpUser}>`,
    to: config.mailTo as string,
    replyTo: commande.email,
    subject: `Nouvelle commande de ${commande.prenom} ${commande.nom} — ${new Date(commande.date_souhaitee).toLocaleDateString('fr-FR')}`,
    html,
  })
}
