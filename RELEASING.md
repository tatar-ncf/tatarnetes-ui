# Релиз циклы / Release cycle — Tatarnetes UI

*Татарча беренче, аннары инглизчә.*

## Татарча

Tatarnetes UI — **Kubernetes Dashboard өстендәге милли катлам**. Релиз циклы
Dashboard'ның **тотрыклы (stable)** чыгарылышларына бәйле.

- **Версия схемасы:** `v<DASHBOARD>-tatar.<N>` (мәс. `v7.10.0-tatar.1`).
- **Тотрыклы гына** — alpha/beta/rc алмыйбыз.
- **N-1** — соңгы ике минор.
- `upstream-watch.yml` атна саен `kubernetes/dashboard` соңгы релизын тикшерә.
- Тег `vX.Y.Z-tatar.N` → `release.yml` архив ясый.
- Dashboard 7.x'тан башлап апстрим тегы Helm чарты исеме белән:
  `kubernetes-dashboard-7.14.0`. `.upstream-version`та ул **шул көе** саклана
  (`upstream-watch` аны турыдан-туры чагыштыра), ә безнең тег — `v7.14.0-tatar.N`.

### Хәзерге апстрим

| | |
|---|---|
| Апстрим | Kubernetes Dashboard **kubernetes-dashboard-7.14.0** (`.upstream-version`) |
| Киләсе тег | `v7.14.0-tatar.0` |
| Kubernetes API | җанлы режим турыдан-туры core/apps API'ларын укый (`/api/v1`, `/apis/apps/v1`); Kubernetes 1.36 (kind) белән сыналды, `ayda` — 1.37 |

**Мөһим:** `kubernetes/dashboard` репозиториесе архивланды (соңгы push — 2026 ел гыйнвары),
7.14.0 — соңгы релиз; апстрим Headlamp'ны тәкъдим итә. Яңа Dashboard релизлары
булмаячак, `upstream-watch` моннан соң issue ачмаячак. Панель Dashboard кодын
кулланмый (үз статик UI + `kubectl proxy`), шуңа бу аңа тәэсир итми.

## English

Tatarnetes UI is a **national layer over the Kubernetes Dashboard**; it tracks
Dashboard **stable** releases. Version scheme `v<DASHBOARD>-tatar.<N>`
(e.g. `v7.10.0-tatar.1`). Stable-only, N-1 minors. `upstream-watch.yml` checks
`kubernetes/dashboard` weekly; tagging triggers `release.yml`.

Since Dashboard 7.x the upstream tag is the Helm chart name, e.g.
`kubernetes-dashboard-7.14.0`. `.upstream-version` stores it **verbatim** (the
watch compares it as-is); our tag is `v7.14.0-tatar.N`.

**Current upstream:** kubernetes-dashboard-7.14.0 → next tag `v7.14.0-tatar.0`.
Live mode reads the core/apps APIs directly (`/api/v1`, `/apis/apps/v1`); tested
against Kubernetes 1.36 (kind) and alongside `ayda` on kubectl 1.37.

**Note:** the `kubernetes/dashboard` repository is archived (last push in January 2026);
7.14.0 is its final release and upstream recommends Headlamp. No further
Dashboard releases will come, so `upstream-watch` will not open new issues. The
panel does not use Dashboard code (its own static UI over `kubectl proxy`), so
this does not affect it.
