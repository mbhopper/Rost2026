import { LogOut, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { routes } from '../../shared/config/routes';

export function Header() {
  const logout = useAppStore((state) => state.logout);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate(routes.login);
  };

  return (
    <header className="rt-topbar">
      <div className="poster-brand rt-topbar__brand">
        <span className="poster-brand__mark" aria-hidden="true" />
        <span>Ростелеком</span>
      </div>
      <div className="rt-topbar__actions" aria-label="Навигация пользователя">
        <button
          type="button"
          className="rt-topbar__icon rt-topbar__icon--button"
          onClick={() => void onLogout()}
        >
          <LogOut size={14} />
        </button>
        <Link to={routes.profile} className="poster-action">
          <UserRound size={14} /> Профиль
        </Link>
      </div>
    </header>
  );
}
