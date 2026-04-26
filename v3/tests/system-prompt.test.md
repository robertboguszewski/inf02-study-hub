# TDD — System prompt + cross-cutting (Builder-SystemPrompt)

**Artifact:** `artifacts/system-prompt.md`
**Total tests:** 11 (P0: 4, P1: 5, P2: 2)
**DoD threshold:** 100% P0, ≥80% P1.
**Scope:** ten plik testuje cross-cutting wymagania (schema integrity, bank size, single-writer guarantee), nie pojedynczy artefakt.

---

### TEST-SYS-PROMPT-01: Test count ≥10 + ≥3 P0 per artifact — P0

**Given:** wszystkie 6 plików testowych.
**When:** parser zlicza testy per plik.
**Then:** każdy plik ma ≥10 testów; ≥3 z priorytetem P0.
**Verification:** grep `^### TEST-` per file ≥10; grep `— P0` per file ≥3.

---

### TEST-SYS-PROMPT-02: Bank pytań ≥250 — P0

**Given:** `data/questions.json` po publikacji v3.
**When:** count `length`.
**Then:** ≥250 pytań; każde waliduje vs `Question` schema.
**Verification:** `JSON.parse(file).length >= 250`; AJV walidacja każdego.

---

### TEST-SYS-PROMPT-03: schemas.json — każdy schema ma $id, brak orphan $ref — P0

**Given:** `contracts/schemas.json`.
**When:** parser sprawdza wszystkie `$ref`.
**Then:** każdy `$ref` rozwiązuje się do istniejącego `$id` (lokalny `#/$defs/X` lub absolute URL z `$id` schema). Brak dangling references.
**Verification:** AJV `addSchema` wszystkich schemas, następnie `compile` każdego — bez błędów.

---

### TEST-SYS-PROMPT-04: Każdy artefakt < 2500 LoC — P0

**Given:** zbudowane artefakty.
**When:** `wc -l artifacts/*.html`.
**Then:** każdy plik <2500 linii.
**Verification:** shell command output.

---

### TEST-SYS-PROMPT-05: Single writer — brak overlap edycji — P1

**Given:** git log / file authorship.
**When:** scan commits per file path.
**Then:** każdy `artifacts/*.html` ma DOKŁADNIE jednego writera w mapping table z Architecture 1.7.
**Verification:** manual audit lub `git log --format='%an' artifacts/X` unique count == 1 (Phase 5).

---

### TEST-SYS-PROMPT-06: Każdy moduł rejestruje globalny `INF02.*` — P1

**Given:** załadowany shell + pozostałe artefakty.
**When:** inspect `window.INF02`.
**Then:** klucze `shell`, `quiz`, `diagnostic`, `practical`, `srs` istnieją; każdy z public API z Architecture 1.2.
**Verification:** `Object.keys(window.INF02).sort()` === sortowana lista expected.

---

### TEST-SYS-PROMPT-07: NO direct localStorage poza shell — P1

**Given:** wszystkie 6 artefaktów.
**When:** grep `localStorage\.(getItem|setItem|removeItem|clear)`.
**Then:** matche występują TYLKO w `artifacts/shell.html`, w sekcji storage adapter (z komentarzem "Storage adapter").
**Verification:** `grep -n "localStorage\." artifacts/*.html | grep -v shell.html` zwraca 0 linii.

---

### TEST-SYS-PROMPT-08: Tap targets ≥44px wszędzie — P1

**Given:** wszystkie artefakty.
**When:** axe-core scan + manual measurement na 5 przykładowych przyciskach.
**Then:** każdy interactive element ma `getBoundingClientRect()` ≥44×44 albo padding aplikuje min-size.
**Verification:** axe rule `target-size`; manual.

---

### TEST-SYS-PROMPT-09: Curriculum mapping cover ≥250 expected — P1

**Given:** `contracts/curriculum-mapping.json`.
**When:** sumuj `effects[*].minQuestions`.
**Then:** suma ≥250.
**Verification:** `effects.reduce((s,e) => s + (e.minQuestions||0), 0) >= 250`.

---

### TEST-SYS-PROMPT-10: ADR coverage — wszystkie decyzje powiązane — P2

**Given:** Architecture.md sekcje 1.1-1.5.
**When:** parser mapuje "Prior decision: ADR-XXX" do listy ADR.
**Then:** każda decyzja ma istniejący ADR; każdy ADR ma ≥1 decyzję go cytującą.
**Verification:** manual cross-ref.

---

### TEST-SYS-PROMPT-11: GDPR clean — zero PII fields — P2

**Given:** `contracts/schemas.json`.
**When:** grep w `UserProfile.properties` za polami "email", "phone", "name", "dob", "fullName", "address".
**Then:** żadne z nich nie istnieje. Tylko `pseudonim` (opcjonalny, max 24 znaki).
**Verification:** grep negative.
