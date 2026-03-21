import { BellRing, Clock3, ShieldCheck, Ticket } from 'lucide-react';
import type { AuthStatus } from '../../../app/store';

interface AuthStatusBannerProps {
  status: AuthStatus;
  message: string | null;
}

const statusConfig: Record<
  Exclude<AuthStatus, 'guest' | 'authenticated'>,
  { icon: typeof ShieldCheck; tone: string; title: string }
> = {
  loading: {
    icon: ShieldCheck,
    tone: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
    title: 'Выполняем авторизацию',
  },
  invalid_credentials: {
    icon: Ticket,
    tone: 'border-rose-400/30 bg-rose-400/10 text-rose-100',
    title: 'Неверные данные',
  },
  session_expired: {
    icon: Clock3,
    tone: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
    title: 'Сессия истекла',
  },
  service_unavailable: {
    icon: BellRing,
    tone: 'border-violet-400/30 bg-violet-400/10 text-violet-100',
    title: 'Сервис недоступен',
  },
  offline: {
    icon: BellRing,
    tone: 'border-sky-400/30 bg-sky-400/10 text-sky-100',
    title: 'Нет сети',
  },
  unknown_error: {
    icon: Ticket,
    tone: 'border-orange-400/30 bg-orange-400/10 text-orange-100',
    title: 'Что-то пошло не так',
  },
};

export function AuthStatusBanner({ status, message }: AuthStatusBannerProps) {
  if (status === 'guest' || status === 'authenticated') {
    return null;
  }

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-3xl border px-4 py-3 text-sm ${config.tone}`}
      role="status"
      aria-live="polite"
    >
      <Icon
        size={18}
        className={status === 'loading' ? 'mt-0.5 animate-spin' : 'mt-0.5'}
      />
      <div>
        <p className="font-semibold">{config.title}</p>
        {message && <p className="mt-1 leading-6 text-current/80">{message}</p>}
      </div>
    </div>
  );
}
