import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type MouseEvent } from 'react';

export interface SecureViewInteractionProps {
  onContextMenu: (event: MouseEvent<HTMLElement>) => void;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onMouseDown: () => void;
  onTouchStart: () => void;
}

interface SecureViewOptions {
  enabled: boolean;
  inactivityTimeoutMs?: number;
}

export function useSecureView({
  enabled,
  inactivityTimeoutMs = 20_000,
}: SecureViewOptions) {
  const [isMasked, setIsMasked] = useState(enabled);
  const [lastInteractionAt, setLastInteractionAt] = useState(() => Date.now());
  const timeoutRef = useRef<number | null>(null);

  const mask = useCallback(() => {
    if (!enabled) {
      return;
    }

    setIsMasked(true);
  }, [enabled]);

  const reveal = useCallback(() => {
    setIsMasked(false);
    setLastInteractionAt(Date.now());
  }, []);

  const registerInteraction = useCallback(() => {
    setLastInteractionAt(Date.now());
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsMasked(false);
      return;
    }

    setIsMasked(true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMask = () => mask();
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || !document.hasFocus()) {
        mask();
      }
    };

    window.addEventListener('blur', handleMask);
    window.addEventListener('pagehide', handleMask);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleMask);
      window.removeEventListener('pagehide', handleMask);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, mask]);

  useEffect(() => {
    if (!enabled || isMasked) {
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsMasked(true);
    }, inactivityTimeoutMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, inactivityTimeoutMs, isMasked, lastInteractionAt]);

  const secureProps = useMemo<SecureViewInteractionProps>(
    () => ({
      onContextMenu: (event: MouseEvent<HTMLElement>) => event.preventDefault(),
      onDragStart: (event: DragEvent<HTMLElement>) => event.preventDefault(),
      onMouseDown: registerInteraction,
      onTouchStart: registerInteraction,
    }),
    [registerInteraction],
  );

  return {
    isMasked,
    mask,
    reveal,
    registerInteraction,
    secureProps,
  };
}
