import { BellRing, QrCode, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';

const primaryFields = [
  { key: 'fullName', label: 'ФИО' },
  { key: 'department', label: 'Отдел' },
  { key: 'position', label: 'Должность' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Телефон' },
  { key: 'employeeId', label: 'Табельный номер' },
] as const;

export function ProfileDetails() {
  const user = useAppStore((state) => state.user);
  const passes = useAppStore((state) => state.passes);
  const primaryPass = passes.find((item) => !item.isBlocked) ?? passes[0] ?? null;

  return (
    <div className="dashboard-grid">
      <Card className="panel-card">
        <div className="pass-card__header">
          <div className="pass-card__identity">
            <div className="pass-card__avatar">
              {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.fullName} /> : <UserRound size={32} />}
            </div>
            <div>
              <p className="section-heading__eyebrow">Profile summary</p>
              <h2>{user?.fullName ?? '—'}</h2>
              <p>{user?.position ?? '—'} · {user?.department ?? '—'}</p>
            </div>
          </div>
        </div>
        <div className="details-grid">
          {primaryFields.map((field) => (
            <article key={field.key} className="detail-card">
              <span>{field.label}</span>
              <strong>{user?.[field.key] ?? '—'}</strong>
            </article>
          ))}
        </div>
      </Card>
      <Card className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">System feed</p>
            <h2>Сессии и активности</h2>
          </div>
        </div>
        <div className="timeline-list">
          <article><strong><ShieldCheck size={14} /> Аккаунт</strong><p>{user?.status ?? 'unknown'}</p></article>
          <article><strong><Ticket size={14} /> Пропуск</strong><p>{primaryPass?.status ?? 'not_assigned'} · {primaryPass?.facilityName ?? '—'}</p></article>
          <article><strong><QrCode size={14} /> QR policy</strong><p>Скрывать QR при blur, скрытии вкладки и бездействии.</p></article>
          <article><strong><BellRing size={14} /> Backend-ready</strong><p>Локальные mock adapters можно заменить API-клиентом без переписывания UI-слоя.</p></article>
        </div>
      </Card>
    </div>
  );
}
