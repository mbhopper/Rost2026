import { QrCode, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { QrSessionPanel } from '../../features/qr-session/QrSessionPanel';
import { Card } from '../../shared/ui/card/Card';

export function DashboardPage() {
  const user = useAppStore((state) => state.user);

  return (
    <div className="poster-page">
      <div className="poster-page__copy poster-page__copy--centered">
        <p className="poster-page__eyebrow">Главный экран сотрудника</p>
        <h1>ТОЧКА ВХОДА</h1>
        <h2 className="poster-page__headline">{user ? `${user.firstName}, ваш цифровой пропуск готов.` : 'Цифровой пропуск сотрудника'}</h2>
        <p>
          {user
            ? `${user.firstName}, здесь начинается проходной сценарий: статус пропуска, QR и защищённый показ.`
            : 'Цифровой пропуск сотрудника.'}
        </p>
      </div>

      <div className="poster-dashboard-grid">
        <Card className="poster-stat-card">
          <span><ShieldCheck size={14} /> Статус доступа</span>
          <strong>Готов к проходу</strong>
          <p>Покажите QR-код сотруднику охраны непосредственно перед турникетом.</p>
        </Card>
        <Card className="poster-stat-card poster-stat-card--accent">
          <span><QrCode size={14} /> Secure QR mode</span>
          <strong>Best-effort защита</strong>
          <p>Маскирование при blur, watermark и авто-скрытие при бездействии.</p>
        </Card>
      </div>

      <div className="poster-pedestal poster-pedestal--live">
        <span>Сгенерировать QR-code</span>
        <QrSessionPanel compact />
      </div>
    </div>
  );
}
