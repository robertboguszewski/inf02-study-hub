# SETUP — dla deweloperów

Setup dev środowiska INF.02 Study Hub. **Brak build stepa** — projekt to czysty HTML/JS/CSS.

## Clone

```bash
git clone https://github.com/robertboguszewski/inf02-study-hub.git
cd inf02-study-hub
```

## Uruchomienie

Otwórz `v3/artifacts/shell.html` bezpośrednio w przeglądarce — drag&drop lub `File → Open`.

Opcjonalnie (dla service workera w pełni działającego lokalnie) uruchom mały serwer HTTP:

```bash
# Python
python3 -m http.server 8080
# Node
npx serve .
```

Następnie wejdź na `http://localhost:8080/v3/artifacts/shell.html`.

## Struktura projektu

| Ścieżka | Zawartość |
|---|---|
| `v3/artifacts/shell.html` | Główny artefakt aplikacji (~95 KB, single-file) |
| `data/questions.json` | 297 pytań INF.02 (edytuj tutaj) |
| `data/scenarios.json` | 12 scenariuszy części praktycznej |
| `contracts/schemas.json` | JSON Schema (draft 2020-12) walidujące dane |
| `tests/*.test.md` | 175 testów (manual + scripted) |
| `docs/index.html` | Landing page (GitHub Pages root) |
| `.github/workflows/deploy.yml` | Auto-deploy CI |

## Edycja treści

- **Pytania:** `data/questions.json` — pole `id`, `area`, `difficulty`, `q`, `options`, `correct`, `explanation`, `ckeRef`, `tags`, `frequency`. Schemat w `contracts/schemas.json`.
- **Scenariusze:** `data/scenarios.json` — definicja zadania praktycznego (cel, kroki, kryteria oceny CKE).
- **Stylowanie:** design tokens w `<style>` w `shell.html` (CSS custom properties, light/dark theme).

## Tests

Testy manualne w `tests/*.test.md` — 175 przypadków pokrywających: walidację schematu, adaptive engine, SM-2, eksport/import, PWA, WCAG.

```bash
# Walidacja JSON Schema (ajv)
npx ajv validate -s contracts/schemas.json -d data/questions.json
```

## Deploy

Auto-deploy przez GitHub Actions:

```bash
git add .
git commit -m "feat: nowe pytania z obszaru P"
git push origin main
```

Workflow `.github/workflows/deploy.yml` automatycznie publikuje repo na GitHub Pages (`/docs` jako landing, cała struktura jako artifact). Adres: `https://robertboguszewski.github.io/inf02-study-hub/`.

## Konwencje

- **JS:** ES2017+, vanilla, brak frameworków, brak transpilacji
- **Single-file artifacts:** każdy `<2500 LoC` (limit kontekstu)
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
