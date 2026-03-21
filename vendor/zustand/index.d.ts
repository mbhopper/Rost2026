export type StateCreator<T> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void,
  get: () => T,
  store: { getState: () => T; setState: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void; subscribe: (listener: () => void) => () => void }
) => T;

export interface UseBoundStore<T> {
  <U = T>(selector?: (state: T) => U): U;
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;
  subscribe: (listener: () => void) => () => void;
}

export function create<T>(initializer: StateCreator<T>): UseBoundStore<T>;
