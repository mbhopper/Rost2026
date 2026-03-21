import { Outlet } from 'react-router-dom';
import { Header } from '../header/Header';

export function UserShell() {
  return (
    <div className="rt-stage-shell rt-stage-shell--private">
      <div className="poster-shell__blob poster-shell__blob--one" />
      <div className="poster-shell__blob poster-shell__blob--two" />
      <div className="poster-shell__blob poster-shell__blob--three" />
      <div className="poster-shell__blob poster-shell__blob--four" />
      <Header />
      <main className="rt-stage-shell__body">
        <Outlet />
      </main>
    </div>
  );
}
