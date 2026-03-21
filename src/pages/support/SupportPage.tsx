import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import {
  supportRequestSchema,
  type SupportRequestFormValues,
} from '../../features/auth/lib/schemas';
import { api } from '../../shared/api/auth';
import { mapAppApiErrorToMessage } from '../../shared/api/appApi';
import { routes } from '../../shared/config/routes';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';
import { Input } from '../../shared/ui/input/Input';

const topicOptions = [
  'Проблема с проходом',
  'Ошибка в профиле',
  'Новый сотрудник / пропуск',
  'Другое',
];

const initialForm: SupportRequestFormValues = {
  email: '',
  topic: topicOptions[0],
  message: '',
};

function mapIssuesToErrors(
  result: ReturnType<typeof supportRequestSchema.safeParse>,
) {
  if (result.success) {
    return {} as Partial<Record<keyof SupportRequestFormValues, string>>;
  }

  return result.error.issues.reduce<
    Partial<Record<keyof SupportRequestFormValues, string>>
  >((accumulator, issue) => {
    const key = issue.path[0] as keyof SupportRequestFormValues | undefined;

    if (key) {
      accumulator[key] = issue.message;
    }

    return accumulator;
  }, {});
}

export function SupportPage() {
  const authStatus = useAppStore((state) => state.authStatus);
  const navigate = useNavigate();
  const [form, setForm] = useState<SupportRequestFormValues>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SupportRequestFormValues, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (
    field: keyof SupportRequestFormValues,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const onSubmit = async (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();
    setSubmitError(null);
    const parsed = supportRequestSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(mapIssuesToErrors(parsed));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await api.requestService.submitSupportRequest(parsed.data);
      navigate(
        `${routes.supportSuccess}?requestId=${encodeURIComponent(result.id)}`,
      );
    } catch (error) {
      setSubmitError(mapAppApiErrorToMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="rt-stage-shell rt-stage-shell--public">
      <div className="poster-shell__blob poster-shell__blob--one" />
      <div className="poster-shell__blob poster-shell__blob--two" />
      <div className="poster-shell__blob poster-shell__blob--three" />
      <div className="poster-shell__blob poster-shell__blob--four" />
      <header className="rt-topbar">
        <div className="poster-brand rt-topbar__brand">
          <span className="poster-brand__mark" aria-hidden="true" />
          <span>Ростелеком</span>
        </div>
        <div className="rt-topbar__actions">
          {authStatus === 'authenticated' ? (
            <Link to={routes.profile} className="poster-action">
              Профиль
            </Link>
          ) : (
            <>
              <Link to={routes.login} className="poster-action">
                Вход
              </Link>
              <Link to={routes.register} className="poster-action">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </header>
      <section className="rt-screen rt-screen--form motion-page-fade">
        <Card className="auth-form-card rt-form-card motion-rise-in">
          <div className="auth-form-card__intro rt-form-card__intro">
            <h2>ОБРАТНАЯ СВЯЗЬ</h2>
          </div>
          <form className="auth-form-card__form" onSubmit={onSubmit} noValidate>
            <label className="field-block">
              <span>Email</span>
              <Input
                className="Input--poster"
                type="email"
                placeholder="Почта"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </label>
            <label className="field-block rt-hidden-field">
              <span>Тема</span>
              <select
                className="select-field select-field--poster"
                value={form.topic}
                onChange={(event) => updateField('topic', event.target.value)}
              >
                {topicOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-block">
              <span>Обращение</span>
              <textarea
                className="textarea-field textarea-field--large textarea-field--poster"
                placeholder="Обращение"
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
              />
              {errors.message && (
                <span className="field-error">{errors.message}</span>
              )}
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
            to={authStatus === 'authenticated' ? routes.dashboard : routes.root}
            className="rt-pedestal__badge rt-pedestal__badge--back"
          >
            ↩
          </Link>
        </div>
      </section>
    </main>
  );
}
