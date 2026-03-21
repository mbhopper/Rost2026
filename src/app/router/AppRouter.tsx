import {
  Navigate,
  NavLink,
  Outlet,
  RouterProvider,
  createHashRouter,
} from 'react-router-dom';
import { USER_ROLES } from '../../entities/user/model';
import { LoginPage } from '../../pages/auth/login/LoginPage';
import { RegisterPage } from '../../pages/auth/register/RegisterPage';
import { RegisterSuccessPage } from '../../pages/auth/register-success/RegisterSuccessPage';
import { AdminDashboardPage } from '../../pages/admin/dashboard/AdminDashboardPage';
import { AdminEmployeeDetailsPage } from '../../pages/admin/employee-details/AdminEmployeeDetailsPage';
import { AdminEmployeesPage } from '../../pages/admin/employees/AdminEmployeesPage';
import { AdminLoginPage } from '../../pages/admin/login/AdminLoginPage';
import { AdminOnboardingPage } from '../../pages/admin/onboarding/AdminOnboardingPage';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { NotFoundPage } from '../../pages/not-found/NotFoundPage';
import { PassPage } from '../../pages/pass/PassPage';
import { QrGenerationPage } from '../../pages/pass/qr/QrGenerationPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';
import { SettingsPage } from '../../pages/settings/SettingsPage';
import { SupportPage } from '../../pages/support/SupportPage';
import { SupportSuccessPage } from '../../pages/support/SupportSuccessPage';
import { UnauthorizedPage } from '../../pages/unauthorized/UnauthorizedPage';
import { defaultAdminRoute, defaultUserRoute, routes } from '../../shared/config/routes';
import { Card } from '../../shared/ui/card/Card';
import { AdminShell } from '../../widgets/admin-shell/AdminShell';
import { UserShell } from '../../widgets/user-shell/UserShell';
import { useAppStore } from '../store';

function RouteLoader() {
  return (
    <div className="page-center">
      <Card className="status-card">
        <h1>Загружаем сессию</h1>
        <p>Проверяем локально сохранённую роль, профиль и активный маршрут.</p>
      </Card>
    </div>
  );
}

function PublicOnlyRoute() {
  const authStatus = useAppStore((state) => state.authStatus);
  const isAuthBootstrapped = useAppStore((state) => state.isAuthBootstrapped);
  const currentRole = useAppStore((state) => state.currentRole);

  if (!isAuthBootstrapped || authStatus === 'loading') {
    return <RouteLoader />;
  }

  if (authStatus === 'authenticated') {
    return (
      <Navigate
        to={currentRole === USER_ROLES.ADMIN ? defaultAdminRoute : defaultUserRoute}
        replace
      />
    );
  }

  return <Outlet />;
}

function UserRouteGuard() {
  const authStatus = useAppStore((state) => state.authStatus);
  const isAuthBootstrapped = useAppStore((state) => state.isAuthBootstrapped);
  const currentRole = useAppStore((state) => state.currentRole);

  if (!isAuthBootstrapped || authStatus === 'loading') {
    return <RouteLoader />;
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to={routes.login} replace />;
  }

  if (currentRole !== USER_ROLES.USER) {
    return <Navigate to={routes.unauthorized} replace />;
  }

  return <Outlet />;
}

function AdminRouteGuard() {
  const authStatus = useAppStore((state) => state.authStatus);
  const isAuthBootstrapped = useAppStore((state) => state.isAuthBootstrapped);
  const currentRole = useAppStore((state) => state.currentRole);

  if (!isAuthBootstrapped || authStatus === 'loading') {
    return <RouteLoader />;
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to={routes.adminLogin} replace />;
  }

  if (currentRole !== USER_ROLES.ADMIN) {
    return <Navigate to={routes.unauthorized} replace />;
  }

  return <Outlet />;
}

function AuthLayout() {
  return (
    <main className="poster-shell poster-shell--auth">
      <div className="poster-shell__blob poster-shell__blob--one" />
      <div className="poster-shell__blob poster-shell__blob--two" />
      <div className="poster-shell__blob poster-shell__blob--three" />
      <div className="poster-frame motion-page-fade">
        <header className="poster-topbar">
          <div className="poster-brand">
            <span className="poster-brand__mark" aria-hidden="true" />
            <span>Ростелеком</span>
          </div>
          <nav className="poster-actions" aria-label="Авторизация">
            <NavLink
              to={routes.login}
              className={({ isActive }) =>
                isActive ? 'poster-action poster-action--active' : 'poster-action'
              }
            >
              Вход
            </NavLink>
            <NavLink
              to={routes.register}
              className={({ isActive }) =>
                isActive ? 'poster-action poster-action--active' : 'poster-action'
              }
            >
              Регистрация
            </NavLink>
            <NavLink
              to={routes.support}
              className={({ isActive }) =>
                isActive ? 'poster-action poster-action--active' : 'poster-action'
              }
            >
              Поддержка
            </NavLink>
          </nav>
        </header>

        <section className="poster-hero">
          <div className="poster-hero__copy">
            <p className="poster-hero__eyebrow">Корпоративный цифровой пропуск</p>
            <h1>ТОЧКА ВХОДА</h1>
            <p>
              Frontend-only MVP цифрового пропуска сотрудника в визуальном стиле
              Ростелеком с отдельной user/admin зонами, заявками на регистрацию и
              mock onboarding flow.
            </p>
          </div>
          <div className="poster-hero__panel">
            <Outlet />
          </div>
        </section>

        <div className="poster-pedestal">
          <span>Сгенерировать QR-code</span>
          <div className="poster-pedestal__badge">QR</div>
        </div>
      </div>
    </main>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to={routes.login} replace /> },
          { path: 'auth/login', element: <LoginPage /> },
          { path: 'auth/register', element: <RegisterPage /> },
          { path: 'auth/register/success', element: <RegisterSuccessPage /> },
        ],
      },
      { path: 'admin/login', element: <AdminLoginPage /> },
    ],
  },
  { path: '/support', element: <SupportPage /> },
  { path: '/support/success', element: <SupportSuccessPage /> },
  {
    path: '/',
    element: <UserRouteGuard />,
    children: [
      {
        element: <UserShell />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'pass', element: <PassPage /> },
          { path: 'pass/qr', element: <QrGenerationPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminRouteGuard />,
    children: [
      {
        element: <AdminShell />,
        children: [
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'employees', element: <AdminEmployeesPage /> },
          { path: 'employees/:employeeId', element: <AdminEmployeeDetailsPage /> },
          { path: 'onboarding', element: <AdminOnboardingPage /> },
        ],
      },
    ],
  },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
