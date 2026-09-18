import { loadEnvConfig } from "@next/env";
import { expect, type Page, test } from "@playwright/test";

const { combinedEnv } = loadEnvConfig(process.cwd(), true);
const mail_enabled = combinedEnv.MAIL_ENABLED !== "false";
const lead_email = combinedEnv.E2E_LEAD_EMAIL;

const labels = [
  "Prénom",
  "Nom",
  "E-mail",
  "Téléphone",
  "Entreprise",
  "Code postal",
  "Localité",
  "Message",
];

const fill_every_field = async (page: Page, email: string) => {
  await page.getByLabel("Prénom", { exact: true }).fill("Test");
  await page.getByLabel("Nom", { exact: true }).fill("Scaffold");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Téléphone", { exact: true }).fill("079 123 45 67");
  await page.getByLabel("Entreprise", { exact: true }).fill("WaveProm test");
  await page.getByLabel("Code postal", { exact: true }).fill("1204");
  await page.getByLabel("Localité", { exact: true }).fill("Genève");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Soumission de test e2e, chaque champ du dictionnaire est rempli.");
};

test("renders one field per dictionary key and a submit button", async ({
  page,
}) => {
  await page.goto("/");
  for (const label of labels) {
    await expect(page.getByLabel(label, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole("button", { name: "Envoyer" })).toBeVisible();
});

test("shows the failure notice and stays on the page when the mail module is off", async ({
  page,
}) => {
  test.skip(mail_enabled, "MAIL_ENABLED is not false");
  await page.goto("/");
  await fill_every_field(page, "lead@example.com");
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page.getByText("L'envoi a échoué")).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test("one submission filling every dictionary field lands on /confirmation", async ({
  page,
}) => {
  test.skip(
    !mail_enabled || !lead_email,
    "MAIL_ENABLED is false or E2E_LEAD_EMAIL is empty",
  );
  await page.goto("/");
  await fill_every_field(page, lead_email ?? "");
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page).toHaveURL(/\/confirmation$/);
  await expect(page.getByRole("heading")).toContainText("Merci");
});
