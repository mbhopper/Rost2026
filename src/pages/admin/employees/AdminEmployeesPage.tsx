import { QrCode, Ticket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../shared/api/auth';
import type { AdminEmployeeRecord, AdminPassStatusFilter } from '../../../shared/api/admin/types';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';
import { Input } from '../../../shared/ui/input/Input';

const filterOptions: AdminPassStatusFilter[] = ['all', 'active', 'blocked', 'expired', 'revoked', 'pending'];

export function AdminEmployeesPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<AdminPassStatusFilter>('all');
  const [items, setItems] = useState<AdminEmployeeRecord[]>([]);

  useEffect(() => {
    void api.adminDirectoryService.getEmployees({ query, status }).then(setItems);
  }, [query, status]);

  const emptyMessage = useMemo(() => {
    if (query || status !== 'all') {
      return 'Ничего не найдено по текущим фильтрам.';
    }

    return 'Список сотрудников временно пуст.';
  }, [query, status]);

  return (
    <div className="page-stack">
      <Card className="panel-card motion-rise-in">
        <div className="section-heading section-heading--spread">
          <div>
            <p className="section-heading__eyebrow">Directory</p>
            <h1>Сотрудники и пропуска</h1>
            <p className="section-copy">Поиск, фильтрация и просмотр карточек сотрудников в едином каталоге.</p>
          </div>
          <Link to={routes.adminOnboarding}><Button><Ticket size={16} /> Новый сотрудник</Button></Link>
        </div>
        <div className="toolbar-grid">
          <label className="field-block">
            <span>Поиск</span>
            <div className="input-with-icon">
              <QrCode size={16} />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ФИО, email, employee ID" />
            </div>
          </label>
          <label className="field-block">
            <span>Статус пропуска</span>
            <select className="select-field" value={status} onChange={(event) => setStatus(event.target.value as AdminPassStatusFilter)}>
              {filterOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {items.length === 0 ? (
        <Card className="empty-card">
          <h2>Нет данных</h2>
          <p>{emptyMessage}</p>
        </Card>
      ) : (
        <div className="employee-grid">
          {items.map((item) => {
            const primaryPass = item.passes[0];
            return (
              <Card key={item.user.employeeId} className="employee-card motion-rise-in">
                <div className="employee-card__top">
                  <div>
                    <h3>{item.user.fullName}</h3>
                    <p>{item.user.position} · {item.user.department}</p>
                  </div>
                  <span className={`status-pill status-pill--${primaryPass?.status ?? 'pending'}`}>
                    {primaryPass?.status ?? 'pending'}
                  </span>
                </div>
                <dl>
                  <div><dt>ID</dt><dd>{item.user.employeeId}</dd></div>
                  <div><dt>Email</dt><dd>{item.user.email}</dd></div>
                  <div><dt>Локация</dt><dd>{item.location}</dd></div>
                  <div><dt>Пропуск</dt><dd>{primaryPass?.passId ?? '—'}</dd></div>
                </dl>
                <Link className="text-link" to={routes.adminEmployeeDetails(item.user.employeeId)}>
                  Открыть карточку
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
