<div align="center">

<img src="assets/tatarnetes-logo.png" width="150" alt="Tatarnetes UI logo" />

# Татарнетес Идарә Панеле / Tatarnetes UI

**Милли идарә панеле · A national dashboard for Tatarnetes**

*Kubernetes Dashboard'ның татарча варианты — татар келәме фонында, түбәтәйле.*
*A Tatar edition of the Kubernetes Dashboard — on a carpet, in a skullcap.*

[![License: Tatarch 2.0](https://img.shields.io/badge/License-Tatarch%202.0-1f8a4c)](LICENSE)

[Татарча](#татарча) · [English](#english)

<img src="docs/media/ui-tour.gif" width="640" alt="Tatarnetes UI tour" />

</div>

> **Headlamp плагины / Headlamp plugin:** Kubernetes Dashboard архивланды, апстрим
> Headlamp'ны тәкъдим итә. Татар тәҗрибәсе хәзер [`headlamp-plugin/`](#headlamp-плагины)
> эчендә; Dashboard нигезендәге панель **7.14.0'да туктатылды** (эшли, ләкин яңармый).
> The Kubernetes Dashboard is archived and upstream recommends Headlamp: the Tatar
> experience now lives in [`headlamp-plugin/`](#headlamp-plugin); the Dashboard-based
> panel is **frozen at 7.14.0** (it works, it is no longer developed).

> Күренешләр: [дашборд](docs/media/dashboard.png) ·
> [төеннәр + тамга](docs/media/nodes-tamga.png) ·
> [чәй тәнәфесе + шамаиль](docs/media/tea-shamail.png) ·
> җанлы режим / live: [кузаклар](docs/media/live-pods.png) ·
> [вакыйгалар](docs/media/live-events.png) · [буш](docs/media/live-empty.png) ·
> [рөхсәт юк](docs/media/live-forbidden.png)

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
- 📊 Ике режим: **демо** (ялган мәгълүмат, гадәттә) һәм **җанлы** — чын кластер
  `kubectl proxy` аша (кузаклар, төеннәр, хезмәтләр, урнаштырулар, мәйданнар,
  вакыйгалар)

### Җибәрү — демо

```bash
git clone https://github.com/tatar-ncf/tatarnetes-ui.git
cd tatarnetes-ui
python3 -m http.server 8080      # http://localhost:8080
```

### Җибәрү — җанлы кластер

UI'ны һәм API'ны **бер үк адрестан** `kubectl proxy` бирә — браузерда бер
генә токен дә юк, хокуклар — синең kubeconfig'ыңныкы:

```bash
kubectl proxy --port=8001 --www=/path/to/tatarnetes-ui --www-prefix=/ui/
# браузерда / open:
#   http://127.0.0.1:8001/ui/?api=/                 барлык мәйданнар
#   http://127.0.0.1:8001/ui/?api=/&ns=gadati       бер мәйдан
```

- `?api=` (яки `config.js`'та `api`) булмаса — демо режим.
- API адресы бары **шул ук чыганакта** (same-origin) кабул ителә; башка адрес —
  хата белән кире кагыла. CSP да бары `'self'`ка рөхсәт бирә.
- Йөкләнү, буш исемлек, тоташу хатасы, `403` (RBAC) — татарча һәм инглизчә
  намуслы итеп күрсәтелә. Мәгълүмат 10 секунд саен яңара.
- Чәй вакытында панель кластерга мөрәҗәгать итми — `ayda` кебек.

### Headlamp плагины

[Headlamp](https://github.com/kubernetes-sigs/headlamp) өчен `tatarnetes` плагины:

- **Тема** «Татарнетес / Tatarnetes» — Татарстан флагы төсләре һәм алтын, логотип
  (Көйләүләр → Гомуми → Тема).
- **Келәм** — сул панель артында татар келәме.
- **Чәй тәнәфесе** — `ayda` һәм бу панель белән бер үк график: өстә 🍵 тамгасы,
  тәнәфестә — келәм өстендә чәй экраны («Ашыгыч эш» төймәсе белән).
- **Татарча атамалар** — меню (Кузаклар, Төеннәр, Хезмәтләр…) һәм таблица
  баганалары («Хәл / Status»); Headlamp'ның калган юлларын плагин API'сы
  алыштырырга бирми.
- **«Татарнетес» бите** — бүгенге чәй, Тукай юлы, сүзлек.

Һәрберсен плагин көйләүләрендә сүндереп була.

```bash
cd headlamp-plugin
npm install
npm run build && npm run package     # tatarnetes-<версия>.tar.gz
npm start                            # үсеш: Headlamp'ка җанлы йөкләнә
```

Урнаштыру: пакетны Headlamp плагиннары папкасына чишәргә
(`~/.config/Headlamp/plugins/tatarnetes/`) яки релиздагы тарболны кулланырга.

## English

**Tatarnetes UI** is a national web dashboard based on the Kubernetes Dashboard.
The entire interface is in Tatar: resources use national names (кузаклар/pods,
төеннәр/nodes, хезмәтләр/services, мәйданнар/namespaces), the background is a
Tatar carpet, and the palette is the Tatarstan flag (green-white-red) plus gold.
A skullcap face watches from the top — happy on success, angry on error.

The tea-break schedule is shared with the CLI (`ayda`): during tea the panel
locks, shows a kыstybyй-and-tea screen and does not call the cluster.

**Demo mode** (default, fake data, no backend):

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

**Live mode** reads pods, nodes, services, deployments, namespaces and events from
a real cluster. `kubectl proxy` serves both the UI and the API from one origin,
so the browser never holds a token and permissions are those of your kubeconfig:

```bash
kubectl proxy --port=8001 --www=/path/to/tatarnetes-ui --www-prefix=/ui/
# open http://127.0.0.1:8001/ui/?api=/   (add &ns=<namespace> for one namespace)
```

Without `?api=` (or `api` in `config.js`) the panel stays in demo mode. Only a
same-origin API base is accepted, and the CSP allows `'self'` only. Loading,
empty, connection-error and `403` (RBAC) states are shown honestly in Tatar and
English; data refreshes every 10 seconds.

### Headlamp plugin

The `tatarnetes` plugin for [Headlamp](https://github.com/kubernetes-sigs/headlamp),
the dashboard upstream recommends now that the Kubernetes Dashboard is archived:

- **Theme** "Татарнетес / Tatarnetes": the Tatarstan flag colours plus gold, and
  the logo (Settings → General → Theme).
- **Carpet** behind the sidebar.
- **Tea breaks** on the same schedule as `ayda` and this panel: a 🍵 chip in the
  app bar, and during a break a tea screen over the carpet, with a button to
  skip it for an emergency.
- **Tatar names** in the menu (Кузаклар, Төеннәр, Хезмәтләр…) and in table
  headers ("Хәл / Status"); the rest of Headlamp's text is beyond what the
  plugin API lets a plugin change.
- **A "Татарнетес" page**: today's tea, a Tukay line, the glossary.

Each part can be switched off in the plugin's settings.

```bash
cd headlamp-plugin
npm install
npm run build && npm run package     # tatarnetes-<version>.tar.gz
npm start                            # development: hot-loads into Headlamp
```

Install by unpacking the package into Headlamp's plugin directory
(`~/.config/Headlamp/plugins/tatarnetes/`) or from a release tarball. CI
type-checks, tests (the tea formula against `lib.js` and the CLI vector),
builds and packages it on every push.

The Dashboard-based panel above stays as it is, frozen at Dashboard 7.14.0.

---

## Гаилә / Family

- 🐘 [tatarnetes](https://github.com/tatar-ncf/tatarnetes) — милли Kubernetes
- 🖥 **tatarnetes-ui** — идарә панеле (бу репо)
- 🐧 [tataros](https://github.com/tatar-ncf/tataros) — милли kuberoot дистрибутивы

[**Tatar-Native Computing Foundation**](https://github.com/tatar-ncf) · Tatarch License 2.0

<div align="center">

**Рәхмәт яугыры! Татарстан алга!** 🟢⚪🔴

</div>
