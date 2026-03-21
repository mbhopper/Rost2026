import { LogOut, Settings, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { primaryNavigation, routes } from '../../shared/config/routes';
import { cn } from '../../shared/lib/cn';
import { Button } from '../../shared/ui/button/Button';

const icons = {
  [routes.pass]: Ticket,
  [routes.profile]: UserRound,
  [routes.settings]: Settings,
};

const statusLabels = {
  active: 'Активный сотрудник',
  on_leave: 'В отпуске',
  suspended: 'Доступ ограничен',
  terminated: 'Доступ закрыт',
} as const;

export function Header() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate(routes.login);
  };

  return (
    <header className="rounded-[32px] border border-white/10 bg-panel px-5 py-4 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-white shadow-soft-sm">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              FuturePass Access
            </p>
            <p className="text-sm text-slate-400">
              MVP кабинета сотрудника и гостевого доступа
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Primary">
          {primaryNavigation.map((item) => {
            const Icon = icons[item.href];
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition',
                    isActive
                      ? 'bg-white text-slate-950'
                      : 'text-slate-400 hover:bg-white/8 hover:text-white',
                  )
                }
                title={item.description}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/8 bg-slate-950/30 px-4 py-3 lg:min-w-[280px]">
          <div>
            <p className="text-sm font-semibold text-white">
              {user?.fullName ?? 'Гость'}
            </p>
            <p className="text-sm text-slate-400">
              {user ? statusLabels[user.status] : 'Доступ не выдан'}
            </p>
          </div>
          <Button variant="secondary" onClick={() => void onLogout()}>
            <LogOut size={16} />
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
}
