// The tatarnetes plugin inside a real Headlamp, against a kind cluster.
// Headlamp runs with the built plugin in its plugins dir (see the e2e job in
// .github/workflows/ci.yml); screenshots land in shots/ for the CI artifact.
// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const CLUSTER = process.env.HEADLAMP_CLUSTER || 'kind-tatarnetes';
const THEME = 'Татарнетес / Tatarnetes';
const SHOTS = path.join(__dirname, 'shots');

// 2026-11-08: tea at 17:35, 17:58 and 18:21 (tatar.test.ts, the CLI vector).
const WORKING = new Date('2026-11-08T12:00:00Z');
const TEA_TIME = new Date('2026-11-08T17:36:00Z');

/** Opens Headlamp with the Tatar theme chosen and the clock fixed at `when`. */
async function open(page, url, when) {
  await page.clock.setFixedTime(when);
  await page.addInitScript(theme => {
    window.localStorage.setItem('headlampThemePreference', theme);
  }, THEME);
  await page.goto(url);
}

const shot = (page, name) => page.screenshot({ path: path.join(SHOTS, `${name}.png`) });

test('theme, carpet and Tatar sidebar on the pods list', async ({ page }) => {
  await open(page, `/c/${CLUSTER}/pods`, WORKING);

  const sidebar = page.locator('.MuiDrawer-paper').first();
  await expect(sidebar).toBeVisible();
  // The theme's sidebar colour and the carpet drawn over it.
  await expect(sidebar).toHaveCSS('background-color', 'rgb(15, 92, 52)');
  const bg = await sidebar.evaluate(el => getComputedStyle(el).backgroundImage);
  expect(bg).toContain('data:image/svg+xml');

  // Tatar names in the menu, the plugin's own entry included.
  for (const name of ['Төркем', 'Эш йөкләре', 'Кузаклар', 'Татарнетес']) {
    await expect(sidebar.getByText(name, { exact: true }).first()).toBeVisible();
  }

  // The tea chip in the app bar, between breaks.
  await expect(page.getByText(/Next tea: 17:35/)).toBeVisible();

  // Tatar column headers and real pods from kind.
  await expect(page.getByRole('columnheader', { name: /Исем \/ Name/ }).first()).toBeVisible();
  await expect(page.getByRole('columnheader', { name: /Мәйдан \/ Namespace/ }).first()).toBeVisible();
  await expect(page.getByText(/^coredns-/).first()).toBeVisible();
  await shot(page, 'headlamp-pods');
});

test('Tatar column headers on the nodes list', async ({ page }) => {
  await open(page, `/c/${CLUSTER}/nodes`, WORKING);
  await expect(page.getByRole('columnheader', { name: /Исем \/ Name/ }).first()).toBeVisible();
  await expect(page.getByText(/tatarnetes-control-plane/).first()).toBeVisible();
  await shot(page, 'headlamp-nodes');
});

test("the plugin's page: tea schedule, Tukay, glossary", async ({ page }) => {
  await open(page, `/c/${CLUSTER}/tatarnetes`, WORKING);
  await expect(page.getByRole('heading', { name: 'Татарнетес', level: 1 })).toBeVisible();
  await expect(page.getByText(/Габдулла Тукай/)).toBeVisible();
  await expect(page.getByText('17:35–17:42')).toBeVisible();
  await expect(page.getByText('кузак', { exact: true })).toBeVisible();
  await shot(page, 'headlamp-plugin-page');
});

test('the tea break overlay, and skipping it', async ({ page }) => {
  await open(page, `/c/${CLUSTER}/pods`, TEA_TIME);
  const overlay = page.getByRole('dialog', { name: /КЫСТЫБЫЙ ТӘНӘФЕСЕ/ });
  await expect(overlay).toBeVisible();
  await expect(overlay.getByText(/try again in 6 min/)).toBeVisible();
  await shot(page, 'headlamp-tea-break');

  await overlay.getByRole('button', { name: /skip this break/ }).click();
  await expect(overlay).toBeHidden();
  await expect(page.getByText(/It's tea time! 6 min left/)).toBeVisible();
});
