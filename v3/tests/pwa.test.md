# TDD — PWA artifacts (Builder-PWA)

**Artifacts:** `artifacts/manifest.webmanifest`, `artifacts/sw.js`, `artifacts/icons/*`
**Total tests:** 10 (P0: 4, P1: 4, P2: 2)
**DoD threshold:** 100% P0, ≥80% P1.

---

### TEST-PWA-01: manifest.webmanifest jest valid JSON i ma wymagane pola — P0

**Given:** plik `artifacts/manifest.webmanifest` istnieje na ścieżce `pwa.manifestPath` z design-tokens.
**When:** parser JSON wczytuje plik (`JSON.parse(await fetch('./manifest.webmanifest').then(r => r.text()))`).
**Then:** parse nie rzuca; obiekt zawiera wymagane pola: `name` (string non-empty), `short_name`, `start_url === "./shell.html"`, `scope === "./"`, `display === "standalone"`, `theme_color === "#5EA9FF"`, `background_color === "#0F1115"`, `lang === "pl-PL"`, `icons` (array, length ≥3, każda pozycja ma `src`/`sizes`/`type`). Co najmniej jedna ikona ma `purpose: "maskable"`.
**Verification:** `const m = JSON.parse(...); console.assert(m.name && m.start_url==="./shell.html" && m.theme_color==="#5EA9FF" && m.icons.some(i => i.purpose==="maskable"))`. Lighthouse PWA audit „Web app manifest meets the installability requirements" zielony.

---

### TEST-PWA-02: sw.js zarejestrowany przy load shell.html — P0

**Given:** browser z `'serviceWorker' in navigator === true`, shell.html zawiera bootstrap snippet `navigator.serviceWorker.register('./sw.js')` (ADR-006).
**When:** użytkownik otwiera `shell.html` po raz pierwszy.
**Then:** `navigator.serviceWorker.controller` po reload === non-null. Registration scope === origin + `./` (tj. obejmuje wszystkie 6 artefaktów). DevTools → Application → Service Workers pokazuje status `activated and is running`.
**Verification:** `await navigator.serviceWorker.getRegistration().then(r => console.log(r.scope, r.active.state))`; assert `state === "activated"`. Console: brak błędów rejestracji.

---

### TEST-PWA-03: cache-first działa offline (po install zachowuje wszystkie assets) — P0

**Given:** SW zainstalowany i aktywny; pierwszy load shell.html zakończony, wszystkie assets z `ASSETS[]` w sw.js wpisane do cache `inf02-v3.0.0`.
**When:** DevTools → Network → Offline; reload `shell.html` oraz nawigacja do `quiz.html`, `diagnostic.html`, `practical.html`, `srs.html`.
**Then:** wszystkie strony wczytują się bez błędów sieci; `data/questions.json` i `data/scenarios.json` dostarczane z cache; ikony 192/512/maskable dostępne; manifest dostępny offline.
**Verification:** `await caches.open('inf02-v3.0.0').then(c => c.keys()).then(ks => ks.length)` ≥ 11. Każdy URL z `ASSETS[]` zwraca `Response` z `caches.match(url)`. Reload offline → strona renderuje pełen UI bez błędów `Failed to fetch`.

---

### TEST-PWA-04: CACHE_VERSION zsynchronizowany z design-tokens.pwa.cacheVersion — P0

**Given:** `contracts/design-tokens.json` ma `pwa.cacheVersion === "v3.0.0"`.
**When:** parsujemy `sw.js` linia po linii / wysyłamy `postMessage({type:'GET_VERSION'})` do active SW.
**Then:** stała `CACHE_VERSION` w sw.js === `'inf02-v3.0.0'` (prefix `inf02-` + design-tokens version). Klucz w `caches.keys()` zawiera `inf02-v3.0.0`. Stare wersje (`inf02-v2.x.x`) usunięte przy activate.
**Verification:** `grep -E "CACHE_VERSION\s*=\s*'inf02-v3\.0\.0'" artifacts/sw.js` zwraca match; `await caches.keys()` po SW activate === `['inf02-v3.0.0']` (tylko jeden klucz).

---

### TEST-PWA-05: Chart.js z CDN cached przy install — P1

**Given:** ADR-002: Chart.js v4.5.0 z `cdn.jsdelivr.net` jest jedyną dozwoloną zewnętrzną biblioteką, `swCacheRequired: true`. URL z `design-tokens.cdn.allowed[0].url`.
**When:** SW install handler wykonał `cache.addAll(ASSETS)`.
**Then:** `caches.match('https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.js')` zwraca non-undefined Response. Wykresy w diagnostic.html (radar knowledge) renderują się offline.
**Verification:** DevTools → Application → Cache Storage → `inf02-v3.0.0` zawiera entry dla URL Chart.js. Test offline diagnostic.html nie loguje `Chart is not defined`.

---

### TEST-PWA-06: Update detection — nowa wersja SW pokazuje prompt — P1

**Given:** istniejący SW v3.0.0 w stanie activated, użytkownik ma otwartą zakładkę.
**When:** deployowana jest nowa wersja sw.js (np. `CACHE_VERSION = 'inf02-v3.0.1'`); shell.html wykrywa `registration.waiting !== null` i pokazuje banner „Dostępna nowa wersja — odśwież".
**Then:** klik banner wysyła `registration.waiting.postMessage('SKIP_WAITING')`; SW odpowiada przez handler i staje się aktywny po reload. Cache stare (`inf02-v3.0.0`) usuwany w activate.
**Verification:** mock new SW; `console.log(reg.waiting?.state)` === `"installed"`; po `postMessage` event `controllerchange` triggered; po reload `caches.keys()` nie zawiera `inf02-v3.0.0`.

---

### TEST-PWA-07: manifest icons dostępne (192/512/maskable + svg) — P1

**Given:** katalog `artifacts/icons/` zawiera `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`.
**When:** browser request każdej ikony przez ścieżki z manifest.icons[].src.
**Then:** każda zwraca HTTP 200 z poprawnym `Content-Type` (`image/png` lub `image/svg+xml`); wymiary PNG zgodne z `sizes` (192x192, 512x512). Maskable ikona ma full-bleed background (10% safe zone padding wewnątrz).
**Verification:** `for src of manifest.icons.map(i=>i.src): fetch(src).then(r=>{assert r.ok; assert r.headers.get('content-type').startsWith('image/')})`. ImageMagick `identify icon-192.png` → `192x192`. Chrome DevTools → Application → Manifest pokazuje wszystkie 4 ikony bez ostrzeżeń.

---

### TEST-PWA-08: network-first dla data/*.json + cache fallback — P1

**Given:** SW aktywny, `data/questions.json` w cache od install.
**When:** użytkownik online — wywołuje `fetch('./data/questions.json')`; potem offline — ten sam fetch.
**Then:** online → SW pobiera z sieci, aktualizuje cache, zwraca świeży response; offline → SW zwraca cached entry. Przy obu wynik resolved (nie reject).
**Verification:** mock fetch online (server returns `{version: '3.0.1'}`); cache po wywołaniu zawiera nowy version. Wyłącz fetch (`self.fetch = () => Promise.reject()`) → response z cache nadal działa (`r.ok === true`).

---

### TEST-PWA-09: theme-color matches design-tokens — P2

**Given:** `design-tokens.color.accent === "#5EA9FF"` i `design-tokens.pwa.themeColor === "#5EA9FF"`.
**When:** parsujemy `manifest.webmanifest.theme_color` oraz `<meta name="theme-color">` w shell.html.
**Then:** oba === `"#5EA9FF"`. Status bar Android Chrome / iOS Safari używa tego koloru po install.
**Verification:** `m.theme_color === "#5EA9FF"`; manualny smoke test PWA install na Android — kolor toolbara matches.

---

### TEST-PWA-10: start_url poprawny i scope obejmuje wszystkie artefakty — P2

**Given:** manifest `start_url === "./shell.html"`, `scope === "./"`. 6 artefaktów (shell/quiz/diagnostic/practical/srs + sw.js) w tym samym folderze.
**When:** install PWA Add to Home Screen → tap ikonę.
**Then:** otwiera `shell.html` w trybie `standalone` (bez paska URL); nawigacja do `./quiz.html` itd. pozostaje w obrębie standalone window (scope match). Lighthouse PWA `Manifest start URL responds with a 200` zielony.
**Verification:** Lighthouse audit; `new URL(m.start_url, location).pathname.endsWith('/shell.html')`; wszystkie 6 artefaktów mają path zaczynający się od scope (`./` względem manifest).

---

## Mapping P0/P1/P2

| ID | Priority | Tytuł |
|---|---|---|
| TEST-PWA-01 | P0 | manifest.webmanifest valid + wymagane pola |
| TEST-PWA-02 | P0 | sw.js zarejestrowany przy load shell.html |
| TEST-PWA-03 | P0 | cache-first działa offline |
| TEST-PWA-04 | P0 | CACHE_VERSION zsynchronizowany z design-tokens |
| TEST-PWA-05 | P1 | Chart.js z CDN cached przy install |
| TEST-PWA-06 | P1 | Update detection — prompt nowej wersji |
| TEST-PWA-07 | P1 | manifest icons dostępne (192/512/maskable + svg) |
| TEST-PWA-08 | P1 | network-first dla data/*.json + fallback |
| TEST-PWA-09 | P2 | theme-color matches design-tokens |
| TEST-PWA-10 | P2 | start_url + scope poprawny |
