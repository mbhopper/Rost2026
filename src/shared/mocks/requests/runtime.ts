import {
  readLocalStorage,
  storageKeys,
  writeLocalStorage,
} from '../../config/storage';
import type {
  RegistrationRequest,
  RegistrationRequestPayload,
  SupportRequest,
  SupportRequestPayload,
} from '../../api/requests/types';

interface RequestStoreState {
  registrationRequests: RegistrationRequest[];
  supportRequests: SupportRequest[];
}

const initialState: RequestStoreState = {
  registrationRequests: [
    {
      id: 'reg-request-1001',
      firstName: 'Никита',
      lastName: 'Ершов',
      middleName: 'Андреевич',
      email: 'nikita.ershov@futurepass.app',
      phone: '+7 (999) 101-10-01',
      department: 'Цифровые сервисы',
      position: 'Product analyst',
      note: 'Нужен доступ в Башню A и к переговорным на 14 этаже.',
      submittedAt: '2026-03-20T12:00:00.000Z',
      status: 'new',
    },
    {
      id: 'reg-request-1002',
      firstName: 'Елизавета',
      lastName: 'Сафонова',
      middleName: '',
      email: 'elizaveta.safonova@futurepass.app',
      phone: '+7 (999) 101-10-02',
      department: 'Служба поддержки',
      position: 'Support specialist',
      note: 'Старт с понедельника, нужен пропуск на B2.',
      submittedAt: '2026-03-21T08:15:00.000Z',
      status: 'new',
    },
  ],
  supportRequests: [],
};

let state: RequestStoreState | null = null;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const loadState = (): RequestStoreState => {
  if (state) {
    return state;
  }

  const raw = readLocalStorage(storageKeys.requestStore);

  if (raw) {
    try {
      state = JSON.parse(raw) as RequestStoreState;
      return state;
    } catch {
      // fall through to seed state
    }
  }

  state = clone(initialState);
  return state;
};

const persistState = () => {
  if (!state) {
    return;
  }

  writeLocalStorage(storageKeys.requestStore, JSON.stringify(state));
};

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const requestRuntimeStore = {
  getRegistrationRequests() {
    return [...loadState().registrationRequests].sort((left, right) =>
      right.submittedAt.localeCompare(left.submittedAt),
    );
  },
  submitRegistrationRequest(payload: RegistrationRequestPayload) {
    const item: RegistrationRequest = {
      ...payload,
      note: payload.note?.trim() ?? '',
      id: createId('reg-request'),
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    loadState().registrationRequests.unshift(item);
    persistState();
    return item;
  },
  approveRegistrationRequest(requestId: string, employeeId: string) {
    const target = loadState().registrationRequests.find((item) => item.id === requestId);

    if (!target) {
      return null;
    }

    target.status = 'approved';
    target.processedAt = new Date().toISOString();
    target.employeeId = employeeId;
    persistState();
    return target;
  },
  getSupportRequests() {
    return [...loadState().supportRequests].sort((left, right) =>
      right.submittedAt.localeCompare(left.submittedAt),
    );
  },
  submitSupportRequest(payload: SupportRequestPayload) {
    const item: SupportRequest = {
      ...payload,
      id: createId('support-request'),
      submittedAt: new Date().toISOString(),
      status: 'received',
    };

    loadState().supportRequests.unshift(item);
    persistState();
    return item;
  },
};
