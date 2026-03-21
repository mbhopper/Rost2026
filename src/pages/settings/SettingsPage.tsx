import { BellRing, Clock3, QrCode, Settings, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../app/store';
import type { ThemeMode } from '../../app/store';
import { cn } from '../../shared/lib/cn';
import { Card } from '../../shared/ui/card/Card';

const themeOptions: Array<{ value: ThemeMode; label: string; description: string; icon: typeof Settings }> = [
  {
    value: 'system',
    label: 'Системная',
    description: 'Следовать настройкам устройства.',
    icon: QrCode,
  },
  {
    value: 'dark',
    label: 'Тёмная',
    description: 'Основной корпоративный режим для MVP.',
    icon: ShieldCheck,
  },
  {
    value: 'light',
    label: 'Светлая',
    description: 'Удобна для демо и печати статичных экранов.',
    icon: Clock3,
  },
];

function ToggleCard({ checked, description, label, onChange }: { checked: boolean; description: string; label: string; onChange: () => void }) {
  return (
    <div className="settings-toggle-card">
      <div>
        <h3>{label}</h3>
        <p>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={cn('settings-switch', checked && 'settings-switch--checked')}
        onClick={onChange}
      >
        <span className={cn('settings-switch__thumb', checked && 'settings-switch__thumb--checked')} />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const settings = useAppStore((state) => state.settings);
  const toggleSetting = useAppStore((state) => state.toggleSetting);
  const setThemeMode = useAppStore((state) => state.setThemeMode);

  return (
    <div className="page-stack">
      <Card className="hero-card hero-card--user">
        <div className="hero-card__badge"><Settings size={14} /> Preferences</div>
        <div className="hero-card__content">
          <div>
            <h1>Настройки интерфейса и secure mode</h1>
            <p>Параметры сохраняются локально. Здесь же настраивается best-effort защита чувствительных экранов.</p>
          </div>
        </div>
      </Card>

      <Card className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Theme</p>
            <h2>Тема интерфейса</h2>
          </div>
        </div>
        <div className="theme-grid">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = settings.themeMode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={cn('theme-option', isActive && 'theme-option--active')}
                onClick={() => setThemeMode(option.value)}
              >
                <Icon size={18} />
                <div>
                  <strong>{option.label}</strong>
                  <p>{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Privacy</p>
            <h2>Best-effort web protection</h2>
          </div>
        </div>
        <div className="page-stack">
          <ToggleCard
            checked={settings.secureScreenMode}
            label="Secure mode"
            description="Автоматически скрывает QR при blur/visibility change и после периода бездействия. Это не абсолютная защита от скриншотов."
            onChange={() => toggleSetting('secureScreenMode')}
          />
          <ToggleCard
            checked={settings.demoMode}
            label="Demo labels"
            description="Оставляет подсказки mock/MVP в интерфейсе, чтобы обозначить frontend-only режим." 
            onChange={() => toggleSetting('demoMode')}
          />
          <div className="info-banner"><BellRing size={16} /> При печати QR и конфиденциальные блоки скрываются через print styles.</div>
        </div>
      </Card>
    </div>
  );
}
