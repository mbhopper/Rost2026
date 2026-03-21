import { Clock3, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';

export function ProfileDetails() {
  const user = useAppStore((state) => state.user);
  const passes = useAppStore((state) => state.passes);
  const primaryPass = passes.find((item) => !item.isBlocked) ?? passes[0] ?? null;

  return (
    <div className="profile-scene">
      <Card className="profile-scene__identity">
        <div className="profile-scene__avatar">
          {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.fullName} /> : <UserRound size={44} />}
        </div>
        <h2>{user?.fullName ?? 'Фамилия Имя Отчество'}</h2>
      </Card>

      <Card className="profile-scene__stats">
        <h3>Статистика</h3>
        <div className="profile-scene__stats-grid">
          <div><span><Clock3 size={14} /> Время работы</span><strong>08:32:14</strong></div>
          <div><span><ShieldCheck size={14} /> Последний вход</span><strong>Сегодня · 08:47</strong></div>
          <div><span><Ticket size={14} /> Последний выход</span><strong>Вчера · 19:06</strong></div>
          <div><span><UserRound size={14} /> Статус пропуска</span><strong>{primaryPass?.status ?? 'Не назначен'}</strong></div>
        </div>
      </Card>
    </div>
  );
}
