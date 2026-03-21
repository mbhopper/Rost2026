import { BellRing, Clock3, QrCode, ShieldCheck, Ticket } from 'lucide-react';
import { useQrSessionController } from './model';
import { appContent } from '../../shared/constants/content';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';
import { QrViewer } from '../../widgets/qr-viewer/QrViewer';

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
  const content = appContent.qrPanel;

  const canGenerate = state === 'inactive';
  const canRegenerate =
    state === 'active' || state === 'expired' || state === 'scanned';
  const canDemoScan = state === 'active';
  const canRevoke =
    state === 'active' || state === 'expired' || state === 'scanned';

  const primaryAction = canGenerate
    ? () => void generate()
    : () => void regenerate();
  const primaryLabel = canGenerate
    ? content.primaryShow
    : content.primaryRegenerate;
  const primaryIcon = canGenerate ? <QrCode size={18} /> : <Clock3 size={18} />;
  const secondaryLabel =
    state === 'active'
      ? content.secondaryStatusActive
      : content.secondaryStatusIdle;

  return (
    <div className="pass-cta-stack">
      <Card className="qr-cta-card">
        <div className="qr-cta-card__header">
          <div>
            <p className="qr-cta-card__eyebrow">{content.eyebrow}</p>
            <h2>{content.title}</h2>
            <p className="qr-cta-card__copy">{content.description}</p>
          </div>
          <div className="qr-cta-card__icon">
            <Ticket size={22} />
          </div>
        </div>

        <div className="qr-cta-card__summary">
          <div>
            <span className="qr-cta-card__label">{content.activePass}</span>
            <strong>
              {activePass
                ? `${activePass.passId} · ${activePass.facilityName}`
                : content.passFallback}
            </strong>
          </div>
          <div>
            <span className="qr-cta-card__label">{content.qrStatus}</span>
            <strong>{secondaryLabel}</strong>
            <p>
              {state === 'active'
                ? content.timeLeft(remainingSeconds)
                : content.sessionPending}
            </p>
          </div>
        </div>

        <div className="qr-cta-card__actions">
          <Button
            variant="primary"
            fullWidth
            onClick={primaryAction}
            disabled={!canGenerate && !canRegenerate}
          >
            {primaryIcon}
            {primaryLabel}
          </Button>
          <div className="qr-cta-card__secondary-actions">
            <Button
              variant="ghost"
              onClick={() => void regenerate()}
              disabled={!canRegenerate}
            >
              <Clock3 size={16} /> {content.primaryRegenerate}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void scanDemo()}
              disabled={!canDemoScan}
            >
              <ShieldCheck size={16} /> {content.usedAction}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void revoke()}
              disabled={!canRevoke}
            >
              <BellRing size={16} /> {content.blockAction}
            </Button>
          </div>
        </div>
      </Card>

      <QrViewer
        isScreenMasked={isScreenMasked}
        remainingSeconds={remainingSeconds}
        session={qrSession}
        state={state}
      />

      <Card className="pass-info-block">
        <div className="pass-info-block__header">
          <span>
            <BellRing size={14} /> {content.infoTitle}
          </span>
          <strong>{content.infoSubtitle}</strong>
        </div>
        <div className="pass-info-block__grid">
          {content.tips.map((item) => (
            <div key={item} className="pass-info-block__item">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
