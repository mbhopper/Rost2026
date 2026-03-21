import { format } from 'date-fns';
import { BellRing, Clock3, ShieldCheck, Ticket } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { QrSessionPanel } from '../../features/qr-session/QrSessionPanel';
import { appContent } from '../../shared/constants/content';
import { Card } from '../../shared/ui/card/Card';
import { PassCard } from '../../widgets/pass-card/PassCard';

export function PassPage() {
  const passes = useAppStore((state) => state.passes);
  const user = useAppStore((state) => state.user);
  const content = appContent.passPage;

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
          <ShieldCheck size={14} /> {content.empty.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold text-white">
          {content.empty.title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-400">
          {content.empty.description}
        </p>
      </Card>
    );
  }

  return (
    <div className="pass-page-shell">
      <Card className="pass-hero-card">
        <div className="pass-hero-card__content">
          <div>
            <p className="pass-hero-card__eyebrow">{content.hero.eyebrow}</p>
            <h1>
              {user
                ? content.hero.titleWithName(user.firstName)
                : content.hero.titleFallback}
            </h1>
            <p className="pass-hero-card__copy">{content.hero.description}</p>
          </div>
          <div className="pass-hero-card__stats">
            <div>
              <span>{content.hero.stats.facility}</span>
              <strong>{primaryPass.facilityName}</strong>
            </div>
            <div>
              <span>{content.hero.stats.accessLevel}</span>
              <strong>{primaryPass.accessLevel}</strong>
            </div>
            <div>
              <span>{content.hero.stats.validUntil}</span>
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
                  {content.metadata.eyebrow}
                </p>
                <h2>{content.metadata.title}</h2>
              </div>
            </div>

            <div className="pass-meta-grid">
              <div className="pass-meta-grid__item">
                <span>
                  <Ticket size={14} /> {content.metadata.passNumber}
                </span>
                <strong>{primaryPass.passId}</strong>
              </div>
              <div className="pass-meta-grid__item">
                <span>
                  <ShieldCheck size={14} /> {content.metadata.issuedAt}
                </span>
                <strong>
                  {format(new Date(primaryPass.issuedAt), 'dd MMM yyyy')}
                </strong>
              </div>
              <div className="pass-meta-grid__item">
                <span>
                  <Clock3 size={14} /> {content.metadata.expiresAt}
                </span>
                <strong>
                  {format(new Date(primaryPass.expiresAt), 'dd MMM yyyy')}
                </strong>
              </div>
              <div className="pass-meta-grid__item">
                <span>
                  <ShieldCheck size={14} /> {content.metadata.accessLevel}
                </span>
                <strong>{primaryPass.accessLevel}</strong>
              </div>
            </div>

            {relatedPasses.length > 0 ? (
              <div className="pass-history-block">
                <div className="pass-history-block__header">
                  <span>
                    <BellRing size={14} /> {content.metadata.extraAccess}
                  </span>
                  <strong>
                    {content.metadata.itemsCount(relatedPasses.length)}
                  </strong>
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
