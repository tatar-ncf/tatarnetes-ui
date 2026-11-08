/* Чәй тәнәфесе графигы — lib/teatime.sh (tatarnetes) һәм ../lib.js белән бер үк
   формула: seed = YYYYMMDD, start_i = (seed*(37i+13) + 101i) mod 1440, 7 минут.
   The tea schedule: the same formula as the CLI (`ayda чәй`) and the frozen
   dashboard's lib.js, so the console, the dashboard and Headlamp agree.
   tea.test.ts checks it against lib.js. */

export const TEA_BREAKS_PER_DAY = 3;
export const TEA_BREAK_MIN = 7;

/** [startMinute, minutes] of each break of the local calendar day of date. */
export function teaWindowsFor(date: Date): Array<[number, number]> {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const out: Array<[number, number]> = [];
  for (let i = 1; i <= TEA_BREAKS_PER_DAY; i++) {
    out.push([(seed * (i * 37 + 13) + i * 101) % 1440, TEA_BREAK_MIN]);
  }
  return out;
}

export interface TeaState {
  onBreak: boolean;
  /** Minutes left of the break under way. */
  left: number;
  /** The next break today as HH:MM, or null when none is left. */
  next: string | null;
}

export function hhmm(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
}

export function teaState(date: Date): TeaState {
  const now = date.getHours() * 60 + date.getMinutes();
  let next: number | null = null;
  for (const [start, minutes] of teaWindowsFor(date)) {
    if (now >= start && now < start + minutes) {
      return { onBreak: true, left: start + minutes - now, next: null };
    }
    if (start > now && (next === null || start < next)) {
      next = start;
    }
  }
  return { onBreak: false, left: 0, next: next === null ? null : hhmm(next) };
}
