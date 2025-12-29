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
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("❌ Erreur envoi email :", error.message);
    // IMPORTANT : on ne throw PAS
  }
}

async function sendAlumniPendingEmail(user) {
  const html = loadTemplate("alumniPending", {
    firstname: user.prenom,
    frontUrl: process.env.FRONT_URL
  });

  await sendMail({
    to: user.email,
    subject: "⏳ Inscription PolyBuddy en attente de validation",
    html
  });
}

module.exports = {
  sendAlumniPendingEmail
};
