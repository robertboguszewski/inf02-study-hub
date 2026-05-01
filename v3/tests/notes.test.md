# tests/notes.test.md — Custom user notes per question

## Cel
Użytkownik może dodać prywatną notatkę do każdego pytania (np. "ważne na egzaminie", "zapamiętaj wzór X"). Notatki są w `state.notes[qid] = string`. Renderowane w search + quiz po odpowiedzi.

## Schema additions
- `AppState.notes?: { [qid: string]: string }` (optional, backward-compat)
- Limit 500 znaków per notatka
- Schema-validated jako `Record<QuestionId, string>` w validateAppState

## Test scenariusze

### TEST-NOTES-01 (P0): saveNote() persistuje state
**Given:** state.notes = {}
**When:** `INF02.notes.save('Q-0001', 'mój komentarz')`
**Then:** `getState().notes['Q-0001'] === 'mój komentarz'`
**Verification:** localStorage zawiera value, getState zwraca

### TEST-NOTES-02 (P0): saveNote() z pustym tekstem usuwa wpis
**Given:** state.notes = {'Q-0001': 'foo'}
**When:** `save('Q-0001', '')`
**Then:** `state.notes['Q-0001']` undefined
**Verification:** key removed

### TEST-NOTES-03 (P0): trimmuje spacje + limit 500 znaków
**Given:** input z 600 znakami
**When:** save
**Then:** zapisana 500 (plus warning toast?)
**Verification:** `state.notes[qid].length <= 500`

### TEST-NOTES-04 (P0): textarea w search browser
**Given:** card Q-0001 ma istniejącą notatkę
**When:** klik "✏ Notatka" toggle
**Then:** rozwija się textarea z value notatki
**Verification:** DOM `<textarea>` istnieje

### TEST-NOTES-05 (P1): debounced save (300ms)
**Given:** user wpisuje 5 znaków szybko
**When:** wpisanie kończy się
**Then:** save wywołany raz po 300ms (nie 5 razy)
**Verification:** mock save count === 1 w teście jednostkowym

### TEST-NOTES-06 (P1): notatka widoczna w quiz po odpowiedzi
**Given:** Q-0001 ma notatkę "ważne!"
**When:** odpowiadam w quiz, pojawia się explanation
**Then:** sekcja "Twoja notatka:" ma tekst notatki
**Verification:** `.user-note` ma textContent === "ważne!"

### TEST-NOTES-07 (P2): import/export JSON zachowuje notes
**Given:** state.notes = {Q-0001: 'foo'}
**When:** export → import
**Then:** notes nadal === {Q-0001: 'foo'}
**Verification:** roundtrip equality

### TEST-NOTES-08 (P2): XSS sanitization
**Given:** `save('Q-0001', '<script>alert(1)</script>')`
**When:** render w UI
**Then:** wyświetlany jako tekst, NIE wykonany
**Verification:** innerHTML zawiera `&lt;script&gt;`, nie `<script>`
