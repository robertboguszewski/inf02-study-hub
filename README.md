# INF.02 Study Hub

Interaktywna aplikacja webowa do nauki do polskiego egzaminu zawodowego **INF.02** — *Administracja i eksploatacja systemów komputerowych, urządzeń peryferyjnych i lokalnych sieci komputerowych* (kwalifikacja Technik informatyk).

> 📅 Sesja lato 2026 · 📝 Egzamin pisemny: 02–11.06 · 🛠️ Egzamin praktyczny: 12–18.06

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Status](https://img.shields.io/badge/status-v2.0-blue)]()
[![Pytania](https://img.shields.io/badge/pytania-230-green)]()
[![Obszary](https://img.shields.io/badge/obszary-11-orange)]()

## Co to jest

Pojedynczy plik HTML (samodzielny, bez instalacji) zawierający:

- **230 pytań egzaminacyjnych** w stylu CKE z wyjaśnieniami
- **11 obszarów tematycznych** pokrywających pełny zakres INF.02
- **Adaptive learning engine** — algorytm SM-2 + targetowanie słabych obszarów
- **Spaced repetition** z 4-stopniową ratingą (Again / Hard / Good / Easy)
- **Diagnoza wstępna** (12 pytań kalibrujących)
- **Symulator egzaminu** 40 pytań × 60 min
- **Kalkulator podsieci IPv4** + generator zadań praktycznych
- **Quiz poleceń CLI** (Linux + Windows)
- **Streak counter**, achievementy, plan 6-tygodniowy
- **Eksport/import postępów** w JSON

## Szybki start

Otwórz `inf02-study-hub-v2.html` w przeglądarce. Tyle.

```bash
open inf02-study-hub-v2.html  # macOS
xdg-open inf02-study-hub-v2.html  # Linux
start inf02-study-hub-v2.html  # Windows
```

Lub serwuj lokalnie:

```bash
python3 -m http.server 8000
# → http://localhost:8000/inf02-study-hub-v2.html
```

Brak instalacji, brak buildu, brak backendu. Postępy zapisywane w `localStorage` przeglądarki + opcjonalny eksport JSON.

## Zakres materiału (11 obszarów)

| Kod | Obszar | Liczba pytań |
|-----|--------|:---:|
| **B** | Budowa komputera i podzespoły | 30 |
| **O** | Systemy operacyjne (Windows + Linux) | 35 |
| **N** | Sieci komputerowe i adresacja IPv4 | 35 |
| **P** | Peryferia i sprzęt sieciowy | 20 |
| **D** | Diagnostyka i naprawa | 30 |
| **L** | Prawo, BHP, licencje, dokumentacja, normy | 15 |
| **W** | Windows Server (DHCP, DNS, AD DS, GPO) | 15 |
| **6** | IPv6 i routing zaawansowany | 10 |
| **V** | Wirtualizacja (Hyper-V, VHDX) i backup (GFS, 3-2-1) | 10 |
| **Z** | Bezpieczeństwo zaawansowane (BitLocker, NTFS ACL, EFS) | 10 |
| **R** | Praktyka CKE-style (RAID, podsieci, scenariusze) | 20 |
| | **RAZEM** | **230** |

## Tryby nauki

- **📊 Dashboard** — postęp per obszar, dni do egzaminu, plan 6-tygodniowy, ostatnie quizy
- **📝 Quiz egzaminacyjny** — 40 pytań × 60 min (symulacja CKE) lub mini-testy 10/20 pyt
- **🎯 Diagnoza** — 12 pytań kalibrujących + knowledge model per obszar
- **📈 Naucz się słabych** — adaptive quiz ważony 70% słabe / 30% mocne obszary
- **🔁 Fiszki SR** — SM-2 z 4-rating + soft lapse, codzienna kolejka
- **📚 Nauka tematyczna** — przegląd pytań filtrowanych po obszarze z wyjaśnieniami
- **🛠️ Symulator praktyczny** — kalkulator podsieci IPv4, generator zadań IP, quiz poleceń CLI
- **🏆 Osiągnięcia** — 12 achievementów do odblokowania
- **⚙️ Postępy / Eksport** — eksport/import JSON

## Architektura

Pojedynczy plik HTML zawierający:

```
inf02-study-hub-v2.html (~166 KB)
├── <style> — design system (CSS variables, responsive, mobile bottom-nav)
├── <nav>   — sidebar navigation + streak counter
├── <template id="ux-onboarding-modal"> — 3-step onboarding wizard
├── <main>  — kontener widoków
└── <script>
    ├── AdaptiveEngine (window.AdaptiveEngine, ~430 LOC)
    │   ├── selectDiagnosticQuestions() — diagnoza wstępna
    │   ├── selectQuizQuestions()       — weighted quiz selection
    │   ├── rateCard()                  — SM-2 + 4-rating + soft lapse
    │   ├── matchAnswer()               — tolerancyjny matcher dla free recall
    │   ├── renderWorkedExample()       — worked examples z fading
    │   └── getKnowledgeReport()        — knowledge model (Bayesian-ish EWMA)
    ├── UX modules (window.UX)
    │   ├── onboarding   — 3-step wizard
    │   ├── streak       — daily activity tracker
    │   ├── achievements — 12 badges + toasts
    │   ├── mobile       — bottom-nav + 44px tap targets
    │   └── fx           — confetti, count-up, haptic, micro-shake
    ├── QUESTIONS — 230 pytań (id 1-230)
    ├── VIEWS     — dashboard, quiz, srs, topics, practice, diagnosis, review, achievements, settings
    └── Router + state management (localStorage)
```

## Cechy adaptive learning

| Mechanika | Implementacja | Źródło |
|-----------|---------------|--------|
| Spaced repetition | SM-2 z modulacją ease (Hard −0.15, Easy +0.15) | Wozniak 1990 |
| Lapse penalty | Soft lapse: interval × 0.2 (zamiast resetu) | Ye 2023 (FSRS) |
| Weak-area targeting | Ważone losowanie `(1 − knowledge[a])²`, 70/30 split | Corbett & Anderson 1995 (BKT) |
| Knowledge model | EWMA per area (α=0.7) | Lindsey et al. 2014 |
| Worked examples | Fading: full → scaffold → hint → solo | Renkl & Atkinson 2003 |
| Interleaving | Mixed-area quizes po opanowaniu obszaru | Rohrer et al. 2015 |
| Free recall | Pole tekstowe + tolerancyjny matcher (5-10% pytań) | Karpicke & Roediger 2008 |

## Plan tygodniowy (6 tygodni do sesji lato 2026)

1. **Tyg 1:** Budowa komputera (B)
2. **Tyg 2:** Peryferia + diagnostyka (P, D)
3. **Tyg 3:** Systemy Windows + Win Server (O, W)
4. **Tyg 4:** Linux + bezpieczeństwo + wirtualizacja (O, Z, V)
5. **Tyg 5:** Sieci + IPv6 + routing (N, 6)
6. **Tyg 6:** Mock examy + powtórki SR słabych obszarów + BHP/licencje (L, R)

## Wymagania techniczne

- Przeglądarka: Chrome / Firefox / Safari / Edge (ES2017+)
- Brak zewnętrznych zależności
- Brak backendu — wszystko po stronie klienta
- Persystencja: `localStorage` (klucz `inf02_progress_v2`)

## Status projektu

**v2.0** (kwiecień 2026) — pełna integracja Phase 1 (research, content, adaptive engine, UX redesign).

### Roadmap

- [x] v1: 150 pytań, 5 obszarów, podstawowy quiz + Leitner SR
- [x] v2: 230 pytań, 11 obszarów, adaptive engine SM-2, onboarding, gamifikacja
- [ ] v3: integracja prawdziwych arkuszy CKE 2019–2025 (po dostarczeniu PDF)
- [ ] v4: wideo wyjaśnienia dla najtrudniejszych pytań, AI tutor on-demand, symulator zadań praktycznych w przeglądarce
- [ ] v5: tryb mobilny PWA, push notifications dla streak

## Wkład

Pull requesty mile widziane. Szczególnie potrzebne:

- Weryfikacja merytoryczna pytań przez czynnych nauczycieli/egzaminatorów
- Dodanie autentycznych pytań z arkuszy CKE (z odpowiednim cytowaniem)
- Tłumaczenia (EN, DE) — INF.02 jest polski, ale infrastruktura adaptive engine ogólna
- Nowe obszary tematyczne dla pokrewnych kwalifikacji (INF.03, INF.04, EE.08)

Format pytania:

```javascript
{id: 231, a: "B", q: "treść pytania",
 o: ["A","B","C","D"], c: 0,
 e: "wyjaśnienie 1-3 zdania, edukacyjne"}
```

Pole `a` (area): `B|O|N|P|D|L|W|6|V|Z|R`

## Inspiracje i podziękowania

- **Centralna Komisja Egzaminacyjna (CKE)** — źródło wymagań i formatu egzaminu
- **Maurycy Gast** ([korepetycjezinformatyki.pl](https://www.korepetycjezinformatyki.pl/)) — wzorzec dydaktyczny
- **Anki / Mnemosyne / SuperMemo** — algorytmy SR
- **Duolingo** — wzorzec gamifikacji
- **Brilliant** — wzorzec interactive learning

## Licencja

MIT — zobacz plik [LICENSE](./LICENSE).

Pytania egzaminacyjne stworzone od zera w stylu CKE; nie są kopią autorskich arkuszy.

---

> Built with [Claude](https://claude.com) in Cowork mode — multi-agent pipeline (research → content → adaptive engine → UX → integration → QA).
