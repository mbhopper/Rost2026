import { format, formatDistanceToNow } from 'date-fns';
import { BellRing, Clock3, QrCode, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { QrSession } from '../../entities/qr/model';
import type { QrScreenState } from '../../features/qr-session/model';
import { Card } from '../../shared/ui/card/Card';

interface QrViewerProps {
  isScreenMasked: boolean;
  remainingSeconds: number;
  session: QrSession | null;
  state: QrScreenState;
}

const stateMeta: Record<
  QrScreenState,
  {
    description: string;
    icon: typeof QrCode;
    label: string;
    tone: string;
  }
> = {
  inactive: {
    label: 'Не сгенерирован',
    description: 'Сгенерируйте mock QR перед проходом через турникет.',
    icon: QrCode,
    tone: 'text-slate-300',
  },
  active: {
    label: 'Активен',
    description: 'Код готов к использованию и обновляется по TTL.',
    icon: ShieldCheck,
    tone: 'text-emerald-300',
  },
  expired: {
    label: 'Истёк',
    description: 'Срок жизни QR-сессии закончился, нужен новый код.',
    icon: Clock3,
    tone: 'text-amber-300',
  },
  scanned: {
    label: 'Использован',
    description: 'Mock/demo: код был помечен как отсканированный.',
    icon: Ticket,
    tone: 'text-cyan-300',
  },
  regenerating: {
    label: 'Регенерируется',
    description: 'Готовим новый mock QR-код с обновлённым sessionId.',
    icon: BellRing,
    tone: 'text-violet-300',
  },
  blocked: {
    label: 'Заблокирован',
    description: 'Сессия отозвана и больше не должна приниматься.',
    icon: UserRound,
    tone: 'text-rose-300',
  },
  unavailable: {
    label: 'Недоступен',
    description: 'Нет активного пропуска или пользователь не авторизован.',
    icon: BellRing,
    tone: 'text-slate-400',
  },
};

export function QrViewer({
  isScreenMasked,
  remainingSeconds,
  session,
  state,
}: QrViewerProps) {
  const meta = stateMeta[state];
  const StateIcon = meta.icon;
  const createdAt = session ? new Date(session.createdAt) : null;
  const expiresAt = session ? new Date(session.expiresAt) : null;
  const statusValue = state === 'active' ? `${remainingSeconds} сек.` : '—';

  return (
    <Card className="space-y-5" onContextMenu={(event) => event.preventDefault()}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Live access token</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">QR для турникета и охраны</h2>
          <p className="mt-2 text-sm text-slate-400">{meta.description}</p>
        </div>
        <div className={`rounded-2xl border border-white/10 bg-white/5 p-3 ${meta.tone}`}>
          <StateIcon size={20} />
        </div>
      </div>

      <div className="relative grid place-items-center overflow-hidden rounded-[28px] border border-white/10 bg-white p-5 shadow-soft-sm">
        {state === 'active' || state === 'scanned' || state === 'expired' || state === 'blocked' || state === 'regenerating' ? (
          <QRCodeSVG value={session?.qrValue ?? 'qr-unavailable'} size={190} />
        ) : (
          <div className="flex h-[190px] w-[190px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center text-slate-400">
            <QrCode size={36} />
            <p className="mt-3 max-w-[140px] text-sm">QR-код появится после генерации mock сессии.</p>
          </div>
        )}

        {state !== 'active' ? (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/65 text-center text-white backdrop-blur-[2px]">
            <div className="space-y-2 px-6">
              <StateIcon className={state === 'regenerating' ? 'animate-pulse' : undefined} size={26} />
              <p className="text-base font-semibold">{meta.label}</p>
              <p className="text-xs text-slate-300">{meta.description}</p>
            </div>
          </div>
        ) : null}

        {isScreenMasked ? (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/85 px-6 text-center text-white backdrop-blur-md">
            <div className="space-y-3">
              <BellRing className="mx-auto" size={28} />
              <p className="text-base font-semibold">Экран скрыт</p>
              <p className="text-xs text-slate-300">
                Best-effort защита: экран маскируется при потере фокуса или visibilitychange.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 text-sm text-slate-300">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">
          <span className="text-slate-500">Статус</span>
          <strong className={`font-semibold ${meta.tone}`}>{meta.label}</strong>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500"><Clock3 size={14} /> TTL / истекает</div>
            <strong className="mt-2 block text-white">
              {session && expiresAt
                ? `${format(expiresAt, 'HH:mm:ss')} · ${state === 'active' ? formatDistanceToNow(expiresAt) : meta.label}`
                : '—'}
            </strong>
            <p className="mt-1 text-xs text-slate-500">
              {createdAt ? `Создана ${format(createdAt, 'HH:mm:ss')}` : 'Сессия ещё не создана'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500"><ShieldCheck size={14} /> Сессия доступа</div>
            <strong className="mt-2 block text-white">{session ? `${session.sessionId} · ${statusValue}` : 'Ожидаем запуск'}</strong>
            <p className="mt-1 break-all text-xs text-slate-500">
              {session ? session.qrValue : 'Mock payload будет включать employeeId, passId, sessionId и signature.'}
            </p>
          </div>
        </div>
      </div>

      <p className="rounded-2xl border border-white/8 bg-slate-950/30 px-4 py-3 text-xs leading-5 text-slate-500">
        Полноценная защита от скриншотов невозможна в браузере: для hard-block нужен native-shell уровень ОС.
      </p>
    </Card>
  );
}
