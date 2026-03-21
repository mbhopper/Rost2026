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
  session: QrSession | null;
  state: QrScreenState;
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
    label: 'Не открыт',
    description:
      'Сначала создайте QR-сессию — код появится в безопасном sheet-окне.',
    icon: QrCode,
    toneClass: 'qr-viewer--inactive',
  },
  active: {
    label: 'Активен',
    description: 'Покажите код охране или турникету, пока таймер ещё идёт.',
    icon: ShieldCheck,
    toneClass: 'qr-viewer--active',
  },
  expired: {
    label: 'Истёк',
    description:
      'Срок жизни QR завершён. Откройте новый код для следующего прохода.',
    icon: Clock3,
    toneClass: 'qr-viewer--expired',
  },
  scanned: {
    label: 'Использован',
    description: 'Demo-сценарий: код уже считан и больше не считается свежим.',
    icon: Ticket,
    toneClass: 'qr-viewer--scanned',
  },
  regenerating: {
    label: 'Обновляется',
    description: 'Создаём новый QR с новым sessionId и пересчитанным TTL.',
    icon: BellRing,
    toneClass: 'qr-viewer--regenerating',
  },
  blocked: {
    label: 'Заблокирован',
    description: 'Сессия отозвана, поэтому код нельзя использовать для входа.',
    icon: UserRound,
    toneClass: 'qr-viewer--blocked',
  },
  unavailable: {
    label: 'Недоступен',
    description:
      'Нет активного пропуска или текущая сессия пользователя невалидна.',
    icon: BellRing,
    toneClass: 'qr-viewer--unavailable',
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

  return (
    <Card
      className={`qr-viewer-card ${meta.toneClass}`}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="qr-viewer-card__header">
        <div>
          <p className="qr-viewer-card__eyebrow">QR access sheet</p>
          <h3>
            {meta.label === 'Активен'
              ? 'Ваш QR готов к показу'
              : 'Экран QR-пропуска'}
          </h3>
          <p className="qr-viewer-card__copy">{meta.description}</p>
        </div>
        <div className="qr-viewer-card__state">
          <StateIcon size={18} />
          <span>{meta.label}</span>
        </div>
      </div>

      <div className="qr-sheet">
        {state === 'active' ||
        state === 'scanned' ||
        state === 'expired' ||
        state === 'blocked' ||
        state === 'regenerating' ? (
          <QRCodeSVG value={session?.qrValue ?? 'qr-unavailable'} size={210} />
        ) : (
          <div className="qr-sheet__placeholder">
            <QrCode size={38} />
            <p>
              После нажатия на CTA здесь появится одноразовый код для прохода.
            </p>
          </div>
        )}

        {state !== 'active' ? (
          <div className="qr-sheet__overlay">
            <div>
              <StateIcon
                className={
                  state === 'regenerating' ? 'animate-pulse' : undefined
                }
                size={28}
              />
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
              <p>
                При потере фокуса QR маскируется как best-effort защита
                браузерного интерфейса.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="qr-viewer-card__meta-grid">
        <div className="qr-viewer-card__meta-item">
          <span>
            <Clock3 size={14} /> TTL / expiry
          </span>
          <strong>
            {session && expiresAt
              ? `${format(expiresAt, 'HH:mm:ss')} · ${state === 'active' ? `${remainingSeconds} сек.` : meta.label}`
              : 'Ожидает генерацию'}
          </strong>
          <p>
            {createdAt
              ? `Создан ${format(createdAt, 'HH:mm:ss')}`
              : 'Сессия ещё не создана'}
          </p>
        </div>
        <div className="qr-viewer-card__meta-item">
          <span>
            <ShieldCheck size={14} /> Session payload
          </span>
          <strong>
            {session ? session.sessionId : 'Сессия появится после открытия QR'}
          </strong>
          <p>
            {session && expiresAt
              ? `Истекает ${formatDistanceToNow(expiresAt)}.`
              : 'Payload будет содержать employeeId, passId, sessionId и signature.'}
          </p>
        </div>
      </div>

      <p className="qr-viewer-card__footnote">
        Браузер не умеет жёстко запрещать скриншоты: для этого нужен
        native-контур или интеграция уровня ОС.
      </p>
    </Card>
  );
}
