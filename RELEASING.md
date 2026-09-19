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

## English

Tatarnetes UI is a **national layer over the Kubernetes Dashboard**; it tracks
Dashboard **stable** releases. Version scheme `v<DASHBOARD>-tatar.<N>`
(e.g. `v7.10.0-tatar.1`). Stable-only, N-1 minors. `upstream-watch.yml` checks
`kubernetes/dashboard` weekly; tagging triggers `release.yml`.
