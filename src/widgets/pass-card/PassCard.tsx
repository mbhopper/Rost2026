import { format } from 'date-fns';
import { BellRing, Clock3, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import type { DigitalPass } from '../../entities/pass/model';
import type { UserProfile } from '../../entities/user/model';
import { appContent } from '../../shared/constants/content';
import { cn } from '../../shared/lib/cn';
import { Card } from '../../shared/ui/card/Card';

interface PassCardProps {
  pass: DigitalPass;
  user?: UserProfile | null;
}

const statusMeta: Record<
  DigitalPass['status'],
  {
    accentClass: string;
    chipClass: string;
    icon: typeof ShieldCheck;
    label: string;
    message: string;
  }
> = {
  active: {
    ...appContent.passCard.status.active,
    icon: ShieldCheck,
    accentClass: 'pass-badge-card--active',
    chipClass: 'pass-badge-status--active',
  },
  pending: {
    ...appContent.passCard.status.pending,
    icon: Clock3,
    accentClass: 'pass-badge-card--pending',
    chipClass: 'pass-badge-status--pending',
  },
  expired: {
    ...appContent.passCard.status.expired,
    icon: BellRing,
    accentClass: 'pass-badge-card--expired',
    chipClass: 'pass-badge-status--expired',
  },
  revoked: {
    ...appContent.passCard.status.revoked,
    icon: BellRing,
    accentClass: 'pass-badge-card--revoked',
    chipClass: 'pass-badge-status--revoked',
  },
  blocked: {
    ...appContent.passCard.status.blocked,
    icon: BellRing,
    accentClass: 'pass-badge-card--blocked',
    chipClass: 'pass-badge-status--blocked',
  },
};

function getInitials(user?: UserProfile | null) {
  if (!user) {
    return appContent.passCard.fallbackInitials;
  }

  return [user.firstName, user.lastName]
    .filter(Boolean)
    .map((value) => value.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function PassCard({ pass, user }: PassCardProps) {
  const meta = statusMeta[pass.status];
  const StatusIcon = meta.icon;
  const isBlockedState = pass.isBlocked || pass.status === 'blocked';
  const content = appContent.passCard;

  return (
    <Card className={cn('pass-badge-card', meta.accentClass)}>
      <div className="pass-badge-card__header">
        <div className="pass-badge-identity">
          <div className="pass-badge-avatar-wrap">
            {user?.avatarUrl ? (
              <img
                className="pass-badge-avatar"
                src={user.avatarUrl}
                alt={user.fullName}
              />
            ) : (
              <div className="pass-badge-avatar pass-badge-avatar--placeholder">
                {getInitials(user)}
              </div>
            )}
          </div>

          <div className="pass-badge-heading">
            <div className={cn('pass-badge-status', meta.chipClass)}>
              <StatusIcon size={14} />
              <span>{meta.label}</span>
            </div>
            <p className="pass-badge-eyebrow">{content.eyebrow}</p>
            <h2>{user?.fullName ?? content.employeeFallback}</h2>
            <p className="pass-badge-subtitle">
              {user?.position ?? content.positionFallback}
              {user?.department ? ` · ${user.department}` : ''}
            </p>
          </div>
        </div>

        <div className="pass-badge-brand">
          <span>{content.brand}</span>
          <strong>{pass.facilityName}</strong>
        </div>
      </div>

      <div className="pass-badge-grid">
        <div className="pass-badge-field">
          <span>
            <UserRound size={14} /> {content.fields.employeeId}
          </span>
          <strong>{pass.employeeId}</strong>
        </div>
        <div className="pass-badge-field">
          <span>
            <Ticket size={14} /> {content.fields.department}
          </span>
          <strong>{user?.department ?? content.departmentFallback}</strong>
        </div>
        <div className="pass-badge-field">
          <span>
            <ShieldCheck size={14} /> {content.fields.accessLevel}
          </span>
          <strong>{pass.accessLevel}</strong>
        </div>
        <div className="pass-badge-field">
          <span>
            <Clock3 size={14} /> {content.fields.updatedAt}
          </span>
          <strong>{format(new Date(pass.issuedAt), 'dd MMM yyyy')}</strong>
        </div>
      </div>

      <div className="pass-badge-banner">
        <div>
          <p className="pass-badge-banner__label">{content.banner.label}</p>
          <p className="pass-badge-banner__value">{pass.facilityName}</p>
          <p className="pass-badge-banner__copy">{meta.message}</p>
        </div>
        <div
          className={cn(
            'pass-badge-state-pill',
            isBlockedState && 'pass-badge-state-pill--alert',
          )}
        >
          {isBlockedState ? content.banner.blocked : content.banner.ready}
        </div>
      </div>
    </Card>
  );
}
