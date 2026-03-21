import { Clock3, QrCode, ShieldCheck, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { useAppStore } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';
import { QrSessionPanel } from '../../features/qr-session/QrSessionPanel';

export function DashboardPage() {
  const user = useAppStore((state) => state.user);
  const passes = useAppStore((state) => state.passes);
  const qrSession = useAppStore((state) => state.qrSession);

  const primaryPass = passes.find((item) => item.status === 'active' && !item.isBlocked) ?? passes[0] ?? null;

  return (
    <div className="page-stack">
      <Card className="hero-card hero-card--user">
        <div className="hero-card__badge"><QrCode size={14} /> Rostelecom pass</div>
        <div className="hero-card__content">
          <div>
            <h1>{user ? `${user.firstName}, ваш цифровой пропуск готов.` : 'Цифровой пропуск сотрудника'}</h1>
            <p>
              MVP фронтенд подготовлен под будущую интеграцию с backend: auth, профиль,
              QR-сессия и статусы пропуска уже изолированы через mock adapters.
            </p>
          </div>
          <div className="hero-card__metrics">
            <article>
              <span>Сотрудник</span>
              <strong>{user?.employeeId ?? '—'}</strong>
            </article>
            <article>
              <span>Площадка</span>
              <strong>{primaryPass?.facilityName ?? 'Не назначена'}</strong>
            </article>
            <article>
              <span>Обновление</span>
              <strong>{primaryPass ? format(new Date(primaryPass.issuedAt), 'dd.MM.yyyy') : '—'}</strong>
            </article>
          </div>
        </div>
      </Card>

      <section className="stats-grid">
        <Card className="stat-card">
          <span><ShieldCheck size={16} /> Статус пропуска</span>
          <strong>{primaryPass?.status ?? 'not_assigned'}</strong>
          <p>{primaryPass?.isBlocked ? 'Требуется вмешательство администратора.' : 'Пропуск готов для ежедневного прохода.'}</p>
        </Card>
        <Card className="stat-card">
          <span><Ticket size={16} /> Уровень доступа</span>
          <strong>{primaryPass?.accessLevel ?? '—'}</strong>
          <p>Используется на карточке пропуска и в mock admin панели.</p>
        </Card>
        <Card className="stat-card">
          <span><Clock3 size={16} /> QR-сессия</span>
          <strong>{qrSession?.status ?? 'inactive'}</strong>
          <p>{qrSession ? 'Текущее состояние QR синхронизировано в sessionStorage.' : 'Сгенерируйте QR непосредственно перед проходом.'}</p>
        </Card>
      </section>

      <div className="dashboard-grid">
        <Card className="panel-card">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Что нового</p>
              <h2>Сценарий сотрудника</h2>
            </div>
          </div>
          <div className="timeline-list">
            <article>
              <strong>1. Авторизация</strong>
              <p>Публичная auth-зона и приватные user routes разделены роут-гардами.</p>
            </article>
            <article>
              <strong>2. Цифровой пропуск</strong>
              <p>Отдельный pass screen и secure QR-flow c таймером, watermark и авто-маскированием.</p>
            </article>
            <article>
              <strong>3. Настройки</strong>
              <p>Secure mode, тема и локальное сохранение параметров без backend.</p>
            </article>
          </div>
        </Card>
        <QrSessionPanel compact />
      </div>
    </div>
  );
}
