# Changelog

## v2.0 — 2026-04-25

### Dodane

- **80 nowych pytań** (id 151–230) w 6 nowych obszarach:
  - **L** — Prawo, BHP, licencje (15)
  - **W** — Windows Server: DHCP, DNS, AD DS, GPO (15)
  - **6** — IPv6 i routing zaawansowany (10)
  - **V** — Wirtualizacja (Hyper-V, VHDX) i backup (10)
  - **Z** — Bezpieczeństwo zaawansowane (BitLocker, NTFS ACL, EFS) (10)
  - **R** — Praktyka CKE-style (20)
- **Adaptive engine** (`window.AdaptiveEngine`):
  - Diagnoza wstępna 12 pytań
  - Weak-area weighted quiz selection (70/30)
  - SM-2 z 4-rating (Again/Hard/Good/Easy)
  - Soft lapse penalty (interval × 0.2 zamiast resetu)
  - Free recall + tolerancyjny matcher
  - Worked examples z fading (full → scaffold → hint → solo)
  - Knowledge model + readiness for exam
- **UX redesign** (`window.UX`):
  - 3-step onboarding wizard
  - Streak counter (🔥) z 3 freezami
  - 12 achievementów + toast notifications
  - Mobile bottom-nav + 44–56px tap targets
  - Confetti przy passed quiz
  - Haptic feedback (vibrate API)
  - Micro-shake przy błędnej odpowiedzi
  - Score count-up animation
- **Nowe widoki**: Diagnoza, Naucz się słabych, Osiągnięcia
- **Migracja** automatyczna progresów z v1 (`inf02_progress_v1` → `inf02_progress_v2`)

### Naprawione

- **id:10** (RAID 1) — literówka "paritybity" → "bity parzystości"; zamieniony absurdalny dystraktor "kopia w chmurze" na techniczny RAID 6
- **id:23** (64-bit addressing) — ujednolicone wyjaśnienie z id:33: 16 EB teoretyczne, 256 TB praktyczne (x86-64 = 48 bitów adresacji)
- **id:33** (NTFS) — poprawiona chronologia: pre-Win8 = 16 TB, Win8/Server 2012+ = 256 TB (klaster 64 KB), domyślny klaster 4 KB → 16 TB
- **id:67** (podsieć /26) — dodany krok obliczenia: "165 div 64 = 2, 2 × 64 = 128"

### Zmienione

- AREAS rozszerzone z 5 do 11 obszarów
- Quiz selection: random → adaptive (z fallback do random gdy engine niedostępny)
- Leitner 5-box → SM-2 z 4-rating
- Klucz localStorage: `inf02_progress_v1` → `inf02_progress_v2`

## v1.0 — 2026-04-24

### Dodane

- 150 pytań egzaminacyjnych (id 1–150) w 5 obszarach: B/O/N/P/D
- Quiz egzaminacyjny 40 pyt × 60 min (oraz mini-testy 10/20 pyt)
- Spaced repetition Leitner 5-box (10min/1d/3d/7d/21d)
- Nauka tematyczna z filtrowaniem po obszarze
- Symulator praktyczny:
  - Kalkulator podsieci IPv4
  - Generator zadań IP (4 typy)
  - Quiz poleceń CLI (Linux + Windows)
- Dashboard z postępem per obszar, plan 6-tygodniowy
- Eksport/import postępów (JSON)
- Responsive design (mobile media query)
- Persystencja w localStorage
