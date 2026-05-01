# tests/search.test.md — Search/browser view (#search)

## Cel
Search browser pozwala uczniowi: filtrować pytania po tekście / obszarze / frequency / hard collection. Sortowanie + scroll do 50 wyników. Najczęściej używana funkcja po quiz.

## Owner
shell.html `renderSearch()` (~line 1597)

## Test scenariusze

### TEST-SEARCH-01 (P0): renderSearch z pustym query → all questions
**Given:** state.hardCollection=[], pool 297 pytań
**When:** `renderSearch(root)` z params={}
**Then:** wszystkie 297 (max 50 visible) wyświetlone
**Verification:** root.querySelectorAll('li').length <= 50, "Znaleziono: 297"

### TEST-SEARCH-02 (P0): query filter (case-insensitive)
**Given:** params.q="DHCP"
**When:** filter
**Then:** tylko pytania zawierające "DHCP" w q/explanation/tags (case-insensitive)
**Verification:** każdy result.q.toLowerCase().includes("dhcp") OR similar

### TEST-SEARCH-03 (P0): area filter
**Given:** params.area="N"
**When:** filter
**Then:** tylko pytania z area=='N' (51 pytań w naszej bazie)
**Verification:** all results have area === 'N'

### TEST-SEARCH-04 (P0): frequency filter
**Given:** params.freq="high"
**When:** filter
**Then:** tylko pytania z frequency='high' (146 pytań)
**Verification:** all results have frequency === 'high'

### TEST-SEARCH-05 (P0): hard filter (only marked)
**Given:** state.hardCollection=['Q-0001','Q-0050'], params.hard='1'
**When:** filter
**Then:** tylko Q-0001 i Q-0050
**Verification:** results.length === 2, ids match

### TEST-SEARCH-06 (P0): combined filters (AND logic)
**Given:** params.q="DHCP", area="W", freq="high"
**When:** filter
**Then:** tylko pytania spełniające wszystkie 3
**Verification:** every result matches all filters

### TEST-SEARCH-07 (P1): hard collection toggle persists
**Given:** klik "★ Oznacz" na Q-0001
**When:** klik
**Then:** state.hardCollection += 'Q-0001', re-render z toggle
**Verification:** getState().hardCollection.includes('Q-0001')

### TEST-SEARCH-08 (P1): debounced text search (300ms)
**Given:** user wpisuje "DH" → "DHC" → "DHCP" w 100ms each
**When:** typing
**Then:** navigate() called raz po 300ms idle (nie 3 razy)
**Verification:** mock navigate count === 1

### TEST-SEARCH-09 (P2): "max 50 wyników" message
**Given:** 297 results
**When:** render
**Then:** "Pokazano 50 z 297 — uściślij filtry"
**Verification:** DOM contains text
