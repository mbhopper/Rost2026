import { BellRing } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';
import { QrViewer } from '../../widgets/qr-viewer/QrViewer';

const tips = [
  'Обновляйте QR перед проходом в турникет, если приложение открыто больше 10 минут.',
  'Для лабораторий и серверных используйте отдельный временный токен только по заявке.',
  'В случае смены устройства заново включите security alerts в настройках профиля.',
];

export function QrSessionPanel() {
  const qrSession = useAppStore((state) => state.qrSession);
  const rotateQrSession = useAppStore((state) => state.rotateQrSession);

  return (
    <div className="space-y-6">
      <QrViewer session={qrSession} />
      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
          <BellRing size={14} /> Session tips
        </div>
        <ul className="space-y-3 text-sm leading-6 text-slate-400">
          {tips.map((item) => (
            <li key={item} className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">{item}</li>
          ))}
        </ul>
        <Button variant="ghost" onClick={() => void rotateQrSession()}>
          Обновить QR-сессию
        </Button>
      </Card>
    </div>
  );
}
