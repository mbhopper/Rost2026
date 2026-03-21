declare module 'vitest' {
  type TestHandler = () => void | Promise<void>;

  interface Assertion<T = unknown> {
    not: Assertion<T>;
    toBe(expected: unknown): void;
    toBeGreaterThan(expected: number): void;
    toBeLessThanOrEqual(expected: number): void;
    toBeNull(): void;
    toContain(expected: string): void;
  }

  export function describe(name: string, handler: () => void): void;
  export function it(name: string, handler: TestHandler): void;
  export function expect<T = unknown>(value: T): Assertion<T>;
}
