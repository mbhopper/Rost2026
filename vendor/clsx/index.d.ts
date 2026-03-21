export type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, boolean | null | undefined>;
export function clsx(...inputs: ClassValue[]): string;
export default clsx;
