import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { resolve } from 'path';
import { CARPET_SVG, FACE_HAPPY_SVG, FACE_TEA_SVG, LOGO_SVG } from './art';
import { AA, contrast, PALETTE } from './palette';
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
    expect(teaState(new Date(2026, 10, 8, 17, 42))).toEqual({
      onBreak: false,
      left: 0,
      next: '17:58',
    });
    expect(teaState(new Date(2026, 10, 8, 23, 0)).next).toBeNull();
    expect(hhmm(65)).toBe('01:05');
  });
});

describe('assets and names', () => {
  it('carries the dashboard pictures verbatim', () => {
    const pictures: Array<[string, string]> = [
      [CARPET_SVG, 'carpet.svg'],
      [FACE_HAPPY_SVG, 'face-happy.svg'],
      [FACE_TEA_SVG, 'face-tea.svg'],
      [LOGO_SVG, 'tatarnetes-logo.svg'],
    ];
    for (const [svg, file] of pictures) {
      expect(svg).toBe(readFileSync(resolve(here, '../../assets', file), 'utf8'));
    }
  });
  it('names pods and nodes as the glossary does', () => {
    expect(SIDEBAR.Pods).toBe('Кузаклар');
    expect(SIDEBAR.nodes).toBe('Төеннәр');
    expect(COLUMNS.Status).toBe('Хәл / Status');
  });
});

/* Every entry Headlamp 0.46 can put in its sidebars, by stable name
   (frontend/src/components/Sidebar/useSidebarItems.tsx at v0.46.0). */
const HEADLAMP_046_SIDEBAR = [
  'home',
  'notifications',
  'settings',
  'settingsGeneral',
  'plugins',
  'settingsCluster',
  'cluster',
  'namespaces',
  'nodes',
  'advancedSearch',
  'map',
  'workloads',
  'Pods',
  'Deployments',
  'StatefulSets',
  'DaemonSets',
  'ReplicaSets',
  'Jobs',
  'CronJobs',
  'JobSets',
  'LeaderWorkerSets',
  'storage',
  'persistentVolumeClaims',
  'persistentVolumes',
  'storageClasses',
  'volumeAttributesClasses',
  'network',
  'services',
  'endpoints',
  'endpointslices',
  'ingresses',
  'ingressclasses',
  'portforwards',
  'NetworkPolicies',
  'gatewayapi',
  'gateways',
  'gatewayclasses',
  'httproutes',
  'grpcroutes',
  'tcproutes',
  'udproutes',
  'referencegrants',
  'backendtlspolicies',
  'backendtrafficpolicies',
  'security',
  'serviceAccounts',
  'roles',
  'roleBindings',
  'config',
  'configMaps',
  'secrets',
  'horizontalPodAutoscalers',
  'verticalPodAutoscalers',
  'podDisruptionBudgets',
  'resourceQuotas',
  'limitRanges',
  'priorityClasses',
  'runtimeClasses',
  'leases',
  'mutatingWebhookConfigurations',
  'validatingWebhookConfigurations',
  'devices',
  'deviceClasses',
  'resourceClaims',
  'resourceClaimTemplates',
  'scheduling',
  'podGroups',
  'compositePodGroups',
  'schedulingWorkloads',
  'crds',
  'crs',
];

describe('sidebar', () => {
  it('has a Tatar name for every entry of Headlamp 0.46', () => {
    const missing = HEADLAMP_046_SIDEBAR.filter(name => !SIDEBAR[name]);
    expect(missing).toEqual([]);
  });
  it('writes the names in Cyrillic Tatar, abbreviations aside', () => {
    for (const name of HEADLAMP_046_SIDEBAR) {
      const words = SIDEBAR[name].replace(/\b(HTTP|GRPC|TCP|UDP|TLS|HPA|VPA|PDB)\b/g, '');
      expect(words).not.toMatch(/[A-Za-z]/);
    }
  });
});

describe('contrast (WCAG AA)', () => {
  it('computes the WCAG ratio', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrast('rgb(15, 92, 52)', PALETTE.carpet)).toBeCloseTo(1, 5);
  });
  it('a selected sub-entry: light gold on the carpet', () => {
    expect(contrast(PALETTE.goldLight, PALETTE.carpet)).toBeGreaterThanOrEqual(AA);
    // what it was: ink on the carpet
    expect(contrast(PALETTE.ink, PALETTE.carpet)).toBeLessThan(AA);
  });
  it('the rest of the sidebar and the app bar', () => {
    expect(contrast(PALETTE.cream, PALETTE.carpet)).toBeGreaterThanOrEqual(AA);
    expect(contrast(PALETTE.ink, PALETTE.gold)).toBeGreaterThanOrEqual(AA);
    expect(contrast(PALETTE.cream, PALETTE.greenDark)).toBeGreaterThanOrEqual(AA);
  });
});
