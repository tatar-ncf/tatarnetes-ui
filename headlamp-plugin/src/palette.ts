/* Татар палитрасы һәм контраст / the Tatar palette and its contrast check
   (WCAG 2.x relative luminance), so the theme's text colours can be tested. */

export const PALETTE = {
  green: '#1f8a4c',
  greenDark: '#12693a',
  carpet: '#0f5c34',
  red: '#d21f2a',
  gold: '#e3a81a',
  /** Selected sidebar entries: light gold on the carpet green. */
  goldLight: '#ffd75e',
  cream: '#fbf6e9',
  ink: '#241a0d',
};

/** WCAG relative luminance of a #rrggbb or rgb()/rgba() colour. */
export function luminance(colour: string): number {
  let rgb: number[];
  const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(colour);
  if (hex) {
    rgb = hex.slice(1).map(h => parseInt(h, 16));
  } else {
    const fn = /^rgba?\(([^)]+)\)$/.exec(colour);
    if (!fn) {
      throw new Error(`not a colour: ${colour}`);
    }
    rgb = fn[1].split(',').slice(0, 3).map(Number);
  }
  const [r, g, b] = rgb.map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio of two colours, 1 to 21. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** WCAG AA for normal-size text. */
export const AA = 4.5;
