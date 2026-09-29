import { expect, type Page, test } from "@playwright/test";

const titles = [
  "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations",
  "Vous cherchez la pièce à votre image, or…",
  "Maison Matron, artisan depuis 4 générations",
  "Le vrai sur-mesure",
  "L'atelier vient à vous, et c'est offert",
  "Le processus & la restitution",
  "4 saisons, 4 privilèges",
  "Vous travaillez avec un décorateur d'intérieur ?",
  "L'atelier vient à vous, c'est offert.",
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
  await expect(calls).toHaveCount(4);
  for (const call of await calls.all()) {
    await expect(call).toHaveAttribute("href", "#booking");
  }
  await expect(page.locator("#booking form")).toBeVisible();
  await expect(page.locator("form")).toHaveCount(1);
});

const visuals = [
  { section: 3, name: /Photographie d'archive/ },
  { section: 4, name: /quatre chaises traîneau/ },
  { section: 5, name: /tire-sangle/ },
  { section: 6, name: /Canapé en bois/ },
  { section: 7, name: /Deux fauteuils médaillon/ },
  { section: 7, name: /Buffet bas/ },
  { section: 8, name: /Fauteuil à haut dossier/ },
  { section: 8, name: /Fauteuil Voltaire/ },
].map((visual) => ({ ...visual, title: titles[visual.section - 1] ?? "" }));

const sectionOf = (page: Page, title: string) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: title }) });

for (const visual of visuals) {
  test(`section ${visual.section} shows ${visual.name.source}`, async ({
    page,
  }) => {
    await page.goto("/");
    const photo = sectionOf(page, visual.title).getByRole("img", {
      name: visual.name,
    });
    await expect(photo).toBeVisible();
    await photo.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        photo.evaluate((element: HTMLImageElement) => element.naturalWidth),
      )
      .toBeGreaterThan(0);
  });
}

for (const section of [4, 6, 7, 8]) {
  test(`section ${section} holds its visual close under its text`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const block = sectionOf(page, titles[section - 1] ?? "");
    const text = await block.locator("p").last().boundingBox();
    const photo = await block.getByRole("img").first().boundingBox();
    const gap = (photo?.y ?? 0) - ((text?.y ?? 0) + (text?.height ?? 0));
    expect(gap).toBeGreaterThanOrEqual(0);
    expect(gap).toBeLessThanOrEqual(40);
  });
}

const pairs = [
  { section: 7, names: [/Deux fauteuils médaillon/, /Buffet bas/] },
  { section: 8, names: [/Fauteuil à haut dossier/, /Fauteuil Voltaire/] },
];

for (const pair of pairs) {
  test(`the pair of section ${pair.section} stands side by side at one height from md`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const block = sectionOf(page, titles[pair.section - 1] ?? "");
    const [left, right] = await Promise.all(
      pair.names.map((name) => block.getByRole("img", { name }).boundingBox()),
    );
    expect(right?.y).toBeCloseTo(left?.y ?? 0, 0);
    expect(Math.abs((right?.height ?? 0) - (left?.height ?? 0))).toBeLessThan(
      1,
    );
    expect(right?.x).toBeGreaterThan((left?.x ?? 0) + (left?.width ?? 0));
  });

  test(`the pair of section ${pair.section} stacks full width below md`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const block = sectionOf(page, titles[pair.section - 1] ?? "");
    const [top, bottom] = await Promise.all(
      pair.names.map((name) => block.getByRole("img", { name }).boundingBox()),
    );
    expect(top?.width).toBeCloseTo(375, 0);
    expect(bottom?.width).toBeCloseTo(375, 0);
    expect(bottom?.y).toBeGreaterThan((top?.y ?? 0) + (top?.height ?? 0));
  });
}

test("the footer holds the logotype and the atelier address, nothing else", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.getByRole("img")).toHaveAccessibleName(
    "Maison Matron, 1921",
  );
  await expect(footer).toHaveText("Route de Gilly 151183 Bursins");
});

test("a dashed rule stands above the form section's title", async ({
  page,
}) => {
  await page.goto("/");
  const rule = page.locator("#booking > hr:first-child");
  await expect(rule).toBeVisible();
  await expect(rule).toHaveCSS("height", "1px");
  await expect(rule).toHaveCSS(
    "background-image",
    "repeating-linear-gradient(to right, rgba(0, 0, 0, 0.5) 0px, rgba(0, 0, 0, 0.5) 6px, rgba(0, 0, 0, 0) 6px, rgba(0, 0, 0, 0) 10px)",
  );
});

for (const section of [2]) {
  test(`section ${section} takes half the viewport, its content centred`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const centred = page.locator("section").filter({
      has: page.getByRole("heading", { name: titles[section - 1] }),
    });
    const box = await centred.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(400);
    const first = await centred.locator("> *").first().boundingBox();
    const last = await centred.locator("> *").last().boundingBox();
    const above = (first?.y ?? 0) - (box?.y ?? 0);
    const below =
      (box?.y ?? 0) +
      (box?.height ?? 0) -
      ((last?.y ?? 0) + (last?.height ?? 0));
    expect(Math.abs(above - below)).toBeLessThanOrEqual(1);
  });
}
