# TDD — Shell artifact (Builder-Shell)

**Artifact:** `artifacts/shell.html`
**Total tests:** 12 (P0: 5, P1: 5, P2: 2)
**DoD threshold:** 100% P0, ≥80% P1.

---

### TEST-SHELL-01: Pierwsze uruchomienie — fresh state — P0

**Given:** brak klucza `inf02.v3.state` w żadnym storage backendzie.
**When:** użytkownik otwiera `shell.html`.
**Then:** Shell tworzy `AppState` z `version: "3.0.0"`, `profile: null`, `knowledge.perArea` zawiera 11 obszarów (każdy `{accuracy:0, attempts:0, lastSeen:null, mastery:0.5}`), `cards: {}`, `streak: {count:0, lastActiveDate:null, freezesAvailable:0, longestStreak:0}`, `achievements: []`, `sessions: []`, `settings: {theme:"auto", reducedMotion:false, locale:"pl-PL"}`, `seq: 0`.
**Verification:** `console.log(JSON.parse(await storage.getItem("inf02.v3.state")))` po `INF02.shell.init()`; assert deep-equal vs default state. AJV walidacja vs `AppState` schema musi przejść.

---

### TEST-SHELL-02: Hydration — wczytanie istniejącego state — P0

**Given:** klucz `inf02.v3.state` zawiera valid JSON `AppState` z `profile.pseudonim = "Anka"`, `streak.count = 7`.
**When:** Shell wykonuje `init()`.
**Then:** `INF02.shell.getState().profile.pseudonim === "Anka"`, `getState().streak.count === 7`. Brak overwritu.
**Verification:** `INF02.shell.getState()` zwraca obiekt `Object.isFrozen()` true, deep equal do persisted state.

---

### TEST-SHELL-03: Migration v2 → v3 — P0

**Given:** brak `inf02.v3.state`, ale `inf02_progress_v2` zawiera v2 state z `knowledge: {B:0.7, O:0.4, D:0.3, S:0.6, U:0.5}` i 30 cards.
**When:** Shell wykonuje `migrateFromV2()`.
**Then:** `getState().knowledge.perArea.B.mastery === 0.7`, `S.mastery` rozdzielona na `N/6/W` (każdy 0.6), `U` rozdzielony na `P/V/Z` (każdy 0.5). Obszary `L` i `R` mają default `0.5`. Wszystkie 30 cards zmigrowane (z `successStreak: 0` dodanym). `inf02_progress_v2` NIE jest usunięty (read-only backup).
**Verification:** assert per-area; `Object.keys(state.cards).length === 30`; `await storage.getItem("inf02_progress_v2") !== null`.

---

### TEST-SHELL-04: Storage adapter wybiera kind=claude — P0

**Given:** environment ma `window.storage.getItem` (Cowork).
**When:** moduł storage IIFE jest evaluowany.
**Then:** `storage.kind === "claude"`.
**Verification:** `console.log(INF02.shell._storageKind)` === "claude" (debug accessor).

---

### TEST-SHELL-05: Storage adapter fallback localStorage — P0

**Given:** brak `window.storage`, ale `localStorage` dostępny.
**When:** moduł storage IIFE evaluowany.
**Then:** `storage.kind === "local"`. `setItem` zapisuje do localStorage i zwraca Promise.
**Verification:** mock `window.storage = undefined`; otwórz w fresh tab; `console.log(INF02.shell._storageKind)` === "local"; `localStorage.getItem("inf02.v3.state")` zwraca JSON.

---

### TEST-SHELL-06: setState merge + seq increment — P1

**Given:** `state.seq === 5`, `profile === null`.
**When:** wywołuje `INF02.shell.setState({profile: {goal: "pass", dailyGoalMin: 20, onboardedAt: "2026-04-25T10:00:00Z"}})`.
**Then:** `getState().seq === 6`, `getState().profile.goal === "pass"`. Inne pola (`knowledge`, `cards`) zachowane bez zmian.
**Verification:** before/after snapshots; deep-equal pól nieobjętych patchem.

---

### TEST-SHELL-07: Subscribe / unsub — P1

**Given:** Shell z prefab state.
**When:** dwa moduły wywołują `subscribe(fn1)` i `subscribe(fn2)`. Następnie shell wykonuje `setState({streak: {count: 1, ...}})`.
**Then:** oba `fn1` i `fn2` są wywołane raz z nowym state. Po `unsub1()` i kolejnym `setState`, tylko `fn2` jest wywołane.
**Verification:** licznik wywołań w `fn1` (1) i `fn2` (2).

---

### TEST-SHELL-08: WCAG AA contrast — P1

**Given:** załadowany shell z renderem dashboardu.
**When:** uruchom axe-core (CDN devtools snippet) na `document`.
**Then:** zero violations dla reguły `color-contrast`.
**Verification:** `axe.run().then(r => r.violations.filter(v => v.id === "color-contrast"))` === [].

---

### TEST-SHELL-09: Keyboard nav full coverage — P1

**Given:** załadowany shell.
**When:** użytkownik naciska Tab przez wszystkie interaktywne elementy (4 nav buttony, settings toggle, export/import).
**Then:** każdy element otrzymuje widoczny focus (3px ring `#FFD166`); kolejność focusu naturalna (top→bottom, left→right). Esc zamyka modale.
**Verification:** manual trace + `document.activeElement` log po każdym Tab.

---

### TEST-SHELL-10: Export / Import roundtrip — P1

**Given:** state z profile, 5 cards, 2 sessions.
**When:** user klika "Eksportuj postęp" → pobiera plik `.json` → następnie "Importuj" tego samego pliku w fresh storage.
**Then:** zaimportowany state deep-equal do oryginalnego (wszystkie pola).
**Verification:** `JSON.stringify(stateBefore) === JSON.stringify(stateAfter)`.

---

### TEST-SHELL-11: Reduced motion respekt — P2

**Given:** `prefers-reduced-motion: reduce` w systemie.
**When:** shell renderuje przejście między widokami.
**Then:** żaden element nie ma transition > 0ms (CSS rule `* { transition-duration: 0ms !important; }` zaaplikowana).
**Verification:** `getComputedStyle(el).transitionDuration === "0s"` dla każdego z 5 testowanych elementów.

---

### TEST-SHELL-12: Mobile viewport <375px — P2

**Given:** DevTools mobile mode iPhone SE (375×667), zoom 100%.
**When:** wszystkie 4 widoki (Home, Quiz, Progress, Settings) są wyrenderowane.
**Then:** brak horizontal scrollu, wszystkie tap targets ≥44×44px, treść czytelna bez zoom.
**Verification:** `document.documentElement.scrollWidth <= window.innerWidth`; manual visual trace; `el.getBoundingClientRect()` dla każdego buttona ≥44.
