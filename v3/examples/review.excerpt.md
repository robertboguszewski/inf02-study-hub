# review.excerpt.md — wzorzec output Fazy 3 (peer review)

> Top 3 issues z `reviews/review-final.md` projektu INF.02 Study Hub v3.
> Pokazuje format **P0/P1/P2 + Test + Lokalizacja + Obserwacja + Repro + Sugestia + Effort + Risk**.
> Reviewer weryfikuje kod manualnie — NIE ufa Builder claims. Brutalna szczerość.

---

### Issue #1 — P0 — kontrakty/architektura — Naruszenie ADR-003: bezpośredni `localStorage.*` w 4 z 5 artefaktów

**Test:** TEST-SHELL-05 (storage adapter), TEST-SYS-PROMPT-06 (single writer)
**Lokalizacja:**
- `quiz.html` linie 471-475, 582-614, 653-668 (5 wystąpień direct `localStorage.*`)
- `practical.html` linie 653-658, 1225-1244 (4 wystąpienia)
- `srs.html` linie 426, 436 (fallback shell zapisujący bezpośrednio)
- `shell.html` 376-409 (poprawnie — to jedyny dozwolony writer z handlingiem quota)

**Obserwacja:** Architecture sekcja 1.2 jasno mówi „**OBOWIĄZKOWE:** każdy artefakt MUSI używać tego adaptera. NO direct `localStorage.*`. Reviewer odrzuca PR z `localStorage.setItem` poza tą sekcją." Tymczasem quiz, practical i srs zapisują niezależnie do tego samego klucza `inf02.v3.state`. To race-condition by design (patrz Issue #2).

**Repro:** Zakończ quiz w jednej karcie podczas gdy w drugiej karcie running session SRS. quiz.html `endSession()` → `await storage.setItem('inf02.v3.state', ...)` jednocześnie z srs.html → `localStorage.setItem(STATE_KEY, ...)`. Last-write-wins; jedna sesja przepada bez śladu.

**Oczekiwane:** Wszystkie pisma idą przez `INF02.shell.setState(patch)` (deep-merge + sequential `_persistChain`).

**Sugestia fix:** w quiz.html / practical.html / srs.html usuń wszystkie direct `localStorage.setItem` na klucz `inf02.v3.state`. Ufaj `shellSetState(patch)` — shell.html JUŻ implementuje fallback.

**Effort:** S (40 minut, 6 miejsc)
**Risk:** Niskie (czyszczenie martwego kodu)

---

### Issue #2 — P0 — race condition — Multi-tab piszą do tego samego klucza bez `seq` guard

**Test:** TEST-SHELL-06 (setState merge + seq), TEST-SYS-PROMPT-05 (single writer)
**Lokalizacja:** quiz.html 1085-1099, practical.html 1224-1235, srs.html 437.

**Obserwacja:** `shell.html` ma `_persistChain` (sequential await) + `seq` increment. Ale gdy user otwiera quiz.html w nowej karcie, shell w tamtej karcie jest osobnym kontekstem JS. Drugi shell-instance czyta state w bootstrap, a przy `endSession` zapisuje **bezpośrednio** do `inf02.v3.state` bypassując in-memory `_state` shell-a w pierwszej karcie.

**Repro:**
1. Tab A: shell.html, dashboard widoczny.
2. Tab B: quiz.html, ukończ quiz (wynik zapisuje się w localStorage).
3. Tab A: kliknij "Dashboard" → wyświetla `_state` z pamięci, BEZ nowej sesji. Trzeba F5.

**Sugestia fix:**
```js
window.addEventListener('storage', (e) => {
  if (e.key !== STATE_KEY || !e.newValue) return;
  const parsed = JSON.parse(e.newValue);
  if ((parsed.seq||0) > (_state.seq||0)) {
    _state = deepMerge(defaultState(), parsed);
    rebuildSnapshot(); notify(); handleRoute();
  }
});
```

**Effort:** S (~30 min)
**Risk:** Niskie

---

### Issue #6 — P1 — security XSS — `safeImageUrl` whitelista nie waliduje `imageAlt` i akceptuje SVG data URI

**Test:** tests/images.test.md (TEST-IMG)
**Lokalizacja:** quiz.html linia 873-887.

**Obserwacja:** Linia 884 escape tylko `"` zamiast `escapeHtml(alt)`. Co więcej, whitelist akceptuje `data:image/svg+xml;base64,...` — SVG może zawierać `<script>` i jest active content.

**Repro:**
```js
q.imageUrl = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(document.domain)</script></svg>');
```
Po render — alert wykonany.

**Sugestia fix:**
```js
if (url.match(/^data:image\/(png|jpe?g|gif|webp);base64,/)) return url;  // usuwam svg+xml
```
Plus użyj istniejącej `escapeHtml(alt)` zamiast manual replace.

**Effort:** XS
**Risk:** Średnie (wektor istnieje przy imporcie malicious JSON)
