# INF.02 Study Hub

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen?logo=github)](https://robertboguszewski.github.io/inf02-study-hub/v3/artifacts/shell.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Pytania](https://img.shields.io/badge/pyta%C5%84-297-blue)](./data/questions.json)
[![Obszary](https://img.shields.io/badge/obszary-11-orange)](./CLAUDE.md)
[![CKE 2026](https://img.shields.io/badge/CKE-2026-red)](https://cke.gov.pl)
[![PWA](https://img.shields.io/badge/PWA-installable-9cf?logo=pwa)](./v3/artifacts/shell.html)
[![WCAG AA](https://img.shields.io/badge/WCAG-AA-success)](./v3/artifacts/shell.html)

## TL;DR

Darmowa, otwarta aplikacja webowa do nauki na egzamin zawodowy **INF.02 (Administracja i eksploatacja systemów komputerowych)** w formule CKE 2026. Zero backendu, zero śledzenia, działa offline jako PWA. **[Otwórz aplikację →](https://robertboguszewski.github.io/inf02-study-hub/v3/artifacts/shell.html)**

## Funkcje

- **Quiz egzaminacyjny CKE-style** — 40 pytań × 60 minut, identyczna formuła jak prawdziwy egzamin
- **Diagnoza wstępna** — 12-pytaniowy test → adaptive engine dobiera ścieżkę nauki
- **Symulator części praktycznej** — 12 scenariuszy CKE w trybie 150-minutowym
- **Spaced repetition (SM-2)** — fiszki + codzienna kolejka powtórek
- **297 pytań w 11 obszarach** z Pareto frequency tagging (high/medium/low)
- **PWA installable** + offline-first (service worker + cache)
- **Light/dark theme** + zgodność z WCAG AA (kontrast, focus, ARIA)
- **Eksport/import postępów** w formacie JSON (pełna kontrola nad danymi)

## 3 scenariusze użytkowania

### 1. Online (najprostszy)
Otwórz [`inf02-study-hub.github.io`](https://robertboguszewski.github.io/inf02-study-hub/v3/artifacts/shell.html) → kliknij **"Diagnoza"** → zacznij się uczyć. Postęp zapisuje się w `localStorage` przeglądarki.

### 2. Clone (lokalnie)
```bash
git clone https://github.com/robertboguszewski/inf02-study-hub.git
cd inf02-study-hub
# Otwórz v3/artifacts/shell.html w przeglądarce (drag&drop lub File → Open)
```

### 3. Pro (Claude Code)
Sklonuj repo i otwórz w [Claude Code](https://docs.claude.com/claude-code) — asystent automatycznie rozpozna `CLAUDE.md` i pomoże w edycji pytań/scenariuszy.

## Macierz funkcji per scenariusz

| Funkcja | Online | Clone | Pro (Claude Code) |
|---|:---:|:---:|:---:|
| Quiz / Diagnoza / Symulator | tak | tak | tak |
| PWA install | tak | nie | nie |
| Offline (po 1. wizycie) | tak | tak | tak |
| Edycja pytań | nie | tak | tak (z asystentem) |
| Generowanie nowych scenariuszy | nie | manualnie | tak (AI-assisted) |
| Auto-deploy po zmianach | nie | nie | tak (GitHub Actions) |

## Quick start

```bash
git clone https://github.com/robertboguszewski/inf02-study-hub.git
open inf02-study-hub/v3/artifacts/shell.html
```

## Tech stack

- **Frontend:** Vanilla JS (ES2017+), single-file HTML artifacts (~95 KB każdy)
- **Wykresy:** Chart.js v4.5.0 (CDN)
- **Storage:** `localStorage` + `IndexedDB` (postęp, fiszki SM-2)
- **Backend:** zero — aplikacja w pełni statyczna
- **Privacy:** zero PII, zero analytics, zero cookies poza technicznymi
- **Hosting:** GitHub Pages (z `/docs`)

## Disclaimer

> **Disclaimer:** Aplikacja edukacyjna do samodzielnej nauki. Treść oparta na publicznie dostępnych wymaganiach CKE (Centralna Komisja Egzaminacyjna) i podstawie programowej MEN. **Aplikacja NIE GWARANTUJE zdania egzaminu zawodowego INF.02.** Treść tworzona z największą starannością, ale może zawierać błędy — uczeń powinien weryfikować odpowiedzi z oficjalnymi materiałami CKE i podręcznikami. Autorzy nie ponoszą odpowiedzialności za szkody wynikające z użycia aplikacji. Pytania są autorskie, w stylu CKE — nie są kopiami oficjalnych arkuszy egzaminacyjnych.

## Sources / credits

- [CKE — Centralna Komisja Egzaminacyjna](https://cke.gov.pl) — formuła egzaminu, wymagania
- [MEN — podstawa programowa](https://www.gov.pl/web/edukacja) — kwalifikacja INF.02
- [Cisco Networking Academy PL](https://www.netacad.com/) — terminologia sieciowa
- [Microsoft Polska](https://learn.microsoft.com/pl-pl/) — terminologia Windows Server / AD

## License

[MIT License](./LICENSE) — używaj, modyfikuj, dystrybuuj swobodnie.

## Authors

- **Robert Boguszewski** — koncepcja, treść merytoryczna, kuratorstwo pytań
- **Claude (Anthropic)** — implementacja, architektura, code review

---

*v4.2.0 · 297 pytań · 12 scenariuszy · 11 obszarów · CKE 2026*
