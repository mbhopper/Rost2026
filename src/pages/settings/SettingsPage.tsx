import { Settings } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { Button } from '../../shared/ui/button/Button';
import { Card } from '../../shared/ui/card/Card';

const items = [
  { key: 'securityAlerts', label: 'Security alerts для новых устройств', description: 'Получать уведомления о входах с новых браузеров и телефонов.' },
  { key: 'weeklyDigest', label: 'Еженедельный digest активности', description: 'Сводка по входам, ротациям QR и временным зонам доступа.' },
  { key: 'priorityReminders', label: 'Напоминания о приоритетном входе', description: 'Пуши перед событиями и вечерними слотами в лаборатории.' },
] as const;

export function SettingsPage() {
  const settings = useAppStore((state) => state.settings);
  const toggleSetting = useAppStore((state) => state.toggleSetting);

  return (
    <Card className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Preferences</div>
          <h1 className="mt-2 text-3xl font-semibold text-white">Настройки доступа</h1>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300"><Settings size={20} /></div>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <label key={item.key} className="flex cursor-pointer items-start justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/30 p-5">
            <div>
              <div className="text-sm font-semibold text-white">{item.label}</div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
            </div>
            <input
              className="mt-1 h-5 w-5 accent-cyan-400"
              type="checkbox"
              checked={settings[item.key]}
              onChange={() => toggleSetting(item.key)}
            />
          </label>
        ))}
      </div>
      <Button>Сохранить изменения</Button>
    </Card>
  );
}
