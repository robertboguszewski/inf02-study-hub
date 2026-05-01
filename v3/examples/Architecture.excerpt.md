# Architecture.excerpt.md — wzorzec output Fazy 1

> Fragment z `Architecture.md` projektu INF.02 Study Hub v3.
> Każda decyzja zawiera: **Outcome / Scope boundary / Constraint / Prior decision (ADR) / Task breakdown / Verification (TEST-XXX-NN)**.
> Decyzje są wykonywalne, nie sugestie. Schemas ZAMROŻONE po sign-off Checkpoint 1.

---

## 1.1 JSON Schemas (fragment)

**Outcome:** wszystkie struktury danych jednoznacznie definiowane przez JSON Schema draft 2020-12 z `additionalProperties: false`. Builder nie pisze nic, czego nie ma w `contracts/schemas.json`.
**Scope boundary:** schemas opisują persisted state + bank pytań + scenariusze. Nie opisują UI props ani DOM eventów.
**Constraint:** draft 2020-12 (wsparcie `$defs`, `unevaluatedProperties`). Walidacja runtime opcjonalna (`ajv` dev-only).
**Prior decision:** ADR-009 (immutable JSON bank), ADR-008 (migracja v2→v3).
**Task breakdown:** wszyscy Builderzy importują typy. BQ+BD: `Question`, `QuizSession`. BS: `Card`, `KnowledgeState`. BP: `PracticalScenario`. BSh: `AppState`, `UserProfile`, `Streak`, `Achievement`.
**Verification:** TEST-SHELL-01 (state hydrates w/o errors), TEST-SYS-PROMPT-03 (each schema has `$id`, no orphan `$ref`).

| Schema | $id (suffix) | Critical fields |
|---|---|---|
| `Question` | `/v3/Question` | `id` (`Q-NNNN`), `area` ∈ AREAS, `difficulty`, `q`, `options[4]`, `correct`, `explanation` |
| `Card` | `/v3/Card` | `qid`, `ease` (1.3..3.0), `interval`, `reps`, `lapses`, `due`, `learnStep` |
| `KnowledgeState` | `/v3/KnowledgeState` | `perArea` (record area→{accuracy, attempts, mastery}), `weakest`, `strongest`, `readinessForExam` |
| `AppState` | `/v3/AppState` | `version` ('3.0.0'), `profile`, `knowledge`, `cards`, `streak`, `achievements`, `sessions` |

---

## 1.5 Struktura plików

```
inf02-study-hub-v3/
├── BRIEF.md                            # Phase 0
├── Architecture.md                     # Phase 1 (ten dokument)
├── contracts/
│   ├── schemas.json                    # JSON Schema draft 2020-12, $id'd
│   ├── design-tokens.json              # colors / type / spacing / motion
│   └── curriculum-mapping.json         # MEN efekty → area codes
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
│   └── srs.html                        # Builder-SRS only
├── data/                               # immutable (ADR-009)
│   ├── questions.json                  # ≥250 pyt, schema Question
│   └── scenarios.json                  # ≥6 scenariuszy
├── reviews/                            # Phase 3 output
└── docs/
```

**Single writer per file enforced** (sekcja 1.7 Builder Matrix).

---

## 1.8 ADRs (wybrane)

### ADR-001: Multi-file artifact + shell orchestrator
**Decyzja:** 5-6 osobnych artefaktów `.html` orchestrowanych przez `shell.html`.
**Alternatywa odrzucona:** single-file ~3000 LoC (over limit Claude.ai Published, niemożliwy parallel build).

### ADR-003: Storage adapter (window.storage → localStorage → memory)
**Decyzja:** unified async API; każdy Builder importuje pattern z sekcji 1.2.
**Alternatywa odrzucona:** bezpośredni `localStorage` (brak fallback dla sandboxa Cowork + memory test).

### ADR-005: Knowledge model — EWMA per area, α=0.7
**Decyzja:** `knowledge[area] = α·old + (1-α)·correct`. Wagi quizu: weak slot `weight = (1 - knowledge[area])^2 + 0.01`, 70% weak / 30% strong (Bjork 1992 desirable difficulties).
**Alternatywa odrzucona:** Bayesian Knowledge Tracing (4 parametry per skill, overfit przy ~250 pyt).

### ADR-009: Question bank format — immutable JSON, embedded
**Decyzja:** `data/questions.json` embedowany do `shell.html` jako `<script type="application/json">`. Każde pytanie ma stable `id` (`Q-NNNN`), zero przepisań po release.
**Alternatywa odrzucona:** lazy-load fetch (wymaga serwera HTTP; offline-first naruszone).

---

**Sign-off Checkpoint 1:** schemas zamrożone, Builderzy mogą startować Phase 2.
