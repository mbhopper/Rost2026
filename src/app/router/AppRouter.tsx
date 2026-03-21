import { Navigate, Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import { useAppStore } from '../store';
import { LoginPage } from '../../pages/auth/login/LoginPage';
import { RegisterPage } from '../../pages/auth/register/RegisterPage';
import { NotFoundPage } from '../../pages/not-found/NotFoundPage';
import { PassPage } from '../../pages/pass/PassPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';
import { SettingsPage } from '../../pages/settings/SettingsPage';
import { Header } from '../../widgets/header/Header';
import { defaultPrivateRoute, routes } from '../../shared/config/routes';

function GuestGuard() {
  const authStatus = useAppStore((state) => state.authStatus);

  if (authStatus === 'authenticated') {
    return <Navigate to={defaultPrivateRoute} replace />;
  }

  return <Outlet />;
}

function PrivateGuard() {
  const authStatus = useAppStore((state) => state.authStatus);

  if (authStatus === 'guest') {
    return <Navigate to={routes.login} replace />;
  }

  return <Outlet />;
}

function AuthLayout() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(460px,680px)]">
        <section className="hidden rounded-[36px] border border-white/10 bg-panel p-8 shadow-soft backdrop-blur lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">FuturePass</p>
            <h2 className="text-5xl font-semibold leading-tight text-white">Единый MVP для пропуска, QR и настроек доступа.</h2>
            <p className="max-w-xl text-base leading-7 text-slate-400">Мы сохранили FSD-структуру pages / features / widgets / entities / shared, но наполнили её целевым сценарием цифрового пропуска сотрудника.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/8 bg-slate-950/30 p-5"><div className="text-3xl font-semibold text-white">3</div><p className="mt-2 text-sm text-slate-400">приватных сценария</p></div>
            <div className="rounded-3xl border border-white/8 bg-slate-950/30 p-5"><div className="text-3xl font-semibold text-white">10m</div><p className="mt-2 text-sm text-slate-400">TTL для QR-сессии</p></div>
            <div className="rounded-3xl border border-white/8 bg-slate-950/30 p-5"><div className="text-3xl font-semibold text-white">Hash</div><p className="mt-2 text-sm text-slate-400">router без сервера</p></div>
          </div>
        </section>
        <div className="flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

function PrivateLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-96px] top-24 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-[100px]" />
      <div className="pointer-events-none absolute right-[-64px] top-56 h-64 w-64 rounded-full bg-cyan-400/25 blur-[100px]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-6">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to={routes.login} replace /> },
          { path: 'auth/login', element: <LoginPage /> },
          { path: 'auth/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <PrivateGuard />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: 'pass', element: <PassPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
