import { Link } from 'react-router-dom';
import { routes } from '../../../shared/config/routes';

export function EntryLandingPage() {
  return (
    <section className="rt-screen rt-screen--hero motion-page-fade">
      <div className="rt-hero-block motion-entry-title">
        <h1 className="rt-wordmark">
          <span>ТОЧКА</span>
          <span>ВХОДА</span>
        </h1>
      </div>

      <div className="rt-pedestal rt-pedestal--qr">
        <span>СГЕНЕРИРОВАТЬ QR-CODE</span>
        <Link
          to={routes.login}
          className="rt-pedestal__badge"
          aria-label="Перейти ко входу для генерации QR-кода"
        >
          QR
        </Link>
      </div>
    </section>
  );
}
