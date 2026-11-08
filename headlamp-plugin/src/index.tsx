/* Татарнетес Headlamp өчен: татар палитрасы, келәм, чәй тәнәфесе һәм татарча
   атамалар. Tatarnetes for Headlamp: the Tatar palette as an app theme, the
   carpet behind the sidebar, the tea break overlay on the same schedule as
   `ayda`, and Tatar names in the menu and table headers where the plugin API
   reaches them. Every part can be switched off in the plugin's settings. */
import {
  registerAppBarAction,
  registerAppLogo,
  registerAppTheme,
  registerPluginSettings,
  registerResourceTableColumnsProcessor,
  registerRoute,
  registerSidebarEntry,
  registerSidebarEntryFilter,
} from '@kinvolk/headlamp-plugin/lib';
import { DateLabel, Link } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import GlobalStyles from '@mui/material/GlobalStyles';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { carpetBackground, dataUri, FACE_HAPPY_SVG, FACE_TEA_SVG, LOGO_SVG } from './art';
import { config, Settings, store } from './settings';
import { COLUMNS, GLOSSARY, MSG, SIDEBAR } from './strings';
import { hhmm, teaState, teaWindowsFor } from './tea';

const PALETTE = {
  green: '#1f8a4c',
  greenDark: '#12693a',
  carpet: '#0f5c34',
  red: '#d21f2a',
  gold: '#e3a81a',
  cream: '#fbf6e9',
  ink: '#241a0d',
};

registerAppTheme({
  name: 'Татарнетес / Tatarnetes',
  base: 'light',
  primary: PALETTE.green,
  secondary: PALETTE.cream,
  text: { primary: PALETTE.ink },
  link: { color: PALETTE.greenDark },
  background: { default: PALETTE.cream, surface: '#ffffff', muted: '#f3ead2' },
  sidebar: {
    background: PALETTE.carpet,
    color: PALETTE.cream,
    selectedBackground: PALETTE.gold,
    selectedColor: PALETTE.ink,
    actionBackground: PALETTE.red,
  },
  navbar: { background: PALETTE.greenDark, color: PALETTE.cream },
  radius: 6,
  buttonTextTransform: 'none',
});

/** One of the dashboard's pictures at a size; decorative unless labelled. */
function Art(props: { svg: string; size: number; label?: string }) {
  return (
    <img
      src={dataUri(props.svg)}
      width={props.size}
      height={props.size}
      alt={props.label || ''}
      aria-hidden={props.label ? undefined : true}
    />
  );
}

registerAppLogo(() => <Art svg={LOGO_SVG} size={32} label="Татарнетес" />);

/** The current time, every 15 seconds. */
function useNow(): Date {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/** The app bar: the tea chip, the overlay during a break, and the carpet. */
function TatarBar() {
  const now = useNow();
  const settings = store.useConfig()();
  const { carpet, tea } = { ...config(), ...(settings || {}) };
  const state = teaState(now);
  const breakId = `${now.toDateString()}-${
    state.left > 0 ? now.getHours() * 60 + now.getMinutes() + state.left : 0
  }`;
  const [skipped, setSkipped] = useState<string | null>(null);

  return (
    <>
      {carpet && (
        <GlobalStyles
          styles={{
            /* Headlamp paints the drawer with the `background` shorthand under
               `<drawer> .MuiPaper-root`, which wins over a bare
               `.MuiDrawer-paper` and wipes the image: one class more wins back. */
            '.MuiDrawer-root .MuiDrawer-paper.MuiPaper-root': {
              backgroundImage: carpetBackground,
              backgroundSize: '220px 220px',
            },
          }}
        />
      )}
      <Chip
        size="small"
        icon={<span aria-hidden="true">🍵</span>}
        label={state.onBreak ? MSG.teaNow(state.left) : MSG.teaNext(state.next)}
        sx={{ bgcolor: PALETTE.gold, color: PALETTE.ink, maxWidth: 360 }}
      />
      {tea && state.onBreak && skipped !== breakId && (
        <Box
          role="dialog"
          aria-modal="true"
          aria-labelledby="tatar-tea-title"
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: carpetBackground,
            backgroundSize: '220px 220px',
          }}
        >
          <Box
            sx={{
              maxWidth: 520,
              p: 4,
              textAlign: 'center',
              bgcolor: PALETTE.cream,
              color: PALETTE.ink,
              border: `4px solid ${PALETTE.gold}`,
              borderRadius: 2,
            }}
          >
            <Art svg={FACE_TEA_SVG} size={120} />
            <Typography
              id="tatar-tea-title"
              variant="h6"
              sx={{ color: PALETTE.red, fontWeight: 800 }}
            >
              ⛔ {MSG.teaTitle} ⛔
            </Typography>
            <Typography sx={{ my: 2 }}>{MSG.teaBody} 🍵🫓</Typography>
            <Typography sx={{ mb: 2 }}>{MSG.teaLeft(state.left)}</Typography>
            <Button variant="outlined" onClick={() => setSkipped(breakId)}>
              {MSG.teaSkip}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}

registerAppBarAction(TatarBar);

/* Татарча меню: Headlamp бу фильтрның кайтарганын түгел, ә аның хөкемен
   куллана, шуңа атама урынында алыштырыла. Headlamp keeps the entries a
   filter accepts rather than what it returns, so the label is set in place. */
registerSidebarEntryFilter(entry => {
  const tatar = SIDEBAR[entry.name];
  if (tatar && config().names) {
    entry.label = tatar;
  }
  return entry;
});

/* Headlamp'ның «name», «namespace», «age» баганалары — исем белән бирелгән
   стандарт баганалар, аларның атамасын плагин үзгәртә алмый; шуңа алар шул ук
   эчтәлекле объект баганаларга алыштырыла. Headlamp's built-in "name",
   "namespace" and "age" columns come as bare strings whose headers a processor
   cannot relabel, so they are swapped for object columns that render the same
   cells under Tatar headers. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;
const BUILTIN_COLUMNS: Record<string, object> = {
  name: {
    id: 'name',
    label: COLUMNS.Name,
    gridTemplate: 'auto',
    getValue: (item: Row) => item.metadata.name,
    render: (item: Row) => item && <Link kubeObject={item} />,
  },
  namespace: {
    id: 'namespace',
    label: COLUMNS.Namespace,
    gridTemplate: 'auto',
    filterVariant: 'multi-select',
    getValue: (item: Row) => item.getNamespace() ?? '-',
    render: (item: Row) =>
      item?.getNamespace() ? (
        <Link
          routeName="namespace"
          params={{ name: item.getNamespace() }}
          activeCluster={item.cluster}
        >
          {item.getNamespace()}
        </Link>
      ) : (
        ''
      ),
  },
  age: {
    id: 'age',
    label: COLUMNS.Age,
    gridTemplate: 'min-content',
    disableFiltering: true,
    cellProps: { align: 'right' },
    getValue: (item: Row) => -new Date(item.metadata.creationTimestamp).getTime(),
    render: (item: Row) =>
      item && <DateLabel date={item.metadata.creationTimestamp} format="mini" />,
  },
};

registerResourceTableColumnsProcessor(({ columns }) => {
  if (!config().names) {
    return columns;
  }
  return columns.map(c => {
    if (typeof c === 'string') {
      return (BUILTIN_COLUMNS[c] as unknown as typeof c) ?? c;
    }
    return typeof c === 'object' && COLUMNS[c.label] ? { ...c, label: COLUMNS[c.label] } : c;
  });
});

/** The plugin's page: today's tea, Tukay, the glossary. */
function TatarPage() {
  const now = useNow();
  const state = teaState(now);
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {state.onBreak ? (
          <Art svg={FACE_TEA_SVG} size={72} />
        ) : (
          <Art svg={FACE_HAPPY_SVG} size={72} />
        )}
        <Typography variant="h4" component="h1">
          {MSG.pageTitle}
        </Typography>
      </Box>
      <Typography sx={{ my: 2, fontStyle: 'italic' }}>{MSG.tukay}</Typography>
      <Typography variant="h6" component="h2">
        🍵 {MSG.teaToday}
      </Typography>
      <Typography component="ul">
        {teaWindowsFor(now)
          .slice()
          .sort((a, b) => a[0] - b[0])
          .map(([start, minutes]) => (
            <li key={start}>
              {hhmm(start)}–{hhmm(start + minutes)}
            </li>
          ))}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {state.onBreak ? MSG.teaNow(state.left) : MSG.teaNext(state.next)}
      </Typography>
      <Typography variant="h6" component="h2">
        {MSG.glossary}
      </Typography>
      <Typography component="ul">
        {GLOSSARY.map(([tt, en]) => (
          <li key={tt}>
            <b>{tt}</b> — {en}
          </li>
        ))}
      </Typography>
    </Box>
  );
}

registerSidebarEntry({
  parent: null,
  name: 'tatarnetes',
  label: SIDEBAR.tatarnetes,
  url: '/tatarnetes',
  icon: 'mdi:tea',
});

registerRoute({
  path: '/tatarnetes',
  sidebar: 'tatarnetes',
  name: 'tatarnetes',
  exact: true,
  component: () => <TatarPage />,
});

registerPluginSettings('tatarnetes', Settings, false);
