import { BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';
import { routes } from '../../shared/config/routes';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';

export function UnauthorizedPage() {
  return (
    <div className="page-center">
      <Card className="status-card">
        <div className="status-card__icon"><BellRing size={20} /></div>
        <h1>Недостаточно прав доступа</h1>
        <p>
          Пользовательская и административная зоны разделены. Для продолжения войдите
          под аккаунтом с нужной ролью.
        </p>
        <div className="status-card__actions">
          <Link to={routes.login}><Button>Войти как сотрудник</Button></Link>
          <Link to={routes.adminLogin}><Button variant="secondary">Admin login</Button></Link>
        </div>
      </Card>
    </div>
  );
}
