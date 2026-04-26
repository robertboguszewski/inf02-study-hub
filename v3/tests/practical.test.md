# TDD — Practical scenario simulator (Builder-Practical)

**Artifact:** `artifacts/practical.html`
**Total tests:** 13 (P0: 5, P1: 6, P2: 2)
**DoD threshold:** 100% P0, ≥80% P1.

---

### TEST-PRAC-01: Lista scenariuszy ≥6 — P0

**Given:** załadowany practical artifact, `data/scenarios.json` zawiera scenariusze.
**When:** wywołanie `loadScenarios()`.
**Then:** zwraca array ≥6 elementów; wszystkie `area === "R"` (lub kombinacja R + concrete area). Każdy waliduje vs `PracticalScenario` schema.
**Verification:** `result.length >= 6`; AJV walidacja każdego elementu.

---

### TEST-PRAC-02: Start scenario z timerem 150 min — P0

**Given:** scenariusz `S-001` z `durationSec: 9000`.
**When:** `startScenario('S-001')`.
**Then:** UI pokazuje countdown timer `02:30:00`, instrukcja step 1 widoczna, lista pozostałych steps ukryta lub jako preview. Session zapisany w state.
**Verification:** timer DOM element textContent === "02:30:00"; `state.activePractical === 'S-001'`.

---

### TEST-PRAC-03: Submit autograded step — P0

**Given:** active scenario, step 3 z `kind: "fill"`, `expectedAnswer: ["255.255.255.224"]`, `pointsMax: 5`, `autograde: true`.
**When:** `submitStep(sid, 3, "255.255.255.224")`.
**Then:** zwraca `{correct: true, pointsAwarded: 5, feedback: "OK"}`. State session aktualizowany, kolejny step pokazany.
**Verification:** assert return value; UI advance.

---

### TEST-PRAC-04: Manual rubric items wymagają self-assessment — P0

**Given:** scenariusz z 2 manual rubric items (autograde=false).
**When:** user kończy automated steps, dochodzi do "rubric self-check".
**Then:** UI pokazuje checklistę 2 kryteriów z opisem, każdy daje punkty TYLKO po zaznaczeniu. Brak auto-pass.
**Verification:** count `<input type="checkbox" data-rubric>` === 2; suma punktów uwzględnia tylko zaznaczone.

---

### TEST-PRAC-05: endScenario — pass at ≥75% — P0

**Given:** scenariusz totalPoints=20, user zdobył 16 pkt (80%).
**When:** `endScenario(sid)`.
**Then:** zwraca `{totalPoints: 20, percent: 0.8, passed: true}`. UI pokazuje green "Zaliczone".
**Verification:** assert; DOM `.scenario-result--passed`.

---

### TEST-PRAC-06: Threshold 75% strict — fail at 74% — P1

**Given:** totalPoints=20, user zdobył 14.8 pkt (74%).
**When:** endScenario.
**Then:** `passed: false`; UI pokazuje "Niezdane (próg 75%)".
**Verification:** percent rounding strict; passed === false.

---

### TEST-PRAC-07: Scenariusze pokrywają 4 podtypy INF.02.11 — P1

**Given:** pełna lista scenariuszy.
**When:** scan area kombinacji.
**Then:** ≥1 scenariusz dla `[R, N]` (LAN), ≥1 `[R, W]` (server), ≥1 `[R, D]` (diagnostyka), ≥1 `[R, P]` (peryferia/sieciowe).
**Verification:** count per kombinacja ≥1.

---

### TEST-PRAC-08: Timer pause przy switch tab — P1

**Given:** active scenario, timer 02:30:00.
**When:** user przełącza na inną kartę przeglądarki na 30s, wraca.
**Then:** timer kontynuuje od momentu odejścia (NIE zatrzymał się — wierne CKE conditions). Czas total odjęty.
**Verification:** mock `document.hidden`; timer wartość po powrocie = 02:29:30.

---

### TEST-PRAC-09: Step navigation — back/forward wśród answered — P1

**Given:** user jest na step 5, steps 1-4 answered.
**When:** klik "Wstecz".
**Then:** UI pokazuje step 4 z odpowiedzią użytkownika (read-only). Forward przywraca step 5.
**Verification:** step counter; field readonly attr.

---

### TEST-PRAC-10: Score breakdown per step — P1

**Given:** zakończony scenariusz.
**When:** view results page.
**Then:** lista wszystkich steps z punktacją "X / Y", suma = totalPoints, agregowana per kryterium rubric.
**Verification:** sum DOM elements; jakość markup.

---

### TEST-PRAC-11: CLI command tolerant matcher — P1

**Given:** step `kind: "command"`, expectedAnswer: `["ipconfig /all", "ipconfig/all"]`.
**When:** user wpisuje "ipconfig  /all" (double space).
**Then:** matcher zwraca `correct: true` (po normalizacji whitespace).
**Verification:** matcher unit test.

---

### TEST-PRAC-12: Mobile — instrukcja czytelna < 375px — P2

**Given:** mobile viewport.
**When:** rendering active step.
**Then:** instrukcja nie obcięta, fontsize ≥1rem, scroll w step body działa.
**Verification:** manual + scrollHeight check.

---

### TEST-PRAC-13: Eksport raportu PDF (P2 — może być cut) — P2

**Given:** zakończony scenariusz.
**When:** klik "Eksportuj raport".
**Then:** download `.pdf` z podsumowaniem (lub fallback do `.html` jeśli PDF library nieosadzona).
**Verification:** download triggered; pliki present.
