/* Татарнетес рәсемнәре — ../assets/*.svg, сүзгә-сүз (tatar.test.ts тикшерә).
   The dashboard's pictures, verbatim from ../assets (checked by tatar.test.ts),
   as data URIs: the plugin needs no SVG loader. */

/** ../assets/face-happy.svg */
export const FACE_HAPPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <!-- Шат түбәтәйле йөз / happy face in a tюбетейка -->
  <circle cx="100" cy="112" r="62" fill="#f2d7ad" stroke="#c99a5a" stroke-width="3"/>
  <!-- Түбәтәй / skullcap -->
  <path d="M40 78 Q100 20 160 78 Q100 66 40 78 Z" fill="#1f8a4c" stroke="#12693a" stroke-width="3"/>
  <path d="M40 78 Q100 92 160 78" fill="none" stroke="#e3a81a" stroke-width="4"/>
  <g fill="#e3a81a"><path d="M100 40 l6 10 -6 10 -6 -10 Z"/><circle cx="72" cy="60" r="3"/><circle cx="128" cy="60" r="3"/><circle cx="88" cy="52" r="2.5"/><circle cx="112" cy="52" r="2.5"/></g>
  <!-- Күзләр / eyes -->
  <g fill="#241a0d"><circle cx="80" cy="108" r="6"/><circle cx="120" cy="108" r="6"/></g>
  <!-- Кызыл яңаклар / rosy cheeks -->
  <g fill="#e88" opacity="0.6"><circle cx="72" cy="128" r="8"/><circle cx="128" cy="128" r="8"/></g>
  <!-- Елмаю / smile -->
  <path d="M74 130 Q100 158 126 130" fill="none" stroke="#241a0d" stroke-width="5" stroke-linecap="round"/>
</svg>
`;

/** ../assets/face-tea.svg */
export const FACE_TEA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <!-- Чәй эчүче түбәтәйле йөз / face having tea in a tюбетейка -->
  <circle cx="100" cy="108" r="60" fill="#f2d7ad" stroke="#c99a5a" stroke-width="3"/>
  <path d="M42 76 Q100 20 158 76 Q100 64 42 76 Z" fill="#1f8a4c" stroke="#12693a" stroke-width="3"/>
  <path d="M42 76 Q100 90 158 76" fill="none" stroke="#e3a81a" stroke-width="4"/>
  <g fill="#e3a81a"><path d="M100 38 l6 10 -6 10 -6 -10 Z"/><circle cx="74" cy="58" r="3"/><circle cx="126" cy="58" r="3"/></g>
  <!-- Йомык күзләр / closed content eyes -->
  <g stroke="#241a0d" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M74 106 Q82 100 90 106"/><path d="M110 106 Q118 100 126 106"/>
  </g>
  <g fill="#e88" opacity="0.55"><circle cx="72" cy="122" r="7"/><circle cx="128" cy="122" r="7"/></g>
  <!-- Тыныч елмаю / calm smile -->
  <path d="M84 128 Q100 142 116 128" fill="none" stroke="#241a0d" stroke-width="4" stroke-linecap="round"/>
  <!-- Чынаяк / tea cup -->
  <g transform="translate(138,120)">
    <path d="M0 6 h26 v10 a13 13 0 0 1 -26 0 Z" fill="#fff" stroke="#d21f2a" stroke-width="2.5"/>
    <path d="M26 8 q10 2 6 12" fill="none" stroke="#d21f2a" stroke-width="2.5"/>
    <!-- Пар / steam -->
    <g fill="none" stroke="#fbf6e9" stroke-width="2.5" stroke-linecap="round" opacity="0.9">
      <path d="M8 2 q4 -6 0 -12"/><path d="M18 2 q4 -6 0 -12"/>
    </g>
  </g>
</svg>
`;

/** ../assets/tatarnetes-logo.svg */
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260">
  <title>Tatarnetes / Татарнетес</title>
  <!-- k8s штурвалы татарча: җиде почмак + түбәтәй + эчпочмак үзәк -->
  <defs>
    <linearGradient id="grn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1f8a4c"/><stop offset="1" stop-color="#12693a"/>
    </linearGradient>
  </defs>

  <!-- Җиде почмак / heptagon (Kubernetes wheel), gold rim -->
  <polygon points="130,40 200.4,73.9 217.7,150 169.1,211.1 90.9,211.1 42.3,150 59.6,73.9"
           fill="url(#grn)" stroke="#e3a81a" stroke-width="6" stroke-linejoin="round"/>

  <!-- Штурвал спицалары / helm spokes -->
  <g stroke="#fbf6e9" stroke-width="7" stroke-linecap="round">
    <line x1="130" y1="130" x2="130" y2="82"/>
    <line x1="130" y1="130" x2="175.3" y2="103.8"/>
    <line x1="130" y1="130" x2="186.5" y2="152.9"/>
    <line x1="130" y1="130" x2="155.2" y2="192.3"/>
    <line x1="130" y1="130" x2="104.8" y2="192.3"/>
    <line x1="130" y1="130" x2="73.5" y2="152.9"/>
    <line x1="130" y1="130" x2="84.7" y2="103.8"/>
  </g>
  <circle cx="130" cy="130" r="30" fill="#12693a" stroke="#fbf6e9" stroke-width="6"/>

  <!-- Эчпочмак / echpochmak triangle in the hub -->
  <polygon points="130,113 145,140 115,140" fill="#e3a81a" stroke="#fbf6e9" stroke-width="2"/>

  <!-- Түбәтәй / skullcap crowning the wheel (taller dome + tassel knob) -->
  <path d="M90 44 Q130 0 170 44 Q130 28 90 44 Z" fill="#d21f2a" stroke="#9c141d" stroke-width="3"/>
  <path d="M90 44 Q130 58 170 44" fill="none" stroke="#e3a81a" stroke-width="4"/>
  <circle cx="130" cy="10" r="6.5" fill="#e3a81a" stroke="#9c141d" stroke-width="1.5"/>
</svg>
`;

/** ../assets/carpet.svg */
export const CARPET_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <!-- Татар келәме: лалә (тюльпан) + ислими үрмәсе + тамга. Tiling carpet:
       Tatar tulip, islimi vine scroll, and a central tamga. -->
  <rect width="240" height="240" fill="#0f5c34"/>

  <!-- Ислими үрмәсе (кырыйлар буйлап) / islimi vine along the edges -->
  <g fill="none" stroke="#12693a" stroke-width="3">
    <path d="M0 20 Q60 0 120 20 T240 20"/>
    <path d="M0 220 Q60 240 120 220 T240 220"/>
    <path d="M20 0 Q0 60 20 120 T20 240"/>
    <path d="M220 0 Q240 60 220 120 T220 240"/>
  </g>
  <g fill="#e3a81a">
    <circle cx="60" cy="10" r="2.5"/><circle cx="180" cy="10" r="2.5"/>
    <circle cx="60" cy="230" r="2.5"/><circle cx="180" cy="230" r="2.5"/>
    <circle cx="10" cy="60" r="2.5"/><circle cx="10" cy="180" r="2.5"/>
    <circle cx="230" cy="60" r="2.5"/><circle cx="230" cy="180" r="2.5"/>
  </g>

  <!-- Үзәк ромб + тамга / central diamond with a tamga mark -->
  <g transform="translate(120,120)">
    <path d="M0 -54 L54 0 L0 54 L-54 0 Z" fill="#12693a" stroke="#e3a81a" stroke-width="2.5"/>
    <path d="M0 -38 L38 0 L0 38 L-38 0 Z" fill="#0f5c34" stroke="#d21f2a" stroke-width="2"/>
    <!-- Тамга (родовой знак) — стилизованный -->
    <g stroke="#e3a81a" stroke-width="3" fill="none" stroke-linecap="round">
      <path d="M0 -20 V 16"/>
      <path d="M-14 -8 Q0 -20 14 -8"/>
      <path d="M-12 12 H 12"/>
    </g>
  </g>

  <!-- Дүрт лалә (тюльпан) / four tulips toward the corners -->
  <g fill="#d21f2a" stroke="#e3a81a" stroke-width="1.5">
    <g transform="translate(120,54)">
      <path d="M0 6 C -12 6 -14 -10 -8 -16 C -6 -8 -3 -10 0 -18 C 3 -10 6 -8 8 -16 C 14 -10 12 6 0 6 Z"/>
    </g>
    <g transform="translate(120,186) rotate(180)">
      <path d="M0 6 C -12 6 -14 -10 -8 -16 C -6 -8 -3 -10 0 -18 C 3 -10 6 -8 8 -16 C 14 -10 12 6 0 6 Z"/>
    </g>
    <g transform="translate(54,120) rotate(-90)">
      <path d="M0 6 C -12 6 -14 -10 -8 -16 C -6 -8 -3 -10 0 -18 C 3 -10 6 -8 8 -16 C 14 -10 12 6 0 6 Z"/>
    </g>
    <g transform="translate(186,120) rotate(90)">
      <path d="M0 6 C -12 6 -14 -10 -8 -16 C -6 -8 -3 -10 0 -18 C 3 -10 6 -8 8 -16 C 14 -10 12 6 0 6 Z"/>
    </g>
  </g>
</svg>
`;

export const dataUri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const carpetBackground = `url("${dataUri(CARPET_SVG)}")`;
