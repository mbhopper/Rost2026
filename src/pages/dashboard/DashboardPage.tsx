import { Link } from 'react-router-dom';
import { BellRing, QrCode, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { QrSessionPanel } from '../../features/qr-session/QrSessionPanel';
import { routes } from '../../shared/config/routes';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';

export function DashboardPage() {
  const user = useAppStore((state) => state.user);

  return (
    <div className="poster-page motion-page-fade">
      <div className="poster-page__copy poster-page__copy--centered">
        <p className="poster-page__eyebrow">Главный экран сотрудника</p>
        <h1>ТОЧКА ВХОДА</h1>
        <h2 className="poster-page__headline">
          {user ? `${user.firstName}, ваш цифровой пропуск готов.` : 'Цифровой пропуск сотрудника'}
        </h2>
        <p>
          {user
            ? `${user.firstName}, здесь начинается проходной сценарий: статус пропуска, QR и защищённый показ.`
            : 'Цифровой пропуск сотрудника.'}
        </p>
      </div>

      <div className="poster-dashboard-grid">
        <Card className="poster-stat-card motion-rise-in">
          <span><ShieldCheck size={14} /> Статус доступа</span>
          <strong>Готов к проходу</strong>
          <p>Покажите QR-код сотруднику охраны непосредственно перед турникетом.</p>
        </Card>
        <Card className="poster-stat-card poster-stat-card--accent motion-rise-in">
          <span><QrCode size={14} /> Защищённый QR-код</span>
          <strong>Защита экрана</strong>
          <p>QR-код скрывается при переключении вкладки и автоматически маскируется после периода бездействия.</p>
        </Card>
        <Card className="poster-stat-card motion-rise-in">
          <span><BellRing size={14} /> Сервисные обращения</span>
          <strong>Поддержка рядом</strong>
          <p>Если нужен новый доступ или есть сбой на проходе — форма поддержки теперь отдельной страницей.</p>
          <Link to={routes.support}><Button variant="secondary">Открыть поддержку</Button></Link>
        </Card>
      </div>

      <div className="poster-pedestal poster-pedestal--live">
        <span>Сгенерировать QR-код</span>
        <QrSessionPanel compact />
        <Link to={routes.qrGenerate} className="poster-inline-link">Открыть полноэкранный QR</Link>
      </div>
    </div>
  );
}
