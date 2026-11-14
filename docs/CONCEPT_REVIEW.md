# Przegląd konceptu i PRD — Kumacz

**Charakter dokumentu:** niezależna opinia eksperta (Claude) oraz propozycje. Nic tutaj nie jest decyzją. Każda zmiana wymaga wyboru właściciela produktu i zapisu w PRD jako nowe `D-xx`.

- **Data:** 2026-11-14
- **Przeglądany `main`:** `b8eb0af4770711e7cf202f809122226c6e54f3d1`
- **Przeczytane dokumenty:** `AGENTS.md`, `docs/STATUS.md`, `docs/PRD.md` (v0.12), `docs/IMPLEMENTATION.md`, `docs/PILOT_SESSION.md`, `docs/PILOT_LESSON.md`.
- **Zakres:** produkt i specyfikacja. Nie analizowałem kodu i nie uruchamiałem aplikacji ani testów.
- **Oznaczenia rodzaju uwagi:** *sprzeczność* (dwa zapisy nie mogą być jednocześnie spełnione albo działają przeciw sobie), *luka* (brak zapisu potrzebnego do decyzji), *ryzykowne założenie* (zapis jest jasny, ale opiera się na niesprawdzonej hipotezie), *usprawnienie* (opcjonalne).
- **Pewność oceny:** wysoka (wynika wprost z dokumentów lub z arytmetyki), średnia (wynika z dokumentów i typowych zachowań dzieci, wymaga obserwacji), niska (hipoteza).

## 1. Ocena ogólna

Koncept jest spójny i dobrze dopasowany do celu: krótka, regularna nauka słówek dla dzieci z klas 1–3, bez rywalizacji i bez kar. Zasady powtórek, informacji zwrotnej i ochrony danych są dopracowane ponad poziom typowy dla MVP.

Najsłabsze miejsca nie leżą w technice, tylko w trzech założeniach produktowych:

1. **Czas i tempo.** Cel 10 minut dziennie, sesje po 8–12 ćwiczeń i limit 3 nowych słów na sesję nie pasują do siebie. Razem prowadzą do wielu sesji dziennie, szybkiego wyczerpania treści i powtarzania bez wartości dla nauki.
2. **Rodzaj wiedzy.** Wszystkie oceniane ćwiczenia sprawdzają rozpoznawanie (wybór 1 z 3–4). Dziecko nigdzie nie odtwarza słowa samodzielnie, a „opanowane” oznacza „rozpoznane trzy razy”.
3. **Pomiar.** Kryteria sukcesu nie odróżnią nauki od wiedzy wcześniejszej i od zgadywania, a główna weryfikacja wartości produktu następuje dopiero po około 30 kolejnych etapach budowy.

Żadna z tych spraw nie blokuje pilotażu (P10). Pierwsza i trzecia wymagają decyzji przed budową pełnej sesji i przed 3-tygodniowym testem.

### Mocne strony, które warto zachować

- Cel tygodniowy 4 z 7 dni bez „utraconej serii” oraz brak rankingów (zasady 2–3, F-20).
- „Najpierw słuchaj”: nagrania dołączone do aplikacji, a błąd dźwięku nie jest błędem dziecka (F-41, D-62).
- Informacja zwrotna po błędzie: pokazanie i odczytanie poprawnej odpowiedzi, ponowienie po 2 innych ćwiczeniach (F-06, D-69).
- Powtórki rozłożone w dniach kalendarzowych, awans tylko w zaplanowanej powtórce i najwyżej raz dziennie (F-12, F-13, D-32, D-45, D-67). Chroni to przed uznaniem „wkucia w jeden wieczór” za trwałą wiedzę.
- Łagodne cofnięcie o 2 pudełka zamiast powrotu do pudełka 1 (D-51).
- Forma pisana dopiero po poprawnym rozpoznaniu słowa ze słuchu, osobno dla każdego słowa (F-35, D-70).
- Błędne odpowiedzi z tej samej kategorii i wykluczone pary łatwe do pomylenia (F-40, D-59).
- Tłumaczenie dopiero po odpowiedzi (F-39, D-58).
- Wczesny pilotaż na małym wycinku (D-44, D-81) i uczciwe opisywanie granic testów w dokumentach.
- Minimum danych o dzieciach, historia odpowiedzi tylko z 90 dni, brak analityki (sekcja 9, N-12).

### Najważniejsze niewiadome

- Ile realnie trwa jedna sesja i ile sesji dziecko chce zrobić w jeden dzień. Pilotaż nie liczy czasu (`PILOT_SESSION.md`, krok 6).
- Ile słów z poziomów 1–2 dzieci już znają. Od tego zależy, czy 3-tygodniowy test cokolwiek zmierzy.
- Czy pierwszoklasista rozumie dwuczęściowe polecenia głosowe i przyciski „Znam” / „Jeszcze nie”.
- Czy dzieci wracają do aplikacji po zaniku efektu nowości. Tego nie pokaże ani pilotaż, ani pierwszy tydzień testu.

## 2. Pięć najważniejszych rekomendacji

| # | Rekomendacja | Kiedy | Szczegóły |
|---|---|---|---|
| R1 | Uzgodnić czas, tempo i treść: dzienny limit nowych słów, złagodzony warunek dnia nauki oraz opis sesji, gdy nie ma nowych słów ani powtórek. | Przed P14 (po pilotażu) | U-01, U-02, U-03 |
| R2 | Dodać tanie samodzielne przypominanie: fiszka prosi „powiedz po angielsku”, zanim dziecko ją odwróci. Zdecydować, czemu służy „Znam” / „Jeszcze nie”. | Decyzja po obserwacji w pilotażu | U-04, U-05 |
| R3 | Naprawić pomiar nauki: krótkie sprawdzenie przed testem i po nim, prowadzone przez rodzica poza aplikacją, oraz pokazanie rodzicowi liczby opanowanych słów. | Przed 3-tygodniowym testem | U-06, U-07 |
| R4 | Spisać jednostronicowy protokół pilotażu: co obserwować, przez ile dni, jak mierzyć czas i po czym poznać, że wzorzec lekcji wymaga zmiany. | Przed pilotażem | U-08 |
| R5 | Sprawdzić wartość produktu wcześniej: 2–3-tygodniowy test rodzinny na „rdzeniu nauki”, zanim powstaną panel rodzica, kopie zapasowe i tryb offline. Rozważyć odłożenie F-11 i F-16. | Decyzja po pilotażu | U-09, U-10 |

## 3. Uwagi szczegółowe

### U-01 Cel 10 minut wymusza kilka sesji dziennie i szybko wyczerpuje treść

- **Źródło:** F-04 (8–12 ćwiczeń, najwyżej 3 nowe słowa na sesję, D-34), F-20 i D-76 (dzień nauki wymaga 10 minut i ukończonej sesji), F-22 (liczy się tylko czas w ćwiczeniach), F-44, sekcja 7 (poziom 1 ma 32 słowa, D-46).
- **Rodzaj:** sprzeczność między celami zapisów. **Priorytet:** wysoki. **Pewność:** wysoka co do rachunku, średnia co do czasu trwania ćwiczenia.
- **Problem:** ćwiczenie z wyborem obrazka trwa prawdopodobnie 10–20 sekund (hipoteza do zmierzenia), więc sesja 8–12 ćwiczeń to około 2–4 minuty liczonego czasu. Żeby zaliczyć dzień, dziecko potrzebuje 3–5 sesji. Limit nowych słów dotyczy sesji, a nie dnia, więc dziennie wejdzie 9–15 nowych słów. Poziom 1 skończy się wtedy po 3–4 dniach nauki, a oba poziomy MVP po 1–2 tygodniach. D-46 zakładał coś przeciwnego: około 11 sesji rozłożonych na 3 tygodnie.
- **Wpływ na użytkownika:**
  - 9–15 nowych słów dziennie to dużo dla dziecka z klas 1–3. Zasady powtórek są rozsądne, ale nie ograniczają dziennego napływu.
  - Pierwszoklasista kończy sesję i nie dostaje dnia, bo ma 4 minuty z 10. To działa jak kara, wbrew zasadzie 3.
  - Kryterium „Postęp: ukończony 1 poziom” (sekcja 11) spełni się samo w kilka dni i nie będzie świadczyć o nauce.
- **Propozycja (warianty):**
  - **A (rekomendowany):** limit nowych słów na dzień (np. 3–6) oraz dzień nauki za ukończoną sesję. 10 minut zostaje celem widocznym dla dziecka i rodzica, ale nie warunkiem. Uzasadnienie: zachowuje pierwotną ideę „krótko i regularnie” (D-07) i tempo z D-46.
  - **B:** zostawić D-76, ale dodać dzienny limit nowych słów i jasno opisać, czym wypełnia się pozostały czas (U-02).
  - **C:** wydłużyć sesję do około 10 minut. Odradzam: dłuższa sesja jest trudniejsza dla pierwszoklasisty i gorzej znosi przerwanie.
- **Koszt i kompromis:** A zmienia zatwierdzone D-34 i D-76. Limit dzienny może frustrować trzecioklasistę, który chce więcej. Można go ustawiać per profil w panelu rodzica.
- **Weryfikacja:** w pilotażu zmierzyć stoperem czas jednej sesji u obojga dzieci i zapytać po sesji: „chcesz jeszcze raz?”. Jeśli sesja trwa mniej niż 4 minuty, rachunek powyżej się potwierdza.

### U-02 Brak opisu sesji, gdy nie ma nowych słów ani zaplanowanych powtórek

- **Źródło:** F-05 („brakujące miejsca wypełnia bieżąca lekcja”), F-13, F-15, D-45 (ćwiczenie poza powtórką nie daje awansu).
- **Rodzaj:** luka. **Priorytet:** wysoki przed P14. **Pewność:** wysoka.
- **Problem:** PRD nie mówi, co zawiera sesja, gdy wszystkie lekcje są ukończone albo dzienny limit słów jest wyczerpany, a powtórek na dziś jest mało lub nie ma. Nie mówi też, co pokazuje sesja „tylko powtórki”, gdy nic nie jest zaplanowane. W 3-tygodniowym teście ten stan wystąpi prawie na pewno (U-01). Pilotaż już go pokazał w małej skali: po 7 słowach powtarzają się trzy pierwsze (`PILOT_SESSION.md`, krok 5).
- **Wpływ:** monotonne powtarzanie tych samych słów bez postępu w pudełkach, przy nagrodach za samo klikanie (U-11). Dziecko uczy się, że aplikacja „się skończyła”.
- **Propozycja:** dopisać regułę. Rekomendacja: gdy nie ma nic nowego ani zaplanowanego, sesja jest krótsza albo aplikacja mówi wprost „Na dziś wszystko! Wróć jutro”, z nagrodą za dzień. Dodatkowe ćwiczenie pozostaje możliwe, ale wybiera słowa najsłabsze (najniższe pudełko, lista trudnych słów), a nie pierwsze z listy.
- **Uzasadnienie:** zakończenie dnia „na czysto” wspiera regularność lepiej niż wypełniacz. Koszt: jedna reguła i jeden ekran.
- **Weryfikacja:** rozmowa z dzieckiem po kilku dniach testu: czy wie, kiedy „skończyło na dziś”.

### U-03 Zasada „krótko” i persona pierwszoklasisty a twardy próg 10 minut

- **Źródło:** sekcja 3 („quick wins” dla dziecka A), zasada 1, D-07, D-74, D-76.
- **Rodzaj:** ryzykowne założenie. **Priorytet:** średni. **Pewność:** średnia.
- **Problem:** 10 minut liczonego czasu (bez menu, z pauzą po 60 sekundach bezczynności) to w praktyce 12–15 minut przy tablecie. Dla dziecka 7-letniego to górna granica wygodnego skupienia na jednym typie zadania (hipoteza z praktyki, nie z badania). Ten sam próg obowiązuje pierwszoklasistę i trzecioklasistę.
- **Propozycja:** jeśli próg zostaje (U-01, wariant B), ustawiać go per profil, np. 5 minut dla młodszego dziecka. Koszt: jedno ustawienie w F-29.
- **Weryfikacja:** obserwacja, po ilu minutach młodsze dziecko zaczyna klikać bez słuchania.

### U-04 Oceniane ćwiczenia sprawdzają tylko rozpoznawanie

- **Źródło:** F-09, F-10, F-11, F-12, F-14, F-34; plan v1.1 (układanie słowa z liter) i v1.2 (wymowa).
- **Rodzaj:** ryzykowne założenie. **Priorytet:** wysoki dla jakości nauki, niski dla pilotażu. **Pewność:** wysoka co do faktu, średnia co do skutku.
- **Problem:** każde oceniane zadanie to wybór 1 z 3–4. Dziecko nigdy nie musi samo przywołać słowa. „Opanowane” (pudełko 4–5) oznacza trzy poprawne rozpoznania w odstępie tygodnia. Przy trzech opcjach szansa trafienia na ślepo to 33%, więc częściowo znane słowo awansuje łatwiej, niż sugeruje nazwa.
- **Kontekst:** rozumienie ze słuchu przed mówieniem jest rozsądną kolejnością na poziomie Pre A1 i nie jest błędem konceptu. Problemem jest brak jakiegokolwiek, nawet nieocenianego, kroku przypominania.
- **Podstawa:** badania nad „efektem testowania” pokazują, że samodzielne przywołanie informacji utrwala ją lepiej niż ponowne oglądanie (Roediger i Karpicke, 2006, *Psychological Science* 17(3), 249–255). Ograniczenie: badania dotyczyły głównie studentów i tekstów, nie siedmiolatków i słówek obcych. Traktuję to jako uzasadnioną hipotezę, a nie dowód dla tej grupy.
- **Propozycja (rekomendowana, tania):** zmienić przebieg fiszki. Przód: obrazek i polecenie „Jak to jest po angielsku? Powiedz głośno, potem odwróć kartę”. Tył bez zmian. Aplikacja niczego nie nagrywa i nie ocenia, więc prywatność i D-33 zostają nienaruszone.
- **Koszt i kompromis:** jedno nowe polecenie i nagranie. Aplikacja nie sprawdzi, czy dziecko naprawdę powiedziało słowo. Układanie z liter (v1.1) zostaje właściwym, ocenianym krokiem odtwarzania.
- **Weryfikacja:** w pilotażu rodzic prosi przy fiszce „powiedz najpierw sam” i patrzy, czy dziecko próbuje. Następnego dnia pokazuje 3 obrazki bez aplikacji i pyta o słowo.

### U-05 „Znam” / „Jeszcze nie” nie ma żadnego skutku

- **Źródło:** F-08, D-33, D-87; polecenie fiszki w `PILOT_SESSION.md`.
- **Rodzaj:** ryzykowne założenie. **Priorytet:** średni. **Pewność:** średnia.
- **Problem:** wybór nie zmienia pudełka, kolejności ani treści sesji. Dziecko, które stuknie „Jeszcze nie”, może oczekiwać pomocy i jej nie dostanie. Samoocena małych dzieci bywa zawyżona (hipoteza, do obserwacji), więc decyzja D-33, by jej nie oceniać, jest słuszna. Pozostaje pytanie, po co dziecko ma ją w ogóle podawać. Polecenie ma dwa kroki i dwie nazwy przycisków, co jest długie dla pierwszoklasisty.
- **Propozycja (warianty):**
  - **A (rekomendowany po pilotażu):** „Jeszcze nie” ma mały, widoczny skutek: słowo pojawia się jeszcze raz w tej samej sesji jako fiszka, w ramach planowanej długości. „Znam” nic nie zmienia.
  - **B:** usunąć przyciski i zostawić „Dalej”. Najprostsze, ale fiszka staje się bierną prezentacją.
  - **C:** bez zmian.
- **Koszt:** A dotyka reguł układania sesji (P14) i wymaga nowego `D-xx`.
- **Weryfikacja:** pilotaż. Czy dziecko rozumie przyciski bez pomocy i co mówi, gdy wybiera „Jeszcze nie”.

### U-06 Miernik nauki nie odróżni nauki od wiedzy wcześniejszej i od zgadywania

- **Źródło:** sekcja 11, D-71, D-72, N-12.
- **Rodzaj:** ryzykowne założenie. **Priorytet:** wysoki przed 3-tygodniowym testem. **Pewność:** wysoka.
- **Problem:**
  - **Brak punktu wyjścia.** Pierwsza zaplanowana powtórka wypada dzień po wprowadzeniu słowa, czyli już po nauce. Miernik porównuje więc „dzień po” z „kilka dni po”. Mierzy utrzymanie, a nie przyrost.
  - **Efekt sufitu.** Jeśli dziecko zna słowo wcześniej (np. cat, dog u trzecioklasisty), startuje z wynikiem co najmniej 80% i kryterium „utrzymać wynik” spełnia się bez udziału aplikacji.
  - **Szum.** Przy 10 słowach jedno słowo to 10 punktów procentowych, a wymagany przyrost to 2 słowa. Przy 33% szansy trafienia na ślepo taka zmiana może być przypadkiem.
  - **Rozpoznawanie.** Miernik dziedziczy ograniczenie z U-04.
- **Wpływ:** bramka v1.1 może się otworzyć lub zamknąć z powodów niezwiązanych z jakością nauki.
- **Propozycja (rekomendowana):** zostawić miernik z aplikacji jako pomocniczy i dodać prosty sprawdzian prowadzony przez rodzica, bez zmian w aplikacji. Przed testem i po nim rodzic pokazuje każdemu dziecku te same obrazki ze słów poziomu 1 i notuje: (a) czy dziecko samo powie słowo, (b) czy wskaże obrazek po usłyszeniu słowa. Trwa to około 5 minut na dziecko.
- **Koszt i kompromis:** 20 minut pracy rodzica. Wynik nadal dotyczy dwojga dzieci i nie uogólnia się na inne rodziny. Sprawdzian przed testem sam trochę uczy, co lekko zawyży wynik końcowy.
- **Weryfikacja:** sam sprawdzian jest weryfikacją. Warto zapisać wynik liczbowo, bez imion.

### U-07 Rodzic nie widzi głównego efektu nauki

- **Źródło:** F-14 (definicja „opanowane”), F-27 (podsumowanie: dni, czas, lekcje, poziomy), F-28.
- **Rodzaj:** luka. **Priorytet:** średni. **Pewność:** wysoka.
- **Problem:** PRD definiuje słowo opanowane, ale nigdzie go nie pokazuje. Rodzic widzi czas i ukończone lekcje, czyli aktywność, a nie wiedzę. Sekcja 2 obiecuje rodzicowi wgląd w to, „co dziecko ćwiczyło i z czym ma trudność”.
- **Propozycja:** dopisać do F-27 liczbę słów opanowanych i słów w nauce. Dane już istnieją, więc koszt jest mały. Przy liście trudnych słów dodać jedno zdanie podpowiedzi, co rodzic może zrobić (np. „poproś dziecko, żeby powiedziało te słowa na głos”).
- **Weryfikacja:** rozmowa z rodzicem po tygodniu testu: czy z panelu wie, czego dziecko się nauczyło.

### U-08 Pilotaż nie ma protokołu ani progów decyzji

- **Źródło:** D-44, D-81, P10 w `IMPLEMENTATION.md`, `PILOT_SESSION.md` (kroki testu urządzenia), `PILOT_LESSON.md`.
- **Rodzaj:** luka. **Priorytet:** wysoki, przed pilotażem. **Pewność:** wysoka.
- **Problem:** dokumenty mówią, co obserwować (obrazki, polecenia, trudność, samodzielność), ale nie mówią jak, ile razy i jaki wynik oznacza „zmienić wzorzec lekcji”. Bez tego ocena po fakcie zależy od wrażenia.
- **Co pilotaż może sprawdzić:** użyteczność i zrozumiałość. Nie sprawdzi nagród, powtórek ani zaangażowania w czasie, bo tych funkcji jeszcze nie ma. To świadome uproszczenie i nie jest wadą, o ile wnioski nie wyjdą poza ten zakres.
- **Propozycja:** jedna strona w repozytorium, bez danych osobowych:
  - **Przebieg:** każde dziecko osobno, 3 sesje w 3 różnych dniach. Rodzic siedzi obok, nie podpowiada i liczy prośby o pomoc.
  - **Notatki:** czas sesji (stoper), źle rozpoznane obrazki, miejsca niezrozumienia polecenia, reakcja na błąd, reakcja na „Znam” / „Jeszcze nie”, czy dziecko samo prosi o kolejną sesję.
  - **Dzień 2 i 3:** przed sesją 3 obrazki bez aplikacji: „jak to jest po angielsku?”.
  - **Progi (przykład do decyzji właściciela):** jeśli młodsze dziecko potrzebuje pomocy więcej niż 2 razy w sesji albo ten sam obrazek myli oboje dzieci, wzorzec wymaga poprawki przed P11.
- **Koszt:** około godziny rodzica łącznie. **Ograniczenie:** dwoje dzieci z jednej rodziny, w obecności rodzica. Wynik jest jakościowy.

### U-09 Wartość produktu jest sprawdzana dopiero na końcu budowy

- **Źródło:** `IMPLEMENTATION.md` (P11–P40), sekcja 11, D-56, D-81.
- **Rodzaj:** ryzykowne założenie. **Priorytet:** wysoki dla planu, do decyzji po pilotażu. **Pewność:** średnia.
- **Problem:** najważniejsza hipoteza, czyli „dzieci wracają i uczą się”, jest testowana w P40. Wcześniej powstają m.in. PIN i panel rodzica (P23–P24, P31–P34), kopie zapasowe i migracje (P26–P27), test przeskoczenia poziomu (P30) oraz pakiet offline (P36–P37). Jeśli rdzeń nauki wymaga zmian (np. U-01 lub U-04), duża część tej pracy powstanie przed informacją, która je wymusi.
- **Propozycja (rekomendowana):** po pilotażu zbudować rdzeń: zapis postępu, powtórki, układanie sesji, ekran nagrody i prosty album (P11–P16, P19–P22, P28), dodać brakujące lekcje poziomu 1 i zrobić 2–3-tygodniowy test rodzinny na stronie testowej (D-85). Resztę etapów budować po tym teście.
- **Koszt i kompromis:** test odbywa się bez PIN-u, bez kopii zapasowej i tylko z internetem. Ryzyko utraty postępów w teście trzeba zaakceptować albo ograniczyć jednym urządzeniem i prośbą o trwały zapis. Etapy F-10 i F-11 (P17–P18) można dołączyć lub pominąć zależnie od U-10.
- **Weryfikacja:** sam test. Decyzja „budujemy dalej bez zmian” lub „poprawiamy rdzeń” zapada wtedy po około 15 etapach zamiast po 30.

### U-10 Kandydaci do odłożenia poza MVP

- **Źródło:** F-11, F-16, sekcja 5.
- **Rodzaj:** luka (F-11) i usprawnienie (F-16). **Priorytet:** średni. **Pewność:** średnia.
- **F-11 Pytania kontekstowe:** przykład „What colour is a banana?” wymaga rozumienia angielskiego zdania, a zdania są dopiero na poziomie 4 (v1.2). PRD nie mówi, w jakim języku pada pytanie, czy jest czytane, ani jakie pytania pasują do liczb, zwierząt czy rodziny. Każde pytanie to osobna treść i nagranie. Rekomendacja: doprecyzować przed P18 albo przenieść F-11 do v1.1. Skutek odłożenia: w MVP zostają trzy typy ćwiczeń, co zwiększa ryzyko monotonii (sekcja 12).
- **F-16 Test przeskoczenia poziomu:** poziom startowy ustawiany przez rodzica (F-17) rozwiązuje ten sam problem dla trzecioklasisty przy dwóch poziomach treści. Rekomendacja: rozważyć odłożenie F-16 do czasu, gdy poziomów będzie więcej.

### U-11 Gwiazdki i naklejki nagradzają ukończenie, a nie wysiłek

- **Źródło:** F-18, F-19, F-24, F-06.
- **Rodzaj:** ryzykowne założenie. **Priorytet:** średni, po pilotażu. **Pewność:** średnia.
- **Problem:** gwiazdka jest za każde ukończone ćwiczenie, także błędne, a naklejka za każdą sesję. To zgodne z zasadą „bez kar”, ale pozwala zdobywać nagrody szybkim klikaniem. Przy kilku sesjach dziennie (U-01) dziecko dostaje 3–5 naklejek dziennie, a PRD nie mówi, ile naklejek ma temat i czy mogą się powtarzać. Gwiazdki w MVP nie mają zastosowania („moje miejsce” jest w v1.2).
- **Propozycja:** przed P22 ustalić liczbę naklejek na temat i regułę powtórek. Rozważyć jedną naklejkę dziennie (za pierwszą ukończoną sesję), co wzmacnia regularność, a nie liczbę sesji. Bez zmiany zasady „bez kar”.
- **Weryfikacja:** w teście rodzinnym obserwować, czy dziecko słucha nagrań, czy klika, żeby szybciej dojść do naklejki.

### U-12 Dziecko, które nie czyta, a polecenia i komunikaty o błędach

- **Źródło:** F-07 (polecenia mają przycisk odtwarzania; automatycznie czytane są słowa), F-41, F-42, F-43, sekcja 11 („pierwszoklasista korzysta bez pomocy dorosłego”).
- **Rodzaj:** luka. **Priorytet:** średni przed MVP; do obserwacji w pilotażu. **Pewność:** średnia.
- **Problem:** PRD nie wymaga, by polecenie odtwarzało się samo przy pierwszym zadaniu danego typu. Komunikaty o problemie z zapisem, dźwiękiem czy gotowością offline mają „wyjaśnić problem”, ale dziecko ich nie przeczyta.
- **Propozycja:** dopisać dwie reguły. Polecenie odtwarza się automatycznie przy pierwszym zadaniu danego typu w sesji. Każdy ekran błędu ma jeden duży przycisk ponowienia i krótki komunikat głosowy typu „Coś nie działa. Zawołaj rodzica”.
- **Koszt:** 2–3 nagrania. **Weryfikacja:** w pilotażu sprawdzić, czy młodsze dziecko wie, co zrobić, bez czytania.

### U-13 Forma pisana po angielsku u pierwszoklasisty

- **Źródło:** F-10, F-35, D-70, persona dziecka A.
- **Rodzaj:** ryzykowne założenie. **Priorytet:** niski teraz, średni przed P17. **Pewność:** niska.
- **Problem:** angielska pisownia nie odpowiada wymowie, a dziecko A dopiero uczy się czytać po polsku. Bramka z D-70 jest dobra, ale otwiera się już po jednym trafieniu ze słuchu, także przypadkowym.
- **Propozycja:** ustawienie per profil „ćwiczenia z czytaniem: włączone / wyłączone” albo podniesienie progu do dwóch poprawnych odpowiedzi w różne dni. Decyzję odłożyć do obserwacji starszego dziecka.

### U-14 Wymowa syntetyczna jako wzorzec

- **Źródło:** D-83, `PILOT_LESSON.md` (poprawki dog, horse, elephant).
- **Rodzaj:** ryzykowne założenie. **Priorytet:** średni przed rozszerzeniem treści. **Pewność:** średnia.
- **Problem:** nagranie jest jedynym wzorcem wymowy. Odsłuch właściciela wychwycił już kilka problemów, ale przy 60–80 słowach rośnie ryzyko przeoczenia.
- **Propozycja:** przy każdej nowej lekcji porównać nagrania z wymową brytyjską w uznanym słowniku (tak jak zrobiono dla „horse”) albo poprosić o jednorazowy odsłuch osobę uczącą angielskiego. Koszt: kilkanaście minut na lekcję.

### U-15 Dwa urządzenia bez synchronizacji i kopia zapasowa zależna od pamięci rodzica

- **Źródło:** D-04, D-05, F-30, F-37, sekcja 12.
- **Rodzaj:** ryzykowne założenie. **Priorytet:** średni przed 3-tygodniowym testem. **Pewność:** wysoka.
- **Problem:** MVP działa na komputerze i tablecie, ale postęp jest osobny na każdym urządzeniu, a import zastępuje wszystko. Dziecko, które zmieni urządzenie, zobaczy pusty album. Przypomnienie o kopii pojawia się tylko w panelu rodzica, do którego rodzic może nie zaglądać tygodniami.
- **Propozycja:** w instrukcji pierwszego uruchomienia napisać wprost „jedno urządzenie na czas MVP”. Na ekranie wyboru profilu pokazać dyskretny znak dla rodzica, gdy kopia jest starsza niż 7 dni. Koszt: jedno zdanie i jedna ikona.
- **Weryfikacja:** rozmowa z rodzicem po teście: ile razy zrobił kopię i co go do tego skłoniło.

### U-16 Słowa bez zwrotów

- **Źródło:** sekcja 7 (zdania dopiero na poziomie 4, v1.2).
- **Rodzaj:** usprawnienie. **Priorytet:** niski, później. **Pewność:** niska.
- **Problem:** przez poziomy 1–3 dziecko poznaje wyłącznie pojedyncze rzeczowniki, liczby i kolory. Nauka w szkole na tym etapie opiera się zwykle także na krótkich zwrotach.
- **Propozycja:** rozważyć w v1.1 drugie nagranie słowa w prostym zwrocie („It's a cat”) na odwrocie fiszki. Bez nowych typów ćwiczeń.

### U-17 Spójność i czytelność PRD

- **Źródło:** F-04, F-05, sekcja 14, sekcja 2.
- **Rodzaj:** drobne sprzeczności i luki. **Priorytet:** niski. **Pewność:** wysoka.
- F-04 mówi o ćwiczeniach „z bieżącej lekcji”, a F-05 przeznacza połowę sesji na powtórki, także z innych lekcji.
- PRD nie mówi, czy dziecko wybiera lekcję, czy ścieżka jest liniowa, ani co znaczy „bieżąca lekcja” po jej ukończeniu.
- Rejestr decyzji działa jak dziennik zmian: część wpisów jest zmieniona przez późniejsze (D-25 przez D-76, D-45 przez D-51, D-07 przez D-74). Warto oznaczać wpisy zastąpione i traktować wymagania F/N jako jedyne źródło obowiązujących reguł.
- Brakuje liczb dla gwiazdek (F-18) i puli naklejek (F-19). Plan etapów słusznie każe o nie zapytać przed P22.
- Sekcja 2 opisuje problem na podstawie doświadczenia jednej rodziny. To wystarcza dla produktu rodzinnego. Przy wizji „cała szkoła podstawowa” (D-73) warto to nazwać hipotezą do sprawdzenia na innych rodzinach.

## 4. Kiedy się tym zająć

**Przed pilotażem (P10):**
- U-08: protokół obserwacji z pomiarem czasu i progami decyzji.
- Uzupełnienie obserwacji o punkty z U-04, U-05 i U-12 (próba powiedzenia słowa, zrozumienie przycisków, polecenia bez czytania). Bez zmian w aplikacji.

**Po pilotażu, przed budową pełnej sesji i przed testem MVP:**
- U-01, U-02, U-03: czas, tempo, treść „na dziś”.
- U-04, U-05: fiszka z przypominaniem i rola samooceny.
- U-06, U-07: pomiar nauki i widok rodzica.
- U-09, U-10: kolejność etapów i zakres MVP.
- U-11, U-12, U-15: nagrody, komunikaty dla dziecka, jedno urządzenie.

**Później:**
- U-13, U-14 (przy rozszerzaniu treści i przed P17), U-16, U-17.

## 5. Pytania do właściciela

Odpowiedzi zmieniłyby wagę kilku uwag:

1. Ile słów z lekcji „Zwierzęta” i z poziomu 1 dzieci już znają? Jeśli większość, pilotaż nie sprawdzi trudności, a miernik nauki trafi w efekt sufitu (U-06).
2. Ile minut dziennie i ile podejść w ciągu dnia uważasz za realne dla każdego z dzieci? To rozstrzyga U-01 i U-03.
3. Czy celem MVP jest rozumienie ze słuchu, czy także mówienie? Od tego zależy priorytet U-04.
4. Czy dzieci będą korzystać z jednego urządzenia, czy z dwóch (U-15)?
5. Czy słownictwo ma odpowiadać podręcznikom szkolnym dzieci? Jeśli tak, lista Pre A1 Starters może wymagać porównania z podręcznikiem.

## 6. Ograniczenia tej opinii

- Opieram się wyłącznie na dokumentach. Nie widziałem dzieci przy aplikacji.
- Szacunki czasu ćwiczenia i sesji są hipotezami do zmierzenia w pilotażu.
- Cytuję jedno badanie (U-04), z zaznaczonym ograniczeniem. Pozostałe twierdzenia o zachowaniu dzieci oznaczam jako hipotezy.
- Wnioski z testu na dwojgu dzieci z jednej rodziny nie uogólniają się na innych użytkowników, niezależnie od jakości pomiaru.
