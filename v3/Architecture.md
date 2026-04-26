# Architecture — INF.02 Study Hub v3

**Wersja:** 1.0 (Faza 1, sign-off blokuje Fazę 2)
**Data:** 2026-04-25
**Author:** Spec-Driven Architect
**Status:** Schemas ZAMROŻONE po sign-off — każda zmiana = bump v2.

> Dokument referencyjny dla Builderów Fazy 2. Każda decyzja zawiera: outcome, scope boundary, constraint, prior decision (ADR), task breakdown, verification (TEST-XXX-NN). Decyzje są wykonywalne, nie sugestie.

---

## 1.1 JSON Schemas

**Outcome:** wszystkie struktury danych są jednoznacznie definiowane przez JSON Schema draft 2020-12 z `additionalProperties: false`. Builder nie pisze nic, czego nie ma w `contracts/schemas.json`.
**Scope boundary:** schemas opisują persisted state + bank pytań + scenariusze praktyczne. Nie opisują UI props, eventów DOM, ani statu sieci (offline-first, brak backendu).
**Constraint:** draft 2020-12, ponieważ wspiera `$defs`, `unevaluatedProperties`, `prefixItems`. Walidacja w produkcji opcjonalna (`ajv` jako dev-only); runtime używa kontraktu jako "single source of truth" dla TypeScript-like JSDoc.
**Prior decision:** ADR-009 (immutable JSON bank), ADR-008 (migration v2 → v3).
**Task breakdown:** wszyscy Builderzy importują typy. Builder-Quiz (BQ) i Builder-Diagnostic (BD) implementują `Question` i `QuizSession`; Builder-SRS (BS) — `Card`, `KnowledgeState`; Builder-Practical (BP) — `PracticalScenario`; Builder-Shell (BSh) — `AppState`, `UserProfile`, `Streak`, `Achievement`.
**Verification:** TEST-SHELL-01 (state hydrates w/o validation errors), TEST-SYS-PROMPT-03 (each schema has `$id`, no orphan `$ref`).

### Schema inventory

Pełne definicje w `contracts/schemas.json`. Skrót:

| Schema | $id (suffix) | Critical fields |
|---|---|---|
| `Question` | `/v3/Question` | `id` (string, format `Q-NNNN`), `area` ∈ AREAS, `difficulty` ∈ {easy, medium, hard}, `type` ∈ {mcq, fill}, `q`, `options` (4× MCQ \| null fill), `correct` (int 0..3 \| string \| string[]), `explanation`, `ckeRef?`, `mediaRef?`, `tags?` |
| `Card` | `/v3/Card` | `qid`, `ease` (1.3..3.0), `interval` (days, float ≥0), `reps` (int ≥0), `lapses` (int ≥0), `due` (ISO 8601), `learnStep` (int 0..3), `successStreak` (int ≥0) |
| `KnowledgeState` | `/v3/KnowledgeState` | `perArea` (record area→{accuracy:0..1, attempts:int, lastSeen:ISO\|null, mastery:0..1}), `weakest` (area[] ≤2), `strongest` (area[] ≤2), `readinessForExam` (0..1) |
| `UserProfile` | `/v3/UserProfile` | `pseudonim?` (string ≤24), `goal` ∈ {pass, ace, refresh}, `dailyGoalMin` (5..120), `examDate?` (ISO date), `onboardedAt` (ISO datetime). **Zero PII.** |
| `Streak` | `/v3/Streak` | `count` (int ≥0), `lastActiveDate` (ISO date \| null), `freezesAvailable` (int 0..2), `longestStreak` (int ≥0) |
| `Achievement` | `/v3/Achievement` | `id`, `title`, `desc`, `icon` (emoji-free SVG ID), `criteria` (typed: {type:'streak'\|'quizzes'\|'mastery'\|'practical', threshold, area?}), `unlockedAt?` |
| `QuizSession` | `/v3/QuizSession` | `sessionId` (uuidv4), `mode` ∈ {exam, adaptive, topic, review, diagnostic}, `questionIds` (string[]), `answers` (Answer[]), `startedAt`, `endedAt?`, `score?` (0..1), `isDiagnostic` (bool) |
| `PracticalScenario` | `/v3/PracticalScenario` | `scenarioId`, `title`, `area`, `durationSec` (int 60..9000), `steps` (Step[]), `rubric` (RubricItem[]), `totalPoints` (int) |
| `AppState` | `/v3/AppState` | `version` ('3.0.0'), `profile`, `knowledge`, `cards`, `streak`, `achievements`, `sessions` (last 50), `settings` (theme, reducedMotion, locale='pl-PL') |

### Cross-cutting `$defs`

- `Area` — enum string z `["B","O","N","P","D","L","W","6","V","Z","R"]` (11 obszarów)
- `Difficulty` — enum `["easy","medium","hard"]`
- `Rating` — enum int `[1,2,3,4]` (AGAIN, HARD, GOOD, EASY)
- `IsoDate` — string `format: date` (YYYY-MM-DD)
- `IsoDateTime` — string `format: date-time` (ISO 8601 UTC)
- `Answer` — `{qid, given (int|string), correct (bool), elapsedMs, ratingApplied? (1..4)}`
- `Step` — `{n (int), instruction, expectedAnswer? (string|string[]), pointsMax (int), kind ∈ {checkbox, fill, command, choose}}`
- `RubricItem` — `{criterion, points, autograde (bool)}`

### Wersjonowanie

- `AppState.version` semver-like. Migrations w shell, ADR-008.
- Zmiana required field = major (3 → 4); dodanie optional = minor.

---

## 1.2 API contracts + Storage adapter

**Outcome:** każdy Builder eksportuje czyste publiczne API z deterministycznym signature; brak globalnych mutacji państwa state z poziomu UI.
**Scope boundary:** API jest synchroniczne tam gdzie możliwe; storage jest async (Promise-based) bo tak wymaga `window.storage` Cowork. Brak streaming/observable.
**Constraint:** vanilla ES2017+; brak transpilera; brak modułów (ESM) w `<script>` artefaktów Claude.ai (single-file constraint dla Published artifacts). Każdy moduł rejestruje się w globalnej przestrzeni `INF02.<module>`.
**Prior decision:** ADR-001 (multi-file artifact + shell orchestrator), ADR-003 (storage adapter), ADR-005 (knowledge model EWMA).
**Task breakdown:** każdy Builder pisze wyłącznie do swojego artefaktu (sekcja 1.7). Shell (BSh) eksportuje storage + events; pozostali konsumują.
**Verification:** TEST-SHELL-04 (storage adapter selects correct kind), TEST-SHELL-05 (no direct localStorage outside shell), TEST-SYS-PROMPT-06 (every artifact registers global with `INF02.` prefix).

### Storage keys

| Key | Purpose | Writer | Mutability |
|---|---|---|---|
| `inf02.v3.state` | główny `AppState` | shell only | mutable, every write goes through shell setState |
| `inf02.v3.questions` | immutable bank pytań (cached) | shell only (load) | immutable po publikacji bundle |
| `inf02.v3.scenarios` | scenariusze praktyczne | shell only (load) | immutable |
| `inf02_progress_v2` | LEGACY (v2) | read-only | jednorazowy import, ADR-008 |

### Storage adapter (KOPIUJ DOKŁADNIE — wzorzec dla wszystkich Builderów)

```js
const storage = (function() {
  if (typeof window !== "undefined" && window.storage?.getItem) {
    return { kind: "claude", ...window.storage };
  }
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("__test__", "1"); localStorage.removeItem("__test__");
      return { kind: "local",
        getItem: (k) => Promise.resolve(localStorage.getItem(k)),
        setItem: (k, v) => Promise.resolve(localStorage.setItem(k, v)) };
    }
  } catch (_) {}
  // memory fallback
  const mem = new Map();
  return { kind: "memory",
    getItem: (k) => Promise.resolve(mem.get(k) ?? null),
    setItem: (k, v) => Promise.resolve(void mem.set(k, v)) };
})();
```

**OBOWIĄZKOWE:** każdy artefakt MUSI używać tego adaptera. NO direct `localStorage.*`. Builder Reviewer odrzuca PR z `localStorage.setItem` lub `localStorage.getItem` poza tą sekcją.

### Public APIs per module

#### `INF02.shell` (Builder-Shell)
- `init(): Promise<AppState>` — wczytuje state, hydrata profil, rejestruje listenerów keyboard
- `getState(): AppState` (read-only snapshot, frozen via `Object.freeze`)
- `setState(patch: PartialAppState): Promise<AppState>` — merge + persist
- `subscribe(fn: (state) => void): unsub`
- `route(view: string, params?: object)` — naviguje między widokami
- `migrateFromV2(): Promise<boolean>` — jednorazowa migracja (ADR-008)
- `exportState(): string` (JSON)
- `importState(json: string): Promise<{ok, errors}>`

#### `INF02.quiz` (Builder-Quiz)
- `startSession({mode, questionIds, durationSec?}): QuizSession`
- `submitAnswer(sessionId, qid, given): Answer`
- `endSession(sessionId): {score, perArea, durationActual}`
- `getActiveSession(): QuizSession | null`

#### `INF02.diagnostic` (Builder-Diagnostic) — **OWNS adaptive engine**
- `selectDiagnosticQuestions(pool, n=12): Question[]` (1 easy + 1 medium + 1 hard per area, cap 12 — proporcjonalnie do priorytetów obszarów)
- `markDiagnosisComplete(results): KnowledgeState`
- `selectAdaptiveQuestions(pool, n, knowledge): Question[]` (70% weak, 30% strong per ADR-005)
- `updateKnowledge(area, correct, knowledge): KnowledgeState` — EWMA α=0.7
- `getKnowledgeReport(knowledge): {areas, weakest, strongest, readinessForExam}`

#### `INF02.srs` (Builder-SRS)
- `RATING = {AGAIN:1, HARD:2, GOOD:3, EASY:4}`
- `rateCard(card, rating, area, now=Date.now()): Card` — pure, SM-2 + soft lapse (ADR-004)
- `getDueCards(cards, now=Date.now()): Card[]` — sorted by due
- `recordRating(qid, rating, area): Promise<{card, knowledge}>` — wrapper persisting via shell
- `getQueueSize(now): number`

#### `INF02.practical` (Builder-Practical)
- `loadScenarios(): Promise<PracticalScenario[]>`
- `startScenario(scenarioId): {sessionId, startedAt, durationSec}`
- `submitStep(sessionId, stepN, answer): {correct, pointsAwarded, feedback}`
- `endScenario(sessionId): {totalPoints, percent, passed (≥75%)}`

### I/O format eksportu

```json
{
  "version": "3.0.0",
  "exportedAt": "2026-04-25T12:34:56Z",
  "appState": { /* full AppState */ }
}
```

Import: walidacja `version` major (3.x.x → ok, 2.x.x → run migration, ≥4 → reject z błędem). Plik `.json`, MIME `application/json`.

---

## 1.3 Design system

**Outcome:** spójny visual language między 6 artefaktami; WCAG AA gwarantowane przez tokens; mobile-first od 375px.
**Scope boundary:** brak dark mode toggle w v3 (auto via `prefers-color-scheme`). Brak custom font hosting (system stack). Brak ikonografii bitmapowej.
**Constraint:** zero zewnętrznych zależności CSS (no Tailwind, no Bootstrap). Wszystko w design tokens + vanilla CSS w każdym artefakcie. Tokens duplikowane w pliku artefaktu (single-file constraint), ale pochodzą z `contracts/design-tokens.json`.
**Prior decision:** ADR-002 (no CDN dla CSS), ADR-007 (pl-PL only).
**Task breakdown:** każdy Builder kopiuje tokens do `:root` swojego artefaktu, używa tylko CSS variables.
**Verification:** TEST-SHELL-08 (axe-core: 0 contrast violations), TEST-QUIZ-09 (focus ring visible 3px), TEST-SYS-PROMPT-08 (tap targets ≥44px).

### Kolory (HEX, WCAG AA)

| Token | HEX | Para | Contrast vs |
|---|---|---|---|
| `--color-bg` | `#0F1115` | dark base | white text 16.8:1 ✅ |
| `--color-surface` | `#1A1D24` | card | white 14.2:1 ✅ |
| `--color-surface-2` | `#252932` | elevated | |
| `--color-text` | `#F2F4F7` | primary | bg 16.8:1 ✅ |
| `--color-text-muted` | `#A8B0BD` | secondary | bg 7.4:1 ✅ |
| `--color-border` | `#2E3340` | divider | |
| `--color-accent` | `#5EA9FF` | primary CTA | bg 8.1:1 ✅ |
| `--color-accent-fg` | `#0F1115` | text on accent | accent 8.1:1 ✅ |
| `--color-success` | `#3DDC97` | correct | bg 11.2:1 ✅ |
| `--color-warning` | `#FFB454` | hard | bg 10.1:1 ✅ |
| `--color-danger` | `#FF6B6B` | wrong/again | bg 6.9:1 ✅ |
| `--color-focus` | `#FFD166` | focus ring | bg 12.4:1 ✅ |

### Kolory obszarów (11) — fg/bg pairs (WCAG AA ≥4.5:1)

| Code | Area | bg | fg | Contrast |
|---|---|---|---|---|
| B | Budowa komputera | `#1F3A5F` | `#A9D5FF` | 7.8:1 |
| O | Systemy operacyjne | `#3F2A5F` | `#D5B8FF` | 7.2:1 |
| N | Sieci komputerowe | `#1F4F3F` | `#9BEBC9` | 8.0:1 |
| P | Peryferia | `#5F3F1F` | `#FFCC9B` | 6.8:1 |
| D | Diagnostyka | `#5F1F2F` | `#FFB0B8` | 6.5:1 |
| L | Prawo, BHP, licencje | `#4F4F1F` | `#E6E0A8` | 7.0:1 |
| W | Windows Server | `#1F4F5F` | `#A8DCE6` | 7.5:1 |
| 6 | IPv6 i routing | `#2F1F5F` | `#B8B0FF` | 6.9:1 |
| V | Wirtualizacja, backup | `#1F5F4F` | `#9BD9C7` | 7.2:1 |
| Z | Bezpieczeństwo | `#5F2F4F` | `#FFB0DC` | 6.4:1 |
| R | Praktyka CKE | `#3F3F3F` | `#E0E0E0` | 7.8:1 |

Wszystkie pary mierzone WCAG 2.1 AA dla normal text (≥4.5:1) — najniższy 6.4:1, margines bezpieczeństwa zachowany.

### Typografia

- **Font stack:** `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`
- **Mono:** `ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", Consolas, monospace` (dla CLI/CIDR)
- **Skala:** major third (1.250)
  - `--fs-xs`: 0.8rem (12.8px)
  - `--fs-sm`: 1rem (16px) — base
  - `--fs-md`: 1.25rem (20px)
  - `--fs-lg`: 1.563rem (25px)
  - `--fs-xl`: 1.953rem (31.25px)
  - `--fs-2xl`: 2.441rem (39px)
- **Line-heights:** body 1.55, headings 1.2

### Spacing (8px base)

`--sp-xs:4 --sp-sm:8 --sp-md:16 --sp-lg:24 --sp-xl:32 --sp-2xl:48 --sp-3xl:64`

### Breakpoints (mobile-first)

`--bp-sm: 375px --bp-md: 768px --bp-lg: 1024px`

Media queries: `@media (min-width: 768px)` etc. NO `max-width` queries (ADR design).

### Motion

```
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--dur-fast: 120ms;
--dur-base: 200ms;
--dur-slow: 320ms;
```

**Reduced motion:** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0ms !important; transition-duration: 0ms !important; } }` — obowiązkowe w każdym artefakcie.

### Focus styles

```css
*:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Elevation (shadows)

- `--shadow-1`: `0 1px 2px rgba(0,0,0,0.4)`
- `--shadow-2`: `0 4px 12px rgba(0,0,0,0.5)`
- `--shadow-3`: `0 12px 32px rgba(0,0,0,0.6)`

### Tap targets

Minimum **44×44 px** (Apple HIG, WCAG 2.5.5). Buttons: `min-height: 44px; min-width: 44px; padding: 12px 16px;`.

---

## 1.4 Konwencje

**Outcome:** zero ambiguity w danych egzaminacyjnych; każdy Builder formatuje daty/CIDR/terminologię tak samo.
**Scope boundary:** tylko pl-PL; brak abstrakcji i18n (ADR-007).
**Constraint:** UTF-8 NFC dla polskich znaków; każde porównanie tekstów (np. fill-in) używa `String.prototype.normalize('NFC')` przed comparem.
**Prior decision:** ADR-007 (i18n locked pl-PL), Brief sekcja 7.
**Verification:** TEST-QUIZ-12 (polskie znaki match: "łącze" == "łącze" NFC), TEST-DIAG-09 (CIDR notation valid).

### i18n

- **Locale:** `pl-PL` only.
- **Format dat:** storage = ISO 8601 (`2026-06-12T08:00:00Z`); display = `dd.MM.yyyy` (`12.06.2026`) lub relative (`za 3 dni`, `wczoraj`).
- **Liczby:** separator dziesiętny przecinek (`8,5 GB`); grupowanie tysięcy spacją (`1 024 MB`).
- **Czas trwania:** `mm:ss` dla quizu (`59:34`), `Xh Ym` dla planu tygodniowego.

### Notacja sieciowa

- CIDR: `192.168.5.128/26` (slash notation, no spaces)
- Maska dotted decimal: `255.255.255.192`
- IPv6: lowercase, RFC 5952 canonical (`2001:db8::1428:57ab` — `::` raz, leading zeros usunięte)
- MAC: `aa:bb:cc:dd:ee:ff` (lowercase, dwukropki)

### Polskie znaki

- Wszystkie pliki UTF-8 NFC (`encoding="UTF-8"` meta).
- Walidacja fill-in: normalizacja `s.normalize('NFC').toLowerCase().trim()`. Dla "tolerant match" (ADR z v2): mapowanie diakrytyk na bez-diakrytyk jako fallback (ą→a, ć→c, etc.) — accept oba warianty.

### Mini-słownik terminologii (PL)

20 terminów, MS Polska + Cisco PL:

| EN | PL preferred | Notes |
|---|---|---|
| host (network) | host / urządzenie | nie "gospodarz" |
| switch | przełącznik | nie "switch" w testach |
| router | router | utrwalone |
| gateway | brama | "brama domyślna" |
| subnet | podsieć | |
| subnet mask | maska podsieci | |
| broadcast | rozgłaszanie / adres rozgłoszeniowy | |
| firewall | zapora (sieciowa / ogniowa) | |
| domain controller | kontroler domeny (DC) | |
| forest | las | AD DS |
| organizational unit | jednostka organizacyjna (OU) | |
| group policy | zasady grupy (GPO) | |
| trust relationship | relacja zaufania | |
| failover | przełączanie awaryjne | |
| load balancing | równoważenie obciążenia | |
| cache | pamięć podręczna / cache | mixed |
| driver | sterownik | |
| patch | poprawka / łatka | |
| update | aktualizacja | |
| backup | kopia zapasowa | nie "backup" w testach |

### CKE format

- Pisemny: 40 pyt × 60 min × próg 50% (20/40 pkt). Każde pytanie 1 punkt, 4 odpowiedzi (A-D), jedna poprawna.
- Praktyczny: 1 zadanie × 150 min × próg 75%. Punktacja rubryczna.
- Brak pytań wielokrotnego wyboru, brak true/false, brak essay.
- Disclaimer w UI: "Pytania w stylu CKE własnego autorstwa. Nie są kopią arkuszy egzaminacyjnych."

### Normy

Każde pytanie z obszaru L (Prawo, BHP) ma `ckeRef` wskazujący normę:
- `PN-EN 50173-1:2018` (okablowanie strukturalne)
- `Rozporz. MPiPS 1.12.1998 BHP monitor` (czas pracy)
- `Ustawa o prawie autorskim 4.02.1994` (licencje OEM/BOX/CAL/Volume/GPL)
- `RODO (UE 2016/679)`
- `Ustawa o ZSEE 11.09.2015`

---

## 1.5 Struktura plików

```
inf02-study-hub-v3/
├── BRIEF.md                            # source of requirements (Phase 0)
├── Architecture.md                     # ten dokument (Phase 1)
├── contracts/
│   ├── schemas.json                    # JSON Schema draft 2020-12, $id'd
│   ├── design-tokens.json              # colors / type / spacing / motion
│   └── curriculum-mapping.json         # MEN INF.02 efekty → area codes
├── tests/
│   ├── shell.test.md                   # 12 testów P0/P1/P2
│   ├── quiz.test.md                    # 13 testów
│   ├── diagnostic.test.md              # 12 testów
│   ├── practical.test.md               # 13 testów
│   ├── srs.test.md                     # 12 testów
│   └── system-prompt.test.md           # 11 testów (cross-cutting)
├── artifacts/                          # Phase 2 output (puste w Phase 1)
│   ├── shell.html                      # Builder-Shell only
│   ├── quiz.html                       # Builder-Quiz only
│   ├── diagnostic.html                 # Builder-Diagnostic only
│   ├── practical.html                  # Builder-Practical only
│   ├── srs.html                        # Builder-SRS only
│   └── system-prompt.md                # Builder-SystemPrompt only
├── data/                               # immutable (ADR-009)
│   ├── questions.json                  # ≥250 pyt, schema Question
│   └── scenarios.json                  # ≥6 scenariuszy, schema PracticalScenario
└── docs/
    └── (generated post-Phase-2)
```

**Single writer per file enforced** (sekcja 1.7).

---

## 1.6 TDD test scenarios

**Outcome:** każdy artefakt ma 11-13 testów (Given/When/Then), z których ≥3 to P0 (blocker DoD).
**Scope boundary:** testy są manual-trace + automated gdzie możliwe. Brak headless browser CI w v3 (out of scope).
**Constraint:** każdy test musi mieć **Verification** mierzalne (selektor DOM, console assert, axe-core rule).
**Prior decision:** Brief sekcja 8 (DoD: 100% P0, ≥80% P1).
**Task breakdown:** Reviewer (Phase 3) wykonuje wszystkie testy. Builder Fix (Phase 4) naprawia failed P0 + P1.
**Verification:** TEST-SYS-PROMPT-01 (test count per artifact ≥10, P0 ≥3).

### Priority semantics

- **P0** — blocker. Failed P0 = no ship. DoD: 100%.
- **P1** — should-have. Cel ≥80% (Brief).
- **P2** — nice-to-have. Cel ≥50%.

Format każdego testu w plikach `tests/<artifact>.test.md`:

```
### TEST-[ARTIFACT]-[NUM]: tytuł — P0/P1/P2

**Given:** stan początkowy
**When:** akcja użytkownika
**Then:** oczekiwany rezultat
**Verification:** jak zmierzyć (selektor, console, axe rule)
```

Total testów: **73** (Shell 12 + Quiz 13 + Diagnostic 12 + Practical 13 + SRS 12 + System-Prompt 11) + **PWA tests do dopisania w Phase 2 przez BPWA** (target: ≥8 testów, ≥3 P0). P0: 28+. P1: 30+. P2: 15+.

---

## 1.7 Komunikacja inter-agent

**Outcome:** zero merge konfliktów; każdy plik ma DOKŁADNIE jednego writera.
**Scope boundary:** Builderzy mogą czytać dowolny `contracts/*` i `data/*`, ale piszą tylko do swojego `artifacts/*`. Cross-artifact communication przez `INF02.shell` events (publish/subscribe).
**Constraint:** Claude.ai Published artifact limit ≤3000 LoC, więc każdy artefakt <2500 LoC (margines).
**Prior decision:** ADR-001 (multi-file).
**Verification:** TEST-SYS-PROMPT-04 (`wc -l artifacts/*.html` < 2500), TEST-SYS-PROMPT-05 (no two PRs touch same artifact).

### Single-writer matrix

| Artifact | Builder | Pisze do | Czyta z |
|---|---|---|---|
| Shell + state mgmt + routing + import/export + migrations | **Builder-Shell** (BSh) | `artifacts/shell.html` | `contracts/schemas.json`, `contracts/design-tokens.json`, all data |
| Quiz UI (3 modes: exam/adaptive/topic/review) + answer flow | **Builder-Quiz** (BQ) | `artifacts/quiz.html` | `contracts/schemas.json`, `contracts/design-tokens.json`, `data/questions.json` |
| Diagnostic onboarding (12-q) + adaptive engine + knowledge dashboard | **Builder-Diagnostic** (BD) | `artifacts/diagnostic.html` | `contracts/schemas.json`, `contracts/design-tokens.json`, `contracts/curriculum-mapping.json`, `data/questions.json` |
| Practical scenario simulator (timer + checklist + rubric scoring) | **Builder-Practical** (BP) | `artifacts/practical.html` | `contracts/schemas.json`, `contracts/design-tokens.json`, `data/scenarios.json` |
| SRS card scheduler + flashcard UI + daily queue | **Builder-SRS** (BS) | `artifacts/srs.html` | `contracts/schemas.json`, `contracts/design-tokens.json`, `data/questions.json` |
| System prompt + Reviewer brief + Builder onboarding doc | **Builder-SystemPrompt** (BSP) | `artifacts/system-prompt.md` | wszystko inne |
| **PWA** — manifest.webmanifest + sw.js + icons (Checkpoint 1 promotion) | **Builder-PWA** (BPWA) | `artifacts/manifest.webmanifest`, `artifacts/sw.js`, `artifacts/icons/*` | `contracts/design-tokens.json` (pwa block), `contracts/schemas.json` |

### Communication channel

`INF02.shell.events` (CustomEvent-based pubsub):
- `state:changed` (payload: prevState, nextState, patch)
- `quiz:ended` (payload: sessionId, score, perArea)
- `diag:completed` (payload: knowledge)
- `srs:rated` (payload: qid, rating, card)
- `practical:ended` (payload: scenarioId, score, passed)
- `nav:request` (payload: view, params)

Every Builder MUST emit events; never directly mutate state of another module.

---

## 1.8 ADRs

Każdy ADR: 1-2 zdania uzasadnienia + alternatywa odrzucona.

### ADR-001: Multi-file artifact + shell orchestrator
**Decyzja:** 6 osobnych artefaktów `.html` orchestrowanych przez `shell.html`. Alternatywa odrzucona: single-file ~3000 LoC (over limit Claude.ai Published, niemożliwy parallel build). Każdy artefakt może być inkludowany w finalnym single-file v3 podczas Integratora (Phase 5) przez prostą konkatenację `<section>` z guarded global registration.

### ADR-002: CDN whitelist (REVISED Checkpoint 1 — Chart.js allowed)
**Decyzja:** Chart.js v4.5.0 z `cdn.jsdelivr.net` z obowiązkowym SRI hash + `crossorigin="anonymous"`. Vanilla SVG dla prostszych wizualizacji (sparklines, micro bars, knowledge area chips). Wszystkie inne biblioteki niedozwolone.
**SRI hash:** `sha384-iU8HYtnGQ8Cy4zl7gbNMOhsDTTKX02BTXptVP/vqAWIaTfM7isw76iyZCsjL2eVi`
**Snippet:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.js"
  integrity="sha384-iU8HYtnGQ8Cy4zl7gbNMOhsDTTKX02BTXptVP/vqAWIaTfM7isw76iyZCsjL2eVi"
  crossorigin="anonymous"></script>
```
**Rationale:** User decyzja Checkpoint 1 — bogate wykresy (radar knowledge per area, doughnut readiness, line trends quizów). Single-origin CDN minimalizuje attack surface.
**Constraint:** Service Worker (ADR-006) MUSI cache'ować Chart.js przy pierwszym install dla offline-first.
**Alternatywa ODRZUCONA (była P0 v1):** vanilla SVG only — odrzucona ze względu na 150+ LoC custom chart code per artefakt × 6 = duplication overhead.

### ADR-003: Storage adapter (window.storage → localStorage → memory)
**Decyzja:** unified async API; każdy Builder importuje patternem z sekcji 1.2. Alternatywa odrzucona: bezpośredni `localStorage` (brak fallback dla Cowork sandbox + memory test).

### ADR-004: Adaptive engine algorithm — SM-2 + 4-rating + soft lapse
**Decyzja:** Wozniak 1990 SM-2 (`ease ∈ [1.3, 3.0]`, learning steps `[1m, 10m, 1d, 3d]`) z 4-button mapping (Anki-style: AGAIN/HARD/GOOD/EASY). Soft lapse: `interval *= 0.2` (min 10 min) zamiast reset (Ye 2023 FSRS, lepszy retention). Alternatywa odrzucona: Leitner 5-box (zbyt prosty, niedopasowany do indywidualnego ease) i czysty FSRS (skomplikowany dla audience nieletniej).

### ADR-005: Knowledge model — EWMA per area, α=0.7
**Decyzja:** `knowledge[area] = α·old + (1-α)·correct`, gdzie α=0.7 (Brief). Wagi quizu: weak slot `weight = (1 - knowledge[area])^2 + 0.01`, 70% weak / 30% strong (recency rehearsal, Bjork 1992 desirable difficulties). Alternatywa odrzucona: Bayesian Knowledge Tracing (4 parametry per skill, overfit przy ~250 pyt).

### ADR-006: PWA (REVISED Checkpoint 1 — promoted to P0)
**Decyzja:** PWA jest pełnoprawnym artefaktem v3 — **Builder #7 (Builder-PWA / BPWA)** produkuje:
- `manifest.webmanifest` — name, short_name, description, theme_color, icons (192/512/maskable), display=standalone, start_url=/shell.html, scope=/
- `sw.js` — Service Worker, cache strategy `cache-first` dla 6 artefaktów + Chart.js CDN, `stale-while-revalidate` dla `data/*.json`
- `icons/` — set 192/512/maskable jako SVG + PNG fallback
- Bootstrap snippet w `shell.html`: `if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js')`

**Rationale:** User decyzja Checkpoint 1 — instalacja na telefon (Add to Home Screen), pełen offline-first nawet przy pierwszym braku sieci, opcjonalne push notifications dla streak (post-launch).
**Strategy:** Cache-first dla assets, network-first z timeout fallback dla update check (sw.js version bump = `CACHE_VERSION`).
**Constraint:** Manifest scope musi obejmować wszystkie 6 artefaktów. Update mechanism: prompt user przy detekcji nowej wersji SW.
**Alternatywa ODRZUCONA (była P1 v1):** post-launch — odrzucona, user wybrał native install experience jako must-have.

### ADR-007: i18n — pl-PL only, no abstraction
**Decyzja:** stringi w UI hardcoded po polsku. Brak `t('key')` wrappera. Alternatywa odrzucona: i18next/własny i18n (Brief sekcja 9 — "Multi-language out of scope").

### ADR-008: Migration path z v2 (REVISED Checkpoint 1 — full migration)
**Decyzja:** funkcja `INF02.shell.migrateFromV2()` wykonuje **PEŁNĄ** migrację `inf02_progress_v2` → `inf02.v3.state`. Mapping wszystkich pól v2:
- v2 `knowledge` (5 areas: B/O/D/S/U) → v3 `knowledge.perArea` (11 areas): `B→B, O→O, D→D, S→{N,6,W avg}, U→{P,V,Z avg}, L→0.5 default, R→0.5 default`
- v2 `cards` → v3 `cards` (1:1 + dodaj `successStreak: 0`, `learnStep: card.learningStep`)
- v2 `stats.quizzes` (historia) → v3 `sessions[]` z mapping `{quizId→sessionId, finishedAt→endedAt, score, total, mode:'exam'}`
- v2 `achievements.unlocked` → v3 `achievements[]` (1:1)
- v2 `streak` → v3 `streak` (1:1)
- v2 `workedExampleProgress`, `subnettingOk` → v3 `subnetting` (counter)
- v2 `profile` (jeśli istnieje) → v3 `profile` (zachowaj `pseudonim` jeśli jest, drop wszelkie inne dane PII)

**Rationale:** User decyzja Checkpoint 1 — kontynuacja postępów dla istniejących userów v2. Zero data loss policy.
**Edge cases:** v2 schema fields nieobecne w v3 → drop z logiem `console.info`; v3 fields nieobecne → defaults z `schemas.json`. v2 quiz history zachowana niezmieniona z `mode:'exam-v2-legacy'` flag.
**Backup:** klucz `inf02_progress_v2` zachowany read-only (user może chcieć fallback).
**Verification:** TEST-SHELL-08 (migracja E2E z mock v2 state).
**Alternatywa ODRZUCONA (była "drop history" v1):** drop quiz history — odrzucona, user wybrał pełną kontynuację.

### ADR-009: Question bank format — immutable JSON, embedded
**Decyzja:** `data/questions.json` (≥250 pyt) embedowany do `shell.html` jako `<script type="application/json" id="qbank">` przy build. Każde pytanie ma stable `id` `Q-NNNN` (4-digit), zero przepisań po release. Alternatywa odrzucona: lazy-load fetch (wymaga serwera HTTP; offline-first naruszone).

### ADR-010: Practical scenarios — rubric-based scoring
**Decyzja:** każdy scenariusz ma `steps[]` (instruction + expectedAnswer) i `rubric[]` (criterion + points + autograde flag). Autograded steps (np. CIDR fill, command typing) liczone automatycznie; manual rubric items wymagają self-assessment z checklistą. Threshold pass = 75% (Brief). Alternatywa odrzucona: punktacja binarna pass/fail (zbyt grube, nie odpowiada CKE).

---

## 1.9 Top 5 ryzyk przed Fazą 2

| # | Ryzyko | Prawdopodobieństwo | Wpływ | Mitigation |
|---|---|---|---|---|
| 1 | **Schema drift** — Builder modyfikuje strukturę `Question` lokalnie, niezgodnie z `schemas.json` | wysokie | wysoki (cały pipeline padnie) | (a) `contracts/schemas.json` ZAMROŻONY po sign-off Checkpoint 1; (b) Reviewer Phase 3 grepuje za `additionalProperties` na każdym artefakcie; (c) BSP system-prompt zawiera explicit "DO NOT extend Question schema" |
| 2 | **Storage adapter inconsistency** — jeden Builder pisze direct `localStorage` lub używa innego klucza niż `inf02.v3.state` | średnie | wysoki (state corruption / no persistence) | (a) Jeden writer dla state = Builder-Shell (sekcja 1.7); (b) inne Buildery używają tylko `INF02.shell.setState(patch)`; (c) Reviewer grep `localStorage\.|sessionStorage\.` poza Shell artefaktem = reject |
| 3 | **State mutation race** — równoległe `setState` z 2 modułów (np. quiz end + srs rate) tracą część patch | średnie | średni | (a) `setState` w Shell jest sekwencyjny (await chain); (b) patche merge przez `Object.assign` deep dla `cards` i `knowledge.perArea`; (c) wersjonowanie state z `seq: int++` — przyrostowy licznik, conflict detection |
| 4 | **Question bank quality** — <250 pyt, nieproporcjonalne pokrycie obszarów, błędy merytoryczne | średnie | wysoki (DoD fail) | (a) Domain Expert review w Phase 3; (b) 11 obszarów ma minimum proporcji (sekcja 1.4 "CKE format" + curriculum mapping); (c) automated count per area w TEST-SYS-PROMPT-09 |
| 5 | **Artefakt > 2500 LoC** — Builder przekracza limit, naruszenie Claude.ai Published cap | średnie | średni (ship blocker) | (a) Każdy Builder testuje `wc -l` przed PR; (b) refactor: `<style>` minified po deploy; (c) duplikat kodu między artefaktami (utility functions) — niezbędny koszt single-file constraint, akceptowalny |

---

**Sign-off Checkpoint 1:** schemas zamrożone, Builderzy mogą startować Phase 2.
