# Basic APP (React)

Frontend panelu administracyjnego z logowaniem, kontem użytkownika oraz
zarządzaniem użytkownikami, rolami i uprawnieniami. Aplikacja współpracuje z API (Laravel)
i jest dostępna w trzech językach: polskim, angielskim i hiszpańskim.

Projekt jest portem aplikacji `basic-app-angular` – struktura, widoki, wygląd i zachowanie
odpowiadają wersji Angular, która pozostaje źródłem prawdy.

## Spis treści

- [Stack technologiczny](#stack-technologiczny)
- [Funkcjonalności](#funkcjonalności)
- [Routing i lazy loading](#routing-i-lazy-loading)
- [Struktura projektu](#struktura-projektu)
- [Konfiguracja](#konfiguracja)
- [Polecenia](#polecenia)
- [TODO](#todo)

## Stack technologiczny

| Obszar      | Technologie                                                               |
| ----------- | ------------------------------------------------------------------------- |
| Framework   | React 19, TypeScript 6, Vite 8                                            |
| Routing     | React Router (data router, metadane tras w `handle`)                      |
| Stan        | Redux Toolkit (dane logowania, motyw), TanStack Query (dane tabel)        |
| Formularze  | react-hook-form + yup                                                     |
| UI          | shadcn/ui (lokalne komponenty na Radix UI), Tailwind CSS 4                |
| Ikony       | Font Awesome, `lucide-react`                                              |
| Komunikaty  | `sonner` (toasty), SweetAlert2 (potwierdzenia)                            |
| i18n        | `i18next` / `react-i18next` (PL / EN / ES)                                |
| Uprawnienia | własny `PermissionsGuard` i komponent `HasPermission`                     |
| HTTP        | axios + interceptory (prefiks API, token, locale, 401, brak połączenia)   |
| Jakość      | ESLint (`typescript-eslint`, `react-hooks`), Prettier                     |

## Funkcjonalności

### 🔐 Uwierzytelnianie

- Logowanie z opcją „Zapamiętaj mnie”.
- Rejestracja nowego konta (włączana flagą `ENABLE_REGISTRATION`) z akceptacją regulaminu.
- Potwierdzenie konta linkiem aktywacyjnym (`/confirm-account/:code`).
- Reset hasła: wysłanie maila (`/password-reset`) i ustawienie nowego hasła
  (`/password-reset-finish/:code`).
- Walidacja formularzy po stronie klienta (yup) i wyświetlanie błędów zwróconych przez API.
- Obsługa wygaśnięcia sesji (401) z automatycznym wylogowaniem oraz komunikat o braku połączenia
  z API.

### 👤 Konto użytkownika

- **Dane** – edycja danych podstawowych, dodawanie i usuwanie awatara (z podglądem), ponowne
  wysłanie maila aktywacyjnego, usunięcie konta.
- **Hasło** – zmiana hasła z potwierdzeniem i podglądem wpisywanego tekstu.
- **Ustawienia** – osobiste ustawienia użytkownika przechowywane w API.

### 🛠️ Administracja

Dostęp do widoków jest kontrolowany uprawnieniami (`USERS_*`, `ROLES_*`).

- **Użytkownicy** – lista z sortowaniem, filtrowaniem i paginacją, podgląd, dodawanie, edycja,
  usuwanie, lista usuniętych kont z możliwością przywrócenia, przypisywanie ról oraz historia zmian.
- **Role** – lista, podgląd, dodawanie i edycja ról z pogrupowanymi uprawnieniami, usuwanie
  oraz historia zmian.
- Tabele pozwalają ukrywać kolumny i zapamiętywać swój stan (filtry, sortowanie, paginacja)
  w `localStorage`.

### 🎨 Interfejs

- Layout panelu: zwijany sidebar z menu zależnym od uprawnień, breadcrumb, przełącznik języka,
  menu użytkownika i powiadomienia.
- Jasny i ciemny motyw.
- Responsywny układ (desktop i urządzenia mobilne).
- Okna dialogowe (`AppDialogProvider`), toasty (`toastService`) i potwierdzenia SweetAlert2.
- Strona 404 dla nieistniejących adresów.
- Strona błędu (`RouteError`) zamiast domyślnego ekranu React Routera – m.in. gdy nie uda się
  pobrać leniwie ładowanego widoku (np. po nowym wdrożeniu lub przy niedostępnym serwerze),
  z przyciskiem odświeżenia strony.

## Routing i lazy loading

Trasy są zdefiniowane w `src/app/app.routes.tsx` i plikach `*.routes.tsx` poszczególnych modułów.
Metadane tras (breadcrumb, opis, klikalność) są trzymane w `handle` – odpowiednik `data`
z Angulara.

- Widoki **administracji** (listy, podgląd, dodawanie, edycja użytkowników i ról) są ładowane
  leniwie (`lazy: () => import(...)`) – każdy trafia do osobnego chunka pobieranego dopiero przy
  wejściu na daną stronę.
- Layouty, dashboard, konto i strony logowania są ładowane od razu w głównym bundlu.
- Dostęp chronią `AuthenticationGuard` (zalogowany użytkownik) i `PermissionsGuard`
  (uprawnienia).

## Struktura projektu

```text
src/
├── main.tsx           # bootstrap: store, router, i18n, React Query (Angular: main.ts + app.config.ts)
├── environments/      # konfiguracja środowisk (wybierana trybem Vite)
├── styles/            # Tailwind, tokeny shadcn i style własne (custom.css)
└── app/
    ├── app.tsx        # komponent główny (tytuł strony, toasty, dialogi)
    ├── app.routes.tsx # definicja tras
    ├── core/          # guardy, interceptory HTTP, serwisy (credentials, i18n, logger), store
    ├── features/      # moduły funkcjonalne: auth, account, administration, dashboard, error
    ├── layout/        # layouty: publiczny, panelu (dashboard) i błędów
    ├── shared/        # hooki bazowe, tabela (mat-table), UI aplikacji, serwisy, interfejsy, helpery
    └── shadcn/        # lokalnie skopiowane komponenty shadcn/ui (import przez @/shadcn/...)
public/assets/         # tłumaczenia (i18n/pl|en|es), changelog, obrazy, app_version.json
```

Aliasy: `@/*` → `src/app/*` (tak jak w projekcie Angular), `@environments` → `src/environments`.

Nowe komponenty shadcn/ui dodaje się poleceniem:

```bash
npx shadcn@latest add <nazwa>
```

Pliki trafiają do `src/app/shadcn/` (aliasy w `components.json`).

## Konfiguracja

Ustawienia środowisk znajdują się w `src/environments/`
(`environment.ts`, `environment.dev.ts`, `environment.prod.ts`). Plik jest wybierany na podstawie
trybu Vite: `vite` → `environment.ts`, `vite build --mode dev` → `environment.dev.ts`,
`vite build` → `environment.prod.ts`. Najważniejsze ustawienia:

| Klucz                              | Opis                                               |
| ---------------------------------- | -------------------------------------------------- |
| `SERVER_URL`                       | Adres API (domyślnie `http://localhost:8000/api/`) |
| `SERVER_PUBLIC_PATH`               | Publiczny adres serwera                            |
| `ENABLE_REGISTRATION`              | Włącza rejestrację nowych kont                     |
| `ENABLE_LANGUAGE_CHANGE`           | Włącza przełącznik języka                          |
| `DEFAULT_LANGUAGE`                 | Język domyślny (PL)                                |
| `LANGUAGES_AVAILABLE`              | Dostępne języki                                    |
| `PAGE_SIZES` / `DEFAULT_PAGE_SIZE` | Rozmiary stron w tabelach                          |

## Polecenia

Przed pierwszym uruchomieniem zainstaluj zależności:

```bash
npm install
```

### 🚀 Uruchamianie

| Polecenie                    | Opis                                                      |
| ---------------------------- | --------------------------------------------------------- |
| `npm start` / `npm run dev`  | Serwer deweloperski – aplikacja pod http://localhost:4200 |
| `npm run preview`            | Podgląd zbudowanej aplikacji                              |

### 🏗️ Build

| Polecenie           | Opis                                                                  |
| ------------------- | --------------------------------------------------------------------- |
| `npm run build`     | Build produkcyjny (`dist/prod-dailo-app/browser`) + `post-build`      |
| `npm run build-dev` | Build w konfiguracji dev (`dist/dev-dailo-app/browser`) + `post-build`|
| `npm run build-all` | Oba warianty po kolei                                                 |

Skrypt `build/post-build.cjs` podmienia w plikach z `dist/` znacznik `{{APP_VERSION_TO_REPLACE}}`
na znacznik czasu builda. Dzięki temu przeglądarka po wdrożeniu pobiera nowe pliki tłumaczeń
zamiast wersji z cache. Plik ma rozszerzenie `.cjs`, bo projekt ma `"type": "module"`
w `package.json`, a skrypt używa składni CommonJS (`require`).

### 🧹 Jakość kodu

| Polecenie           | Opis                                 |
| ------------------- | ------------------------------------ |
| `npm run lint`      | ESLint dla `.ts` i `.tsx`            |
| `npm run lint:fix`  | ESLint z automatycznymi poprawkami   |
| `npm run typecheck` | Sprawdzenie typów (`tsc -b`)         |

## TODO

- Dodać automatyczne przeładowywanie uprawnień co X czasu.
- Dodać testy jednostkowe (Vitest) i e2e (Cypress) jak w projekcie Angular.
