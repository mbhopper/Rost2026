import { format } from 'date-fns';
import { BellRing, Clock3, Settings, ShieldCheck, Ticket, UserRound } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';

const accountStatusLabels = {
  active: 'Активен',
  on_leave: 'В отпуске',
  suspended: 'Временно ограничен',
  terminated: 'Уволен',
} as const;

const passStatusLabels = {
  active: 'Активен',
  expired: 'Истёк',
  pending: 'Ожидает активации',
  revoked: 'Отозван',
  blocked: 'Заблокирован',
} as const;

const systemInfo = {
  lastLogin: '2026-03-21T08:42:00.000Z',
  lastPassRefresh: '2026-03-21T08:31:00.000Z',
  sessionSummary: '2 активные сессии: рабочий ноутбук и мобильный браузер сотрудника.',
  devices: [
    {
      title: 'Ноутбук сотрудника',
      meta: 'Основная сессия · Санкт-Петербург · корпоративная сеть',
      lastSeen: '2026-03-21T08:42:00.000Z',
    },
    {
      title: 'Мобильный браузер',
      meta: 'Вторичная сессия · Москва · демо-подключение',
      lastSeen: '2026-03-21T07:58:00.000Z',
    },
  ],
} as const;

function formatDateTime(value: string) {
  return format(new Date(value), 'dd.MM.yyyy HH:mm');
}

function getStatusTone(status: 'success' | 'warning' | 'danger') {
  if (status === 'success') {
    return 'bg-emerald-400/15 text-emerald-300';
  }

  if (status === 'warning') {
    return 'bg-amber-400/15 text-amber-300';
  }

  return 'bg-rose-400/15 text-rose-300';
}

export function ProfileDetails() {
  const user = useAppStore((state) => state.user);
  const passes = useAppStore((state) => state.passes);
  const primaryPass = passes.find((pass) => pass.status === 'active' && !pass.isBlocked) ?? passes[0] ?? null;
  const accountTone = user?.status === 'active' ? 'success' : user?.status === 'on_leave' ? 'warning' : 'danger';
  const passTone = primaryPass?.status === 'active' ? 'success' : primaryPass?.status === 'pending' ? 'warning' : 'danger';

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
      <Card className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Идентификация</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{user?.fullName ?? 'Профиль загружается'}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Корпоративная карточка сотрудника с контактными данными и статусами доступа.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
            <UserRound size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/30 p-5 text-center">
          <img
            className="h-[190px] w-[190px] rounded-[28px] border border-white/10 bg-white/5 object-cover"
            src={user?.avatarUrl ?? 'https://api.dicebear.com/9.x/initials/svg?seed=Employee'}
            alt={user ? `Фотография сотрудника ${user.fullName}` : 'Фотография сотрудника'}
          />
          <div className="space-y-2">
            <div className="text-xl font-semibold text-white">{user?.position ?? '—'}</div>
            <p className="text-sm text-slate-400">{user?.department ?? '—'}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusTone(accountTone)}`}>
              Аккаунт: {user ? accountStatusLabels[user.status] : '—'}
            </span>
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusTone(passTone)}`}>
              Пропуск: {primaryPass ? passStatusLabels[primaryPass.status] : 'Не назначен'}
            </span>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            <ShieldCheck size={16} /> Данные сотрудника
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="info-tile"><dt>ФИО</dt><dd className="secure-sensitive">{user?.fullName ?? '—'}</dd></div>
            <div className="info-tile"><dt>ID сотрудника</dt><dd className="secure-sensitive">{user?.employeeId ?? '—'}</dd></div>
            <div className="info-tile"><dt>Отдел</dt><dd>{user?.department ?? '—'}</dd></div>
            <div className="info-tile"><dt>Должность</dt><dd>{user?.position ?? '—'}</dd></div>
            <div className="info-tile"><dt>Email</dt><dd className="secure-sensitive">{user?.email ?? '—'}</dd></div>
            <div className="info-tile"><dt>Телефон</dt><dd className="secure-sensitive">{user?.phone ?? '—'}</dd></div>
            <div className="info-tile"><dt>Статус аккаунта</dt><dd><span className={`inline-flex rounded-full px-3 py-1 text-sm ${getStatusTone(accountTone)}`}>{user ? accountStatusLabels[user.status] : '—'}</span></dd></div>
            <div className="info-tile"><dt>Статус пропуска</dt><dd><span className={`inline-flex rounded-full px-3 py-1 text-sm ${getStatusTone(passTone)}`}>{primaryPass ? passStatusLabels[primaryPass.status] : 'Не назначен'}</span></dd></div>
          </dl>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            <Settings size={16} /> Системная информация
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="info-tile">
              <dt>Последний вход</dt>
              <dd>
                <span className="inline-flex items-center gap-2"><Clock3 size={16} />{formatDateTime(systemInfo.lastLogin)}</span>
              </dd>
            </div>
            <div className="info-tile">
              <dt>Последнее обновление пропуска</dt>
              <dd>{formatDateTime(systemInfo.lastPassRefresh)}</dd>
            </div>
            <div className="info-tile">
              <dt>Сводка по сессиям</dt>
              <dd>{systemInfo.sessionSummary}</dd>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {systemInfo.devices.map((device) => (
              <article key={device.title} className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">{device.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{device.meta}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
                    <BellRing size={18} />
                  </div>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                  <Ticket size={16} /> Последняя активность {formatDateTime(device.lastSeen)}
                </div>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
