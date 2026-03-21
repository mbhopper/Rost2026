import { ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { routes } from '../../shared/config/routes';
import { getRequestIdFromLocationSearch } from '../../shared/lib/requestId';

export function SupportSuccessPage() {
  const authStatus = useAppStore((state) => state.authStatus);
  const location = useLocation();
  const requestId = getRequestIdFromLocationSearch(location.search);

  return (
    <main className="rt-stage-shell rt-stage-shell--public">
      <div className="poster-shell__blob poster-shell__blob--one" />
      <div className="poster-shell__blob poster-shell__blob--two" />
      <div className="poster-shell__blob poster-shell__blob--three" />
      <div className="poster-shell__blob poster-shell__blob--four" />
      <header className="rt-topbar">
        <div className="poster-brand rt-topbar__brand">
          <span className="poster-brand__mark" aria-hidden="true" />
          <span>Ростелеком</span>
        </div>
        <div className="rt-topbar__actions">
          {authStatus === 'authenticated' ? (
            <Link to={routes.profile} className="poster-action">
              Профиль
            </Link>
          ) : (
            <>
              <Link to={routes.login} className="poster-action">
                Вход
              </Link>
              <Link to={routes.register} className="poster-action">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </header>
      <section className="rt-screen rt-screen--success motion-page-fade">
        <div className="rt-success-card motion-rise-in">
          <div className="rt-success-card__icon">
            <ShieldCheck size={56} />
          </div>
          <h1>ЗАЯВКА В СЛУЖБУ ПОДДЕРЖКИ ОТПРАВЛЕНА</h1>
          {requestId ? <p>Номер обращения: {requestId}</p> : null}
        </div>
        <div className="rt-pedestal rt-pedestal--back">
          <span>НАЗАД НА ГЛАВНУЮ</span>
          <Link
            to={authStatus === 'authenticated' ? routes.dashboard : routes.root}
            className="rt-pedestal__badge rt-pedestal__badge--back"
          >
            ↩
          </Link>
        </div>
      </section>
    </main>
  );
}
