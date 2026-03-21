import { BellRing, UserRound } from 'lucide-react';
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
  const currentRole = useAppStore((state) => state.currentRole);
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
    <main className="auth-shell auth-shell--standalone">
      <div className="poster-shell__blob poster-shell__blob--one" />
      <div className="poster-shell__blob poster-shell__blob--two" />
      <div className="poster-shell__blob poster-shell__blob--three" />

      <div className="auth-shell__content auth-shell__content--standalone motion-page-fade">
        <header className="poster-topbar auth-shell__topbar">
          <div className="poster-brand">
            <span className="poster-brand__mark" aria-hidden="true" />
            <span>Ростелеком</span>
          </div>
          <nav
            className="poster-actions auth-shell__actions"
            aria-label="Навигация страницы поддержки"
          >
            {authStatus === 'authenticated' ? (
              <Link
                to={
                  currentRole === 'admin'
                    ? routes.adminDashboard
                    : routes.profile
                }
                className="poster-action"
              >
                <UserRound size={14} /> Профиль
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
          </nav>
        </header>

        <section className="auth-stage auth-stage--standalone auth-stage--support">
          <div className="auth-stage__hero">
            <div className="auth-stage__headline auth-entry-title motion-entry-title">
              <p className="poster-page__eyebrow">Служба поддержки</p>
              <h1 className="auth-entry-wordmark auth-entry-wordmark--compact">
                <span>ОБРАТНАЯ</span>
                <span>СВЯЗЬ</span>
              </h1>
            </div>
            <div className="poster-page__copy auth-stage__copy">
              <p>
                Оставьте обращение по пропуску, QR или регистрации — обращение
                будет передано в службу поддержки.
              </p>
            </div>
          </div>

          <div className="auth-stage__panel auth-stage__panel--floating">
            <Card className="poster-form-card motion-rise-in">
              <form
                className="auth-form-card__form"
                onSubmit={onSubmit}
                noValidate
              >
                <label className="field-block">
                  <span>Email</span>
                  <Input
                    className="Input--poster"
                    type="email"
                    placeholder="name@company.ru"
                    value={form.email}
                    onChange={(event) =>
                      updateField('email', event.target.value)
                    }
                  />
                  {errors.email && (
                    <span className="field-error">{errors.email}</span>
                  )}
                </label>
                <label className="field-block">
                  <span>Тема</span>
                  <select
                    className="select-field select-field--poster"
                    value={form.topic}
                    onChange={(event) =>
                      updateField('topic', event.target.value)
                    }
                  >
                    {topicOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.topic && (
                    <span className="field-error">{errors.topic}</span>
                  )}
                </label>
                <label className="field-block">
                  <span>Обращение</span>
                  <textarea
                    className="textarea-field textarea-field--large textarea-field--poster"
                    placeholder="Опишите проблему"
                    value={form.message}
                    onChange={(event) =>
                      updateField('message', event.target.value)
                    }
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
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  <BellRing size={16} />{' '}
                  {isSubmitting ? 'Отправляем…' : 'Отправить'}
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
