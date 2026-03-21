import { zodResolver } from '@hookform/resolvers/zod';
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
      email: '',
      password: '',
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
    <section className="rt-screen rt-screen--form motion-page-fade">
      <Card className="auth-form-card rt-form-card motion-rise-in">
        <div className="auth-form-card__intro rt-form-card__intro">
          <h2>ВХОД</h2>
        </div>
        <AuthStatusBanner status={authStatus} message={authMessage} />
        <form className="auth-form-card__form" onSubmit={onSubmit} noValidate>
          <label className="field-block">
            <span>Email</span>
            <Input
              className="Input--poster"
              type="email"
              placeholder="Логин"
              {...register('email')}
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </label>
          <label className="field-block">
            <span>Пароль</span>
            <Input
              className="Input--poster"
              type="password"
              placeholder="Пароль"
              {...register('password')}
            />
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </label>
          <p className="rt-form-card__legal">
            Я ознакомлен(-а) с{' '}
            <Link to={routes.support}>политикой конфиденциальности</Link>
          </p>
          <Button
            type="submit"
            className="rt-form-card__submit"
            disabled={isSubmitting || authStatus === 'loading'}
            aria-busy={isSubmitting || authStatus === 'loading'}
          >
            {isSubmitting || authStatus === 'loading' ? 'Входим…' : 'ВОЙТИ'}
          </Button>
        </form>
      </Card>

      <div className="rt-pedestal rt-pedestal--back">
        <span>НАЗАД НА ГЛАВНУЮ</span>
        <Link
          to={routes.root}
          className="rt-pedestal__badge rt-pedestal__badge--back"
          aria-label="Назад на главную"
        >
          ↩
        </Link>
      </div>
    </section>
  );
}
