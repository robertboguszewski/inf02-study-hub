# Contributing — INF.02 Study Hub

Dziękujemy za chęć współtworzenia. Każdy PR — od literówki po nowy obszar pytań — jest mile widziany.

## Workflow PR

1. **Fork** repo na GitHubie
2. **Branch:** `git checkout -b feat/moja-zmiana` (lub `fix/`, `docs/`)
3. **Zmiany + testy** — uruchom walidację schematu i sprawdź `tests/*.test.md`
4. **Commit:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`)
5. **Push + PR** do `main` z opisem: co, dlaczego, jak testowane
6. **Code review** — odpowiadaj na komentarze, iteruj
7. **Merge** po zatwierdzeniu

## Format pytania (JSON)

Każde pytanie w `data/questions.json` musi spełniać schemat (`contracts/schemas.json`):

```json
{
  "id": "Q-0001",
  "area": "B",
  "difficulty": 2,
  "type": "mcq",
  "q": "Który protokół warstwy aplikacji używa portu 443?",
  "options": ["HTTP", "HTTPS", "FTP", "SSH"],
  "correct": 1,
  "explanation": "HTTPS to HTTP over TLS, używa portu 443 (RFC 2818).",
  "ckeRef": "INF.02.3.1",
  "tags": ["sieci", "protokoly", "tls"],
  "frequency": "high"
}
```

### Pola

- `id` — `Q-NNNN` (4 cyfry, unikalne)
- `area` — kod obszaru: `B` `O` `N` `P` `D` `L` `W` `6` `V` `Z` `R` (11 obszarów INF.02)
- `difficulty` — `1` (łatwe) / `2` (średnie) / `3` (trudne)
- `type` — `mcq` (single choice) lub `fill` (uzupełnianie)
- `q` — treść pytania (PL)
- `options` — 4 opcje (tylko dla `mcq`)
- `correct` — index `0-3` (mcq) lub string (fill)
- `explanation` — uzasadnienie poprawnej odpowiedzi (1-3 zdania)
- `ckeRef` — odwołanie do podstawy programowej `INF.02.X.Y`
- `tags` — array stringów (kebab-case)
- `frequency` — `high` / `medium` / `low` (Pareto tagging)

## Format scenariusza

W `data/scenarios.json` — patrz `contracts/schemas.json` (sekcja `scenario`). Wymagane: `id`, `title`, `goal`, `steps[]`, `criteria[]` (zgodne z arkuszem oceny CKE), `timeLimit` (minuty), `difficulty`.

## Code style

- **Vanilla JS ES2017+** — żadnych frameworków (React/Vue/Svelte itd.)
- **No build step** — kod uruchamia się bezpośrednio w przeglądarce
- **Single-file artifacts:** `<2500 LoC` na artefakt (limit modelu)
- **Naming:** `camelCase` w JS, `kebab-case` w CSS/HTML, `snake_case` w plikach danych
- **Komentarze:** PL dla treści merytorycznej, EN dla logiki technicznej
- **Indent:** 2 spacje, brak tabów
- **A11y:** każdy interaktywny element musi mieć `aria-label` lub semantyczny tag

## Code of Conduct

- Bądź **uprzejmy i konstruktywny** — krytykuj kod, nie ludzi
- **Zero tolerancji** dla mowy nienawiści, dyskryminacji, agresji
- **Dziel się wiedzą** — wyjaśniaj nowicjuszom, pomagaj w review
- **Szanuj czas reviewerów** — testuj zmiany przed PR, opisuj kontekst
- Konflikty rozwiązuj przez dialog; w razie potrzeby kontakt z maintainerem

Naruszenia zgłaszaj przez GitHub Issues lub e-mail do maintainera.

## Pytania?

Otwórz [Issue](https://github.com/robertboguszewski/inf02-study-hub/issues) z labelem `question`. Odpowiedź zwykle w 48h.
