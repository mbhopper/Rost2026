import { format } from 'date-fns';
import { Clock3, Ticket } from 'lucide-react';
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
};

export function PassCard({ pass }: PassCardProps) {
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]', statusClasses[pass.status])}>
            {pass.status}
          </span>
          <div>
            <h3 className="text-xl font-semibold text-white">{pass.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{pass.zone}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
          <Ticket size={20} />
        </div>
      </div>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
          <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Формат</dt>
          <dd className="mt-2 text-sm font-semibold text-slate-100">{pass.format}</dd>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
          <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Сессии</dt>
          <dd className="mt-2 text-sm font-semibold text-slate-100">{pass.sessionsLeft} входов</dd>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
          <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500"><Clock3 size={14} />Действует до</dt>
          <dd className="mt-2 text-sm font-semibold text-slate-100">{format(pass.validUntil, 'dd MMM yyyy')}</dd>
        </div>
      </dl>
    </Card>
  );
}
