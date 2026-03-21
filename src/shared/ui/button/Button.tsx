import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const buttonVariants = cva(
  'ui-button inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold focus-ring disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-primary text-white shadow-soft hover:opacity-95',
        secondary:
          'border border-white/10 bg-white/6 text-slate-100 hover:bg-white/10',
        ghost: 'bg-transparent text-cyan-300 hover:bg-cyan-400/10',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      fullWidth: false,
    },
  },
);

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(buttonVariants({ variant, fullWidth, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
