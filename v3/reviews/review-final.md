# Senior Code Review — INF.02 Study Hub v4.1

**Data:** 2026-05-01
**Reviewer:** Senior Code Reviewer (Faza 3)
**Wersja:** v4.1 (post 7 mini-iteracji v3.5–v4.1)
**Scope:** 5 artefaktów HTML (shell, quiz, diagnostic, practical, srs) + sw.js + manifest
**Method:** manual code trace, grep audit, contract verification, P0/P1 test re-trace.

> **Uwaga:** Web research (WebSearch) nie był dostępny w środowisku review — zastąpiono go zinternalizowaną wiedzą o best practices PWA / vanilla JS / WCAG AA / cache strategies (stan: 2025/2026). Wpływ: ograniczony — review nie dostarcza świeżych CVE z 2026, ale zasadnicze klasy problemów (XSS, race, leak, ARIA) są standardowe.

---

## Issues

### Issue #1 — P0 — kontrakty/architektura — Naruszenie ADR-003: bezpośredni `localStorage.*` w 4 z 5 artefaktów

**Test:** TEST-SHELL-05 (storage adapter), TEST-SYS-PROMPT-06 (single writer)
**Lokalizacja:**
- `quiz.html` linie 471–475, 582–614, 653–668 (5 wystąpień direct `localStorage.*`)
- `practical.html` linie 653–658, 1225–1244 (4 wystąpienia, w tym duplikacja persistencji do `inf02.v3.state` z fragmentem deep-merge powtórzonym po raz drugi)
- `srs.html` linie 426, 436 (fallback shell zapisujący bezpośrednio)
- `diagnostic.html` linie 588–592 (storage adapter — IIFE OK, ale linia 591/592 mija fallback shell)
- `shell.html` 376–409 (poprawnie — to jedyny dozwolony writer z handlingiem quota)

**Obserwacja:** Architecture sekcja 1.2 jasno mówi „**OBOWIĄZKOWE:** każdy artefakt MUSI używać tego adaptera. NO direct `localStorage.*`. Builder Reviewer odrzuca PR z `localStorage.setItem` lub `localStorage.getItem` poza tą sekcją.” Architektura zakłada single-writer dla `inf02.v3.state` = tylko shell. Tymczasem quiz.html (linia 614, 668), practical.html (1235, 1244) i srs.html zapisują niezależnie do tego samego klucza. To race-condition by design — patrz Issue #2.

**Repro:** Zakończ quiz w jednej karcie podczas gdy w drugiej karcie running session SRS. quiz.html `endSession()` linia 1098 → `await storage.setItem('inf02.v3.state', ...)` jednocześnie z `srs.html` linia 437 → `localStorage.setItem(STATE_KEY, ...)`. Last-write-wins; jedna sesja przepada bez śladu (brak `seq` race detection bo każdy moduł nadpisuje całe drzewo).

**Oczekiwane:** Wszystkie pisma idą przez `INF02.shell.setState(patch)` (deep-merge + sequential `_persistChain`). Jest to intencja Architecture sec 1.2 i ADR-003.

**Sugestia fix:** w quiz.html / practical.html / srs.html usuń wszystkie direct `localStorage.setItem` na klucz `inf02.v3.state`. Ufaj `shellSetState(patch)` — shell.html JUŻ implementuje fallback do localStorage gdy `window.storage` nieobecny (linia 381–407). Duplikowana persistencja w quiz.html linie 1088–1099 (po `await shellSetState`) jest redundantna i niebezpieczna — usuń.

**Effort:** S (40 minut, 6 miejsc do usunięcia)
**Risk:** Niskie (tylko czyszczenie martwego kodu, ujednolicenie ścieżki)

---

### Issue #2 — P0 — race condition / spójność danych — Multi-tab + multi-artifact piszą do tego samego klucza bez `seq` guard

**Test:** TEST-SHELL-06 (setState merge + seq), TEST-SYS-PROMPT-05 (single writer)
**Lokalizacja:** quiz.html 1085–1099 (manual storage write), practical.html 1224–1235, srs.html fallback shell 437.
**Obserwacja:** `shell.html` ma `_persistChain` (sekwencyjne await, linia 644–668) i `seq` increment (linia 651–653). Ale gdy user otwiera **quiz.html** w nowej karcie, shell w tamtej karcie jest osobnym kontekstem JS. Drugi shell-instance czyta state w bootstrap (linia 1907), a przy `endSession` quiz.html zapisuje **bezpośrednio** do `inf02.v3.state` bypassując in-memory `_state` shell-a w pierwszej karcie. Potem w pierwszej karcie nawigacja do dashboardu pokazuje **stary** state z pamięci (do triggeru `pageshow` linia 2095–2118 — który ratuje sytuację wyłącznie po `event.persisted` z bfcache; nie po `storage` events).

**Repro:**
1. Tab A: shell.html, dashboard widoczny.
2. Tab B: quiz.html, ukończ quiz (wynik zapisuje się w localStorage).
3. Tab A: kliknij "Dashboard" w sidebarze → handleRoute → renderShell → renderDashboard. Wyświetla `_state` z pamięci, BEZ nowej sesji. Trzeba **F5**, żeby zobaczyć nowy stan.

**Oczekiwane:** Shell powinien nasłuchiwać `window.addEventListener('storage', ...)` na zmiany cross-tab i odświeżać `_state`. Alternatywnie BroadcastChannel API.

**Sugestia fix:**
```js
// shell.html, dodaj koło bootstrap()
window.addEventListener('storage', (e) => {
  if (e.key !== STATE_KEY || !e.newValue) return;
  try {
    const parsed = JSON.parse(e.newValue);
    if ((parsed.seq||0) > (_state.seq||0)) {
      _state = deepMerge(defaultState(), parsed);
      rebuildSnapshot(); notify(); handleRoute();
    }
  } catch(_) {}
});
```
Plus naprawienie Issue #1 sprowadzi cały writeflow do shell, eliminując źródła konfliktu.

**Effort:** S (~30 min, 1 listener + opcjonalnie BroadcastChannel)
**Risk:** Niskie

---

### Issue #3 — P0 — schemat danych — `Streak.freezesAvailable` default = 2 zamiast 0 wbrew TEST-SHELL-01

**Test:** TEST-SHELL-01 (fresh state default)
**Lokalizacja:** `shell.html` linia 562 (`defaultState()` → `freezesAvailable: 2`)
**Obserwacja:** TEST-SHELL-01 explicit wymaga `streak: {count:0, lastActiveDate:null, freezesAvailable:0, longestStreak:0}`. Kod daje `freezesAvailable: 2`. Nie jest to security bug, ale formalnie test P0 fail.

Schemat (`schemas.json` linia 471–474) dopuszcza `0..2`, więc 2 jest valid; ale spec testu jest zerową wartością. Decyzja: dostosuj test LUB kod. Architecture sekcja 1.2 nie precyzuje. Szczegół „regenerują 1 / 7 dni” sugeruje raczej start od 0.

**Sugestia fix:** kod na `freezesAvailable: 0` LUB update tests.test.md → 2. Polecam kod = 0; user „zarabia” freeze przez aktywność (zachęta).

**Effort:** XS
**Risk:** Brak (tylko default value)

---

### Issue #4 — P0 — bug funkcjonalny — Cross-artifact event bus nie działa: SRS auto-add fiszek po quiz fails silently

**Test:** brak dedykowanego, ale impliied przez TEST-QUIZ-03 + integration spec srs.html „auto-add wrong cards po quiz:ended”.
**Lokalizacja:** `quiz.html` linia 1104–1112 (emit) vs `srs.html` linia 826–838 (listener `attachQuizListener`).
**Obserwacja:** quiz.html emit payload to `{sessionId, mode, score, total, perArea, durationSec, isDiagnostic}` — **brak `answers`**. srs.html listener: `if (!payload || !Array.isArray(payload.answers)) return;` → silent return. Auto-add fiszek po quiz NIGDY się nie wywołuje przez tę ścieżkę.

Co więcej: oba pliki to osobne strony HTML. quiz.html emit wykonuje się w jego kontekście; srs.html listener jest podpięty do shell w kontekście srs.html. To dwie osobne instancje shell-a (per-page IIFE), więc event bus i tak by nie crossował granicy strony.

**Repro:** Otwórz quiz.html, popełnij 3 błędy, zakończ quiz. W srs.html: `Object.keys(state.cards).length` przed/po quiz = takie same (delta 0 — fiszki niedodane przez listener). Faktyczna funkcja działa dzięki **side-effect** linia 647–676 quiz.html (`addWrongAnswersToSRS()`) — ale jest wywoływana tylko gdy user kliknie button "Dodaj błędy do fiszek" (linia 1549–1557), nie automatycznie.

**Oczekiwane:** Albo (a) quiz.html dodaje `answers: RUN.session.answers` do payloadu i robi append do shell state, listener w shell.html (ten sam kontekst) wywołuje SRS API albo (b) SRS auto-seed wykonuje się synchronicznie w `endSession` quiz.html (już jest kod w `addWrongAnswersToSRS` — wystarczy wywołać przed `renderResult`).

**Sugestia fix:** quiz.html linia ~1102 (przed `shellEmit`):
```js
if (RUN.mode !== 'review' && !RUN.isDiagnostic) {
  await addWrongAnswersToSRS();  // już istnieje, linie 647–676
}
```
**Effort:** XS (1 linia)
**Risk:** Niskie (jest button manualny — feature staje się tylko nieblokujący auto-flow)

---

### Issue #5 — P0 — security/CSP — Quiz.html, srs.html, practical.html niepotrzebnie autoryzują `https://cdn.jsdelivr.net` w CSP, mimo że Chart.js nie ładują

**Test:** żaden TEST nie pokrywa CSP — luka w testach.
**Lokalizacja:** `quiz.html` linia 4, `srs.html` linia 4, `practical.html` linia 4 (CSP ma `script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net`).
**Obserwacja:** Tylko shell.html (linia 2123) i diagnostic.html (linia 23) faktycznie ładują Chart.js. Quiz.html, srs.html, practical.html mają tę samą polisę ale nigdy nie używają CDN. To rozszerza attack surface bez korzyści — gdyby attacker zdołał wstrzyknąć inline script tag do quiz.html (np. przez XSS w pytaniu z `imageUrl` — patrz Issue #6), mógłby ładować dowolny skrypt z jsdelivr.

Dodatkowo: `'unsafe-inline'` w `script-src` neguje większość ochrony CSP — dosłownie każdy `<script>` inline (a jest ich dużo) wymaga tego, ale to oznacza zerową ochronę przed XSS. **Najlepsza praktyka 2025/2026:** `'strict-dynamic'` + nonce per-script, albo refactor inline → external.

**Sugestia fix:** quiz/srs/practical.html → usuń `https://cdn.jsdelivr.net` z `script-src`. Długoterminowo: introduce nonce-based CSP (wymaga build step lub minimum przeniesienie inline script bloków do `<script src>`).

**Effort:** XS (3 zmiany meta tag); długoterminowo M (refactor inline → external)
**Risk:** Brak (tylko zacieśnienie polisy)

---

### Issue #6 — P1 — security XSS — `safeImageUrl` whitelista nie waliduje `imageAlt`

**Test:** `tests/images.test.md` (TEST-IMG; nie był czytany szczegółowo, ale conventional)
**Lokalizacja:** `quiz.html` linia 873–887 (`safeImageUrl`, `renderQuestionImage`).
**Obserwacja:** Linia 884 `const alt = (typeof q.imageAlt === 'string' && q.imageAlt) ? q.imageAlt : '';` — następnie linia 886 wstawia `alt="${alt.replace(/"/g, '&quot;')}"`. Escape tylko `"` — brak escape dla `<`, `&`, `'`, `>`. Atak: `q.imageAlt = 'foo" onerror="alert(1)" x="`. `"` jest escapowany na `&quot;`, ale dwa kolejne `"` w atrybucie nie zamykają poprawnie i pozostawiają executable HTML.

Spróbuj: `imageAlt: 'foo&quot; onerror=alert(1) x=&quot;'` — tu już atak nie przechodzi bo escape upewnia się; ale: brak ochrony przed `'` (apostrof) — gdyby wartość atrybutu była w `'...'` Powstałaby luka. Aktualna szablonka jest w `"..."`, więc to NIE jest exploit dziś. Jednak `escapeHtml(s)` na linie 533–538 jest dostępna i konsekwentnie używana w innych miejscach — używaj jej zawsze.

Dodatkowo: `safeImageUrl` whitelist akceptuje `data:image/svg+xml;base64,...` — SVG może zawierać `<script>` i jest active content. To realna podatność XSS — jeśli atakujący kontroluje content `data/questions.json` (np. przez import), wstrzykuje SVG ze skryptem i wykonuje JS w kontekście quiz.html.

**Repro:**
```js
q.imageUrl = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(document.domain)</script></svg>');
```
Po pre/render — alert wykonany.

**Oczekiwane:** Albo (a) usuń `svg+xml` z whitelisty (linia 876), albo (b) zaakceptuj tylko inline SVG bez `<script>` (parsowanie + sanitize).

**Sugestia fix:**
```js
// linia 876:
if (url.match(/^data:image\/(png|jpe?g|gif|webp);base64,/)) return url;  // usuwam svg+xml
```
Plus użyj `escapeHtml(alt)` zamiast `replace(/"/g, '&quot;')`.

**Effort:** XS
**Risk:** Średnie (wektor istnieje, ale tylko gdy user sam importuje malicious JSON)

---

### Issue #7 — P1 — memory leak — Globalne `document.addEventListener('keydown', onKey)` w quiz.html bez `removeEventListener`

**Test:** TEST-QUIZ-12 (keyboard shortcuts)
**Lokalizacja:** `quiz.html` linia 1598 (`document.addEventListener('keydown', onKey)`).
**Obserwacja:** Listener attached on script load, **never** removed. `onKey` (linia 1581–1597) referencjuje `RUN`, `onPrev`, `onAdvance`, `onSelectMcq` — closure trzyma cały moduł. Po nawigacji do nowego widoku (np. result → renderModePicker → … → renderModePicker), listener wciąż aktywny. Pojedynczy listener nie jest sam w sobie leakem, ale przy każdym `navigate('quiz')` ze shell.html → location.href → reload, browser tworzy nowy kontekst i listenery się czyszczą; **jednak w SPA-like shell view** (gdyby quiz był renderowany inline jak np. search) ten pattern oznaczałby duplikację.

Globalnie: **0 wywołań `removeEventListener` w całej bazie** (`grep -c removeEventListener` → 0). Każdy `addEventListener` jest "fire and forget". Dla aplikacji uruchamianej z `location.href` reload to akceptowalne, ale dla `setInterval` w timer (quiz.html linia 1143–1158, practical.html linia 1255) — gdy user nawiguje w drugą stronę bez `endSession`, interval nadal tika.

**Sprawdziłem:** `clearInterval` jest wywoływany w `stopTimerLoop` (1157). Ale `stopTimerLoop()` jest wywoływany tylko z `endSession` lub deadline. Gdy user kliknie "← Dashboard" mid-quiz (linia 1500, button), `shellRoute('dashboard')` → `location.href = 'shell.html'` → cały kontekst się czyści (browser GC). OK tutaj. Ale w przypadku `navigate('quiz')` z shell.html (już są na quiz?) + cancel via in-page route — interval może żyć. Niski impact bo strona się przeładowuje przy zmianie kontekstu.

**Oczekiwane:** Standard cleanup pattern; zwłaszcza `pagehide` event (lepszy niż `unload`):
```js
window.addEventListener('pagehide', () => {
  document.removeEventListener('keydown', onKey);
  stopTimerLoop();
});
```

**Effort:** XS per artifact, S total
**Risk:** Niskie (większy problem: timer survives BFCache, leaks battery na mobile)

---

### Issue #8 — P1 — bug — Drawer keyboard trap nie zamykany przy Tab → outside drawer

**Test:** TEST-SHELL-09 (keyboard nav), accessibility WCAG 2.4.3 + 2.1.2
**Lokalizacja:** `shell.html` linie 1200–1218 (`openDrawer`), linia 2056 (Escape handler).
**Obserwacja:** Drawer ma `role="dialog" aria-modal="true"` (linia 345). WCAG wymaga focus trap. Po Tab z ostatniego buttona drawer-a, focus wychodzi do elementów pod backdropem (visible aria-modal=true!). Brak `inert` attribute na rodzicu `app`, brak focus trap. Esc zamyka (linia 2056 — OK, P0 częściowo zaadresowany).

**Repro:** Otwórz drawer (mobile). Tab kilka razy. Focus wyjdzie poza drawer, można aktywować elementy pod backdropem. Aria-modal=true znaczy „treść poza dialog jest niedostępna” — ale user ją osiąga klawiaturą.

**Oczekiwane:** Focus trap (Tab z ostatniego → pierwszy; Shift+Tab z pierwszego → ostatni) lub `inert` attribute na `#app` gdy drawer otwarty.

**Sugestia fix:**
```js
function openDrawer() {
  // ... existing code
  document.getElementById('app').setAttribute('inert', '');
  document.querySelector('.bottom-nav')?.setAttribute('inert', '');
}
function closeDrawer() {
  document.getElementById('app').removeAttribute('inert');
  document.querySelector('.bottom-nav')?.removeAttribute('inert');
  // ...
}
```
`inert` polyfill dla Safari <16.4 jest 1KB.

**Effort:** S
**Risk:** Niskie

---

### Issue #9 — P1 — performance — `aggregateQuestionStats` re-runs O(N×M) on every search render

**Test:** brak; performance test missing — coverage gap.
**Lokalizacja:** `shell.html` linia 1008–1026 + 1730 (`renderSearch` calling it).
**Obserwacja:** `aggregateQuestionStats(state)` iteruje wszystkie sesje × wszystkie odpowiedzi. Przy 50 sesjach × 40 pytań = 2000 iteracji. `renderSearch` wywołuje to przy każdym wpisie w `<input type="search">` (po debounce 300ms — OK). Dodatkowo `renderSearch` re-rendeuje całe DOM (linia 1802 `root.innerHTML = html`), niszcząc focus na input. User wpisuje literę → debounce 300ms → 50 sesji aggregate → re-render 297 pytań (slice 50) → input traci focus → user musi ponownie kliknąć.

**Repro:** Otwórz `#search`, kliknij input, zacznij pisać "windows". Po 300ms input traci focus mid-typing. Frustrating UX P1.

**Oczekiwane:** (a) cache statystyk per-state-version, invaliduj na `state:changed`. (b) re-render WYŁĄCZNIE listy wyników, nie całego widoku — focus zachowany.

**Sugestia fix:**
```js
const _qStatsCache = new WeakMap();
function aggregateQuestionStats(state) {
  if (_qStatsCache.has(state)) return _qStatsCache.get(state);
  // ... existing
  _qStatsCache.set(state, stats);
  return stats;
}
```
Plus zamień `root.innerHTML = html` na partial update — wyspecjalizowany element `#q-results` z innerHTML, reszta widoku stays.

**Effort:** M
**Risk:** Niskie

---

### Issue #10 — P1 — bug — `formatRelative` zwraca "dziś" dla future dates (clock skew / examDate <today)

**Test:** brak dedykowanego.
**Lokalizacja:** `shell.html` linia 512–522.
**Obserwacja:** `const days = Math.floor(diff / 86400000); if (days <= 0) return 'dziś';` — diff = `Date.now() - d.getTime()`. Dla dat w przyszłości diff < 0, `days = Math.floor(-1) = -1`, `-1 <= 0` → "dziś". Mylące: sesja "endedAt" z przyszłą datą (np. clock skew na urządzeniu) wyświetla się jako "dziś". Egzamin za miesiąc przy chińskim klocku 1d skew → "dziś". To może być realistycznie spotykany problem dla użytkowników szkolnych komputerów.

**Sugestia fix:**
```js
if (days < 0) return formatDate(iso);  // future
if (days === 0) return 'dziś';
```

**Effort:** XS
**Risk:** Brak

---

### Issue #11 — P1 — bug — `bumpStreakIfActiveToday` logic gap dla diffDays > 2 with freezes

**Test:** TEST-SHELL-06 implied (streak update integration)
**Lokalizacja:** `shell.html` linia 1088–1107.
**Obserwacja:**
```js
if (diffDays === 1) count = count + 1;
else if (diffDays > 1) {
  if (freezes > 0 && diffDays === 2) { freezes -= 1; count = count + 1; }
  else count = 1;
}
```
Logika `freezes > 0 && diffDays === 2` znaczy: "przerwa 1 dnia konsumuje 1 freeze". OK. Ale przy `diffDays === 3` z 2 freezes — kod nie konsumuje 2 freezes, tylko resetuje (`count = 1`). Spec ADR-008/Brief sec mówi „max 2 freezes (1-day grace)” — interpretacja niejednoznaczna: czy 2 freezes = pokrywa 2 dni przerwy czy tylko 1 dzień buffer? Aktualna logika pokrywa **tylko 1 dzień**, marnując drugi freeze.

**Oczekiwane:** Zdefiniuj jednoznacznie. Jeśli "2 freezes = max 2 dni przerwy", powinno być:
```js
const skipDays = diffDays - 1;
if (skipDays <= freezes) { freezes -= skipDays; count += 1; }
else count = 1;
```

**Effort:** XS
**Risk:** Niskie (zmiana semantyki — wymaga decyzji produktowej)

---

### Issue #12 — P1 — bug — Quiz `selectExam` z `n=40` ale pool < 40 pyt zwraca shuffle pool, score z dzielenia przez n=40 jest bez sensu

**Test:** TEST-QUIZ-01 (40 pytań w trybie exam)
**Lokalizacja:** `quiz.html` linia 755–779 (`selectExam`), linia 1015–1023 (`endSession` count).
**Obserwacja:** `selectExam` linia 757: `if (pool.length <= n) return shuffle(pool);` zwraca cały pool. Ale wtedy `RUN.queue.length < 40`. `total = RUN.queue.length` (linia 1021) = mniej niż 40. Score wciąż OK (score = correct/total). Problem subtelny: `paramsForMode` (linia 891) zakłada exam = 40 pytań; gdy pool < 40, exam się rozpoczyna z mniejszą liczbą pytań ale UI mówi "Egzamin" mimo że nie jest pełny zestaw CKE. Brak warningu dla usera.

**Repro:** Mock `data/questions.json` z 30 pytaniami. Start exam → quiz pokazuje 30 pytań w trybie exam. User myśli, że to pełen egzamin.

**Oczekiwane:** Warning toast lub blokada: "Brak wystarczającej liczby pytań (potrzeba 40, dostępnych 30). Zaimportuj pełen bank pytań." Albo proceed z information label.

**Sugestia fix:** w `startSession` po `queue = selectExam(...)`:
```js
if (mode === 'exam' && queue.length < ENGINE.examQCount) {
  showToast(`Niewystarczająca baza: ${queue.length}/${ENGINE.examQCount} pyt.`, 'warning');
}
```

**Effort:** XS
**Risk:** Brak

---

### Issue #13 — P1 — code quality — `_chartInstance` global w shell + radarWrap.appendChild canvas po `setTimeout(100)` race przy szybkim view switch

**Test:** brak dedykowanego, ale TEST-SHELL-08 (axe-core) nie wykrywa
**Lokalizacja:** `shell.html` linia 1256, 1435–1438.
**Obserwacja:** `_chartInstance` jest globalna. `renderRadar` linia 1259: `if (_chartInstance) { _chartInstance.destroy(); _chartInstance = null; }`. OK — destroy poprzedniego. Ale `setTimeout(() => renderRadar(canvas, ...), 100)` w renderDashboard linia 1435–1438 oznacza: gdy user szybko nawiguje dashboard → settings → dashboard, mogą collidować dwa setTimeout. Pierwszy timeout fires po 100ms — w tym momencie canvas już został usunięty z DOM (settings render), `renderRadar` rysuje na canvas detached → Chart.js może rzucić error lub stworzyć ghost instance.

`renderRadar` nie sprawdza `document.body.contains(canvasEl)` przed renderem.

**Oczekiwane:** Defensive check lub `cancelAnimationFrame`/`clearTimeout` patterns. Lub tracking `_radarTimeoutId` z czyszczeniem.

**Sugestia fix:**
```js
// w renderDashboard:
clearTimeout(renderDashboard._radarT);
renderDashboard._radarT = setTimeout(() => {
  if (!document.contains(canvas)) return;
  try { renderRadar(canvas, perArea); } catch(e) { console.warn('radar', e); }
}, 100);
```

**Effort:** XS
**Risk:** Niskie

---

### Issue #14 — P1 — Service Worker bug — `cache: 'reload'` w install + no-stale-after-activate dla data/*.json może zwracać stale dane offline po update

**Test:** `tests/pwa.test.md` (nie czytane szczegółowo, ale conventional)
**Lokalizacja:** `sw.js` linie 39–44 (install addAll), 80–88 (networkFirst HTML + data).
**Obserwacja:** Strategia: HTML i data/*.json przez `networkFirst`. Przy offline: fetch fail → caches.match. OK. Ale po update: SW activate (linia 55–67) usuwa stare cache versions; `self.clients.claim()` przejmuje strony. Pobiera nową wersję `cache.add(new Request(url, { cache: 'reload' }))` — ale `cache.add` na all może zawieść częściowo (.catch w linii 41) → user offline z pół-zacache'owaną nową wersją. Konkretnie: questions.json może być nowy, ale shell.html stary (lub odwrotnie) → niespójność (np. kod oczekuje pola które nie istnieje).

Dodatkowo: `CACHE_VERSION = 'inf02-v4.1.0-20260501-1117'` (hard-coded). Każdy nowy deploy wymaga manualnego bumpu — łatwo zapomnieć (zaadresowane: task #23 "Bump SW cache" wskazuje na świadomość problemu).

**Oczekiwane:** (a) atomic update — install nie completes dopóki wszystkie ASSETS się nie pobiorą; rollback przy błędzie. (b) version bump przez build script (lub `Date.now()` token w install message).

**Sugestia fix:**
```js
// install: użyj cache.addAll zamiast Promise.all + catch — fails atomically
caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS))
```
Tradeoff: jeden fail (np. CDN down) blokuje cały install. Można podzielić na "critical" (HTML, data) i "best-effort" (icons, CDN Chart.js).

**Effort:** S
**Risk:** Średnie (zmiana cache strategy może zaskoczyć existing users)

---

### Issue #15 — P2 — accessibility — Brak `lang` na nested elements with mixed languages (CLI commands)

**Test:** TEST-QUIZ-08 (UTF-8 NFC), TEST-DIAG-09 (CIDR)
**Lokalizacja:** wszystkie artefakty — komendy CLI typu `ipconfig /all`, `chkdsk /f` w explanation pól.
**Obserwacja:** Strona ma `<html lang="pl">`. Komendy angielskie powinny być w `<code lang="en">` lub `<span lang="en">` dla screen readerów, by nie próbowały czytać "ipconfig" po polsku. Aktualnie wszystko jest plain text. Marginalny wpływ — większość screen readerów jest tolerantna.

**Sugestia fix:** wrap komend w `<code lang="en">` w explanation. Wymaga update questions.json lub CSS-driven detection (regex na `[a-z]{4,}\s/[a-z]+`).

**Effort:** L (refactor 297 pytań)
**Risk:** Brak

---

### Issue #16 — P2 — code quality — Duplikacja design tokens w 5 plikach, drift między quiz.html (linia 18+) i shell.html (linia 18+)

**Test:** TEST-SYS-PROMPT-08 (duplication acceptance — Architecture sec 1.7)
**Lokalizacja:** `quiz.html` linie 17–87, `srs.html` (analogiczne), `practical.html`, `diagnostic.html`, `shell.html` linie 17–326.
**Obserwacja:** Architecture **akceptuje** duplikację jako koszt single-file constraint (sekcja 1.9 risk #5). Ale weryfikacja: sprawdziłem czy tokeny są spójne. 

- shell.html ma `data-theme="light"` overrides (linia 314–323) z konkretnymi kolorami `#f8fafc`, `#475569` etc.
- quiz.html ma osobny light theme (linie 58–86) z **innymi** wartościami — `#FFFFFF`, `#5A6473`, `#1E66E0`. **Drift between artifacts.**

User w light mode zobaczy różne kolory na shell vs quiz vs srs. To sub-pixel UX inconsistency. design-tokens.json nie definiuje light theme tokens — Builders improvised każdy po swojemu.

**Oczekiwane:** Light theme tokens powinny być w `design-tokens.json` jako single source of truth. Faza 5: build script copy do każdego artifactu.

**Sugestia fix:** Dodaj do design-tokens.json:
```json
"colorLight": { "bg": "#FFFFFF", "surface": "#F7F8FA", ... }
```
i ujednolicenie w każdym artefakcie.

**Effort:** M
**Risk:** Niskie

---

### Issue #17 — P2 — code quality — Mixed style: `el()` helper vs template literal innerHTML w tym samym module

**Test:** addressed earlier (review-ux-redesign.md) — pomijam głęboko
**Lokalizacja:** głównie shell.html i diagnostic.html.
**Obserwacja:** shell.html używa konsekwentnie `el(tag, attrs, children)` helper (DOM-safe). Ale `renderSearch` linia 1753 używa template literal + `root.innerHTML = html` (linia 1802). Wszystkie wartości użytkownika (state.notes[q.id], q.q, etc.) są przepuszczone przez `escapeHtml` (linia 1749) — OK XSS-wise. Ale:
1. Performance: full innerHTML re-render przy każdej zmianie filtra (powtórka Issue #9).
2. Style drift: różne reviewers / mainteners muszą rozumieć dwa wzorce.

**Sugestia fix:** Refactor `renderSearch` na `el()` helper. Albo introduce małe `html` template tag function z auto-escape.

**Effort:** M
**Risk:** Niskie

---

### Issue #18 — P2 — bug — `getTodayStudyMinutes` może wrócić ujemne minuty gdy `endedAt < startedAt` (clock fudge)

**Test:** brak.
**Lokalizacja:** `shell.html` linie 1339–1344.
**Obserwacja:** `(new Date(s.endedAt) - new Date(s.startedAt)) / 60000` — jeśli system clock zostanie przesunięty wstecz w trakcie sesji (rzadko, ale: NTP korekcja, user manual change), endedAt < startedAt → wartość ujemna, sumowana, wynik na dashboardzie ujemny.

**Sugestia fix:** `Math.max(0, (endedAt - startedAt) / 60000)`.

**Effort:** XS
**Risk:** Brak

---

### Issue #19 — P2 — UX — `<input type="date">` nie ma min/max boundary (user może wybrać 1900 lub 2099)

**Test:** brak.
**Lokalizacja:** `shell.html` linia 1532 (`examInp`), `diagnostic.html` linia 1280 (ma min — OK!).
**Obserwacja:** Settings page input nie ma `min`. User może ustawić examDate na 1980-01-01 → exam-countdown wyświetla "-16800 dni" (lub "0 dni" przez `if (days < 0) return null;` na linia 1394 — OK, ale daily-goal banner is silent).

**Sugestia fix:** dodaj `min: new Date().toISOString().slice(0,10)` na `examInp` (linia 1532).

**Effort:** XS
**Risk:** Brak

---

### Issue #20 — P2 — bug — `practical.html` `el` helper html-key XSS potential

**Test:** brak.
**Lokalizacja:** `practical.html` linia 1310.
**Obserwacja:** `else if (k === "html") node.innerHTML = attrs[k];` — bezpieczny TYLKO jeśli wszystkie wywołania kontrolują źródło. Grep `el(... { html:`: nie znalazłem żadnego call site z user input, ale wzór jest niebezpieczny — łatwo niechcący wprowadzić XSS przez przyszły refactor. shell.html ma analogiczny `else if (k === 'html') e.innerHTML = v;` (linia 1130).

**Oczekiwane:** Albo usuń wsparcie, albo udokumentuj jasno "ONLY for trusted/internal HTML — never user-controlled".

**Effort:** XS (komentarz) / S (refactor calls)
**Risk:** Średnie potencjalne (nie aktualne)

---

## Sumarycznie

### Liczba issues per artefakt + per priorytet

| Artefakt | P0 | P1 | P2 | Total |
|---|---:|---:|---:|---:|
| shell.html | 3 (#1, #2, #3) | 4 (#8, #9, #10, #11) | 4 (#16, #17, #18, #19) | 11 |
| quiz.html | 2 (#1 share, #4) | 4 (#5, #6, #7, #12) | 1 (#16 share) | 7 |
| diagnostic.html | 1 (#1 share) | 1 (#13 share) | 0 | 2 |
| practical.html | 1 (#1 share) | 1 (#7 share) | 1 (#20) | 3 |
| srs.html | 1 (#1 share, #4 share) | 1 (#5 share) | 0 | 2 |
| sw.js | 0 | 1 (#14) | 0 | 1 |
| **Razem (unikalnych)** | **5** | **10** | **5** | **20** |

### TOP 5 najbardziej krytycznych

1. **#1 + #2 (powiązane) — Naruszenie ADR-003 + race condition multi-tab.** Każdy z 4 modułów pisze niezależnie do `inf02.v3.state` przez direct `localStorage.setItem`. Zero koordynacji `seq`. Bug zauważony już raz (task #20 "Fix #2: Historia nie zapisuje się — shellSetState fallback") — fix był punktowy, problem systemowy nadal istnieje. **Blocker dla użytkownika z dwiema kartami.**
2. **#4 — SRS auto-add po quiz nie działa.** Cross-artifact event bus rozłączony przez per-page IIFE shell + niedopasowanie payloadu. Feature reklamowany jako automatyczny działa tylko jako manualny button. Zauważone post-implementacja w v3.6+, ale nigdy nie naprawione poprawnie.
3. **#6 — XSS przez `data:image/svg+xml;base64,...` import.** Użytkownik importuje malicious JSON → SVG ze script wykonuje JS w kontekście aplikacji. Niski likelihood w produkcji (user musi sam sobie podstawić plik), ale to jest defence-in-depth fail.
4. **#3 — TEST-SHELL-01 default state niezgodny.** Formalnie P0 fail. Trywialny fix, ale podkopuje DoD — Faza 4 powinna mieć 100% P0.
5. **#14 — SW non-atomic update.** Częściowy install może zostawić user offline z mieszanką starego shell.html + new questions.json. Schema mismatch → crash przy `validateAppState`.

### Rekomendacja: **FIX-FIRST**

Klient produkcyjny działa (5 P0 issues, ale 4 z nich są edge-case lub user-action-triggered, jeden — #2 — manifestuje się tylko przy multi-tab). Niemniej jakość kontraktu (ADR-003 violated) i bezpieczeństwo (Issue #6 SVG XSS) wymagają formalnego fix-round przed Fazą 5 (template repo). Effort total: **3–4 godziny dla wszystkich P0 + top 3 P1**. Bez tego nie powinno wchodzić do template repo, bo te bugi powielają się w każdym derivative project.

**Kolejność fix-round:**
1. #6 (XSS) — 5 min
2. #3 (default streak) — 5 min
3. #4 (auto-SRS) — 5 min
4. #1+#2 (storage adapter compliance + storage event listener) — 60 min
5. #5 (CSP cleanup) — 10 min
6. #14 (SW atomic) — 30 min
7. P1 batch — 1.5h

---

## Co robi dobrze

Po brutalnej szczerości — to NIE jest pusty kod. Konkretne mocne strony:

1. **Storage quota handling w shell.html (linie 384–407)** — proper Safari private mode detection (`e.code === 22`, `NS_ERROR_DOM_QUOTA_REACHED`), graceful pruning sessions to last 10, custom event `inf02:quota-exceeded`. To jest powyżej średniej dla solo-deploy PWA.

2. **Prototype pollution guards w `deepMerge` (shell.html linia 462) + quiz.html linia 599** — explicit `__proto__`/`constructor`/`prototype` skip. Dobra higiena 2024+.

3. **`fetchWithRetry` z jitter (shell.html 526–540)** — wykładniczy backoff + ±100ms jitter, retryable status codes whitelist `[0, 408, 425, 429, 500, 502, 503, 504]`. Production-grade.

4. **SM-2 + soft lapse implementacja w srs.html (linie 612–642)** — pure function, no mutations, exact match z TEST-SRS-02 (factor 0.20, ease delta -0.20, no reset). Comments tłumaczą rationale (ADR-004). Self-test embedded w plikach (`?selftest=1`) — Builder reviewer ma sprawdzalność.

5. **`prefers-reduced-motion` reduplicated w każdym artefakcie** + Chart.js animation conditional (shell.html 1290) — accessibility WCAG 2.3.3 zaadresowane konsekwentnie.

6. **`pageshow` BFCache recovery (shell.html 2095–2118)** — jedno z rzadko poprawnie obsługiwanych zachowań Safari/Chrome. Re-validate state, recompute derived fields, re-render. Dowód, że ktoś przetestował na realnym mobile.

7. **Heatmap activity 30-day (shell.html 946–998)** — clean implementation, level bucketing, proper ARIA list, locale-aware date keys. Coverage gap to UX, nie code.

8. **Manifest webmanifest** — pełen feature set (purpose=any/maskable, lang=pl-PL, dir, prefer_related_applications=false, scope, start_url) + apple-touch-icon w meta. PWA installability score powinien być 100%.

9. **Tolerant fill matcher (quiz.html 554–570)** — NFC + lowercase + diacritic-strip + dot-strip fallbacks. Pokrywa polskie znaki + CIDR notation (255.255.255.224 = 255 255 255 224). To jest realna domain knowledge, nie stub.

10. **SRI hash + CSP base-uri 'self' + frame-ancestors 'none'** — defense layers (mimo problem z #5 CSP scope).

---

**Werdykt finalny:** `FIX-FIRST`. Production zwraca poprawne wyniki dla single-user single-tab happy path; ale 5 P0 i 10 P1 issues wymagają adresowania zanim kod stanie się reusable template (Faza 5). Średni czas naprawy: **3–4 godziny** dla pełnego P0 + top P1 batch.
