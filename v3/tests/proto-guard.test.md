# tests/proto-guard.test.md — Prototype pollution guard

## Cel
`deepMerge`/`mergeDeep` w shell.html i diagnostic.html iterują `Object.keys()` co INCLUDES `__proto__` jako own property z JSON.parse. Bez guard'a → `obj['__proto__'] = X` POLLUTES `Object.prototype` (CVE-class).

## Owner
- shell.html `deepMerge()` (~line 480)
- diagnostic.html `mergeDeep()` (~line 670)
- quiz.html shellSetState fallback (~line 510)

## Test scenariusze

### TEST-PROTO-01 (P0): __proto__ key skipped in deepMerge
**Given:** `target = {a: 1}`, `patch = JSON.parse('{"__proto__": {"polluted": true}, "b": 2}')`
**When:** `deepMerge(target, patch)`
**Then:** `({}).polluted === undefined` (Object.prototype NOT polluted), result.b === 2
**Verification:** assert no global pollution

### TEST-PROTO-02 (P0): constructor key skipped
**Given:** `patch = JSON.parse('{"constructor": {"prototype": {"polluted": true}}, "x": 1}')`
**When:** deepMerge
**Then:** `({}).polluted === undefined`, result.x === 1
**Verification:** Object.prototype clean

### TEST-PROTO-03 (P0): prototype key skipped
**Given:** `patch = JSON.parse('{"prototype": {"polluted": true}}')`
**When:** deepMerge
**Then:** result has no prototype key (filtered)
**Verification:** !('prototype' in result)

### TEST-PROTO-04 (P0): import JSON with __proto__ does not corrupt state
**Given:** `INF02.shell.importState('{"version":"3.0.0","__proto__":{"x":1}, ...}')`
**When:** import processed
**Then:** Object.prototype clean, state imported normally
**Verification:** ({}).x === undefined

### TEST-PROTO-05 (P0): nested __proto__ also skipped
**Given:** `patch = JSON.parse('{"a": {"__proto__": {"deepPoll": true}}}')`
**When:** deepMerge with target = {a: {b: 1}}
**Then:** ({}).deepPoll === undefined
**Verification:** recursion correctly applies guard
