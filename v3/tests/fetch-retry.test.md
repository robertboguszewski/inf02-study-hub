# tests/fetch-retry.test.md — fetchWithRetry helper

## Cel
Resilient fetch dla `data/questions.json`, `data/scenarios.json`. Exponential backoff (200/400/800ms + jitter), retry tylko dla transient errors (408/425/429/500/502/503/504).

## Owner
shell.html `fetchWithRetry()` (~line 1320)

## Test scenariusze

### TEST-RETRY-01 (P0): success on first try → 1 call
**Given:** mock fetch returns 200 OK
**When:** fetchWithRetry(url, {}, 2)
**Then:** call count === 1, returns response
**Verification:** mock called once

### TEST-RETRY-02 (P0): retry on 503 → 3 calls (2 retries)
**Given:** mock returns 503, 503, 200
**When:** fetchWithRetry with maxRetries=2
**Then:** 3 total calls, final success
**Verification:** mock count === 3

### TEST-RETRY-03 (P0): no retry on 404 (non-retryable)
**Given:** mock returns 404 first call
**When:** fetchWithRetry
**Then:** 1 call total, returns 404
**Verification:** mock count === 1, status === 404

### TEST-RETRY-04 (P0): no retry on 401/403 (auth errors)
**Given:** mock returns 401
**When:** fetch
**Then:** 1 call (auth errors are not transient)
**Verification:** mock count === 1

### TEST-RETRY-05 (P1): exponential backoff timing
**Given:** mock returns 503 always, maxRetries=2
**When:** fetchWithRetry, measure delays
**Then:** delays roughly 200ms, 400ms (first attempt no delay)
**Verification:** total time ≈ 600-700ms with jitter

### TEST-RETRY-06 (P1): network error rejection retried
**Given:** mock throws NetworkError on first call
**When:** fetchWithRetry
**Then:** retry attempted
**Verification:** mock called >1

### TEST-RETRY-07 (P1): exhausted retries → throws last error
**Given:** mock always throws
**When:** fetchWithRetry, maxRetries=2
**Then:** rejected after 3 attempts (1 initial + 2 retries)
**Verification:** Promise rejects with last error
