/* Татарнетес UI — саф логика (DOMсыз): чәй графигы, API адресы, Kubernetes
   объектларын татар күренешләренә күчерү. Браузерда window.TatarUI, Node'та
   module.exports — шуңа CI'да сынала.
   Pure logic (no DOM): tea schedule, API-base validation, and the mapping of
   Kubernetes objects into the Tatar views. window.TatarUI in the browser,
   module.exports in Node, so CI can test it. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TatarUI = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---- Чәй тәнәфесе графигы (lib/teatime.sh белән бер үк) ----
     Deterministic tea windows from the local calendar day — identical to the
     CLI (`ayda чәй`): seed = YYYYMMDD, start_i = (seed*(37i+13) + 101i) mod 1440. */
  const TEA_BREAKS_PER_DAY = 3;
  const TEA_BREAK_MIN = 7;
  function teaWindowsFor(date) {
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const out = [];
    for (let i = 1; i <= TEA_BREAKS_PER_DAY; i++) {
      out.push([(seed * (i * 37 + 13) + i * 101) % 1440, TEA_BREAK_MIN]);
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

  /* ---- HTML-экранлау / escape untrusted text before it touches innerHTML ---- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  /* ---- API адресы / API base ----
     Бары шул ук чыганак (same-origin): kubectl proxy UI'ны да, API'ны да бер
     адрестан бирә, браузерда токен юк. Башка чыганак — кире кагыла.
     Same-origin only: kubectl proxy serves both the UI and the API, so the
     browser never holds a token. Anything cross-origin is refused.
     Returns {mode:"demo"} | {mode:"live", base} | {mode:"error", reason}. */
  function resolveApiBase(param, configured, origin) {
    const raw = (param !== null && param !== undefined && param !== "") ? param
      : (configured || "");
    if (!raw) return { mode: "demo" };
    let u;
    try { u = new URL(raw, origin + "/"); } catch (e) { return { mode: "error", reason: "badurl" }; }
    if (u.protocol !== "http:" && u.protocol !== "https:") return { mode: "error", reason: "badurl" };
    if (u.origin !== origin) return { mode: "error", reason: "crossorigin" };
    if (u.search || u.hash || u.username || u.password) return { mode: "error", reason: "badurl" };
    return { mode: "live", base: u.pathname.replace(/\/+$/, "") };
  }

  /* ---- Яшь / age, kubectl кебек ике берәмлек / two units like kubectl ---- */
  function age(ts, now) {
    const t = Date.parse(ts || "");
    if (!isFinite(t)) return "—";
    let s = Math.max(0, Math.floor(((now || Date.now()) - t) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60); s -= m * 60;
    if (d > 0) return h > 0 && d < 10 ? `${d} көн ${h} сәг` : `${d} көн`;
    if (h > 0) return m > 0 ? `${h} сәг ${m} мин` : `${h} сәг`;
    if (m > 0) return `${m} мин`;
    return `${s} сек`;
  }

  const ok = (t) => ({ b: "ok", t });
  const warn = (t) => ({ b: "warn", t });
  const err = (t) => ({ b: "err", t });

  /* ---- Хәлләр / statuses (татарча + чын исем / Tatar + the real name) ---- */
  function podStatus(p) {
    const st = p.status || {};
    if (p.metadata && p.metadata.deletionTimestamp) return warn("Бетерелә/Terminating");
    for (const cs of st.containerStatuses || []) {
      const w = cs.state && cs.state.waiting;
      if (w && w.reason) {
        if (w.reason === "CrashLoopBackOff") return err("Егылды/CrashLoopBackOff");
        if (w.reason === "ContainerCreating" || w.reason === "PodInitializing")
          return warn(`Төзелә/${w.reason}`);
        return err(`Хата/${w.reason}`);
      }
    }
    switch (st.phase) {
      case "Running": return ok("Эшли/Running");
      case "Pending": return warn("Көтә/Pending");
      case "Succeeded": return ok("Тәмамланды/Succeeded");
      case "Failed": return err("Уңышсыз/Failed");
      default: return warn(`Билгесез/${st.phase || "Unknown"}`);
    }
  }
  function nodeStatus(n) {
    const c = ((n.status || {}).conditions || []).find((x) => x.type === "Ready");
    if (!c || c.status !== "True") return err("Әзер түгел/NotReady");
    if (n.spec && n.spec.unschedulable) return warn("Әзер/Ready, SchedulingDisabled");
    return ok("Әзер/Ready");
  }
  function nodeRoles(n) {
    const labels = (n.metadata && n.metadata.labels) || {};
    const roles = Object.keys(labels)
      .filter((k) => k.indexOf("node-role.kubernetes.io/") === 0)
      .map((k) => k.slice("node-role.kubernetes.io/".length))
      .map((r) => (r === "control-plane" ? "баш идарә/control-plane"
        : r === "worker" ? "эшче/worker" : r));
    return roles.length ? roles.join(", ") : "—";
  }
  // Тамга — исемнән тотрыклы сайлау / stable tamga pick from the node name.
  function tamgaIndex(name, n) {
    let h = 0;
    for (const ch of String(name)) h = (h * 31 + ch.codePointAt(0)) >>> 0;
    return h % n;
  }
  function ports(svc) {
    const ps = (svc.spec && svc.spec.ports) || [];
    if (!ps.length) return "—";
    return ps.map((p) => `${p.port}${p.nodePort ? ":" + p.nodePort : ""}/${p.protocol || "TCP"}`).join(", ");
  }
  function evTime(e) {
    return e.lastTimestamp || e.eventTime || (e.series && e.series.lastObservedTime) ||
      e.firstTimestamp || (e.metadata && e.metadata.creationTimestamp);
  }

  /* ---- Күренешләр / views: API юлы + татар баганалары ----
     Each view: Kubernetes list path (namespaced or cluster-wide) and a row mapper.
     Cells are strings, badges {b,t} or {tamga:i}; app.js escapes every string. */
  const md = (o) => o.metadata || {};
  const VIEWS = {
    kuzaklar: {
      title: "Кузаклар / Pods", noun: "кузаклар", namespaced: true,
      path: (ns) => ns ? `/api/v1/namespaces/${encodeURIComponent(ns)}/pods` : "/api/v1/pods",
      head: ["ИСЕМ / NAME", "МӘЙДАН / NS", "ХӘЛ / STATUS", "ЯҢАРУ / RESTARTS", "ЯШЬ / AGE"],
      row: (p, now) => [md(p).name, md(p).namespace, podStatus(p),
        String(((p.status || {}).containerStatuses || []).reduce((a, c) => a + (c.restartCount || 0), 0)),
        age(md(p).creationTimestamp, now)],
    },
    toennar: {
      title: "Төеннәр / Nodes", noun: "төеннәр", namespaced: false,
      path: () => "/api/v1/nodes",
      head: ["ТАМГА", "ИСЕМ / NAME", "ХӘЛ / STATUS", "РОЛЬ / ROLES", "ЯШЬ / AGE", "ВЕРСИЯ / VERSION"],
      row: (n, now, tamgas) => [{ tamga: tamgaIndex(md(n).name, tamgas) }, md(n).name, nodeStatus(n),
        nodeRoles(n), age(md(n).creationTimestamp, now),
        ((n.status || {}).nodeInfo || {}).kubeletVersion || "—"],
    },
    hezmatler: {
      title: "Хезмәтләр / Services", noun: "хезмәтләр", namespaced: true,
      path: (ns) => ns ? `/api/v1/namespaces/${encodeURIComponent(ns)}/services` : "/api/v1/services",
      head: ["ИСЕМ / NAME", "МӘЙДАН / NS", "ТӨР / TYPE", "CLUSTER-IP", "ПОРТ / PORTS", "ЯШЬ / AGE"],
      row: (s, now) => [md(s).name, md(s).namespace, (s.spec || {}).type || "—",
        (s.spec || {}).clusterIP || "—", ports(s), age(md(s).creationTimestamp, now)],
    },
    urnashtyru: {
      title: "Урнаштырулар / Deployments", noun: "урнаштырулар", namespaced: true,
      path: (ns) => ns ? `/apis/apps/v1/namespaces/${encodeURIComponent(ns)}/deployments`
        : "/apis/apps/v1/deployments",
      head: ["ИСЕМ / NAME", "МӘЙДАН / NS", "ӘЗЕР / READY", "ЯҢАРТЫЛГАН / UP-TO-DATE",
        "БАР / AVAILABLE", "ЯШЬ / AGE"],
      row: (d, now) => {
        const want = (d.spec || {}).replicas === undefined ? 1 : d.spec.replicas;
        const st = d.status || {};
        const ready = st.readyReplicas || 0;
        const txt = `${ready}/${want}`;
        const badge = ready === want ? ok(txt) : ready === 0 ? err(txt) : warn(txt);
        return [md(d).name, md(d).namespace, badge, String(st.updatedReplicas || 0),
          String(st.availableReplicas || 0), age(md(d).creationTimestamp, now)];
      },
    },
    maydannar: {
      title: "Мәйданнар / Namespaces", noun: "мәйданнар", namespaced: false,
      path: () => "/api/v1/namespaces",
      head: ["ИСЕМ / NAME", "ХӘЛ / STATUS", "ЯШЬ / AGE"],
      row: (n, now) => [md(n).name,
        ((n.status || {}).phase === "Terminating") ? warn("Бетерелә/Terminating") : ok("Актив/Active"),
        age(md(n).creationTimestamp, now)],
    },
    vakygalar: {
      title: "Вакыйгалар / Events", noun: "вакыйгалар", namespaced: true,
      path: (ns) => ns ? `/api/v1/namespaces/${encodeURIComponent(ns)}/events` : "/api/v1/events",
      head: ["ТӨР / TYPE", "СӘБӘП / REASON", "ОБЪЕКТ / OBJECT", "МӘЙДАН / NS", "ХӘБӘР / MESSAGE", "ЯШЬ / AGE"],
      sort: (a, b) => (Date.parse(evTime(b) || 0) || 0) - (Date.parse(evTime(a) || 0) || 0),
      limit: 50,
      row: (e, now) => {
        const io = e.involvedObject || e.regarding || {};
        return [e.type === "Warning" ? warn("Кисәтү/Warning") : ok("Гадәти/Normal"),
          e.reason || "—", `${(io.kind || "").toLowerCase()}/${io.name || "?"}`,
          md(e).namespace || "—", e.message || e.note || "", age(evTime(e), now)];
      },
    },
  };

  // mapList VIEWKEY LISTJSON — Kubernetes List → татар юллары / rows for a view.
  function mapList(key, list, now, tamgas) {
    const v = VIEWS[key];
    if (!list || !Array.isArray(list.items)) throw new Error("not a Kubernetes List");
    let items = list.items.slice();
    if (v.sort) items.sort(v.sort);
    if (v.limit) items = items.slice(0, v.limit);
    return items.map((o) => v.row(o, now, tamgas || 4));
  }

  /* ---- Хаталар / errors → татарча + инглизчә / Tatar first, then English ---- */
  const MSG = {
    loading: "Йөкләнә… / Loading…",
    empty: "Буш — бер генә дә юк. / Empty — nothing here.",
    conn: "Кластерга тоташып булмады — kubectl proxy эшлиме? / Could not reach the cluster — is kubectl proxy running?",
    forbidden: "Рөхсәт юк — хокукларыңны (RBAC) тикшер. / Forbidden — check your RBAC permissions.",
    notfound: "Мондый API юк — кластер версиясен тикшер. / No such API — check the cluster version.",
    http: "Кластер хата кайтарды (HTTP %s). / The cluster returned HTTP %s.",
    parse: "Кластер җавабын укып булмады. / Could not read the cluster response.",
    crossorigin: "API адресы бу биттән башка чыганакта — рөхсәт ителми (токеннар браузерга чыкмасын). UI'ны kubectl proxy аша ач. / The API must be same-origin, so no token reaches the browser — serve the UI through kubectl proxy.",
    badurl: "API адресы дөрес түгел. / The API address is not valid.",
    tea: "Кластер чәй эчә — тәнәфестән соң яңартабыз. / The cluster is having tea — we will refresh after the break.",
  };
  function errorMessage(e) {
    if (e && e.status === 403) return MSG.forbidden;
    if (e && e.status === 404) return MSG.notfound;
    if (e && e.status) return MSG.http.replace(/%s/g, String(e.status));
    if (e && e.kind === "parse") return MSG.parse;
    return MSG.conn;
  }

  return { TEA_BREAKS_PER_DAY, TEA_BREAK_MIN, teaWindowsFor, teaState, esc, resolveApiBase,
    age, podStatus, nodeStatus, nodeRoles, tamgaIndex, VIEWS, mapList, MSG, errorMessage };
});
