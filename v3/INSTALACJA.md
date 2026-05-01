# Instalacja — INF.02 Study Hub

Krok-po-kroku przewodnik dla osób bez doświadczenia technicznego. Cała instalacja zajmuje **3-5 minut**.

## Wymagania

- **Przeglądarka internetowa:** Chrome, Firefox, Safari lub Edge (najnowsza wersja)
- **Wolne miejsce:** ok. 100 MB (na cache offline)
- **Internet:** potrzebny tylko przy pierwszym uruchomieniu — potem aplikacja działa offline
- **Konto:** żadne nie jest potrzebne — postęp zapisuje się lokalnie w przeglądarce

## 7 kroków setup

### 1. Otwórz aplikację

Wejdź na adres:
```
https://robertboguszewski.github.io/inf02-study-hub/v3/artifacts/shell.html
```

Możesz dodać do zakładek (Ctrl+D / Cmd+D).

### 2. Kliknij "Rozpocznij onboarding"

Na ekranie powitalnym znajdziesz duży przycisk startowy. Kliknij go, aby rozpocząć krótkie wprowadzenie.

### 3. Wypełnij krótki kwestionariusz

Aplikacja zapyta o:
- **Cel** (zdać / przygotować się dobrze / powtórka)
- **Czas dziennie** (15 / 30 / 60 minut)
- **Datę egzaminu** (do planowania harmonogramu)

Odpowiedzi służą tylko do dopasowania trybu nauki — **nie są nigdzie wysyłane**.

### 4. Wykonaj 12-pytaniową diagnozę

Krótki test oceniający Twój aktualny poziom w 11 obszarach INF.02. Bez stresu — to tylko punkt startowy. Aplikacja sama wyłapie Twoje słabe strony.

### 5. Sprawdź swoją gotowość % na dashboardzie

Po diagnozie zobaczysz **dashboard** z procentowym wskaźnikiem gotowości i wykresem mocnych/słabych obszarów.

### 6. Klik "Naucz się słabych" — adaptive quiz

Aplikacja automatycznie poda pytania z obszarów, w których wypadłeś najsłabiej. Im więcej się uczysz, tym lepiej silnik dopasowuje pytania.

### 7. Zainstaluj jako aplikację (PWA)

W Chrome: kliknij **trzy kropki (⋮)** w prawym górnym rogu → **"Zainstaluj INF.02 Study Hub"**.
Na telefonie: menu przeglądarki → **"Dodaj do ekranu głównego"**.

Po instalacji aplikacja działa jak natywna — **bez paska adresu** i **w pełni offline**.

## Troubleshooting — najczęstsze problemy

### "Nie widzę pytań / pusty ekran"
Sprawdź, czy nie blokujesz JavaScript (ad-blocker, NoScript). Włącz obsługę cookies i JS dla domeny `github.io`.

### "Postęp nie zapisuje się"
Prawdopodobnie używasz **trybu prywatnego/incognito** — `localStorage` jest w nim czyszczony przy zamknięciu okna. Włącz tryb normalny.

### "Aplikacja nie działa offline"
Po pierwszym otwarciu **odśwież stronę raz online** (F5). To zapisze service worker w cache. Potem już zadziała offline.

### "Eksport JSON nie działa"
Sprawdź ustawienia pobierania w przeglądarce — powinny zezwalać na zapis plików `.json`. Niektóre przeglądarki wymagają potwierdzenia.

### "Wygląda inaczej na telefonie"
To celowe — aplikacja jest **mobile-first responsywna**. Na telefonie widzisz uproszczony układ, ale wszystkie funkcje działają tak samo.

### "Stara wersja po deploy / dziwne błędy"
Wykonaj **hard refresh**: `Ctrl+Shift+R` (Windows/Linux) lub `Cmd+Shift+R` (Mac). Alternatywnie: wyczyść cache przeglądarki dla `github.io`.

---

Powodzenia na egzaminie. Jeśli coś nie działa — [zgłoś issue na GitHubie](https://github.com/robertboguszewski/inf02-study-hub/issues).
