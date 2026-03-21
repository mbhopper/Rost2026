import { useSyncExternalStore } from 'react';

export function create(initializer) {
  const listeners = new Set();
  let state;

  const getState = () => state;
  const setState = (partial, replace = false) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    state = replace ? nextState : { ...state, ...nextState };
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const api = { getState, setState, subscribe };
  state = initializer(setState, getState, api);

  function useStore(selector = (value) => value) {
    return useSyncExternalStore(subscribe, () => selector(getState()), () => selector(getState()));
  }

  useStore.getState = getState;
  useStore.setState = setState;
  useStore.subscribe = subscribe;

  return useStore;
}
