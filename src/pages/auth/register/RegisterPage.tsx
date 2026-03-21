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
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  note: '',
};

function mapIssuesToErrors(
  result: ReturnType<typeof registrationRequestSchema.safeParse>,
) {
  if (result.success) {
    return {} as Partial<Record<keyof RegistrationRequestFormValues, string>>;
  }

  return result.error.issues.reduce<
    Partial<Record<keyof RegistrationRequestFormValues, string>>
  >((accumulator, issue) => {
    const key = issue.path[0] as
      | keyof RegistrationRequestFormValues
      | undefined;

    if (key) {
      accumulator[key] = issue.message;
    }

    return accumulator;
  }, {});
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegistrationRequestFormValues>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegistrationRequestFormValues, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (
    field: keyof RegistrationRequestFormValues,
    value: string,
  ) => {
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
      const result = await api.requestService.submitRegistrationRequest(
        parsed.data,
      );
      navigate(
        `${routes.registerSuccess}?requestId=${encodeURIComponent(result.id)}`,
      );
    } catch (error) {
      setSubmitError(mapAppApiErrorToMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rt-screen rt-screen--form motion-page-fade">
      <Card className="auth-form-card auth-form-card--register rt-form-card rt-form-card--register motion-rise-in">
        <div className="auth-form-card__intro rt-form-card__intro">
          <h2>РЕГИСТРАЦИЯ</h2>
        </div>
        <form className="auth-form-card__form" onSubmit={onSubmit} noValidate>
          <label className="field-block">
            <span>Имя</span>
            <Input
              className="Input--poster"
              value={form.firstName}
              placeholder="Имя"
              onChange={(event) => updateField('firstName', event.target.value)}
            />
            {errors.firstName && (
              <span className="field-error">{errors.firstName}</span>
            )}
          </label>
          <label className="field-block">
            <span>Фамилия</span>
            <Input
              className="Input--poster"
              value={form.lastName}
              placeholder="Фамилия"
              onChange={(event) => updateField('lastName', event.target.value)}
            />
            {errors.lastName && (
              <span className="field-error">{errors.lastName}</span>
            )}
          </label>
          <label className="field-block">
            <span>Email</span>
            <Input
              className="Input--poster"
              type="email"
              value={form.email}
              placeholder="Почта"
              onChange={(event) => updateField('email', event.target.value)}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </label>
          <label className="field-block">
            <span>Телефон</span>
            <Input
              className="Input--poster"
              type="tel"
              value={form.phone}
              placeholder="Телефон"
              onChange={(event) => updateField('phone', event.target.value)}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </label>
          <label className="field-block">
            <span>Подразделение</span>
            <Input
              className="Input--poster"
              value={form.department}
              placeholder="Подразделение"
              onChange={(event) =>
                updateField('department', event.target.value)
              }
            />
            {errors.department && (
              <span className="field-error">{errors.department}</span>
            )}
          </label>
          <label className="field-block">
            <span>Должность</span>
            <Input
              className="Input--poster"
              value={form.position}
              placeholder="Должность"
              onChange={(event) => updateField('position', event.target.value)}
            />
            {errors.position && (
              <span className="field-error">{errors.position}</span>
            )}
          </label>
          <label className="field-block">
            <span>Комментарий</span>
            <textarea
              className="textarea-field textarea-field--poster"
              placeholder="Комментарий"
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
          <p className="rt-form-card__legal">
            Я ознакомлен(-а) с{' '}
            <Link to={routes.login}>политикой конфиденциальности</Link>
          </p>
          <Button
            type="submit"
            className="rt-form-card__submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'ОТПРАВЛЯЕМ…' : 'ОТПРАВИТЬ'}
          </Button>
        </form>
      </Card>
      <div className="rt-pedestal rt-pedestal--back">
        <span>НАЗАД НА ГЛАВНУЮ</span>
        <Link
          to={routes.root}
          className="rt-pedestal__badge rt-pedestal__badge--back"
        >
          ↩
        </Link>
      </div>
    </section>
  );
}
