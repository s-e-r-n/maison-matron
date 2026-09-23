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
