// The tatarnetes plugin inside a real Headlamp, against a kind cluster.
// Headlamp runs with the built plugin in its plugins dir (see the e2e job in
// .github/workflows/ci.yml); screenshots land in shots/ for the CI artifact.
// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const CLUSTER = process.env.HEADLAMP_CLUSTER || 'kind-tatarnetes';
const THEME = 'Татарнетес / Tatarnetes';
const SHOTS = path.join(__dirname, 'shots');

// The dashboard's lib.js holds the tea formula the CLI and the plugin share.
const { teaWindowsFor } = require('../../lib.js');

/* A day after the cluster was made (so ages read right), with a first break no
   earlier than 01:00: WORKING sits an hour before it, TEA_TIME a minute in.
   The browser runs in UTC, so local and UTC days agree. */
const pad = n => String(n).padStart(2, '0');
const hhmm = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const day = new Date();
day.setUTCHours(0, 0, 0, 0);
let first;
do {
  day.setUTCDate(day.getUTCDate() + 1);
  first = Math.min(
    ...teaWindowsFor(new Date(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate())).map(
      w => w[0]
    )
  );
} while (first < 60);
const at = minute => new Date(day.getTime() + minute * 60_000);
const WORKING = at(first - 60);
const TEA_TIME = at(first + 1);
const FIRST = hhmm(first);
const FIRST_END = hhmm(first + 7);

/** Opens Headlamp with the Tatar theme chosen and the clock fixed at `when`. */
async function open(page, url, when) {
  await page.clock.setFixedTime(when);
  await page.addInitScript(theme => {
    window.localStorage.setItem('headlampThemePreference', theme);
  }, THEME);
  await page.goto(url);
}

/** WCAG contrast ratio of two rgb()/rgba() colours (as getComputedStyle gives them). */
function contrast(a, b) {
  const lum = c => {
    const [r, g, bl] = c
      .replace(/^rgba?\(|\)$/g, '')
      .split(',')
      .slice(0, 3)
      .map(v => {
        const x = Number(v) / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
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

  // Tatar names in the menu, the plugin's own entry included: every entry
  // Headlamp shows on kind, nothing left in English.
  const names = [
    'Төркем',
    'Харита',
    'Эш йөкләре',
    'Кузаклар',
    'Урнаштырулар',
    'Эш җыелмалары',
    'Җитәкче-эшче җыелмалары',
    'Саклагыч',
    'Челтәр',
    'Шлюз (бета)',
    'Куркынычсызлык',
    'Көйләүләр',
    'Җайланмалар (альфа)',
    'Махсус ресурслар',
    'Татарнетес',
  ];
  for (const name of names) {
    await expect(sidebar.getByText(name, { exact: true }).first()).toBeVisible();
  }
  for (const english of ['Map', 'Job Sets', 'Gateway (beta)', 'Security', 'Custom Resources']) {
    await expect(sidebar.getByText(english, { exact: true })).toHaveCount(0);
  }

  // The selected entries meet WCAG AA: the sub-entry (Кузаклар) on plain
  // carpet green, its group (Эш йөкләре) in ink on gold.
  for (const selected of [
    sidebar.locator('.MuiCollapse-root .MuiListItemButton-root.Mui-selected').first(),
    sidebar.locator('.MuiListItemButton-root.Mui-selected').first(),
  ]) {
    await expect(selected).toBeVisible();
    const { color, background } = await selected.evaluate(el => {
      const cs = getComputedStyle(el);
      return { color: cs.color, background: cs.backgroundColor };
    });
    const ratio = contrast(color, background);
    expect(ratio, `${color} on ${background}`).toBeGreaterThanOrEqual(4.5);
  }
  await expect(
    sidebar.locator('.MuiCollapse-root .Mui-selected').getByText('Кузаклар', { exact: true })
  ).toBeVisible();

  // The tea chip in the app bar, between breaks.
  await expect(page.getByText(new RegExp(`Next tea: ${FIRST}`))).toBeVisible();

  // Tatar column headers and real pods from kind.
  await expect(page.getByRole('columnheader', { name: /Исем \/ Name/ }).first()).toBeVisible();
  await expect(page.getByRole('columnheader', { name: /Мәйдан \/ Namespace/ }).first()).toBeVisible();
  await expect(page.getByRole('columnheader', { name: /Яшь \/ Age/ }).first()).toBeVisible();
  await expect(page.getByRole('columnheader', { name: /Хәл \/ Status/ }).first()).toBeVisible();
  await expect(page.getByText(/^coredns-/).first()).toBeVisible();
  await shot(page, 'headlamp-pods');
});

test('the home sidebar in Tatar on the settings page', async ({ page }) => {
  await open(page, '/settings/general', WORKING);
  const sidebar = page.locator('.MuiDrawer-paper').first();
  for (const name of ['Белдерүләр', 'Көйләүләр', 'Гомуми', 'Плагиннар']) {
    await expect(sidebar.getByText(name, { exact: true }).first()).toBeVisible();
  }
  await shot(page, 'headlamp-settings');
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
  await expect(page.getByText(`${FIRST}–${FIRST_END}`)).toBeVisible();
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
