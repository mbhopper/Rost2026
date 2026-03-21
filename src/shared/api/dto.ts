import type { RegisterPayload } from '../../app/store/types';
import type { DigitalPass, PassStatus } from '../../entities/pass/model';
import type { QrSession, QrStatus } from '../../entities/qr/model';
import type { UserProfile, UserRole, UserStatus } from '../../entities/user/model';

export interface UserDto {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  avatar_url: string;
  status: UserStatus;
  role: UserRole;
}

export interface PassDto {
  pass_id: string;
  employee_id: string;
  issued_at: string;
  expires_at: string;
  access_level: string;
  status: PassStatus;
  facility_name: string;
  is_blocked: boolean;
}

export interface QrSessionDto {
  session_id: string;
  employee_id: string;
  pass_id: string;
  qr_value: string;
  created_at: string;
  expires_at: string;
  ttl_seconds: number;
  status: QrStatus;
  scanned_at: string | null;
  revoked_at: string | null;
}

const createFullName = (lastName: string, firstName: string, middleName: string) =>
  [lastName, firstName, middleName].filter(Boolean).join(' ');

export const mapUserDtoToModel = (dto: UserDto): UserProfile => ({
  id: dto.id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  middleName: dto.middle_name,
  fullName: createFullName(dto.last_name, dto.first_name, dto.middle_name),
  email: dto.email,
  phone: dto.phone,
  department: dto.department,
  position: dto.position,
  employeeId: dto.employee_id,
  avatarUrl: dto.avatar_url,
  status: dto.status,
  role: dto.role,
});

export const mapPassDtoToModel = (dto: PassDto): DigitalPass => ({
  passId: dto.pass_id,
  employeeId: dto.employee_id,
  issuedAt: dto.issued_at,
  expiresAt: dto.expires_at,
  accessLevel: dto.access_level,
  status: dto.status,
  facilityName: dto.facility_name,
  isBlocked: dto.is_blocked,
});

export const mapQrSessionDtoToModel = (dto: QrSessionDto): QrSession => ({
  sessionId: dto.session_id,
  employeeId: dto.employee_id,
  passId: dto.pass_id,
  qrValue: dto.qr_value,
  createdAt: dto.created_at,
  expiresAt: dto.expires_at,
  ttlSeconds: dto.ttl_seconds,
  status: dto.status,
  scannedAt: dto.scanned_at,
  revokedAt: dto.revoked_at,
});

export const mapRegisterPayloadToUserDto = (
  payload: RegisterPayload,
  template: UserDto,
): UserDto => ({
  ...template,
  id: `user-${payload.email.split('@')[0].toLowerCase()}`,
  employee_id: `EMP-${Math.random().toString().slice(2, 8)}`,
  first_name: payload.firstName,
  last_name: payload.lastName,
  middle_name: payload.middleName ?? '',
  email: payload.email,
  phone: payload.phone,
  department: payload.department,
  position: payload.position,
  role: template.role,
  avatar_url: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(`${payload.firstName} ${payload.lastName}`.trim())}`,
});

export const mapEmailToUserDto = (email: string, template: UserDto): UserDto => {
  const [localPart] = email.split('@');
  const [firstName = template.first_name, lastName = template.last_name] = localPart
    .split(/[._-]/)
    .map((chunk) =>
      chunk ? chunk.charAt(0).toUpperCase() + chunk.slice(1) : chunk,
    );

  return {
    ...template,
    id: `user-${localPart.toLowerCase()}`,
    first_name: firstName,
    last_name: lastName,
    middle_name: template.middle_name,
    email,
    avatar_url: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(`${firstName} ${lastName}`.trim())}`,
  };
};
