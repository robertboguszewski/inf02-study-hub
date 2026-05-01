# BRIEF.example.md — wzorzec output Fazy 0

> Sanitized fragment z `BRIEF.md` projektu INF.02 Study Hub v3.
> Pokazuje 8 obowiązkowych sekcji briefu Spec-Driven Build.

---

## 1. Typ produktu

**Adaptive learning PWA** dla polskiego egzaminu zawodowego INF.02 (Technik informatyk, CKE).
Refactor v2 (prototype, single-file) do production-grade v3 z metodologii Spec-Driven Build + TDD.

## 2. Audience

Uczniowie techników informatycznych klasy IV, **17-19 lat**. ~25-35 tys. zdających rocznie. Sesja referencyjna: lato 2026. Mobilny smartfon (główny) + komputer (dom/szkoła). Czas dziennie 15-45 min.

## 3. Top pain points (z user research)

- **P1 Brak ukierunkowania nauki** — chaotyczne testy, brak adaptacji.
- **P2 Niska retencja** — krzywa Ebbinghaus, brak SR.
- **P3 Strach przed praktyczną** (próg 75%, najwyższy odsiew).
- **P4 Brak motywacji** do codziennej nauki.

## 4. Top features (Pareto 80/20)

1. **Quiz CKE-style** (40 pyt × 60 min) — P0
2. **Adaptive engine** (diagnoza + weak-area targeting + knowledge model) — P0
3. **Symulator praktyczny** (150-min, scenariusze CKE) — P0
4. **Gamifikacja** (streak, achievements, plan, PWA) — P0
5. **Spaced Repetition SM-2** (fiszki) — P1

## 5. Stack + constraints

Frontend-only HTML/JS, single-file artifacts, **offline-first**.
Vanilla ES2017+, no transpiler, no build. **Storage adapter:** `window.storage` → `localStorage` → memory.
Hosting: GitHub Pages (free). PWA via Service Worker.

**Compliance:** zero PII (GDPR-clean, COPPA-friendly), MIT License, brak literalnego kopiowania CKE.

## 6. Budżet

Tier Premium ~$50 / 4-6h sesji. Faza 1 Opus, Fazy 2-5 Sonnet (6 Builderów + Reviewer + Domain + Integrator).

## 7. Konwencje branżowe

1. **Format CKE:** 40A-D × 60 min, próg 50%/75%.
2. **Podstawa programowa MEN INF.02:** wszystkie efekty pokryte proporcjonalnie.
3. **Polski język techniczny** (Microsoft PL, Cisco PL).
4. **Normy PN-EN:** PN-EN 50173-1:2018, BHP, prawo autorskie, RODO.

## 8. Definition of Done

| Kryterium | Próg |
|---|---|
| P0 testów | 100% |
| P1 testów | ≥80% |
| JS errors | 0 |
| WCAG AA | 100% |
| Pytań w bazie | ≥250 |
| LoC per artefakt | <2500 |
| Mobile <375px | działa, tap ≥44px |
| Offline | po pierwszym load |

---

**Status checkpointu 1:** sign-off blokuje Fazę 1 (Architecture).
