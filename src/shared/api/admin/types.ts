import type { DigitalPass } from '../../../entities/pass/model';
import type { UserProfile } from '../../../entities/user/model';

export type AdminPassStatusFilter = DigitalPass['status'] | 'all';

export interface AdminDirectoryFilters {
  query?: string;
  status?: AdminPassStatusFilter;
}

export interface AdminEmployeeRecord {
  user: UserProfile;
  passes: DigitalPass[];
  lastEntryAt: string;
  location: string;
}

export interface AdminOverview {
  activeEmployees: number;
  activePasses: number;
  blockedPasses: number;
  expiringToday: number;
  recentAlerts: Array<{
    id: string;
    title: string;
    detail: string;
    tone: 'info' | 'warning' | 'danger';
  }>;
}
