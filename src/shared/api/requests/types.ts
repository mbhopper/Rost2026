export type RegistrationRequestStatus = 'new' | 'approved';

export const registrationRequestStatusLabels: Record<RegistrationRequestStatus, string> = {
  new: 'Новая',
  approved: 'Оформлена',
};

export interface RegistrationRequestPayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  note?: string;
}

export interface RegistrationRequest extends RegistrationRequestPayload {
  id: string;
  submittedAt: string;
  status: RegistrationRequestStatus;
  processedAt?: string;
  employeeId?: string;
}

export interface ProcessRegistrationRequestPayload {
  requestId: string;
  employeeId: string;
}

export interface SupportRequestPayload {
  email: string;
  message: string;
  topic: string;
}

export interface SupportRequest extends SupportRequestPayload {
  id: string;
  submittedAt: string;
  status: 'new' | 'received';
}
