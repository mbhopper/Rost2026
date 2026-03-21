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
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate(routes.login);
  };

  return (
    <header className="poster-topbar poster-topbar--private">
      <div className="poster-brand">
        <span className="poster-brand__mark" aria-hidden="true" />
        <span>Ростелеком</span>
      </div>
      <nav className="poster-actions poster-actions--private" aria-label="Основная навигация">
        {primaryNavigation.map((item) => {
          const Icon = icons[item.href];
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn('poster-action poster-action--nav', isActive && 'poster-action--active')
              }
              title={item.description}
            >
              <Icon size={14} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="poster-userbox">
        <div className="poster-userbox__avatar">
          <UserRound size={14} />
        </div>
        <div className="poster-userbox__meta">
          <strong>{user?.fullName ?? 'Профиль'}</strong>
          <span>{user?.position ?? 'Сотрудник'}</span>
        </div>
        <Button variant="secondary" onClick={() => void onLogout()}>
          <LogOut size={14} />
          Выход
        </Button>
      </div>
    </header>
  );
}
