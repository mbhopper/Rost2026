import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  adminOnboardingSchema,
  type AdminOnboardingFormValues,
} from '../../../features/auth/lib/schemas';
import { mockApi } from '../../../shared/api/mockApi';
import type { AdminEmployeeRecord } from '../../../shared/api/admin/types';
import type { RegistrationRequest } from '../../../shared/api/requests/types';
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

export function AdminOnboardingPage() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [createdRecord, setCreatedRecord] = useState<AdminEmployeeRecord | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminOnboardingFormValues>({
    resolver: zodResolver(adminOnboardingSchema),
    defaultValues,
  });

  useEffect(() => {
    void mockApi.requestService.getRegistrationRequests().then(setRequests);
  }, [createdRecord]);

  const fillFromRequest = (request: RegistrationRequest) => {
    setValue('firstName', request.firstName);
    setValue('lastName', request.lastName);
    setValue('middleName', request.middleName ?? '');
    setValue('email', request.email);
    setValue('phone', request.phone);
    setValue('department', request.department);
    setValue('position', request.position);
    setValue('note', request.note ?? '');
    setValue('requestId', request.id);
  };

  const onSubmit = handleSubmit(async (values) => {
    const record = await mockApi.adminDirectoryService.registerEmployee(values);
    setCreatedRecord(record);
    reset(defaultValues);
  });

  return (
    <div className="page-stack">
      <Card className="panel-card motion-rise-in">
        <div className="section-heading section-heading--spread">
          <div>
            <p className="section-heading__eyebrow">Onboarding</p>
            <h1>Регистрация сотрудника администратором</h1>
            <p className="section-copy">
              Админ может открыть вход по заявке или вручную завести нового сотрудника и сразу выпустить пропуск.
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
                <Input {...register('firstName')} />
                {errors.firstName && <span className="field-error">{errors.firstName.message}</span>}
              </label>
              <label className="field-block">
                <span>Фамилия</span>
                <Input {...register('lastName')} />
                {errors.lastName && <span className="field-error">{errors.lastName.message}</span>}
              </label>
            </div>
            <label className="field-block">
              <span>Отчество</span>
              <Input {...register('middleName')} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-block">
                <span>Email</span>
                <Input type="email" {...register('email')} />
                {errors.email && <span className="field-error">{errors.email.message}</span>}
              </label>
              <label className="field-block">
                <span>Телефон</span>
                <Input {...register('phone')} />
                {errors.phone && <span className="field-error">{errors.phone.message}</span>}
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-block">
                <span>Подразделение</span>
                <Input {...register('department')} />
                {errors.department && <span className="field-error">{errors.department.message}</span>}
              </label>
              <label className="field-block">
                <span>Должность</span>
                <Input {...register('position')} />
                {errors.position && <span className="field-error">{errors.position.message}</span>}
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-block">
                <span>Объект</span>
                <Input {...register('facilityName')} />
                {errors.facilityName && <span className="field-error">{errors.facilityName.message}</span>}
              </label>
              <label className="field-block">
                <span>Уровень доступа</span>
                <Input {...register('accessLevel')} />
                {errors.accessLevel && <span className="field-error">{errors.accessLevel.message}</span>}
              </label>
            </div>
            <label className="field-block">
              <span>Комментарий</span>
              <textarea className="textarea-field" {...register('note')} />
            </label>
            <Button type="submit" disabled={isSubmitting}>
              <UserRound size={16} /> {isSubmitting ? 'Создаём запись…' : 'Зарегистрировать сотрудника'}
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
              {requests.map((request) => (
                <article key={request.id} className={`request-card request-card--${request.status}`}>
                  <div className="request-card__top">
                    <div>
                      <strong>{request.lastName} {request.firstName}</strong>
                      <p>{request.position} · {request.department}</p>
                    </div>
                    <span className={`status-pill status-pill--${request.status === 'approved' ? 'active' : 'pending'}`}>
                      {request.status}
                    </span>
                  </div>
                  <p>{request.note || 'Без комментария.'}</p>
                  <small>{format(new Date(request.submittedAt), 'dd.MM.yyyy HH:mm')}</small>
                  <Button type="button" variant="secondary" onClick={() => fillFromRequest(request)} disabled={request.status === 'approved'}>
                    {request.status === 'approved' ? 'Уже оформлен' : 'Подставить в форму'}
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
