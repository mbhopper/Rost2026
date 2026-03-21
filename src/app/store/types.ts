import type { DigitalPass } from '../../entities/pass/model';
import type { QrSession } from '../../entities/qr/model';
import type { UserProfile, UserRole } from '../../entities/user/model';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  password: string;
  confirmPassword: string;
}

export type AuthStatus =
  | 'guest'
  | 'authenticated'
  | 'loading'
  | 'invalid_credentials'
  | 'session_expired'
  | 'service_unavailable'
  | 'offline'
  | 'unknown_error';

export type ThemeMode = 'system' | 'dark' | 'light';

export interface NotificationSettings {
  securityEvents: boolean;
  passUpdates: boolean;
  sessionAlerts: boolean;
}

export interface SettingsState {
  themeMode: ThemeMode;
  demoMode: boolean;
  secureScreenMode: boolean;
}

export interface AuthSlice {
  authStatus: AuthStatus;
  authMessage: string | null;
  isAuthBootstrapped: boolean;
  user: UserProfile | null;
  currentRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  bootstrapAuth: () => Promise<void>;
  clearAuthFeedback: () => void;
  logout: () => Promise<void>;
}

export interface PassSlice {
  passes: DigitalPass[];
  loadPasses: () => Promise<void>;
}

export interface GenerateQrSessionPayload {
  employeeId: string;
  passId: string;
}

export interface QrSessionSlice {
  qrSession: QrSession | null;
  loadQrSession: () => Promise<void>;
  generateQrSession: (payload: GenerateQrSessionPayload) => Promise<void>;
  rotateQrSession: (payload: GenerateQrSessionPayload) => Promise<void>;
  expireQrSession: () => Promise<void>;
  markQrAsScanned: () => Promise<void>;
  revokeQrSession: () => Promise<void>;
}

export interface SettingsSlice {
  settings: SettingsState;
  toggleSetting: (key: keyof Pick<SettingsState, 'demoMode' | 'secureScreenMode'>) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export type AppStore = AuthSlice & PassSlice & QrSessionSlice & SettingsSlice;
