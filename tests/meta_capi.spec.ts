import { loadEnvConfig } from "@next/env";
import { expect, test } from "@playwright/test";

const { combinedEnv } = loadEnvConfig(process.cwd(), true);
const enabled = combinedEnv.META_CAPI_ENABLED !== "false";
const identity_cookie_names = ["_fbp", "_fbc", "external_id"];

test("mints the identity cookies on the first landing and keeps them", async ({
  page,
  context,
}) => {
  test.skip(!enabled, "META_CAPI_ENABLED is false");
  await page.goto("/?fbclid=IwAR_test_click");
  const minted = Object.fromEntries(
    (await context.cookies()).map((cookie) => [cookie.name, cookie]),
  );
  expect(minted._fbp?.value).toMatch(/^fb\.1\.\d+\.\d+$/);
  expect(minted._fbc?.value).toMatch(/^fb\.1\.\d+\.IwAR_test_click$/);
  expect(minted.external_id?.value).toMatch(/^[0-9a-f-]{36}$/);
  for (const name of identity_cookie_names) {
    expect(minted[name]?.httpOnly).toBe(true);
    expect(minted[name]?.sameSite).toBe("Lax");
    expect(minted[name]?.path).toBe("/");
  }
  await page.goto("/");
  const kept = Object.fromEntries(
    (await context.cookies()).map((cookie) => [cookie.name, cookie.value]),
  );
  for (const name of identity_cookie_names) {
    expect(kept[name]).toBe(minted[name]?.value);
  }
});

test("stays inert when META_CAPI_ENABLED is false", async ({
  page,
  context,
}) => {
  test.skip(enabled, "META_CAPI_ENABLED is true");
  await page.goto("/?fbclid=IwAR_test_click");
  expect((await context.cookies()).map((cookie) => cookie.name)).toEqual([]);
});
