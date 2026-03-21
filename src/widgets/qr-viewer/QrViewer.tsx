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
import { appContent } from '../../shared/constants/content';
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
    ...appContent.qrViewer.states.inactive,
    icon: QrCode,
    toneClass: 'qr-viewer--inactive',
  },
  active: {
    ...appContent.qrViewer.states.active,
    icon: ShieldCheck,
    toneClass: 'qr-viewer--active',
  },
  expired: {
    ...appContent.qrViewer.states.expired,
    icon: Clock3,
    toneClass: 'qr-viewer--expired',
  },
  scanned: {
    ...appContent.qrViewer.states.scanned,
    icon: Ticket,
    toneClass: 'qr-viewer--scanned',
  },
  regenerating: {
    ...appContent.qrViewer.states.regenerating,
    icon: BellRing,
    toneClass: 'qr-viewer--regenerating',
  },
  blocked: {
    ...appContent.qrViewer.states.blocked,
    icon: UserRound,
    toneClass: 'qr-viewer--blocked',
  },
  unavailable: {
    ...appContent.qrViewer.states.unavailable,
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
  const content = appContent.qrViewer;

  return (
    <Card
      className={`qr-viewer-card ${meta.toneClass}`}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="qr-viewer-card__header">
        <div>
          <p className="qr-viewer-card__eyebrow">{content.eyebrow}</p>
          <h3>
            {state === 'active' ? content.title.active : content.title.default}
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
            <p>{content.placeholder}</p>
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
              <strong>{content.maskedTitle}</strong>
              <p>{content.maskedDescription}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="qr-viewer-card__meta-grid">
        <div className="qr-viewer-card__meta-item">
          <span>
            <Clock3 size={14} /> {content.meta.expiry}
          </span>
          <strong>
            {session && expiresAt
              ? `${format(expiresAt, 'HH:mm:ss')} · ${state === 'active' ? `${remainingSeconds} сек.` : meta.label}`
              : content.meta.expiryPending}
          </strong>
          <p>
            {createdAt
              ? content.meta.sessionCreated(format(createdAt, 'HH:mm:ss'))
              : content.meta.sessionNotCreated}
          </p>
        </div>
        <div className="qr-viewer-card__meta-item">
          <span>
            <ShieldCheck size={14} /> {content.meta.session}
          </span>
          <strong>
            {session ? session.sessionId : content.meta.sessionPending}
          </strong>
          <p>
            {session && expiresAt
              ? content.meta.expiresIn(formatDistanceToNow(expiresAt))
              : content.meta.payloadDescription}
          </p>
        </div>
      </div>

      <p className="qr-viewer-card__footnote">{content.footnote}</p>
    </Card>
  );
}
