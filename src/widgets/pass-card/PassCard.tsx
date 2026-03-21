import { format } from 'date-fns';
import { Clock3, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import type { DigitalPass } from '../../entities/pass/model';
import { cn } from '../../shared/lib/cn';
import { Card } from '../../shared/ui/card/Card';

interface PassCardProps {
  pass: DigitalPass;
}

const statusClasses: Record<DigitalPass['status'], string> = {
  active: 'bg-emerald-400/15 text-emerald-300',
  pending: 'bg-amber-400/15 text-amber-300',
  expired: 'bg-rose-400/15 text-rose-300',
  revoked: 'bg-slate-400/15 text-slate-300',
  blocked: 'bg-rose-500/15 text-rose-200',
};

const statusLabels: Record<DigitalPass['status'], string> = {
  active: 'Активен',
  pending: 'Ожидает активации',
  expired: 'Истёк',
  revoked: 'Отозван',
  blocked: 'Заблокирован',
};

export function PassCard({ pass }: PassCardProps) {
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]', statusClasses[pass.status])}>
            {statusLabels[pass.status]}
          </span>
          <div>
            <h3 className="text-xl font-semibold text-white">{pass.facilityName}</h3>
            <p className="mt-1 text-sm text-slate-400">Пропуск #{pass.passId}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
          <Ticket size={20} />
        </div>
      </div>
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
          <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><ShieldCheck size={14} />Уровень доступа</dt>
          <dd className="mt-2 text-sm font-semibold text-slate-100">{pass.accessLevel}</dd>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
          <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><UserRound size={14} />Сотрудник</dt>
          <dd className="mt-2 text-sm font-semibold text-slate-100">{pass.employeeId}</dd>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
          <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><Ticket size={14} />Статус карты</dt>
          <dd className="mt-2 text-sm font-semibold text-slate-100">{pass.isBlocked ? 'Заблокирована' : 'Доступна для прохода'}</dd>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
          <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><Clock3 size={14} />Действует до</dt>
          <dd className="mt-2 text-sm font-semibold text-slate-100">{format(pass.expiresAt, 'dd MMM yyyy')}</dd>
          <p className="mt-1 text-xs text-slate-500">Выдан {format(pass.issuedAt, 'dd MMM yyyy')}</p>
        </div>
      </dl>
    </Card>
  );
}
