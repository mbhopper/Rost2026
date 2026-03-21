import { ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { appContent } from '../../shared/constants/content';
import { Card } from '../../shared/ui/card/Card';
import { PassCard } from '../../widgets/pass-card/PassCard';

export function PassSummary() {
  const passes = useAppStore((state) => state.passes);
  const user = useAppStore((state) => state.user);
  const content = appContent.passSummary;

  return (
    <section className="space-y-6">
      <Card className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
          <ShieldCheck size={14} /> {content.eyebrow}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {user ? content.titleWithName(user.firstName) : content.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-400">
            {content.description}
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
