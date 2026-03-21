import {
  Navigate,
  Outlet,
  RouterProvider,
  createHashRouter,
} from 'react-router-dom';
import { USER_ROLES } from '../../entities/user/model';
import { LoginPage } from '../../pages/auth/login/LoginPage';
import { RegisterPage } from '../../pages/auth/register/RegisterPage';
import { AdminDashboardPage } from '../../pages/admin/dashboard/AdminDashboardPage';
import { AdminEmployeeDetailsPage } from '../../pages/admin/employee-details/AdminEmployeeDetailsPage';
import { AdminEmployeesPage } from '../../pages/admin/employees/AdminEmployeesPage';
import { AdminLoginPage } from '../../pages/admin/login/AdminLoginPage';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { NotFoundPage } from '../../pages/not-found/NotFoundPage';
import { PassPage } from '../../pages/pass/PassPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';
import { SettingsPage } from '../../pages/settings/SettingsPage';
import { UnauthorizedPage } from '../../pages/unauthorized/UnauthorizedPage';
import { useAppStore } from '../store';
import { defaultAdminRoute, defaultUserRoute, routes } from '../../shared/config/routes';
import { AdminShell } from '../../widgets/admin-shell/AdminShell';
import { UserShell } from '../../widgets/user-shell/UserShell';
import { Card } from '../../shared/ui/card/Card';

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
    <main className="auth-shell">
      <section className="auth-shell__promo">
        <div className="auth-shell__copy">
          <p className="section-heading__eyebrow">Корпоративный цифровой пропуск</p>
          <h2>Мобильный доступ, QR-проход и единый UX в стиле Ростелеком.</h2>
          <p>
            Public auth zone отделена от приватных user routes. Backend появится позже,
            а текущий UI уже работает через mock adapters.
          </p>
        </div>
        <div className="hero-card__metrics">
          <article><span>Зоны</span><strong>Public · User · Admin</strong></article>
          <article><span>Secure mode</span><strong>Best-effort</strong></article>
          <article><span>Responsive</span><strong>320 → 1280+</strong></article>
        </div>
      </section>
      <Outlet />
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
        ],
      },
      { path: 'admin/login', element: <AdminLoginPage /> },
    ],
  },
  {
    path: '/',
    element: <UserRouteGuard />,
    children: [
      {
        element: <UserShell />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'pass', element: <PassPage /> },
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
