import { LogOut, ShieldCheck, Ticket } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { adminNavigation, routes } from '../../shared/config/routes';
import { cn } from '../../shared/lib/cn';
import { Button } from '../../shared/ui/button/Button';

const icons = {
  [routes.adminDashboard]: ShieldCheck,
  [routes.adminEmployees]: Ticket,
};

export function AdminShell() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(routes.adminLogin);
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo"><span className="poster-brand__mark" aria-hidden="true" /></div>
          <div>
            <strong>Security Console</strong>
            <p>Отдельный admin namespace</p>
          </div>
        </div>
        <nav className="admin-sidebar__nav" aria-label="Навигация администратора">
          {adminNavigation.map((item) => {
            const Icon = icons[item.href];
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn('admin-nav-link', isActive && 'admin-nav-link--active')
                }
              >
                <Icon size={16} />
                <span>
                  {item.label}
                  <small>{item.description}</small>
                </span>
              </NavLink>
            );
          })}
        </nav>
        <div className="admin-sidebar__footer">
          <p>{user?.fullName ?? 'Администратор'}</p>
          <span>{user?.position ?? 'Security operator'}</span>
          <Button variant="secondary" onClick={() => void handleLogout()}>
            <LogOut size={16} /> Выйти
          </Button>
        </div>
      </aside>
      <main className="admin-shell__content">
        <Outlet />
      </main>
    </div>
  );
}
