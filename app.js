/* Татарнетес UI — ике режим: ДЕМО (ялган мәгълүмат, гадәттә) һәм ҖАНЛЫ
   (чын кластер, kubectl proxy аша, ?api=… яки config.js). Чәй тәнәфесе,
   Тукай тасмасы, хәбәрләр.
   Two modes: DEMO (fake data, the default) and LIVE (a real cluster through
   kubectl proxy, enabled by ?api=… or config.js). Pure logic is in lib.js. */
"use strict";
const T = window.TatarUI;

/* ---- Классик поэзия — tatarnetes/data/poetry.tt'тан, тикшерелгән юллар гына ----
   Verified lines only, copied from tatarnetes data/poetry.tt (see its
   VERIFICATION.tt.md); attribution exactly as recorded there. */
const POETRY = [
  "И туган тел, и матур тел, әткәм-әнкәмнең теле! — Габдулла Тукай, «Туган тел» (1909)",
  "Иң элек бу тел белән әнкәм бишектә көйләгән… — Габдулла Тукай, «Туган тел» (1909)",
  "Нәкъ Казан артында бардыр бер авыл — «Кырлай» диләр… — Габдулла Тукай, «Туган авыл»",
  "Шаулый диңгез... Җил өрәдер... Җилкәнен киргән кораб! — Дәрдмәнд, «Кораб»",
  "Җырлап үттем данлы көрәш кырын… — Муса Җәлил, «Җырлап үтәм» (Моабит дәфтәре)",
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

/* ---- Тамга (родовой знак) төеннәр өчен — статик, ышанычлы SVG ----
   Static, trusted SVG; cells only ever carry an index into this array. */
const _tamga = (paths) =>
  `<svg width="26" height="26" viewBox="0 0 24 24" aria-label="тамга" role="img">` +
  `<g fill="none" stroke="#1f8a4c" stroke-width="2" stroke-linecap="round">${paths}</g></svg>`;
const TAMGA = [
  _tamga('<path d="M12 4v14"/><path d="M6 8q6-6 12 0"/><path d="M6 16h12"/>'),
  _tamga('<circle cx="12" cy="12" r="6"/><path d="M12 2v4M12 18v4"/>'),
  _tamga('<path d="M5 6l7 12 7-12"/><path d="M5 18h14"/>'),
  _tamga('<path d="M12 3l8 8-8 8-8-8z"/><path d="M12 8v8"/>'),
];

/* ---- Демо асыллар / fake resources (DEMO mode) ---- */
const ok = (t) => ({ b: "ok", t }), warn = (t) => ({ b: "warn", t }), err = (t) => ({ b: "err", t });
const DEMO = {
  kuzaklar: [
    ["ecpocmak-web-7d9", "gadati", ok("Эшли/Running"), "0", "3 көн 12 сәг"],
    ["cakcak-api-5f2", "gadati", ok("Эшли/Running"), "1", "6 көн 4 сәг"],
    ["kystybyj-cache-0", "kaz", warn("Көтә/Pending"), "0", "34 сек"],
    ["balis-worker-2a", "yshler", ok("Эшли/Running"), "0", "1 көн 2 сәг"],
    ["gubadiya-cron-9", "yshler", err("Егылды/CrashLoopBackOff"), "7", "12 көн"],
  ],
  toennar: [
    [{ tamga: 0 }, "tatar-node-kazan", ok("Әзер/Ready"), "баш идарә/control-plane", "40 көн", "v1.37.1"],
    [{ tamga: 1 }, "tatar-node-cally", ok("Әзер/Ready"), "эшче/worker", "40 көн", "v1.37.1"],
    [{ tamga: 2 }, "tatar-node-alabuga", warn("Әзер/Ready, SchedulingDisabled"), "эшче/worker", "40 көн", "v1.37.1"],
  ],
  hezmatler: [
    ["ecpocmak-web", "gadati", "ClusterIP", "10.96.0.11", "80/TCP", "3 көн"],
    ["cakcak-api", "gadati", "LoadBalancer", "10.96.0.24", "443:31443/TCP", "6 көн"],
    ["capka-ingress", "kaz", "NodePort", "10.96.0.30", "80:31380/TCP", "6 көн"],
  ],
  urnashtyru: [
    ["ecpocmak-web", "gadati", ok("3/3"), "3", "3", "3 көн"],
    ["cakcak-api", "gadati", ok("2/2"), "2", "2", "6 көн"],
    ["gubadiya-cron", "yshler", err("0/1"), "1", "0", "12 көн"],
  ],
  maydannar: [
    ["gadati", ok("Актив/Active"), "40 көн"],
    ["kaz", ok("Актив/Active"), "40 көн"],
    ["yshler", ok("Актив/Active"), "40 көн"],
    ["tatar-tozem", ok("Актив/Active"), "40 көн"],
  ],
  vakygalar: [
    [warn("Кисәтү/Warning"), "BackOff", "pod/gubadiya-cron-9", "yshler", "Back-off restarting failed container", "2 мин"],
    [ok("Гадәти/Normal"), "Scheduled", "pod/kystybyj-cache-0", "kaz", "Successfully assigned kaz/kystybyj-cache-0", "34 сек"],
    [ok("Гадәти/Normal"), "ScalingReplicaSet", "deployment/ecpocmak-web", "gadati", "Scaled up replica set to 3", "3 көн"],
  ],
};

/* ---- Режим / mode: ?api= өстен, аннары config.js; юк икән — демо ---- */
const Q = new URLSearchParams(location.search);
const CFG = window.TATARNETES_UI_CONFIG || {};
const MODE = T.resolveApiBase(Q.get("api"), CFG.api, location.origin);
const NS = Q.get("ns") || CFG.namespace || "";
const POLL_MS = 10000;
let current = "kuzaklar";
let seq = 0;          // соңгы сорау гына күрсәтелә / only the latest request renders
let loadedOnce = {};  // беренче йөкләүдә генә «Йөкләнә…» / spinner on first load only

/* ---- Рендер / render (барлык текст esc() аша / every string goes through esc) ---- */
function cellHtml(c) {
  if (c && typeof c === "object" && Number.isInteger(c.tamga))
    return `<td class="tamga-cell">${TAMGA[c.tamga % TAMGA.length]}</td>`;
  if (c && typeof c === "object" && c.b)
    return `<td><span class="badge ${T.esc(c.b)}">${T.esc(c.t)}</span></td>`;
  return `<td>${T.esc(c)}</td>`;
}
function renderHead(key) {
  const v = T.VIEWS[key];
  document.getElementById("view-title").textContent = v.title;
  let cmd = `ayda күрсәт ${v.noun}`;
  if (MODE.mode === "live" && v.namespaced) cmd += NS ? ` -n ${NS}` : " -A";
  document.getElementById("cmd-hint").textContent = cmd;
  document.getElementById("grid-head").innerHTML =
    "<tr>" + v.head.map((h) => `<th>${T.esc(h)}</th>`).join("") + "</tr>";
}
function renderRows(rows) {
  document.getElementById("grid-body").innerHTML =
    rows.map((r) => "<tr>" + r.map(cellHtml).join("") + "</tr>").join("");
}
// Буш/йөкләнү/хата хәле — бер юл / one full-width state row.
function renderState(kind, text, detail) {
  const cols = T.VIEWS[current].head.length;
  const d = detail ? `<div class="state-detail">${T.esc(detail)}</div>` : "";
  document.getElementById("grid-body").innerHTML =
    `<tr><td colspan="${cols}" class="state state-${T.esc(kind)}" role="status">` +
    `${T.esc(text)}${d}</td></tr>`;
  setMood(kind === "error" ? "angry" : kind === "tea" ? "tea" : null);
}

function setMood(m) {
  const mf = document.getElementById("mood-face");
  if (m === "tea") { mf.src = "assets/face-tea.svg"; mf.alt = "Түбәтәйле йөз чәй эчә"; }
  else if (m === "angry") { mf.src = "assets/face-angry.svg"; mf.alt = "Түбәтәйле ачулы йөз"; }
  else { mf.src = "assets/face-happy.svg"; mf.alt = "Түбәтәйле шат йөз"; }
}

/* ---- Җанлы мәгълүмат / live data via kubectl proxy (same-origin, no token) ---- */
async function fetchList(key) {
  const v = T.VIEWS[key];
  let res;
  try {
    res = await fetch(MODE.base + v.path(NS), {
      headers: { Accept: "application/json" }, credentials: "omit", cache: "no-store",
    });
  } catch (e) { throw { kind: "conn", detail: String(e && e.message || e) }; }
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json()).message || ""; } catch (e) { /* not JSON */ }
    throw { status: res.status, detail };
  }
  try { return await res.json(); } catch (e) { throw { kind: "parse", detail: String(e.message || e) }; }
}

async function loadView(key, announce) {
  const my = ++seq;
  renderHead(key);
  if (MODE.mode === "error") { renderState("error", T.MSG[MODE.reason]); return; }
  if (MODE.mode === "demo") {
    renderRows(DEMO[key]);
    if (announce) {
      if (Math.random() < 0.75) toast(true, `«${T.VIEWS[key].title}» ачылды. ${pick(FOODS)}`);
      else toast(false, "Мәйдан табылмады, тагын кара. (демо)");
    }
    return;
  }
  if (T.teaState(new Date()).onBreak && !Q.has("notea")) { renderState("tea", T.MSG.tea); return; }
  if (!loadedOnce[key]) renderState("loading", T.MSG.loading);
  try {
    const list = await fetchList(key);
    if (my !== seq) return;
    const rows = T.mapList(key, list, Date.now(), TAMGA.length);
    loadedOnce[key] = true;
    if (!rows.length) renderState("empty", T.MSG.empty);
    else { renderRows(rows); setMood(null); }
    if (announce) toast(true, `«${T.VIEWS[key].title}»: ${rows.length}`);
  } catch (e) {
    if (my !== seq) return;
    loadedOnce[key] = false;
    const msg = e instanceof Error ? T.MSG.parse : T.errorMessage(e);
    renderState("error", msg, e && e.detail);
    if (announce) toast(false, msg);
  }
}

/* ---- Хәбәрләр / toasts ---- */
function toast(good, text) {
  const wrap = document.getElementById("toast-wrap");
  const el = document.createElement("div");
  el.className = "toast" + (good ? "" : " bad");
  const face = good ? "assets/face-happy.svg" : "assets/face-angry.svg";
  const word = good ? pick(PRAISE) : pick(CURSES);
  el.innerHTML = `<img src="${face}" alt=""><div><b>${T.esc(word)}</b><br>${T.esc(text)}</div>`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}

/* ---- Чәй тәрәзәсе / tea gate (lib/teatime.sh белән бер график) ---- */
let wasOnBreak = false;
function checkTea() {
  // Демо-өстенлекләр / overrides: ?tea=1 мәҗбүри, ?notea=1 сүндерә.
  let st = T.teaState(new Date());
  if (Q.has("tea")) st = { onBreak: true, left: T.TEA_BREAK_MIN };
  if (Q.has("notea")) st = { onBreak: false, left: 0 };
  const ov = document.getElementById("tea-overlay");
  if (st.onBreak) {
    document.getElementById("tea-left").textContent = st.left;
    ov.hidden = false;
    setMood("tea");
  } else {
    ov.hidden = true;
    if (wasOnBreak) loadView(current, false);   // тәнәфестән соң яңарту / refresh after tea
    else if (document.getElementById("mood-face").src.indexOf("face-tea") >= 0) setMood(null);
  }
  wasOnBreak = st.onBreak;
}

/* ---- Тасма / ticker ---- */
function spinTicker() {
  document.getElementById("ticker-text").textContent =
    Math.random() < 0.5 ? pick(POETRY) : pick(FOODS);
}

/* ---- Режим билгесе / mode badge ---- */
function showMode() {
  const badge = document.getElementById("mode-badge");
  const name = document.getElementById("cluster-name");
  if (MODE.mode === "live") {
    badge.textContent = "ҖАНЛЫ · LIVE";
    badge.className = "mode-badge live";
    name.textContent = `төркем: ${location.host}${MODE.base || "/"}` + (NS ? ` · мәйдан: ${NS}` : "");
  } else if (MODE.mode === "error") {
    badge.textContent = "ХАТА · ERROR";
    badge.className = "mode-badge bad";
    name.textContent = "төркем: —";
  } else {
    badge.textContent = "ДЕМО · DEMO";
    badge.className = "mode-badge";
    name.textContent = "төркем: tatar-cluster-1 (демо)";
  }
}

/* ---- Башлау / init ---- */
function selectView(li, announce) {
  document.querySelectorAll(".side li").forEach((x) => {
    x.classList.remove("active");
    x.setAttribute("aria-selected", "false");
  });
  li.classList.add("active");
  li.setAttribute("aria-selected", "true");
  current = li.dataset.view;
  loadView(current, announce);
}
document.querySelectorAll(".side li").forEach((li) => {
  li.addEventListener("click", () => selectView(li, true));
  li.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectView(li, true); }
  });
});

showMode();
checkTea();
// Башлангыч күренеш ?view= аша / initial view via ?view= (deep-link).
(function initView() {
  const want = Q.get("view");
  const li = (want && T.VIEWS[want] && document.querySelector(`.side li[data-view="${want}"]`)) ||
    document.querySelector('.side li[data-view="kuzaklar"]');
  selectView(li, false);
})();
spinTicker();
setInterval(spinTicker, 26000);
setInterval(checkTea, 15000);
if (MODE.mode === "live") {
  setInterval(() => { if (!document.hidden) loadView(current, false); }, POLL_MS);
}
