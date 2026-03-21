import { BellRing, Clock3, QrCode, ShieldCheck, Ticket } from 'lucide-react';
import { useQrSessionController } from './model';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';
import { QrViewer } from '../../widgets/qr-viewer/QrViewer';

const compactTips = [
  'QR-сессия живёт ограниченное время и автоматически истекает без ручного обновления.',
  'После перезагрузки активная demo-сессия восстанавливается из sessionStorage.',
  'Demo scan и revoke нужны только для проверки UX-сценариев used / blocked.',
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
  const canRegenerate =
    state === 'active' || state === 'expired' || state === 'scanned';
  const canDemoScan = state === 'active';
  const canRevoke =
    state === 'active' || state === 'expired' || state === 'scanned';

  const primaryAction = canGenerate
    ? () => void generate()
    : () => void regenerate();
  const primaryLabel = canGenerate
    ? 'Открыть QR-пропуск'
    : 'Обновить и открыть новый QR';
  const primaryIcon = canGenerate ? <QrCode size={18} /> : <Clock3 size={18} />;
  const secondaryLabel =
    state === 'active'
      ? 'QR активен и готов к сканированию'
      : 'Откройте код прямо перед турникетом';

  return (
    <div className="pass-cta-stack">
      <Card className="qr-cta-card">
        <div className="qr-cta-card__header">
          <div>
            <p className="qr-cta-card__eyebrow">Primary action</p>
            <h2>Откройте QR только в момент прохода.</h2>
            <p className="qr-cta-card__copy">
              Основной сценарий экрана — быстро показать статус пропуска и
              вывести QR без лишнего шума.
            </p>
          </div>
          <div className="qr-cta-card__icon">
            <Ticket size={22} />
          </div>
        </div>

        <div className="qr-cta-card__summary">
          <div>
            <span className="qr-cta-card__label">Активный пропуск</span>
            <strong>
              {activePass
                ? `${activePass.passId} · ${activePass.facilityName}`
                : 'Доступный пропуск не найден'}
            </strong>
          </div>
          <div>
            <span className="qr-cta-card__label">Статус QR</span>
            <strong>{secondaryLabel}</strong>
            <p>
              {state === 'active'
                ? `Осталось ${remainingSeconds} сек.`
                : 'Система создаст новую безопасную сессию.'}
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
              <Clock3 size={16} /> Обновить
            </Button>
            <Button
              variant="secondary"
              onClick={() => void scanDemo()}
              disabled={!canDemoScan}
            >
              <ShieldCheck size={16} /> Demo scan
            </Button>
            <Button
              variant="secondary"
              onClick={() => void revoke()}
              disabled={!canRevoke}
            >
              <BellRing size={16} /> Block session
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
            <BellRing size={14} /> Access notes
          </span>
          <strong>Вторичные советы сведены в компактный блок</strong>
        </div>
        <div className="pass-info-block__grid">
          {compactTips.map((item) => (
            <div key={item} className="pass-info-block__item">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
