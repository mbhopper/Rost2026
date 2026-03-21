import { Clock3, QrCode, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQrSessionController } from '../../../features/qr-session/model';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';
import { QrViewer } from '../../../widgets/qr-viewer/QrViewer';

export function QrGenerationPage() {
  const {
    generate,
    isScreenMasked,
    qrSession,
    regenerate,
    remainingSeconds,
    revealSecureContent,
    secureViewProps,
    state,
    watermarkLabel,
  } = useQrSessionController();

  const isIdle = state === 'inactive';

  return (
    <div className="poster-page poster-page--qr-spotlight motion-page-fade">
      <div className="poster-page__copy poster-page__copy--centered">
        <p className="poster-page__eyebrow">Экран прохода</p>
        <h1>ВАШ QR</h1>
        <p>Выделенный экран для показа кода: меньше лишнего UI, крупнее QR и заметнее таймер прохода.</p>
      </div>

      <Card className="qr-spotlight-card">
        <QrViewer
          isScreenMasked={isScreenMasked}
          remainingSeconds={remainingSeconds}
          secureViewProps={secureViewProps}
          session={qrSession}
          state={state}
          watermarkLabel={watermarkLabel}
        />
      </Card>

      <div className="poster-pedestal poster-pedestal--live poster-pedestal--actions">
        <span>{isIdle ? 'Сгенерировать QR-код' : `До конца: ${remainingSeconds} сек.`}</span>
        <div className="poster-inline-actions">
          <Button onClick={() => void (isIdle ? generate() : regenerate())}>
            {isIdle ? <QrCode size={16} /> : <Ticket size={16} />}
            {isIdle ? 'Сгенерировать' : 'Обновить'}
          </Button>
          <Button variant="secondary" onClick={() => revealSecureContent()}>
            <Clock3 size={16} /> Показать экран
          </Button>
          <Link to={routes.pass}><Button variant="secondary">Назад к пропуску</Button></Link>
        </div>
      </div>
    </div>
  );
}
