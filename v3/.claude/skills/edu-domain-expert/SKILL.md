---
name: edu-domain-expert
description: Pedagogiczna ocena treści edukacyjnej (CKE, ECDL, Cisco, Microsoft). Sprawdza merytorykę, Pareto, aktualność, pedagogical quality, ton, pułapki domenowe, bank treści, disclaimers. Stosuj dla projektów edu z bankiem pytań / scenariuszy.
---

# Edu-Domain Expert Skill

## Kiedy używać

Projekt edukacyjny z bankiem treści (pytania, fiszki, scenariusze). Examples:
- Aplikacje do egzaminów państwowych (CKE INF.02/03/04, matura, próby)
- Certyfikacje (ECDL, Cisco CCNA, Microsoft MS-900, AWS CCP)
- E-learning korporacyjny (BHP, RODO, on-boarding)
- Tutoring math/science K-12

## Kryteria oceny (9 wymiarów)

### 1. Poprawność faktyczna
Każde fakt-twierdzenie cross-checkowane z **autorytatywnym źródłem**:
- Sieci: RFC (IETF), Cisco Learning Network
- Microsoft: Microsoft Learn (PL/EN), docs.microsoft.com
- Prawo PL: sejm.gov.pl, isap.sejm.gov.pl
- CKE: cke.gov.pl (arkusze archiwalne, zasady punktacji)

**Próg P0:** błąd faktyczny (np. /24 = 256 hostów zamiast 254) = blocker shipa.

### 2. Format CKE / ECDL / Cisco / Microsoft
- **CKE:** 4 odpowiedzi A-D, jeden poprawny, 60 min/40 pyt (~1.5 min/pyt). Próg 50% pisemny / 75% praktyczny.
- **ECDL:** mix MCQ + drag-drop + fill, 36 pyt × 35 min.
- **Cisco CCNA:** mix multiple-choice (single + multi-answer), drag-drop, simlets/labs.
- **Microsoft Fundamentals:** 40-60 pyt × 45 min, scenariusze case study.

Sprawdź: czy bank odzwierciedla format eksaminu? Dystraktory **wiarygodne** (nie "Atlantyda")?

### 3. Pareto 80/20
20% tematów daje 80% punktów. Audit:
- Frequency analysis z 5 ostatnich sesji egzaminacyjnych
- % pytań w banku vs % w realnym egzaminie
- Over-represented (waste) i under-represented (gap)

### 4. Aktualność (2025/2026)
- Win Server 2025 / Entra ID (nie "Azure AD")
- IPv6 first-class (nie "future")
- TLS 1.3, deprekacja TLS 1.0/1.1
- Brak Win XP/Server 2008 jako "current"

### 5. Pedagogical quality
**Active recall + spaced repetition friendly:**
- Każdy explanation NA dystraktor wyjaśnia DLACZEGO źle (nie tylko "bo poprawne jest A")
- Pytanie "what" + pytanie "why" — 2 levele Bloom
- Difficulty proporcjonalnie: ~30% easy / 50% medium / 20% hard

### 6. Ton
Adekwatny do audience:
- 17-19 lat (CKE) — profesjonalny ale nie żargonowy bez wyjaśnienia
- Korpo (RODO) — formalny, neutralny
- K-12 — przystępny, z analogiami

**Anti-pattern:** protekcjonalny ("łatwizna!") lub onieśmielający ("ekspert wie...").

### 7. Pułapki domenowe
Bank musi **testować** typowe błędy ucznia, nie tylko podstawy:
- Sieci: /31 (RFC 3021), 169.254 APIPA, broadcast w /30 vs /31
- RAID: 1+0 ≠ 0+1 pod failure
- BHP: napięcie dotykowe 50V AC / 120V DC
- Win Server: GPO precedence (LSDOU), AD trust types

### 8. Bank treści — pokrycie + disclaimer
- Mapping efekt programowy (np. MEN INF.02) → ID pytania
- Każdy efekt z curriculum ma min 3 pytania (sample, redundancy)
- Disclaimer widoczny: "Pytania w stylu CKE własnego autorstwa, nie kopia arkuszy oficjalnych"

### 9. Licencja + copyright
- CKE arkusze są **państwowe** (© Skarb Państwa) — kopia literalna = naruszenie
- Microsoft Learn content — fair use dla edu, ale cytuj
- Cisco Press — copyright, NIE kopiuj
- Custom content → MIT / CC BY-SA dla treści, MIT dla kodu

## Metoda oceny

### Krok 1: Sample 30 pytań losowych
Cross-check 3 źródłami autorytatywnymi (np. dla sieci: RFC + Cisco + Microsoft). Każde pytanie z błędem = P0/P1.

### Krok 2: Frequency analysis
Z 5 ostatnich sesji egzaminacyjnych — które obszary over/under represented? Porównaj z bankiem.

### Krok 3: Trap detection
Lista pułapek domenowych (8 typowych dla obszaru). Bank zawiera min 60% z nich? Jeśli nie — gap report.

### Krok 4: Tone audit
Przeczytaj 10 explanations losowych jak target audience. Zrozumiałe? Profesjonalne? Bez żargonu bez wyjaśnienia?

### Krok 5: Coverage matrix
Curriculum efekt → bank pytań ID. Excel-like tabela. Gaps = lista efektów <3 pytań.

## Output (raporty)

`reviews/expert-{topic}.md` — jeden raport per kryterium:
- `expert-cke-format.md` — format pytań, dystraktory, trudność
- `expert-pareto.md` — coverage vs realny egzamin
- `expert-translation.md` — terminologia PL (Microsoft PL, Cisco PL)
- `expert-pedagogy.md` — explanations, active recall

Format issue (identyczny z Code Reviewer):
- Test (jeśli istnieje)
- Lokalizacja (`questions.json` Q-NNNN)
- Obserwacja + cytat ze źródła
- Repro (przykład pytania)
- Sugestia fix (poprawione brzmienie)
- Effort / Risk

## Best practices dla edu

1. **Disclaimer "własnego autorstwa"** — każda aplikacja edu z bankiem pytań pokrewnych do egzaminów państwowych
2. **Mapping efekt → pyt** — `contracts/curriculum-mapping.json` jako source of truth
3. **3-tier difficulty per area** — easy/medium/hard, ratio 30/50/20
4. **Każdy explanation 2-3 zdania** — nie tylko "poprawna jest A"
5. **Spaced repetition friendly** — pytania quotable, fragments dla SR cards
6. **Tone consistency** — wszystkie explanations w 1 osobie ("zauważ że..."), nie mixuj formal/casual
7. **A/B/C/D randomization** — bank ma `correct: 0-3` int, NIE always A (uczeń uczy się anti-pattern)
8. **Polish CIDR notation** — "/24" nie "klasy C" (klasy A/B/C deprecated od RFC 1518)

## Anti-patterns

- **Kopiowanie literalne** arkuszy CKE / Cisco / Microsoft → naruszenie copyright
- **Dystraktor "Atlantyda"** — śmiesznie zły, nie testuje wiedzy
- **Explanation = "bo poprawne jest X"** — zero pedagogical value
- **Wszystkie correct = A** — anti-pattern, użytkownik zapamiętuje pozycję
- **Brak coverage matrix** — nie wiadomo które efekty pokryte
- **Outdated tech** (Win XP/Server 2008 jako "current") — uczeń uczy się nieaktualnej wiedzy
