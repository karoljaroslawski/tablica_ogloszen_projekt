# Tablica Ogłoszeń (PERN Stack)

Kompletny system ogłoszeniowy pozwalający użytkownikom na publikowanie, przeglądanie oraz zarządzanie ofertami. Projekt zbudowany w architekturze Fullstack (PERN).

## Technologie

- **P**ostgreSQL: Relacyjna baza danych.
- **E**xpress.js: Framework backendowy dla Node.js.
- **R**eact: Biblioteka frontendowa (z React Router).
- **N**ode.js: Środowisko uruchomieniowe JavaScript.
- **Inne:** Axios, Docker, Docker Compose, CSS3.

## Funkcjonalności

Aplikacja wspiera pełne operacje **CRUD**:

-   **Dodawanie:** Formularz tworzenia ogłoszenia (tytuł, opis, cena, zdjęcia).
-   **Wyświetlanie:** Dynamiczna lista ogłoszeń na stronie głównej z filtrowaniem i sortowaniem oraz widok szczegółowy danej oferty.
-   **Edytowanie:** Możliwość aktualizacji treści i parametrów istniejących ogłoszeń.
-   **Usuwanie:** Funkcja usuwania ogłoszeń przez właściciela lub administratora (z potwierdzeniem w modalu).
-   **Panel Admina:** Specjalne uprawnienia do moderacji treści.


## Uruchomienie

### Wymagania
-   Docker
-   Docker Compose
-   Git

### Sposób uruchomienia
1. Sklonuj repozytorium za pomocą `git clone https://github.com/karoljaroslawski/tablica_ogloszen_projekt`.
2. Wejdź do katalogu z repozytorium, a następnie przejdź do katalogu `serwer`.
3. W katalogu `backend` utwórz plik .env i ustaw zmienne środowiskowe np.: 
```
DB_USER=ouser               #nazwa użytkownika w bazie danych
DB_HOST=baza                #adres serwera postgres
DB_DATABASE=offerDB         #nazwa bazy danych w serwerze postgresql
DB_PASSWORD=ouser           #hasło użytkownika w bazie danych
DB_PORT=5432                #port bazy danych, jeśli zostanie zmieniony, 
                            #należy także zmienić w docker-compose.yml
JWT_SECRET="jwt_secret"     #sekret do tokenów jwt
SERVER_PORT=5000            #port do uruchomienia serwera
```
4. Przejdź do głownego katalogu repozytorium.
5. Uruchom docker compose za pomocą komendy ```docker compose up```
6. Aplikacja uruchomi się pod portem 5000.