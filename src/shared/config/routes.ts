export const routes = {
  login: '/auth/login',
  register: '/auth/register',
  pass: '/pass',
  profile: '/profile',
  settings: '/settings',
} as const;

export const defaultPrivateRoute = routes.pass;

export const primaryNavigation = [
  { href: routes.pass, label: 'Пропуск', description: 'Активный QR и уровни доступа' },
  { href: routes.profile, label: 'Профиль', description: 'Данные сотрудника и привязки' },
  { href: routes.settings, label: 'Настройки', description: 'Уведомления и безопасность' },
] as const;
