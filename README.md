<div align="center">

<img src="assets/tatarnetes-logo.png" width="150" alt="Tatarnetes UI logo" />

# Татарнетес Идарә Панеле / Tatarnetes UI

**Милли идарә панеле · A national dashboard for Tatarnetes**

*Kubernetes Dashboard'ның татарча варианты — татар келәме фонында, түбәтәйле.*
*A Tatar edition of the Kubernetes Dashboard — on a carpet, in a skullcap.*

[![License: Tatarch 2.0](https://img.shields.io/badge/License-Tatarch%202.0-1f8a4c)](LICENSE)

[Татарча](#татарча) · [English](#english)

</div>

---

## Татарча

**Татарнетес Идарә Панеле** — Kubernetes Dashboard нигезендәге милли веб-панель.
Барлык интерфейс татарча: асыллар милли атамалар белән (кузаклар, төеннәр,
хезмәтләр, мәйданнар), фон — татар келәме, төсләр — Татарстан флагы (яшел-ак-кызыл)
плюс алтын. Өстә — түбәтәйле йөз: эш барса — шат, хата булса — ачулы.

### Үзенчәлекләр

- 🟢 Татар палитрасы + келәм фоны (`assets/carpet.svg`)
- 🥟 Тукай юллары һәм ризыклар йөгерүче тасмада
- 😊 Түбәтәйле йөз: шат / ачулы / чәй
- 🍵 **Чәй тәнәфесе** — консоль (`ayda`) белән бер үк график; тәнәфестә панель
  ябыла һәм кыстыбый-чәй экраны чыга
- 📊 Демо мәгълүматлар (backend кирәкми) — өчпочмак, чәкчәк, бәлеш подлары :)

### Җибәрү

```bash
git clone https://github.com/tatar-ncf/tatarnetes-ui.git
cd tatarnetes-ui
python3 -m http.server 8080      # http://localhost:8080
```

Backend кирәкми — демо режимда эшли (өчпочмак, чәкчәк, бәлеш подлары :).
Чын кластерга тоташтыру планлаштырыла. / Real-cluster wiring is planned.

## English

**Tatarnetes UI** is a national web dashboard based on the Kubernetes Dashboard.
The entire interface is in Tatar: resources use national names (кузаклар/pods,
төеннәр/nodes, хезмәтләр/services, мәйданнар/namespaces), the background is a
Tatar carpet, and the palette is the Tatarstan flag (green-white-red) plus gold.
A skullcap face watches from the top — happy on success, angry on error.

The tea-break schedule is shared with the CLI (`ayda`): during tea the panel
locks and shows a kыstybyй-and-tea screen. Runs in demo mode — no backend
required.

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

---

## Гаилә / Family

- 🐘 [tatarnetes](https://github.com/tatar-ncf/tatarnetes) — милли Kubernetes
- 🖥 **tatarnetes-ui** — идарә панеле (бу репо)
- 🐧 [tataros](https://github.com/tatar-ncf/tataros) — милли Talos

[**Tatar-Native Computing Foundation**](https://github.com/tatar-ncf) · Tatarch License 2.0

<div align="center">

**Рәхмәт яугыры! Татарстан алга!** 🟢⚪🔴

</div>
