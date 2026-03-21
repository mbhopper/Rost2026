import { zodResolver } from '@hookform/resolvers/zod';
import { Ticket } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  registrationRequestSchema,
  type RegistrationRequestFormValues,
} from '../../../features/auth/lib/schemas';
import { mockApi } from '../../../shared/api/mockApi';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';
import { Input } from '../../../shared/ui/input/Input';

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationRequestFormValues>({
    resolver: zodResolver(registrationRequestSchema),
    defaultValues: {
      firstName: 'Александр',
      lastName: 'Иванов',
      middleName: '',
      email: 'alex@futurepass.app',
      phone: '+7 (999) 123-45-67',
      department: 'Platform Engineering',
      position: 'Frontend engineer',
      note: 'Нужен доступ в основное здание и переговорные.',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await mockApi.requestService.submitRegistrationRequest(values);
    navigate(`${routes.registerSuccess}?requestId=${encodeURIComponent(result.id)}`);
  });

  return (
    <Card className="auth-form-card auth-form-card--register motion-rise-in">
      <div className="auth-form-card__badge">
        <Ticket size={14} /> Заявка на регистрацию
      </div>
      <div className="auth-form-card__intro">
        <h2>Оставьте заявку, и администратор создаст пропуск</h2>
        <p>
          Публичная форма больше не открывает личный кабинет напрямую: сначала
          заявка попадает в админскую консоль, где сотрудника регистрируют и
          выдают пропуск.
        </p>
      </div>
      <form className="auth-form-card__form" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-block">
            <span>Имя</span>
            <Input placeholder="Иван" {...register('firstName')} />
            {errors.firstName && <span className="field-error">{errors.firstName.message}</span>}
          </label>
          <label className="field-block">
            <span>Фамилия</span>
            <Input placeholder="Иванов" {...register('lastName')} />
            {errors.lastName && <span className="field-error">{errors.lastName.message}</span>}
          </label>
        </div>
        <label className="field-block">
          <span>Отчество</span>
          <Input placeholder="Иванович" {...register('middleName')} />
          {errors.middleName && <span className="field-error">{errors.middleName.message}</span>}
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-block">
            <span>Email</span>
            <Input type="email" placeholder="name@company.ru" {...register('email')} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </label>
          <label className="field-block">
            <span>Телефон</span>
            <Input type="tel" placeholder="+7 (___) ___-__-__" {...register('phone')} />
            {errors.phone && <span className="field-error">{errors.phone.message}</span>}
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-block">
            <span>Подразделение</span>
            <Input placeholder="Например, Platform" {...register('department')} />
            {errors.department && <span className="field-error">{errors.department.message}</span>}
          </label>
          <label className="field-block">
            <span>Должность</span>
            <Input placeholder="Например, Product manager" {...register('position')} />
            {errors.position && <span className="field-error">{errors.position.message}</span>}
          </label>
        </div>
        <label className="field-block">
          <span>Комментарий для СБ / админа</span>
          <textarea className="textarea-field" placeholder="Какие зоны доступа нужны?" {...register('note')} />
          {errors.note && <span className="field-error">{errors.note.message}</span>}
        </label>
        <Button type="submit" fullWidth disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Отправляем заявку…' : 'Отправить заявку'}
        </Button>
      </form>
      <p className="auth-form-card__footer">
        Уже есть аккаунт?{' '}
        <Link className="font-semibold text-cyan-300 hover:text-cyan-200" to={routes.login}>
          Войдите
        </Link>
      </p>
    </Card>
  );
}
