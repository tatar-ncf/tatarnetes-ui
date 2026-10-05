// lib.test.js — Татарнетес UI логикасы сынаулары / unit tests for lib.js (node --test).
"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const T = require("../lib.js");

const NOW = Date.parse("2026-10-05T12:00:00Z");
const ago = (sec) => new Date(NOW - sec * 1000).toISOString();

test("tea windows equal the CLI formula (lib/teatime.sh, bash arithmetic)", () => {
  for (const day of ["2026-01-01", "2026-09-19", "2026-10-05", "2027-02-28"]) {
    const [y, m, d] = day.split("-").map(Number);
    const js = T.teaWindowsFor(new Date(y, m - 1, d));
    // Шул ук исәп bash'та — CLI'ның үз формуласы / the very same formula in bash.
    const sh = execFileSync("bash", ["-c",
      `seed=$((10#${day.replace(/-/g, "")})); for i in 1 2 3; do echo $(( (seed*(i*37+13)+i*101) % 1440 )); done`])
      .toString().trim().split("\n").map(Number);
    assert.deepEqual(js.map((w) => w[0]), sh, day);
    assert.ok(js.every((w) => w[1] === 7));
  }
});

test("teaState inside and outside a window", () => {
  const d = new Date(2026, 9, 5);
  const [s] = T.teaWindowsFor(d)[0];
  const at = (min) => new Date(2026, 9, 5, Math.floor(min / 60), min % 60);
  assert.deepEqual(T.teaState(at(s)), { onBreak: true, left: 7 });
  if (s + 7 < 1440) assert.deepEqual(T.teaState(at(s + 7)), { onBreak: false, left: 0 });
});

test("API base: same-origin only, demo when unset", () => {
  const o = "http://127.0.0.1:8001";
  assert.deepEqual(T.resolveApiBase(null, "", o), { mode: "demo" });
  assert.deepEqual(T.resolveApiBase("", undefined, o), { mode: "demo" });
  assert.deepEqual(T.resolveApiBase("http://127.0.0.1:8001", "", o), { mode: "live", base: "" });
  assert.deepEqual(T.resolveApiBase("/", "", o), { mode: "live", base: "" });
  assert.deepEqual(T.resolveApiBase(null, "/k8s/", o), { mode: "live", base: "/k8s" });
  assert.equal(T.resolveApiBase("http://localhost:8001", "", o).reason, "crossorigin");
  assert.equal(T.resolveApiBase("https://evil.example/", "", o).reason, "crossorigin");
  assert.equal(T.resolveApiBase("javascript:alert(1)", "", o).reason, "badurl");
  assert.equal(T.resolveApiBase("/?token=x", "", o).reason, "badurl");
  assert.equal(T.resolveApiBase("http://u:p@127.0.0.1:8001/", "", o).reason, "badurl");
});

test("age in Tatar units", () => {
  assert.equal(T.age(ago(40), NOW), "40 сек");
  assert.equal(T.age(ago(300), NOW), "5 мин");
  assert.equal(T.age(ago(3 * 3600 + 120), NOW), "3 сәг 2 мин");
  assert.equal(T.age(ago(3 * 86400 + 12 * 3600), NOW), "3 көн 12 сәг");
  assert.equal(T.age(ago(40 * 86400), NOW), "40 көн");
  assert.equal(T.age(undefined, NOW), "—");
});

test("pods map to Tatar statuses", () => {
  const list = { items: [
    { metadata: { name: "a", namespace: "n", creationTimestamp: ago(60) },
      status: { phase: "Running", containerStatuses: [{ restartCount: 2 }, { restartCount: 1 }] } },
    { metadata: { name: "b", namespace: "n", creationTimestamp: ago(60) },
      status: { phase: "Running", containerStatuses: [{ restartCount: 9, state: { waiting: { reason: "CrashLoopBackOff" } } }] } },
    { metadata: { name: "c", namespace: "n", creationTimestamp: ago(60) },
      status: { phase: "Pending", containerStatuses: [{ state: { waiting: { reason: "ImagePullBackOff" } } }] } },
    { metadata: { name: "d", namespace: "n", creationTimestamp: ago(60), deletionTimestamp: ago(1) },
      status: { phase: "Running" } },
    { metadata: { name: "e", namespace: "n" }, status: { phase: "Succeeded" } },
  ] };
  const rows = T.mapList("kuzaklar", list, NOW);
  assert.deepEqual(rows[0], ["a", "n", { b: "ok", t: "Эшли/Running" }, "3", "1 мин"]);
  assert.deepEqual(rows[1][2], { b: "err", t: "Егылды/CrashLoopBackOff" });
  assert.deepEqual(rows[2][2], { b: "err", t: "Хата/ImagePullBackOff" });
  assert.deepEqual(rows[3][2], { b: "warn", t: "Бетерелә/Terminating" });
  assert.deepEqual(rows[4][2], { b: "ok", t: "Тәмамланды/Succeeded" });
});

test("nodes: readiness, roles, tamga index, version", () => {
  const n = (name, ready, labels, unsched) => ({
    metadata: { name, labels, creationTimestamp: ago(86400) },
    spec: { unschedulable: unsched },
    status: { conditions: [{ type: "Ready", status: ready }], nodeInfo: { kubeletVersion: "v1.37.1" } },
  });
  const rows = T.mapList("toennar", { items: [
    n("cp", "True", { "node-role.kubernetes.io/control-plane": "" }),
    n("w", "False", {}),
    n("w2", "True", {}, true),
  ] }, NOW, 4);
  assert.ok(Number.isInteger(rows[0][0].tamga) && rows[0][0].tamga < 4);
  assert.deepEqual(rows[0][2], { b: "ok", t: "Әзер/Ready" });
  assert.equal(rows[0][3], "баш идарә/control-plane");
  assert.deepEqual(rows[1][2], { b: "err", t: "Әзер түгел/NotReady" });
  assert.equal(rows[1][3], "—");
  assert.equal(rows[2][2].b, "warn");
  assert.equal(rows[0][5], "v1.37.1");
  assert.equal(T.tamgaIndex("cp", 4), T.tamgaIndex("cp", 4));
});

test("services, deployments, namespaces, events", () => {
  const svc = T.mapList("hezmatler", { items: [{ metadata: { name: "s", namespace: "n" },
    spec: { type: "NodePort", clusterIP: "10.0.0.1", ports: [{ port: 80, nodePort: 30080, protocol: "TCP" }] } }] }, NOW);
  assert.deepEqual(svc[0].slice(0, 5), ["s", "n", "NodePort", "10.0.0.1", "80:30080/TCP"]);
  const dep = T.mapList("urnashtyru", { items: [
    { metadata: { name: "ok" }, spec: { replicas: 2 }, status: { readyReplicas: 2, updatedReplicas: 2, availableReplicas: 2 } },
    { metadata: { name: "down" }, spec: { replicas: 1 }, status: {} },
    { metadata: { name: "half" }, spec: { replicas: 3 }, status: { readyReplicas: 1 } },
  ] }, NOW);
  assert.deepEqual(dep.map((r) => r[2].b), ["ok", "err", "warn"]);
  assert.equal(dep[1][2].t, "0/1");
  const ns = T.mapList("maydannar", { items: [{ metadata: { name: "x" }, status: { phase: "Terminating" } }] }, NOW);
  assert.deepEqual(ns[0][1], { b: "warn", t: "Бетерелә/Terminating" });
  const ev = T.mapList("vakygalar", { items: [
    { metadata: { namespace: "n" }, type: "Normal", reason: "Old", involvedObject: { kind: "Pod", name: "p" }, lastTimestamp: ago(500), message: "m1" },
    { metadata: { namespace: "n" }, type: "Warning", reason: "New", involvedObject: { kind: "Pod", name: "p" }, lastTimestamp: ago(5), message: "m2" },
  ] }, NOW);
  assert.equal(ev[0][1], "New");
  assert.deepEqual(ev[0][0], { b: "warn", t: "Кисәтү/Warning" });
  assert.equal(ev[0][2], "pod/p");
});

test("XSS: hostile names stay text after esc()", () => {
  const rows = T.mapList("kuzaklar", { items: [{ metadata: { name: "<img src=x onerror=alert(1)>", namespace: "\"'&" }, status: { phase: "Running" } }] }, NOW);
  assert.equal(T.esc(rows[0][0]), "&lt;img src=x onerror=alert(1)&gt;");
  assert.equal(T.esc(rows[0][1]), "&quot;&#39;&amp;");
  // API'дан SVG/HTML объект ясалмый / API data never produces markup objects
  assert.ok(rows[0].every((c) => typeof c === "string" || (c && c.b && !c.svg)));
});

test("errors are translated, Tatar first", () => {
  assert.match(T.errorMessage({ status: 403 }), /^Рөхсәт юк/);
  assert.match(T.errorMessage({ status: 404 }), /^Мондый API юк/);
  assert.match(T.errorMessage({ status: 500 }), /HTTP 500/);
  assert.match(T.errorMessage({ kind: "conn" }), /kubectl proxy/);
  assert.match(T.errorMessage({ kind: "parse" }), /^Кластер җавабын/);
  assert.throws(() => T.mapList("kuzaklar", { kind: "Status" }, NOW));
});
