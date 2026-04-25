# Jak opublikować repo na GitHub

Sandbox Cowork nie ma autoryzacji do Twojego konta GitHub, więc finalne `git push` zrób z terminala na swoim Macu. Zajmuje 2 minuty.

## Wariant A — masz GitHub CLI (`gh`) ⚡

```bash
cd ~/projects/INF02

git init -b main
git add .
git commit -m "Initial public release v2.0 — INF.02 Study Hub"

# Utwórz publiczne repo i wypchnij za jednym razem
gh repo create inf02-study-hub --public --source=. --remote=origin --push --description "Adaptive learning app for Polish IT vocational exam INF.02 — 230 questions, 11 areas, SM-2 spaced repetition"
```

Repo pojawi się pod `https://github.com/<twoja-nazwa>/inf02-study-hub`.

## Wariant B — przez przeglądarkę + git push 🌐

### Krok 1: utwórz puste repo na GitHub

Otwórz [github.com/new](https://github.com/new). Wypełnij:

- **Repository name:** `inf02-study-hub`
- **Description:** `Adaptive learning app for Polish IT vocational exam INF.02 — 230 questions, 11 areas, SM-2 spaced repetition`
- **Visibility:** ✅ Public
- **Initialize:** ❌ NIC nie zaznaczaj (żadne README/LICENSE/.gitignore — mam już swoje)

Kliknij **Create repository**.

### Krok 2: w terminalu

```bash
cd ~/projects/INF02

git init -b main
git add .
git commit -m "Initial public release v2.0 — INF.02 Study Hub"
git remote add origin https://github.com/<TWOJA_NAZWA>/inf02-study-hub.git
git push -u origin main
```

(zamień `<TWOJA_NAZWA>` na swój username GitHub)

## Co zostanie opublikowane

```
inf02-study-hub/
├── README.md                    ← opis projektu, zakres, plan tygodniowy
├── LICENSE                      ← MIT
├── CHANGELOG.md                 ← historia zmian v1 → v2
├── .gitignore                   ← ignoruje .DS_Store, eksporty progresów, arkusze CKE PDF
├── inf02-study-hub-v2.html      ← główny artifact (166 KB, samodzielny)
├── inf02-study-hub.html         ← v1 (zachowana dla historii)
└── v2/
    ├── adaptive-engine.js       ← źródło adaptive engine (wkład Phase 1C)
    ├── questions-new.json       ← 80 nowych pytań + 4 fixes (wkład Phase 1B)
    ├── ux-modules.html          ← moduły UX (wkład Phase 1D)
    └── research-findings.md     ← research rynku (wkład Phase 1A)
```

## Co NIE pójdzie do repo (`.gitignore`)

- `inf02-progress-*.json` — Twoje lokalne eksporty postępów
- `cke/*.pdf` — arkusze CKE (potencjalnie chronione prawem autorskim)
- `v2/qa-questions-report.md`, `v2/questions-fixes.json` — robocze raporty QA
- `.DS_Store`, `node_modules/`, edytory itp.

## Po publikacji — opcjonalne ulepszenia

### GitHub Pages (live demo za darmo)

```bash
gh api repos/<TWOJA_NAZWA>/inf02-study-hub --method PATCH \
  -f homepage=https://<TWOJA_NAZWA>.github.io/inf02-study-hub/inf02-study-hub-v2.html
```

W Settings → Pages → Source: **main** → **/(root)** → Save. 
Po ~1 min app będzie pod `https://<TWOJA_NAZWA>.github.io/inf02-study-hub/inf02-study-hub-v2.html`.

### Topics (dla wyszukiwarki)

```bash
gh repo edit --add-topic education,polish,it-exam,inf02,adaptive-learning,spaced-repetition,vanilla-js,no-build
```

### Badge'y w README (już są przygotowane)

README już zawiera badge'y: License MIT, status v2.0, liczba pytań, liczba obszarów. Renderują się automatycznie po push.

## Coś poszło nie tak?

- **`git push` żąda hasła** → użyj Personal Access Token (Settings → Developer settings → Tokens) lub `gh auth login`
- **`Permission denied (publickey)`** → użyj HTTPS URL zamiast SSH (`https://github.com/...` zamiast `git@github.com:...`)
- **`failed to push some refs`** → pewnie zaznaczyłeś "Initialize with README" na GitHub. Usuń repo i zrób na nowo bez initów.
