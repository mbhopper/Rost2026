import { ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';
import { ProfileDetails } from '../../features/profile/ProfileDetails';

export function ProfilePage() {
  const user = useAppStore((state) => state.user);
  const passes = useAppStore((state) => state.passes);
  const activePasses = passes.filter((pass) => pass.status === 'active' && !pass.isBlocked).length;

  return (
    <div className="page-stack">
      <Card className="hero-card hero-card--user">
        <div className="hero-card__badge"><UserRound size={14} /> Employee profile</div>
        <div className="hero-card__content">
          <div>
            <h1>{user ? `${user.firstName}, ваши данные синхронизированы.` : 'Профиль сотрудника'}</h1>
            <p>Карточка сотрудника, статусы аккаунта и системная информация собраны на одном экране.</p>
          </div>
          <div className="hero-card__metrics">
            <article><span>Отдел</span><strong>{user?.department ?? '—'}</strong></article>
            <article><span>Активные пропуска</span><strong>{activePasses}</strong></article>
            <article><span>ID</span><strong>{user?.employeeId ?? '—'}</strong></article>
          </div>
        </div>
      </Card>
      <ProfileDetails />
    </div>
  );
}
