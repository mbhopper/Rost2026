declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      toBeInTheDocument(): void;
      toBeDisabled(): void;
      toHaveAttribute(name: string, value?: string): void;
      toHaveTextContent(value: string | RegExp): void;
    }

    interface Assertion<T = unknown> {
      toBeInTheDocument(): void;
      toBeDisabled(): void;
      toHaveAttribute(name: string, value?: string): void;
      toHaveTextContent(value: string | RegExp): void;
    }
  }
}

export {};
