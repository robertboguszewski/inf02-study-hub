# CLAUDE.md

## Repo
INF.02 Study Hub — adaptive learning PWA dla polskiego egzaminu zawodowego INF.02 (Technik informatyk, CKE).

## Architektura
- **Spec-Driven Build** — 5-fazowy workflow z 9 agentami AI (patrz `.claude/skills/spec-driven-build/SKILL.md`)
- 5 single-file HTML artifacts (vanilla JS ES2017+) w `v3/artifacts/`
- 297 pytań w `v3/data/questions.json` (schema: `v3/contracts/schemas.json`)
- 12 scenariuszy praktycznych w `v3/data/scenarios.json`
- PWA: `sw.js` + `manifest.webmanifest`, hosting GitHub Pages

## Subagent configs (.claude/agents/)
- `architect.md` — Spec-Driven Architect (Faza 1: kontrakty + ADRs + tests)
- `builder.md` — TDD Builder (Faza 2: kod do zielonych testów)
- `reviewer.md` — Senior Code Reviewer (Faza 3 tech: 9 kryteriów)
- `domain-expert.md` — Domain Expert INF.02 (Faza 3 merit: pedagogia + Pareto)
- `integrator.md` — Integrator (Faza 5: walidacja + deploy)

## Skills (.claude/skills/)
- `spec-driven-build` — pełna metodologia 5-fazowa, 6 checkpointów
- `edu-domain-expert` — pedagogiczna ocena treści (CKE, ECDL, Cisco, Microsoft)

## Kluczowe reguły
1. **Schemas zamrożone** — `v3/contracts/schemas.json` v1.0; zmiana = bump v2
2. **Single-writer per plik** — Builder Matrix w `Architecture.md` sekcja 1.7
3. **Storage adapter** — `window.storage` → `localStorage` → memory (Architecture sec 1.2). NO direct `localStorage.*`
4. **Tests w `v3/tests/*.test.md`** — 175 testów, 88 P0 — manual trace przed PR
5. **CSP + WCAG AA + mobile-first + offline-first** — non-negotiable
6. **State writes** — tylko przez `INF02.shell.setState(patch)`, deep-merge + sequential
7. **<2500 LoC per artefakt** (margines do limitu Claude.ai Published 3000)

## Faza review (Faza 3)
- Format issue: P0/P1/P2 + Test + Lokalizacja + Obserwacja + Repro + Sugestia + Effort + Risk
- Reviewer NIE ufa Builder claims — weryfikuje manualnie (grep, trace, repro)
- Domain Expert sprawdza merytorykę, nie kod

## Cost tracking
~$25-50 dla pełnej iteracji v1.0 (premium tier). Patrz `PLAYBOOK.md` tabela kosztów.
Pro plan limity: ~45 wiad./5h Sonnet, ~15/5h Opus.

## Pełna metodologia
Patrz `PLAYBOOK.md` (root v3) — przewodnik Spec-Driven Build dla edu-domain.
