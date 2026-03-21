import { BellRing, Clock3, QrCode, ShieldCheck } from 'lucide-react';
import { useQrSessionController } from './model';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';
import { QrViewer } from '../../widgets/qr-viewer/QrViewer';

const tips = [
  'TTL mock QR-сессии ограничен 5 минутами, после чего код автоматически истечёт.',
  'После reload активная mock-сессия восстанавливается из sessionStorage с пересчётом оставшегося TTL.',
  'Demo scan и revoke используются только для UX-проверки состояний scanned / blocked.',
];

export function QrSessionPanel() {
  const {
    activePass,
    generate,
    isScreenMasked,
    qrSession,
    regenerate,
    remainingSeconds,
    revoke,
    scanDemo,
    state,
  } = useQrSessionController();

  const canGenerate = state === 'inactive';
  const canRegenerate = state === 'active' || state === 'expired' || state === 'scanned';
  const canDemoScan = state === 'active';
  const canRevoke = state === 'active' || state === 'expired' || state === 'scanned';

  return (
    <div className="space-y-6">
      <QrViewer
        isScreenMasked={isScreenMasked}
        remainingSeconds={remainingSeconds}
        session={qrSession}
        state={state}
      />
      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
          <BellRing size={14} /> Session tips
        </div>
        <ul className="space-y-3 text-sm leading-6 text-slate-400">
          {tips.map((item) => (
            <li key={item} className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">{item}</li>
          ))}
        </ul>

        <div className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3 text-sm text-slate-300">
          <p className="font-semibold text-white">Активный пропуск для mock QR</p>
          <p className="mt-1 text-slate-400">
            {activePass
              ? `${activePass.passId} · ${activePass.facilityName}`
              : 'Нет доступного активного пропуска — QR недоступен.'}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Button variant="primary" onClick={() => void generate()} disabled={!canGenerate}>
            <QrCode size={16} /> Сгенерировать QR
          </Button>
          <Button variant="ghost" onClick={() => void regenerate()} disabled={!canRegenerate}>
            <Clock3 size={16} /> Обновить QR
          </Button>
          <Button variant="secondary" onClick={() => void scanDemo()} disabled={!canDemoScan}>
            <ShieldCheck size={16} /> Demo: сканировать
          </Button>
          <Button variant="secondary" onClick={() => void revoke()} disabled={!canRevoke}>
            <BellRing size={16} /> Mock: revoke
          </Button>
        </div>
      </Card>
    </div>
  );
}
