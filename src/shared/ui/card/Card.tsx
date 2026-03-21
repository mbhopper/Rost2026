import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <section className={cn('rounded-3xl border border-white/10 bg-panel p-6 shadow-soft backdrop-blur', className)} {...props}>
      {children}
    </section>
  );
}
