import { test, expect } from "@playwright/test";
test("official button, icon and timer variants preserve geometry and state colors", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4300/tests/fixtures/ds.html");
  await page.evaluate(() => document.fonts.ready);
  for (const [tone, color] of [
    ["primary", "rgb(255, 215, 0)"],
    ["secondary", "rgb(166, 77, 255)"],
  ]) {
    for (const [size, height] of [
      ["big", 35],
      ["medium", 31],
      ["small", 28],
    ]) {
      const button = page.getByTestId(tone + "-" + size);
      await expect(button).toHaveCSS("color", String(color));
      expect((await button.boundingBox())!.height).toBe(height);
      await button.hover();
      await expect(button).toHaveCSS("background-color", String(color));
      await expect(button).toHaveCSS("color", "rgb(1, 0, 19)");
      await page.mouse.down();
      expect(
        await button.evaluate((el) => getComputedStyle(el).filter),
      ).not.toBe("none");
      await page.mouse.up();
      await page.mouse.move(1900, 1000);
    }
    await expect(page.getByTestId(tone + "-disabled")).toHaveCSS(
      "opacity",
      "0.4",
    );
    await expect(page.getByTestId(tone + "-pressed")).toHaveCSS(
      "background-color",
      String(color),
    );
  }
  for (const icon of [
    "chevron-left",
    "chevron-right",
    "audio-off",
    "audio-on",
    "play",
    "pause",
  ]) {
    const element = page
      .getByRole("button", { name: icon, exact: true })
      .locator(".ds-icon");
    expect((await element.boundingBox())!.width).toBe(30);
    expect((await element.boundingBox())!.height).toBe(
      icon === "audio-off" ? 29 : 30,
    );
    expect(
      await element.evaluate((el) => getComputedStyle(el).maskImage),
    ).toContain(icon + ".svg");
  }
  expect(
    await page
      .locator(".ds-timer:not(.ds-timer-small)")
      .evaluateAll((es) =>
        es.map((e) => Math.round(e.getBoundingClientRect().width)),
      ),
  ).toEqual([312, 312]);
  expect(
    await page
      .locator(".ds-timer-small")
      .evaluateAll((es) =>
        es.map((e) => Math.round(e.getBoundingClientRect().width)),
      ),
  ).toEqual([185, 185]);
  expect(
    await page.locator(".ds-logos img").evaluateAll((es) =>
      es.map((e) => ({
        w: Math.round(e.getBoundingClientRect().width),
        h: Math.round(e.getBoundingClientRect().height),
        ok: (e as HTMLImageElement).naturalWidth > 0,
      })),
    ),
  ).toEqual([
    { w: 308, h: 193, ok: true },
    { w: 255, h: 194, ok: true },
  ]);
  await page.mouse.move(600, 600);
  await expect(page.locator(".ds-cursor")).toBeVisible();
  expect(
    (await page.locator(".ds-cursor img").boundingBox())!.width,
  ).toBeCloseTo(173.433, 1);
});
test("input and in-place card expose the official focus, value, error and success states", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4300/tests/fixtures/ds.html");
  const input = page.getByRole("textbox", { name: "LABEL" });
  await expect(input).toHaveCSS("outline-color", "rgb(250, 249, 246)");
  await input.focus();
  await expect(input).toHaveCSS("outline-color", "rgb(255, 215, 0)");
  await input.fill("VALUE");
  await input.blur();
  await expect(input).toHaveCSS("outline-color", "rgb(255, 215, 0)");
  await input.fill("invalid");
  await expect(input).toHaveCSS("outline-color", "rgb(166, 77, 255)");
  await expect(page.getByText("SUPPORTING TEXT")).toBeVisible();
  await expect(page.locator(".ds-clue-back")).toBeHidden();
  await page.getByRole("button", { name: "Apri indizio 99" }).click();
  await expect(page.locator(".ds-clue-back")).toBeVisible();
  await expect(page.locator(".ds-clue-front")).toBeHidden();
  await page.getByRole("button", { name: "Joker", exact: true }).click();
  await expect(page.getByText("RISPOSTA ERRATA")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Joker", exact: true }),
  ).toHaveCSS("background-color", "rgb(166, 77, 255)");
  await page.getByRole("button", { name: "Batsegnale", exact: true }).click();
  await expect(page.getByText("RISPOSTA CORRETTA")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Batsegnale", exact: true }),
  ).toHaveCSS("background-color", "rgb(255, 215, 0)");
  expect(
    (await page.locator(".ds-world-clue").boundingBox())!.width,
  ).toBeCloseTo(300, 2);
  expect(
    (await page.locator(".ds-world-clue").boundingBox())!.height,
  ).toBeCloseTo(426, 2);
});
