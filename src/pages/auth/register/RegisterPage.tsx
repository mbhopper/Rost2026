import { zodResolver } from '@hookform/resolvers/zod';
import { Ticket } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../app/store';
import {
  registerSchema,
  type RegisterFormValues,
} from '../../../features/auth/lib/schemas';
import { AuthStatusBanner } from '../../../features/auth/ui/AuthStatusBanner';
import { defaultPrivateRoute, routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';
import { Input } from '../../../shared/ui/input/Input';

export function RegisterPage() {
  const authMessage = useAppStore((state) => state.authMessage);
  const authStatus = useAppStore((state) => state.authStatus);
  const clearAuthFeedback = useAppStore((state) => state.clearAuthFeedback);
  const registerUser = useAppStore((state) => state.register);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: 'Александр',
      lastName: 'Иванов',
      middleName: '',
      email: 'alex@futurepass.app',
      phone: '+7 (999) 123-45-67',
      department: 'Platform Engineering',
      position: 'Frontend engineer',
      password: 'future-pass',
      confirmPassword: 'future-pass',
    },
  });

  useEffect(() => clearAuthFeedback, [clearAuthFeedback]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser(values);
      navigate(defaultPrivateRoute);
    } catch {
      // auth feedback is stored in zustand and rendered by AuthStatusBanner.
    }
  });

  return (
    <Card className="auth-form-card auth-form-card--register">
      <div className="auth-form-card__badge">
        <Ticket size={14} /> Регистрация
      </div>
      <div className="auth-form-card__intro">
        <h2>Создайте пропуск сотрудника</h2>
        <p>
          После регистрации вы сразу попадёте в приватную часть приложения и
          сможете использовать QR для прохода.
        </p>
      </div>
      <AuthStatusBanner status={authStatus} message={authMessage} />
      <form className="auth-form-card__form" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-block">
            <span>Имя</span>
            <Input placeholder="Иван" {...register('firstName')} />
            {errors.firstName && (
              <span className="field-error">{errors.firstName.message}</span>
            )}
          </label>
          <label className="field-block">
            <span>Фамилия</span>
            <Input placeholder="Иванов" {...register('lastName')} />
            {errors.lastName && (
              <span className="field-error">{errors.lastName.message}</span>
            )}
          </label>
        </div>
        <label className="field-block">
          <span>Отчество</span>
          <Input placeholder="Иванович" {...register('middleName')} />
          {errors.middleName && (
            <span className="field-error">{errors.middleName.message}</span>
          )}
        </label>
        <div className="grid gap-4 md:grid-cols-2">
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
            <span>Телефон</span>
            <Input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              {...register('phone')}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone.message}</span>
            )}
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-block">
            <span>Подразделение</span>
            <Input
              placeholder="Например, Platform"
              {...register('department')}
            />
            {errors.department && (
              <span className="field-error">{errors.department.message}</span>
            )}
          </label>
          <label className="field-block">
            <span>Должность</span>
            <Input
              placeholder="Например, Product manager"
              {...register('position')}
            />
            {errors.position && (
              <span className="field-error">{errors.position.message}</span>
            )}
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
          <label className="field-block">
            <span>Повторите пароль</span>
            <Input
              type="password"
              placeholder="Повторите пароль"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="field-error">
                {errors.confirmPassword.message}
              </span>
            )}
          </label>
        </div>
        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || authStatus === 'loading'}
          aria-busy={isSubmitting || authStatus === 'loading'}
        >
          {isSubmitting || authStatus === 'loading'
            ? 'Создаём аккаунт…'
            : 'Зарегистрироваться'}
        </Button>
      </form>
      <p className="auth-form-card__footer">
        Уже есть аккаунт?{' '}
        <Link
          className="font-semibold text-cyan-300 hover:text-cyan-200"
          to={routes.login}
        >
          Войдите
        </Link>
      </p>
    </Card>
  );
}
