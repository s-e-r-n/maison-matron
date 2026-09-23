import { expect, test } from "@playwright/test";

const titles = [
  "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations",
  "Vous cherchez la pièce à votre image, or…",
  "Maison Matron, artisan depuis 4 générations",
  "Le vrai sur-mesure",
  "L'atelier vient à vous, et c'est offert",
  "Le processus & la restitution",
  "4 saisons, 4 privilèges",
  "Vous travaillez avec un décorateur d'intérieur ?",
  "Formulaire",
];

test("renders sections 1 to 9 in the order of the redaction", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading")).toHaveText(titles);
});

test("every call to action leads to the booking form", async ({ page }) => {
  await page.goto("/");
  const calls = page.getByRole("link", {
    name: /L'atelier vient à vous|Je réserve ma visite/,
  });
  await expect(calls).toHaveCount(3);
  for (const call of await calls.all()) {
    await expect(call).toHaveAttribute("href", "#booking");
  }
  await expect(page.locator("#booking form")).toBeVisible();
});

const visuals = [
  { section: 3, name: /Photographie d'archive/, ratio: 4 / 5 },
  { section: 4, name: /Deux fauteuils médaillon/, ratio: 3 / 2 },
  { section: 5, name: /Fauteuil Voltaire/, ratio: 4 / 5 },
].map((visual) => ({ ...visual, title: titles[visual.section - 1] ?? "" }));

for (const visual of visuals) {
  test(`section ${visual.section} shows its photo, covering its frame`, async ({
    page,
  }) => {
    await page.goto("/");
    const photo = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: visual.title }) })
      .getByRole("img", { name: visual.name });
    await expect(photo).toBeVisible();
    await expect(photo).toHaveCSS("object-fit", "cover");
    await expect
      .poll(() =>
        photo.evaluate((element: HTMLImageElement) => element.naturalWidth),
      )
      .toBeGreaterThan(0);
    const box = await photo.boundingBox();
    expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(visual.ratio, 2);
  });
}
