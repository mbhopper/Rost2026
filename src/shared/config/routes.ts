export const routes = {
  root: '/',
  login: '/auth/login',
  register: '/auth/register',
  registerSuccess: '/auth/register/success',
  support: '/support',
  supportSuccess: '/support/success',
  dashboard: '/dashboard',
  pass: '/pass',
  qrGenerate: '/pass/qr',
  profile: '/profile',
  settings: '/settings',
  unauthorized: '/unauthorized',
  adminLogin: '/admin/login',
  adminDashboard: '/admin/dashboard',
  adminEmployees: '/admin/employees',
  adminOnboarding: '/admin/onboarding',
  adminEmployeeDetails: (employeeId: string) => `/admin/employees/${employeeId}`,
} as const;

export const defaultUserRoute = routes.dashboard;
export const defaultAdminRoute = routes.adminDashboard;
export const defaultPrivateRoute = defaultUserRoute;

export const primaryNavigation = [
  {
    href: routes.dashboard,
    label: 'Главная',
    description: 'Сводка по пропуску, статусам и быстрым действиям.',
  },
  {
    href: routes.pass,
    label: 'Пропуск',
    description: 'QR-код и экран прохода.',
  },
  {
    href: routes.profile,
    label: 'Профиль',
    description: 'Карточка сотрудника и системные данные.',
  },
  {
    href: routes.settings,
    label: 'Настройки',
    description: 'Тема, уведомления и secure-view.',
  },
] as const;

export const adminNavigation = [
  {
    href: routes.adminDashboard,
    label: 'Обзор',
    description: 'KPI по пропускам и инцидентам.',
  },
  {
    href: routes.adminEmployees,
    label: 'Сотрудники',
    description: 'Поиск, фильтрация и просмотр пропусков.',
  },
  {
    href: routes.adminOnboarding,
    label: 'Онбординг',
    description: 'Оформление заявок и выпуск пропусков.',
  },
] as const;
