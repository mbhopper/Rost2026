import { ShieldCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { routes } from '../../../shared/config/routes';
import { getRequestIdFromSearchParams } from '../../../shared/lib/requestId';

export function RegisterSuccessPage() {
  const [searchParams] = useSearchParams();
  const requestId = getRequestIdFromSearchParams(searchParams);

  return (
    <section className="rt-screen rt-screen--success motion-page-fade">
      <div className="rt-success-card motion-rise-in">
        <div className="rt-success-card__icon">
          <ShieldCheck size={56} />
        </div>
        <h1>ЗАЯВКА НА РЕГИСТРАЦИЮ ОТПРАВЛЕНА</h1>
        {requestId ? <p>Номер заявки: {requestId}</p> : null}
      </div>
      <div className="rt-pedestal rt-pedestal--back">
        <span>НАЗАД НА ГЛАВНУЮ</span>
        <Link
          to={routes.root}
          className="rt-pedestal__badge rt-pedestal__badge--back"
        >
          ↩
        </Link>
      </div>
    </section>
  );
}
