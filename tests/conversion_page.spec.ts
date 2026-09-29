import { expect, type Page, test } from "@playwright/test";

const titles = [
  "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations",
  "Vous cherchez la pièce à votre image, or…",
  "Maison Matron, artisan depuis 4 générations",
  "Le vrai sur-mesure",
  "Profitez de centaines de tissus, tous au même prix",
  "L'atelier vient à vous, et c'est offert",
  "Le processus & la restitution",
  "4 saisons, 4 privilèges",
  "Vous travaillez avec un décorateur d'intérieur ?",
  "Ils nous ont confié leurs pièces",
  "L'atelier vient à vous, c'est offert.",
];

test("renders every section in the order of the redaction", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading")).toHaveText(titles);
});

test("every call to action leads to the booking form", async ({ page }) => {
  await page.goto("/");
  const calls = page.getByRole("link", {
    name: "Je veux ma visite offerte",
  });
  await expect(calls).toHaveCount(8);
  for (const call of await calls.all()) {
    await expect(call).toHaveAttribute("href", "#booking");
  }
  await expect(page.locator("main a[href='#booking']")).toHaveCount(8);
  await expect(page.locator("#booking form")).toBeVisible();
  await expect(page.locator("#booking form").getByRole("button")).toHaveText(
    "Je réserve ma visite",
  );
  await expect(page.locator("form")).toHaveCount(1);
});

const visuals = [
  { section: 3, name: /Photographie d'archive/ },
  { section: 4, name: /quatre chaises traîneau/ },
  { section: 6, name: /tire-sangle/ },
  { section: 7, name: /Canapé en bois/ },
  { section: 8, name: /Deux fauteuils médaillon en bois teinté/ },
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

test("section 4 holds « Profitez du dernier chaisier de Suisse » in its text block, in order", async ({
  page,
}) => {
  await page.goto("/");
  const block = sectionOf(page, titles[3] ?? "");
  await expect(block.locator("h2, p")).toHaveText([
    "Le vrai sur-mesure",
    "Velours de Gênes, lin, coton : sélectionnez vos matières, couleurs et motifs préférés.",
    "Choisissez les finitions bois que vous trouvez les plus belles.",
    "Profitez du dernier chaisier de Suisse",
    "Depuis 1908, chaque chaise est assemblée à l'ancienne, dans un bois de la région qui a rarement voyagé plus de 100 km.",
    "Profitez de deux savoir-faire centenaires pour vos pièces.",
  ]);
  await expect(block.getByRole("link")).toHaveText("Je veux ma visite offerte");
});

test("the pair of section 8 stands side by side at one height from md", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const block = sectionOf(page, titles[7] ?? "");
  const [left, right] = await Promise.all(
    [/Deux fauteuils médaillon en bois teinté/, /Buffet bas/].map((name) =>
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
    [/Deux fauteuils médaillon en bois teinté/, /Buffet bas/].map((name) =>
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

for (const section of [2, 5, 10]) {
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
    .locator("main section:has(img) .copy-inset > .space-y-4 :is(h2, p, li)")
    .evaluateAll((lines) =>
      lines
        .filter((line) => {
          const range = document.createRange();
          range.selectNodeContents(line);
          const tops = new Set(
            [...range.getClientRects()].map((rect) => Math.round(rect.top)),
          );
          return tops.size > line.querySelectorAll("br").length + 1;
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
test("the décorateur section reads its subtitle then its three lines, and its call to action", async ({
  page,
}) => {
  await page.goto("/");
  const block = sectionOf(page, titles[8] ?? "");
  await expect(block.locator("h2, p")).toHaveText([
    "Vous travaillez avec un décorateur d'intérieur ?",
    "C'est parfait.",
    "Nos métiers d'art fonctionnent en symbiose.",
    "Il nous transmet sa vision, nous apportons nos 100 ans d'artisanat.",
    "Nous échangeons directement avec lui, vous restez serein.",
  ]);
  await expect(block.getByRole("link")).toHaveText("Je veux ma visite offerte");
});

test("the process section reads its lines, its subtitle last, then its call to action", async ({
  page,
}) => {
  await page.goto("/");
  const block = sectionOf(page, titles[6] ?? "");
  await expect(block.locator("h2, p")).toHaveText([
    "Le processus & la restitution",
    "Le jour même, nous emportons vos pièces.",
    "Soyez serein, tout transport est à notre charge.",
    "Nous vous informons durant tout le processus de réfection.",
    "Lorsque les artisans ont terminé, nous fixons avec vous le jour et l'heure de restitution.",
    "Enfin, nous vous dévoilons chaque ouvrage :",
    "unique et à votre image.",
  ]);
  await expect(block.getByRole("link")).toHaveText("Je veux ma visite offerte");
});

test("the atelier section reads its subtitles without colon, each line after them capitalised", async ({
  page,
}) => {
  await page.goto("/");
  const block = sectionOf(page, titles[5] ?? "");
  await expect(block.locator("h2, p")).toHaveText([
    "L'atelier vient à vous, et c'est offert",
    "Quel que soit votre projet, nous venons d'abord en discuter avec vous.",
    "Un tissu doit être vu, touché, et jugé à la lumière de chez vous.",
    "Nous vous conseillons dans le détail",
    "Les matériaux se choisissent selon la vie passée et future de votre objet.",
    "Si vous le souhaitez, nous examinons le reste de votre mobilier",
    "La santé des bois et des matières et ce qui vaut la peine d'être restauré.",
  ]);
});

test("the privileges section reads its subtitle, its list of privileges bulleted ❊, then its call to action", async ({
  page,
}) => {
  await page.goto("/");
  const block = sectionOf(page, titles[7] ?? "");
  await expect(block.locator("h2, p, li")).toHaveText([
    "4 saisons, 4 privilèges",
    "Avant chacune, profitez d'une offre exclusive.",
    "Révisions offertes",
    "Entretien des bois",
    "Réductions entre voisins",
    "Réductions sur les tissus de saison",
    "Offres spéciales sur des tissus uniques",
  ]);
  await expect(block.locator("ul")).toHaveCSS("list-style-type", '"❊ "');
  await expect(block.getByRole("link")).toHaveText("Je veux ma visite offerte");
});

const captions = [
  { name: /Photographie d'archive/, caption: "Photo d'archive" },
  { name: /quatre chaises traîneau/, caption: "Réalisation Maison Matron" },
  { name: /tire-sangle/, caption: "Le tire-sangle du tapissier" },
  { name: /Canapé en bois/, caption: "Réalisation Maison Matron" },
  {
    name: /Deux fauteuils médaillon en bois teinté/,
    caption: "Réalisation Maison Matron",
  },
  { name: /Buffet bas/, caption: "Réalisation Maison Matron" },
  { name: /Fauteuil à haut dossier/, caption: "Réalisation Maison Matron" },
];

for (const width of [375, 1280]) {
  test(`at ${width}px every photo carries its caption close under it`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    for (const { name, caption } of captions) {
      const figure = page.locator("figure").filter({
        has: page.getByRole("img", { name }),
      });
      const text = figure.locator("figcaption");
      await expect(text).toHaveText(caption);
      const photo = await figure.getByRole("img").boundingBox();
      const under = await text.boundingBox();
      const gap = (under?.y ?? 0) - (photo?.y ?? 0) - (photo?.height ?? 0);
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThanOrEqual(12);
    }
  });
}

for (const width of [375, 1280]) {
  test(`at ${width}px the privileges list starts under the first letter of its subtitle, the pair centred from md`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const block = sectionOf(page, titles[7] ?? "");
    const lefts = await block
      .locator("li")
      .evaluateAll((items) =>
        items.map((item) => Math.round(item.getBoundingClientRect().left)),
      );
    expect(new Set(lefts).size).toBe(1);
    const subtitleStart = await block
      .getByText("Avant chacune, profitez d'une offre exclusive.")
      .evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return Math.round(range.getClientRects()[0]?.left ?? 0);
      });
    expect(Math.abs((lefts[0] ?? 0) - subtitleStart)).toBeLessThanOrEqual(1);
    if (width >= 768) {
      const pair = await block.locator("ul").locator("..").boundingBox();
      const title = await block.getByRole("heading").boundingBox();
      expect((pair?.x ?? 0) + (pair?.width ?? 0) / 2).toBeCloseTo(
        (title?.x ?? 0) + (title?.width ?? 0) / 2,
        0,
      );
    }
  });
}

test("the reviews section holds its ten reviews, set like the hero's quote, the form right after it", async ({
  page,
}) => {
  await page.goto("/");
  const block = sectionOf(page, "Ils nous ont confié leurs pièces");
  const reviews = block.locator("blockquote p");
  await expect(reviews).toHaveText([
    "« Des conseils avisés, une superbe sélection de tissus et un savoir-faire minutieux. Nous sommes ravis de nos nouvelles chaises et nous ferons sans aucun doute à nouveau appel à M. Matron. »",
    "« Nous avons remis 6 chaises de salon pour mettre une nouvelle tapisserie et sommes très satisfaits du résultat. Tissu de qualité, finitions impeccables, livraison dans les (courts) délais et un contact très agréable et professionnel. Nous pouvons recommander Tapissier Matron. »",
    "« Grand professionnalisme sans oublier une bienveillance et sympathie exceptionnelles. »",
    "« Je recommande Monsieur Matron qui a effectué une très jolie restauration sur mon fauteuil. Travail au top. »",
    "« Je recommande M. Matron, il a restauré mon fauteuil, le travail est parfait. »",
    "« Très bon service, bonne écoute du client, patience le temps que le choix soit établi, livraison conforme aux attentes et travail très propre. »",
    "« Je ne puis que recommander la Maison Matron qui est une belle entreprise familiale. De bon conseil avec un travail soigné et de qualité. Absolument ravie du rendu concernant un vieux fauteuil de famille, alors n'hésitez pas et prenez rapidement contact avec eux. »",
    "« De sincères remerciements à la famille Matron pour leur intervention. Ils ont littéralement sauvé notre enfilade en teck qui avait subi des dommages liés à une infiltration. »",
    "« Bon contact et bonne expertise. Mon fauteuil a maintenant un tissu magnifique ! Il commence sa seconde vie ! Merci. Je recommande cet artisan. »",
    "« Superbe travail ! Merci. »",
  ]);
  await expect(block.locator("figure figcaption")).toHaveText([
    "- Anne-Claude",
    "- Stephan",
    "- MP",
    "- Tony",
    "- Trévis",
    "- Santiago",
    "- Annick",
    "- Sebastien",
    "- Aline",
    "- Anne",
  ]);
  await expect(block).not.toContainText(/prix|([!?.,])\1/i);
  const heroQuote = page.getByText(
    "« Des conseils avisés, une superbe sélection de tissus et un savoir-faire minutieux. » - Anne-Claude",
  );
  for (const property of [
    "font-size",
    "line-height",
    "font-family",
    "font-style",
  ]) {
    const expected = await heroQuote.evaluate(
      (element, name) => getComputedStyle(element).getPropertyValue(name),
      property,
    );
    for (const text of await block.locator("figure :is(p, figcaption)").all()) {
      await expect(text).toHaveCSS(property, expected);
    }
  }
  await expect(block.getByRole("link")).toHaveCount(0);
  await expect(block.locator("xpath=following-sibling::section[1]")).toHaveId(
    "booking",
  );
});

for (const { width, columns } of [
  { width: 375, columns: 1 },
  { width: 768, columns: 1 },
  { width: 1024, columns: 2 },
  { width: 1440, columns: 2 },
]) {
  test(`at ${width}px the reviews run in ${columns} left aligned column${columns > 1 ? "s" : ""}, each review whole in one, its name on the line under it`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const block = sectionOf(page, "Ils nous ont confié leurs pièces");
    const gap = width < 1024 ? 48 : 64;
    const edge = (await block.getByRole("heading").boundingBox())?.x ?? 0;
    const figures = await block.locator("figure").all();
    expect(figures).toHaveLength(10);
    const columnTops = new Map<number, number>();
    const columnBottoms = new Map<number, number>();
    for (const figure of figures) {
      const quote = await figure.locator("p").boundingBox();
      const name = await figure.locator("figcaption").boundingBox();
      if (!quote || !name) throw new Error("review without quote or name");
      const column = Math.round(quote.x);
      expect(name.x).toBeCloseTo(quote.x, 0);
      expect(quote.width).toBeLessThanOrEqual(600);
      expect(name.y - (quote.y + quote.height)).toBeCloseTo(16, 0);
      const previous = columnBottoms.get(column);
      if (previous === undefined) columnTops.set(column, quote.y);
      else expect(quote.y - previous).toBeCloseTo(gap, 0);
      columnBottoms.set(column, name.y + name.height);
    }
    const lefts = [...columnTops.keys()].sort((a, b) => a - b);
    expect(lefts).toHaveLength(columns);
    expect(lefts[0]).toBeCloseTo(edge, 0);
    expect(new Set(columnTops.values()).size).toBe(1);
    const aligns = await block
      .locator(":is(h2, p, figcaption)")
      .evaluateAll((texts) =>
        texts.map((text) => getComputedStyle(text).textAlign),
      );
    for (const align of aligns) expect(["left", "start"]).toContain(align);
  });
}

const fabricLogos = [
  "Hermès",
  "Christian Lacroix",
  "Ralph Lauren",
  "Dedar",
  "Lelièvre",
  "Nobilis",
  "Edmond Petit",
  "Pierre Frey",
  "Casal",
];

test("the fabrics section follows « Le vrai sur-mesure », its lines, its logos and its call to action in order", async ({
  page,
}) => {
  await page.goto("/");
  const block = sectionOf(
    page,
    "Profitez de centaines de tissus, tous au même prix",
  );
  await expect(
    block.locator("xpath=preceding-sibling::section[1]"),
  ).toContainText("Le vrai sur-mesure");
  await expect(block.locator("h2, p")).toHaveText([
    "Profitez de centaines de tissus, tous au même prix",
    "Nos collections voyagent avec nous jusqu'à chez vous.",
    "Ce que vous voulez, nous l'avons.",
    "Et tant d'autres…",
  ]);
  const logos = block.getByRole("img");
  await expect(logos).toHaveCount(fabricLogos.length);
  for (const [index, name] of fabricLogos.entries()) {
    await expect(logos.nth(index)).toHaveAttribute("alt", name);
  }
  await expect(block.getByRole("link")).toHaveText("Je veux ma visite offerte");
});

for (const width of [375, 1024, 1440]) {
  test(`at ${width}px the fabric logos stand at one height in centred rows, five then four from lg`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const block = sectionOf(
      page,
      "Profitez de centaines de tissus, tous au même prix",
    );
    const boxes = [];
    for (const name of fabricLogos) {
      const logo = block.getByRole("img", { name, exact: true });
      await expect(logo).toHaveCSS("opacity", "0.5");
      if (name === "Pierre Frey")
        await expect(logo).toHaveCSS("filter", "none");
      else
        await expect(logo).toHaveCSS(
          "filter",
          /brightness\(0\).*invert\(0\.106\)/,
        );
      const box = await logo.boundingBox();
      if (!box) throw new Error(`${name} not rendered`);
      expect(box.height).toBeCloseTo(26, 0);
      expect(box.width).toBeLessThanOrEqual(150.5);
      boxes.push({ name, ...box });
    }
    const rows = Map.groupBy(boxes, (box) => Math.round(box.y));
    if (width >= 1024)
      expect(
        [...rows.values()].map((row) => row.map((box) => box.name)),
      ).toEqual([fabricLogos.slice(0, 5), fabricLogos.slice(5)]);
    const holder = await block
      .getByRole("img", { name: "Hermès" })
      .locator("xpath=../..")
      .boundingBox();
    const centre = (holder?.x ?? 0) + (holder?.width ?? 0) / 2;
    for (const row of rows.values()) {
      const left = Math.min(...row.map((box) => box.x));
      const right = Math.max(...row.map((box) => box.x + box.width));
      expect((left + right) / 2).toBeCloseTo(centre, 0);
    }
  });
}
