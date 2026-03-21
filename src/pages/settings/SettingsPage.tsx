import { BellRing, Clock3, Settings, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../app/store';
import type { ThemeMode } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';
import { cn } from '../../shared/lib/cn';

const themeOptions: Array<{ value: ThemeMode; label: string; description: string; icon: typeof Settings }> = [
  {
    value: 'system',
    label: 'Системная',
    description: 'Следовать параметрам устройства пользователя.',
    icon: Settings,
  },
  {
    value: 'dark',
    label: 'Темная',
    description: 'Основной контрастный режим для рабочего интерфейса.',
    icon: ShieldCheck,
  },
  {
    value: 'light',
    label: 'Светлая',
    description: 'Упрощенный режим для демонстраций и печати.',
    icon: Clock3,
  },
];

const mvpToggles = [
  {
    key: 'demoMode',
    label: 'Демо-режим',
    description: 'Показывает демонстрационные подсказки и mock-сценарии в интерфейсе MVP.',
  },
  {
    key: 'secureScreenMode',
    label: 'Защищенный экран',
    description: 'Подготавливает интерфейс к сокрытию чувствительных данных на общих экранах.',
  },
] as const;

const notificationToggles = [
  {
    key: 'securityEvents',
    label: 'События безопасности',
    description: 'Уведомления о новых входах, ограничениях доступа и смене состояния аккаунта.',
  },
  {
    key: 'passUpdates',
    label: 'Обновления пропуска',
    description: 'Изменения по выпуску, продлению и блокировке цифрового пропуска.',
  },
  {
    key: 'sessionAlerts',
    label: 'Сессии и устройства',
    description: 'Сводки по активным устройствам и обновлениям проходной сессии.',
  },
] as const;

interface ToggleCardProps {
  checked: boolean;
  description: string;
  label: string;
  onChange: () => void;
}

function ToggleCard({ checked, description, label, onChange }: ToggleCardProps) {
  return (
    <div className="settings-toggle-card">
      <div>
        <h3 className="text-sm font-semibold text-white">{label}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? 'включено' : 'выключено'}`}
        className={cn('settings-switch focus-ring', checked && 'settings-switch--checked')}
        onClick={onChange}
      >
        <span className={cn('settings-switch__thumb', checked && 'settings-switch__thumb--checked')} aria-hidden="true" />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const settings = useAppStore((state) => state.settings);
  const toggleSetting = useAppStore((state) => state.toggleSetting);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const toggleNotification = useAppStore((state) => state.toggleNotification);

  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Настройки</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Параметры интерфейса и уведомлений</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Настройки сохраняются локально в браузере и восстанавливаются после перезагрузки страницы.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300" aria-hidden="true">
            <Settings size={20} />
          </div>
        </div>
      </Card>

      <Card className="space-y-6">
        <fieldset className="settings-fieldset">
          <legend className="settings-legend">Тема интерфейса</legend>
          <p className="text-sm leading-6 text-slate-400">
            Выберите режим отображения для рабочего кабинета сотрудника.
          </p>
          <div className="settings-theme-grid">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = settings.themeMode === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn('settings-theme-option focus-ring', isActive && 'settings-theme-option--active')}
                  aria-pressed={isActive}
                  aria-label={`Тема интерфейса: ${option.label}`}
                  onClick={() => setThemeMode(option.value)}
                >
                  <div className="settings-theme-option__icon" aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{option.label}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </fieldset>
      </Card>

      <Card className="space-y-6">
        <fieldset className="settings-fieldset">
          <legend className="settings-legend">Режимы MVP</legend>
          <div className="space-y-4">
            {mvpToggles.map((item) => (
              <ToggleCard
                key={item.key}
                checked={settings[item.key]}
                label={item.label}
                description={item.description}
                onChange={() => toggleSetting(item.key)}
              />
            ))}
          </div>
        </fieldset>
      </Card>

      <Card className="space-y-6">
        <fieldset className="settings-fieldset">
          <legend className="settings-legend">Уведомления</legend>
          <div className="space-y-4">
            {notificationToggles.map((item) => (
              <ToggleCard
                key={item.key}
                checked={settings.notifications[item.key]}
                label={item.label}
                description={item.description}
                onChange={() => toggleNotification(item.key)}
              />
            ))}
          </div>
        </fieldset>
      </Card>

      <Card className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
          <BellRing size={14} /> Доступность и безопасность
        </div>
        <p className="text-sm leading-6 text-slate-400">
          Все переключатели имеют <code>aria-label</code>, заметные состояния фокуса и сгруппированы по семантическим секциям для клавиатурной навигации.
        </p>
      </Card>
    </div>
  );
}
