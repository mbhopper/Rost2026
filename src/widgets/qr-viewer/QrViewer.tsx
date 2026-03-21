import { format, formatDistanceToNow } from 'date-fns';
import { Clock3, QrCode, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { QrSession } from '../../entities/qr/model';
import { Card } from '../../shared/ui/card/Card';

interface QrViewerProps {
  session: QrSession | null;
}

export function QrViewer({ session }: QrViewerProps) {
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Live access token</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">QR для турникета и охраны</h2>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200">
          <QrCode size={20} />
        </div>
      </div>
      <div className="grid place-items-center rounded-[28px] border border-white/10 bg-white p-5 shadow-soft-sm">
        {session ? <QRCodeSVG value={session.code} size={190} /> : <div className="h-[190px] w-[190px] animate-pulse rounded-3xl bg-slate-200" />}
      </div>
      <div className="grid gap-3 text-sm text-slate-300">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">
          <span className="text-slate-500">Код</span>
          <strong className="font-semibold text-white">{session?.code ?? 'Генерируем…'}</strong>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500"><Clock3 size={14} /> Истекает</div>
            <strong className="mt-2 block text-white">{session ? `${format(session.expiresAt, 'HH:mm')} · ${formatDistanceToNow(session.expiresAt, { addSuffix: true })}` : '--:--'}</strong>
          </div>
          <div className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500"><ShieldCheck size={14} /> Точка доступа</div>
            <strong className="mt-2 block text-white">{session?.location ?? 'Ожидаем данные'}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
}
