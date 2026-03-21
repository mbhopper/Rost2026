import { BellRing, Clock3, QrCode, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { useQrSessionController } from './model';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';
import { QrViewer } from '../../widgets/qr-viewer/QrViewer';

interface QrSessionPanelProps {
  compact?: boolean;
}

export function QrSessionPanel({ compact = false }: QrSessionPanelProps) {
  const {
    activePass,
    generate,
    isScreenMasked,
    qrSession,
    regenerate,
    remainingSeconds,
    revealSecureContent,
    revoke,
    scanDemo,
    secureViewProps,
    state,
    watermarkLabel,
  } = useQrSessionController();

  const canGenerate = state === 'inactive';
  const canRegenerate = state === 'active' || state === 'expired' || state === 'used';
  const canDemoScan = state === 'active';
  const canRevoke = state === 'active' || state === 'expired' || state === 'used';

  return (
    <div className={`pass-cta-stack ${compact ? 'pass-cta-stack--compact' : ''}`}>
      <Card className="qr-cta-card">
        <div className="section-heading section-heading--spread">
          <div>
            <p className="section-heading__eyebrow">QR access session</p>
            <h2>Проход через цифровой пропуск</h2>
            <p className="section-copy">
              QR-код создаётся для активного пропуска и автоматически скрывается при
              blur, смене вкладки и бездействии.
            </p>
          </div>
          <div className="qr-cta-card__icon"><Ticket size={22} /></div>
        </div>

        <div className="qr-cta-card__summary">
          <div>
            <span className="qr-cta-card__label">Активный пропуск</span>
            <strong>
              {activePass ? `${activePass.passId} · ${activePass.facilityName}` : 'Не назначен'}
            </strong>
          </div>
          <div>
            <span className="qr-cta-card__label">Состояние</span>
            <strong>{state}</strong>
            <p>{state === 'active' ? `Осталось ${remainingSeconds} сек.` : 'Сессия не активна'}</p>
          </div>
        </div>

        <div className="qr-cta-card__actions">
          <Button variant="primary" fullWidth onClick={() => void (canGenerate ? generate() : regenerate())}>
            {canGenerate ? <QrCode size={18} /> : <Clock3 size={18} />}
            {canGenerate ? 'Показать QR' : 'Обновить QR'}
          </Button>
          <div className="qr-cta-card__secondary-actions">
            <Button variant="ghost" onClick={() => void regenerate()} disabled={!canRegenerate}>
              <Clock3 size={16} /> Регенерировать
            </Button>
            <Button variant="secondary" onClick={() => revealSecureContent()}>
              <UserRound size={16} /> Показать экран
            </Button>
            <Button variant="secondary" onClick={() => void scanDemo()} disabled={!canDemoScan}>
              <ShieldCheck size={16} /> Отметить как used
            </Button>
            <Button variant="secondary" onClick={() => void revoke()} disabled={!canRevoke}>
              <BellRing size={16} /> Заблокировать
            </Button>
          </div>
        </div>
      </Card>

      <QrViewer
        isScreenMasked={isScreenMasked}
        remainingSeconds={remainingSeconds}
        secureViewProps={secureViewProps}
        session={qrSession}
        state={state}
        watermarkLabel={watermarkLabel}
      />
    </div>
  );
}
