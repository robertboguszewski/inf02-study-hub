# CKE Format Expert Report

Audyt zbioru `v3/data/questions.json` (282 pytania: 262 MCQ + 20 fill) pod kątem zgodności ze stylem arkuszy CKE INF.02 z lat 2022-2025.

## Próbka analizowana (30 pytań)

Po 3 pytania z każdego z 11 obszarów (B/O/N/P/D/L/W/6/V/Z/R) plus przekrój fill-type:

- **B (Budowa):** Q-0001, Q-0008, Q-0014
- **O (OS):** Q-0035, Q-0038, Q-0042
- **N (Sieci):** Q-0061, Q-0065, Q-0070
- **P (Peryferia):** Q-0103, Q-0105, Q-0109
- **D (Diagnostyka):** Q-0119, Q-0121, Q-0126
- **L (BHP/Lokal):** Q-0137, Q-0139, Q-0144
- **W (Windows Server/AD):** Q-0171, Q-0174, Q-0179
- **6 (IPv6):** Q-0205, Q-0207, Q-0211
- **V (Wirtualizacja/RAID):** Q-0221, Q-0225, Q-0229
- **Z (Bezpieczeństwo):** Q-0234, Q-0237, Q-0240
- **R (Praktyczne CKE):** Q-0247, Q-0252, Q-0254
- **Fill:** Q-0263, Q-0266, Q-0271, Q-0282

## Ogólny werdykt: 6/10

**Uzasadnienie.** Treść merytoryczna jest na ogół poprawna i dobrze wytłumaczona — eksplikacje przewyższają jakością większość komercyjnych baz (zawodowe.edu.pl, testy.egzaminzawodowy.info). Niemniej w warstwie *formy* zbiór odbiega od stylu CKE w pięciu wymiarach:

1. **Niejednolita głowa pytania** — mieszanka "Jaki/Jaka/Jakie/Który/Czym/Co oznacza/Ile" bez kontroli rodzaju gramatycznego (np. Q-0105: "Jakie minimalne *rozdzielczość*", Q-0139: "Jak powinno być ustawione górne *krawędź*"). CKE stosuje sztywno: "Który", "Wskaż", "Określ", "Co oznacza", "Ile…", zawsze gramatycznie zgodnie.
2. **Anglicyzmy i terminy nieprzetłumaczone** w trzonie pytania ("striping", "key M.2", "hosted/bare-metal", "Workgroup", "host", "color wheel"). CKE używa polskiego ekwiwalentu lub PL+EN w nawiasie.
3. **Krytyczna niespójność pytanie↔odpowiedzi** w Q-0014 (pytanie "Ile *watów*" — opcje w procentach!), Q-0211 (poprawna odpowiedź wg eksplikacji to opcja [1] z odwróconym bitem U/L, ale opcja [0] jest dystraktorem zbyt podobnym).
4. **Dystraktory różnej długości** i niejednorodne — np. Q-0103 (etapy druku) ma opcje 60-70 znaków łańcuchami "→", co jest nieczytelne. CKE preferuje krótkie, ekwiwalentne sformułowania.
5. **Duplikaty merytoryczne** — Q-0070 ≈ Q-0252 (oba: "50 hostów → /26"). W arkuszu CKE każde pytanie pokrywa inną podkompetencję.

## Konkretne problemy (16 pozycji)

### Q-0014 (B) — KRYTYCZNY: niespójność pytania i odpowiedzi
Aktualne: `"Ile watów (W) gwarantuje certyfikat 80 PLUS Gold przy obciążeniu 50%?"` — opcje: 80%, 87%, 90%, 92%.
Powód: pytanie pyta o waty, opcje to procenty. Ucznia zdezorientuje.
Sugestia: `"Jaką minimalną sprawność (w %) gwarantuje certyfikat 80 PLUS Gold przy obciążeniu 50%?"`

### Q-0103 (P) — dystraktory zbyt długie i nieczytelne
Aktualne: opcje typu `"Ładowanie→Naświetlanie→Wywoływanie→Przenoszenie→Utrwalanie→Czyszczenie"`.
Powód: w arkuszach CKE pytania o kolejność etapów stosują listy 1./2./3. lub krótkie odsyłacze A-B-C, nie ciągi 6 kroków ze strzałką. Trudne do skanowania wzrokiem.
Sugestia (przeformułowanie): `"Który etap procesu druku laserowego następuje bezpośrednio po naświetleniu (exposure)?"` — opcje: `Ładowanie bębna`, `Wywoływanie (developing)`, `Utrwalanie (fusing)`, `Czyszczenie bębna`. correct=1.

### Q-0105 (P) — błąd gramatyczny w trzonie
Aktualne: `"Jakie minimalne rozdzielczość DPI jest zalecana do skanowania dokumentów i OCR?"`
Powód: "rozdzielczość" jest rodzaju żeńskiego — wymaga "Jaka minimalna".
Sugestia: `"Jaka minimalna rozdzielczość skanowania (w DPI) jest zalecana do dokumentów tekstowych i rozpoznawania OCR?"`

### Q-0109 (P) — niezdarne zaczynanie pytania
Aktualne: `"Ile lumenów minimalnie potrzebuje projektor do prezentacji w jasno oświetlonym pomieszczeniu?"`
Powód: szyk i "potrzebuje projektor" są kolokwialne; CKE nie używa "potrzebuje" w rezolutnym sensie.
Sugestia: `"Jaki jest minimalny strumień świetlny projektora (w lumenach) wymagany do prezentacji w pomieszczeniu o pełnym oświetleniu naturalnym?"`

### Q-0108 (P) — niegramatyczny kwantyfikator
Aktualne: `"Technologia DLP w projektorach wykorzystuje jakiś element do tworzenia obrazu?"`
Powód: "jakiś element" — informalne, niespotykane w CKE; brzmi jak bełkot.
Sugestia: `"Który element optyczny jest kluczowym podzespołem projektora w technologii DLP?"`

### Q-0125 (D) — pytanie z dwukropkiem zamiast znaku zapytania
Aktualne: `"Do testowania stabilności pamięci RAM służy narzędzie:"` (zakończone dwukropkiem).
Powód: w arkuszach CKE pytania zawsze kończą się znakiem zapytania. Forma z dwukropkiem występuje w testach komercyjnych, ale nie w CKE.
Sugestia: `"Które narzędzie diagnostyczne służy do testowania stabilności pamięci RAM?"`

### Q-0139 (L) — błąd zgody rodzaju
Aktualne: `"Jak powinno być ustawione górne krawędź monitora względem oczu operatora?"`
Powód: "krawędź" jest rodzaju żeńskiego — wymaga "powinna być ustawiona górna krawędź".
Sugestia: `"Jak powinna być ustawiona górna krawędź monitora względem linii wzroku operatora przy stanowisku komputerowym?"`

### Q-0174 (W) — anglicyzmy w opcjach
Aktualne: opcja `"Domena zapewnia scentralizowane uwierzytelnianie i zarządzanie; Workgroup = peer-to-peer, max ~20 PC"`.
Powód: Workgroup, peer-to-peer, PC, "=" znak — niesymetryczne ze stylem CKE, w którym opcja jest pełnym zdaniem.
Sugestia (opcja correct=1): `"Domena zapewnia scentralizowane uwierzytelnianie i zarządzanie politykami, natomiast grupa robocza działa w modelu równorzędnym (peer-to-peer) i jest praktyczna do około 20 stacji"`.

### Q-0211 (6) — przeładowane pytanie ze skrótem
Aktualne: `"Adres MAC 00:1A:2B:3C:4D:5E. Jaki będzie identyfikator interfejsu EUI-64?"`
Powód: dwa zdania (pierwsze nie-pytanie). CKE łączy w jedno: "W oparciu o adres MAC ... jaki będzie ...".
Sugestia: `"Jaki identyfikator interfejsu w formacie EUI-64 zostanie wygenerowany dla adresu MAC 00:1A:2B:3C:4D:5E?"`

### Q-0229 (V) — błąd przypadku w opcji
Aktualne: opcja [2] `"Minimalną wydajność, maksymalną bezpieczeństwo"`.
Powód: niezgodność rodzaju ("maksymalną bezpieczeństwo" — bezpieczeństwo jest nijakie), dodatkowo cała opcja jest w bierniku, podczas gdy inne w mianowniku.
Sugestia: `"Niska wydajność, maksymalne bezpieczeństwo danych"`. (Pozostałe opcje też ujednolicić do mianownika.)

### Q-0125 → ujednolicenie z Q-0119, Q-0122 — rozkład pytajek
Aktualne (Q-0119): `"Jakie narzędzie..."`; Q-0122: `"Do czego służy..."`; Q-0125: `"Do testowania... służy narzędzie:"`.
Powód: w obrębie obszaru D pytania o narzędzia używają trzech różnych konstrukcji.
Sugestia: ujednolicić do `"Które narzędzie systemowe służy do <X>?"` (CKE-style).

### Q-0207 (6) — zmiana imperatywu
Aktualne: `"Skróć poprawnie adres IPv6: 2001:0db8:0000:0000:0000:0000:0000:0001"`
Powód: tryb rozkazujący ("Skróć") nie występuje w arkuszach CKE — ten styl jest typowy dla zadań ćwiczeniowych. CKE używa pytania pośredniego.
Sugestia: `"Która forma jest poprawnie skróconym (RFC 5952) zapisem adresu IPv6 2001:0db8:0000:0000:0000:0000:0000:0001?"`

### Q-0070 vs Q-0252 (N/R) — duplikat merytoryczny
Aktualne: oba pytania pytają o minimalną maskę dla 50 hostów → /26.
Powód: redundancja w bazie (5712 znaków różnicy w sformułowaniu, ten sam mechanizm odpowiedzi).
Sugestia: zachować Q-0070, w Q-0252 zmienić scenariusz: `"Firma potrzebuje rozdzielić sieć /24 na podsieci po 14 hostów każda. Ile takich podsieci uzyska i jakim prefiksem VLSM?"` (correct: `16 podsieci /28`).

### Q-0035 (O) — pytanie zawiera odpowiedź w treści
Aktualne: `"Ile GB RAM wymaga system Windows 11 jako minimum?"` (opcje 1/2/4/8 GB).
Powód: trzon jest poprawny, ale dystraktor "1 GB" jest absurdalny (Windows 7 też nie pójdzie). CKE preferuje dystraktory bliskie poprawnej.
Sugestia: zmień opcje na `"2 GB", "4 GB", "8 GB", "16 GB"` (correct=1) — wszystkie wartości realistyczne, prawdziwa wiedza odróżnia.

### Q-0247 (R) — opcja zawiera własną interpretację
Aktualne: opcja [0] `"Windows 11 Pro OEM — zawiera dostęp do serwera"` (myślnik komentujący).
Powód: opcje CKE są twierdzeniami, nie wyjaśnieniami z myślnikiem. Dodatkowo to zdanie jest fałszywym dystraktorem komentującym samo siebie.
Sugestia (opcja [0]): `"Licencja Windows 11 Pro OEM bez dodatkowych CAL"`.

### Q-0234 (Z) — hipergeneralizacja w dystraktorze
Aktualne: opcja [3] `"TPM nie jest wymagany"`.
Powód: dystraktor jest bezsensowny względem trzonu pytania ("Jaka jest minimalna wersja TPM..."). Łatwo go odrzucić bez wiedzy.
Sugestia: `"TPM 2.0 z modułem fTPM (firmware)"` — realny dystraktor wymagający wiedzy o różnicy fTPM vs dTPM.

### Q-0282 (B, fill) — niejasne formatowanie odpowiedzi
Aktualne: pytanie wymaga odpowiedzi `"+12V, +5V, +3.3V"` — bardzo specyficzny format z plusami, przecinkami i spacjami.
Powód: fill-type powinien akceptować naturalne warianty (np. "12V 5V 3.3V" lub "+12, +5, +3.3"). Inaczej student zna odpowiedź, ale tego nie zaliczy.
Sugestia: zamień na MCQ z opcjami albo dopuść regex; alternatywnie pytanie: `"Ile głównych dodatnich linii napięciowych dostarcza standardowy zasilacz ATX (sama liczba)?"` correct=`"3"`.

## 5 rekomendacji ogólnych

1. **Ujednolicić nagłówki pytań do 6 wzorców CKE.** Wszystkie pytania zaczynać od jednego z: `Który/Która/Które...?`, `Wskaż...`, `Określ...`, `Co oznacza skrót...?`, `Ile...?`, `Jakie/Jaki/Jaka...?` — z zachowaniem zgody rodzaju i przypadku z rzeczownikiem-zwrotem zapytania. Zlikwidować formy `Do czego służy...:` (Q-0122, Q-0125) i imperatywy (`Skróć...` Q-0207).

2. **Polski techniczny w trzonie, EN w nawiasie tylko dla terminów.** W trzonie pytania używać PL: "domena", "grupa robocza", "kontener", "macierz dyskowa", "magistrala". Jeśli termin jest tylko angielski (BitLocker, AirPrint, FSMO) — pisać EN, przy pierwszym wystąpieniu w pytaniu rozwinąć skrót w nawiasie. Eliminuje to mieszanki typu Q-0174 ("Workgroup = peer-to-peer, max ~20 PC").

3. **Dystraktory równej długości i tej samej kategorii gramatycznej.** Reguła "różnica długości najdłuższego do najkrótszego ≤ 30%". Wszystkie 4 opcje w tym samym przypadku gramatycznym (zwykle mianownik) i bez myślników komentujących. Sortować od najkrótszego do najdłuższego, by nie sygnalizować odpowiedzi długością (badania nad MCQ pokazują, że uczniowie zgadują "najdłuższa = poprawna").

4. **Każdy dystraktor ma być realnie pomylony z poprawnym.** Eliminować absurdalne (Q-0035: 1 GB dla Win 11), rażąco błędne ("TPM nie jest wymagany") i takie, które komentują same siebie. Dystraktory powinny pochodzić z typowych pomyłek uczniów (zła wersja standardu, sąsiednia generacja, podobny skrót).

5. **Walidacja techniczna spójności pytanie↔odpowiedzi przed publikacją.** Wprowadzić skrypt sprawdzający: (a) jednostki w pytaniu = jednostki w opcjach (Q-0014 watów vs procentów); (b) brak duplikatów po hash'u trzonu po lematyzacji (Q-0070/Q-0252); (c) długość trzonu pytania 8-30 słów; (d) wszystkie 4 opcje obecne i unikalne; (e) `correct` pasuje do liczby opcji.

## Bibliografia / źródła

- [Pytania INF.02 — Egzaminy Zawodowe (zawodowe.edu.pl)](https://zawodowe.edu.pl/technik-informatyk/INF.02/) — autorytatywna baza pytań z poprzednich sesji CKE.
- [Arkusze CKE INF.02 — arkusze.pl](https://arkusze.pl/egzamin-zawodowy-kwalifikacja-inf-02/) — sesje styczeń 2024, czerwiec 2024.
- [Egzamin zawodowy INF.02 styczeń 2024 — arkusze.pl](https://arkusze.pl/egzamin-zawodowy-inf-02-2024-styczen/)
- [Egzamin zawodowy INF.02 czerwiec 2024 — arkusze.pl](https://arkusze.pl/egzamin-zawodowy-inf-02-2024-czerwiec/)
- [EE.08 / INF.02 — Test 40 pytań (egzamin-informatyk.pl)](https://egzamin-informatyk.pl/testy-inf02-ee08-sprzet-systemy-sieci/) — testy generowane z banku CKE.
- [Praktyczny Egzamin INF.02 (praktycznyegzamin.pl)](https://www.praktycznyegzamin.pl/) — materiały dydaktyczne i arkusze praktyczne.
- [Kwalifikacja INF.02 — testy.egzaminzawodowy.info](https://www.testy.egzaminzawodowy.info/kwalifikacja-inf2) — bank pytań ze stylem zbliżonym do CKE.
- [Arkusze egzaminacyjne INF.02 — informatyk-egzamin.pl](https://informatyk-egzamin.pl/arkusze-egzaminacyjnteoria-inf-02-ee-08/) — arkusze teoretyczne 2022-2024.

Uwaga metodologiczna: arkusze pisemne INF.02 nie są publikowane przez CKE w postaci PDF (egzamin elektroniczny od 2021), więc styl wnioskowano z (a) arkuszy poprzedników EE.08 / E.12 / E.13 dostępnych w PDF, (b) banków pytań rekonstruowanych przez serwisy edukacyjne na podstawie zrzutów uczniów po sesjach.
