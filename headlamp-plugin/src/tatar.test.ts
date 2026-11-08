import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { resolve } from 'path';
import { CARPET_SVG } from './carpet';
import { COLUMNS, SIDEBAR } from './strings';
import { hhmm, teaState, teaWindowsFor } from './tea';

// Tests run in headlamp-plugin/ (npm test).
const here = resolve(process.cwd(), 'src');
// The frozen dashboard's lib.js, the reference the CLI formula is mirrored in.
const lib = createRequire(resolve(process.cwd(), 'package.json'))(resolve(here, '../../lib.js'));

describe('tea schedule', () => {
  it('matches the dashboard (and so the CLI) on many days', () => {
    for (let d = new Date(2026, 0, 1); d < new Date(2027, 2, 1); d.setDate(d.getDate() + 7)) {
      expect(teaWindowsFor(d)).toEqual(lib.teaWindowsFor(d));
    }
  });
  it('has the CLI vector of 2026-11-08 (tatarnetes tests/unit.sh)', () => {
    expect(teaWindowsFor(new Date(2026, 10, 8))).toEqual([
      [1101, 7],
      [1078, 7],
      [1055, 7],
    ]);
  });
  it('is on a break inside a window and names the next one outside', () => {
    expect(teaState(new Date(2026, 10, 8, 17, 36))).toEqual({ onBreak: true, left: 6, next: null });
    expect(teaState(new Date(2026, 10, 8, 17, 42))).toEqual({ onBreak: false, left: 0, next: '17:58' });
    expect(teaState(new Date(2026, 10, 8, 23, 0)).next).toBeNull();
    expect(hhmm(65)).toBe('01:05');
  });
});

describe('assets and names', () => {
  it('carries the carpet verbatim', () => {
    expect(CARPET_SVG).toBe(readFileSync(resolve(here, '../../assets/carpet.svg'), 'utf8'));
  });
  it('keeps the copied faces and logo identical to the dashboard', () => {
    for (const f of ['face-happy.svg', 'face-tea.svg', 'tatarnetes-logo.svg']) {
      expect(readFileSync(resolve(here, 'assets', f), 'utf8')).toBe(
        readFileSync(resolve(here, '../../assets', f), 'utf8')
      );
    }
  });
  it('names pods and nodes as the glossary does', () => {
    expect(SIDEBAR.Pods).toBe('Кузаклар');
    expect(SIDEBAR.nodes).toBe('Төеннәр');
    expect(COLUMNS.Status).toBe('Хәл / Status');
  });
});
