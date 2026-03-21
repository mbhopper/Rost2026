import { format } from 'date-fns';
import { Clock3, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import type { DigitalPass } from '../../entities/pass/model';
import type { UserProfile } from '../../entities/user/model';
import { Card } from '../../shared/ui/card/Card';

interface PassCardProps {
  pass: DigitalPass;
  user?: UserProfile | null;
}

export function PassCard({ pass, user }: PassCardProps) {
  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((value) => value?.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="pass-card">
      <div className="pass-card__header">
        <div className="pass-card__identity">
          <div className="pass-card__avatar">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.fullName} /> : initials || <UserRound size={32} />}
          </div>
          <div>
            <p className="section-heading__eyebrow">Employee pass</p>
            <h2>{user?.fullName ?? 'Сотрудник'}</h2>
            <p>{user?.position ?? 'Должность не назначена'} · {user?.department ?? '—'}</p>
          </div>
        </div>
        <span className={`status-pill status-pill--${pass.status}`}>{pass.status}</span>
      </div>
      <div className="details-grid">
        <article className="detail-card"><span><Ticket size={14} /> Пропуск</span><strong>{pass.passId}</strong></article>
        <article className="detail-card"><span><ShieldCheck size={14} /> Доступ</span><strong>{pass.accessLevel}</strong></article>
        <article className="detail-card"><span><Clock3 size={14} /> Выдан</span><strong>{format(new Date(pass.issuedAt), 'dd.MM.yyyy')}</strong></article>
        <article className="detail-card"><span><Clock3 size={14} /> Истекает</span><strong>{format(new Date(pass.expiresAt), 'dd.MM.yyyy')}</strong></article>
      </div>
      <div className="info-banner">
        <div>
          <strong>{pass.facilityName}</strong>
          <p>{pass.isBlocked ? 'Доступ ограничен. Обратитесь в админ-панель.' : 'Готов к проходу через мобильный QR.'}</p>
        </div>
      </div>
    </Card>
  );
}
