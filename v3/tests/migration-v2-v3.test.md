# tests/migration-v2-v3.test.md — Migration v2 → v3

## Cel
Migration `inf02_progress_v2` → `inf02.v3.state` musi działać dla wszystkich istniejących userów v2. Brak migracji = utrata postępów (CVE-class user data loss).

## Owner
shell.html · `migrateFromV2()` (~line 660)

## Test scenariusze

### TEST-MIG-01 (P0): brak v2 → no-op + defaultState
**Given:** localStorage nie ma `inf02_progress_v2` ani `inf02.v3.state`
**When:** `bootstrap()` runs
**Then:** state = defaultState(), klucz v3 zapisany, brak błędów
**Verification:** `INF02.shell.getState().version === '3.0.0'`, `getState().sessions.length === 0`

### TEST-MIG-02 (P0): v2 → v3 — pełna migracja
**Given:** localStorage `inf02_progress_v2` = `{knowledge: {B: 0.7, O: 0.5, D: 0.6, S: 0.6, U: 0.4}, cards: {Q-0001: {ease: 2.5, interval: 7, reps: 3, lapses: 0, due: ...}}, history: [...], achievements: {unlocked: ['first_quiz']}, streak: {count: 5, lastActiveDate: '2026-01-20'}}`
**When:** `migrateFromV2()`
**Then:**
- v3.knowledge.perArea.B.mastery ≈ 0.7
- v3.knowledge.perArea.O.mastery ≈ 0.5
- v3.knowledge.perArea.S → split do N, 6, W (avg 0.6)
- v3.knowledge.perArea.U → split do P, V, Z (avg 0.4)
- v3.cards['Q-0001'].ease === 2.5, successStreak === 0 (added)
- v3.streak.count === 5
- v3.achievements zawiera 'first_quiz'
**Verification:** każde pole sprawdzić w returned state

### TEST-MIG-03 (P0): all 11 areas present after migration
**Given:** v2 ma tylko 5 areas (B/O/D/S/U)
**When:** migration
**Then:** v3.knowledge.perArea ma WSZYSTKIE 11 obszarów (B/O/N/P/D/L/W/6/V/Z/R)
**Verification:** brakujące areas (L, R) mają default `{accuracy:0, attempts:0, lastSeen:null, mastery:0.5}`

### TEST-MIG-04 (P0): v3 state passes validateAppState (no reset!)
**Given:** post-migration state
**When:** `validateAppState(post-migration)`
**Then:** zero errors
**Verification:** zwrócona tablica errors === []

### TEST-MIG-05 (P0): v2 backup zachowany (read-only)
**Given:** v2 + migration done
**When:** sprawdź localStorage
**Then:** `inf02_progress_v2` NADAL istnieje (NIE usunięty), `inf02.v3.state` istnieje
**Verification:** oba klucze obecne w localStorage

### TEST-MIG-06 (P1): malformed v2 JSON → graceful fallback
**Given:** `inf02_progress_v2` = `'{invalid json'`
**When:** migration
**Then:** state = defaultState(), warn w console
**Verification:** brak crash, getState() zwraca default

### TEST-MIG-07 (P1): partial v2 (no knowledge field) → defaults filled
**Given:** v2 = `{streak: {count: 3}}` (brak knowledge, cards)
**When:** migration
**Then:** brak knowledge → defaultPerArea(), brak cards → {}, streak.count===3
**Verification:** wszystkie wymagane pola obecne

### TEST-MIG-08 (P1): re-running migration is idempotent
**Given:** state v3 already exists
**When:** `migrateFromV2()` ponownie wywołane
**Then:** state niezmienione (NIE nadpisuje świeżego v3 starym v2)
**Verification:** seq counter nie skacze
