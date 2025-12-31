const transporter = require("../config/mail");
const fs = require("fs");
const path = require("path");

function loadTemplate(templateName, variables = {}) {
  let html = fs.readFileSync(
    path.join(__dirname, `../templates/emails/${templateName}.html`),
    "utf8"
  );

  Object.keys(variables).forEach(key => {
    html = html.replaceAll(`{{${key}}}`, variables[key]);
  });

  return html;
}

async function sendMail({ to, subject, html }) {
  if (!to) {
    console.warn("⚠️ Email non envoyé : destinataire manquant");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("❌ Erreur envoi email :", error.message);
  }
}


async function sendStudentPendingEmail(user) {
  const html = loadTemplate("studentPending", {
    firstname: user.prenom,
    role:user.role,
    frontUrl: process.env.FRONT_URL
  });

  await sendMail({
    to: user.email,
    subject: "Inscription PolyBuddy en attente de validation",
    html
  });
}

module.exports = {
  sendStudentPendingEmail
};
