import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { AdminEmployeeRecord } from '../../../shared/api/admin/types';
import { mockApi } from '../../../shared/api/mockApi';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';

export function AdminEmployeeDetailsPage() {
  const { employeeId = '' } = useParams();
  const [record, setRecord] = useState<AdminEmployeeRecord | null>(null);

  useEffect(() => {
    void mockApi.adminDirectoryService.getEmployeeById(employeeId).then(setRecord);
  }, [employeeId]);

  if (!record) {
    return (
      <Card className="empty-card">
        <h1>Карточка не найдена</h1>
        <p>Для этого employee ID нет записи в mock admin directory.</p>
        <Link to={routes.adminEmployees}><Button>Назад к списку</Button></Link>
      </Card>
    );
  }

  return (
    <div className="page-stack">
      <Card className="panel-card">
        <div className="section-heading section-heading--spread">
          <div>
            <p className="section-heading__eyebrow">Employee record</p>
            <h1>{record.user.fullName}</h1>
            <p className="section-copy">{record.user.position} · {record.user.department}</p>
          </div>
          <Link to={routes.adminEmployees}><Button variant="secondary">К списку</Button></Link>
        </div>
        <div className="details-grid">
          <article className="detail-card">
            <span>Email</span>
            <strong>{record.user.email}</strong>
          </article>
          <article className="detail-card">
            <span>Телефон</span>
            <strong>{record.user.phone}</strong>
          </article>
          <article className="detail-card">
            <span>Последний проход</span>
            <strong>{format(new Date(record.lastEntryAt), 'dd.MM.yyyy HH:mm')}</strong>
          </article>
          <article className="detail-card">
            <span>Локация</span>
            <strong>{record.location}</strong>
          </article>
        </div>
      </Card>

      <Card className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Pass management</p>
            <h2>Статусы пропуска</h2>
          </div>
        </div>
        <div className="employee-grid">
          {record.passes.map((pass) => (
            <article key={pass.passId} className="employee-card">
              <div className="employee-card__top">
                <div>
                  <h3>{pass.passId}</h3>
                  <p>{pass.facilityName}</p>
                </div>
                <span className={`status-pill status-pill--${pass.status}`}>{pass.status}</span>
              </div>
              <dl>
                <div><dt>Доступ</dt><dd>{pass.accessLevel}</dd></div>
                <div><dt>Выдан</dt><dd>{format(new Date(pass.issuedAt), 'dd.MM.yyyy')}</dd></div>
                <div><dt>Истекает</dt><dd>{format(new Date(pass.expiresAt), 'dd.MM.yyyy')}</dd></div>
                <div><dt>Mock action</dt><dd>{pass.isBlocked ? 'Снять блокировку' : 'Заблокировать / отозвать'}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
