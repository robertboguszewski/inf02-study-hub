# tests/hard-collection.test.md — Hard questions collection

## Cel
User oznacza pytania jako "trudne" (★). Lista persystowana w `state.hardCollection: string[]`. Filtr w search browser pokazuje tylko zaznaczone.

## Owner
shell.html — state mutation + UI

## Test scenariusze

### TEST-HARD-01 (P0): default state has empty hardCollection
**Given:** fresh defaultState()
**When:** check state.hardCollection
**Then:** empty array `[]`
**Verification:** Array.isArray(state.hardCollection) && length === 0

### TEST-HARD-02 (P0): toggle add (Q-0001 not in list)
**Given:** state.hardCollection = []
**When:** click "Oznacz" on Q-0001
**Then:** state.hardCollection = ['Q-0001']
**Verification:** post-state contains 'Q-0001'

### TEST-HARD-03 (P0): toggle remove (Q-0001 in list)
**Given:** state.hardCollection = ['Q-0001', 'Q-0050']
**When:** click on Q-0001 again
**Then:** state.hardCollection = ['Q-0050']
**Verification:** Q-0001 NOT in list, Q-0050 still in

### TEST-HARD-04 (P0): validateAppState accepts array
**Given:** state with hardCollection = ['Q-0001']
**When:** validate
**Then:** no errors
**Verification:** errors.length === 0

### TEST-HARD-05 (P0): validateAppState rejects non-array
**Given:** state.hardCollection = 'not-array'
**When:** validate
**Then:** error 'hardCollection not array'
**Verification:** errors.includes('hardCollection not array')

### TEST-HARD-06 (P1): persist across reload
**Given:** mark Q-0001 as hard, reload page
**When:** bootstrap()
**Then:** state.hardCollection still contains 'Q-0001'
**Verification:** localStorage retain

### TEST-HARD-07 (P1): hard filter chip count updates live
**Given:** mark 3 pytania
**When:** check search UI
**Then:** "Tylko trudne (3)" w label checkbox
**Verification:** DOM textContent matches

### TEST-HARD-08 (P2): max 100 hard items (soft limit)
**Given:** mark 100 pytań
**When:** mark 101st
**Then:** allowed (no hard limit), but warning toast
**Verification:** state allows >100, optional warning
