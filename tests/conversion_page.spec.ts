import { expect, type Page, test } from "@playwright/test";

const titles = [
  "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations",
  "Vous cherchez la pièce à votre image, or…",
  "Maison Matron, artisan depuis 4 générations",
  "Le vrai sur-mesure",
  "Le dernier chaisier de Suisse",
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
  await expect(calls).toHaveCount(8);
  for (const call of await calls.all()) {
    await expect(call).toHaveAttribute("href", "#booking");
  }
  await expect(page.locator("#booking form")).toBeVisible();
  await expect(page.locator("form")).toHaveCount(1);
});

const visuals = [
  { section: 3, name: /Photographie d'archive/ },
  { section: 4, name: /quatre chaises traîneau/ },
  { section: 6, name: /tire-sangle/ },
  { section: 7, name: /Canapé en bois/ },
  { section: 8, name: /Deux fauteuils médaillon/ },
  { section: 8, name: /Buffet bas/ },
  { section: 9, name: /Fauteuil à haut dossier/ },
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

const textBlockOf = (page: Page, section: number) =>
  sectionOf(page, titles[section - 1] ?? "")
    .locator("div")
    .filter({ has: page.getByRole("heading") })
    .last()
    .locator("..");

for (const { width, gap } of [
  { width: 375, gap: 48 },
  { width: 1280, gap: 64 },
]) {
  for (const section of [3, 4, 6, 7, 8, 9]) {
    test(`at ${width}px section ${section} keeps its call to action in its text block, one gap from its visual`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const block = await textBlockOf(page, section).boundingBox();
      const photo = await sectionOf(page, titles[section - 1] ?? "")
        .getByRole("img")
        .first()
        .boundingBox();
      const call = sectionOf(page, titles[section - 1] ?? "").getByRole("link");
      for (const link of await call.all()) {
        const box = await link.boundingBox();
        expect(box?.y ?? 0).toBeGreaterThanOrEqual(block?.y ?? 0);
        expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(
          (block?.y ?? 0) + (block?.height ?? 0) + 1,
        );
      }
      const beside = (photo?.x ?? 0) >= (block?.x ?? 0) + (block?.width ?? 0);
      const before = (photo?.x ?? 0) + (photo?.width ?? 0) <= (block?.x ?? 0);
      if (beside || before) {
        expect(block?.y).toBeCloseTo(photo?.y ?? 0, 0);
      } else {
        expect(
          (photo?.y ?? 0) - (block?.y ?? 0) - (block?.height ?? 0),
        ).toBeCloseTo(gap, 0);
      }
    });
  }
}

for (const { width, gap } of [
  { width: 375, gap: 48 },
  { width: 1280, gap: 64 },
]) {
  test(`at ${width}px section 5 holds its call to action one gap under its text`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const block = sectionOf(page, titles[4] ?? "");
    const text = await block.locator("p").last().boundingBox();
    const call = await block.getByRole("link").boundingBox();
    expect((call?.y ?? 0) - (text?.y ?? 0) - (text?.height ?? 0)).toBeCloseTo(
      gap,
      0,
    );
  });
}

test("the pair of section 8 stands side by side at one height from md", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const block = sectionOf(page, titles[7] ?? "");
  const [left, right] = await Promise.all(
    [/Deux fauteuils médaillon/, /Buffet bas/].map((name) =>
      block.getByRole("img", { name }).boundingBox(),
    ),
  );
  expect(right?.y).toBeCloseTo(left?.y ?? 0, 0);
  expect(right?.height).toBeCloseTo(left?.height ?? 0, 0);
  expect(right?.x).toBeGreaterThan((left?.x ?? 0) + (left?.width ?? 0));
});

test("the pair of section 8 stacks full width below md", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const block = sectionOf(page, titles[7] ?? "");
  const [top, bottom] = await Promise.all(
    [/Deux fauteuils médaillon/, /Buffet bas/].map((name) =>
      block.getByRole("img", { name }).boundingBox(),
    ),
  );
  expect(top?.width).toBeCloseTo(375, 0);
  expect(bottom?.width).toBeCloseTo(375, 0);
  expect(bottom?.y).toBeGreaterThan((top?.y ?? 0) + (top?.height ?? 0));
});

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

for (const section of [2, 5]) {
  test(`section ${section} takes the whole viewport, its content centred`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const centred = page.locator("section").filter({
      has: page.getByRole("heading", { name: titles[section - 1] }),
    });
    const box = await centred.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(800);
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

test("from xl no line of a stacked text block wraps", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const wrapped = await page
    .locator("main section:has(img) .copy-inset .space-y-4 > *")
    .evaluateAll((lines) =>
      lines
        .filter((line) => {
          const range = document.createRange();
          range.selectNodeContents(line);
          const tops = new Set(
            [...range.getClientRects()].map((rect) => Math.round(rect.top)),
          );
          return tops.size > 1;
        })
        .map((line) => line.textContent),
    );
  expect(wrapped).toEqual([]);
});

for (const { width, gap } of [
  { width: 375, gap: 32 },
  { width: 1280, gap: 48 },
]) {
  test(`at ${width}px every call to action sits ${gap}px under its text`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const gaps = await page
      .locator("main a[href='#booking']")
      .evaluateAll((links) =>
        links.map((link) => {
          const holder =
            link.previousElementSibling ??
            link.parentElement?.previousElementSibling;
          const above = holder?.getBoundingClientRect();
          return Math.round(
            link.getBoundingClientRect().top - (above?.bottom ?? 0),
          );
        }),
      );
    expect(gaps.length).toBeGreaterThan(0);
    for (const measured of gaps) expect(measured).toBe(gap);
  });
}
