import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.route("https://vercel.live/**", (route) => route.abort());
});
async function enterStory(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "INIZIA LA MISSIONE", exact: true })
    .click();
}
async function enterTutorial(page: Page) {
  await enterStory(page);
  await page.getByRole("button", { name: "SALTA INTRO" }).click();
}
async function beginMission(page: Page) {
  const next = page.getByRole("button", { name: "Istruzione successiva" });
  for (let i = 0; i < 3; i++) await next.click();
  await page
    .getByRole("button", { name: "INIZIA LA MISSIONE", exact: true })
    .click();
}
async function start(page: Page, reduced = true) {
  await page.emulateMedia({
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  await enterTutorial(page);
  await beginMission(page);
  await expect(
    page.getByRole("button", { name: "Raggiungi indizio 1", exact: true }),
  ).toBeEnabled();
}
async function reach(page: Page, id: number) {
  const target = page.getByRole("button", {
    name: "Raggiungi indizio " + id,
    exact: true,
  });
  await expect(target).toBeEnabled({ timeout: 45000 });
  await target.focus();
  const front = page.getByRole("button", {
    name: "Apri indizio " + id,
    exact: true,
  });
  await expect(front).toBeFocused();
  await front.press("Enter");
  await expect(page.locator('[data-clue-id="' + id + '"]')).toHaveAttribute(
    "data-face",
    "back",
  );
}
async function answer(page: Page, id: number, response: string) {
  await reach(page, id);
  await page.getByRole("button", { name: response, exact: true }).click();
  await expect(page.locator('[data-clue-id="' + id + '"]')).toHaveCount(0, {
    timeout: 45000,
  });
}
async function fillFields(page: Page, fields: Record<string, string>) {
  for (const [name, value] of Object.entries(fields)) {
    await page.locator('[name="' + name + '"]').fill(value);
  }
}
const PERSONAL = {
  phone: "+39 3330000000",
  fullName: "Bruce Demo",
  email: "demo@example.com",
  birthDate: "01/01/1990",
  password: "fittizia",
};
const SHIPPING = {
  region: "Campania",
  provincia: "NA",
  city: "Napoli",
  cap: "80125",
  address: "Via Demo 15",
};
const CARD = {
  cardOwner: "Bruce Demo",
  cardNumber: "4242 4242 4242 4242",
  cardExpiry: "12/30",
  cardCvv: "123",
};
async function fill(page: Page, card = false) {
  const next = page.getByRole("button", { name: "Tappa successiva" });
  await fillFields(page, PERSONAL);
  await next.click();
  await fillFields(page, SHIPPING);
  await next.click();
  await page
    .getByRole("radio", {
      name: card ? "CARTA DI CREDITO O DEBITO" : "PAYPAL",
      exact: true,
    })
    .check();
  if (card) await fillFields(page, CARD);
  await next.click();
}
const BATCOMPUTER_VIDEO = "/assets/textures/BatCaverna_Batcomputer360.mp4";
const backdrop = (page: Page) => page.locator(".batcave-backdrop");
const responses = ["BAT SEGNALE", "JOKER", "BATMAN", "BATMOBILE", "REATTORE"];
test("official start has original assets, tokens and an inert decorative video", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  const media: string[] = [];
  page.on("request", (r) => {
    if (/\.(mp4|wav)(\?|$)/.test(r.url())) media.push(r.url());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "BATMAN STATUE EXPERIENCE" }),
  ).toBeVisible();
  await expect(page.locator("nav").getByRole("button")).toHaveCount(2);
  await expect(page.locator(".ds-start-title")).toHaveCSS(
    "font-family",
    /Poppins/,
  );
  const computed = await page.locator("h1").evaluate((el) => ({
    color: getComputedStyle(el).color,
    family: getComputedStyle(el).fontFamily,
    size: getComputedStyle(el).fontSize,
    lineHeight: getComputedStyle(el).lineHeight,
    background: getComputedStyle(document.documentElement).backgroundColor,
  }));
  expect(computed).toMatchObject({
    color: "rgb(255, 215, 0)",
    size: "80px",
    lineHeight: "88px",
    background: "rgb(1, 0, 19)",
  });
  expect(computed.family).toContain("Space Grotesk");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".ds-logos img")).toHaveCount(3);
  await expect
    .poll(() =>
      page
        .locator(".ds-logos img")
        .evaluateAll((els) =>
          els.every(
            (el) =>
              (el as HTMLImageElement).complete &&
              (el as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  const video = backdrop(page).locator("video");
  await expect(video).toHaveAttribute("src", BATCOMPUTER_VIDEO);
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("controls", false);
  await expect(backdrop(page)).toHaveAttribute("inert", "");
  await expect(backdrop(page)).toHaveCSS("pointer-events", "none");
  expect(
    media.every((url) => new URL(url).pathname === BATCOMPUTER_VIDEO),
  ).toBe(true);
  await page.mouse.move(1910, 1070);
  await page.screenshot({ path: test.info().outputPath("start.png") });
});
test("storytelling plays all frames, pauses on time and can skip directly to tutorial", async ({
  page,
}) => {
  const base = new Date("2026-11-02T12:00:00Z");
  await page.clock.install({ time: base });
  await page.goto("/");
  await page.clock.pauseAt(new Date(base.getTime() + 60000));
  await page
    .getByRole("button", { name: "INIZIA LA MISSIONE", exact: true })
    .click();
  await expect(page.getByRole("progressbar")).toHaveCount(0);
  await expect(backdrop(page).locator("video")).toHaveAttribute(
    "src",
    BATCOMPUTER_VIDEO,
  );
  await expect(page.getByRole("heading")).toContainText(
    "HO LASCIATO UN REGALINO",
  );
  await page.clock.runFor(4000);
  await page.getByRole("button", { name: "Metti in pausa esperienza" }).click();
  await expect(
    page.getByRole("heading", { name: "MISSIONE IN PAUSA" }),
  ).toBeVisible();
  await page.clock.runFor(50000);
  await page.getByRole("button", { name: "Riprendi esperienza" }).click();
  await expect(page.getByRole("heading")).toContainText(
    "HO LASCIATO UN REGALINO",
  );
  await page.clock.runFor(1100);
  await expect(page.getByRole("heading")).toContainText("RISOLVI IL GIOCO");
  for (const copy of [
    "NON È IL SOLITO GIOCATTOLO",
    "IL TEMPO SCORRE",
    "TROVA I MIEI 5 INDIZI",
  ]) {
    await page.clock.runFor(5000);
    await expect(page.getByRole("heading")).toContainText(copy);
  }
  await expect(page.getByRole("button", { name: "SALTA INTRO" })).toHaveCount(
    0,
  );
  await page.clock.runFor(5000);
  const accept = page.getByRole("button", { name: "ACCETTA LA SFIDA" });
  await expect(accept).toBeVisible();
  await page.clock.runFor(20000);
  await accept.click();
  await expect(
    page.getByRole("heading", { name: "BATTI IL TEMPO" }),
  ).toBeVisible();
  await enterTutorial(page);
  await expect(
    page.getByRole("heading", { name: "BATTI IL TEMPO" }),
  ).toBeVisible();
});
test("tutorial uses the four official steps and the mission HUD", async ({
  page,
}) => {
  await enterTutorial(page);
  await expect(backdrop(page).locator("video")).toHaveAttribute(
    "src",
    BATCOMPUTER_VIDEO,
  );
  await expect(page.locator("nav [role=timer]")).toHaveText("03.00");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await expect(
    page.getByRole("heading", { name: "BATTI IL TEMPO" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Istruzione precedente" }),
  ).toBeDisabled();
  for (const title of [
    "RISOLVI GLI ENIGMI",
    "TROVA TUTTI GLI INDIZI",
    "ESPLORA L’AMBIENTE",
  ]) {
    await page.getByRole("button", { name: "Istruzione successiva" }).click();
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
  await expect(
    page.getByRole("button", { name: "INIZIA LA MISSIONE" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Istruzione precedente" }).click();
  await expect(
    page.getByRole("heading", { name: "TROVA TUTTI GLI INDIZI" }),
  ).toBeVisible();
});
test("keyboard mission flips in-world cards, supports wrong answers and escape, then wins", async ({
  page,
}) => {
  test.setTimeout(240000);
  await start(page);
  await expect(backdrop(page)).toHaveCount(0);
  await reach(page, 1);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "JOKER", exact: true }).click();
  await expect(
    page.getByText("RISPOSTA ERRATA", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-clue-id="1"]')).toHaveAttribute(
    "data-face",
    "front",
  );
  await expect(
    page.getByRole("heading", { name: "MISSIONE IN PAUSA" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Apri indizio 1", exact: true }),
  ).toBeFocused();
  for (let id = 1; id <= 5; id++) await answer(page, id, responses[id - 1]);
  await expect(
    page.getByRole("heading", { name: "MISSIONE COMPIUTA" }),
  ).toBeVisible();
  await expect(
    page.locator("nav [role=timer],nav [role=progressbar]"),
  ).toHaveCount(0);
  await expect(page.locator("main [role=timer]")).not.toHaveText("00.00");
  await expect(backdrop(page)).toHaveCSS(
    "background-image",
    /BatCaverna_Batcomputer360\.jpg/,
  );
  await expect(backdrop(page).locator("video")).toHaveCount(0);
  await expect(
    page.getByText(/SPEEDRUN|Premio demo|Bonus esplorazione/),
  ).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("win.png") });
  await page.getByRole("button", { name: "SCOPRI LA STATUA" }).click();
  await expect(
    page.getByRole("heading", { name: "L’EREDITÀ È TUA" }),
  ).toBeVisible();
  await expect(backdrop(page)).toHaveCount(0);
  await page
    .locator("nav")
    .getByRole("button", { name: "PREORDINA IL CAVALIERE" })
    .click();
  await expect(
    page.getByRole("heading", { name: "DATI PERSONALI" }),
  ).toBeVisible();
});
test("correct feedback survives pause and early clues retain the hidden time bonus", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.clock.install();
  await start(page);
  await reach(page, 1);
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await page.getByRole("button", { name: responses[0], exact: true }).click();
  await expect(
    page.getByText("RISPOSTA CORRETTA", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Metti in pausa esperienza" }).click();
  await page.clock.runFor(1100);
  await expect(page.locator("nav [role=progressbar]")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await page.getByRole("button", { name: "Riprendi esperienza" }).click();
  await page.clock.runFor(1000);
  await expect(page.locator("nav [role=progressbar]")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await page.clock.resume();
  await answer(page, 2, responses[1]);
  await expect(
    page.getByRole("button", { name: "Raggiungi indizio 3", exact: true }),
  ).toBeEnabled({ timeout: 45000 });
  const timer = await page.locator("nav [role=timer]").innerText();
  const [minutes, seconds] = timer.split(".").map(Number);
  expect(minutes * 60 + seconds).toBeGreaterThan(180);
  await expect(page.getByText(/Bonus esplorazione|SPEEDRUN/)).toHaveCount(0);
});
test("mouse mission finds and flips every card without a centered dialog", async ({
  page,
}) => {
  test.setTimeout(180000);
  await start(page, false);
  for (let id = 1; id <= 5; id++) {
    const front = page.locator('[data-clue-id="' + id + '"] .clue-card');
    await expect(
      page.getByRole("button", {
        name: "Raggiungi indizio " + id,
        exact: true,
      }),
    ).toBeEnabled({ timeout: 45000 });
    const viewport = page.viewportSize()!;
    let point: { x: number; y: number } | null = null;
    for (let scan = 0; scan < 180 && !point; scan++) {
      point = await front.evaluate((el) => {
        const r = el.getBoundingClientRect(),
          x = r.x + r.width / 2,
          y = r.y + r.height / 2;
        const nav = document.querySelector("nav")!.getBoundingClientRect();
        return x > 30 &&
          x < innerWidth - 30 &&
          y > nav.bottom + 20 &&
          y < innerHeight - 20 &&
          el.contains(document.elementFromPoint(x, y))
          ? { x, y }
          : null;
      });
      if (!point) {
        await page.mouse.move(viewport.width - 5, viewport.height / 2);
        await page.waitForTimeout(100);
      }
    }
    expect(point, "carta " + id + " visibile nel panorama").not.toBeNull();
    await expect(async () => {
      const rect = await front.boundingBox();
      expect(rect).not.toBeNull();
      await page.mouse.move(
        rect!.x + rect!.width / 2,
        rect!.y + rect!.height / 2,
      );
      expect(await front.evaluate((el) => el.matches(":hover"))).toBe(true);
      // The stop event can precede one already queued panorama projection.
      // Measure the hold after that frame has reached the DOM.
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      const held = await front.boundingBox();
      await page.waitForTimeout(150);
      const next = await front.boundingBox();
      expect(Math.abs(next!.x - held!.x)).toBeLessThan(1);
      expect(Math.abs(next!.y - held!.y)).toBeLessThan(1);
    }).toPass({ timeout: 45000, intervals: [100, 150, 200] });
    if (id === 1)
      await page.screenshot({
        path: test.info().outputPath("mouse-card-front.png"),
      });
    const before = await page
      .locator('[data-clue-id="' + id + '"]')
      .boundingBox();
    const rect = await front.boundingBox();
    await page.mouse.click(
      rect!.x + rect!.width / 2,
      rect!.y + rect!.height / 2,
    );
    await expect(page.locator('[data-clue-id="' + id + '"]')).toHaveAttribute(
      "data-face",
      "back",
    );
    await expect(
      page.locator('[data-clue-id="' + id + '"] .ds-clue-front'),
    ).toBeHidden();
    await expect(
      page.locator('[data-clue-id="' + id + '"] .ds-clue-back'),
    ).toBeVisible();
    if (id === 1)
      await page.screenshot({
        path: test.info().outputPath("mouse-card-back.png"),
      });
    const after = await page
      .locator('[data-clue-id="' + id + '"]')
      .boundingBox();
    expect(Math.abs(after!.x - before!.x)).toBeLessThan(2);
    expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page
      .getByRole("button", { name: responses[id - 1], exact: true })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "MISSIONE COMPIUTA" }),
  ).toBeVisible();
});
test("checkout validates each Figma step, keeps entered values and displays the demo total", async ({
  page,
}) => {
  await page.goto("/#checkout");
  await expect(backdrop(page).locator("video")).toHaveAttribute(
    "src",
    BATCOMPUTER_VIDEO,
  );
  const next = page.getByRole("button", { name: "Tappa successiva" });
  const back = page.getByRole("button", { name: "Tappa precedente" });
  await expect(page.locator("input")).toHaveCount(5);
  await expect(page.locator("[name=email]")).toHaveValue("");
  await next.click();
  await expect(page.locator("[aria-invalid=true]")).toHaveCount(5);
  await expect(page.locator("[name=phone]")).toBeFocused();
  await fillFields(page, PERSONAL);
  await next.click();
  await expect(
    page.getByRole("heading", { name: "DATI DI SPEDIZIONE" }),
  ).toBeFocused();
  await fillFields(page, SHIPPING);
  await back.click();
  await expect(page.locator("[name=email]")).toHaveValue(PERSONAL.email);
  await next.click();
  await expect(page.locator("[name=address]")).toHaveValue(SHIPPING.address);
  await next.click();
  await next.click();
  await expect(page.getByRole("radio", { name: "PAYPAL" })).toBeFocused();
  await page.getByRole("radio", { name: "CARTA DI CREDITO O DEBITO" }).check();
  await expect(page.locator("input:not([type=radio])")).toHaveCount(4);
  await next.click();
  await expect(page.locator("[name=cardOwner]")).toBeFocused();
  await page.getByRole("radio", { name: "PAYPAL", exact: true }).check();
  await expect(page.locator("[name=cardNumber]")).toHaveCount(0);
  await next.click();
  await expect(page.getByText("750€", { exact: true })).toBeVisible();
  await expect(
    page.locator("input[name=quantity],input[name=promo]"),
  ).toHaveCount(0);
});
test("valid PayPal demo creates only a local guarded confirmation", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST" && !r.url().startsWith("https://vercel.live/"))
      posts.push(r.url());
  });
  await page.goto("/#checkout");
  await fill(page);
  await page.getByRole("button", { name: "CHECKOUT", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "ACQUISTO ANDATO A BUON FINE" }),
  ).toBeVisible();
  await expect(page.getByText("x1", { exact: true })).toBeVisible();
  await expect(backdrop(page).locator("video")).toHaveAttribute(
    "src",
    BATCOMPUTER_VIDEO,
  );
  expect(posts).toEqual([]);
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
  await page.reload();
  await expect(page).toHaveURL(/#statua$/);
});
test("card demo prevents duplicate submissions and never sends form data", async ({
  page,
}) => {
  await page.goto("/#checkout");
  await fill(page, true);
  const history = await page.evaluate(() => window.history.length);
  await page.getByRole("button", { name: "CHECKOUT", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "CHECKOUT", exact: true }),
  ).toBeDisabled();
  await page.locator("form").evaluate((el) => {
    (el as HTMLFormElement).requestSubmit();
    (el as HTMLFormElement).requestSubmit();
  });
  await expect(
    page.getByRole("heading", { name: "ACQUISTO ANDATO A BUON FINE" }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.history.length)).toBe(history + 1);
  await page.getByRole("button", { name: "TORNA ALLA HOME" }).click();
  await expect(
    page.getByRole("heading", { name: "BATMAN STATUE EXPERIENCE" }),
  ).toBeVisible();
});
test("leaving checkout during processing cancels late confirmation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#statua");
  await page
    .locator("nav")
    .getByRole("button", { name: "PREORDINA IL CAVALIERE" })
    .click();
  await fill(page);
  await page.getByRole("button", { name: "CHECKOUT", exact: true }).click();
  await page.goBack();
  await page.waitForTimeout(4500);
  await expect(page).toHaveURL(/#statua$/);
  await expect(
    page.getByRole("heading", { name: "ACQUISTO ANDATO A BUON FINE" }),
  ).toHaveCount(0);
});
test("phones and touch tablets show the mobile card and only the decorative media", async ({
  browser,
}) => {
  for (const device of [
    {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
      viewport: { width: 390, height: 844 },
    },
    {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
      viewport: { width: 844, height: 390 },
    },
    {
      userAgent: "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)",
      viewport: { width: 1024, height: 1366 },
    },
    {
      userAgent: "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)",
      viewport: { width: 1366, height: 1024 },
    },
  ]) {
    const context = await browser.newContext({ ...device, hasTouch: true });
    const page = await context.newPage();
    const media: string[] = [];
    page.on("request", (r) => {
      if (/assets\/(audio|videos|textures|showreel|ds\/card)/.test(r.url()))
        media.push(r.url());
    });
    await page.goto(
      (process.env.BASE_URL || "http://127.0.0.1:4173") + "/#checkout",
    );
    await expect(
      page.getByRole("heading", { name: "DISPOSITIVO NON COMPATIBILE" }),
    ).toBeVisible();
    await expect(page.locator("button,nav,canvas,audio")).toHaveCount(0);
    await expect(page.locator(".ds-logos img")).toHaveCount(3);
    await expect(backdrop(page).locator("video")).toHaveAttribute(
      "src",
      BATCOMPUTER_VIDEO,
    );
    expect(
      media.every(
        (url) =>
          new URL(url).pathname === BATCOMPUTER_VIDEO ||
          new URL(url).pathname.endsWith("/BatCaverna_Batcomputer360.jpg"),
      ),
    ).toBe(true);
    await context.close();
  }
});
test("showreel paints without scrolling, bounds requests and recovers after missing frames", async ({
  page,
}) => {
  let inFlight = 0,
    max = 0;
  await page.route("**/assets/showreel/*.webp", async (route) => {
    inFlight++;
    max = Math.max(max, inFlight);
    await new Promise((r) => setTimeout(r, 60));
    if (route.request().url().endsWith("/0001.webp")) await route.abort();
    else await route.continue();
    inFlight--;
  });
  await page.goto("/#statua");
  await expect(page.locator("canvas")).toBeVisible();
  await expect
    .poll(() =>
      page.locator("canvas").evaluate((el) => {
        const c = el as HTMLCanvasElement;
        return (
          c.getContext("2d")!.getImageData(c.width / 2, c.height / 2, 1, 1)
            .data[3] > 0
        );
      }),
    )
    .toBe(true);
  expect(max).toBeLessThanOrEqual(6);
  await expect(
    page.getByRole("heading", { name: "PRESENZA LEGGENDARIA" }),
  ).toBeVisible();
  await page.evaluate(() =>
    window.scrollTo(0, (document.body.scrollHeight - innerHeight) * 0.4),
  );
  await expect(
    page.getByRole("heading", { name: "MATERIALI D’ELITE" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Metti in pausa esperienza" }).click();
  const pausedAt = await page.evaluate(() => scrollY);
  await expect(
    page.getByRole("heading", { name: "MISSIONE IN PAUSA" }),
  ).toBeVisible();
  await page.mouse.wheel(0, 1000);
  await page.keyboard.press("PageDown");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(pausedAt);
  await page.getByRole("button", { name: "Riprendi esperienza" }).click();
  await expect(
    page.getByRole("heading", { name: "MATERIALI D’ELITE" }),
  ).toBeVisible();
  await page.evaluate(() =>
    window.scrollTo(0, (document.body.scrollHeight - innerHeight) * 0.7),
  );
  await expect(
    page.getByRole("heading", { name: "SCULTURA DI PRECISIONE" }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(
    page
      .locator("main")
      .getByRole("button", { name: "PREORDINA IL CAVALIERE" }),
  ).toBeVisible();
  await expect(page.locator("footer,.gallery-options")).toHaveCount(0);
});
test("complete image failure keeps recoverable provisional state", async ({
  page,
}) => {
  await page.route("**/assets/showreel/*.webp", (r) => r.abort());
  await page.goto("/#statua");
  await expect(page.getByText(/Sequenza non disponibile/)).toBeVisible();
  await page.unroute("**/assets/showreel/*.webp");
  await page.getByRole("button", { name: "Riprova", exact: true }).click();
  await expect(page.locator(".statue-loading")).toHaveCount(0);
});
test("WebGL denial freezes mission time and offers the existing recovery path", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (/webgl/.test(type)) return null;
      return get.apply(this, [type, ...args] as Parameters<typeof get>);
    } as typeof get;
  });
  await enterTutorial(page);
  await beginMission(page);
  await expect(
    page.getByRole("heading", { name: "La Batcaverna non è disponibile." }),
  ).toBeVisible();
  await expect(page.locator("nav [role=timer]")).toHaveText("03.00");
  await page.waitForTimeout(1200);
  await expect(page.locator("nav [role=timer]")).toHaveText("03.00");
  await page
    .getByRole("button", { name: "Scopri la statua", exact: true })
    .click();
  await expect(page).toHaveURL(/#statua$/);
});
test("failed videos fall back to images and transitions can continue", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.route("**/*.mp4", (r) => r.abort());
  await start(page, false);
  for (let id = 1; id <= 5; id++) {
    await answer(page, id, responses[id - 1]);
    if (id === 2 || id === 3)
      await page
        .getByRole("button", { name: "Accedi alla prossima area" })
        .click();
  }
  await expect(
    page.getByRole("heading", { name: "MISSIONE COMPIUTA" }),
  ).toBeVisible();
});
test("hint, pause and failure use active mission time without added badges", async ({
  page,
}) => {
  await page.clock.install();
  await start(page);
  await page.clock.fastForward(61000);
  await expect(page.locator(".ds-clue-hint")).toHaveCount(1);
  await page.getByRole("button", { name: "Metti in pausa esperienza" }).click();
  await expect(backdrop(page)).toHaveCSS("z-index", "100");
  const time = await page.locator("nav [role=timer]").innerText();
  await page.clock.fastForward(70000);
  await expect(page.locator("nav [role=timer]")).toHaveText(time);
  await page.getByRole("button", { name: "Riprendi esperienza" }).click();
  await page.clock.fastForward(125000);
  await expect(
    page.getByRole("heading", { name: "MISSIONE FALLITA" }),
  ).toBeVisible();
  await expect(backdrop(page)).toHaveCSS(
    "background-image",
    /BatCaverna_Batcomputer360\.jpg/,
  );
  await expect(
    page.locator("nav [role=timer],nav [role=progressbar]"),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "RIPROVA LA MISSIONE" }).click();
  await expect(
    page.getByRole("heading", { name: "BATMAN STATUE EXPERIENCE" }),
  ).toBeVisible();
});
test("short desktop and zoom equivalent allow tutorial, in-world answers and checkout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 720, height: 450 });
  await start(page);
  await answer(page, 1, responses[0]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/#checkout");
  await fill(page);
  await page.getByRole("button", { name: "CHECKOUT", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "ACQUISTO ANDATO A BUON FINE" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("axe checks official start, tutorial, checkout, confirmation and static showreel", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const check = async () =>
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto("/");
  await check();
  await page.getByRole("button", { name: "INIZIA LA MISSIONE" }).click();
  await page.getByRole("button", { name: "SALTA INTRO" }).click();
  await check();
  await page.goto("/#checkout");
  await check();
  await fill(page);
  await page.getByRole("button", { name: "CHECKOUT", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "ACQUISTO ANDATO A BUON FINE" }),
  ).toBeVisible();
  await check();
  await page.goto("/#statua");
  await expect(page.locator(".ds-statue-poster")).toBeVisible();
  await check();
});
test("unknown paths and the static error entry show the Figma 404", async ({
  page,
}) => {
  for (const path of ["/pagina-inesistente", "/404.html"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page).toHaveTitle("404 | Batman Statue Experience");
    await expect(backdrop(page).locator("video")).toHaveAttribute(
      "src",
      BATCOMPUTER_VIDEO,
    );
    await page.getByRole("link", { name: "TORNA ALLA HOME" }).click();
    await expect(
      page.getByRole("heading", { name: "BATMAN STATUE EXPERIENCE" }),
    ).toBeVisible();
  }
});
test("mute affects existing sources and blocks answer beeps", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    const contexts: AudioContext[] = [];
    Object.defineProperty(window, "__contexts", { value: contexts });
    window.AudioContext = class extends Original {
      constructor(...args: ConstructorParameters<typeof AudioContext>) {
        super(...args);
        contexts.push(this);
      }
    };
  });
  await start(page);
  await page.getByRole("button", { name: "Silenzia audio" }).click();
  const counts = await page.evaluate(() => {
    let count = 0;
    const original = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function (...args) {
      count++;
      return original.apply(this, args);
    };
    Object.defineProperty(window, "__beeps", { get: () => count });
    return count;
  });
  await reach(page, 1);
  await page.getByRole("button", { name: "JOKER", exact: true }).click();
  expect(
    await page.evaluate(
      () => (window as unknown as { __beeps: number }).__beeps,
    ),
  ).toBe(counts);
});
