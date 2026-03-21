import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import {
  supportRequestSchema,
  type SupportRequestFormValues,
} from '../../features/auth/lib/schemas';
import { mockApi } from '../../shared/api/mockApi';
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

export function SupportPage() {
  const authStatus = useAppStore((state) => state.authStatus);
  const currentRole = useAppStore((state) => state.currentRole);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupportRequestFormValues>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: {
      email: 'help@futurepass.app',
      topic: topicOptions[0],
      message: 'Не проходит QR на входе в здание, нужна проверка статуса пропуска.',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await mockApi.requestService.submitSupportRequest(values);
    navigate(`${routes.supportSuccess}?requestId=${encodeURIComponent(result.id)}`);
  });

  return (
    <main className="poster-shell poster-shell--auth poster-shell--standalone">
      <div className="poster-shell__blob poster-shell__blob--one" />
      <div className="poster-shell__blob poster-shell__blob--two" />
      <div className="poster-shell__blob poster-shell__blob--three" />
      <div className="poster-frame motion-page-fade">
        <header className="poster-topbar poster-topbar--private">
          <div className="poster-brand">
            <span className="poster-brand__mark" aria-hidden="true" />
            <span>Ростелеком</span>
          </div>
          <nav className="poster-actions" aria-label="Навигация страницы поддержки">
            {authStatus === 'authenticated' ? (
              <Link to={currentRole === 'admin' ? routes.adminDashboard : routes.profile} className="poster-action">
                <UserRound size={14} /> Профиль
              </Link>
            ) : (
              <>
                <Link to={routes.login} className="poster-action">Вход</Link>
                <Link to={routes.register} className="poster-action">Регистрация</Link>
              </>
            )}
          </nav>
        </header>

        <section className="poster-page poster-page--standalone">
          <div className="poster-page__copy poster-page__copy--centered">
            <p className="poster-page__eyebrow">Support desk</p>
            <h1>ОБРАТНАЯ СВЯЗЬ</h1>
            <p>Оставьте обращение по пропуску, QR или регистрации — ответ вернётся в mock-support pipeline.</p>
          </div>

          <Card className="poster-form-card motion-rise-in">
            <form className="auth-form-card__form" onSubmit={onSubmit} noValidate>
              <label className="field-block">
                <span>Email</span>
                <Input type="email" placeholder="name@company.ru" {...register('email')} />
                {errors.email && <span className="field-error">{errors.email.message}</span>}
              </label>
              <label className="field-block">
                <span>Тема</span>
                <select className="select-field" {...register('topic')}>
                  {topicOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.topic && <span className="field-error">{errors.topic.message}</span>}
              </label>
              <label className="field-block">
                <span>Обращение</span>
                <textarea className="textarea-field textarea-field--large" placeholder="Опишите проблему" {...register('message')} />
                {errors.message && <span className="field-error">{errors.message.message}</span>}
              </label>
              <Button type="submit" fullWidth disabled={isSubmitting}>
                <BellRing size={16} /> {isSubmitting ? 'Отправляем…' : 'Отправить'}
              </Button>
            </form>
          </Card>

          <div className="poster-pedestal poster-pedestal--backdrop">
            <span>Назад на главную</span>
            <Link to={authStatus === 'authenticated' ? (currentRole === 'admin' ? routes.adminDashboard : routes.dashboard) : routes.login} className="poster-pedestal__back-link">
              <span className="poster-pedestal__badge">↩</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
