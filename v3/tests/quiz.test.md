# TDD — Quiz artifact (Builder-Quiz)

**Artifact:** `artifacts/quiz.html`
**Total tests:** 13 (P0: 5, P1: 6, P2: 2)
**DoD threshold:** 100% P0, ≥80% P1.

---

### TEST-QUIZ-01: Tryb egzaminacyjny — 40 pytań, 60 min — P0

**Given:** załadowany quiz, mode = "exam", knowledge state istnieje (po diagnozie).
**When:** użytkownik klika "Rozpocznij quiz egzaminacyjny".
**Then:** sesja startuje z `questionIds.length === 40`, `durationLimitSec === 3600`, timer odlicza w dół `mm:ss`. Pytania pochodzą z banku z proporcjami obszarów (sekcja 1.4 Architecture).
**Verification:** `INF02.quiz.getActiveSession()` zwraca session ze 40 pyt; assert `mode === "exam"`, `durationLimitSec === 3600`.

---

### TEST-QUIZ-02: Submitanswer mark + feedback — P0

**Given:** aktywna sesja, rendering pytania `Q-0001` (correct: index 2).
**When:** użytkownik klika opcję B (index 1) i submitsuje.
**Then:** Answer zapisany do `session.answers` z `correct: false, given: 1, elapsedMs > 0`. UI pokazuje highlight: opcja B czerwona (danger), opcja C zielona (success). Pole explanation widoczne.
**Verification:** `session.answers[0].correct === false`, DOM ma elementy z klasami `option--wrong` i `option--correct`.

---

### TEST-QUIZ-03: Score calculation po endSession — P0

**Given:** sesja z 40 odpowiedzi, 28 correct.
**When:** wywołanie `endSession(sid)`.
**Then:** zwraca `{score: 0.7, perArea: {...}, durationActual: ms}`. `state.sessions` zawiera sesję z `endedAt` ISO i `score: 0.7`. Próg pisemny 50% przekroczony — UI pokazuje "Zdane" zielony badge.
**Verification:** `result.score === 0.7`; DOM ma `.exam-result--passed`.

---

### TEST-QUIZ-04: Tryb adaptive — 70/30 weak/strong — P0

**Given:** knowledge.perArea ma `B.mastery=0.2` (weak), `O.mastery=0.9` (strong), pozostałe ~0.5.
**When:** start adaptive quizu n=20.
**Then:** rozkład pytań: ~14 z obszarów ze średnią poniżej 0.5 (B najwięcej), ~6 z obszarów powyżej 0.5 (O wyżej). Tolerancja ±2.
**Verification:** count pytań per area; assert `weakAreaCount >= 12 && weakAreaCount <= 16`.

---

### TEST-QUIZ-05: Tryb topic — filter per area — P0

**Given:** użytkownik wybiera area="N" w UI topic picker.
**When:** start quizu n=10.
**Then:** wszystkie 10 pyt ma `area === "N"`. Brak pytań z innych obszarów.
**Verification:** `session.questionIds.every(qid => questions[qid].area === "N")`.

---

### TEST-QUIZ-06: Tryb review — pokazuje tylko wcześniej błędne — P1

**Given:** state.sessions zawiera 3 zakończone sesje, w których łącznie 15 pytań było źle odpowiedzianych (`answers.filter(a => !a.correct)`), 5 unikalnych pytań.
**When:** start review.
**Then:** `questionIds.length <= 5`, każde to qid, na które user kiedykolwiek odpowiedział źle.
**Verification:** assert subset; UI banner "Powtórzenie 5 pytań".

---

### TEST-QUIZ-07: Timer zatrzymuje się na 00:00 i auto-submit — P1

**Given:** sesja exam, `durationLimitSec=10` (test-mode).
**When:** odlicza do 0.
**Then:** UI freeze na 00:00, auto-call `endSession`. Niewypełnione odpowiedzi traktowane jako `correct: false`.
**Verification:** mock `Date.now()` skok +11s; assert `session.endedAt` ustawione, score policzone z 0 dla unanswered.

---

### TEST-QUIZ-08: Polskie znaki w pytaniach — render UTF-8 NFC — P1

**Given:** pytanie z tekstem "Łącze światłowodowe — kategoria OS2".
**When:** rendering w DOM.
**Then:** tekst widoczny z poprawnymi diakrytykami (Ł, ś, ó). Brak entity escape, brak mojibake.
**Verification:** `document.querySelector(".q-text").textContent.normalize("NFC") === expected`.

---

### TEST-QUIZ-09: Focus ring widoczny, 3px — P1

**Given:** quiz UI.
**When:** Tab na option button.
**Then:** outline `3px solid #FFD166` z offset 2px.
**Verification:** `getComputedStyle(activeButton).outlineWidth === "3px"`, color match.

---

### TEST-QUIZ-10: ARIA live region dla feedbacku — P1

**Given:** quiz UI.
**When:** user submituje odpowiedź.
**Then:** komunikat zwrotny ("Dobrze" / "Źle, poprawna to: …") trafia do elementu z `aria-live="polite"`.
**Verification:** `document.querySelector('[aria-live="polite"]').textContent` zaktualizowany.

---

### TEST-QUIZ-11: Fill-in tolerant matcher — P1

**Given:** pytanie type="fill", correct=["255.255.255.224"].
**When:** user wpisuje " 255.255.255.224 " (spacje), albo "255 255 255 224".
**Then:** matcher zwraca `correct: true` w obu przypadkach (po normalizacji).
**Verification:** `INF02.quiz.matchFillAnswer(" 255.255.255.224 ", ["255.255.255.224"]) === true`.

---

### TEST-QUIZ-12: Keyboard shortcut (1-4 = wybór opcji, Enter = submit) — P2

**Given:** quiz na pytaniu MCQ.
**When:** user naciska klawisz "3".
**Then:** opcja C (index 2) jest highlighted/selected.
**Verification:** `document.activeElement.dataset.optIdx === "2"` lub `aria-checked="true"`.

---

### TEST-QUIZ-13: Reverse — sprzęt-style swipe (mobile) — P2

**Given:** mobile viewport, quiz UI, otwarte pytanie.
**When:** swipe right na pytaniu.
**Then:** poprzednie pytanie pokazane (tylko jeśli już answered, w trybie review).
**Verification:** TouchEvent simulator; UI shows previous Q.
