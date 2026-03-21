import { useAppStore } from '../../app/store';
import { QrSessionPanel } from '../../features/qr-session/QrSessionPanel';
import { PassCard } from '../../widgets/pass-card/PassCard';

export function PassPage() {
  const passes = useAppStore((state) => state.passes);
  const user = useAppStore((state) => state.user);

  const primaryPass =
    passes.find((item) => item.status === 'active' && !item.isBlocked) ??
    passes[0] ??
    null;

  if (!primaryPass) {
    return (
      <div className="poster-page">
        <div className="poster-page__copy poster-page__copy--centered">
          <p className="poster-page__eyebrow">Digital pass</p>
          <h1>ТОЧКА ВХОДА</h1>
          <p>Пропуск пока не назначен. После интеграции backend здесь появится реальный проходной статус.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="poster-page">
      <div className="poster-page__copy poster-page__copy--centered">
        <p className="poster-page__eyebrow">Digital pass</p>
        <h1>ТОЧКА ВХОДА</h1>
        <p>Центральный экран прохода: карточка сотрудника, QR и статус доступа в одном мобильном сценарии.</p>
      </div>

      <div className="poster-stage">
        <PassCard pass={primaryPass} user={user} />
      </div>

      <div className="poster-pedestal poster-pedestal--live">
        <span>Сгенерировать QR-code</span>
        <QrSessionPanel compact />
      </div>
    </div>
  );
}
