import { ShieldCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';

export function RegisterSuccessPage() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');

  return (
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
        <Link to={routes.login}><Button>Ко входу</Button></Link>
        <Link to={routes.support}><Button variant="secondary">Связаться с поддержкой</Button></Link>
      </div>
    </Card>
  );
}
