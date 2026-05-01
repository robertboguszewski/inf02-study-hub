# tests/images.test.md — Image support dla pytań CKE

## Cel
Część pytań CKE INF.02 zawiera schematy/diagramy. v3 nie wspiera obrazków. Dodajemy `Question.imageUrl?: string` (relative path lub data: URL) renderowany w UI.

## Schema additions
- `Question.imageUrl?: string` (optional, regex `^(\.\/|data:image\/|images\/)` for safety)
- `Question.imageAlt?: string` (alt text dla accessibility, wymagane jeśli imageUrl present)
- CSP `img-src 'self' data:` już istnieje (sprawdzenie)

## Test scenariusze

### TEST-IMG-01 (P0): pytanie bez imageUrl renderuje się normalnie
**Given:** Q-0001 brak imageUrl
**When:** quiz render
**Then:** brak `<img>` w DOM, treść jak dotychczas
**Verification:** `q-card.querySelector('img') === null`

### TEST-IMG-02 (P0): pytanie z imageUrl renderuje `<img>` z alt
**Given:** Q-9999 = `{ imageUrl: 'images/topology1.png', imageAlt: 'Topologia gwiazda' }`
**When:** quiz render
**Then:** DOM zawiera `<img src="images/topology1.png" alt="Topologia gwiazda" loading="lazy">`
**Verification:** querySelector match

### TEST-IMG-03 (P0): imageUrl scheme whitelist (XSS prevention)
**Given:** `imageUrl: 'javascript:alert(1)'` lub `'http://evil.com/x.png'`
**When:** render
**Then:** image NIE renderowany (silently skipped) + console warn
**Verification:** brak `<img>` + console.warn called

### TEST-IMG-04 (P0): data: URL akceptowany (dla embed)
**Given:** `imageUrl: 'data:image/png;base64,iVBORw0KGgo...'`
**When:** render
**Then:** `<img src="data:..."` w DOM
**Verification:** querySelector match

### TEST-IMG-05 (P1): brakujący alt = warning + pusty alt fallback
**Given:** `imageUrl` set, `imageAlt` nie set
**When:** render
**Then:** `<img alt="">` (decorative fallback) + console warn
**Verification:** alt attr exists, console.warn called

### TEST-IMG-06 (P1): max-width responsive
**Given:** image 2000×1500 px
**When:** render w mobile <500px
**Then:** scaled down do 100% width container
**Verification:** CSS `max-width: 100%; height: auto`

### TEST-IMG-07 (P1): lazy loading
**Given:** image render
**When:** check attributes
**Then:** `<img loading="lazy">`
**Verification:** attr `loading === 'lazy'`

### TEST-IMG-08 (P2): broken image fallback
**Given:** `imageUrl: 'images/missing.png'` (404)
**When:** render + image fails to load
**Then:** placeholder text/icon zamiast pustego miejsca
**Verification:** `<img onerror>` lub `.image-broken-placeholder` div
