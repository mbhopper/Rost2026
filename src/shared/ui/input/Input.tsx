import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:bg-slate-950/70',
        className,
      )}
      {...props}
    />
  );
}
