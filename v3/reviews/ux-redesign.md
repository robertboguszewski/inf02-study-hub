# UX/UI Redesign Report — INF.02 Study Hub v3

**Audit zakres:** `artifacts/shell.html`, `artifacts/quiz.html`, `artifacts/srs.html`, `artifacts/diagnostic.html` (`practical.html` poza zakresem — naprawiany manualnie).
**Reference platforms:** Brilliant.org, Khan Academy, Codecademy, Duolingo, Quizlet.
**Data:** 2026-05-01.

---

## 1. Audit findings

### 1.1 Niespójności design tokens (4 pliki, 4 niezależne kopie)

Tokens są zduplikowane (single-file constraint, ADR-001), ale nie są identyczne:

| Token | shell.html | quiz.html | srs.html | diagnostic.html |
|---|---|---|---|---|
| `--sp-3xl` | 64px | 64px | **brak** | 64px |
| `--shadow-3` | tak | tak | **brak** | tak |
| `--ease-in-out` | tak | tak | **brak** | tak |
| `--dur-slow` | 320ms | 320ms | **brak** | 320ms |
| Font stack var | `--font-sans` | `--font-stack` | inline literal | `--font` |
| Mono var | `--font-mono` | `--font-mono` | inline | `--mono` |
| `h1` rozmiar | `--fs-xl` | brak globalu | brak | `--fs-2xl` |
| `border-radius` card | 8px | 16px | 12px | 12px |
| `border-radius` button | 6px | 10px | 8px | 8px |
| Light theme | tylko shell | brak | brak | brak |
| Token komentarza spójności | `/* Layout */` | `/* mirror of contracts */` | `/* duplikat */` | `/* COPIED */` |

**Hardcoded "tailwindish" wartości w shell.html (linie 277-300)** — łamią spójność:
```css
.exam-countdown--danger { background:#fee2e2; color:#dc2626; }   /* light hex */
.exam-countdown--warning { background:#fef3c7; color:#d97706; }
.exam-countdown__number { font-size:2.5rem; }                    /* nie używa --fs-2xl */
.daily-goal__bar { height:.5rem; }                               /* mix px/rem */
.settings-input { padding: .5rem .75rem; }                       /* nie używa --sp-* */
.ach-icon { font-size:1.75rem; }                                 /* nie używa --fs-md */
```

**Linki w SRS/Quiz/Diagnostic top-bar** używają nieistniejących CSS vars `--c-surface`, `--c-border`, `--c-accent`, `--c-text-muted` (z fallbackiem do hardcoded hex). Działa wizualnie, ale jest to "ghost token" — nigdzie niezdefiniowany.

### 1.2 Per-widok problemy

#### shell.html — Dashboard
- **Hierarchia "co ważne w 5 sek?" rozmyta.** Wszystko ma rangę `card` (jednolite tło, padding, radius). User nie widzi: streak, dni do egzaminu, weakest area "od pierwszego rzutu oka". Brak hero-card.
- `.row > .card { flex:1; min-width:240px }` — dobrze responsywne, ale prowadzi do 4-5 kart w jednym rzędzie na desktop, każda ten sam ciężar wizualny. Brilliant Home pokazuje **jeden wielki tile + grid mniejszych**.
- `.weekplan repeat(6,1fr)` — sztywne 6 kolumn gubi się na mid-tablet. Lepszy `auto-fit minmax(80px,1fr)`.
- `--fs-2xl` (39px) tylko w `.bigstat` i `.streak-num`. Reszta hierarchii płaska.

#### shell.html — Search/Pytania
- (Z grepa w shell.html) brak bottom-fixed search bara — wymagałby dla list-heavy widoku jak Quizlet.
- Filtry obszarów 11 chipów inline ⇒ na mobile wrap do 3 linii (wymaga max-height + scroll).

#### shell.html — Review/Przegląd
- W kodzie (`renderReview`) renderowane jako sessions list bez heatmap/trendu. Nie ma "gdzie wzrastam, gdzie spadam" — kluczowy info per Khan Academy.

#### shell.html — Achievements
- `.ach-card.locked { opacity:.4; filter:grayscale(1) }` — OK, ale brak progress bara "ile do odblokowania". Duolingo pokazuje `2/5`.

#### shell.html — Settings
- `.settings-group / .settings-label / .settings-input` rozmiary niezsynchronizowane z `.setting-row` (linie 240-243). Dwa równoległe systemy form w jednym pliku.

#### quiz.html — Mode picker
- **Krytyczne**: Render w `renderModePicker()` linie 1090-1097: 4 tryby renderowane jako wąskie `.btn` w `.picker-grid` z `gap:var(--sp-sm)`. To **zwykłe przyciski**, nie karty. Brilliant/Khan w mode-pickerze stosują **2×2 grid wielkich kart** (icon + tytuł + 1-zdanie opis + estymowany czas).
- Egzamin (40q×60min), Adaptacyjny (20q), Topic, Review — totalnie różne intent, użytkownik chce decyzji w 3-5s.

#### quiz.html — In-quiz
- **Timer sticky `top:var(--sp-sm)`** na `.timer` — sticky działa tylko jeśli scroll-context jest body, ale `.quiz-root` ma `position:relative` i `padding`. W praktyce timer scrolluje z headerem.
- **Brak sticky bottom action bara**. `.nav-row` z btn Prev/Next jest na końcu `.question-card`, użytkownik scrolluje by go znaleźć — w długich pytaniach ze szczegółami i wyjaśnieniami to ginie.
- `quiz-root max-width:760px` — OK, dobrze trafione (Brilliant 720px, Khan 760px).
- `.q-text { font-size:--fs-md (20px) }` — OK ale Brilliant/Duolingo używają 22-24px na desktopie.
- `.option { min-height:56px }` — dobra. Touch-friendly.

#### quiz.html — Results
- `.result-card` jest hero-card, OK. Brakuje dużej cyfry score+verdict w jednym wzrokowym kawałku.
- `.wrong-list` collapsible details — OK, ale `<summary>` ze stylem `cursor:pointer` bez wyraźnej ikony kierunku.

#### srs.html — Daily queue
- `.stats-grid` 4 stat-tile w `auto-fit minmax(140px)` — OK, ale nie wyróżnia "Do powtórzenia" (kluczowy). Anki/Quizlet pokazują **liczba do powtórzenia jako duży hero stat**, reszta jako side-stats.
- `.btn-primary "Rozpocznij sesję"` mała (44px). Brilliant/Duolingo CTA `min-height:56-64px`, wyraźny.

#### srs.html — Review (rating buttons)
- `.rating-row grid 4×1, gap:8px, min-height:56px` — dobrze. Działa. Ale **brak sticky bottom**: gdy fiszka ma wyjaśnienie + 4 opcje + szczegóły, ratings zjeżdżają z viewport.
- `.options-list` używa `padding:var(--sp-sm) var(--sp-md)` zamiast `var(--sp-md)` jak quiz.html `.option`. Niespójność.

#### diagnostic.html — Onboarding modal
- `max-width: 540px` OK. `padding: var(--sp-xl)` (32px) OK.
- `.steps-indicator` 4 dots przy `--sp-xs` (4px) gap — minimal, dobry.
- **Brak zamknięcia** (close button z modalu) i brak `position:sticky` dla footera — przy długim step 2 (slider mastery) footer scrolluje out.

#### diagnostic.html — Knowledge dashboard
- `.charts-grid 2fr 1fr @768px` — OK na desktop, ale `.chart-wrap height:360px` razem z `width:100%` w 2fr column = bardzo duży radar (ok 600px szerokości). Doughnut 220px — kontrast dobry.
- **Brak hero z `readinessForExam`** na samej górze — info o gotowości jest schowane w doughnut. Brilliant/Duolingo zawsze pokazują "X% ready" jako biggest stat.
- TOP 3 weakest list (jeśli jest renderowana) — OK, ale brak bezpośredniego CTA "Naucz się słabych" w hero-row.

### 1.3 Layout problems (mobile + general)

| Plik | Problem | Aktualnie | Fix |
|---|---|---|---|
| shell.html | sidebar 240px na 780-1023px tabletu | `.sidebar{width:200px}` jednak nadal duża jak na 780px viewport | unify do 200px ≥1024, hide <1024 |
| shell.html | `main padding-bottom:96px` zawsze (rezerwa pod mobile bottom-nav) na desktop = pusta przestrzeń | hardcoded | conditional: `padding-bottom:96px` tylko mobile |
| quiz.html | `quiz-root padding:var(--sp-md)` (16px) — na mobile OK, na desktop content się "klei" do max-width edge | jednolity | desktop `var(--sp-lg)` |
| diagnostic.html | `.app-shell max-width:1200px` + radar/doughnut — używa 1200px gdy sensowny content jest 800px | over-stretched | max-width 960px dla danych |
| srs.html | `.srs-app max-width:880px` — OK, blisko Brilliant 720, akceptowalne | — | leave |

### 1.4 Touch targets — wszystkie pliki

Większość OK (44px min). Wyjątki:
- `shell.html .chip` 2px+8px padding × `--fs-xs` = ~20px wysokość. **Tap target za mały**. Mobile fix: padding 6px 10px.
- `quiz.html .option-letter` 32×32px — używane jako label (nie klikalne), OK.
- `srs.html .queue-list li` cały row klikalny? Sprawdzić w JS — jeśli tak, padding 8px za niski.

### 1.5 Sticky elements

| Element | Aktualnie | Powinien być | Plik |
|---|---|---|---|
| Quiz timer | sticky top:var(--sp-sm) (broken w renderze) | sticky-top w global topbar | quiz.html |
| Quiz nav (prev/next) | static | **sticky bottom** | quiz.html |
| SRS rating row | static | **sticky bottom** when reviewing | srs.html |
| Onboarding footer | static | sticky bottom in modal | diagnostic.html |
| Search bar | brak | sticky top w view | shell.html |

---

## 2. Modern training pattern reference per widok

| Widok | Reference platform | Pattern |
|---|---|---|
| shell.html — Dashboard | **Brilliant Home** | Hero card (czego się dziś nauczyć) + grid 2-3 kafli stats + lista "continue" |
| shell.html — Search | **Quizlet sets** | Sticky search top + filter chips row + virtualized list |
| shell.html — Review | **Khan Mastery** | Heatmap obszarów + trend chart + per-session list |
| shell.html — Achievements | **Duolingo** | Grid 2-3 kolumny, locked grayscale, progress bar pod każdym |
| shell.html — Settings | **Codecademy account** | Sectioned form, jednolite inputs, save banner sticky |
| quiz.html — Mode picker | **Brilliant lesson menu** | 2×2 grid kart (icon + title + sub + duration) |
| quiz.html — In-quiz | **Duolingo lesson** | Sticky top progress + center single column 720px + sticky bottom CTA |
| quiz.html — Results | **Brilliant end-of-lesson** | Hero pct (huge) + verdict pill + stats row + collapsible wrong list |
| srs.html — Dashboard | **Anki / Quizlet study** | Hero "X due today" + side stats + huge "Start" CTA |
| srs.html — Review | **Duolingo flashcard** | Card front center + sticky bottom 4 ratings |
| diagnostic.html — Onboarding | **Brilliant onboarding** | 3-step wizard z dots + sticky modal footer (Back/Next) |
| diagnostic.html — Knowledge | **Khan Mastery dashboard** | Hero readiness pct + radar/doughnut + weakest CTA |

---

## 3. Konkretne CSS fixes (gotowe snippety)

### 3.1 Plik: shell.html — unify hardcoded values (linie 277-300)

Replace:
```css
.exam-countdown { display:flex; flex-direction:column; align-items:center; padding:.5rem 1rem; border-radius:.5rem; font-weight:700; }
.exam-countdown--danger { background:#fee2e2; color:#dc2626; }
.exam-countdown--warning { background:#fef3c7; color:#d97706; }
.exam-countdown--info { background:#dbeafe; color:#1d4ed8; }
.exam-countdown__number { font-size:2.5rem; line-height:1; }
.exam-countdown__label { font-size:.75rem; text-transform:uppercase; letter-spacing:.05em; }
.daily-goal { margin:.5rem 0; }
.daily-goal__label { font-size:.8rem; color:var(--color-text-muted); margin-bottom:.25rem; }
.daily-goal__bar { height:.5rem; background:var(--color-surface-2); border-radius:9999px; overflow:hidden; }
.daily-goal__fill { height:100%; background:var(--color-accent); border-radius:9999px; transition:width .3s; }
.settings-group { margin-bottom: 1.25rem; }
.settings-label { display: block; font-size: .875rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: .375rem; }
.settings-input { width: 100%; padding: .5rem .75rem; background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: .375rem; color: var(--color-text); font-size: .9rem; min-height: 40px; }
.settings-input:focus { outline: none; border-color: var(--color-accent); }
.ach-card { display:flex; flex-direction:column; gap:.375rem; }
.ach-card.locked { opacity:.4; filter:grayscale(1); }
.ach-icon { font-size:1.75rem; line-height:1; }
```

With:
```css
.exam-countdown { display:flex; flex-direction:column; align-items:center; padding:var(--sp-sm) var(--sp-md); border-radius:8px; font-weight:700; }
.exam-countdown--danger { background:rgba(255,107,107,0.12); color:var(--color-danger); border:1px solid var(--color-danger); }
.exam-countdown--warning { background:rgba(255,180,84,0.12); color:var(--color-warning); border:1px solid var(--color-warning); }
.exam-countdown--info { background:rgba(94,169,255,0.12); color:var(--color-accent); border:1px solid var(--color-accent); }
.exam-countdown__number { font-size:var(--fs-2xl); line-height:1; }
.exam-countdown__label { font-size:var(--fs-xs); text-transform:uppercase; letter-spacing:.05em; }

.daily-goal { margin:var(--sp-sm) 0; }
.daily-goal__label { font-size:var(--fs-xs); color:var(--color-text-muted); margin-bottom:var(--sp-xs); }
.daily-goal__bar { height:8px; background:var(--color-surface-2); border-radius:99px; overflow:hidden; }
.daily-goal__fill { height:100%; background:var(--color-accent); border-radius:99px; transition:width var(--dur-slow) var(--ease-out); }

.settings-group { margin-bottom: var(--sp-lg); }
.settings-label { display:block; font-size:var(--fs-xs); font-weight:600; color:var(--color-text-muted); margin-bottom:var(--sp-xs); }
.settings-input { width:100%; padding:10px var(--sp-sm); background:var(--color-surface-2); border:1px solid var(--color-border); border-radius:6px; color:var(--color-text); font-size:var(--fs-sm); min-height:44px; }
.settings-input:focus { outline:none; border-color:var(--color-accent); }

.ach-card { display:flex; flex-direction:column; gap:var(--sp-xs); }
.ach-card.locked { opacity:.45; filter:grayscale(1); }
.ach-icon { font-size:var(--fs-lg); line-height:1; }
```

### 3.2 Plik: shell.html — main padding desktop

Replace:
```css
main{flex:1;padding:var(--sp-lg);max-width:1200px;width:100%;margin:0 auto;padding-bottom:96px}
```

With:
```css
main{flex:1;padding:var(--sp-lg);max-width:1200px;width:100%;margin:0 auto}
@media (max-width:779px){ main{padding-bottom:96px} }
```

(już jest media query ale `padding:var(--sp-md);padding-bottom:96px` — tu duplikuje. Usuń ze sztywnej deklaracji.)

### 3.3 Plik: quiz.html — Mode picker jako duże karty

W CSS (po `.picker-area-btn` ~ linia 281) **dodaj**:
```css
/* ----- Mode picker as cards (Brilliant lesson menu pattern) ----- */
.picker-grid--modes {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--sp-md);
}
.picker-mode-card {
  display: flex; flex-direction: column;
  gap: var(--sp-xs);
  background: var(--color-surface-2);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: var(--sp-lg);
  text-align: left;
  cursor: pointer;
  min-height: 120px;
  color: var(--color-text);
  transition: transform var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out),
              background var(--dur-fast) var(--ease-out);
}
.picker-mode-card:hover { transform: translateY(-3px); border-color: var(--color-accent); background: #2c313c; }
.picker-mode-card .icon { font-size: var(--fs-xl); line-height: 1; }
.picker-mode-card .title { font-size: var(--fs-md); font-weight: 700; margin-top: var(--sp-xs); }
.picker-mode-card .desc { font-size: var(--fs-xs); color: var(--color-text-muted); }
.picker-mode-card .meta { font-size: var(--fs-xs); color: var(--color-accent); font-family: var(--font-mono); margin-top: auto; }
.picker-mode-card.primary { border-color: var(--color-accent); background: rgba(94,169,255,0.08); }
.picker-mode-card.primary .icon { color: var(--color-accent); }
```

W JS w `renderModePicker()` (~linia 1086) **replace**:
```js
r.innerHTML = `
  <section class="picker-wrap">
    <h2>Wybierz tryb quizu</h2>
    <div class="picker-grid">
      <button class="btn btn--primary" data-mode="exam">Egzamin (40 pyt × 60 min)</button>
      <button class="btn" data-mode="adaptive">Adaptacyjny (20 pyt)</button>
      <button class="btn" data-mode="topic">Obszar tematyczny</button>
      <button class="btn" data-mode="review">Powtórka błędów</button>
    </div>
  </section>`;
```

z:
```js
r.innerHTML = `
  <section class="picker-wrap">
    <h2>Wybierz tryb quizu</h2>
    <div class="picker-grid picker-grid--modes">
      <button class="picker-mode-card primary" data-mode="exam" type="button">
        <span class="icon" aria-hidden="true">🎓</span>
        <span class="title">Egzamin</span>
        <span class="desc">Pełny test pisemny w warunkach CKE.</span>
        <span class="meta">40 pytań · 60 minut · próg 50%</span>
      </button>
      <button class="picker-mode-card" data-mode="adaptive" type="button">
        <span class="icon" aria-hidden="true">🎯</span>
        <span class="title">Adaptacyjny</span>
        <span class="desc">Pytania dobierane do Twoich słabych obszarów.</span>
        <span class="meta">20 pytań · bez limitu czasu</span>
      </button>
      <button class="picker-mode-card" data-mode="topic" type="button">
        <span class="icon" aria-hidden="true">📚</span>
        <span class="title">Obszar tematyczny</span>
        <span class="desc">Quiz z jednego z 11 obszarów INF.02.</span>
        <span class="meta">10 pytań · wybór obszaru</span>
      </button>
      <button class="picker-mode-card" data-mode="review" type="button">
        <span class="icon" aria-hidden="true">🔁</span>
        <span class="title">Powtórka błędów</span>
        <span class="desc">Tylko pytania, w których popełniłeś błąd.</span>
        <span class="meta">do 20 pytań · z historii</span>
      </button>
    </div>
  </section>`;
r.querySelectorAll('button[data-mode]').forEach(b => { ... }); // bez zmian
```

### 3.4 Plik: quiz.html — Sticky topbar i bottom nav

W CSS po `.timer--crit` (~linia 132) **dodaj**:
```css
/* ----- Sticky in-quiz top progress bar (Duolingo lesson pattern) ----- */
.quiz-stickybar {
  position: sticky; top: 0; z-index: 10;
  background: var(--color-bg);
  padding: var(--sp-sm) 0;
  margin: calc(-1 * var(--sp-md)) calc(-1 * var(--sp-md)) var(--sp-md);
  padding-left: var(--sp-md); padding-right: var(--sp-md);
  border-bottom: 1px solid var(--color-border);
  display: flex; align-items: center; gap: var(--sp-md); flex-wrap: wrap;
}
.quiz-stickybar .progress-bar { flex: 1 1 200px; min-width: 160px; }

/* ----- Sticky bottom action bar ----- */
.quiz-actionbar {
  position: sticky; bottom: 0;
  margin: var(--sp-lg) calc(-1 * var(--sp-md)) 0;
  padding: var(--sp-sm) var(--sp-md);
  background: linear-gradient(to top, var(--color-bg) 70%, rgba(15,17,21,0));
  display: flex; gap: var(--sp-sm); justify-content: space-between; flex-wrap: wrap;
  z-index: 5;
}
.quiz-actionbar .btn { flex: 1 1 auto; min-width: 120px; }
```

(JS-side: `renderQuiz()` template — zamiana `<header class="quiz-header">…</header>` + `<div class="progress-wrap">` na `<div class="quiz-stickybar">…</div>` z timer+progress razem; oraz `nav-row` w `<div class="quiz-actionbar">`. Klasy `nav-row .btn` zachowane.)

### 3.5 Plik: srs.html — Hero stat + sticky rating row

W CSS dodaj (po `.stats-grid`, ~linia 88):
```css
/* Hero stat — "X due today" (Anki/Quizlet pattern) */
.srs-hero {
  display: flex; flex-direction: column; align-items: center; gap: var(--sp-xs);
  padding: var(--sp-xl) var(--sp-lg);
  background: linear-gradient(135deg, rgba(94,169,255,0.10), rgba(61,220,151,0.06));
  border: 1px solid var(--color-border);
  border-radius: 16px;
  margin-bottom: var(--sp-md);
  text-align: center;
}
.srs-hero .num {
  font-size: 4rem; font-weight: 700; color: var(--color-accent); line-height: 1;
  font-variant-numeric: tabular-nums;
}
.srs-hero .lbl { font-size: var(--fs-sm); color: var(--color-text-muted); }
.srs-hero .btn-primary { min-height: 56px; font-size: var(--fs-md); padding: 14px 28px; margin-top: var(--sp-md); }

/* Sticky rating row in review mode */
.rating-row.sticky {
  position: sticky; bottom: 0;
  background: linear-gradient(to top, var(--color-bg) 80%, rgba(15,17,21,0));
  padding: var(--sp-sm) 0 var(--sp-md);
  z-index: 5;
}
```

### 3.6 Plik: diagnostic.html — Hero readiness + sticky modal footer

Dodaj po `.recommend-banner` (~linia 386):
```css
/* Hero readiness card (Khan Mastery pattern) */
.readiness-hero {
  display: grid; grid-template-columns: auto 1fr; gap: var(--sp-lg); align-items: center;
  padding: var(--sp-xl);
  background: linear-gradient(135deg, rgba(94,169,255,0.12), rgba(61,220,151,0.08));
  border: 1px solid var(--color-border);
  border-radius: 16px;
  margin-bottom: var(--sp-lg);
}
.readiness-hero .pct {
  font-size: 4rem; font-weight: 700; color: var(--color-accent); line-height: 1;
  font-variant-numeric: tabular-nums;
}
.readiness-hero .lbl { color: var(--color-text-muted); font-size: var(--fs-sm); margin-top: var(--sp-xs); }
.readiness-hero h2 { margin: 0 0 var(--sp-xs); }
@media (max-width: 600px) {
  .readiness-hero { grid-template-columns: 1fr; text-align: center; }
}

/* Sticky onboarding modal footer */
.modal .footer.sticky {
  position: sticky; bottom: calc(-1 * var(--sp-xl));
  margin: var(--sp-xl) calc(-1 * var(--sp-xl)) calc(-1 * var(--sp-xl));
  padding: var(--sp-md) var(--sp-xl);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}
```

---

## 4. Plan implementacji (priorytet)

| # | Priorytet | Co | Plik | Impact | Effort |
|---|---|---|---|---|---|
| 1 | **P0** | Unify hardcoded values w shell.html (3.1) | shell.html | high | low |
| 2 | **P0** | Mode picker → duże karty (3.3) | quiz.html | high | low |
| 3 | **P0** | Sticky topbar + bottom action w quiz (3.4) | quiz.html | high | medium |
| 4 | P1 | Hero "X due" w SRS (3.5) | srs.html | high | low |
| 5 | P1 | Hero readiness w diagnostic (3.6) | diagnostic.html | high | low |
| 6 | P1 | main padding-bottom mobile-only (3.2) | shell.html | medium | low |
| 7 | P2 | Sticky rating row w SRS review (3.5 part 2) | srs.html | medium | medium (JS) |
| 8 | P2 | Sticky modal footer onboarding (3.6 part 2) | diagnostic.html | low | medium (JS) |
| 9 | P2 | Search bar sticky w shell.html | shell.html | medium | medium (JS) |
| 10 | P3 | Knowledge dashboard heatmap w shell review | shell.html | medium | high |
| 11 | P3 | Achievement progress bar | shell.html | low | medium |

W tej sesji aplikuję **#1, #2, #3 (P0)**, plus **#4 i #5 (P1)** jako CSS-only — bez ryzyka łamania JS. Reszta wymaga zmian w JS templating i jest poza obecnym budżetem.

---

## 5. Backward compatibility (JS)

Wszystkie fixy w sekcji 3 zachowują:
- ID elementów (`#main`, `#quiz-app`, `#srsRoot`, `#viewDashboard`, `#onboarding`, `#main`, `#view-root`, `#btnStartSession`, `#queueCount`, etc.)
- Klasy używane w JS:
  - quiz.html: `.option`, `.option--*`, `.btn`, `.btn--*`, `.nav-row`, `.timer`, `.timer--*`, `.progress-fill`, `.picker-grid`, `.picker-area-btn` (zachowane), `.question-card`, `.q-text`, `.fill-input`, `.fill-feedback*`, `.area-chip`, `.qid-tag`, `.result-card`, `.result-pct*`, `.result-verdict`, `.wrong-list`, `.wrong-item`, `.banner`
  - srs.html: `.btn`, `.btn-primary`, `.rating-btn.again|hard|good|easy`, `.queue-list`, `.options-list li.correct`, `.area-chip`, `.histogram .bar`, `.empty-state`, `.toast`, `.self-test .pass|fail`, `.hidden`
  - shell.html: `.navbtn`, `.navbtn.active`, `.bottom-nav`, `.drawer`, `.toast`, `.bigstat`, `.bar`, `.chip`, `.area-row`, `.weekplan`, `.kb-row`, `.sessions-list .pass|fail`, `.streak-num`, `.setting-row`, `.toggle`, `.exam-countdown*`, `.daily-goal*`, `.settings-input`, `.ach-card.locked`, `.ach-icon`
  - diagnostic.html: `.option-row.selected`, `.radio-row.selected`, `.steps-indicator .dot.active|done`, `.area-chip[data-area]`, `.diff-*`, `.area-bars`, `.charts-grid`, `.chart-wrap`, `.modal-backdrop[hidden]`, `.fb-correct|wrong`, `.flag-ok|bad`

**Nowe klasy są addytywne** (`.picker-mode-card`, `.picker-grid--modes`, `.quiz-stickybar`, `.quiz-actionbar`, `.srs-hero`, `.readiness-hero`, `.rating-row.sticky`). Nie kolidują z JS.

---

## 6. Out of scope tej sesji

- **practical.html**: naprawiana manualnie przez parent agenta (3-column → 1-column).
- **Light theme tokens** dla quiz/srs/diagnostic: shell.html ma `[data-theme="light"]` ale pozostałe pliki nie. Dodaje to do P3 — wymaga skoordynowanego patcha.
- **Accessibility audit (WCAG)**: focus-visible jest w każdym pliku ale `aria-live` regions, headings hierarchy i keyboard navigation wymagają osobnego audytu.
- **Bundle size**: Light theme + dodatkowe karty/skeleton dodają ~3-5 KB CSS na plik. Nadal w budżecie ADR-001.
