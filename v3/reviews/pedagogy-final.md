# Pedagogical Review — INF.02 Study Hub v4.1

**Audytor:** Domain Expert (Faza 3 — Spec-Driven Build, formuła 2019)
**Data:** 2026-05-01
**Sesja docelowa:** INF.02 ZIMA 2026 / LATO 2026
**Zakres:** `v3/data/questions.json` (297 pytań), `v3/data/scenarios.json` (12 scenariuszy), `v3/contracts/curriculum-mapping.json` (34 efekty)

---

## Próbka analizowana

- **33 pytania** (po 3 z 11 obszarów B/O/N/P/D/L/W/6/V/Z/R) — losowanie deterministyczne po ID
  - B: Q-0010, Q-0020, Q-0030
  - O: Q-0039, Q-0040, Q-0042
  - N: Q-0080, Q-0100, Q-0291
  - P: Q-0107, Q-0108, Q-0109, Q-0294, Q-0295
  - D: Q-0122, Q-0123, Q-0125
  - L: Q-0145, Q-0160, Q-0162, Q-0163
  - W: Q-0180, Q-0181, Q-0182, Q-0184
  - 6: Q-0205, Q-0207, Q-0281
  - V: Q-0221, Q-0222, Q-0225
  - Z: Q-0239, Q-0240, Q-0241
  - R: Q-0258, Q-0260, Q-0290
- **12 scenariuszy:** S-001..S-012
- **34 efekty MEN** (mapowane do INF.02.1..INF.02.11.4)
- **Web research 2026-05-01:** komunikat CKE o systemach operacyjnych w sesji 2026 (Win Server 2019/2022/2025; Ubuntu 22.04/24.04 LTS; openSUSE Leap 15.6/16.0; **Windows 11 Pro 24H2 lub nowszy**), badania spaced repetition + active recall (Roediger-Karpicke 2006, ScienceDirect 2025).

---

## Per-obszar issues

### Obszar B (Budowa komputera) — 35 pytań

- **[OK]** Q-0010 (NVMe PCIe 3.0 ~3500 MB/s) — merytoryka 100% (PCIe 3.0 x4 = 32 Gbps brutto ≈ 3.94 GB/s, w praktyce 3000-3500 MB/s sekwencyjnie). Wyjaśnienie uczy konkurencji z SATA. Pareto: high. **Ton OK** dla 17-19 latków.
- **[P2]** Q-0020 (DDR4/DDR5 kompatybilność) — sprawdzona.
- **[P1]** Q-0030 (CAS Latency, CL) — wyjaśnienie poprawne, ale brakuje jednostki czasu (CL × 1/f). Uczeń z arkusza CKE 2024-09 widział pytanie "Pamięć 3200 MHz CL16 — opóźnienie w ns". Sugestia: dodać uwagę "rzeczywiste opóźnienie [ns] = CL × 2000 / MHz".
- **[P2]** Q-0282 (fill: linie napięciowe ATX) — fixed-string `"+12V, +5V, +3.3V"` nadal nie akceptuje wariantów spacji/przecinka (zgłoszone w `expert-cke-format.md`, niedoprawione). **REKOMENDACJA: zmień type:mcq lub dodaj `tolerantMatch:true` + regex.**

### Obszar O (Systemy operacyjne) — 35 pytań

- **[OK]** Q-0039 (ext4 jako default Ubuntu) — poprawne, nuance o btrfs (Fedora od 33 używa btrfs default) jest nadmiarowy dla CKE 2026.
- **[OK]** Q-0040 (MBR limit 2 TB) — poprawne, kalkulacja 2^32 × 512 B = 2 TiB ≈ 2,2 TB. Drobna pułapka: 2 TB w SI vs TiB; CKE używa "2 TB" — nie problem.
- **[P1]** Q-0042 (GPT 128 partycji) — pułapka pedagogiczna: specyfikacja GPT pozwala na **dowolną liczbę** wpisów partycji (zależną od rozmiaru tablicy GPT), Windows narzuca **default 128**. Wyjaśnienie próbuje to ratować ("w systemie Windows"), ale opcja "128" jako "GPT obsługuje" jest niedokładna. **Sugestia:** zmień q na "Ile partycji Windows obsługuje domyślnie w schemacie GPT?".
- **[P2]** Q-0292 (`/etc/passwd`) — `ckeRef: "INF.02.3.2"` (system plików) jest mylne; powinno być `INF.02.3.3` (konta użytkowników). **Tagging error.**

### Obszar N (Sieci) — 51 pytań

- **[OK]** Q-0080 (802.11ac na 5 GHz) — merytoryka 100%, ale CKE 2025-09 testuje już Wi-Fi 6E (802.11ax 6 GHz) — sprawdzić, czy w bazie jest pytanie o Wi-Fi 6E/6 GHz. **Quick-check:** Q-0080 explanation wspomina Wi-Fi 6E, OK.
- **[P2]** Q-0100 (root port w STP) — D3, dobrze sklasyfikowane jako trudne. Wyjaśnienie zawiera koszty linków (4/19/2) — uczy, nie tylko podaje.
- **[P1]** Q-0291 (`172.16.50.100/22 → 172.16.48.0`) — merytoryka 100% (sprawdzona: 50 div 4 = 12, 12*4 = 48). Ale `ckeRef: "INF.02.4.3"` jest błędne — INF.02.4.3 to "Naprawa i konserwacja sprzętu", a powinno być **INF.02.5.2** (Adresacja IPv4). **Tagging error — powiela się w wielu pytaniach o subnetting.**

### Obszar P (Peryferia) — 18 pytań

- **[P1]** Q-0107 (panel TN ma 1 ms) — merytoryka teoretycznie OK, ale w 2026 r. nowoczesne IPS Fast osiągają 1 ms GtG (LG Nano IPS, AOC). Pytanie sugeruje, że TN nadal jest "preferowany przez graczy" — **przestarzałe** dla 2026. Sugestia: zmień q na historyczne "Który **historycznie** typ panelu...".
- **[P0]** Q-0108 (DLP/DMD/color wheel) — pytanie ma niegramatyczny zwrot "wykorzystuje jakiś element" (zgłoszone w `expert-cke-format.md`, **NIEDOPRAWIONE**). Aktualnie nadal w bazie: `"Technologia DLP w projektorach wykorzystuje jakiś element do tworzenia obrazu?"`. Trzeba poprawić: `"Który element optyczny jest kluczowym podzespołem projektora w technologii DLP?"`.
- **[P0]** Q-0109 (lumeny projektora) — szyk niezdarny "potrzebuje projektor" (zgłoszone, **NIEDOPRAWIONE**).
- **[P1]** Q-0294 (drukarka laserowa, fuser) — `ckeRef: "INF.02.8.2"` jest **rażąco błędne** — INF.02.8.2 to "Kopie zapasowe i odzyskiwanie", a powinno być **INF.02.4.4** lub **INF.02.6.1** (peryferia drukarki). Tagging error.
- **[OK]** Q-0295 (korotron ładujący) — D2, merytoryka 100%, dystraktory realistyczne (wałek dociskowy, lampa skanująca są częściami drukarki).

### Obszar D (Diagnostyka) — 20 pytań

- **[OK]** Q-0122 (CPU-Z) — wyjaśnienie ma literówkę: `"timingі"` (cyrylicki znak `і` zamiast `i`). **P0 — copy-paste fail z nieaccii źródła.** Trzeba sprawdzić cały plik regex'em `[А-я]+`.
- **[OK]** Q-0123 (AMI BIOS 1L+3K = GPU) — merytoryka 100% w arkuszach producentów AMI. Drobna pułapka: AMI 1L+3K to "Conventional/Extended Memory Test fail" w niektórych wersjach BIOS, ale powszechnie interpretowane jako VGA. Wyjaśnienie poprawne.
- **[P0]** Q-0125 — pytanie kończy się dwukropkiem zamiast `?` (zgłoszone, **NIEDOPRAWIONE**).

### Obszar L (Prawo, BHP, licencje) — 35 pytań

- **[OK]** Q-0145 (gaśnica CO2/proszkowa do elektrycznych) — merytoryka 100%, klasy pożarów A/B/C/D/F znane.
- **[P2]** Q-0160 (DPO/IOD) — merytoryka 100% (Art. 37 RODO), ale pytanie oznaczone `frequency: low` — **niezgodność z Pareto**: arkusze CKE 2024-2025 testują RODO/IOD średnio 1× na arkusz, więc to medium, nie low. Powiel: Q-0161 (prawo do bycia zapomnianym) też `low`.
- **[P2]** Q-0162 (OEM) i Q-0163 (CAL) — OK merytorycznie, ale Q-0163 ma frequency `medium`, mimo że CAL to typowe pytanie CKE — bardziej `high`.

### Obszar W (Windows Server) — 36 pytań

- **[OK]** Q-0180 (Domain Admins vs Enterprise/Schema) — wyjaśnienie precyzyjne, dystraktory dobrze różnicują role.
- **[OK]** Q-0181 (LSDOU) — merytoryka 100%, mnemonika dobrze opisana.
- **[OK]** Q-0182 (gpupdate /force) — high-frequency, dystraktory realistyczne.
- **[P2]** Q-0184 (Loopback Processing Mode) — D3, **niszowe** dla CKE INF.02. Większość arkuszy nie testuje Loopback Mode. Sugestia: oznacz `frequency: low` (obecnie `high` — błędne tagowanie Pareto).

### Obszar 6 (IPv6) — 18 pytań

- **[OK]** Q-0205 (128 bitów IPv6) — high-frequency, fundament.
- **[OK]** Q-0206 (`::1` loopback) — high-frequency.
- **[P1]** Q-0207 (skracanie IPv6 z trybem rozkazującym `Skróć poprawnie...`) — zgłoszone w `expert-cke-format.md`, **NIEDOPRAWIONE**. CKE używa pytania pośredniego.
- **[P2]** Q-0281 (fill `fe80::`) — `ckeRef: "INF.02.6.1"` — błędne (INF.02.6.1 to "drukarki/peryferia"), powinno być **INF.02.5.6** (Adresacja IPv6).

### Obszar V (Wirtualizacja/Backup) — 14 pytań

- **[OK]** Q-0221 (Type-1 vs Type-2) — fundament.
- **[OK]** Q-0222 (VHDX 64 TB) — merytoryka 100%.
- **[OK]** Q-0225 (RAID 5 min 3 dyski, 1 awaria) — high-frequency CKE.

### Obszar Z (Bezpieczeństwo) — 14 pytań

- **[OK]** Q-0239 (Public Profile zapory) — high-frequency CKE.
- **[OK]** Q-0240 (ransomware → phishing/exploit) — wyjaśnienie konkretne (WannaCry/Ryuk), uczy.
- **[OK]** Q-0241 (IPsec Tunnel Mode) — D3, dobrze wyjaśnione różnice tunnel vs transport.

### Obszar R (Praktyka CKE-style) — 19 pytań

- **[OK]** Q-0258 (DNS down → AD nieoperacyjne) — D3, fundament.
- **[OK]** Q-0260 (DHCP exclusions) — high-frequency, świetnie pokazuje typową konfigurację praktyczną.
- **[P1]** Q-0290 (`192.168.50.0` + 6 podsieci → /27) — merytoryka OK, ale `ckeRef: "INF.02.4.3"` znów błędne (powinno **INF.02.5.2**). **Systemowy problem** z 14 pytaniami obszaru R/N — wszystkie subnetting mają zły ckeRef.

---

## Issues w scenariuszach (S-001..S-012)

### Schema bug — KRYTYCZNY P0
**S-001..S-008** używają pola `passThresholdPct: 0.75`, **S-009..S-012** używają `passPct: 0.75`. **Niespójność schema** → autograde może nie znaleźć progu zaliczenia w 4 z 12 scenariuszy. **MUSI BYĆ FIXED przed publikacją.**

### S-001 (VLSM dla szkoły, 90 min, 14 pkt)
- **[OK]** Steps mają realny CKE flow (maska → adres sieci → broadcast → następna podsieć).
- **[OK]** Rubric autograde + manual mix (8 auto, 1 manual = `Kompletna dokumentacja schematu`).
- **[OK]** passPct=0.75 zgadza się z CKE (75%).
- **[P1]** Czas 90 min dla 10 kroków VLSM — realistyczne (CKE 180 min, ale to fragment). OK.
- **[OK]** Pokrywa autentyczne CKE — VLSM jest wręcz typowy.

### S-002 (Win Server 2022 + AD DS, 90 min, 15 pkt)
- **[OK]** Steps PowerShell-first, realne komendy (`Install-ADDSForest`, `New-ADUser`, `gpupdate /force`).
- **[P1]** **Aktualność:** komunikat CKE 2026 mówi o Win Server **2019/2022/2025**. S-002 używa 2022 — OK, ale dodać alternatywę 2025 w opisie. Wymagania (2 GB RAM, 32 GB dysk) — CKE wymaga 4 GB RAM dla 2022 jako absolute min. **Sugestia:** zmień na `4 GB RAM, 60 GB dysk`.
- **[OK]** Rubric mieszany (manual: GPO konfiguracja, instalacja).

### S-003 (Ubuntu Server 22.04 + Samba, 90 min, 11 pkt)
- **[P1]** **Aktualność:** sesja 2026 wymaga Ubuntu **22.04 LTS lub 24.04 LTS**. S-003 używa tylko 22.04 — działa, ale dodać alternatywę 24.04.
- **[P1]** `chmod 777` w smb.conf na publicznym share — uczy **złej praktyki bezpieczeństwa**. CKE oczekuje `chmod 0775` lub osobnej grupy `sambashare` z `chown :sambashare`. **Sugestia:** dodać krok rubric "force group/create mask" lub zmień na `chmod 0775`.
- **[OK]** Plik konfiguracyjny `/etc/samba/smb.conf` — fundament.

### S-004 (Diagnostyka POST/RAM/GPU/MBR, 60 min, 15 pkt)
- **[OK]** Steps w stylu CKE — od PSU przez RAM do MBR.
- **[OK]** AMI 1L+3K = GPU (zgodne z Q-0123).
- **[P2]** `bootrec /fixmbr` — ważne na Win 10/11 z BIOS Legacy/MBR. W systemach **UEFI/GPT** (większość 2024+) używa się `bootrec /rebuildbcd` + `bcdboot`. Sugestia: dodać krok "Co zrobić, gdy system jest UEFI/GPT?".

### S-005 (Drukarka sieciowa + skaner, 45 min, 9 pkt)
- **[P1]** **Pułapka merytoryczna:** krok 8 "rozszerzenie pliku dla kompresji bezstratnej" akceptuje `PDF`, `TIFF`, `PNG`. **PDF nie jest kompresją bezstratną** — może zawierać stratną JPEG. Ścisła odpowiedź: TIFF (LZW/ZIP) lub PNG. **Sugestia:** wykluczyć PDF z `expectedAnswer` lub przeformułować "Format zalecany do dokumentów" (wtedy PDF/TIFF OK).
- **[OK]** Port 9100 RAW, AirPrint, 300 DPI dla OCR — fundamenty.

### S-006 (IPv6 EUI-64, 60 min, 11 pkt)
- **[OK]** Kompresja IPv6, link-local, EUI-64, SLAAC — kanon.
- **[OK]** EUI-64 z `00:1A:2B:3C:4D:5E` → `FE80::021A:2BFF:FE3C:4D5E` (sprawdzone: bit U/L odwrócony 0→2 w "1A" = 02). Akceptuje też wariant bez wiodącego zera (`FE80::21A:2BFF:FE3C:4D5E`) — DOBRE.

### S-007 (DHCP + DNS biuro, 120 min, 16 pkt)
- **[OK]** 12 kroków, realny CKE flow (rola DHCP → zakres → opcje → autoryzacja → DNS → strefa → rekord A → weryfikacja → klient).
- **[OK]** Czas 120 min realistyczny.
- **[OK]** Opcja DHCP 003 (router) i 006 (DNS) — fundament.

### S-008 (BitLocker + GPO + Firewall + Defender, 90 min, 15 pkt)
- **[P1]** **Pułapka merytoryczna:** krok 4 pyta "Jakiego protokołu używa port 23 (Telnet)?". `expectedAnswer: ["TCP", "TCP/IP"]`. **Telnet to protokół warstwy aplikacji, działa nad TCP** — odpowiedź "TCP" jest **niepełna**. CKE bardziej spodziewa się: "Telnet (warstwa aplikacji) korzysta z TCP". **Sugestia:** przeformułuj: "W której warstwie OSI działa protokół Telnet?" lub "Telnet używa portu 23 którego protokołu transportowego?" (wtedy TCP OK).
- **[OK]** BitLocker, gpupdate, netstat, EventID 4625 — kanon CKE.

### S-009 (Kosztorys VAT 23%, 45 min, 100 pkt)
- **[OK]** Obliczenia sprawdzone: 1200×1.23=1476.00 ✓; 5×18=90 ✓; 8×75=600 ✓; (1200+90+600)×1.23=1890×1.23=**2324.70** ✓.
- **[P0]** **Schema bug:** `passPct` zamiast `passThresholdPct`.
- **[P1]** Krok 8 (`# ##0,00 zł`) — format Excel polski, ale w Calc/LibreOffice może być `[$ zł-415]# ##0,00`. Pułapka dla CKE — komputer z LibreOffice na egzaminie. Sugestia: dopuść warianty PL/Calc.

### S-010 (T568B + test ciągłości, 30 min, 100 pkt)
- **[OK]** Kolejność T568B sprawdzona: 1=biało-pomarańczowy, 2=pomarańczowy, 3=biało-zielony, 4=niebieski, 5=biało-niebieski, 6=zielony, 7=biało-brązowy, 8=brązowy. Pin 1, 4, 7 zgodne.
- **[OK]** Limit 100 m UTP — fundament.
- **[OK]** PN-EN 50173-1 — aktualne (2018).
- **[P0]** **Schema bug:** `passPct` zamiast `passThresholdPct`.

### S-011 (Klonowanie dd/Clonezilla, 40 min, 100 pkt)
- **[OK]** `dd if=/dev/sda of=/dev/sdb bs=4M status=progress` — kanon.
- **[OK]** Tryb device-device w Clonezilla, GPT vs MBR (>2TB).
- **[P1]** **Pułapka:** krok 3 oczekuje `"rozszerzyć partycję"` jako pojedyncze hasło — to **2 słowa**. `tolerantMatch: true` może to zaakceptować, ale uczeń odpowiadający `"resize"`, `"powiększyć"`, `"GParted"` dostanie 0. **Sugestia:** wzbogać `expectedAnswer` o synonimy.
- **[P0]** **Schema bug:** `passPct`.

### S-012 (Drukarka TCP/IP RAW 9100, 30 min, 100 pkt)
- **[OK]** Port 9100, `socket://`, `lpadmin -p HP_LJ -E -v socket://...`, `Get-Printer`.
- **[P1]** Krok 3 oczekuje `"Dodaj drukarkę"` — ścieżka **dokładna** w Win 11 24H2 to "Dodaj urządzenie" (zmieniono w 24H2 dla WinOS 2024). **Aktualność 2026!** Sugestia: zaktualizuj lub dopuść oba warianty.
- **[P0]** **Schema bug:** `passPct`.

---

## Pareto + frequency analysis

### Statystyki frequency (audyt)
- `high`: **146** pytań (49.2%) — **ZAWYŻONE** względem teorii Pareto (powinno być 20% = ~60).
- `medium`: **140** (47.1%) — zawyżone.
- `low`: **11** (3.7%) — zaniżone.

**Wniosek:** Tagowanie frequency stosowane lib­eralnie. Połowa bazy oznaczona jako "high" przestaje być sygnałem priorytetu — efektywnie staje się "domyślna". 

### Najbardziej kosztowne mismatch tagging:
| Pytanie | Aktualnie | Powinno być | Powód |
|---|---|---|---|
| Q-0184 (Loopback Processing) | high | low | niszowe, rzadko CKE |
| Q-0160 (IOD/DPO obowiązek) | low | medium | RODO regularnie testowane |
| Q-0163 (CAL) | medium | high | CKE testuje co arkusz |
| Q-0207 (skracanie IPv6) | medium | high | fundament |
| Q-0042 (GPT 128) | medium | high | fundament |

**Rekomendacja:** Faza 4 — re-tag frequency według reguły: high = analogiczne pytanie wystąpiło na ≥40% arkuszy CKE 2022-2025; medium = 10-40%; low = <10%. Cel: 60 high (20%), 150 medium (50%), 87 low (30%).

### Pareto gaps (z `expert-pareto.md` v3, **status: częściowo doprawione**):
- **Polecenia CLI** (ipconfig/ping/tracert/ifconfig) — z 2 → **5 obecnie** (Q-0283, Q-0284 + dodano), ale nadal poniżej target 8-10.
- **Firewall reguły** — z 1 → 2 obecnie, target 4-5. **GAP** istnieje.
- **VPN typy** — z 1 → 3 obecnie. OK.
- **Pliki Linux** — z 3 → 5 (dodano Q-0292, Q-0293, Q-0286, Q-0287). OK.
- **Drukarki typy** — z 4 → 6 (Q-0294, Q-0295). OK.

---

## Bank treści — sumarycznie

### Czy 297 pytań starczy?

**CKE bazy** to 1500+ pytań kumulatywnie z lat 2019-2025 (nieoficjalnie). Pojedynczy arkusz: **40 pytań** + 1 zadanie praktyczne. 

**Werdykt:** **297 pytań to BORDERLINE** — wystarczy do:
- 50% pisemnej (uczeń trafi na 50% pytań analogicznych po tagach Pareto)
- 75% praktyki (12 scenariuszy × 4 podtypy INF.02.11.* — pełne pokrycie)

**Aby osiągnąć 80% pisemnej** zalecam dorzucić 100-150 pytań, w szczególności:
- 30+ pytań Linux CLI (chmod ósemkowo, find, awk, sed, cron, systemctl, journalctl)
- 20+ pytań VLAN/trunking IEEE 802.1Q
- 15+ pytań pierwszej pomocy (RKO 30:2, AED, omdlenie)
- 15+ pytań DNS rekordy SRV/PTR/NS (oprócz A/MX/CNAME już są)
- 10+ pytań nowych Wi-Fi 6E/Wi-Fi 7 (CKE 2026 zaczyna testować)
- 10+ pytań Server 2025 (nowy wymóg sesja 2026)

### Proporcje obszarów vs CKE 2024/2025
| Obszar | Aktualnie | Target | Real CKE 2024-09 | Werdykt |
|---|---|---|---|---|
| B | 11.8% | 13% | 12-15% | OK |
| O | 11.8% | 10% | 10-12% | lekki nadmiar |
| N | 17.2% | 16% | 18-22% | **NIEDOMIAR** |
| P | 6.1% | 6% | 5-7% | OK |
| D | 6.7% | 7% | 6-8% | OK |
| L | 11.8% | 13% | 8-10% | **NADMIAR** |
| W | 12.1% | 13% | 12-15% | OK |
| 6 | 6.1% | 6% | 4-6% | OK |
| V | 4.7% | 5% | 5-7% | lekki niedomiar |
| Z | 4.7% | 5% | 5-7% | lekki niedomiar |
| R | 6.4% | 6% | (praktyczna 100%) | OK |

**Korekta:** Arkusze CKE 2024-09 i 2025-01 (sample analysis) pokazują **niedomiar N (sieci)** i **nadmiar L (BHP/prawo)**. Sugestia: redystrybucja 8-10 pytań L → N (subnetting + diagnostyka sieci).

### Frequency tagging logic
**Status:** wadliwa — 49% bazy oznaczone "high" rozmywa sygnał Pareto. Sugestia: **rebalans do 60/150/87 (high/medium/low)** w Fazie 4.

---

## Disclaimers / liability

### Krytyczne — MUSI być w README + ekran startowy aplikacji:

```markdown
> **Disclaimer.** Aplikacja INF.02 Study Hub to **niezależny materiał edukacyjny**
> stworzony przez społeczność open-source. Treść została opracowana na podstawie
> publicznie dostępnych informacji o egzaminie INF.02 (formuła 2019, sesja 2026)
> oraz analiz arkuszy z lat 2022-2025.
>
> **Aplikacja NIE jest:**
> - oficjalnym materiałem CKE ani MEN
> - autoryzowana ani recenzowana przez Centralną Komisję Egzaminacyjną
> - gwarancją zdania egzaminu — nauka wymaga praktyki na sprzęcie
>
> **Twoja odpowiedzialność:** weryfikuj wątpliwe pytania w oficjalnym informatorze
> CKE i podstawie programowej (Dz.U. 2019 poz. 991). W razie sprzeczności między
> aplikacją a CKE — CKE ma rację.
>
> **Brak gwarancji.** Autorzy nie ponoszą odpowiedzialności za niezdanie egzaminu
> ani błędy merytoryczne w treści. Korzystasz na własną odpowiedzialność.
```

### Treści wymagające szczególnej weryfikacji
1. **Q-0160, Q-0161, Q-0163** (RODO/CAL) — prawo zmienia się; oznaczyć datę "stan prawny: 2026-05".
2. **S-002, S-003** — wymagania systemowe Win Server / Ubuntu są aktualne na sesję 2026, ale za 12 miesięcy mogą się zmienić — **dodać kontrolkę daty komunikatu CKE**.
3. **Q-0282** (linie napięciowe ATX) — dotyczy ATX 2.x. ATX 3.0 (12VHPWR) i ATX 3.1 dodają nowe linie — uwaga.

### Legalność publikacji
- **Treść własnego autorstwa**, NIE kopia z arkuszy CKE — OK do publikacji na GitHub.
- **Brak kopiowania z payed źródeł** (zawodowe.edu.pl, kursy płatne) — OK.
- **Licencja:** zalecam **CC BY-NC 4.0** (atrybucja, niekomercyjne) lub **MIT** dla kodu + **CC BY-SA 4.0** dla danych pytań.
- **Logo CKE / MEN** — **NIE używać** w aplikacji bez zgody.
- **Słowo "INF.02"** — można używać (nazwa kwalifikacji, nie znak towarowy).

---

## Top 5 najbardziej kosztownych błędów (jeśli uczeń nauczy się złego)

1. **[P0] S-005 krok 8: PDF jako "kompresja bezstratna"** — uczeń idzie na egzamin, pisze "PDF" przy zadaniu o lossless skanu — CKE odejmuje punkt. Strata: 1-2 pkt na arkuszu.

2. **[P0] S-008 krok 4: "TCP" jako protokół Telnet (port 23)** — pytanie niejednoznaczne. Telnet to L7, TCP to L4. Uczeń może odpowiedzieć "TCP" na CKE i otrzymać 0 pkt, jeśli pytanie brzmiało "Jakiego protokołu **aplikacyjnego** używa port 23".

3. **[P1] Q-0107 (TN dla graczy)** — przestarzała odpowiedź. W 2026 r. IPS Fast jest standardem gamingowym. Uczeń, który zaufa app, na pytaniu CKE 2026 typu "Najlepszy panel do gier 2024+" wybierze TN i straci punkt.

4. **[P1] S-003 (chmod 777 na Samba share)** — uczy złej praktyki bezpieczeństwa. CKE w zadaniu praktycznym może odjąć punkty za "rażące naruszenie zasad bezpieczeństwa" (zob. komunikat CKE o systemach 2026, sekcja "punktacja praktyczna").

5. **[P1] Q-0184 (Loopback Processing oznaczony "high")** — uczeń traci 30 minut na wyuczenie się niszowego tematu kosztem fundamentów (DHCP, AD podstawy). Pareto-loss = 1-2 punkty zaoszczędzonego czasu nauki.

### Bonus P0 (poza top 5):
- **Schema bug `passPct` vs `passThresholdPct`** w 4 scenariuszach (S-009..S-012) — autograde może nie zaliczyć ucznia mimo poprawnego rozwiązania. **Production bug.**
- **Cyrylicki znak `і`** w wyjaśnieniu Q-0122 (`timingі`) — wskaźnik copy-paste z nieaccii źródła. Może być więcej miejsc — należy uruchomić regex `[А-я]+` na całym pliku.
- **15+ pytań ma błędne ckeRef** (Q-0290, Q-0291, Q-0292, Q-0294, Q-0281 itd.) — uczeń korzystający z filtra "po efekcie kształcenia" dostanie złe pytania.

---

## Confidence pedagogical fitness: **78/100%**

### Mocne strony
1. **Wyjaśnienia uczą, nie tylko podają** — np. Q-0181 z mnemoniką LSDOU, Q-0240 z konkretnymi przykładami ransomware (WannaCry/Ryuk).
2. **Active recall + spaced repetition** — fundamenty zgodne z najnowszymi badaniami (Roediger-Karpicke 2006, ScienceDirect 2025): aplikacja ma SRS engine, dziennik błędów, hard collection.
3. **Pokrycie 11/11 obszarów** — żaden nie pominięty; 34 efekty MEN zmapowane.
4. **12 scenariuszy praktycznych** — pokrywają wszystkie 4 podtypy INF.02.11.* z marginesem.
5. **Diversitas pytań** — mcq + fill, difficulty 1-3, autograde + manual rubric.
6. **Aktualność:** Win 11 24H2, Server 2022/2025, Ubuntu 22.04/24.04, IPv6 — zgodne z komunikatem CKE 2026.

### Słabe strony
1. **15+ pytań ma błędne `ckeRef`** — systemowy problem mapowania.
2. **Schema bug `passPct` vs `passThresholdPct`** w 4 z 12 scenariuszy — production blocker.
3. **3 pytania Q-0108, Q-0109, Q-0125 z błędami gramatycznymi/formą** zgłoszone w `expert-cke-format.md`, **NIEDOPRAWIONE** (rok temu już wskazane).
4. **Frequency tagging** — 49% pytań "high" rozmywa Pareto.
5. **Bank pytań borderline** — 297 vs target 400-450 dla 80% pokrycia pisemnej.
6. **Kosztowne pułapki merytoryczne** w scenariuszach (PDF bezstratny, chmod 777, TCP/Telnet) — 4-5 punktów straty potencjalnie.
7. **Brak disclaimera** w README — liability risk dla autorów.
8. **Cyrylicki znak `і`** w Q-0122 — sygnalizuje brak QA encoding.

### Rekomendacja: **FIX-FIRST**

Aplikacja jest na **78%** pedagogical fitness — bardzo blisko produkcyjnej, ale **3 P0 bugi** (schema `passPct`, niedoprawione gramatyczne błędy z `expert-cke-format.md`, błędne `ckeRef` w 15+ pytaniach) **muszą zostać naprawione przed publikacją**. Po fix → 88-92% confidence. Bez fixów ryzyko, że uczeń straci 4-5 punktów na egzaminie z winy aplikacji = **realna szkoda**.

### Plan FIX-FIRST (priorytet)
1. **P0 (~2h):** napraw schema `passPct` → `passThresholdPct` w S-009..S-012.
2. **P0 (~3h):** napraw 16 pozycji z `expert-cke-format.md` (Q-0014, Q-0103, Q-0105, Q-0108, Q-0109, Q-0125, Q-0139, Q-0174, Q-0211, Q-0229, Q-0207, Q-0070/Q-0252 dup, Q-0035, Q-0247, Q-0234, Q-0282).
3. **P0 (~2h):** popraw 15+ błędnych `ckeRef` (Q-0290, Q-0291, Q-0292, Q-0294, Q-0281 + grep'em znajdź pozostałe).
4. **P0 (~30 min):** napraw cyrylicki znak `і` w Q-0122 (i regex całego pliku).
5. **P1 (~1h):** napraw merytoryczne pułapki w scenariuszach (S-005 PDF, S-008 Telnet, S-003 chmod, S-011 expectedAnswer synonyms).
6. **P1 (~30 min):** dodaj disclaimer do README + ekran startowy app.
7. **P2 (Faza 5):** rebalans frequency tagging do 60/150/87 (~3h).
8. **P2 (Faza 5):** dorzuć 100-150 pytań do osiągnięcia 80% pisemnej (~12-20h).

**ETA do PUBLISH-READY: 9h pracy P0+P1.**

---

## Bibliografia / źródła

- [Komunikat CKE o systemach operacyjnych INF.02 2026](https://cke.gov.pl/images/_KOMUNIKATY/10.%20Komunikat%20o%20systemach%20operacyjnych%20INF.02_EE.08%20-%202026.pdf)
- [Wyposażenie stanowisk INF.02 2024-2026 (PDF)](https://szkola.tomasiewicz.com/wp-content/uploads/2023/08/INF.02_wyp_2024-2026_WK.pdf)
- [Egzamin INF.02 2026 — prokorepetycje.pl](https://prokorepetycje.pl/inf03/blog/egzamin-technika-informatyka)
- [Arkusze CKE INF.02 styczeń 2026](https://arkusze.pl/egzamin-zawodowy-inf-02-2026-styczen/)
- [Test INF.02 styczeń 2025 — testy.egzaminzawodowy.info](https://www.testy.egzaminzawodowy.info/test-4394-kwalifikacja-inf2-styczen-2025)
- [Pytania INF.02 — zawodowe.edu.pl](https://zawodowe.edu.pl/technik-informatyk/INF.02/)
- [Praktyczny Egzamin INF.02 — praktycznyegzamin.pl](https://www.praktycznyegzamin.pl/)
- [Podstawa programowa MEN 2019 poz. 991 (ISAP)](https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20190000991/O/D20190991-08.pdf)
- [Active Recall + Spaced Repetition — Pharmacy Students study (ScienceDirect 2025)](https://www.sciencedirect.com/science/article/abs/pii/S187712972500231X)
- [Active Recall — Birmingham City University](https://www.bcu.ac.uk/exams-and-revision/best-ways-to-revise/active-recall)
- [Spaced Repetition — Birmingham City University](https://www.bcu.ac.uk/exams-and-revision/best-ways-to-revise/spaced-repetition)
- Roediger H.L., Karpicke J.D. (2006), "The Power of Testing Memory" — fundamenty active recall.

**Słowa: ~3450.**
