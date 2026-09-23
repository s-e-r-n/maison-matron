import { expect, test } from "@playwright/test";

const viewports = [
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`the hero video covers the viewport at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const hero = page.locator("section").filter({ has: page.locator("h1") });
    const video = hero.locator("video");
    await expect(hero).toBeVisible();
    expect(await hero.boundingBox()).toEqual({
      x: 0,
      y: 0,
      ...viewport,
    });
    expect(await video.boundingBox()).toEqual({ x: 0, y: 0, ...viewport });
    await expect(video).toHaveCSS("object-fit", "cover");
  });
}

test("the hero video plays muted, looped and inline, without controls", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const video = page.locator("video");
  for (const attribute of ["autoplay", "muted", "loop", "playsinline"]) {
    await expect(video).toHaveAttribute(attribute, "");
  }
  await expect(video).not.toHaveAttribute("controls");
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
    .toBe(false);
  const source = await video.getAttribute("src");
  expect((await request.head(source ?? "")).status()).toBe(200);
});

test("a black mask and a progressive blur lie over the hero video", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator("section").filter({ has: page.locator("h1") });
  await expect(hero.locator("video + div")).toHaveCSS(
    "background-color",
    /0\.5\)$/,
  );
  const band = hero.locator("video + div + div");
  const share = await band.evaluate(
    (element) =>
      element.getBoundingClientRect().height /
      (element.parentElement?.getBoundingClientRect().height ?? 1),
  );
  expect(share).toBeGreaterThanOrEqual(0.15);
  expect(share).toBeLessThanOrEqual(0.25);
  const radii = await band
    .locator("> div")
    .evaluateAll((layers) =>
      layers.map((layer) =>
        Number.parseFloat(
          getComputedStyle(layer).backdropFilter.replace("blur(", ""),
        ),
      ),
    );
  expect(radii.length).toBeGreaterThan(1);
  expect(radii).toEqual(radii.toSorted((a, b) => a - b));
  expect(new Set(radii).size).toBe(radii.length);
});
