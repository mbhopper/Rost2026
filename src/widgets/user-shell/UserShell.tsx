import { Outlet } from 'react-router-dom';
import { Header } from '../header/Header';

export function UserShell() {
  return (
    <div className="app-shell app-shell--user">
      <div className="ambient ambient--left" />
      <div className="ambient ambient--right" />
      <div className="ambient ambient--center" />
      <div className="ambient ambient--bottom" />
      <div className="app-shell__inner">
        <Header />
        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
