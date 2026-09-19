/* Татарнетес UI — демо мәгълүматлар, чәй тәнәфесе, Тукай тасмасы, хәбәрләр.
   Demo dashboard logic: fake resources, tea-break gate (mirrors lib/teatime.sh),
   Tukay/food ticker, success/error toasts. No backend required. */

/* ---- Тукай юллары / Tukay lines (original) ---- */
const TUKAY = [
  "И туган тел, и матур тел, әткәм-әнкәмнең теле! — Г. Тукай, «Туган тел»",
  "Иң элек бу тел белән әнкәм бишектә көйләгән… — Г. Тукай, «Туган тел»",
  "Җиктереп пар ат, Казанга туп-туры киттем карап… — Г. Тукай, «Пар ат»",
  "Нәкъ Казан артында бардыр бер авыл — «Кырлай» диләр… — Г. Тукай, «Шүрәле»",
];
const FOODS = [
  "🥟 Өчпочмак — эчендә ит тә, бәрәңге дә!",
  "🍯 Чәкчәк — туйга да, кунакка да!",
  "🫓 Кыстыбый — җылы килеш иң тәмлесе!",
  "🍵 Сөтле чәй — иң кирәклесе!",
  "🐎 Казылык — чын татарча тәгам!",
];
const PRAISE = ["Афәрин!", "Маладис!", "Бик шәп!", "Татарстан алга!", "Яшә, Татарнетес!"];
const CURSES = ["Җүләр!", "Тинтәк!", "Мокыт!", "Аңгыра баш!", "Кит моннан!"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

/* ---- Тамга (родовой знак) төеннәр өчен / tamga marks as node identifiers ---- */
const _tamga = (paths) =>
  `<svg width="26" height="26" viewBox="0 0 24 24" aria-label="тамга" role="img">` +
  `<g fill="none" stroke="#1f8a4c" stroke-width="2" stroke-linecap="round">${paths}</g></svg>`;
const TAMGA = [
  _tamga('<path d="M12 4v14"/><path d="M6 8q6-6 12 0"/><path d="M6 16h12"/>'),
  _tamga('<circle cx="12" cy="12" r="6"/><path d="M12 2v4M12 18v4"/>'),
  _tamga('<path d="M5 6l7 12 7-12"/><path d="M5 18h14"/>'),
  _tamga('<path d="M12 3l8 8-8 8-8-8z"/><path d="M12 8v8"/>'),
];

/* ---- Чәй тәнәфесе графигы (lib/teatime.sh белән бер үк) ----
   Deterministic tea windows derived from the calendar day, matching the CLI. */
const TEA_BREAKS_PER_DAY = 3;
const TEA_BREAK_MIN = 7;
function teaWindowsFor(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const seed = y * 10000 + m * 100 + d; // YYYYMMDD
  const out = [];
  for (let i = 1; i <= TEA_BREAKS_PER_DAY; i++) {
    const start = (seed * (i * 37 + 13) + i * 101) % 1440;
    out.push([start, TEA_BREAK_MIN]);
  }
  return out;
}
function teaState(date) {
  const now = date.getHours() * 60 + date.getMinutes();
  for (const [s, dur] of teaWindowsFor(date)) {
    if (now >= s && now < s + dur) return { onBreak: true, left: s + dur - now };
  }
  return { onBreak: false, left: 0 };
}

/* ---- Демо асыллар / fake resources ---- */
const DATA = {
  kuzaklar: {
    title: "Кузаклар / Pods",
    cmd: "ayda күрсәт кузаклар",
    head: ["ИСЕМ / NAME", "МӘЙДАН / NS", "ХӘЛ / STATUS", "ЯҢАРУ", "ЯШЬ"],
    rows: [
      ["ecpocmak-web-7d9", "gadati", ok("Эшли/Running"), "0", "3k 12s"],
      ["cakcak-api-5f2", "gadati", ok("Эшли/Running"), "1", "6k 4s"],
      ["kystybyj-cache-0", "kaz", warn("Күтәрелә/Pending"), "0", "34s"],
      ["balis-worker-2a", "yshler", ok("Эшли/Running"), "0", "1k 2s"],
      ["gubadiya-cron-9", "yshler", err("Егылды/CrashLoop"), "7", "12k 9s"],
    ],
  },
  toennar: {
    title: "Төеннәр / Nodes",
    cmd: "ayda күрсәт төеннәр",
    head: ["ТАМГА", "ИСЕМ / NAME", "ХӘЛ", "РОЛЬ", "ЯШЬ", "ВЕРСИЯ"],
    rows: [
      [{ svg: TAMGA[0] }, "tatar-node-kazan", ok("Әзер/Ready"), "control-plane", "40k", "v2.1.0"],
      [{ svg: TAMGA[1] }, "tatar-node-cally", ok("Әзер/Ready"), "эшче/worker", "40k", "v2.1.0"],
      [{ svg: TAMGA[2] }, "tatar-node-alabuga", warn("Әзер,SchedДисабл"), "эшче/worker", "40k", "v2.1.0"],
    ],
  },
  hezmatler: {
    title: "Хезмәтләр / Services",
    cmd: "ayda күрсәт хезмәтләр",
    head: ["ИСЕМ / NAME", "ТӨР", "CLUSTER-IP", "ПОРТ", "ЯШЬ"],
    rows: [
      ["ecpocmak-web", "ClusterIP", "10.96.0.11", "80/TCP", "3k"],
      ["cakcak-api", "LoadBalancer", "10.96.0.24", "443/TCP", "6k"],
      ["capka-ingress", "NodePort", "10.96.0.30", "31380", "6k"],
    ],
  },
  urnashtyru: {
    title: "Урнаштырулар / Deployments",
    cmd: "ayda күрсәт урнаштырулар",
    head: ["ИСЕМ / NAME", "ӘЗЕР", "ЯҢАРТЫЛГАН", "БАР", "ЯШЬ"],
    rows: [
      ["ecpocmak-web", ok("3/3"), "3", "3", "3k"],
      ["cakcak-api", ok("2/2"), "2", "2", "6k"],
      ["gubadiya-cron", err("0/1"), "1", "0", "12k"],
    ],
  },
  maydannar: {
    title: "Мәйданнар / Namespaces",
    cmd: "ayda күрсәт мәйданнар",
    head: ["ИСЕМ / NAME", "ХӘЛ", "ЯШЬ"],
    rows: [
      ["gadati", ok("Актив/Active"), "40k"],
      ["kaz", ok("Актив/Active"), "40k"],
      ["yshler", ok("Актив/Active"), "40k"],
      ["tatar-tozem", ok("Актив/Active"), "40k"],
    ],
  },
};
function ok(t){return {b:"ok",t}} function warn(t){return {b:"warn",t}} function err(t){return {b:"err",t}}

/* ---- Рендер / render ---- */
function renderView(key) {
  const v = DATA[key];
  document.getElementById("view-title").textContent = v.title;
  document.getElementById("cmd-hint").textContent = v.cmd;
  const head = document.getElementById("grid-head");
  head.innerHTML = "<tr>" + v.head.map((h) => `<th>${esc(h)}</th>`).join("") + "</tr>";
  const body = document.getElementById("grid-body");
  body.innerHTML = v.rows.map((r) =>
    "<tr>" + r.map(cellHtml).join("") + "</tr>"
  ).join("");
}
// HTML-экранлау / escape untrusted text before it touches innerHTML.
const esc = (s) => String(s).replace(/[&<>"']/g, (m) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

function cellHtml(c) {
  if (c && typeof c === "object" && c.svg)   // тамга — ышанычлы статик SVG / trusted static SVG
    return `<td class="tamga-cell">${c.svg}</td>`;
  if (c && typeof c === "object" && c.b)
    return `<td><span class="badge ${esc(c.b)}">${esc(c.t)}</span></td>`;
  return `<td>${esc(c)}</td>`;
}

/* ---- Хәбәрләр / toasts ---- */
function toast(good, text) {
  const wrap = document.getElementById("toast-wrap");
  const el = document.createElement("div");
  el.className = "toast" + (good ? "" : " bad");
  const face = good ? "assets/face-happy.svg" : "assets/face-angry.svg";
  const word = good ? pick(PRAISE) : pick(CURSES);
  el.innerHTML = `<img src="${face}" alt=""><div><b>${esc(word)}</b><br>${esc(text)}</div>`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

/* ---- Чәй тәрәзәсен тикшерү / tea gate ---- */
function checkTea() {
  // Демо-өстенлекләр / demo overrides: ?tea=1 мәҗбүри, ?notea=1 сүндерә.
  const q = new URLSearchParams(location.search);
  let st = teaState(new Date());
  if (q.has("tea")) st = { onBreak: true, left: 7 };
  if (q.has("notea")) st = { onBreak: false, left: 0 };
  const ov = document.getElementById("tea-overlay");
  const mf = document.getElementById("mood-face");
  mf.src = st.onBreak ? "assets/face-tea.svg" : "assets/face-happy.svg";
  mf.alt = st.onBreak ? "Түбәтәйле йөз чәй эчә" : "Түбәтәйле шат йөз";
  if (st.onBreak) {
    document.getElementById("tea-left").textContent = st.left;
    ov.hidden = false;
  } else {
    ov.hidden = true;
  }
}

/* ---- Тасма / ticker ---- */
function spinTicker() {
  const t = Math.random() < 0.5 ? pick(TUKAY) : pick(FOODS);
  document.getElementById("ticker-text").textContent = t;
}

/* ---- Башлау / init ---- */
function selectView(li) {
  document.querySelectorAll(".side li").forEach((x) => {
    x.classList.remove("active");
    x.setAttribute("aria-selected", "false");
  });
  li.classList.add("active");
  li.setAttribute("aria-selected", "true");
  const key = li.dataset.view;
  renderView(key);
  if (Math.random() < 0.75) toast(true, `«${DATA[key].title}» ачылды. ${pick(FOODS)}`);
  else toast(false, "Мәйдан табылмады, тагын кара.");
}
document.querySelectorAll(".side li").forEach((li) => {
  li.addEventListener("click", () => selectView(li));
  li.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectView(li); }
  });
});

// Башлангыч күренеш ?view= аша сайланырга мөмкин / initial view via ?view= (deep-link).
(function initView() {
  const want = new URLSearchParams(location.search).get("view");
  const li = want && document.querySelector(`.side li[data-view="${want}"]`);
  if (li) { selectView(li); } else { renderView("kuzaklar"); }
})();
spinTicker();
checkTea();
setInterval(spinTicker, 26000);
setInterval(checkTea, 15000);
