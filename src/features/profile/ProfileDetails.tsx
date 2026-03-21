import { UserRound } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';

export function ProfileDetails() {
  const user = useAppStore((state) => state.user);

  return (
    <Card className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Identity</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{user?.name ?? 'Профиль загружается'}</h1>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
          <UserRound size={20} />
        </div>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="info-tile"><dt>Email</dt><dd>{user?.email ?? '—'}</dd></div>
        <div className="info-tile"><dt>Город</dt><dd>{user?.city ?? '—'}</dd></div>
        <div className="info-tile"><dt>Подразделение</dt><dd>{user?.department ?? '—'}</dd></div>
        <div className="info-tile"><dt>Роль</dt><dd>{user?.position ?? '—'}</dd></div>
        <div className="info-tile"><dt>Уровень доступа</dt><dd>{user?.membershipLevel ?? '—'}</dd></div>
        <div className="info-tile"><dt>ID сотрудника</dt><dd>{user?.id ?? '—'}</dd></div>
      </dl>
    </Card>
  );
}
