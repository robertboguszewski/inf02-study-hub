# Macierz pokrycia INF.02 — questions.json v1.4

Stan na 2026-05-01. Plik źródłowy: `data/questions.json` (297 pytań). Mapa kontraktowa: `contracts/curriculum-mapping.json` (34 efekty).

Metoda zliczania:
1. Każde pytanie ma pole `ckeRef` (np. `INF.02.5.2`) — to *deklarowany* efekt.
2. Dla weryfikacji rzeczywistej tematyki przeszliśmy treść `q` + `explanation` + `tags` regexpami obejmującymi 36 podtematów (patrz `gaps-and-additions.md` § A2).
3. Kolumna *Pokrycie* = `actual / minQuestions`. ≥ 100% = ✅, 75–99% = ⚠️, < 75% = ❌.
4. Kolumna *Brakujące podtematy* — co konkretnie nie pojawia się w bazie, mimo że jest na liście kryteriów MEN/CKE.

---

## Tabela główna (34 efekty)

| Kod | Tytuł | minPyt | Faktyczne | Pokrycie | Status | Brakujące podtematy / uwagi |
|---|---|---:|---:|---:|---|---|
| BPRO.01 | BHP (przekrojowy) | 8 | 0 | 0% | ❌ | Cała jednostka mapowana na `INF.02.1` (15 pyt). Decyzja: deduplikacja — uznać za pokryte przez `INF.02.1`. |
| BPRO.02 | Podstawy działalności gospodarczej | 4 | 0 | 0% | ❌ | Faktura VAT, JDG, ZUS, US, formy umów. **Realna luka** — nie ma w bazie. |
| BPRO.03 | Komunikacja i kompetencje społeczne | 2 | 0 | 0% | ❌ | Komunikacja z klientem, asertywność. **Realna luka.** |
| INF.02.1 | BHP, ergonomia, p.poż., pierwsza pomoc | 6 | 15 | 250% | ✅ | Pokrycie ilościowe OK, ale pierwszej pomocy (RKO 30:2, AED, porażenie prądem) tylko 5 trafień; gaśnice (klasy A/B/C/D/F, CO₂ vs proszkowe) tylko 3. |
| INF.02.2.1 | Identyfikacja podzespołów (CPU/RAM/dyski) | 12 | 8 | 67% | ❌ | Brak: jednostki/kodowanie (B/KiB/MiB, ASCII/UTF-8), parametry GPU (CUDA, VRAM), magistrale PCIe gen 4/5, profile XMP/EXPO. |
| INF.02.2.2 | Montaż jednostki centralnej | 10 | 11 | 110% | ✅ | OK; brakuje pyt. o klucze M.2 (key M vs key B), o kompatybilność RAM (CL latency). |
| INF.02.2.3 | Modernizacja zestawu | 6 | 15 | 250% | ✅ | Nadreprezentacja — można przenieść 4 pyt. do 2.1. |
| INF.02.3.1 | Instalacja OS | 8 | 8 | 100% | ✅ | Brak: sysprep, autounattend.xml, instalacja PXE, Linux LVM. |
| INF.02.3.2 | Systemy plików, partycjonowanie | 6 | 9 | 150% | ✅ | Brak: btrfs snapshots, ZFS, ReFS. |
| INF.02.3.3 | Konta, uprawnienia, grupy | 8 | 7 | 88% | ⚠️ | Brak: net user/net localgroup, ACL inheritance NTFS, grupy domyślne Windows (Administrators, Users, Power Users). |
| INF.02.3.4 | Powłoka (CMD, PowerShell, bash) | 10 | 10 | 100% | ✅ | Brak: pipeline PowerShell (Get-Process \| Where), bash one-linery (awk/sed). |
| INF.02.4.1 | Diagnostyka sprzętu | 6 | 8 | 133% | ✅ | Brak: kody POST AMI/Award/Phoenix, S.M.A.R.T. atrybuty, multimetr (zakres pomiaru). |
| INF.02.4.2 | Diagnostyka oprogramowania | 6 | 7 | 117% | ✅ | Brak: BSOD codes, journalctl filtrowanie. |
| INF.02.4.3 | Naprawa i konserwacja | 4 | 14 | 350% | ✅ | Nadreprezentacja — można uznać za przejściowy bufor dla `INF.02.2.1`. |
| INF.02.5.1 | Topologie i media (UTP/FTP/światłowód) | 8 | 8 | 100% | ✅ | **Krytyczne braki**: T568A vs T568B (1 pytanie!), kabel prosty vs krosowany, klasy okablowania (D/E/EA/F), spawanie światłowodów. |
| INF.02.5.2 | Adresacja IPv4 (CIDR, NAT) | 12 | 12 | 100% | ✅ | Brak: APIPA (169.254/16), loopback (127/8), różnica NAT vs PAT, port forwarding. |
| INF.02.5.3 | Adresacja IPv6 | 6 | 20 | 333% | ✅ | Nadreprezentacja — można przenieść 6-8 pyt. do innych obszarów; brak: prefix delegation, EUI-64 wzór, multicast scope. |
| INF.02.5.4 | Routing i protokoły | 4 | 13 | 325% | ✅ | Nadreprezentacja, ale brak: AD (administrative distance), metryki OSPF (cost = 10⁸/BW). |
| INF.02.5.5 | Switche, VLAN, STP | 4 | 6 | 150% | ✅ | Brak: VLAN trunk vs access (jeszcze 1-2), STP root bridge election, BPDU, port security MAC sticky. |
| INF.02.5.6 | Wi-Fi, WPA2/3, AES/CCMP | 4 | 1 | 25% | ❌ | **KRYTYCZNA LUKA**: tylko 1 pyt.! Brak: 802.11ax (Wi-Fi 6), 802.11be (Wi-Fi 7), 6 GHz, MU-MIMO, OFDMA, WPA3-SAE, AES-CCMP vs GCMP, EAP-TLS. |
| INF.02.6.1 | Peryferia (drukarki, skanery) | 6 | 8 | 133% | ✅ | Brak: skanery (TWAIN/SANE), projektory (lumen), kalibracja monitora ICC. |
| INF.02.6.2 | Konfiguracja routerów/AP/switchy | 6 | 9 | 150% | ✅ | OK. |
| INF.02.7.1 | Windows Server (AD DS, GPO, DNS, DHCP) | 14 | 17 | 121% | ✅ | Brak: **DFS-N/DFS-R** (0 pyt.), **WSUS** (0), **RDS/RemoteApp** (0), **NPS/RADIUS** (0), Hyper-V Replica, Server Core, FSMO roles, opcje DHCP 003/006/015/066, rekordy SRV. |
| INF.02.7.2 | Linux server | 4 | 19 | 475% | ✅ | Nadreprezentacja — w arkuszach CKE Linux to ~25% Windows. Można odjąć 8-10 pyt. |
| INF.02.8.1 | Wirtualizacja, kontenery | 6 | 5 | 83% | ⚠️ | Brak: hypervisor typ 1 vs 2 (1 trafienie), Docker (2 trafienia, słabe), snapshoty, sieć VM (bridged/NAT/host-only). |
| INF.02.8.2 | Kopie zapasowe | 4 | 10 | 250% | ✅ | Brak: klonowanie dysku (Clonezilla, dd), recovery (TestDisk). |
| INF.02.9.1 | Bezpieczeństwo systemu (firewall, AV, MFA) | 6 | 8 | 133% | ✅ | Brak: stateful vs stateless firewall, BitLocker (TPM, recovery key), LUKS. |
| INF.02.9.2 | Bezpieczeństwo sieci (VPN, IDS/IPS) | 4 | 7 | 175% | ✅ | Brak: WireGuard, IPsec phase 1/2, Snort/Suricata. |
| INF.02.10.1 | Licencje (OEM, BOX, Volume, GPL) | 4 | 7 | 175% | ✅ | Brak: KMS vs MAK, CAL (User vs Device), Creative Commons. |
| INF.02.10.2 | RODO, ZSEE, dokumentacja | 4 | 15 | 375% | ✅ | Nadreprezentacja. |
| INF.02.11.1 | Praktyka — sieć LAN/podsieci | 0 (≥2 scen.) | 16 (Q+1 mcq) | – | ⚠️ | Pyt. mcq w obszarze R; scenariusze: 2 (S-001, S-006). OK. |
| INF.02.11.2 | Praktyka — serwer (AD/Linux) | 0 (≥2 scen.) | – | – | ✅ | Scenariusze: S-002, S-003, S-007. OK. |
| INF.02.11.3 | Praktyka — diagnostyka | 0 (≥1 scen.) | – | – | ✅ | Scenariusz: S-004. OK. |
| INF.02.11.4 | Praktyka — peryferia/sieciówki | 0 (≥1 scen.) | – | – | ✅ | Scenariusz: S-005. OK. |

### Podsumowanie ilościowe

- **Łącznie pytań w bazie:** 297 (cel: ≥250) → ✅ +18%
- **Łącznie scenariuszy:** 8 (cel: ≥6) → ✅ +33%
- **Efekty MEN spełniające minQuestions:** 24/30 wymagających pyt. (dwa BPRO i `INF.02.11.*` poza zliczeniem) = **80%**
- **Efekty z luką ilościową (< minQuestions):** 6 — `BPRO.02`, `BPRO.03`, `INF.02.2.1`, `INF.02.3.3`, `INF.02.5.6`, `INF.02.8.1`
- **Efekty z luką jakościową (mimo ilości):** 3 — `INF.02.1` (pierwsza pomoc/gaśnice), `INF.02.5.1` (T568A/B), `INF.02.7.1` (DFS/WSUS/RDS/NPS)

---

## Pytania bez kodu w kontrakcie (out-of-map)

| ckeRef w bazie | Liczba | Komentarz |
|---|---:|---|
| `INF.02.11` | 16 | Pyt. typu R (praktyczne mcq) — kontrakt nie ma tego ogólnego kodu. Sugestia: zmapować na `INF.02.11.1`–`.4` w zależności od tematu lub dodać `INF.02.11.0` *Praktyka — pytania mcq*. |
| `INF.02.6.3` | 1 | Brak takiego punktu — prawdopodobnie literówka. Zmapować na `INF.02.6.2`. |
| `INF.02.2.5` | 1 | Wskazuje na pomiary (multimetr) — w nowej numeracji `INF.02.2.5` istnieje w MEN, ale w kontrakcie kontrolnym nie. Można dodać do kontraktu. |
| `INF.02.9.3` | 1 | Wskazuje na VPN — przenieść na `INF.02.9.2`. |

---

## Mapowanie obszarowe (area) ↔ proporcje docelowe

| Area | Docelowy % | Faktyczny % | Liczba | Δ |
|---|---:|---:|---:|---:|
| B | 13% | 11.8% | 35 | -1.2 pp |
| O | 10% | 11.8% | 35 | +1.8 pp |
| N | 16% | 17.2% | 51 | +1.2 pp |
| P | 6% | 6.1% | 18 | +0.1 pp |
| D | 7% | 6.7% | 20 | -0.3 pp |
| L | 13% | 11.8% | 35 | -1.2 pp |
| W | 13% | 12.1% | 36 | -0.9 pp |
| 6 | 6% | 6.1% | 18 | +0.1 pp |
| V | 5% | 4.7% | 14 | -0.3 pp |
| Z | 5% | 5.4% | 16 | +0.4 pp |
| R | 6% | 6.4% | 19 | +0.4 pp |

**Werdykt obszarowy:** baza dobrze zbalansowana, odchylenia ≤ 1.8 pp. Nie wymaga rebalansu.

---

## Rozkład trudności

Z `data/questions.json`:

| Difficulty | Liczba | % | Cel | Δ |
|---|---:|---:|---:|---:|
| 1 (easy) | 110 | 37% | 35% | +2 pp |
| 2 (medium) | 138 | 46% | 45% | +1 pp |
| 3 (hard) | 49 | 17% | 20% | -3 pp |

**Werdykt:** lekki niedobór trudnych. Większość proponowanych w `gaps-and-additions.md` pyt. uzupełniających celuje w trudność 2-3.

---

## Rozkład typów

| Type | Liczba | Cel | Komentarz |
|---|---:|---|---|
| `mcq` | 277 (93%) | ~85% | Lekka nadreprezentacja MCQ. |
| `fill` | 20 (7%) | ~15% | Niedobór fill-in. CKE w arkuszach pisemnych nie używa fill, ale do nauki SRS to wartościowy format. |

---

## Konkluzja

Z 30 efektów wymagających minimum pytań **24 (80%) jest spełnione ilościowo**, ale **3 z nich (10%) ma realne luki jakościowe** (pierwsza pomoc, T568A/B, DFS/WSUS/RDS/NPS). 6 efektów (20%) ma niedobór ilościowy — z czego 4 to niewielkie braki (-1 do -4 pyt.), a **2 to krytyczne braki**: `INF.02.5.6` Wi-Fi (1/4 pyt.) i `BPRO.02/03` (0/4 pyt.). Pełna lista konkretnych braków i propozycji uzupełnień: patrz `gaps-and-additions.md`.
