import { ShieldCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { routes } from '../../shared/config/routes';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';

export function SupportSuccessPage() {
  const authStatus = useAppStore((state) => state.authStatus);
  const currentRole = useAppStore((state) => state.currentRole);
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');

  return (
    <main className="poster-shell poster-shell--auth poster-shell--standalone">
      <div className="poster-shell__blob poster-shell__blob--one" />
      <div className="poster-shell__blob poster-shell__blob--two" />
      <div className="poster-shell__blob poster-shell__blob--three" />
      <div className="poster-frame motion-page-fade poster-frame--centered">
        <header className="poster-topbar">
          <div className="poster-brand">
            <span className="poster-brand__mark" aria-hidden="true" />
            <span>Ростелеком</span>
          </div>
        </header>

        <Card className="status-card status-card--poster motion-rise-in">
          <div className="success-orb">
            <ShieldCheck size={44} />
          </div>
          <h1>Заявка в службу поддержки отправлена</h1>
          <p>
            Оператор увидит обращение в очереди. {requestId ? `Номер: ${requestId}.` : ''}
          </p>
          <div className="status-card__actions">
            <Link to={authStatus === 'authenticated' ? (currentRole === 'admin' ? routes.adminDashboard : routes.dashboard) : routes.login}><Button>Назад</Button></Link>
            <Link to={routes.support}><Button variant="secondary">Ещё обращение</Button></Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
