import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../app/store';
import {
  loginSchema,
  type LoginFormValues,
} from '../../../features/auth/lib/schemas';
import { AuthStatusBanner } from '../../../features/auth/ui/AuthStatusBanner';
import { defaultPrivateRoute, routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';
import { Input } from '../../../shared/ui/input/Input';

export function LoginPage() {
  const authMessage = useAppStore((state) => state.authMessage);
  const authStatus = useAppStore((state) => state.authStatus);
  const clearAuthFeedback = useAppStore((state) => state.clearAuthFeedback);
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'alex@futurepass.app',
      password: 'future-pass',
    },
  });

  useEffect(() => clearAuthFeedback, [clearAuthFeedback]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values.email, values.password);
      navigate(defaultPrivateRoute);
    } catch {
      // auth feedback is stored in zustand and rendered by AuthStatusBanner.
    }
  });

  return (
    <Card className="auth-form-card auth-form-card--login">
      <div className="auth-form-card__badge">
        <ShieldCheck size={14} /> Вход сотрудника
      </div>
      <div className="auth-form-card__intro">
        <h2>Вход в кабинет пропуска</h2>
        <p>
          Используйте корпоративный email, чтобы открыть QR-пропуск, профиль
          сотрудника и настройки уведомлений.
        </p>
      </div>
      <AuthStatusBanner status={authStatus} message={authMessage} />
      <form className="auth-form-card__form" onSubmit={onSubmit} noValidate>
        <label className="field-block">
          <span>Email</span>
          <Input
            type="email"
            placeholder="name@company.ru"
            {...register('email')}
          />
          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </label>
        <label className="field-block">
          <span>Пароль</span>
          <Input
            type="password"
            placeholder="Минимум 8 символов"
            {...register('password')}
          />
          {errors.password && (
            <span className="field-error">{errors.password.message}</span>
          )}
        </label>
        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || authStatus === 'loading'}
          aria-busy={isSubmitting || authStatus === 'loading'}
        >
          {isSubmitting || authStatus === 'loading' ? 'Входим…' : 'Войти'}
        </Button>
      </form>
      <p className="auth-form-card__footer">
        Нет аккаунта?{' '}
        <Link
          className="font-semibold text-cyan-300 hover:text-cyan-200"
          to={routes.register}
        >
          Оставьте заявку
        </Link>{' '}
        или <Link className="font-semibold text-cyan-300 hover:text-cyan-200" to={routes.support}>напишите в поддержку</Link>.
      </p>
    </Card>
  );
}
