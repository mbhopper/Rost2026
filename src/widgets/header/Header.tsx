import {
  LogOut,
  Settings,
  ShieldCheck,
  Ticket,
  UserRound,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { primaryNavigation, routes } from '../../shared/config/routes';
import { cn } from '../../shared/lib/cn';
import { Button } from '../../shared/ui/button/Button';

const icons = {
  [routes.dashboard]: ShieldCheck,
  [routes.pass]: Ticket,
  [routes.profile]: UserRound,
  [routes.settings]: Settings,
};

export function Header() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const demoMode = useAppStore((state) => state.settings.demoMode);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate(routes.login);
  };

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <div className="topbar__logo">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="topbar__title">Ростелеком Pass MVP</p>
          <div className="topbar__subtitle-row">
            <span>Сотрудник · frontend-only этап</span>
            {demoMode ? <span className="demo-badge">mock data</span> : null}
          </div>
        </div>
      </div>
      <nav className="topbar__nav" aria-label="Основная навигация">
        {primaryNavigation.map((item) => {
          const Icon = icons[item.href];
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn('nav-pill', isActive && 'nav-pill--active')
              }
              title={item.description}
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="topbar__account">
        <div>
          <p className="secure-sensitive topbar__account-name">{user?.fullName ?? 'Сотрудник'}</p>
          <p className="topbar__account-meta">{user?.position ?? 'Доступ не назначен'}</p>
        </div>
        <Button variant="secondary" onClick={() => void onLogout()}>
          <LogOut size={16} /> Выйти
        </Button>
      </div>
    </header>
  );
}
