# TDD — Diagnostic + Adaptive engine (Builder-Diagnostic)

**Artifact:** `artifacts/diagnostic.html`
**Total tests:** 12 (P0: 5, P1: 5, P2: 2)
**DoD threshold:** 100% P0, ≥80% P1.

---

### TEST-DIAG-01: Diagnostic selection — 12 pytań proporcjonalnie — P0

**Given:** bank ≥250 pyt, 11 obszarów.
**When:** wywołanie `selectDiagnosticQuestions(pool, 12)`.
**Then:** zwraca dokładnie 12 pyt; każdy z największych 4 obszarów (B, N, W, L) reprezentowany ≥1 raz; mix difficulty (≥3 easy, ≥3 medium, ≥3 hard).
**Verification:** count per area ≥1 dla top-4; difficulty distribution log.

---

### TEST-DIAG-02: markDiagnosisComplete inicjalizuje knowledge — P0

**Given:** results = 12 pyt z mixem correct/incorrect (np. B: 2/3 correct, N: 1/3 correct).
**When:** `markDiagnosisComplete(results)`.
**Then:** `knowledge.perArea.B.mastery` ≈ 0.667 (clamped 0.1..0.9), `N.mastery` ≈ 0.333. Obszary bez pytań w diagnozie pozostają `0.5` (default).
**Verification:** assert numerical (±0.01).

---

### TEST-DIAG-03: Adaptive selection 70/30 — P0

**Given:** knowledge: B=0.2 (weak), O=0.9 (strong), N=0.5 (mid), pozostałe 0.5.
**When:** `selectAdaptiveQuestions(pool, 20, knowledge)` x10 iteracji.
**Then:** średnia z 10 prób — pytania z obszarów `mastery<0.5` stanowią 65-75% (target 70%).
**Verification:** stat: `mean(weak_count) / 20 ∈ [0.65, 0.75]`.

---

### TEST-DIAG-04: EWMA update knowledge α=0.7 — P0

**Given:** `knowledge.perArea.B.mastery = 0.5`.
**When:** `updateKnowledge('B', true, knowledge)` (correct=true).
**Then:** nowy mastery = 0.7*0.5 + 0.3*1 = 0.65. Po `updateKnowledge('B', false, ...)`: 0.7*0.65 + 0.3*0 = 0.455.
**Verification:** assert numerical exact (±0.001).

---

### TEST-DIAG-05: getKnowledgeReport — readinessForExam formuła — P0

**Given:** knowledge perArea: 11 obszarów, 10 z mastery=0.8, jeden (Z) z mastery=0.2.
**When:** `getKnowledgeReport(knowledge)`.
**Then:** `mean ≈ 0.745`, `min = 0.2`. `readinessForExam = 0.6*0.745 + 0.4*0.2 = 0.527`. `weakest = ['Z', '...']`. `strongest` zwraca top 2 z mastery=0.8.
**Verification:** assert numerical; weakest[0] === 'Z'.

---

### TEST-DIAG-06: Onboarding flow — 4 kroki — P1

**Given:** pierwsza wizyta, `profile === null`.
**When:** user przechodzi: cel (pass) → daily goal (20 min) → exam date (2026-06-12) → "Rozpocznij diagnozę".
**Then:** `profile` zapisany z `goal: 'pass', dailyGoalMin: 20, examDate: '2026-06-12', onboardedAt: <now>`. Następnie diagnostyka 12 pyt startuje.
**Verification:** state inspection po onboarding; UI nawiguje do `/diagnostic-quiz`.

---

### TEST-DIAG-07: Knowledge dashboard — 11 area bars + heatmap — P1

**Given:** post-diagnoza, knowledge zainicjalizowany.
**When:** rendering dashboard.
**Then:** 11 horizontal barów (jeden per area), kolor area-fg, długość proporcjonalna do `mastery`. Tekst ARIA `aria-label="${area_label}: ${mastery_pct}%"`.
**Verification:** `document.querySelectorAll('.area-bar').length === 11`; każdy z aria-label sparsowanym.

---

### TEST-DIAG-08: Recommendation banner — "Powtórz: <weakest>" — P1

**Given:** `knowledge.weakest === ['Z', 'D']`.
**When:** rendering home dashboard.
**Then:** banner z tekstem "Powtórz: Bezpieczeństwo zaawansowane" + CTA "Quiz adaptive".
**Verification:** `document.querySelector('.recommend-banner').textContent.includes('Bezpieczeństwo zaawansowane')`.

---

### TEST-DIAG-09: CIDR notation valid w pytaniach diag — P1

**Given:** wszystkie pytania z obszaru N w diag pool.
**When:** scan teksty pytań i odpowiedzi.
**Then:** każdy CIDR match regex `^\d{1,3}(\.\d{1,3}){3}/\d{1,2}$` (gdzie występuje), brak spacji wewnątrz, IPv6 lowercase RFC5952.
**Verification:** regex scan; brak fail.

---

### TEST-DIAG-10: Diagnostic isOnce — replay nie nadpisuje — P1

**Given:** `profile.onboardedAt` ustawione, knowledge has values.
**When:** user otwiera ponownie diagnostic page.
**Then:** UI wyświetla "Diagnoza ukończona [data]. Powtórz?" z dwoma przyciskami (Tak/Nie). Bez auto-replay.
**Verification:** UI element widoczny; klik "Tak" resetuje knowledge i wraca do diagnozy.

---

### TEST-DIAG-11: Empty pool fallback — P2

**Given:** mock pool.length === 0.
**When:** `selectDiagnosticQuestions([], 12)`.
**Then:** zwraca `[]`; UI pokazuje "Brak pytań w bazie. Zaimportuj bank.".
**Verification:** length === 0; UI message.

---

### TEST-DIAG-12: Mastery clamp [0.1, 0.9] — P2

**Given:** results: 12/12 correct dla B (perfect score).
**When:** markDiagnosisComplete.
**Then:** `knowledge.perArea.B.mastery === 0.9` (clamped). Symetrycznie 0/12 → 0.1.
**Verification:** assert numerical exact.
