
import nodemailer from "nodemailer";

/**
 * Service pour l'envoi d'emails via le relais SMTP de Brevo.
 * Assurez-vous de configurer les variables d'environnement suivantes dans votre fichier .env :
 * BREVO_SMTP_USER, BREVO_SMTP_PASSWORD, EMAIL_FROM
 */

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASSWORD,
  },
});

/**
 * Envoie un email de notification.
 * 
 * @param to - L'adresse email du destinataire.
 * @param subject - Le sujet de l'email.
 * @param message - Le contenu textuel de l'email.
 */
export async function sendNotificationEmail(
  to: string,
  subject: string,
  message: string
) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: message,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw error;
  }
}
