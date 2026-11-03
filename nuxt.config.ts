export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Vide = connexion admin impossible (pas de mot de passe par défaut devinable)
    adminPassword: process.env.ADMIN_PASSWORD || '',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    mailTo: process.env.MAIL_TO || 'lafermedelormois@gmail.com',
    dbPath: process.env.DB_PATH || './data/ormois.db',
  },
})
