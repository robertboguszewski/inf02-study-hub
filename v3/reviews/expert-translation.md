# Translation / Linguistic Expert Report

Audyt językowy 282 pytań egzaminu INF.02 pod kątem anglicyzmów, kalek
językowych, niespójności terminologicznych oraz błędów wynikających
z mechanicznego (najpewniej automatycznego) tłumaczenia.

## Sumarycznie

- Pytania zaudytowane: **282**
- Krytyczne błędy tłumaczenia (psują poprawność techniczną): **5**
- Anglicyzmy zbędne / niespójności w prozie: **9**
- Niespójności terminologiczne (do ujednolicenia): **5 obszarów**
- Kalki / błędy gramatyczne wynikłe z tłumaczenia: **3**

Stan ogólny tekstu jest dobry — zdecydowana większość pytań używa
naturalnej polszczyzny technicznej. Problemy koncentrują się w kilku
pytaniach, w których — według silnego śladu wzorca — wykonano globalne
"znajdź i zamień" angielskich słów na polskie BEZ poszanowania
cudzysłowów / nazw własnych / poleceń CLI / rozwinięć skrótów.

---

## Tabela zamian (priorytet WYSOKI — apply first)

Te zamiany usuwają błędy faktograficzne, nie tylko stylistyczne.
Nieprzeprowadzenie ich oznacza, że uczeń nauczy się NIEISTNIEJĄCEJ
komendy lub złego rozwinięcia skrótu.

| ID      | Stary fragment                                   | Nowy fragment                                | Powód |
|---------|--------------------------------------------------|----------------------------------------------|-------|
| Q-0059  | `Set Użytkownik ID`                              | `Set User ID`                                | Rozwinięcie SUID jest po angielsku — nazwa własna. "Set Użytkownik ID" nie istnieje. |
| Q-0163  | `Client Dostęp License`                          | `Client Access License`                      | Oficjalna nazwa Microsoft (CAL). Tłumaczenie "Dostęp" w środku angielskiej nazwy własnej jest błędem. |
| Q-0163  | `CAL (Client Dostęp License)`                    | `CAL (Client Access License)`                | jw. (drugie wystąpienie w explanation) |
| Q-0186  | `Removable Storage Dostęp`                       | `Removable Storage Access`                   | Realna ścieżka GPO Microsoft jest po angielsku — uczeń musi ją zobaczyć dokładnie. |
| Q-0186  | `Removable Storage Dostęp` (w explanation)       | `Removable Storage Access`                   | jw. |
| Q-0186  | `Center Update`                                  | `Windows Update`                             | "Center Update" nie istnieje; oryginał to "Windows Update". |
| Q-0186  | `zablokować portom USB`                          | `zablokować porty USB`                       | Błąd gramatyczny (czasownik "zablokować" wymaga biernika, nie celownika). |
| Q-0197  | `Windows Dostęp` (jeśli wystąpi)                 | `Windows Access`                             | Standardyzacja z naprawą Q-0163 / Q-0186. |
| Q-0200  | `systemctl włącz apache2`                        | `systemctl enable apache2`                   | KRYTYCZNE — `systemctl` nie ma podkomendy `włącz`. To realne polecenie, nie do tłumaczenia. (option [1]) |
| Q-0200  | `service włącz apache2`                          | `service enable apache2`                     | Ta opcja jest błędna z założenia (jako distractor), ale powinna być po angielsku, by przypominała prawdziwą komendę. (option [3]) |
| Q-0200  | `systemctl włącz apache2` (w explanation)        | `systemctl enable apache2`                   | jw. |

## Tabela zamian (priorytet ŚREDNI — spójność / styl)

| ID      | Stary fragment                              | Nowy fragment                                  | Powód |
|---------|---------------------------------------------|------------------------------------------------|-------|
| Q-0072  | `MX 20 (backup)`                            | `MX 20 (zapasowy)`                             | "Backup" jako rzeczownik PL akceptowalny technicznie, ale "zapasowy" jest naturalniejsze w prozie. |
| Q-0121  | `Należy natychmiast wykonać backup`         | `Należy natychmiast wykonać kopię zapasową`    | Niespójność z resztą pytań, gdzie używana jest "kopia zapasowa". |
| Q-0226  | `oryginał + 2 backup`                       | `oryginał + 2 kopie zapasowe`                  | jw. — pytanie samo w sobie używa "kopia zapasowa" w treści. |
| Q-0227  | `Backup pełny / Backup różnicowy / Backup przyrostowy / Backup migawkowy` (opcje) | `Pełna / Różnicowa / Przyrostowa / Migawkowa` (z dopiskami EN w nawiasie) | Konsekwencja — pytanie używa "strategia backupu", co kalkuje EN. Lepiej "strategia tworzenia kopii zapasowej". |
| Q-0227  | `strategia backupu`                         | `strategia tworzenia kopii zapasowej`          | jw. |
| Q-0227  | `Backup przyrostowy zapisuje tylko zmiany od ostatniego backupu` | `Kopia przyrostowa zapisuje tylko zmiany od ostatniej kopii zapasowej` | jw. |
| Q-0228  | `backup musi być tworzony co najmniej co 4 godziny` | `kopia zapasowa musi być tworzona co najmniej co 4 godziny` | jw. |
| Q-0231  | `używana przez backupy i Poprzednie wersje` | `używana przez kopie zapasowe i Poprzednie wersje` | jw. |
| Q-0233  | `3 typów backupów: pełnego, przyrostowego i różnicowego` | `3 typów kopii zapasowych: pełnej, przyrostowej i różnicowej` | jw. |
| Q-0233  | `serwerach backupu`                         | `serwerach kopii zapasowych`                   | jw. |
| Q-0119  | `Task Manager`                              | `Menedżer zadań`                               | W tym samym pytaniu jest już "Menedżer urządzeń" — niespójność (jeden termin po PL, drugi po EN bez powodu). Microsoft Polska używa "Menedżer zadań". |

---

## Niespójności terminologiczne (rozważ ujednolicenie)

1. **"backup" vs "kopia zapasowa"** — `backup` (rzeczownik PL) pojawia się
   w 7 pytaniach (Q-0072, Q-0121, Q-0226, Q-0227, Q-0228, Q-0231, Q-0233),
   a fraza "kopia zapasowa" w 6 innych. Rekomendacja: w prozie stosuj
   "kopia zapasowa", "backup" zostaw tylko w nazwach własnych (np.
   "Windows Server Backup", "DHCP Failover Hot Standby").

2. **"switch" vs "przełącznik"** — Q-0092 mówi "switchem", Q-0198 i Q-0256
   "przełącznik". Rekomendacja: ujednolić na "przełącznik" (Cisco PL i CKE
   konsekwentnie używają "przełącznik"), z dopiskiem "(switch)" przy
   pierwszym wystąpieniu w danym pytaniu, jeśli potrzebne.

3. **"Task Manager" vs "Menedżer zadań"** — Q-0119 ma obie formy w jednej
   liście opcji ("Task Manager" + "Menedżer urządzeń"). Microsoft Polska
   oficjalnie tłumaczy: Task Manager → Menedżer zadań, Device Manager →
   Menedżer urządzeń. Należy ujednolicić na PL.

4. **"host" vs "urządzenie końcowe"** — `host` używany w 23 pytaniach
   (Q-0065 itd.), "urządzenie końcowe" w 0 pytaniach. To jest OK i
   spójne — w polskiej terminologii sieciowej "host" jest powszechnie
   akceptowanym terminem (CKE, Cisco PL też tak nazywają). NIE
   ujednolicać do "urządzenie końcowe" — pozostawić "host".

5. **"podsieć"** — używana w 12 pytaniach, "subsieć" 0. Spójność OK.

6. **"router"** — 9 pytań (m.in. Q-0260) używa angielskiej formy.
   "Ruter" (zalecany przez RJP odpowiednik PL) — 0 wystąpień. To jest
   OK — w polskiej praktyce IT "router" jest dominujący i zalecany
   także przez Cisco PL. Pozostawić.

7. **"firewall" vs "zapora"** — Q-0239 w treści pytania mówi
   "zapory Windows Defender Firewall", co jest pleonazmem. Rekomendacja:
   "Zapora systemu Windows (Windows Defender Firewall)". Oficjalny
   termin Microsoft Polska to "Zapora systemu Windows".

---

## 5 rekomendacji ogólnych

1. **Dodać do procesu QA reguły lintera** — automatyczne wykrywanie
   wzorców `[A-Z][a-z]+ Dostęp`, `[A-Z][a-z]+ Użytkownik`,
   `systemctl (włącz|wyłącz)`, `Center Update`. Te wzorce zawsze
   sygnalizują błąd po automatycznym tłumaczeniu.

2. **Ścieżki GPO i CLI nigdy nie tłumaczyć**. Realna ścieżka
   `Computer Configuration → Administrative Templates → System →
   Removable Storage Access` jest po angielsku, niezależnie od języka
   interfejsu Windows (bo szablony ADMX mają nazwy techniczne).

3. **Rozwinięcia skrótów (akronimów) zostawiać po angielsku**.
   SUID = "Set User ID", CAL = "Client Access License", TDP =
   "Thermal Design Power". Tłumaczenie samego skrótu to błąd
   merytoryczny — uczeń idzie na egzamin i nie rozpoznaje słów.

4. **Spójność rzeczownik/przymiotnik backup**. Zdecydować raz —
   "kopia zapasowa" w prozie, "backup" tylko w nazwach własnych
   produktów (Windows Server Backup) i akronimach.

5. **PowerShell cmdlety (`Get-ADUser`, `Disable-ADAccount`,
   `Set-ExecutionPolicy`) trzymać dokładnie tak jak są** — to są
   nazwy własne. Świetnie — w pytaniach to jest zachowane.

---

## Tabela "anglicyzm OK" (NIE zmieniać — referencja)

Następujące terminy nie są błędem i NIE powinny być zmieniane przez
naprawiacza automatycznego — ich obecność jest poprawna technicznie:

- **Polecenia CLI**: `ipconfig`, `ipconfig /all`, `chmod`, `chown`,
  `ls`, `usermod`, `gpasswd`, `gpresult`, `gpedit.msc`, `rsop.msc`,
  `eventvwr.msc`, `resmon`, `systemctl start/enable/stop/restart`,
  `service`, `chkconfig`, `init.d`, `passwd`
- **PowerShell cmdlety**: `Get-ADUser -Filter *`, `Set-ADUser`,
  `Disable-ADAccount`, `Set-ExecutionPolicy RemoteSigned`,
  `New-ADUser`, `Remove-ADUser`
- **Standardy / protokoły**: `TCP/IP`, `HTTP`, `HTTPS`, `DNS`, `DHCP`,
  `DHCPv6`, `ARP`, `ICMP`, `ICMPv6`, `NDP`, `BGP`, `OSPF`, `IGMP`,
  `LDAP`, `Kerberos`, `RADIUS`, `802.1X`, `SLAAC`, `SMB/CIFS`, `NFS`
- **Akronimy techniczne**: `RAID`, `SSD`, `NVMe`, `HDD`, `RAM`, `DDR4`,
  `DDR5`, `ECC`, `JEDEC`, `XMP`, `EXPO`, `TDP`, `CPU`, `UID`, `GID`,
  `SUID`, `CAL`, `RDS`, `OEM`, `OU`, `AD`, `GPO`, `FSMO`, `PDC`, `RID`,
  `VSS`, `VHDX`, `MX`, `SRV`, `NS`, `WINS`, `MAC`, `MITM`, `DDoS`,
  `RPO`, `RTO`, `TOTP`, `HMAC-SHA1`, `RSA`, `X.509`, `NAC`, `WPA3`,
  `Wi-Fi Direct`, `Bluetooth RFCOMM`, `AS` (Autonomous System)
- **Nazwy własne produktów / firm**: `Windows`, `Windows Server`,
  `Windows 11 Pro OEM`, `Windows Defender Firewall`,
  `Windows Server Backup`, `Linux`, `Apache`, `nginx`, `Samba`,
  `Active Directory`, `PowerShell`, `Hyper-V`, `vSwitch`, `Docker`,
  `BitLocker To Go`, `CrystalDiskInfo`, `Mopria`, `AirPrint`,
  `Google Authenticator`, `Microsoft`, `AMD Ryzen`, `Intel`,
  `Alder Lake`, `Raptor Lake`, `LGA1700`, `AM4`, `AM5`,
  `SO-DIMM`, `DIMM`, `RIMM`, `FB-DIMM`
- **Zwroty techniczne ścieżek/UI** (oryginalne nazwy w GUI):
  `Computer Configuration`, `Administrative Templates`,
  `Removable Storage Access`, `Active Directory Users and Computers`,
  `Network Access Control`, `Hot Standby`, `Load Balance`,
  `Volume Shadow Copy Service`, `Group Policy Object`,
  `Primary Domain Controller Emulator`, `Site/Domain/OU`
- **Stany / parametry konfiguracyjne**: `enabled/disabled`
  (w wyświetlaniu konfiguracji DHCP, np. "DHCP enabled/disabled" w
  Q-0057 — to literalny output `ipconfig /all`)
- **Rozwinięcia akronimów** (wszystkie po EN, jako oficjalny standard):
  `Thermal Design Power`, `Time-based One-Time Password`,
  `Client Access License`, `Set User ID`, `Recovery Point Objective`,
  `Border Gateway Protocol`, `Autonomous System`,
  `Neighbor Discovery Protocol`, `Stateless Address Autoconfiguration`

---

## Załącznik: Komentarz do "domain controller"

Q-0173 zawiera frazę `Primary Domain Controller Emulator (PDC Emulator)`
— nie tłumaczyć. To nazwa własna roli FSMO. W reszcie pytań (Q-0172,
Q-0176, Q-0183, Q-0185, Q-0190, Q-0204, Q-0254, Q-0258, Q-0262)
konsekwentnie używana jest forma polska "kontroler domeny". Spójność OK.
