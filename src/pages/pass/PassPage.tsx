import { format } from 'date-fns';
import { BellRing, Clock3, ShieldCheck, Ticket } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { QrSessionPanel } from '../../features/qr-session/QrSessionPanel';
import { Card } from '../../shared/ui/card/Card';
import { PassCard } from '../../widgets/pass-card/PassCard';

export function PassPage() {
  const passes = useAppStore((state) => state.passes);
  const user = useAppStore((state) => state.user);

  const primaryPass =
    passes.find((item) => item.status === 'active' && !item.isBlocked) ??
    passes[0] ??
    null;
  const relatedPasses = primaryPass
    ? passes.filter((item) => item.passId !== primaryPass.passId)
    : [];

  if (!primaryPass) {
    return (
      <Card className="empty-card">
        <h1>Пропуск пока не назначен</h1>
        <p>После подключения backend здесь можно будет показать реальные статусы и доступы сотрудника.</p>
      </Card>
    );
  }

  return (
    <div className="page-stack">
      <Card className="hero-card hero-card--user">
        <div className="hero-card__badge"><ShieldCheck size={14} /> Digital pass</div>
        <div className="hero-card__content">
          <div>
            <h1>{user ? `${user.firstName}, покажите QR на турникете.` : 'Цифровой пропуск'}</h1>
            <p>Экран оптимизирован под смартфоны: крупный QR, контрастная карточка и безопасный режим показа.</p>
          </div>
          <div className="hero-card__metrics">
            <article><span>Площадка</span><strong>{primaryPass.facilityName}</strong></article>
            <article><span>Уровень</span><strong>{primaryPass.accessLevel}</strong></article>
            <article><span>Действует до</span><strong>{format(new Date(primaryPass.expiresAt), 'dd.MM.yyyy')}</strong></article>
          </div>
        </div>
      </Card>
      <div className="dashboard-grid">
        <div className="page-stack">
          <PassCard pass={primaryPass} user={user} />
          <Card className="panel-card">
            <div className="section-heading">
              <div>
                <p className="section-heading__eyebrow">Pass metadata</p>
                <h2>Детали выпуска</h2>
              </div>
            </div>
            <div className="details-grid">
              <article className="detail-card"><span><Ticket size={14} /> Номер</span><strong>{primaryPass.passId}</strong></article>
              <article className="detail-card"><span><Clock3 size={14} /> Выдан</span><strong>{format(new Date(primaryPass.issuedAt), 'dd.MM.yyyy')}</strong></article>
              <article className="detail-card"><span><Clock3 size={14} /> Истекает</span><strong>{format(new Date(primaryPass.expiresAt), 'dd.MM.yyyy')}</strong></article>
              <article className="detail-card"><span><ShieldCheck size={14} /> Режим прохода</span><strong>{primaryPass.isBlocked ? 'Ограничен' : 'Готов к проходу'}</strong></article>
            </div>
            {relatedPasses.length > 0 ? (
              <div className="timeline-list">
                {relatedPasses.map((item) => (
                  <article key={item.passId}>
                    <strong>{item.facilityName}</strong>
                    <p>{item.passId} · {item.accessLevel} · {format(new Date(item.expiresAt), 'dd.MM.yyyy')}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="info-banner"><BellRing size={16} /> Дополнительных пропусков пока нет.</div>
            )}
          </Card>
        </div>
        <QrSessionPanel />
      </div>
    </div>
  );
}
