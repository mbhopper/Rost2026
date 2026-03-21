import { format } from 'date-fns';
import { BellRing, Clock3, ShieldCheck, Ticket } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { QrSessionPanel } from '../../features/qr-session/QrSessionPanel';
import { Card } from '../../shared/ui/card/Card';
import { PassCard } from '../../widgets/pass-card/PassCard';

export function PassPage() {
  const passes = useAppStore((state) => state.passes);
  const user = useAppStore((state) => state.user);

  const primaryPass =
    passes.find((item) => item.status === 'active' && !item.isBlocked) ??
    passes[0] ??
    null;
  const relatedPasses = primaryPass
    ? passes.filter((item) => item.passId !== primaryPass.passId)
    : [];

  if (!primaryPass) {
    return (
      <Card className="space-y-4">
        <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
          <ShieldCheck size={14} /> Employee pass overview
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Пропуск пока недоступен.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-400">
          Когда HR или security выдадут доступ, на этом экране появится
          виртуальный корпоративный бейдж и CTA для открытия QR.
        </p>
      </Card>
    );
  }

  return (
    <div className="pass-page-shell">
      <Card className="pass-hero-card">
        <div className="pass-hero-card__content">
          <div>
            <p className="pass-hero-card__eyebrow">Employee pass overview</p>
            <h1>
              {user
                ? `${user.firstName}, ваш пропуск готов к проходу.`
                : 'Ваш корпоративный пропуск готов к использованию.'}
            </h1>
            <p className="pass-hero-card__copy">
              Один главный сценарий: быстро проверить бейдж сотрудника,
              убедиться в статусе доступа и открыть QR непосредственно перед
              проходом.
            </p>
          </div>
          <div className="pass-hero-card__stats">
            <div>
              <span>Facility</span>
              <strong>{primaryPass.facilityName}</strong>
            </div>
            <div>
              <span>Access level</span>
              <strong>{primaryPass.accessLevel}</strong>
            </div>
            <div>
              <span>Valid until</span>
              <strong>
                {format(new Date(primaryPass.expiresAt), 'dd MMM yyyy')}
              </strong>
            </div>
          </div>
        </div>
      </Card>

      <div className="pass-main-grid">
        <div className="pass-main-column">
          <PassCard pass={primaryPass} user={user} />

          <Card className="pass-meta-card">
            <div className="pass-section-heading">
              <div>
                <p className="pass-section-heading__eyebrow">
                  Pass history & metadata
                </p>
                <h2>Детали выпуска и доступа</h2>
              </div>
            </div>

            <div className="pass-meta-grid">
              <div className="pass-meta-grid__item">
                <span>
                  <Ticket size={14} /> Номер пропуска
                </span>
                <strong>{primaryPass.passId}</strong>
              </div>
              <div className="pass-meta-grid__item">
                <span>
                  <ShieldCheck size={14} /> Дата выпуска
                </span>
                <strong>
                  {format(new Date(primaryPass.issuedAt), 'dd MMM yyyy')}
                </strong>
              </div>
              <div className="pass-meta-grid__item">
                <span>
                  <Clock3 size={14} /> Срок действия
                </span>
                <strong>
                  {format(new Date(primaryPass.expiresAt), 'dd MMM yyyy')}
                </strong>
              </div>
              <div className="pass-meta-grid__item">
                <span>
                  <ShieldCheck size={14} /> Уровень доступа
                </span>
                <strong>{primaryPass.accessLevel}</strong>
              </div>
            </div>

            {relatedPasses.length > 0 ? (
              <div className="pass-history-block">
                <div className="pass-history-block__header">
                  <span>
                    <BellRing size={14} /> Дополнительные записи доступа
                  </span>
                  <strong>{relatedPasses.length} шт.</strong>
                </div>
                <div className="pass-history-list">
                  {relatedPasses.map((item) => (
                    <div key={item.passId} className="pass-history-list__item">
                      <div>
                        <strong>{item.facilityName}</strong>
                        <p>
                          {item.passId} · {item.accessLevel}
                        </p>
                      </div>
                      <span>
                        {format(new Date(item.expiresAt), 'dd MMM yyyy')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        <QrSessionPanel />
      </div>
    </div>
  );
}
