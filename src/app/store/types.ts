import type { DigitalPass } from '../../entities/pass/model';
import type { QrSession } from '../../entities/qr/model';
import type { UserProfile } from '../../entities/user/model';

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

export type AuthStatus = 'guest' | 'authenticated' | 'loading';

export interface SettingsState {
  securityAlerts: boolean;
  weeklyDigest: boolean;
  priorityReminders: boolean;
}

export interface AuthSlice {
  authStatus: AuthStatus;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export interface PassSlice {
  passes: DigitalPass[];
  loadPasses: () => Promise<void>;
}

export interface QrSessionSlice {
  qrSession: QrSession | null;
  loadQrSession: () => Promise<void>;
  rotateQrSession: () => Promise<void>;
}

export interface SettingsSlice {
  settings: SettingsState;
  toggleSetting: (key: keyof SettingsState) => void;
}

export type AppStore = AuthSlice & PassSlice & QrSessionSlice & SettingsSlice;
