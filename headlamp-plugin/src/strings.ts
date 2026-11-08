/* Татарча юллар / Tatar strings. Tea texts are the tatarnetes catalog's
   (locale/tt.po, locale/en.po: tea.*); resource names follow its glossary
   (docs/terminology.tt.md). Tatar first, then English. */

export const MSG = {
  teaTitle: 'СӨТЛЕ ЧӘЙ ҺӘМ КЫСТЫБЫЙ ТӘНӘФЕСЕ / TEA-WITH-MILK AND KYSTYBYY BREAK',
  teaBody:
    'Татарнетес хәзер чәй эчә. Кыстырылма, туганкай — безгә дә чәй эчәргә кирәк! / ' +
    "Tatarnetes is having tea. Don't knock, kinsman — let us drink our tea too!",
  teaLeft: (min: number) =>
    `Зинһар, ${min} минуттан соң тагын кереп кара. / Please try again in ${min} min.`,
  teaSkip: 'Ашыгыч эш — тәнәфесне узып китәм / In a hurry — skip this break',
  teaNow: (min: number) =>
    `Хәзер чәй вакыты! Тагын ${min} минут. / It's tea time! ${min} min left.`,
  teaNext: (at: string | null) =>
    at === null
      ? 'Бүген чәй беткән — иртәгә. / No more tea today — tomorrow.'
      : `Хәзер кластер эшли. Киләсе чәй: ${at} / Cluster is working. Next tea: ${at}`,
  teaToday: 'Бүгенге тәнәфесләр / Today’s breaks',
  pageTitle: 'Татарнетес',
  tukay: 'И туган тел, и матур тел, әткәм-әнкәмнең теле! — Габдулла Тукай, «Туган тел» (1909)',
  settingsCarpet: 'Келәм (сул панельдә) / Carpet behind the sidebar',
  settingsTea: 'Чәй тәнәфесе экраны / Tea break overlay',
  settingsNames:
    'Татарча атамалар (меню, таблица баганалары) / Tatar names in the menu and table columns',
  glossary: 'Сүзлек / Glossary',
};

/** Sidebar entries of Headlamp 0.46 (frontend/src/components/Sidebar/
    useSidebarItems.tsx), by their stable name, in Tatar. Terms are those of
    the tatarnetes glossary (docs/terminology.tt.md), whose "Headlamp menu"
    section holds the ones first proposed here. */
export const SIDEBAR: Record<string, string> = {
  // Баш бит һәм көйләүләр / home and settings
  home: 'Баш бит',
  notifications: 'Белдерүләр',
  settings: 'Көйләүләр',
  settingsGeneral: 'Гомуми',
  plugins: 'Плагиннар',
  settingsCluster: 'Төркем',
  // Төркем / cluster
  cluster: 'Төркем',
  namespaces: 'Мәйданнар',
  nodes: 'Төеннәр',
  advancedSearch: 'Киңәйтелгән эзләү (бета)',
  map: 'Харита',
  // Эш йөкләре / workloads
  workloads: 'Эш йөкләре',
  Pods: 'Кузаклар',
  Deployments: 'Урнаштырулар',
  StatefulSets: 'Тезмәләр',
  DaemonSets: 'Көтүләр',
  ReplicaSets: 'Күчермәләр',
  Jobs: 'Эшләр',
  CronJobs: 'Вакытлы эшләр',
  JobSets: 'Эш җыелмалары',
  LeaderWorkerSets: 'Җитәкче-эшче җыелмалары',
  // Саклагыч / storage
  storage: 'Саклагыч',
  persistentVolumeClaims: 'Таләпләр',
  persistentVolumes: 'Күләмнәр',
  storageClasses: 'Саклагыч сыйныфлары',
  volumeAttributesClasses: 'Күләм үзлекләре сыйныфлары',
  // Челтәр / network
  network: 'Челтәр',
  services: 'Хезмәтләр',
  endpoints: 'Ахыргы нокталар',
  endpointslices: 'Ахыргы нокта кисәкләре',
  ingresses: 'Капкалар',
  ingressclasses: 'Капка сыйныфлары',
  portforwards: 'Порт юнәлтү',
  NetworkPolicies: 'Челтәр сәясәтләре',
  // Шлюз / Gateway API
  gatewayapi: 'Шлюз (бета)',
  gateways: 'Шлюзлар',
  gatewayclasses: 'Шлюз сыйныфлары',
  httproutes: 'HTTP маршрутлары',
  grpcroutes: 'GRPC маршрутлары',
  tcproutes: 'TCP маршрутлары',
  udproutes: 'UDP маршрутлары',
  referencegrants: 'Сылтама рөхсәтләре',
  backendtlspolicies: 'Арткы як TLS сәясәтләре',
  backendtrafficpolicies: 'Арткы як трафик сәясәтләре',
  // Куркынычсызлык / security
  security: 'Куркынычсызлык',
  serviceAccounts: 'Хезмәт хисаплары',
  roles: 'Рольләр',
  roleBindings: 'Роль бәйләнешләре',
  // Көйләүләр / configuration
  config: 'Көйләүләр',
  configMaps: 'Көйләмәләр',
  secrets: 'Серләр',
  horizontalPodAutoscalers: 'Горизонталь үлчәү (HPA)',
  verticalPodAutoscalers: 'Вертикаль үлчәү (VPA)',
  podDisruptionBudgets: 'Өзелү чикләре (PDB)',
  resourceQuotas: 'Ресурс өлешләре',
  limitRanges: 'Чик аралыклары',
  priorityClasses: 'Өстенлек сыйныфлары',
  runtimeClasses: 'Башкару сыйныфлары',
  leases: 'Арендалар',
  mutatingWebhookConfigurations: 'Үзгәртүче вебхуклар',
  validatingWebhookConfigurations: 'Тикшерүче вебхуклар',
  // Җайланмалар / devices (DRA)
  devices: 'Җайланмалар (альфа)',
  deviceClasses: 'Җайланма сыйныфлары',
  resourceClaims: 'Ресурс таләпләре',
  resourceClaimTemplates: 'Ресурс таләбе калыплары',
  // Бүлү / scheduling
  scheduling: 'Бүлү (альфа)',
  podGroups: 'Кузак берләшмәләре',
  compositePodGroups: 'Кушма кузак берләшмәләре',
  schedulingWorkloads: 'Эш йөкләре',
  // Махсус ресурслар / custom resources
  crds: 'Махсус ресурслар',
  crs: 'Нөсхәләр',
  tatarnetes: 'Татарнетес',
};

/** Table column labels Headlamp shows in English, as "Tatar / English". */
export const COLUMNS: Record<string, string> = {
  Name: 'Исем / Name',
  Namespace: 'Мәйдан / Namespace',
  Age: 'Яшь / Age',
  Status: 'Хәл / Status',
  Restarts: 'Яңару / Restarts',
  Ready: 'Әзер / Ready',
  Node: 'Төен / Node',
  Type: 'Төр / Type',
  Ports: 'Порт / Ports',
  Version: 'Версия / Version',
  Roles: 'Роль / Roles',
  Reason: 'Сәбәп / Reason',
  Message: 'Хәбәр / Message',
};

/** The glossary shown on the plugin's page: Tatar, English. */
export const GLOSSARY: Array<[string, string]> = [
  ['кузак', 'pod'],
  ['савыт', 'container'],
  ['төен', 'node'],
  ['төркем', 'cluster'],
  ['урнаштыру', 'deployment'],
  ['хезмәт', 'service'],
  ['капка', 'ingress'],
  ['мәйдан', 'namespace'],
  ['сер', 'secret'],
  ['көйләмә', 'configmap'],
  ['күләм', 'volume'],
];
