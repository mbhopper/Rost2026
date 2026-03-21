# Employee Digital Pass MVP

MVP веб-приложения для **цифрового пропуска сотрудника** на **React + TypeScript + Vite**.

Приложение моделирует личный кабинет сотрудника, где можно:
- войти или зарегистрироваться через mock auth;
- открыть активный цифровой пропуск;
- показать одноразовый QR для прохода;
- восстановить активную QR-сессию после refresh страницы, если TTL ещё не истёк;
- просмотреть профиль сотрудника и настройки безопасности.

Проект уже разбит на прикладные слои (`pages / features / widgets / entities / shared`) и подходит как база для замены mock-логики на реальный backend.

## Что входит в MVP

- **Аутентификация**: страницы входа и регистрации с mock API.
- **Пропуск сотрудника**: основной экран с карточкой пропуска, статусом и доступными площадками.
- **QR-сессия**: генерация, регенерация, истечение TTL, demo-сценарии `used` и `blocked`.
- **Профиль сотрудника**: данные пользователя, ID, контакты и активные пропуска.
- **Настройки**: тема, secure screen mode, demo hints и уведомления.

## Запуск

### Требования

- Node.js 18+
- npm 9+

### Установка и локальный запуск

```bash
npm install
npm run dev
```

После старта Vite приложение будет доступно в локальном dev-сервере.

### Сборка production-версии

```bash
npm run build
npm run preview
```

### Проверка качества

```bash
npm run test
npm run lint
```

### Быстрый demo-вход

Для локальной проверки можно использовать дефолтные значения формы входа:

- `alex@futurepass.app`
- `future-pass`

## Короткая архитектурная схема

```text
src/
  app/       # bootstrap, роутер, store, глобальные providers
  pages/     # route-level экраны
  features/  # пользовательские сценарии и бизнес-логика
  widgets/   # крупные UI-блоки страниц
  entities/  # доменные модели: user / pass / qr
  shared/    # api, config, mocks, ui-kit, constants, lib
```

### Как читать слои

- **pages** — собирают экран из feature/widget-блоков и привязывают его к маршруту.
- **features** — содержат сценарии уровня пользователя: например, управление QR-сессией или профиль.
- **widgets** — большие композиционные блоки интерфейса, переиспользуемые на странице.
- **entities** — типы и доменные сущности пропуска, QR и сотрудника.
- **shared** — общий фундамент: API-адаптеры, конфиг, mocks, UI-компоненты и утилиты.

## Структура проекта

```text
src/
  app/
    providers/         # bootstrap auth/settings effects
    router/            # hash-router и route guards
    store/             # Zustand slices

  pages/
    auth/login/        # экран входа
    auth/register/     # экран регистрации
    pass/              # главный экран пропуска
    profile/           # экран профиля
    settings/          # экран настроек
    not-found/         # fallback route

  features/
    auth/              # схемы форм и auth UI-состояния
    pass/              # прикладные блоки пропуска
    profile/           # детали профиля
    qr-session/        # логика QR-сценария и controller

  widgets/
    header/            # шапка приватной зоны
    pass-card/         # крупная карточка пропуска
    qr-viewer/         # визуализация QR и состояний

  entities/
    user/
    pass/
    qr/

  shared/
    api/               # контракты и mock service adapters
    config/            # routes, storage, qr TTL
    constants/         # контент и тексты интерфейса
    lib/               # общие утилиты
    mocks/             # mock data
    ui/                # базовые UI-компоненты

  styles/              # reset и глобальные стили
  test/                # test typings
```

## Где лежат mock data и mock services

### Mock data

Mock-данные лежат в `src/shared/mocks/`:

- `src/shared/mocks/auth/user.ts` — базовый mock-профиль сотрудника.
- `src/shared/mocks/pass/passes.ts` — mock-пропуска, уровни доступа и статусы.

Эти файлы удобно менять, если нужно быстро обновить demo-сценарий без изменения UI.

### Mock services

Mock-сервисы и адаптеры лежат в `src/shared/api/`:

- `mockApi.ts` — единая точка сборки mock API-адаптеров.
- `authService.ts` — login / register / logout.
- `userProfileService.ts` — получение профиля текущего сотрудника.
- `passService.ts` — загрузка пропусков.
- `qrSessionService.ts` — генерация, истечение, scan/revoke QR-сессии.
- `mockUtils.ts` — имитация задержек, токенов и сетевых ошибок.

Именно через эти сервисы store и features работают с данными, поэтому замена mocks на backend делается предсказуемо.

## Как менять TTL QR

TTL QR настраивается в файле:

- `src/shared/config/qr.ts`

Сейчас используется константа:

```ts
export const QR_SESSION_TTL_SECONDS = 300;
```

Это значение подхватывает генератор QR-сессии в `features/qr-session/model/qrSession.service.ts`.

### Что важно понимать

- TTL задаётся в **секундах**.
- Значение влияет на `expiresAt`, начальный countdown и поведение восстановления после refresh.
- Если TTL уменьшить, QR будет быстрее переходить в `expired`.
- Если TTL увеличить, дольше будет жить mock-сессия в `sessionStorage`.

## Как работает восстановление QR после refresh

Активная QR-сессия хранится в `sessionStorage`, а не в памяти React.

### Поток восстановления

1. При генерации QR store сохраняет сессию в `sessionStorage`.
2. После refresh `AppProviders` вызывает `loadQrSession()` после успешного bootstrap auth.
3. `loadQrSession()` читает persisted session из `sessionStorage`.
4. `restoreQrSession()` пересчитывает оставшийся TTL по `expiresAt`.
5. Если время ещё не вышло — сессия восстанавливается как `active` с новым `remainingSeconds`.
6. Если время уже истекло — сессия остаётся в истории состояния, но сразу переводится в `expired`.

### Практический смысл

- refresh страницы не должен ломать проходной сценарий, если пользователь обновил вкладку случайно;
- при этом QR не “оживает заново”, потому что срок считается от исходного `expiresAt`, а не от времени reload.

## Где подключать реальный backend вместо mocks

Основная точка подключения сейчас — `src/shared/api/mockApi.ts`.

### Рекомендуемый путь замены

1. Оставить текущие контракты из `src/shared/api/contracts.ts`.
2. Добавить реальные реализации сервисов рядом с mock-версиями, например:
   - `src/shared/api/authHttpService.ts`
   - `src/shared/api/passHttpService.ts`
   - `src/shared/api/qrSessionHttpService.ts`
   - `src/shared/api/userProfileHttpService.ts`
3. Собрать новый adapter composition root вместо `mockApi`.
4. Подменить импорт в store slices с mock API на real API facade.

### Где именно используется mock facade

Store slices вызывают `mockApi` напрямую:

- auth slice — для login / register / logout / bootstrap profile;
- pass slice — для загрузки пропусков;
- qr-session slice — для генерации и изменения состояния QR.

Поэтому на практике backend подключается в двух слоях:

- **shared/api** — новые HTTP/WebSocket/SDK-реализации;
- **app/store** — переключение с `mockApi` на real adapter.

Если нужна минимальная миграция, лучше сохранить текущие интерфейсы response-моделей и сначала заменить только transport layer.

## Как добавлять новые экраны и фичи

### Новый экран (page)

1. Создать папку в `src/pages/`, например `src/pages/access-history/`.
2. Собрать экран из существующих `features` и `widgets`.
3. Добавить route в `src/app/router/AppRouter.tsx`.
4. Если нужен пункт навигации — расширить конфиг/контент для header.

### Новая фича (feature)

1. Создать папку в `src/features/<feature-name>/`.
2. Вынести туда пользовательский сценарий, а не route-level страницу целиком.
3. Если фиче нужны доменные типы — использовать или расширять `src/entities/*`.
4. Если фиче нужен серверный доступ — добавить контракт/адаптер в `src/shared/api/`.
5. Если фиче нужен глобальный state — добавить новый Zustand slice или расширить существующий в `src/app/store/`.

### Простое правило разрезания

- если это **маршрут** → `pages`;
- если это **пользовательский сценарий** → `features`;
- если это **крупный визуальный блок** → `widgets`;
- если это **доменная сущность и её типы** → `entities`;
- если это **переиспользуемая инфраструктура** → `shared`.

## Ограничения web-платформы: secure screen и screenshot protection

В проекте уже есть best-effort логика для чувствительных данных:

- режим `secureScreenMode` включает маскирование части полей через CSS;
- QR дополнительно скрывается при `blur` окна и `visibilitychange` документа;
- на QR-карточке отключено контекстное меню как мягкое UX-ограничение.

### Что web-приложение **может** сделать

- скрыть чувствительные данные при потере фокуса;
- замаскировать данные через CSS/overlay;
- не показывать QR, пока пользователь явно его не запросил;
- быстро истекать QR по TTL и требовать регенерацию.

### Что web-приложение **не может гарантировать**

- запретить системный screenshot средствами обычного браузера;
- заблокировать запись экрана на уровне ОС;
- предотвратить фотографирование экрана другим устройством;
- обеспечить настоящий secure screen так же надёжно, как native Android/iOS механизмы или корпоративный device management.

### Честное ожидание для MVP

Текущая реализация — это **UI-маскирование и снижение риска**, а не криптографическая или OS-level защита от копирования экрана. Для настоящей screenshot protection потребуется нативная оболочка, MDM-политики, kiosk-mode или возможности конкретной платформы/браузера, если они доступны в инфраструктуре заказчика.

## Полезные точки входа в коде

- `src/app/router/AppRouter.tsx` — маршруты, guard-логика и layout-структура.
- `src/app/providers/AppProviders.tsx` — bootstrap auth/pass/QR и side effects настроек.
- `src/app/store/` — глобальное состояние приложения на Zustand.
- `src/features/qr-session/model/useQrSessionController.ts` — жизненный цикл QR, countdown и masking.
- `src/features/qr-session/model/qrSession.service.ts` — генерация и восстановление mock QR-сессии.
- `src/shared/config/storage.ts` — localStorage/sessionStorage ключи.
- `src/shared/constants/content.ts` — централизованные тексты интерфейса.

## Что можно развивать дальше

- подключение реального backend и токен-рефреша;
- аудит действий с пропуском;
- журнал проходов и access history;
- push/in-app уведомления;
- device binding и более строгая security-модель;
- role-based access для сотрудника, охраны и администратора.
