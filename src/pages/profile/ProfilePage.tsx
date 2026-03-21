import { ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { ProfileDetails } from '../../features/profile/ProfileDetails';
import { Card } from '../../shared/ui/card/Card';

export function ProfilePage() {
  const user = useAppStore((state) => state.user);
  const passes = useAppStore((state) => state.passes);
  const activePasses = passes.filter((pass) => pass.status === 'active' && !pass.isBlocked).length;

  return (
    <section className="space-y-6">
      <Card className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
          <ShieldCheck size={14} /> Профиль сотрудника
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {user ? `${user.firstName}, ваши данные и доступы синхронизированы.` : 'Карточка сотрудника'}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-400">
            Здесь собраны основные идентификационные данные, статусы аккаунта и пропуска, а также системная информация по последним входам и активным сессиям.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/8 bg-slate-950/30 p-5">
            <div className="flex items-center gap-2 text-sm text-cyan-300">
              <UserRound size={16} /> Отдел
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">{user?.department ?? '—'}</div>
          </div>
          <div className="rounded-3xl border border-white/8 bg-slate-950/30 p-5">
            <div className="flex items-center gap-2 text-sm text-cyan-300">
              <Ticket size={16} /> Активные пропуска
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">{activePasses}</div>
          </div>
          <div className="rounded-3xl border border-white/8 bg-slate-950/30 p-5">
            <div className="flex items-center gap-2 text-sm text-cyan-300">
              <ShieldCheck size={16} /> ID сотрудника
            </div>
            <div className="secure-sensitive mt-2 text-2xl font-semibold text-white">{user?.employeeId ?? '—'}</div>
          </div>
        </div>
      </Card>
      <ProfileDetails />
    </section>
  );
}
