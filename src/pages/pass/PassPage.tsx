import { PassSummary } from '../../features/pass/PassSummary';
import { QrSessionPanel } from '../../features/qr-session/QrSessionPanel';

export function PassPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]">
      <PassSummary />
      <QrSessionPanel />
    </div>
  );
}
