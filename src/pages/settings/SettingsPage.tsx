import { BellRing, Clock3, Settings, ShieldCheck } from 'lucide-react';
import { useId } from 'react';
import { useAppStore, type ThemeMode } from '../../app/store';
import { Card } from '../../shared/ui/card/Card';

const themeOptions: Array<{
  value: ThemeMode;
  label: string;
  description: string;
  icon: typeof Settings;
}> = [
  {
    value: 'system',
    label: 'Системная',
    description: 'Следовать системной теме устройства.',
    icon: Settings,
  },
  {
    value: 'dark',
    label: 'Тёмная',
    description: 'Использовать тёмную тему для рабочего интерфейса.',
    icon: ShieldCheck,
  },
  {
    value: 'light',
    label: 'Светлая',
    description: 'Переключиться на светлую тему кабинета.',
    icon: Clock3,
  },
];

const behaviorSettings = [
  {
    key: 'demoMode',
    label: 'Демо-режим',
    description: 'Показывать демо-маркеры и подсказки для презентации MVP.',
  },
  {
    key: 'secureScreenMode',
    label: 'Защищённый экран',
    description: 'Скрывать чувствительные данные до наведения или фокуса.',
  },
] as const;

const notificationSettings = [
  {
    key: 'securityAlerts',
    label: 'Оповещения безопасности',
    description: 'Сообщать о входах с новых устройств и подозрительных активностях.',
  },
  {
    key: 'passUpdates',
    label: 'Обновления пропуска',
    description: 'Уведомлять об изменении статуса пропуска и новых уровнях доступа.',
  },
  {
    key: 'sessionReminders',
    label: 'Напоминания о сессиях',
    description: 'Напоминать о долгих сессиях и необходимости обновить QR-пропуск.',
  },
] as const;

type ToggleKey = (typeof behaviorSettings)[number]['key'] | (typeof notificationSettings)[number]['key'];

interface ToggleRowProps {
  checked: boolean;
  description: string;
  label: string;
  onToggle: () => void;
}

function ToggleRow({ checked, description, label, onToggle }: ToggleRowProps) {
  const descriptionId = useId();

  return (
    <div className="settings-row">
      <div>
        <div className="text-sm font-semibold text-white">{label}</div>
        <p id={descriptionId} className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-describedby={descriptionId}
        className="settings-toggle focus-ring"
        data-state={checked ? 'checked' : 'unchecked'}
        onClick={onToggle}
      >
        <span className="settings-toggle__thumb" aria-hidden="true" />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const settings = useAppStore((state) => state.settings);
  const toggleSetting = useAppStore((state) => state.toggleSetting);
  const setThemeMode = useAppStore((state) => state.setThemeMode);

  return (
    <Card className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-cyan-300">Настройки</div>
          <h1 className="mt-2 text-3xl font-semibold text-white">Параметры кабинета сотрудника</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Управляйте темой интерфейса, режимом демонстрации, защитой чувствительных данных и уведомлениями MVP.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300"><ShieldCheck size={20} /></div>
      </div>

      <fieldset className="settings-fieldset">
        <legend className="settings-legend">Тема интерфейса</legend>
        <div className="grid gap-4 sm:grid-cols-3" role="radiogroup" aria-label="Выбор темы интерфейса">
          {themeOptions.map((item) => {
            const Icon = item.icon;
            const isActive = settings.themeMode === item.value;

            return (
              <button
                key={item.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={item.label}
                className="settings-option focus-ring"
                data-state={isActive ? 'checked' : 'unchecked'}
                onClick={() => setThemeMode(item.value)}
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <Icon size={16} /> {item.label}
                </span>
                <span className="mt-2 block text-sm leading-6 text-slate-400">{item.description}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="settings-fieldset">
        <legend className="settings-legend">Поведение интерфейса</legend>
        <div className="space-y-4">
          {behaviorSettings.map((item) => (
            <ToggleRow
              key={item.key}
              checked={settings[item.key]}
              label={item.label}
              description={item.description}
              onToggle={() => toggleSetting(item.key as ToggleKey)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="settings-fieldset">
        <legend className="settings-legend">Уведомления</legend>
        <div className="space-y-4">
          {notificationSettings.map((item) => (
            <ToggleRow
              key={item.key}
              checked={settings[item.key]}
              label={item.label}
              description={item.description}
              onToggle={() => toggleSetting(item.key as ToggleKey)}
            />
          ))}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
          <BellRing size={14} /> Настройки сохраняются автоматически в локальном профиле браузера.
        </div>
      </fieldset>
    </Card>
  );
}
