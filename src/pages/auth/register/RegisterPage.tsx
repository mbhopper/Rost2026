import { Ticket } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  registrationRequestSchema,
  type RegistrationRequestFormValues,
} from '../../../features/auth/lib/schemas';
import { api } from '../../../shared/api/auth';
import { mapAppApiErrorToMessage } from '../../../shared/api/appApi';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';
import { Input } from '../../../shared/ui/input/Input';

const initialForm: RegistrationRequestFormValues = {
  firstName: 'Александр',
  lastName: 'Иванов',
  middleName: '',
  email: 'alex@futurepass.app',
  phone: '+7 (999) 123-45-67',
  department: 'Platform Engineering',
  position: 'Frontend engineer',
  note: 'Нужен доступ в основное здание и переговорные.',
};

function mapIssuesToErrors(result: ReturnType<typeof registrationRequestSchema.safeParse>) {
  if (result.success) {
    return {} as Partial<Record<keyof RegistrationRequestFormValues, string>>;
  }

  return result.error.issues.reduce<Partial<Record<keyof RegistrationRequestFormValues, string>>>(
    (accumulator, issue) => {
      const key = issue.path[0] as keyof RegistrationRequestFormValues | undefined;

      if (key) {
        accumulator[key] = issue.message;
      }

      return accumulator;
    },
    {},
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegistrationRequestFormValues>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationRequestFormValues, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof RegistrationRequestFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const onSubmit = async (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();
    setSubmitError(null);
    const parsed = registrationRequestSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(mapIssuesToErrors(parsed));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await api.requestService.submitRegistrationRequest(parsed.data);
      navigate(`${routes.registerSuccess}?requestId=${encodeURIComponent(result.id)}`);
    } catch (error) {
      setSubmitError(mapAppApiErrorToMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Input value={form.firstName} placeholder="Иван" onChange={(event) => updateField('firstName', event.target.value)} />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </label>
          <label className="field-block">
            <span>Фамилия</span>
            <Input value={form.lastName} placeholder="Иванов" onChange={(event) => updateField('lastName', event.target.value)} />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </label>
        </div>
        <label className="field-block">
          <span>Отчество</span>
          <Input value={form.middleName ?? ''} placeholder="Иванович" onChange={(event) => updateField('middleName', event.target.value)} />
          {errors.middleName && <span className="field-error">{errors.middleName}</span>}
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-block">
            <span>Email</span>
            <Input type="email" value={form.email} placeholder="name@company.ru" onChange={(event) => updateField('email', event.target.value)} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label className="field-block">
            <span>Телефон</span>
            <Input type="tel" value={form.phone} placeholder="+7 (___) ___-__-__" onChange={(event) => updateField('phone', event.target.value)} />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field-block">
            <span>Подразделение</span>
            <Input value={form.department} placeholder="Например, Platform" onChange={(event) => updateField('department', event.target.value)} />
            {errors.department && <span className="field-error">{errors.department}</span>}
          </label>
          <label className="field-block">
            <span>Должность</span>
            <Input value={form.position} placeholder="Например, Product manager" onChange={(event) => updateField('position', event.target.value)} />
            {errors.position && <span className="field-error">{errors.position}</span>}
          </label>
        </div>
        <label className="field-block">
          <span>Комментарий для СБ / админа</span>
          <textarea
            className="textarea-field"
            placeholder="Какие зоны доступа нужны?"
            value={form.note ?? ''}
            onChange={(event) => updateField('note', event.target.value)}
          />
          {errors.note && <span className="field-error">{errors.note}</span>}
        </label>
        {submitError && (
          <div className="field-error" role="alert" aria-live="polite">
            {submitError}
          </div>
        )}
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
