# tests/stats-per-q.test.md — Stats per question

## Cel
W trybie `#search` (browser pytań) każde pytanie pokazuje **stats**: accuracy %, ilość prób, ostatni attempt status. Pochodzi z `state.answered[qid]` agregowanego z `state.sessions[].answers[]`.

## Schema dependencies
- `Session.answers[]` zawiera `{qid, given, correct, elapsedMs}`
- `state.cards[qid]` (SM-2) ma `reps, lapses` — opcjonalne fallback

## Test scenariusze

### TEST-STATS-01 (P0): aggregateStats() z pustego state
**Given:** `state = { sessions: [], cards: {} }`
**When:** wywołam `aggregateQuestionStats(state)`
**Then:** zwraca pusty obiekt `{}`
**Verification:** `Object.keys(result).length === 0`

### TEST-STATS-02 (P0): aggregateStats z 1 sesji 1 pytanie poprawne
**Given:** `state.sessions = [{ answers: [{qid:'Q-0001', correct:true}] }]`
**When:** `aggregateQuestionStats(state)`
**Then:** `result['Q-0001'] === { attempts: 1, correct: 1, accuracy: 1.0, lastCorrect: true }`
**Verification:** assert deep equality

### TEST-STATS-03 (P0): aggregateStats agreguje multiple sessions
**Given:** 3 sesje z Q-0001: poprawne, błędne, poprawne
**When:** aggregate
**Then:** `Q-0001 = { attempts: 3, correct: 2, accuracy: 0.667, lastCorrect: true }`
**Verification:** Math.abs(accuracy - 0.667) < 0.01

### TEST-STATS-04 (P0): rendering w search browser pokazuje stats
**Given:** state ma stats dla Q-0001 (accuracy 50%)
**When:** otworzę `#search?q=Q-0001`
**Then:** card pytania pokazuje "📊 50% poprawnych (4 prób)"
**Verification:** DOM ma `.q-stats` z tekstem zawierającym "50%" + "4"

### TEST-STATS-05 (P1): empty state — pytanie bez prób
**Given:** Q-0250 nie ma w state.sessions
**When:** render
**Then:** card pokazuje "Nie próbowano" zamiast %
**Verification:** brak `.q-stats` lub tekst "Nie próbowano"

### TEST-STATS-06 (P1): "ostatnio: ✓" lub "✗" indicator
**Given:** Q-0005 ostatnio correct=false
**When:** render
**Then:** chip lub ikona ✗
**Verification:** `.q-last-status` ma class `wrong`

### TEST-STATS-07 (P2): sortowanie po accuracy ASC w search
**Given:** 5 pytań z różnymi accuracy
**When:** select sortowanie "accuracy ASC"
**Then:** lista uporządkowana od najmniejszej accuracy
**Verification:** order DOM elements
