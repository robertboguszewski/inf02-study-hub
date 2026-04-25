# INF.02 — Research Findings (Phase 1A)

Autor: Researcher (zespół v2). Data: 2026-04-25. Kontekst: Phase 1 live artifactu do nauki INF.02. Wszystkie tezy poparte URL-em z webresearchu; tam, gdzie nie udało się ustalić — oznaczone "nie ustalono".

---

## 1. Rynek — kursy, aplikacje, struktura egzaminu (5–7 pozycji)

### Struktura egzaminu INF.02 (Formuła 2019, sesja 2026)
- Część pisemna: **40 pytań zamkniętych, 60 minut, 4 odpowiedzi (jedna poprawna)**, przeprowadzana komputerowo. CKE nie publikuje arkuszy pisemnych — bazy są rekonstruowane przez portale typu praktycznyegzamin.pl. Źródło: <https://egzamin-informatyk.pl/testy-inf02-ee08-sprzet-systemy-sieci/>, <https://www.korepetycjezinformatyki.pl/inf-02-jak-wyglada-egzamin/>.
- Część praktyczna: **150 minut, 1 zadanie przy komputerze**. Sesja ZIMA 2026 ma listę "zadań jawnych" wskazanych przez CKE. Źródło: <https://cke.gov.pl/egzamin-zawodowy/egzamin-zawodowy-formula-2019/jawne-zadania-egzaminacyjne-czesc-praktyczna/zadania-egzaminacyjne-jawne-wskazane-na-sesje-2026-zima/>.
- 2025/2026 — zmiany: harmonogram i komunikaty z 20.08.2025 r., bez zmiany formuły (nadal Formuła 2019). Doprecyzowano systemy operacyjne na stanowiskach EE.08/INF.02. Źródło: <https://cke.gov.pl/images/_KOMUNIKATY/3.2026_PP2019_EZ.pdf>, <https://oke.wroc.pl/wp-content/uploads/2025/12/6.2026_PP2019_Informacja-_o_EZ.pdf>.
- Rozkład pytań na obszary: **CKE nie publikuje oficjalnego klucza obszarowego**. Z analizy baz publicznych (egzamin-informatyk.pl, kursinf.pl) wynika praktyczny rozkład ~10–12 pyt. sprzęt, ~8–10 systemy operacyjne, ~10–12 sieci, ~6–8 urządzenia peryferyjne, ~2–4 BHP/bezpieczeństwo. Dokładny rozkład: **nie ustalono oficjalnie**. Źródło: <https://www.testy.egzaminzawodowy.info/kwalifikacja-inf2>.

### Konkurencja (kursy płatne i bezpłatne)
1. **kursinf.pl** — wideolekcje, testy etapowe, dostęp 12 mies., kurs INF.02/03/04, marka rozpoznawalna. <https://www.kursinf.pl/kurs/technik-informatyk-inf02-administracja-systemami-i-sieciami-komputerowymi>
2. **ambitni.edu.pl** — kurs grupowy online, wirtualne maszyny, opieka nauczyciela. <https://www.ambitni.edu.pl/kursy/inf-02/>
3. **korepetycjezinformatyki.pl (Maurycy Gast)** — intensywny kurs ~4 mies., mocny SEO. <https://www.korepetycjezinformatyki.pl/inf-02/>
4. **ezdamin.pl** — pełny kurs „setki zagadnień". <https://ezdamin.pl/kurs/egzamin-inf02-pelny-kurs>
5. **kursinformatyk.pl** — KKZ z terminem 04.2026–11.2026. <https://kursinformatyk.pl/>
6. **praktycznyegzamin.pl** — bezpłatna baza pytań z trybem praktyki, najmocniejsza pozycja w SEO. <https://www.praktycznyegzamin.pl/>
7. **zawodowe.edu.pl** — baza 3767 pytań INF.02, free. <https://zawodowe.edu.pl/technik-informatyk/INF.02/>
8. **egzamin-informatyk.pl** — testy 40-pyt. + arkusze praktyczne, free. <https://egzamin-informatyk.pl/>

### Aplikacje mobilne
Brak dedykowanej, popularnej natywnej aplikacji INF.02 w Google Play/App Store z prawdziwym **adaptive learning**. Większość rozwiązań to **mobile-friendly web** (egzamin-informatyk, kursinf, zawodowe.edu.pl) bez SRS/algorytmu. To luka rynkowa — patrz sekcja 4. **Nie ustalono** istnienia natywnej apki z mechanizmem spaced repetition. Źródło (negative): <https://www.praktycznyegzamin.pl/>, <https://egzamin-informatyk.pl/>.

---

## 2. Weryfikacja błędów merytorycznych w v1

### id:33 — NTFS, max rozmiar pojedynczego pliku
- **Pytanie v1**: opcje 4 GB / 32 GB / 16 TB / 16 EB teoretycznie; oznaczona poprawna: 16 EB.
- **Werdykt: POPRAWNE jako "teoretyczne"**, ale dystraktor 16 TB jest mylący — to historyczny limit *woluminu* przy klastrze 4 KB, nie pliku.
- Microsoft Learn: teoretyczny limit pliku NTFS = **16 EB minus 1 KB (2^64)**. Praktycznie zaimplementowane od Windows 10 v1709 / Server 2019: **8 PB minus 2 MB**. Źródło: <https://learn.microsoft.com/en-us/windows-server/storage/file-server/ntfs-overview>.
- **Rekomendacja**: zachować odpowiedź 16 EB; doprecyzować w wyjaśnieniu, że praktyczny limit Windows ≥10 v1709 to 8 PB, dystraktor "16 TB" zostawić (to klasyczna pułapka — limit *woluminu* przy 4 KB klastrze, a nie pliku). Ref: <https://en.wikipedia.org/wiki/NTFS>.

### id:23 — adresowanie 64-bit
- **Pytanie v1**: "Procesor 64-bitowy może adresować teoretycznie:"; poprawna 16 EB.
- **Werdykt: POPRAWNE**. 2^64 B = 16 EiB = ~16 EB teoretycznie. Praktycznie x86-64 ogranicza się do 48-bit lub 52-bit linii adresowych (256 TB / 4 PB). Wyjaśnienie v1 ("256 TB w x86-64") jest ok, ale można rozszerzyć: AMD64/Intel 64 historycznie 48-bit = 256 TB, nowsze 5-level paging = 57-bit = 128 PB. Źródło ogólne: <https://en.wikipedia.org/wiki/X86-64>.
- **Rekomendacja**: bez zmiany odpowiedzi; uściślić wyjaśnienie.

### id:67 — adres 192.168.5.165 / maska /26
- **Pytanie v1**: poprawna 192.168.5.128/26.
- **Werdykt: POPRAWNE**. /26 = bloki po 64 adresy → 0–63, 64–127, **128–191**, 192–255. 165 ∈ [128,191]. Hostów użytkowych w bloku: 62 (64 − 2). Źródło: <https://www.freecodecamp.org/news/subnet-cheat-sheet-24-subnet-mask-30-26-27-29-and-other-ip-address-cidr-network-references/>, <https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting>.
- **Rekomendacja**: bez zmian.

### id:10 — RAID 1
- **Pytanie v1**: poprawna "Lustrzanym kopiowaniu danych".
- **Werdykt: POPRAWNE merytorycznie**. RAID 1 = mirroring, min. 2 dyski, 50% capacity overhead, fault tolerance przy awarii 1 dysku. Źródło: <https://en.wikipedia.org/wiki/Standard_RAID_levels>, <https://www.techtarget.com/searchstorage/definition/disk-mirroring>.
- **Literówka w wyjaśnieniu**: "paritybity" → "parity bity" lub "bity parzystości" (brak spacji).
- Dystraktor "Łączeniu dysków w jeden duży" jest niedookreślony (to zarówno JBOD/spanning jak i RAID 0 częściowo) — można doprecyzować np. "Łączeniu dysków w jeden duży wolumin (JBOD)".
- **Rekomendacja**: poprawić literówkę i dystraktor 1.

---

## 3. Top 30 pułapek CKE INF.02 (najczęstsze błędy uczniów)

Lista oparta o analizę publicznych baz pytań (zawodowe.edu.pl, egzamin-informatyk.pl, praktycznyegzamin.pl, kursinf.pl) i typowe pomyłki opisywane na Forum Pasja Informatyki. Format: temat — obszar.

1. NTFS: limit pliku vs limit woluminu (16 EB vs 256 TB) — **systemy plików**.
2. FAT32: limit pojedynczego pliku 4 GB (mylone z całym woluminem 8 TB) — **systemy plików**.
3. Adresowanie /26, /27, /28 — liczba hostów = 2^n − 2 (mylone z 2^n) — **sieci**.
4. Klasy adresów IP (A/B/C) vs CIDR — uczniowie mylą maski domyślne — **sieci**.
5. Adresy prywatne RFC1918 (10/8, 172.16/12, 192.168/16) — zakres 172.16–172.31 — **sieci**.
6. APIPA (169.254.0.0/16) — kiedy się pojawia (brak DHCP) — **sieci**.
7. Porty: 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 3389 RDP — **sieci**.
8. RAID 0 vs 1 vs 5 vs 10 — minimalna liczba dysków i tolerancja awarii — **sprzęt**.
9. RAID 5 — pojemność = (n−1)·najmniejszy dysk — **sprzęt**.
10. Topologie sieciowe: gwiazda vs magistrala vs pierścień — pojedynczy punkt awarii — **sieci**.
11. Kable UTP kategorie: Cat5e (1 Gb/100 m), Cat6 (10 Gb/55 m), Cat6a (10 Gb/100 m) — **sieci**.
12. T568A vs T568B — zastosowanie w kablu prostym vs krosowanym — **sieci**.
13. PoE/PoE+ — moc 15.4 W vs 30 W, standardy 802.3af/at — **sieci**.
14. DDR3 vs DDR4 vs DDR5 — napięcia (1.5 / 1.2 / 1.1 V), nacięcia, niekompatybilność — **sprzęt**.
15. Pamięć ECC — gdzie stosowana (serwery), różnica vs non-ECC — **sprzęt**.
16. Procesor: TDP, IPC, cache L1/L2/L3, hyperthreading vs cores — **sprzęt**.
17. Złącza: PCIe x1/x4/x8/x16 — przepustowość per generacja — **sprzęt**.
18. Zasilacze: 80 PLUS Bronze/Silver/Gold/Platinum/Titanium — sprawność — **sprzęt**.
19. SSD SATA vs NVMe — szybkości (~550 MB/s vs ~3500–7000 MB/s) — **sprzęt**.
20. UEFI vs BIOS, Secure Boot, GPT vs MBR (limit 2 TB / 4 partycje primary) — **systemy operacyjne**.
21. Polecenia Windows: ipconfig, ping, tracert, netstat, nslookup, route — **systemy**.
22. Polecenia Linux: ifconfig/ip, traceroute, ss, dig, route, iptables — **systemy**.
23. Uprawnienia NTFS vs udziałów — efektywne = bardziej restrykcyjne — **systemy**.
24. chmod ósemkowy: 755, 644, 777 — bity rwx dla u/g/o — **systemy**.
25. Active Directory: domena, las, OU, GPO — różnice — **systemy**.
26. Zapora ogniowa: filtr pakietów vs stateful vs aplikacyjna — **bezpieczeństwo**.
27. WPA2 vs WPA3, AES/CCMP vs TKIP — który zalecany — **sieci/bezpieczeństwo**.
28. Drukarki: laserowa (toner+fuser) vs atramentowa (zasychanie dysz) vs igłowa (kalka) — **peryferia**.
29. Skanery CCD vs CIS — głębia ostrości, gabaryty — **peryferia**.
30. BHP: napięcie bezpieczne (≤50 V AC / ≤120 V DC), uziemienie, ESD, opaska antystatyczna — **BHP/bezpieczeństwo**.

Źródła: <https://zawodowe.edu.pl/technik-informatyk/INF.02/>, <https://egzamin-informatyk.pl/testy-inf02-ee08-sprzet-systemy-sieci/>, <https://www.kursinf.pl/pytania/inf02>, <https://forum.pasja-informatyki.pl/418506/egzamin-inf-02>.

---

## 4. Unique Value Proposition — przewaga nad konkurencją

### Co konkurencja robi LEPIEJ niż my
- **praktycznyegzamin.pl / egzamin-informatyk.pl**: gigantyczne bazy pytań (3000+) z autentycznymi arkuszami CKE — nasza v1 ma kilkadziesiąt.
- **kursinf.pl / ambitni.edu.pl**: wideolekcje + nauczyciel-mentor, czego my nie mamy.
- **kursinformatyk.pl**: wirtualne maszyny do ćwiczeń praktycznych (część praktyczna 150 min).

### Czego NIE MA żaden lider rynkowy (luka rynkowa)
- **Adaptive learning oparty o spaced repetition (SM-2/Half-Life Regression à la Duolingo)** — żaden polski portal INF.02 nie wykrywa indywidualnych słabych obszarów i nie planuje powtórek. Źródło wzorca: <https://research.duolingo.com/papers/settles.acl16.pdf>, <https://blog.duolingo.com/spaced-repetition-for-learning/>.
- **Gamifikacja z prawdziwym retention loop** — streaki, XP, ligi, daily goals są standardem Duolingo, nieobecne w polskich portalach INF. Źródło: <https://blog.duolingo.com/how-we-learn-how-you-learn/>.
- **Symulator części praktycznej z auto-feedbackiem** — istnieją tylko statyczne arkusze PDF.
- **Tracking obszarowy z wizualizacją "luk wiedzy"** (heatmapa: NTFS=70%, RAID=30%, podsieci=45%) — brak na rynku.
- **Mobilna PWA offline** — nie ustalono żadnej dedykowanej apki INF.02 z trybem offline.

### 3 konkretne fichy do wdrożenia jako przewaga (priorytet)

1. **Adaptive Spaced-Repetition Engine (SRS)** — algorytm SM-2 lub Half-Life Regression. Każde pytanie ma `easiness factor` i `nextReview`; pytania błędne wracają częściej, opanowane oddalają się eksponencjalnie. Wizualizacja kalendarza powtórek ("dziś masz 24 fiszki do powtórki"). Inspiracja: Anki + Duolingo. Domena: agent C (adaptive engine).

2. **Heatmapa obszarowa + AI-rekomendacja "co się uczyć teraz"** — 5 sekcji (sprzęt, systemy, sieci, peryferia, BHP), każda z procentem opanowania, slabym tematem podświetlonym czerwono i konkretnym CTA „Powtórz: podsieci /26 (15 pytań, 12 min)". To rzecz, której brakuje wszystkim konkurentom (oferują tylko liniowe testy 40 pytań).

3. **Symulator Egzaminacyjny Czasu Rzeczywistego z analizą błędów po teście** — tryb 40 pytań/60 min identyczny z CKE, ale po zakończeniu generuje raport: czas per pytanie, obszary najsłabsze, automatycznie tworzy plan powtórek na 7 dni. Plus tryb "Pułapki dnia" — 5 wybranych z Top 30 z sekcji 3 codziennie (loop retention).

---

**Podsumowanie**: rynek jest nasycony bazami pytań i kursami wideo, ale **żaden lider nie oferuje adaptive engine + gamifikacji + heatmapy obszarowej**. To nasza przewaga. Część merytoryczna v1 jest zasadniczo poprawna (id:23, 67, 10 OK; id:33 wymaga doprecyzowania). Należy poprawić literówkę w id:10 i dystraktor "Łączeniu dysków w jeden duży".
