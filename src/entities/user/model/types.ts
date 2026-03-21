export const USER_STATUSES = {
  ACTIVE: 'active',
  ON_LEAVE: 'on_leave',
  SUSPENDED: 'suspended',
  TERMINATED: 'terminated',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employeeId: string;
  avatarUrl: string;
  status: UserStatus;
  role: UserRole;
}

export type UserProfile = User;
