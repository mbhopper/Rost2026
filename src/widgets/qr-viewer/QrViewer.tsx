import { format, formatDistanceToNow } from 'date-fns';
import {
  BellRing,
  Clock3,
  QrCode,
  ShieldCheck,
  Ticket,
  UserRound,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { QrSession } from '../../entities/qr/model';
import type { QrScreenState } from '../../features/qr-session/model';
import { Card } from '../../shared/ui/card/Card';

interface QrViewerProps {
  isScreenMasked: boolean;
  remainingSeconds: number;
  secureViewProps: {
    onContextMenu: (event: { preventDefault: () => void }) => void;
    onDragStart: (event: { preventDefault: () => void }) => void;
    onMouseDown: () => void;
    onTouchStart: () => void;
  };
  session: QrSession | null;
  state: QrScreenState;
  watermarkLabel: string;
}

const stateMeta: Record<
  QrScreenState,
  {
    description: string;
    icon: typeof QrCode;
    label: string;
    toneClass: string;
  }
> = {
  inactive: {
    description: 'Сгенерируйте код только перед турникетом.',
    icon: QrCode,
    label: 'Ожидает генерации',
    toneClass: 'qr-viewer--inactive',
  },
  active: {
    description: 'Код активен и готов к проходу.',
    icon: ShieldCheck,
    label: 'Готов к проходу',
    toneClass: 'qr-viewer--active',
  },
  expired: {
    description: 'Срок действия QR истёк. Сгенерируйте новый код.',
    icon: Clock3,
    label: 'Код истёк',
    toneClass: 'qr-viewer--expired',
  },
  used: {
    description: 'Сессия уже использована на проходе.',
    icon: Ticket,
    label: 'Код использован',
    toneClass: 'qr-viewer--scanned',
  },
  regenerating: {
    description: 'Готовим новую QR-сессию.',
    icon: BellRing,
    label: 'Обновляем QR',
    toneClass: 'qr-viewer--regenerating',
  },
  blocked: {
    description: 'Пропуск заблокирован или отозван администратором.',
    icon: UserRound,
    label: 'Доступ заблокирован',
    toneClass: 'qr-viewer--blocked',
  },
  unavailable: {
    description: 'Нет доступа к пользовательскому пропуску.',
    icon: BellRing,
    label: 'Недоступно',
    toneClass: 'qr-viewer--unavailable',
  },
};

export function QrViewer({
  isScreenMasked,
  remainingSeconds,
  secureViewProps,
  session,
  state,
  watermarkLabel,
}: QrViewerProps) {
  const meta = stateMeta[state];
  const StateIcon = meta.icon;
  const createdAt = session ? new Date(session.createdAt) : null;
  const expiresAt = session ? new Date(session.expiresAt) : null;
  const showQrPreview =
    state === 'active' ||
    state === 'used' ||
    state === 'expired' ||
    state === 'blocked' ||
    state === 'regenerating';

  return (
    <Card className={`qr-viewer-card ${meta.toneClass}`} {...secureViewProps}>
      <div className="qr-viewer-card__header">
        <div>
          <p className="qr-viewer-card__eyebrow">Secure QR mode</p>
          <h3>{state === 'active' ? 'Покажите экран сотруднику охраны' : 'QR screen'}</h3>
          <p className="qr-viewer-card__copy">{meta.description}</p>
        </div>
        <div className="qr-viewer-card__state">
          <StateIcon size={18} />
          <span>{meta.label}</span>
        </div>
      </div>

      <div className="qr-sheet">
        <div className="qr-sheet__watermark" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={`${watermarkLabel}-${index}`}>
              {watermarkLabel} · {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </span>
          ))}
        </div>

        {showQrPreview ? (
          <QRCodeSVG value={session?.qrValue ?? 'qr-unavailable'} size={220} />
        ) : (
          <div className="qr-sheet__placeholder">
            <QrCode size={40} />
            <p>QR появится после генерации сессии.</p>
          </div>
        )}

        {state !== 'active' ? (
          <div className="qr-sheet__overlay">
            <div>
              <StateIcon className={state === 'regenerating' ? 'animate-pulse' : undefined} size={28} />
              <strong>{meta.label}</strong>
              <p>{meta.description}</p>
            </div>
          </div>
        ) : null}

        {isScreenMasked ? (
          <div className="qr-sheet__overlay qr-sheet__overlay--masked">
            <div>
              <BellRing size={28} />
              <strong>Экран скрыт</strong>
              <p>Best-effort защита на web: код скрывается при blur, скрытии вкладки и бездействии.</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="qr-viewer-card__meta-grid">
        <div className="qr-viewer-card__meta-item">
          <span><Clock3 size={14} /> Срок действия</span>
          <strong>
            {session && expiresAt
              ? `${format(expiresAt, 'HH:mm:ss')} · ${state === 'active' ? `${remainingSeconds} сек.` : meta.label}`
              : 'Сессия не создана'}
          </strong>
          <p>{createdAt ? `Создано в ${format(createdAt, 'HH:mm:ss')}` : 'Создайте сессию перед входом.'}</p>
        </div>
        <div className="qr-viewer-card__meta-item">
          <span><ShieldCheck size={14} /> Session ID</span>
          <strong>{session ? session.sessionId : '—'}</strong>
          <p>{session && expiresAt ? `Истекает ${formatDistanceToNow(expiresAt)}` : 'Mock payload готов к API-замене.'}</p>
        </div>
      </div>

      <p className="qr-viewer-card__footnote">
        <ShieldCheck size={14} /> Невозможно гарантированно запретить скриншоты/запись на web,
        поэтому реализованы только best-effort меры маскирования и watermark.
      </p>
    </Card>
  );
}
