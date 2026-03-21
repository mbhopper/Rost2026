import { BellRing, Clock3, ShieldCheck, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../shared/api/auth';
import type { AdminOverview } from '../../../shared/api/admin/types';
import { routes } from '../../../shared/config/routes';
import { Button } from '../../../shared/ui/button/Button';
import { Card } from '../../../shared/ui/card/Card';

const overviewIcons = [ShieldCheck, Ticket, BellRing, Clock3];

export function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    void api.adminDirectoryService.getOverview().then(setOverview);
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
      <Card className="hero-card hero-card--admin motion-rise-in">
        <div className="hero-card__badge"><BellRing size={14} /> Admin dashboard</div>
        <div className="hero-card__content">
          <div>
            <h1>Мониторинг цифровых пропусков</h1>
            <p>
              Панель предназначена только для администраторов и показывает сводку по сотрудникам, пропускам и событиям доступа.
            </p>
          </div>
          <Link to={routes.adminOnboarding}><Button><Ticket size={16} /> Оформить сотрудника</Button></Link>
        </div>
      </Card>

      <section className="stats-grid">
        {summary.map((item, index) => {
          const Icon = overviewIcons[index];
          return (
            <Card key={item.label} className="stat-card motion-rise-in">
              <span><Icon size={16} /> {item.label}</span>
              <strong>{item.value}</strong>
              <p>Оперативный показатель по текущему состоянию системы.</p>
            </Card>
          );
        })}
      </section>

      <Card className="panel-card motion-rise-in">
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
