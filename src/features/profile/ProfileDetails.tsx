import { BadgeCheck, Clock3, Laptop2, ShieldCheck, Smartphone, UserRound } from 'lucide-react';
import { PASS_STATUSES } from '../../entities/pass/model';
import { useAppStore } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';

const accountStatusLabels = {
  active: 'Аккаунт активен',
  on_leave: 'В отпуске',
  suspended: 'Доступ временно ограничен',
  terminated: 'Учетная запись закрыта',
} as const;

const passStatusLabels = {
  [PASS_STATUSES.ACTIVE]: 'Пропуск активен',
  [PASS_STATUSES.EXPIRED]: 'Срок действия истек',
  [PASS_STATUSES.PENDING]: 'Ожидает активации',
  [PASS_STATUSES.REVOKED]: 'Отозван',
  [PASS_STATUSES.BLOCKED]: 'Заблокирован',
} as const;

const systemInfo = {
  lastLogin: '21 марта 2026, 08:42 · Chrome на macOS',
  lastPassRefresh: '21 марта 2026, 09:05 · синхронизация с ACS Gateway',
  sessions: [
    { label: 'Ноутбук · текущая сессия', detail: 'Chrome 134 · Москва · активна 1 ч 12 мин', icon: Laptop2 },
    { label: 'Телефон', detail: 'iPhone 15 · iOS 19 · последняя активность 14 мин назад', icon: Smartphone },
  ],
};

const primaryFields = [
  { key: 'fullName', label: 'ФИО' },
  { key: 'department', label: 'Отдел' },
  { key: 'position', label: 'Должность' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Телефон' },
  { key: 'employeeId', label: 'Табельный номер' },
] as const;

export function ProfileDetails() {
  const user = useAppStore((state) => state.user);
  const passes = useAppStore((state) => state.passes);

  const primaryPass = passes.find((item) => !item.isBlocked) ?? passes[0] ?? null;
  const passStatus = primaryPass ? passStatusLabels[primaryPass.status] : 'Пропуск не назначен';

  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            {user?.avatarUrl ? (
              <img className="profile-avatar" src={user.avatarUrl} alt={user.fullName} />
            ) : (
              <div className="profile-avatar profile-avatar--placeholder" aria-hidden="true">
                <UserRound size={44} />
              </div>
            )}
          </div>

          <div className="profile-hero__content">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Профиль сотрудника</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                {user?.fullName ?? 'Профиль сотрудника загружается'}
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Актуальные данные сотрудника, состояния учетной записи и пропуска для ежедневного прохода.
              </p>
            </div>

            <div className="profile-badges" aria-label="Статусы сотрудника">
              <span className="profile-badge profile-badge--success">
                <ShieldCheck size={14} /> {user ? accountStatusLabels[user.status] : 'Статус аккаунта неизвестен'}
              </span>
              <span className="profile-badge profile-badge--info">
                <BadgeCheck size={14} /> {passStatus}
              </span>
            </div>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          {primaryFields.map((field) => (
            <div key={field.key} className="info-tile">
              <dt>{field.label}</dt>
              <dd>{user?.[field.key] ?? '—'}</dd>
            </div>
          ))}
          <div className="info-tile">
            <dt>Статус аккаунта</dt>
            <dd>{user ? accountStatusLabels[user.status] : '—'}</dd>
          </div>
          <div className="info-tile">
            <dt>Статус пропуска</dt>
            <dd>{passStatus}</dd>
          </div>
        </dl>
      </Card>

      <Card className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Системная информация</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Сводка по последним событиям</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300" aria-hidden="true">
            <Clock3 size={20} />
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="info-tile">
            <dt>Последний вход</dt>
            <dd>{systemInfo.lastLogin}</dd>
          </div>
          <div className="info-tile">
            <dt>Последнее обновление пропуска</dt>
            <dd>{systemInfo.lastPassRefresh}</dd>
          </div>
        </dl>

        <section className="space-y-4" aria-labelledby="active-sessions-title">
          <div>
            <h3 id="active-sessions-title" className="text-sm font-semibold text-white">
              Активные устройства и сессии
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Мок-данные для MVP: используются как визуальная заготовка для интеграции с журналом авторизаций.
            </p>
          </div>

          <div className="space-y-4">
            {systemInfo.sessions.map((session) => {
              const Icon = session.icon;

              return (
                <article key={session.label} className="profile-session-card">
                  <div className="profile-session-card__icon" aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{session.label}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{session.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </Card>
    </div>
  );
}
