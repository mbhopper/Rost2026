import { Link } from 'react-router-dom';
import { routes } from '../../shared/config/routes';
import { Card } from '../../shared/ui/card/Card';

export function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-[560px] space-y-4 text-center">
      <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">404</div>
      <h1 className="text-4xl font-semibold text-white">Маршрут не найден</h1>
      <p className="text-base leading-7 text-slate-400">Похоже, эта страница отсутствует или была перенесена.</p>
      <Link className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950" to={routes.pass}>
        Вернуться к пропуску
      </Link>
    </Card>
  );
}
