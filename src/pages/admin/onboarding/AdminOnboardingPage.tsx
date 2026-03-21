import { format } from 'date-fns';
import { ShieldCheck, UserRound } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  adminOnboardingSchema,
  type AdminOnboardingFormValues,
} from '../../../features/auth/lib/schemas';
import { api } from '../../../shared/api/auth';
import { mapAppApiErrorToMessage } from '../../../shared/api/appApi';
import type { AdminEmployeeRecord } from '../../../shared/api/admin/types';
import {
  registrationRequestStatusLabels,
  type RegistrationRequest,
} from '../../../shared/api/requests/types';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';
import { Input } from '../../../shared/ui/input/Input';

const defaultValues: AdminOnboardingFormValues = {
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  note: '',
  facilityName: 'Ростелеком · Башня А',
  accessLevel: 'L2 · Основной офис',
  requestId: '',
};

function mapIssuesToErrors(result: ReturnType<typeof adminOnboardingSchema.safeParse>) {
  if (result.success) {
    return {} as Partial<Record<keyof AdminOnboardingFormValues, string>>;
  }

  return result.error.issues.reduce<Partial<Record<keyof AdminOnboardingFormValues, string>>>(
    (accumulator, issue) => {
      const key = issue.path[0] as keyof AdminOnboardingFormValues | undefined;

      if (key) {
        accumulator[key] = issue.message;
      }

      return accumulator;
    },
    {},
  );
}

export function AdminOnboardingPage() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [createdRecord, setCreatedRecord] = useState<AdminEmployeeRecord | null>(null);
  const [form, setForm] = useState<AdminOnboardingFormValues>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof AdminOnboardingFormValues, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRequests = useCallback(async () => {
    const nextRequests = await api.adminDirectoryService.getRegistrationRequests();
    setRequests(nextRequests);
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const updateField = (field: keyof AdminOnboardingFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const fillFromRequest = (request: RegistrationRequest) => {
    setForm((current) => ({
      ...current,
      firstName: request.firstName,
      lastName: request.lastName,
      middleName: request.middleName ?? '',
      email: request.email,
      phone: request.phone,
      department: request.department,
      position: request.position,
      note: request.note ?? '',
      requestId: request.id,
    }));
    setErrors({});
    setSubmitError(null);
  };

  const onSubmit = async (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();
    setSubmitError(null);
    const parsed = adminOnboardingSchema.safeParse(form);

    if (!parsed.success) {
      setErrors(mapIssuesToErrors(parsed));
      return;
    }

    setIsSubmitting(true);

    try {
      const record = parsed.data.requestId
        ? await api.adminDirectoryService.approveRegistrationRequest({
            ...parsed.data,
            requestId: parsed.data.requestId,
          })
        : await api.adminDirectoryService.registerEmployee(parsed.data);

      setCreatedRecord(record);
      setForm(defaultValues);
      setErrors({});
      await loadRequests();
    } catch (error) {
      setSubmitError(mapAppApiErrorToMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <Card className="panel-card motion-rise-in">
        <div className="section-heading section-heading--spread">
          <div>
            <p className="section-heading__eyebrow">Onboarding</p>
            <h1>Регистрация сотрудника администратором</h1>
            <p className="section-copy">
              Администратор может обработать входящую заявку или вручную завести нового сотрудника и сразу выпустить пропуск.
            </p>
          </div>
          {createdRecord ? (
            <div className="inline-success-chip">
              <ShieldCheck size={16} /> {createdRecord.user.employeeId}
            </div>
          ) : null}
        </div>

        <form className="admin-onboarding-grid" onSubmit={onSubmit} noValidate>
          <div className="admin-onboarding-grid__form">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-block">
                <span>Имя</span>
                <Input value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </label>
              <label className="field-block">
                <span>Фамилия</span>
                <Input value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </label>
            </div>
            <label className="field-block">
              <span>Отчество</span>
              <Input value={form.middleName ?? ''} onChange={(event) => updateField('middleName', event.target.value)} />
              {errors.middleName && <span className="field-error">{errors.middleName}</span>}
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-block">
                <span>Email</span>
                <Input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </label>
              <label className="field-block">
                <span>Телефон</span>
                <Input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-block">
                <span>Подразделение</span>
                <Input value={form.department} onChange={(event) => updateField('department', event.target.value)} />
                {errors.department && <span className="field-error">{errors.department}</span>}
              </label>
              <label className="field-block">
                <span>Должность</span>
                <Input value={form.position} onChange={(event) => updateField('position', event.target.value)} />
                {errors.position && <span className="field-error">{errors.position}</span>}
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-block">
                <span>Объект</span>
                <Input value={form.facilityName} onChange={(event) => updateField('facilityName', event.target.value)} />
                {errors.facilityName && <span className="field-error">{errors.facilityName}</span>}
              </label>
              <label className="field-block">
                <span>Уровень доступа</span>
                <Input value={form.accessLevel} onChange={(event) => updateField('accessLevel', event.target.value)} />
                {errors.accessLevel && <span className="field-error">{errors.accessLevel}</span>}
              </label>
            </div>
            <label className="field-block">
              <span>Комментарий</span>
              <textarea className="textarea-field" value={form.note ?? ''} onChange={(event) => updateField('note', event.target.value)} />
              {errors.note && <span className="field-error">{errors.note}</span>}
            </label>
            {submitError && (
              <div className="field-error" role="alert" aria-live="polite">
                {submitError}
              </div>
            )}
            <Button type="submit" disabled={isSubmitting}>
              <UserRound size={16} /> {isSubmitting ? 'Оформляем сотрудника…' : 'Оформить сотрудника'}
            </Button>
          </div>

          <div className="admin-onboarding-grid__queue">
            <div className="section-heading">
              <div>
                <p className="section-heading__eyebrow">Queue</p>
                <h2>Входящие заявки</h2>
              </div>
            </div>
            <div className="request-queue">
              {requests.map((request) => {
                const isApproved = request.status === 'approved';

                return (
                  <article key={request.id} className={`request-card request-card--${request.status}`}>
                    <div className="request-card__top">
                      <div>
                        <strong>{request.lastName} {request.firstName}</strong>
                        <p>{request.position} · {request.department}</p>
                      </div>
                      <span className={`status-pill status-pill--${isApproved ? 'active' : 'pending'}`}>
                        {registrationRequestStatusLabels[request.status]}
                      </span>
                    </div>
                    <p>{request.note || 'Без комментария.'}</p>
                    <small>{format(new Date(request.submittedAt), 'dd.MM.yyyy HH:mm')}</small>
                    <Button type="button" variant="secondary" onClick={() => fillFromRequest(request)} disabled={isApproved}>
                      {isApproved ? 'Уже оформлен' : 'Подставить в форму'}
                    </Button>
                  </article>
                );
              })}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
