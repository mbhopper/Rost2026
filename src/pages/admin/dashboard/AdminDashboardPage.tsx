import { BellRing, Clock3, ShieldCheck, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { mockApi } from '../../../shared/api/mockApi';
import type { AdminOverview } from '../../../shared/api/admin/types';
import { Card } from '../../../shared/ui/card/Card';

const overviewIcons = [ShieldCheck, Ticket, BellRing, Clock3];

export function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    void mockApi.adminDirectoryService.getOverview().then(setOverview);
  }, []);

  const summary = overview
    ? [
        { label: 'Активные сотрудники', value: overview.activeEmployees },
        { label: 'Активные пропуска', value: overview.activePasses },
        { label: 'Заблокированные', value: overview.blockedPasses },
        { label: 'Истекают сегодня', value: overview.expiringToday },
      ]
    : [];

  return (
    <div className="page-stack">
      <Card className="hero-card hero-card--admin">
        <div className="hero-card__badge"><BellRing size={14} /> Admin dashboard</div>
        <div className="hero-card__content">
          <div>
            <h1>Мониторинг цифровых пропусков</h1>
            <p>
              Панель предназначена только для администраторов. Данные пока идут из
              mock directory service и готовы к замене на backend adapter.
            </p>
          </div>
        </div>
      </Card>

      <section className="stats-grid">
        {summary.map((item, index) => {
          const Icon = overviewIcons[index];
          return (
            <Card key={item.label} className="stat-card">
              <span><Icon size={16} /> {item.label}</span>
              <strong>{item.value}</strong>
              <p>Mock KPI для MVP admin console.</p>
            </Card>
          );
        })}
      </section>

      <Card className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Alerts</p>
            <h2>Последние сигналы системы</h2>
          </div>
        </div>
        <div className="alert-grid">
          {(overview?.recentAlerts ?? []).map((alert) => (
            <article key={alert.id} className={`alert-card alert-card--${alert.tone}`}>
              <div className="alert-card__icon"><BellRing size={16} /></div>
              <div>
                <strong>{alert.title}</strong>
                <p>{alert.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
