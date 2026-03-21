import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { routes } from '../../shared/config/routes';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';

function getRequestIdFromHash() {
  if (typeof window === 'undefined') {
    return null;
  }

  return new URLSearchParams(window.location.hash.split('?')[1] ?? '').get(
    'requestId',
  );
}

export function SupportSuccessPage() {
  const authStatus = useAppStore((state) => state.authStatus);
  const currentRole = useAppStore((state) => state.currentRole);
  const requestId = getRequestIdFromHash();

  return (
    <main className="auth-shell auth-shell--standalone auth-shell--success">
      <div className="poster-shell__blob poster-shell__blob--one" />
      <div className="poster-shell__blob poster-shell__blob--two" />
      <div className="poster-shell__blob poster-shell__blob--three" />

      <div className="auth-shell__content auth-shell__content--success auth-shell__content--centered motion-page-fade">
        <header className="poster-topbar auth-shell__topbar">
          <div className="poster-brand">
            <span className="poster-brand__mark" aria-hidden="true" />
            <span>Ростелеком</span>
          </div>
        </header>

        <section className="auth-stage auth-stage--success">
          <div className="auth-stage__panel auth-stage__panel--centered">
            <Card className="status-card status-card--poster status-card--auth motion-rise-in">
              <div className="success-orb">
                <ShieldCheck size={44} />
              </div>
              <h1>Заявка в службу поддержки отправлена</h1>
              <p>
                Оператор увидит обращение в очереди.{' '}
                {requestId ? `Номер: ${requestId}.` : ''}
              </p>
              <div className="status-card__actions">
                <Link
                  to={
                    authStatus === 'authenticated'
                      ? currentRole === 'admin'
                        ? routes.adminDashboard
                        : routes.dashboard
                      : routes.login
                  }
                >
                  <Button>Назад</Button>
                </Link>
                <Link to={routes.support}>
                  <Button variant="secondary">Ещё обращение</Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
