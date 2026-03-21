import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'input-field w-full rounded-2xl px-4 py-3 text-sm transition',
        className,
      )}
      {...props}
    />
  );
}
