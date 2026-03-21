# Employee Digital Pass MVP

Frontend-only MVP цифрового пропуска сотрудника на **React + TypeScript + Vite**.

## Что реализовано

- публичная auth-зона: `#/auth/login`, `#/auth/register`;
- отдельный admin login flow: `#/admin/login`;
- приватная пользовательская зона:
  - `#/dashboard`
  - `#/pass`
  - `#/profile`
  - `#/settings`
- отдельная admin panel:
  - `#/admin/dashboard`
  - `#/admin/employees`
  - `#/admin/employees/:employeeId`
- role-based routing и раздельные route guards для user/admin;
- mock auth / profile / pass / qr / admin directory adapters;
- responsive интерфейс под mobile-first сценарий;
- secure QR mode c best-effort web protection.

## Best-effort secure mode

Web-приложение **не может гарантированно запретить скриншоты или запись экрана**. Поэтому реализованы только честные, best-effort меры:

- маскирование QR при `visibilitychange`, `blur`, `pagehide`;
- повторное раскрытие QR только по явному действию пользователя;
- авто-маскирование после бездействия;
- watermark overlay поверх QR-экрана;
- disable `contextmenu` и `dragstart` на чувствительном экране;
- скрытие QR и sensitive-блоков в `@media print`.

## Архитектура

```text
src/
  app/        # bootstrap, router, zustand store
  pages/      # route-level screens
  features/   # сценарии: auth, qr-session, secure-view, profile
  widgets/    # крупные UI-блоки, user/admin shell
  entities/   # доменные модели user / pass / qr
  shared/     # api adapters, mocks, config, ui-kit, utils
```

## Mock layer и точка замены на backend

Текущий composition root находится в `src/shared/api/mockApi.ts`.

Для перехода на реальный backend:

1. сохранить контракты из `src/shared/api/contracts.ts`;
2. добавить реальные HTTP adapters рядом с mock-реализациями;
3. заменить wiring в `mockApi.ts` или вынести отдельный `realApi.ts`;
4. не менять route/pages/widgets — UI уже отвязан от источника данных.

## Ключевые mock services

- `src/shared/api/authService.ts`
- `src/shared/api/userProfileService.ts`
- `src/shared/api/passService.ts`
- `src/shared/api/qrSessionService.ts`
- `src/shared/api/admin/adminDirectoryService.ts`

## Demo credentials

### User
- email: `alex.ivanov@futurepass.app`
- password: `future-pass`

### Admin
- email: `admin@futurepass.app`
- password: `admin-pass`

## Команды

```bash
npm run build
npm run lint
npm run test
```

## Важное ограничение окружения

В текущем контейнере зависимости React/Vite/TypeScript не были предустановлены, а установка из registry может быть заблокирована политикой среды. Если `build/lint/test` не стартуют из-за отсутствующих пакетов, повторите проверку в окружении с установленными зависимостями.
