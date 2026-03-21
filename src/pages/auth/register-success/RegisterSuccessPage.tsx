import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';

function getRequestIdFromHash() {
  if (typeof window === 'undefined') {
    return null;
  }

  return new URLSearchParams(window.location.hash.split('?')[1] ?? '').get(
    'requestId',
  );
}

export function RegisterSuccessPage() {
  const requestId = getRequestIdFromHash();

  return (
    <div className="auth-stage__panel auth-stage__panel--centered auth-stage__panel--success">
      <Card className="status-card status-card--poster motion-rise-in">
        <div className="success-orb">
          <ShieldCheck size={44} />
        </div>
        <h1>Заявка на регистрацию отправлена</h1>
        <p>
          Администратор проверит данные, заведёт сотрудника в системе и выпустит
          пропуск. {requestId ? `Номер заявки: ${requestId}.` : ''}
        </p>
        <div className="status-card__actions">
          <Link to={routes.login}>
            <Button>Ко входу</Button>
          </Link>
          <Link to={routes.support}>
            <Button variant="secondary">Связаться с поддержкой</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
