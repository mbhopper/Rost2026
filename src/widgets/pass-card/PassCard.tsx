import { ShieldCheck, UserRound } from 'lucide-react';
import type { DigitalPass } from '../../entities/pass/model';
import type { UserProfile } from '../../entities/user/model';
import { Card } from '../../shared/ui/card/Card';

interface PassCardProps {
  pass: DigitalPass;
  user?: UserProfile | null;
}

export function PassCard({ pass, user }: PassCardProps) {
  return (
    <Card className="entry-card">
      <div className="entry-card__avatar">
        {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.fullName} /> : <UserRound size={40} />}
      </div>
      <h2>{user?.fullName ?? 'Фамилия Имя Отчество'}</h2>
      <p>{user?.position ?? 'Должность'} · {user?.department ?? 'Подразделение'}</p>
      <div className="entry-card__status">
        <span><ShieldCheck size={14} /> {pass.status}</span>
        <strong>{pass.facilityName}</strong>
      </div>
    </Card>
  );
}
