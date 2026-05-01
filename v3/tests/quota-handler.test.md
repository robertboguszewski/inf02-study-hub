# tests/quota-handler.test.md — Quota exceeded handler

## Cel
`localStorage.setItem` rzuca `QuotaExceededError` w Safari private mode lub przy zapełnionym storage. Bez handlera = całkowity crash apki przy każdym save state.

## Owner
shell.html storage adapter (~line 360)

## Test scenariusze

### TEST-QUOTA-01 (P0): detects QuotaExceededError by name
**Given:** mock localStorage.setItem rzuca `Error{name: 'QuotaExceededError'}`
**When:** storage.setItem(STATE_KEY, largeJSON)
**Then:** wywołane auto-prune sessions do 10 ostatnich
**Verification:** sessions.length === 10 po retry

### TEST-QUOTA-02 (P0): detects DOMException code 22
**Given:** mock rzuca DOMException with code 22
**When:** setItem
**Then:** sessions pruned, retry attempted
**Verification:** prune logic triggered

### TEST-QUOTA-03 (P0): Firefox NS_ERROR_DOM_QUOTA_REACHED
**Given:** mock rzuca `Error{name: 'NS_ERROR_DOM_QUOTA_REACHED'}`
**When:** setItem
**Then:** prune + retry
**Verification:** detected as quota error

### TEST-QUOTA-04 (P0): non-quota error not caught
**Given:** mock rzuca `Error{name: 'SecurityError'}`
**When:** setItem
**Then:** error propagates (rejected promise)
**Verification:** Promise rejects, caller can handle

### TEST-QUOTA-05 (P1): event 'inf02:quota-exceeded' emitted
**Given:** quota error, prune fails (still > limit)
**When:** setItem
**Then:** `window.dispatchEvent(new CustomEvent('inf02:quota-exceeded'))` fired
**Verification:** event listener captures the event

### TEST-QUOTA-06 (P1): retry success after prune (sessions <= 10)
**Given:** state with 50 sessions, quota error → prune to 10 → retry
**When:** retried setItem
**Then:** resolve (success)
**Verification:** Promise resolves, JSON in storage has 10 sessions

### TEST-QUOTA-07 (P2): Safari private mode → memory fallback
**Given:** localStorage.setItem('__test__', '1') throws (Safari private)
**When:** storage IIFE evaluates
**Then:** falls through to memory fallback (kind: 'memory')
**Verification:** _storageKind === 'memory'
