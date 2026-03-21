export const USER_STATUSES = {
  ACTIVE: 'active',
  ON_LEAVE: 'on_leave',
  SUSPENDED: 'suspended',
  TERMINATED: 'terminated',
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

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
}

export type UserProfile = User;
