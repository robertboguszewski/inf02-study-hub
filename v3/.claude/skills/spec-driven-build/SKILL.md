---
name: spec-driven-build
description: 5-fazowy workflow Spec-Driven Build z 9 agentami AI. Buduj wykonywalne kontrakty (JSON Schemas, design tokens, testy P0/P1) PRZED kodem, używaj TDD, multi-agent peer review. 6 checkpointów z user sign-off, koszt ~$25-50 za pełną iterację v1.0.
---

# Spec-Driven Build Skill

## Motywacja

Tradycyjne "vibe coding" z LLM produkuje kod, który **wygląda OK ale ma niewidoczne defekty** — schema drift, race conditions, brak testów, niezgodność z konwencjami branżowymi. Spec-Driven Build odwraca kolejność: **kontrakty PRZED kodem**, **testy PRZED implementacją**, **multi-agent peer review PRZED deploy**.

Output: production-grade artefakt zamiast prototypu.

## 5 faz workflow

### Faza 0 — BRIEF (Orchestrator chat)
**Cel:** ustalić wymagania, audience, pain points, top features, stack, DoD.
**Output:** `BRIEF.md` z 8 sekcjami (typ produktu, audience, pain points, features, stack, budżet, konwencje, DoD).
**Czas:** 30-60 min, Sonnet, ~$0.10.
**Checkpoint 0:** user sign-off briefu PRZED Fazą 1.

### Faza 1 — Architecture (Spec-Driven Architect)
**Cel:** wykonywalne kontrakty (schemas, tokens), TDD tests, ADRs, single-writer matrix.
**Output:** `Architecture.md` (sekcje 1.1-1.9), `contracts/*.json` (schemas frozen!), `tests/*.test.md`.
**Czas:** 60-120 min, **Opus** (najwyższa jakość), ~$3.
**Checkpoint 1:** schemas zamrożone. Builderzy mogą startować.

### Faza 2 — Builders TDD (N agentów równolegle)
**Cel:** każdy Builder pisze 1 artefakt do zielonych P0 testów.
**Output:** `artifacts/<plik>` per Builder. Self-trace mentalny PRZED kodem.
**Czas:** 60-90 min per Builder, Sonnet, ~$4-5 per Builder.
**Checkpoint 2:** Builder reports P0 status. Pre-review.

### Faza 3 — Review (Senior Code Reviewer + Domain Expert, parallel)
**Cel:** brutalny peer review tech + merit. Issues w formacie P0/P1/P2 + Test + Lokalizacja + Repro + Sugestia.
**Output:** `reviews/review-final.md`, `reviews/expert-*.md`.
**Czas:** 30-60 min per reviewer, Sonnet, ~$3-3.50.
**Checkpoint 3:** P0 lista do fixu. Decyzja shipowa.

### Faza 4 — Builder Fix (N agentów, scoped)
**Cel:** naprawić każdy P0 issue. Bez nowych features, bez schema drift.
**Output:** zaktualizowane `artifacts/*` + git commits per fix.
**Czas:** 30-60 min per Builder, Sonnet, ~$2 per fix.
**Checkpoint 4:** P0 zielone, P1 ≥80%.

### Faza 5 — Integration (Integrator)
**Cel:** walidacja E2E + pliki dla template repo + deploy.
**Output:** README, LICENSE, CLAUDE.md, agents, skills, examples + deploy GitHub Pages.
**Czas:** 60-90 min, Sonnet, ~$2.50.
**Checkpoint 5:** DoD spełniony, ship.

## 6 elementów dobrego specu

Każda decyzja w `Architecture.md` zawiera:

1. **Outcome** — jaki stan osiągamy
2. **Scope boundary** — czego NIE robimy (świadome out-of-scope)
3. **Constraint** — techniczne ograniczenia (dlaczego ta decyzja, nie inna)
4. **ADR (Prior decision)** — link do Architecture Decision Record (decyzja + alternatywa odrzucona + rationale)
5. **Task breakdown** — kto co implementuje (mapping do Builderów)
6. **Verification** — TEST-XXX-NN, jak zmierzymy że spełnione

## TDD principles (Red → Green → Refactor)

- **Red:** test napisany przed kodem, fail-uje (bo brak implementacji)
- **Green:** minimalny kod żeby przejść test (nic więcej)
- **Refactor:** wyczyść kod bez wpływu na testy

W Spec-Driven Build testy P0/P1/P2 są zdefiniowane w Fazie 1 (przez Architect, NIE Buildera). Builder nie modyfikuje testów — tylko kod.

## Multi-agent vs single-agent

Anthropic Multi-Agent Research System (2024) pokazuje: dla zadań z **wieloma niezależnymi sub-problemami**, multi-agent z orkiestracją 4-9 agentów ma 90.2% lepszy performance niż single-agent (przy ~15× kosztu tokenów).

**Kiedy multi-agent:**
- Projekt z >3 niezależnymi modułami (parallel build)
- Peer review wymaga zewnętrznej perspektywy (Reviewer ≠ Builder)
- Domain expertise + tech expertise = osobne role

**Kiedy single-agent:**
- Refactor 1 pliku, prosty bug fix
- Brief jest 1-zdaniowy ("dodaj button")
- Budget <$5

Spec-Driven Build domyślnie multi-agent — 9 agentów (Orchestrator + Architect + N Builders + Reviewer + Domain Expert + N Builder Fix + Integrator).

## 6 checkpointów (user sign-off)

| CP | Po fazie | User decyduje |
|---|---|---|
| 0 | Brief (Faza 0) | Czy wymagania właściwe? Top features OK? |
| 1 | Architecture (Faza 1) | Schemas + ADRs OK? **Freeze**. |
| 2 | Builders (Faza 2) | P0 status zaakceptowany? |
| 3 | Review (Faza 3) | Które P0 fixujemy? Które P1 do v2? |
| 4 | Fix (Faza 4) | Re-review OK? |
| 5 | Integration (Faza 5) | DoD OK? Deploy now? |

## Recovery procedure (gdy agent padnie)

1. **Save state:** wszystkie outputy są w plikach (artefakty, raporty). Conversation może paść — pliki zostają.
2. **Resume from checkpoint:** otwórz nową konwersację, odczytaj `BRIEF.md` + `Architecture.md` + ostatni raport. Kontynuuj od ostatniego CP.
3. **Don't restart from scratch** — drogie ($50+ stracone). Lepiej restart pojedynczego Buildera niż całej sesji.
4. **Pro plan limity:** ~45 wiad./5h Sonnet, ~15/5h Opus. Zaplanuj 2-dniową sesję dla projektów z 6+ Builderami.

## Cost tracking (orientacyjnie)

| Faza | Agent | Model | Tokens | Koszt |
|---|---|---|---|---|
| 0 | Orchestrator | Sonnet | 10k | $0.10 |
| 1 | Architect | **Opus** | 80k | $3.00 |
| 2 | 6× Builder | Sonnet | 6×140k | $27 |
| 3 | Reviewer + Domain | Sonnet | 2×130k | $7.50 |
| 4 | 6× Builder Fix | Sonnet | 6×60k | $10 |
| 5 | Integrator | Sonnet | 50k | $2 |
| **Total** | | | ~1.4M | **~$50** |

Skala mała (1-2 Builderów, prosty projekt): ~$10-15.

## Anti-patterns

- **Editing schema mid-Phase 4** — schemas frozen po CP1. Zmiana = bump v2 + restart.
- **Builder skipping P0 self-trace** — "zacznę od kodu, dotrenuję" → instant rejection.
- **Deploying without Phase 3 review** — production bugs, security holes.
- **CLAUDE.md >60 linii** — context bloat (HumanLayer benchmark).
- **Multiple writers per file** — race conditions, merge conflicts. Single-writer matrix (Architecture sec 1.7) musi być jednoznaczny.
- **Skipping Domain Expert dla edu/medical/legal/finance content** — fakt-błąd ⇒ realna szkoda usera.

## Best practices

- **Keep CLAUDE.md <60 linii** (HumanLayer benchmark)
- **Schemas freeze po sign-off Checkpoint 1** — `additionalProperties: false`, `$id` per schema
- **Single-writer per plik** — sekcja 1.7 Architecture = źródło prawdy
- **Każdy ADR ma "alternatywa odrzucona"** — dokumentuje trade-off
- **Storage adapter pattern** dla projektów z persistencją (`window.storage` → `localStorage` → memory)
- **Brutalna szczerość Reviewera** — Builder ego nie liczy się, P0 to P0
