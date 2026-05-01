# tests/fsrs.test.md — FSRS-4 algorithm (upgrade z SM-2)

## Cel
Replace SM-2 (Wozniak 1990) z FSRS-4 (Free Spaced Repetition Scheduler 2023, Ye et al.). 
FSRS używa **DSR model**: Difficulty (D), Stability (S), Retrievability (R).
Lepsza predykcja retencji o 10-20% (open-spaced-repetition.github.io/srs-benchmark).

## Schema additions
- `Card.D?: number` (difficulty, default 5.0)
- `Card.S?: number` (stability w dniach)
- `Card.R?: number` (retrievability 0-1)
- Backward-compat: jeśli card ma `ease` (SM-2), `interval` — zachowaj jako fallback

## Test scenariusze

### TEST-FSRS-01 (P0): nowa karta — initial state
**Given:** `card = undefined`, rating "Good" (3)
**When:** `fsrsRate(card, 3, now)`
**Then:** card = { D: 5.0, S: ~3, R: 1.0, due: now + 3 days }
**Verification:** `Math.abs(card.S - 3) < 0.5`

### TEST-FSRS-02 (P0): rating "Easy" zwiększa S × ~1.3
**Given:** card { D: 5, S: 10, R: 0.9 }
**When:** rating Easy (4)
**Then:** new S ≈ 10 × 1.3 = 13
**Verification:** S delta ≥ 25%

### TEST-FSRS-03 (P0): rating "Again" reset S z lapse penalty
**Given:** card { D: 5, S: 30 }
**When:** rating Again (1)
**Then:** S spada do < 5 (relearning), lapses++
**Verification:** S < 5, lapses incremented

### TEST-FSRS-04 (P0): rating "Hard" zmniejsza S × 1.2 (slow growth)
**Given:** card { S: 10 }
**When:** rating Hard (2)
**Then:** new S ≈ 10 × 1.2 = 12 (small increase)
**Verification:** 11.5 < new S < 12.5

### TEST-FSRS-05 (P0): retrievability decay
**Given:** card { S: 10, lastReview: now - 5d }
**When:** `computeR(card, now)`
**Then:** R ≈ exp(-5/10 * ln(2)) ≈ 0.71
**Verification:** Math.abs(R - 0.71) < 0.05

### TEST-FSRS-06 (P1): difficulty bumps na "Again"
**Given:** card { D: 5 }
**When:** rating Again
**Then:** D increases (~5.5+)
**Verification:** new D > old D

### TEST-FSRS-07 (P1): difficulty drops na "Easy"
**Given:** card { D: 7 }
**When:** rating Easy
**Then:** D decreases (~6.5)
**Verification:** new D < old D

### TEST-FSRS-08 (P0): backward compat — migration SM-2 → FSRS
**Given:** card SM-2: { ease: 2.5, interval: 7, reps: 3 }
**When:** `migrateSM2ToFSRS(card)`
**Then:** card has D (~5), S (≈ interval), R (=1 if just reviewed)
**Verification:** card.D defined, card.S ≈ 7

### TEST-FSRS-09 (P1): targetRetention = 0.9 (default)
**Given:** card { S: 10 }
**When:** `computeNextInterval(card, 0.9)`
**Then:** interval = S * ln(0.9) / ln(target retrievability) ≈ 10
**Verification:** delta < 5%

### TEST-FSRS-10 (P2): A/B SM-2 vs FSRS predictive accuracy
**Given:** 100 sym sessions z user data
**When:** porównaj predykcje SM-2 vs FSRS retention
**Then:** FSRS RMSE < SM-2 RMSE
**Verification:** offline benchmark (out of scope dla single-file)
