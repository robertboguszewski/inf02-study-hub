# TDD — SRS card scheduler (Builder-SRS)

**Artifact:** `artifacts/srs.html`
**Total tests:** 12 (P0: 4, P1: 6, P2: 2)
**DoD threshold:** 100% P0, ≥80% P1.
**Priority:** SRS jest P1 globalnie (Brief), więc SRS testy P0 to tylko algorytm core, nie UI dwellings.

---

### TEST-SRS-01: rateCard — fresh card, GOOD — P0

**Given:** `card === undefined`, area="N".
**When:** `rateCard(undefined, RATING.GOOD, 'N', now=0)`.
**Then:** zwraca card z `ease=2.5, reps=2, learnStep=1, due=now+10min, interval≈0.0069 (10/60/24), lapses=0, successStreak=1`.
**Verification:** assert exact values; AJV walidacja vs `Card` schema.

---

### TEST-SRS-02: rateCard — AGAIN soft lapse, NOT reset — P0

**Given:** card po 4 reps (review phase) z `ease=2.5, interval=10` dni, `lapses=0`.
**When:** `rateCard(card, RATING.AGAIN, 'N', now)`.
**Then:** `lapses === 1`, `ease === 2.3` (clamped do min 1.3), `interval === 2.0` (10 * 0.2), `successStreak === 0`. **NIE** reset do 0.
**Verification:** assert numerical exact.

---

### TEST-SRS-03: rateCard — graduate z learning do review — P0

**Given:** card w learning phase, `reps=3, learnStep=2`.
**When:** `rateCard(card, RATING.GOOD, 'N', now)` (4th rep).
**Then:** card przechodzi w review phase: `reps=4`, `learnStep` osiąga 3 (max), `interval` w dniach > 1.
**Verification:** assert reps; interval >= 1.

---

### TEST-SRS-04: getDueCards — sort by due ascending — P0

**Given:** state.cards = {Q-0001: due=10, Q-0002: due=5, Q-0003: due=20}.
**When:** `getDueCards(state.cards, now=15)`.
**Then:** zwraca `[card-2, card-1]` (due ≤ now), sortowane rosnąco.
**Verification:** array deep-equal.

---

### TEST-SRS-05: rateCard — EASY mnoży interval przez 1.3*ease — P1

**Given:** card review phase, ease=2.5, interval=10.
**When:** `rateCard(card, RATING.EASY, ...)`.
**Then:** factor = 2.5 * 1.3 = 3.25; nowy interval = 10 * 3.25 = 32.5; ease = min(3.0, 2.5+0.15) = 2.65.
**Verification:** numerical exact.

---

### TEST-SRS-06: rateCard — HARD obniża ease, factor 1.2 — P1

**Given:** card review phase, ease=2.5, interval=10.
**When:** `rateCard(card, RATING.HARD, ...)`.
**Then:** ease = max(1.3, 2.5-0.15) = 2.35; factor = 1.2; interval = 10 * 1.2 = 12.
**Verification:** numerical exact.

---

### TEST-SRS-07: Daily queue UI — pokazuje N due — P1

**Given:** state.cards z 8 due, 5 future.
**When:** rendering SRS dashboard.
**Then:** UI pokazuje "Do powtórzenia dziś: 8". Lista 8 fiszek widoczna w kolejce.
**Verification:** DOM `.queue-count` textContent === "8".

---

### TEST-SRS-08: 4-button rating UI — keyboard shortcuts 1/2/3/4 — P1

**Given:** rendering fiszki.
**When:** user naciska klawisz "3".
**Then:** card oceniona jako GOOD, kolejna pokazana.
**Verification:** keyboardEvent simulation; card advance.

---

### TEST-SRS-09: ease clamp [1.3, 3.0] — P1

**Given:** card z ease=1.4.
**When:** wielokrotne rateCard z AGAIN (ease -0.2 each).
**Then:** ease nie spada poniżej 1.3.
**Verification:** assert ease >= 1.3 po 5 calls.

---

### TEST-SRS-10: recordRating — emituje event srs:rated — P1

**Given:** Shell zapisany subscriber dla "srs:rated".
**When:** `INF02.srs.recordRating('Q-0001', 3, 'N')`.
**Then:** event emitted z `{qid:'Q-0001', rating:3, card:{...}}`.
**Verification:** spy on subscriber.

---

### TEST-SRS-11: Knowledge update integration — P2

**Given:** card review.
**When:** rateCard z GOOD (correct).
**Then:** `state.knowledge.perArea[area].mastery` zaktualizowany przez EWMA (synchronicznie z rate).
**Verification:** knowledge before/after delta.

---

### TEST-SRS-12: Empty queue UI — P2

**Given:** brak due cards.
**When:** rendering SRS dashboard.
**Then:** UI pokazuje "Wszystko nadrobione! Następna fiszka za <X> godz." (computed z minimum due time).
**Verification:** DOM message + `<time>` element.
