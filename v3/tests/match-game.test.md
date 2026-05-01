# tests/match-game.test.md — Match/Memory game mode (Quizlet-style)

## Cel
Quizlet-style "Match" game: 6 par kart (3 pytania + 3 odpowiedzi), gracz łączy je (kliknij Q → kliknij A → matched). Cel: szybki dopasowanie wszystkich par. Stopwatch + best time.

## Architektura
- New view `#match` lub `mode=match` w quiz.html
- Generuje 6 random pytań → 6 par (treść pytania ↔ poprawna odpowiedź A/B/C/D)
- Kliknięcie Q + matching A = match (zielona animacja, znikają)
- Kliknięcie Q + wrong A = shake red, odznaczenie obu

## Test scenariusze

### TEST-MATCH-01 (P0): generowanie 6 par
**Given:** pool 297 pytań
**When:** `generateMatchPairs(pool, 6)`
**Then:** 12 kart (6 pytań + 6 odpowiedzi), shuffled
**Verification:** array length === 12, IDs unique

### TEST-MATCH-02 (P0): klik Q → klik poprawne A = match
**Given:** Q-card[0] otwarty (selected), pasujące A-card[3]
**When:** klik A-card[3]
**Then:** oba zaznaczone `data-status="matched"`, animacja success
**Verification:** DOM atrybuty + emit `match:found` event

### TEST-MATCH-03 (P0): klik Q → klik błędne A = miss
**Given:** Q-card[0] selected, błędne A-card[5]
**When:** klik A-card[5]
**Then:** oba shake (200ms), wracają do unselected
**Verification:** DOM `.shake` class added then removed

### TEST-MATCH-04 (P0): wszystkie pary znalezione = win
**Given:** 5 z 6 par znalezione, 1 ostatnia
**When:** match ostatniej pary
**Then:** wyświetla się ekran "Wygrana! Czas: X sekund" + button "Powtórz"
**Verification:** DOM ma `.match-win` z czasem

### TEST-MATCH-05 (P1): stopwatch live update
**Given:** game started
**When:** czeka 3 sekundy
**Then:** stopwatch pokazuje "00:03"
**Verification:** textContent updated co sekundę

### TEST-MATCH-06 (P1): best time per session zapisany
**Given:** ukończony match w 12s
**When:** kolejny match w 10s
**Then:** state.matchBestTime === 10
**Verification:** localStorage persist

### TEST-MATCH-07 (P2): keyboard navigation (Tab + Enter)
**Given:** focus na Q-card[0]
**When:** Tab → Tab → Enter → naciśnięcie Enter na A-card
**Then:** match zarejestrowany przez klawiaturę
**Verification:** keypress handlers
