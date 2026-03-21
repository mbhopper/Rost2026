import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../app/store';
import { loginSchema, type LoginFormValues } from '../../../features/auth/lib/schemas';
import { AuthStatusBanner } from '../../../features/auth/ui/AuthStatusBanner';
import { defaultAdminRoute } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';
import { Input } from '../../../shared/ui/input/Input';

export function AdminLoginPage() {
  const authMessage = useAppStore((state) => state.authMessage);
  const authStatus = useAppStore((state) => state.authStatus);
  const clearAuthFeedback = useAppStore((state) => state.clearAuthFeedback);
  const loginAdmin = useAppStore((state) => state.loginAdmin);
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
      await loginAdmin(values.email, values.password);
      navigate(defaultAdminRoute);
    } catch {
      // Rendered by AuthStatusBanner.
    }
  });

  return (
    <main className="auth-shell auth-shell--admin">
      <Card className="auth-card auth-card--admin">
        <div className="auth-card__badge"><ShieldCheck size={14} /> Доступ администратора</div>
        <div className="auth-card__intro">
          <h1>Вход в панель администрирования</h1>
          <p>
            Вход предназначен для администраторов системы. Ссылка на этот раздел
            не публикуется в основном пользовательском интерфейсе.
          </p>
        </div>
        <AuthStatusBanner status={authStatus} message={authMessage} />
        <form className="form-stack" onSubmit={onSubmit} noValidate>
          <label className="field-block">
            <span>Email</span>
            <Input type="email" {...register('email')} />
            {errors.email ? <span className="field-error">{errors.email.message}</span> : null}
          </label>
          <label className="field-block">
            <span>Пароль</span>
            <Input type="password" {...register('password')} />
            {errors.password ? <span className="field-error">{errors.password.message}</span> : null}
          </label>
          <Button type="submit" fullWidth disabled={isSubmitting || authStatus === 'loading'}>
            {isSubmitting || authStatus === 'loading' ? 'Проверяем доступ…' : 'Войти в панель администратора'}
          </Button>
        </form>
      </Card>
    </main>
  );
}
