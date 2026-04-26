# BRIEF — INF.02 Study Hub v3

**Wersja:** 1.0
**Data:** 2026-04-25
**Status:** Faza 0 zakończona, oczekiwanie na sign-off Checkpoint 1
**Predecessor:** v2 (`/Users/robertboguszewski/projects/INF02/inf02-study-hub-v2.html`, 230 pyt, 11 obszarów)

---

## 1. Typ produktu

**INF.02 Study Hub v3** — refactor v2 z prototype do production-grade w metodologii **Spec-Driven Development** z TDD.

Aplikacja webowa do nauki do polskiego egzaminu zawodowego **INF.02 — Administracja i eksploatacja systemów komputerowych, urządzeń peryferyjnych i lokalnych sieci komputerowych** (kwalifikacja Technik informatyk, CKE).

**Co zmienia v3 vs v2:**
- Kontrakty (JSON Schemas) zamiast ad-hoc struktur
- TDD — testy P0/P1/P2 PRZED kodem
- Architektura modułowa: jeden writer per plik, wykonywalne ADRs
- WCAG AA + mobile-first audyt
- Production deploy: GitHub Pages + auto-deploy CI/CD

---

## 2. Grupa docelowa

**Pierwotna persona:** Uczniowie techników informatycznych klasy IV, **17-19 lat**.

**Statystyki rynku (2025/2026):**
- ~25-35 tys. zdających rocznie (sesja zima + lato)
- Sesja referencyjna: lato 2026 (egz. pisemny 02-11.06, praktyczny 12-18.06)
- Próg zdawalności: pisemny 50%, **praktyczny 75%** (najwyższy odsiew)

**Kontekst nauki:**
- 1-3 miesięce do egzaminu (high stakes)
- Poziom techniczny: średni (kurs szkolny + samodzielna)
- Urządzenia: smartfon (główny) + komputer (dom/szkoła)
- Czas dziennie: 15-45 min (po lekcjach, w przerwach)

---

## 3. Top 3 pain points (z user research + panel ekspertów)

> User wybrał wszystkie 4 z proponowanych — wszystkie w scope.

### P1 — Brak ukierunkowania nauki
Uczniowie robią chaotyczne testy bez planu, tracą czas na zagadnienia które już znają, ignorują słabe obszary. **Konsekwencja:** spadek motywacji, nierównomierne pokrycie materiału. **Rozwiązanie v3:** diagnoza wstępna 12 pyt → knowledge model per obszar → adaptive quiz selection 70/30 (słabe/mocne).

### P2 — Niska retencja długoterminowa
Po 2 tygodniach od opanowania tematu uczniowie tracą 50% wiedzy (krzywa Ebbinghaus). Brak systemu powtórek. **Rozwiązanie v3:** Spaced Repetition SM-2 (P1, nie P0) z 4-rating + soft lapse + codzienna kolejka.

### P3 — Strach przed częścią praktyczną
Część praktyczna (150 min, próg 75%) ma najwyższy odsiew — uczniowie nie ćwiczą scenariuszy egzaminacyjnych w warunkach czasowych. **Rozwiązanie v3:** Symulator zadań praktycznych z timerem, checklistami, scenariuszami CKE-style (konfiguracja sieci, podsieci, polecenia CLI, diagnostyka).

### P4 — Brak motywacji do codziennej nauki
Odkładanie do ostatniego tygodnia, brak nawyku, niski commitment. **Rozwiązanie v3:** streak counter, 12 achievementów, plan 6-tygodniowy, PWA z opcjonalnymi reminders.

---

## 4. Top 5 funkcji (Pareto 80/20)

| # | Feature | Priorytet | Adresuje pain |
|---|---|---|---|
| 1 | **Quiz egzaminacyjny CKE-style** (40 pyt × 60 min) | P0 must-have | baseline |
| 2 | **Adaptive engine** (diagnoza + weak-area targeting + knowledge model) | P0 | P1 |
| 3 | **Symulator części praktycznej** (150-min, scenariusze CKE) | P0 | P3 |
| 4 | **Gamifikacja** (streak + 12 achievementów + plan tygodniowy + PWA) | P0 | P4 |
| 5 | **Spaced Repetition SM-2** (fiszki + codzienna kolejka) | P1 | P2 |

**Uzasadnienie SR jako P1 (nie P0):** user nie wybrał explicite, ale pain #2 (retencja) został wybrany. SR jest evidence-based standardem dla retencji. Zachowuję w architekturze, decyzja "ship/cut" przy checkpoint 5.

---

## 5. Stack + constraints

**Frontend-only HTML/JS, single-file, offline-first.**

| Aspekt | Decyzja |
|---|---|
| Format | Single `inf02-study-hub-v3.html` (~150-300 KB) |
| Język | Vanilla JS ES2017+ (no transpiler) |
| Build | None — paste-and-go |
| Backend | Brak |
| Storage | Storage adapter: `window.storage` (Cowork) → `localStorage` → in-memory fallback |
| Hosting | GitHub Pages (free) + opcjonalnie CDN |
| Deps zewnętrzne | CDN whitelist: zostanie wyspecyfikowane w Architecture (potencjalnie Chart.js dla dashboardu) |
| PWA | Service Worker dla offline + manifest dla install (P1) |

**Compliance:**
- ✅ **GDPR-clean:** zero PII (imię, email, data urodzenia) — pseudonim opcjonalny
- ✅ **COPPA-friendly:** nieletni (16-17 lat na początku klasy IV) — bez fingerprintingu/analytics bez consent
- ✅ **MIT License** (otwarte)
- ⚠️ **CKE arkusze:** zero kopiowania literalnego — pytania w stylu CKE własnego autorstwa, z wyraźnym disclaimer

---

## 6. Budżet + czas

**Tier wybrany:** Premium ~$50 / 4-6h sesji.

**Alokacja:**
| Faza | Agent | Model | Tokens (orient.) | Koszt |
|---|---|---|---|---|
| 0 | Orchestrator (chat) | Sonnet | 10k | $0.10 |
| 1 | Plan agent | **Opus 4.6** | 80k | $3.00 |
| 2 | 6× Builder | Sonnet | 6×140k | $27 |
| 3 | Reviewer + Domain Expert | Sonnet | 2×130k | $7.50 |
| 4 | 6× Builder Fix | Sonnet | 6×60k | $10 |
| 5 | Integrator | Sonnet | 50k | $2 |
| **Total** | | | ~1.4M | **~$50** |

**Pro plan limity:** ~45 wiad./5h Sonnet, ~15/5h Opus → mogą wymusić 2-dniową sesję dla równoległych Builderów.

---

## 7. Konwencje branżowe

Wszystkie 4 wybrane przez user, wszystkie w scope:

1. **Format CKE:** 40 pytań A-D × 60 min × próg 50% (pisemny); 150 min × 75% (praktyczny). Dystraktory wiarygodne, jeden poprawny.
2. **Podstawa programowa MEN INF.02:** wszystkie efekty kształcenia z [rozporządzenia](https://prawo.sejm.gov.pl/) pokryte proporcjonalnie. Mapping efekt → ID pytania w `contracts/curriculum-mapping.json`.
3. **Polski język techniczny:** terminologia z dokumentacji Microsoft Polska (Win Server, AD DS, GPO), Cisco PL (sieci, routing, VLAN), bez kalek z EN.
4. **Normy PN-EN:**
   - PN-EN 50173-1:2018 (okablowanie strukturalne, klasy D/E/EA/F/FA/I/II)
   - Rozporządzenie MPiPS o BHP (1998 + zm.)
   - Ustawa o prawie autorskim (licencje OEM/BOX/CAL/Volume/GPL)
   - RODO (RODO + ZSEE — utylizacja)

---

## 8. Definition of Done (Minimum Viable Test)

**Aplikacja jest "ready to ship" gdy spełnia WSZYSTKIE poniższe:**

| Kryterium | Próg | Pomiar |
|---|---|---|
| **P0 testów przechodzi** | 100% | manual trace + jeśli możliwe automated |
| **P1 testów przechodzi** | ≥80% | jw. |
| **JS errors** | 0 | DevTools console clean |
| **WCAG AA** | 100% kontrastów + ARIA + keyboard nav | axe-core lub manualny audit |
| **Liczba pytań w bazie** | **≥250** | grep `{id:` w QUESTIONS array |
| **Diagnoza E2E** | onboarding → 12 pyt → knowledge report → review mode → 1 quiz adaptive — bez crashów | smoke test scenariusz |
| **Mobile** | działa na <375px, tap targets ≥44px | DevTools mobile mode |
| **Offline** | po pierwszym load działa offline (Service Worker P1) | DevTools Network: offline |
| **Linie kodu** | <2500 per artefakt (limit Claude.ai Published 3000) | `wc -l artifacts/*.html` |
| **Storage adapter** | window.storage → localStorage → memory we wszystkich artefaktach | `grep "kind: .local."` |

---

## 9. Out of scope (świadomie NIE robimy)

| Element | Powód |
|---|---|
| Backend / chmura / sync | GDPR, koszt, stack constraint |
| Płatności / subskrypcje | Free open-source, MIT |
| AI tutor on-demand | Wymaga API key, koszt per user |
| Multi-language (EN/DE) | Audience PL only |
| Inne kwalifikacje (INF.03/04, EE.08) | Scope creep — INF.02 only |
| Społecznościowe (forum, ranking) | Moderation overhead, GDPR |
| Wideo | Storage size, copyright concerns |
| Dashboardy klasowe / nauczycielskie | Inny audience (osobny produkt) |
| Real-time multiplayer | Stack constraint |
| iOS/Android natywne | PWA wystarczy |

---

## 10. Sukces produktu — KPI po launch

(post-publication, niewiążące dla v3 ship, ale informuje priorytety)

- **Korzystanie:** ≥1000 unikalnych otwarć w ciągu 30 dni od publikacji
- **Engagement:** mediana sesji ≥10 min, mediana pytań/użytkownika ≥40
- **Retencja:** ≥30% userów wraca następnego dnia (D1)
- **Skuteczność:** anegdotyczne zgłoszenia "zdałem dzięki temu" (issue/star na repo)
- **Jakość:** ≤5 issues `bug` / 100 użytkowników

---

## Linki

- **v2 source:** `/Users/robertboguszewski/projects/INF02/inf02-study-hub-v2.html`
- **v2 research:** `/Users/robertboguszewski/projects/INF02/v2/research-findings.md`
- **EXECUTE.md (orchestrator)** — nadrzędny prompt metodologii
- **CKE INF.02 (oficjalne):** [cke.gov.pl](https://cke.gov.pl)

---

**Status:** ✅ Faza 0 zakończona. Oczekuję sign-off na **🛑 Checkpoint 1** przed startem Fazy 1.
