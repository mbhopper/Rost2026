import type { ClassValue } from 'clsx';
export function cva(base?: ClassValue, config?: { variants?: Record<string, Record<string, ClassValue>>; defaultVariants?: Record<string, string | boolean> }): (props?: Record<string, string | boolean | undefined> & { className?: ClassValue }) => string;
