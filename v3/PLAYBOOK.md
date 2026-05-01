# PLAYBOOK — Spec-Driven Build

> Edukacyjna wersja metodologii Spec-Driven Build. Klonujesz ten template repo? Zacznij tu.

## Co to jest Spec-Driven Build

Spec-Driven Build to **5-fazowy workflow** budowy produktu (web app, PWA, narzędzie CLI) z 9 agentami AI (Anthropic Claude). Główne założenie: **kontrakty PRZED kodem, testy PRZED implementacją, multi-agent peer review PRZED deploy**.

Tradycyjne "vibe coding" z LLM produkuje kod, który **wygląda OK ale ma niewidoczne defekty** — schema drift, race conditions, naruszone konwencje branżowe, security holes. Spec-Driven Build odwraca kolejność: najpierw definiujesz **wykonywalne kontrakty** (JSON Schemas, design tokens, ADRs, TDD tests), potem N Builderów równolegle pisze kod, potem **brutalny peer review** (Senior Code Reviewer + Domain Expert), potem fix, dopiero wtedy ship.

Output: production-grade artefakt zamiast prototypu. Koszt: ~$25-50 dla pełnej iteracji v1.0.

## 5 faz

### Faza 0 — BRIEF (Orchestrator chat)
**Cel:** ustalić **wymagania, audience, pain points, top features, stack, DoD**.
**Output:** `BRIEF.md` z 8 sekcjami: typ produktu, audience, top 3 pain points, top 5 features (Pareto), stack + constraints, budget, konwencje branżowe, Definition of Done.
**Czas:** 30-60 min, **Sonnet** (chat orchestrator), ~$0.10.
**Checkpoint 0:** user sign-off briefu PRZED Fazą 1.

### Faza 1 — Architecture (Spec-Driven Architect)
**Cel:** wykonywalne kontrakty (schemas, tokens), TDD tests P0/P1/P2, ADRs, single-writer matrix.
**Output:** `Architecture.md` (sekcje 1.1-1.9), `contracts/schemas.json` (**FROZEN** po sign-off), `contracts/design-tokens.json`, `tests/<artifact>.test.md` per Builder.
**Czas:** 60-120 min, **Opus** (najwyższa jakość, decyzje są wykonywalne), ~$3.
**Checkpoint 1:** schemas zamrożone. Builderzy mogą startować Phase 2.

### Faza 2 — Builders TDD (N agentów równolegle)
**Cel:** każdy Builder pisze 1 artefakt do **zielonych P0 testów** (Red → Green → Refactor).
**Output:** `artifacts/<plik>` per Builder. Single-writer per plik (zero merge konfliktów).
**Czas:** 60-90 min per Builder, Sonnet, ~$4-5 per Builder.
**Checkpoint 2:** Builder reports P0 status. Pre-review.

### Faza 3 — Review (Senior Code Reviewer + Domain Expert, parallel)
**Cel:** brutalny peer review. Tech (kod) i merit (treść). Issues w formacie **P0/P1/P2 + Test + Lokalizacja + Obserwacja + Repro + Sugestia + Effort + Risk**.
**Output:** `reviews/review-final.md` (tech), `reviews/expert-*.md` (merit per topic).
**Czas:** 30-60 min per reviewer, Sonnet, ~$3-3.50.
**Checkpoint 3:** P0 lista do fixu. Decyzja shipowa.

### Faza 4 — Builder Fix (N agentów, scoped)
**Cel:** naprawić każdy P0 issue. **Bez nowych features**, bez schema drift.
**Output:** zaktualizowane `artifacts/*` + git commits per fix.
**Czas:** 30-60 min per Builder, Sonnet, ~$2 per fix.
**Checkpoint 4:** P0 zielone, P1 ≥80%.

### Faza 5 — Integration (Integrator)
**Cel:** walidacja E2E + pliki dla template repo (README, CLAUDE.md, agents, skills, examples) + deploy GitHub Pages.
**Output:** ~20 plików (8 user-facing + 12 template repo) + repo deployed.
**Czas:** 60-90 min, Sonnet, ~$2.50.
**Checkpoint 5:** DoD spełniony, ship.

## 6 elementów dobrego specu

Każda decyzja w `Architecture.md` zawiera:

1. **Outcome** — jaki stan osiągamy (1-2 zdania)
2. **Scope boundary** — czego NIE robimy (świadome out-of-scope)
3. **Constraint** — techniczne ograniczenia (dlaczego ta decyzja, nie inna)
4. **ADR (Prior decision)** — link do Architecture Decision Record (decyzja + alternatywa odrzucona + rationale)
5. **Task breakdown** — kto co implementuje (mapping do Builderów z sekcji 1.7)
6. **Verification** — TEST-XXX-NN, jak zmierzymy że spełnione

Decyzje są **wykonywalne**, nie sugestie. Builderzy w Fazie 2 nie podejmują żadnych decyzji architektonicznych.

## TDD principles (Red → Green → Refactor)

- **Red:** test napisany przed kodem, fail-uje (bo brak implementacji)
- **Green:** minimalny kod żeby przejść test (nic więcej)
- **Refactor:** wyczyść kod bez wpływu na testy

W Spec-Driven Build testy są zdefiniowane w **Fazie 1** przez Architecta, NIE Buildera. Builder **nie modyfikuje testów** — tylko kod. Format każdego testu:

```
### TEST-[ARTIFACT]-[NUM]: tytuł — P0/P1/P2

**Given:** stan początkowy
**When:** akcja użytkownika
**Then:** oczekiwany rezultat
**Verification:** jak zmierzyć (selektor DOM, console, axe rule)
```

**Priorytety:**
- **P0** — blocker. Failed P0 = no ship. DoD: 100%.
- **P1** — should-have. Cel ≥80%.
- **P2** — nice-to-have. Cel ≥50%.

## Multi-agent vs single-agent — kiedy używać

Anthropic Multi-Agent Research System (publikacja 2024) pokazuje: dla zadań z **wieloma niezależnymi sub-problemami**, multi-agent z orkiestracją 4-9 agentów ma **90.2% lepszy performance** niż single-agent (przy ~15× kosztu tokenów).

**Kiedy multi-agent (Spec-Driven Build domyślnie):**
- Projekt z >3 niezależnymi modułami (parallel build, single-writer per plik)
- Peer review wymaga zewnętrznej perspektywy (Reviewer ≠ Builder, brutalna szczerość)
- Domain expertise + tech expertise to osobne role (np. edu, medical, legal, finance)
- Budget >$10

**Kiedy single-agent:**
- Refactor 1 pliku, prosty bug fix
- Brief 1-zdaniowy ("dodaj button")
- Budget <$5

Spec-Driven Build = 9 agentów: Orchestrator (Faza 0) + Architect (Faza 1) + N Builders (Faza 2) + Reviewer + Domain Expert (Faza 3) + N Builder Fix (Faza 4) + Integrator (Faza 5).

## Recovery procedure (gdy agent padnie)

Konwersacja może paść (token limit, network, błąd modelu). **Pliki zostają.**

1. **Save state automatycznie:** wszystkie outputy są w plikach na dysku — `BRIEF.md`, `Architecture.md`, `artifacts/*`, `reviews/*`, `tests/*`. Conversation log nie jest source of truth.
2. **Resume from checkpoint:** otwórz nową konwersację. Załaduj kontekst: `CLAUDE.md` (zwięzłe instrukcje) → `BRIEF.md` (wymagania) → `Architecture.md` (truth source) → ostatni raport (np. `reviews/review-final.md`). Kontynuuj od ostatniego CP.
3. **Don't restart from scratch** — drogie ($50+ stracone, godzin pracy zaprzepaszczonych). Lepiej restart pojedynczego Buildera niż całej sesji.
4. **Pro plan limity:** ~45 wiadomości / 5h Sonnet, ~15 / 5h Opus. Zaplanuj **2-dniową sesję** dla projektów z 6+ Builderami. Faza 1 (Opus) zwykle pochłania pełen 5h limit.

## Cost tracking + Pro plan limits

| Faza | Agent | Model | Tokens (orient.) | Koszt |
|---|---|---|---|---|
| 0 | Orchestrator (chat) | Sonnet | 10k | $0.10 |
| 1 | Architect | **Opus 4.x** | 80k | $3.00 |
| 2 | N× Builder | Sonnet | N×140k | $4-5/Builder |
| 3 | Reviewer + Domain Expert | Sonnet | 2×130k | $7.50 |
| 4 | N× Builder Fix | Sonnet | N×60k | $2/fix |
| 5 | Integrator | Sonnet | 50k | $2.50 |
| **Total v1.0** (6 Builderów) | | | ~1.4M | **~$50** |

Skala mała (1-2 Builderów, prosty CLI/landing page): ~$10-15.
Skala duża (12+ Builderów, multi-domain): ~$120-200.

## Best practices

- **Keep CLAUDE.md <60 linii** (HumanLayer benchmark) — context bloat gubi context window dla kodu
- **Schemas freeze po sign-off Checkpoint 1** — `additionalProperties: false`, `$id` per schema. Zmiana = bump v2 + restart fazy
- **Single-writer per plik** — sekcja 1.7 Architecture = źródło prawdy, zero merge konfliktów
- **Każdy ADR ma "alternatywa odrzucona"** — dokumentuje trade-off dla future readers
- **Storage adapter pattern** dla projektów z persistencją: `window.storage` → `localStorage` → memory (3-poziomowy fallback)
- **Brutalna szczerość Reviewera** — Builder ego nie liczy się, P0 to P0. Reviewer NIE ufa Builder claims, weryfikuje manualnie (grep, repro, manual trace)
- **Domain Expert obowiązkowy** dla edu/medical/legal/finance — fakt-błąd ⇒ realna szkoda usera
- **Self-trace mentalny PRZED kodem** — Builder odpowiada na P0 testy mentalnie, dopiero potem pisze kod
- **`escapeHtml(str)` dla każdego user-controlled string** — XSS prevention by default

## Anti-patterns

- **Editing schema mid-Phase 4** — schemas frozen po CP1. Zmiana wymaga restartu fazy.
- **Builder skipping P0 self-trace** — "zacznę od kodu, dotrenuję" → instant rejection w Fazie 3.
- **Deploying without Phase 3 review** — production bugs, security holes, schema drift niewidoczne dla Buildera.
- **CLAUDE.md >60 linii** — context bloat, gubi prompt budget.
- **Multiple writers per file** — race conditions, merge conflicts. Sekcja 1.7 musi być jednoznaczna.
- **Skipping Domain Expert dla edu/medical/legal/finance** — fakt-błąd = realna szkoda.
- **`localStorage.setItem` poza storage adapter** — łamie 3-poziomowy fallback, fails w sandbox/incognito/quota-exceeded.
- **Inline event handlery (`onclick="..."`)** — łamią CSP, hard to test, hard to remove.
- **Modyfikacja `contracts/*` lub `data/*` w Fazie 2** — immutable po sign-off CP1.

## Następny krok

1. Stwórz nowy projekt: `gh repo create <name> --template <ten-repo>`
2. Edytuj `BRIEF.md` (Faza 0) zgodnie z `examples/BRIEF.example.md`
3. Sign-off Checkpoint 0 → uruchom Architect agent (`.claude/agents/architect.md`)
4. Output Fazy 1 zgodnie z `examples/Architecture.excerpt.md`
5. Sign-off Checkpoint 1 → uruchom N Builderów (`.claude/agents/builder.md`)
6. Faza 3 → review zgodnie z `examples/review.excerpt.md`
7. Faza 5 → Integrator deployuje na GitHub Pages

Powodzenia. Pamiętaj: **kontrakty przed kodem, testy przed implementacją, peer review przed deploy.**
