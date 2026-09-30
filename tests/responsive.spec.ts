import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

const photos = [
  { name: /Photographie d'archive/, width: 2160, height: 2700 },
  { name: /quatre chaises traîneau/, width: 2700, height: 1800 },
  { name: /tire-sangle/, width: 3000, height: 2000 },
  { name: /Canapé en bois/, width: 3000, height: 2000 },
  {
    name: /Deux fauteuils médaillon en bois teinté/,
    width: 3000,
    height: 2000,
  },
  { name: /Buffet bas/, width: 3000, height: 2000 },
  { name: /Fauteuil à haut dossier/, width: 2400, height: 3000 },
];

const transparent = "rgba(0, 0, 0, 0)";

for (const viewport of viewports) {
  test.describe(`at ${viewport.width}px wide`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
    });

    test("the page never scrolls sideways", async ({ page }) => {
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(viewport.width);
    });

    test("no element passes the right edge of the viewport", async ({
      page,
    }) => {
      const overflowing = await page.evaluate((width) => {
        const tags: string[] = [];
        for (const element of document.querySelectorAll("body *")) {
          if (element.getBoundingClientRect().right > width + 0.01) {
            tags.push(element.outerHTML.slice(0, 120));
          }
        }
        return tags;
      }, viewport.width);
      expect(overflowing).toEqual([]);
    });

    for (const photo of photos) {
      test(`${photo.name.source} shows at its native ratio, with no frame around it`, async ({
        page,
      }) => {
        const images = page.getByRole("img", { name: photo.name });
        await expect(images.first()).toBeAttached();
        for (const image of await images.all()) {
          await image.scrollIntoViewIfNeeded();
          await expect
            .poll(() =>
              image.evaluate(
                (element: HTMLImageElement) =>
                  element.complete && element.naturalWidth > 0,
              ),
            )
            .toBe(true);
          const box = await image.boundingBox();
          const ratio = (box?.width ?? 0) / (box?.height ?? 1);
          expect(
            Math.abs(ratio / (photo.width / photo.height) - 1),
          ).toBeLessThanOrEqual(0.01);
          await expect(image).toHaveCSS("background-color", transparent);
          await expect(image.locator("..")).toHaveCSS(
            "background-color",
            transparent,
          );
        }
      });
    }

    test("every section holding a visual is at least one viewport high", async ({
      page,
    }) => {
      const short = await page
        .locator("main section")
        .filter({ has: page.locator("h2") })
        .filter({ has: page.getByRole("img") })
        .evaluateAll((sections) =>
          sections
            .filter(
              (section) =>
                section.getBoundingClientRect().height < innerHeight - 0.5,
            )
            .map((section) => section.querySelector("h2")?.textContent),
        );
      expect(short).toEqual([]);
    });

    if (viewport.width < 768) {
      test("every photo touches both edges of the screen", async ({ page }) => {
        for (const photo of photos) {
          for (const image of await page
            .getByRole("img", { name: photo.name })
            .all()) {
            const box = await image.boundingBox();
            expect(box?.x).toBeCloseTo(0, 0);
            expect(box?.width).toBeCloseTo(viewport.width, 0);
          }
        }
      });

      test("every title, subtitle, paragraph and label is flush left", async ({
        page,
      }) => {
        const texts = page.locator("main :is(h1, h2, p, label)");
        expect(await texts.count()).toBeGreaterThan(0);
        const misaligned = await texts.evaluateAll((elements) =>
          elements
            .filter((element) => {
              const parent = element.parentElement;
              if (!parent) return true;
              const flush =
                parent.getBoundingClientRect().left +
                parent.clientLeft +
                Number.parseFloat(getComputedStyle(parent).paddingLeft);
              return (
                !["left", "start"].includes(
                  getComputedStyle(element).textAlign,
                ) ||
                Math.abs(element.getBoundingClientRect().left - flush) > 0.5
              );
            })
            .map((element) => element.textContent),
        );
        expect(misaligned).toEqual([]);
      });
    }
  });
}
