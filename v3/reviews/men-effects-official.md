# Oficjalna lista efektów kształcenia INF.02 (MEN, formuła 2019)

Źródło podstawowe: **Rozporządzenie Ministra Edukacji Narodowej z dnia 16 maja 2019 r. w sprawie podstaw programowych kształcenia w zawodach szkolnictwa branżowego oraz dodatkowych umiejętności zawodowych w zakresie wybranych zawodów szkolnictwa branżowego** — Dz.U. 2019 poz. 991, załącznik do branży teleinformatycznej (INF), zawód *technik informatyk* (351203), kwalifikacja **INF.02** *Administracja i eksploatacja systemów komputerowych, urządzeń peryferyjnych i lokalnych sieci komputerowych*.

Źródła weryfikacyjne:
- ISAP: https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20190000991/O/D20190991-08.pdf
- ORE: https://ore.edu.pl/wp-content/uploads/2020/03/technik-informatyk.pdf
- Informator CKE: https://zst.pila.pl/wp-content/uploads/2024/01/technik_informatyk.pdf
- MEN portal zawodowy: https://infozawodowe.men.gov.pl/image/professionCoreCurriculum/technik-informatyk_*.pdf
- Plan nauczania CKZiU Gdańsk: https://ckziu1.gda.pl/images/pliki/kkz/t_informatyk/plan_nauczania_t_informatyk_inf02.pdf

Struktura: w podstawie programowej każda jednostka efektów kształcenia ma kod `INF.02.<n>.` (n = 1..9 dla części merytorycznych + jednostki przekrojowe BPRO oraz `INF.02.10` *Język obcy zawodowy* i `INF.02.11` *Kompetencje personalne i społeczne*). Pojedynczy efekt szczegółowy oznaczany jest `INF.02.<n>.<m>)`. Poniżej skrócony, przekrojowy wykaz tożsamy z brzmieniem rozporządzenia (układ punktowy odpowiada ułożeniu w Dz.U.).

---

## INF.02.1 — Bezpieczeństwo i higiena pracy

**Cel jednostki:** stosowanie zasad BHP, ergonomii, ochrony p.poż., ochrony środowiska oraz udzielanie pierwszej pomocy w środowisku pracy technika informatyka.

Efekty:
- INF.02.1.1) Rozróżnia pojęcia związane z BHP, ochroną p.poż., ochroną środowiska i ergonomią
  - Kryterium: definiuje pojęcia *wypadek przy pracy*, *choroba zawodowa*, *czynnik szkodliwy*, *czynnik niebezpieczny*
- INF.02.1.2) Charakteryzuje zadania i uprawnienia instytucji oraz służb działających w zakresie ochrony pracy (PIP, PIS, ZUS)
- INF.02.1.3) Opisuje prawa i obowiązki pracownika i pracodawcy w zakresie BHP
- INF.02.1.4) Identyfikuje zagrożenia dla zdrowia i życia oraz mienia i środowiska na stanowisku pracy
  - Kryterium: rozpoznaje zagrożenie *porażenia prądem elektrycznym*, *poparzenia*, *upadku*, *promieniowania*, *hałasu*, *pożaru*
- INF.02.1.5) Stosuje środki ochrony indywidualnej i zbiorowej (rękawice ESD, opaska antystatyczna, mata, gaśnica)
- INF.02.1.6) Organizuje stanowisko pracy zgodnie z wymogami ergonomii (rozporządzenie MPiPS z 1.12.1998 — komputery)
  - Kryterium: monitor 40–75 cm od oczu, górna krawędź ekranu na poziomie wzroku, krzesło z regulacją
- INF.02.1.7) Udziela pierwszej pomocy w stanach nagłych
  - Kryterium: postępowanie przy *porażeniu prądem* (odłącz, RKO 30:2), *omdleniu*, *krwotoku*, *oparzeniu*, użycie AED

## INF.02.2 — Podstawy informatyki (przygotowanie stanowiska)

**Cel jednostki:** rozpoznawanie i klasyfikowanie podzespołów komputera; pomiary; jednostki; reprezentacja danych.

Efekty:
- INF.02.2.1) Rozpoznaje podzespoły komputera osobistego, opisuje ich funkcję i parametry
  - CPU (socket, TDP, IPC, cache L1/L2/L3, hyper-threading), RAM (DDR3/4/5, CL, MHz, ECC), dyski (HDD/SSD SATA/NVMe, M.2 key M/B), GPU, PSU (80 PLUS), płyta główna (chipset, BIOS/UEFI), magistrale (PCIe gen 3/4/5, SATA III, USB)
- INF.02.2.2) Dobiera i montuje podzespoły zgodnie z dokumentacją
  - Kryterium: zgodność socket/chipset, profile RAM XMP/EXPO, standardy PSU ATX/SFX, klucze M.2 (SATA vs NVMe)
- INF.02.2.3) Modernizuje zestaw komputerowy
  - Kryterium: dobór RAM/SSD/GPU do istniejącej platformy, ocena bottleneck (CPU/GPU)
- INF.02.2.4) Stosuje systemy liczbowe (bin/dec/hex/oct), kodowanie znaków (ASCII/UTF-8), jednostki (B/KiB/MiB)
- INF.02.2.5) Wykorzystuje pomiary (multimetr, miernik mocy, termowizja) w diagnostyce
- INF.02.2.6) Konfiguruje BIOS/UEFI (boot order, secure boot, virtualization, hyper-threading)

## INF.02.3 — Administracja systemami operacyjnymi

**Cel jednostki:** instalacja, konfiguracja i eksploatacja systemów Windows, Linux, macOS oraz pracy z powłoką.

Efekty:
- INF.02.3.1) Instaluje system operacyjny (czysta instalacja, dual-boot, sysprep, autounattend)
- INF.02.3.2) Konfiguruje partycjonowanie i systemy plików (MBR vs GPT; NTFS, FAT32, exFAT, ReFS, ext4, btrfs, XFS, ZFS)
  - Kryterium: limity FAT32 (4 GB plik, 32 GB partycja), atrybuty NTFS, journaling
- INF.02.3.3) Zarządza kontami, grupami, uprawnieniami (NTFS ACL, chmod/chown, sudo, RBAC)
- INF.02.3.4) Stosuje polecenia powłoki: CMD (`ipconfig`, `chkdsk`, `sfc`, `dism`), PowerShell (cmdlety, pipeline), bash (`ls`, `grep`, `awk`, `sed`, `find`, `tar`)
- INF.02.3.5) Instaluje i odinstalowuje aplikacje (MSI, EXE, DEB, RPM, snap, flatpak, winget)
- INF.02.3.6) Zarządza usługami systemowymi (services.msc, systemctl)
- INF.02.3.7) Aktualizuje system, planuje zadania (Task Scheduler, cron)

## INF.02.4 — Eksploatacja urządzeń peryferyjnych i diagnostyka

**Cel jednostki:** podłączanie, konfiguracja i diagnostyka urządzeń peryferyjnych oraz sprzętu komputerowego.

Efekty:
- INF.02.4.1) Identyfikuje sygnały POST oraz kody błędów BIOS/UEFI; wykonuje diagnostykę sprzętową (multimetr, narzędzia testowe MemTest86, CrystalDiskInfo, S.M.A.R.T.)
- INF.02.4.2) Korzysta z narzędzi diagnostyki oprogramowania (Event Viewer, dziennik zdarzeń, journalctl, dmesg, BSOD codes, syslog)
- INF.02.4.3) Naprawia i konserwuje sprzęt (czyszczenie, wymiana pasty termoprzewodzącej, wymiana kondensatorów, wymiana matrycy laptopa)
- INF.02.4.4) Konfiguruje drukarki (laserowa proces 6 etapów, atramentowa, igłowa, sublimacyjna), TCP/IP RAW port 9100, IPP, kolejka wydruku
- INF.02.4.5) Konfiguruje skanery (TWAIN, SANE, OCR), urządzenia MFP, projektory, monitory (kalibracja, ICC)
- INF.02.4.6) Dobiera materiały eksploatacyjne (toner, tusz, taśma, papier — gramatura)

## INF.02.5 — Sieci lokalne (montaż i eksploatacja)

**Cel jednostki:** projektowanie, montaż i konfiguracja sieci LAN, VLAN, sieci bezprzewodowych oraz adresacji.

Efekty:
- INF.02.5.1) Charakteryzuje topologie (gwiazda, magistrala, drzewo, oczko, podwójny pierścień, częściowa siatka) oraz model OSI/TCP-IP (warstwy + protokoły)
- INF.02.5.2) Projektuje okablowanie strukturalne (PN-EN 50173, kategorie 5e/6/6A/7/8, klasy D/E/EA/F/FA), stosuje T568A i T568B
  - Kryterium: rozróżnia kabel prosty (oba końce ten sam standard) i krosowany (568A vs 568B)
- INF.02.5.3) Zarabia kable UTP/FTP/STP, używa testera, krimpownicy, narzędzia uderzeniowego (LSA), montuje gniazda RJ-45 i panele krosowe
- INF.02.5.4) Dobiera i montuje światłowody (SM/MM, OS1/OS2, OM1–OM5, złącza SC/LC/ST/MTRJ/FC, spawanie, mechaniczne)
- INF.02.5.5) Adresacja IPv4: klasy (A/B/C), podsieci (VLSM, CIDR), RFC1918, APIPA (169.254/16), loopback (127/8), broadcast, NAT/PAT
- INF.02.5.6) Adresacja IPv6: link-local (fe80::/10), ULA (fc00::/7), GUA, multicast (ff02::1, ff02::2), skracanie, EUI-64, prefix delegation
- INF.02.5.7) Konfiguruje routing statyczny i dynamiczny (RIPv2, OSPF — podstawy), rozumie tablicę routingu i metryki
- INF.02.5.8) Konfiguruje przełączniki: VLAN (access vs trunk, IEEE 802.1Q), STP/RSTP (root bridge, BPDU), port security
- INF.02.5.9) Konfiguruje sieci bezprzewodowe: standardy 802.11 a/b/g/n/ac/ax/be (Wi-Fi 4/5/6/6E/7), pasma 2,4/5/6 GHz, kanały, MIMO/MU-MIMO, OFDMA
- INF.02.5.10) Stosuje zabezpieczenia Wi-Fi: WPA2-PSK, WPA2-Enterprise (802.1X/RADIUS), WPA3-SAE, AES-CCMP, GCMP, ukrywanie SSID, filtrowanie MAC

## INF.02.6 — Eksploatacja urządzeń sieciowych

**Cel jednostki:** konfiguracja routerów, AP, switchy, modemów; usługi sieciowe.

Efekty:
- INF.02.6.1) Konfiguruje routery brzegowe (NAT/PAT, DHCP, port forwarding, firewall, DMZ, QoS)
- INF.02.6.2) Konfiguruje punkty dostępowe (SSID, kanał, moc TX, separacja klientów, mesh)
- INF.02.6.3) Konfiguruje przełączniki zarządzalne (VLAN, trunki, link aggregation LACP/802.3ad, STP)
- INF.02.6.4) Diagnozuje sieć narzędziami: ping, tracert/traceroute, nslookup/dig, netstat, arp, ipconfig/ifconfig, nmap, Wireshark
- INF.02.6.5) Identyfikuje protokoły warstwy aplikacji: HTTP(S), FTP/SFTP, SMTP/IMAP/POP3, SSH, Telnet, DNS, DHCP, SNMP, NTP

## INF.02.7 — Administracja serwerami

**Cel jednostki:** instalacja i konfiguracja serwerowych systemów operacyjnych oraz usług sieciowych.

Efekty:
- INF.02.7.1) Instaluje i konfiguruje Windows Server (role i funkcje, Server Core vs Desktop Experience)
- INF.02.7.2) Konfiguruje AD DS (las, domena, kontroler, OU, GPO, replikacja, FSMO)
- INF.02.7.3) Konfiguruje DHCP Server (zakresy, rezerwacje, opcje 003/006/015/066, failover)
- INF.02.7.4) Konfiguruje DNS Server (strefy podstawowa/pomocnicza/stub, rekordy A/AAAA/MX/CNAME/PTR/SRV/NS/TXT, forwardery)
- INF.02.7.5) Konfiguruje udziały plików, uprawnienia NTFS+share, DFS (DFS-N, DFS-R), ABE
- INF.02.7.6) Konfiguruje serwer wydruku (Print Services), WSUS (aktualizacje), RDS (RemoteApp, broker, gateway), NPS (RADIUS), Hyper-V
- INF.02.7.7) Instaluje i konfiguruje Linux server (systemd, useradd, sudoers, SSH, firewalld/ufw/iptables, Apache/Nginx, MySQL/PostgreSQL, BIND, ISC-DHCP, Samba)

## INF.02.8 — Wirtualizacja i kopie zapasowe

**Cel jednostki:** konfiguracja wirtualizacji oraz strategii kopii zapasowych.

Efekty:
- INF.02.8.1) Rozróżnia hipervisory typ 1 (bare-metal: ESXi, Hyper-V, Proxmox, KVM) i typ 2 (hosted: VirtualBox, VMware Workstation, Hyper-V Client)
- INF.02.8.2) Tworzy i konfiguruje maszyny wirtualne (vCPU, RAM, dysk, sieć: bridged/NAT/host-only/internal, snapshoty)
- INF.02.8.3) Posługuje się kontenerami (Docker, Podman, LXC) — obrazy, kontenery, woluminy, sieci, Dockerfile
- INF.02.8.4) Wykonuje kopie zapasowe (pełna, przyrostowa, różnicowa, syntetyczna) i stosuje strategię 3-2-1
- INF.02.8.5) Odzyskuje dane (klonowanie dysku — Clonezilla/dd, narzędzia recovery — TestDisk, PhotoRec, R-Studio)

## INF.02.9 — Bezpieczeństwo systemów i sieci

**Cel jednostki:** ochrona przed zagrożeniami; zarządzanie tożsamością i dostępem.

Efekty:
- INF.02.9.1) Konfiguruje firewall (Windows Defender Firewall, iptables, nftables, ufw, firewalld; reguły wejściowe/wyjściowe; stateful vs stateless)
- INF.02.9.2) Stosuje antywirus, EDR, polityki haseł, MFA/2FA, BitLocker, LUKS, EFS
- INF.02.9.3) Konfiguruje VPN (IPsec, OpenVPN, WireGuard, L2TP, SSTP), rozumie tunelowanie
- INF.02.9.4) Wdraża segmentację sieci (VLAN, DMZ), IDS/IPS (Snort, Suricata)
- INF.02.9.5) Rozpoznaje zagrożenia: malware (wirus, robak, trojan, ransomware), phishing, MITM, DoS/DDoS, ARP-poisoning, social engineering

## INF.02.10 — Język obcy zawodowy

(Nie testowany w naszej bazie — pomijamy w audycie pokrycia.)

## INF.02.11 — Kompetencje personalne i społeczne / kosztorys i dokumentacja

W praktyce CKE w zadaniach praktycznych ujmuje:
- Tworzenie kosztorysu w arkuszu kalkulacyjnym (Excel/Calc; netto, VAT 23%, brutto; sumy częściowe, formuły)
- Pisanie dokumentacji powykonawczej (raport z testów okablowania, lista podzespołów, harmonogram)
- Komunikacja z klientem (oświadczenie, protokół przekazania)

## Jednostki przekrojowe BPRO (z rozporządzenia)

- **BPRO.01** *Bezpieczeństwo i higiena pracy* — niezależnie od INF.02.1 jako moduł kompetencji branżowych (ergonomia, p.poż., pierwsza pomoc, środki ochrony).
- **BPRO.02** *Podstawy działalności gospodarczej* — przedsiębiorczość, formy prawne (JDG, sp. z o.o.), umowy (o pracę, B2B), faktura VAT, US/ZUS.
- **BPRO.03** *Komunikacja personalna i społeczna* — komunikacja z klientem, praca w zespole.
- **BPRO.04** *Organizacja małych zespołów* — kierowanie, delegowanie.
- **BPRO.05** *Język obcy zawodowy* — terminologia EN.

---

## Mapowanie kontraktowe (curriculum-mapping.json) ↔ rozporządzenie

Plik `contracts/curriculum-mapping.json` numeruje 34 efekty zagregowane (`INF.02.X.Y`). Większość pokrywa się 1:1 z punktami rozporządzenia, ale **w kilku miejscach kontrakt agreguje 2-3 punkty MEN w jeden kod**:

| Kod kontraktowy | Odpowiada punktom MEN | Uwaga |
|---|---|---|
| `INF.02.1` | INF.02.1.1–INF.02.1.7 | Agregat całej jednostki BHP |
| `INF.02.2.1` | INF.02.2.1, .2.4, .2.5 | Identyfikacja + jednostki + pomiary |
| `INF.02.5.1` | INF.02.5.1, .5.2, .5.3, .5.4 | Topologie + media + okablowanie + światłowód |
| `INF.02.5.5` | INF.02.5.8 | VLAN/STP |
| `INF.02.7.1` | INF.02.7.1–7.6 | Cała administracja Windows Server |
| `INF.02.8.1` | INF.02.8.1, .8.2, .8.3 | Wirtualizacja + kontenery |
| `INF.02.8.2` | INF.02.8.4, .8.5 | Backup + odzyskiwanie |
| `INF.02.9.2` | INF.02.9.3, .9.4 | VPN + segmentacja + IDS/IPS |

To agregowanie skutkuje **fałszywie zawyżonymi `minQuestions`** w niektórych obszarach: kontrakt wymaga 14 pytań na `INF.02.7.1`, gdy faktycznie powinno być 14 *rozproszonych* po 6 pod-tematach (a nie np. 12 o AD DS i 2 o DHCP). To uwzględniamy w `coverage-matrix.md` — kolumna *Brakujące podtematy*.

---

## Wnioski

1. Plik kontraktowy v3 zawiera 34 jednostki/efekty — to dobra granulacja dla quizu, ale **traci 6 efektów szczegółowych** (INF.02.2.4 systemy liczbowe, INF.02.2.6 BIOS/UEFI, INF.02.4.5 skanery/projektory, INF.02.4.6 materiały eksploatacyjne, INF.02.5.10 WPA3/CCMP, INF.02.9.5 zagrożenia/malware), które CKE testuje wyrywkowo.
2. **Brakuje całkowicie BPRO.04** (organizacja zespołu) i **BPRO.05** (j. obcy zawodowy) — rozporządzenie wymaga, ale nasza baza ich pomija. Decyzja v3: pomijamy świadomie (mała częstość pojawiania się w CKE — 0–1 pytań/arkusz), ale notujemy lukę.
3. Kod `INF.02.6` w naszym kontrakcie jest podzielony na peryferia (`INF.02.6.1`) i sieciówki (`INF.02.6.2`) — to korzystne dla quizu, ale w MEN to **dwie różne jednostki** (INF.02.4 peryferia + INF.02.6 sieciówki). Podział semantyczny zachowany.
