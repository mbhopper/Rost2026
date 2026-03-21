import type { RegisterPayload } from '../../app/store/types';
import type { DigitalPass } from '../../entities/pass/model';
import type { QrSession } from '../../entities/qr/model';
import type { UserProfile } from '../../entities/user/model';
import type {
  AdminDirectoryFilters,
  AdminEmployeeRecord,
  AdminOverview,
} from './admin/types';

export interface AuthSessionResult {
  token: string;
  user: UserProfile;
}

export interface LogoutResult {
  success: true;
}

export interface UserProfileResult {
  user: UserProfile;
}

export interface PassListResult {
  passes: DigitalPass[];
}

export interface QrSessionResult {
  session: QrSession;
}

export interface AuthService {
  login(email: string, password: string): Promise<AuthSessionResult>;
  register(payload: RegisterPayload): Promise<AuthSessionResult>;
  logout(): Promise<LogoutResult>;
}

export interface AdminAuthService {
  login(email: string, password: string): Promise<AuthSessionResult>;
}

export interface UserProfileService {
  getCurrentProfile(token: string): Promise<UserProfileResult>;
}

export interface PassService {
  getPasses(): Promise<PassListResult>;
}

export interface QrSessionService {
  generateQrSession(employeeId: string, passId: string): Promise<QrSessionResult>;
  expireQrSession(session: QrSession): Promise<QrSessionResult>;
  markQrAsScanned(session: QrSession): Promise<QrSessionResult>;
  revokeQrSession(session: QrSession): Promise<QrSessionResult>;
}

export interface AdminDirectoryService {
  getOverview(): Promise<AdminOverview>;
  getEmployees(filters?: AdminDirectoryFilters): Promise<AdminEmployeeRecord[]>;
  getEmployeeById(employeeId: string): Promise<AdminEmployeeRecord | null>;
}

export interface ApiServices {
  authService: AuthService;
  adminAuthService: AdminAuthService;
  userProfileService: UserProfileService;
  passService: PassService;
  qrSessionService: QrSessionService;
  adminDirectoryService: AdminDirectoryService;
}
