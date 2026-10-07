import { readFile } from "node:fs/promises";
import nodemailer from "nodemailer";

const usage =
  "usage: node --env-file=.env mail/send-test.mjs <recipient> <first name>";

const smtp_variables = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
];

const implicit_tls_port = 465;

const given_name_token = "{{prénom}}";

const html_entities = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escaped_html = (value) =>
  value.replace(/[&<>"']/g, (character) => html_entities[character]);

const plain_text = (first_name) =>
  [
    "Bienvenue chez Maison Matron.",
    "",
    `Bonjour ${first_name},`,
    "",
    "Votre demande d’expertise offerte est confirmée.",
    "",
    "Nous vous appellerons très vite.",
    "",
    "Si vous souhaitez que l’on vous réponde plus précisément, vous pouvez joindre une photo de votre meuble en réponse à cet email.",
    "",
    "Si vous préférez discuter tout de suite :",
    "",
    "+41 21 539 46 75",
    "",
    "Chaleureuses salutations,",
    "",
    "Maison Matron",
    "+41 21 539 46 75",
    "Route de Gilly 15, 1183 Bursins",
    "",
    "Suivez-nous sur Instagram",
    "https://www.instagram.com/maisonmatron/",
    "Visitez notre page internet",
    "https://www.maison-matron.ch",
  ].join("\n");

const exit_with = (reason) => {
  process.stderr.write(`${reason}\n`);
  process.exit(1);
};

const [recipient, first_name] = process.argv.slice(2);
if (!recipient || !first_name) exit_with(usage);

const missing = smtp_variables.filter((name) => !process.env[name]);
if (missing.length > 0) {
  exit_with(`missing in the environment: ${missing.join(", ")}`);
}

const port = Number(process.env.SMTP_PORT);
if (!Number.isInteger(port) || port <= 0) {
  exit_with("SMTP_PORT must be a positive integer");
}

const template = await readFile(
  new URL("confirmation-email.html", import.meta.url),
  "utf8",
);

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === implicit_tls_port,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});

try {
  const sent = await transport.sendMail({
    from: { name: "Maison Matron", address: process.env.SMTP_FROM },
    to: recipient,
    subject: "Votre expertise offerte",
    html: template.replaceAll(given_name_token, () => escaped_html(first_name)),
    text: plain_text(first_name),
  });
  process.stdout.write(
    `response: ${sent.response}\nmessage id: ${sent.messageId}\n`,
  );
} catch (error) {
  exit_with(
    `send failed: ${error instanceof Error ? error.message : String(error)}`,
  );
}
