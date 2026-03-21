import { ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';
import { PassCard } from '../../widgets/pass-card/PassCard';

export function PassSummary() {
  const passes = useAppStore((state) => state.passes);
  const user = useAppStore((state) => state.user);

  return (
    <section className="space-y-6">
      <Card className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
          <ShieldCheck size={14} /> Employee access MVP
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{user ? `${user.firstName}, ваши пропуска готовы к использованию.` : 'Цифровой пропуск сотрудника'}</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-400">
            Здесь собраны корпоративные карты доступа, уровень допуска по объектам и срок действия.
            Интерфейс опирается на нормализованную модель сотрудника и пропусков для сценариев ежедневного прохода.
          </p>
        </div>
      </Card>
      <div className="grid gap-4">
        {passes.map((item) => (
          <PassCard key={item.passId} pass={item} />
        ))}
      </div>
    </section>
  );
}
