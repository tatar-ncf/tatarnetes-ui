import { ConfigStore } from '@kinvolk/headlamp-plugin/lib';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import { MSG } from './strings';

export interface TatarConfig {
  carpet: boolean;
  tea: boolean;
  names: boolean;
}

export const DEFAULTS: TatarConfig = { carpet: true, tea: true, names: true };

export const store = new ConfigStore<Partial<TatarConfig>>('tatarnetes');

/** The settings with the defaults filled in. */
export function config(): TatarConfig {
  return { ...DEFAULTS, ...(store.get() || {}) };
}

export function Settings() {
  const [current, setCurrent] = useState<TatarConfig>(config());
  const toggle = (key: keyof TatarConfig) => (_: unknown, checked: boolean) => {
    const next = { ...current, [key]: checked };
    setCurrent(next);
    store.set(next);
  };
  return (
    <Stack>
      <FormControlLabel
        control={<Switch checked={current.carpet} onChange={toggle('carpet')} />}
        label={MSG.settingsCarpet}
      />
      <FormControlLabel
        control={<Switch checked={current.tea} onChange={toggle('tea')} />}
        label={MSG.settingsTea}
      />
      <FormControlLabel
        control={<Switch checked={current.names} onChange={toggle('names')} />}
        label={MSG.settingsNames}
      />
    </Stack>
  );
}
