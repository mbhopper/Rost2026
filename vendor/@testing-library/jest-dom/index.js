const installMatchers = () => {
  if (typeof globalThis.expect?.extend !== 'function') {
    return;
  }

  globalThis.expect.extend({
    toBeInTheDocument(received) {
      const pass = received != null && received.ownerDocument?.contains(received);
      return {
        pass,
        message: () =>
          pass
            ? 'Expected element not to be present in the document.'
            : 'Expected element to be present in the document.',
      };
    },
    toHaveTextContent(received, expected) {
      const actual = received?.textContent ?? '';
      const pass =
        expected instanceof RegExp ? expected.test(actual) : actual.includes(String(expected));
      return {
        pass,
        message: () =>
          pass
            ? `Expected element text not to match ${String(expected)}.`
            : `Expected element text to match ${String(expected)}, received ${actual}.`,
      };
    },
    toHaveAttribute(received, name, expected) {
      const actual = received?.getAttribute?.(name);
      const pass = expected === undefined ? actual != null : actual === String(expected);
      return {
        pass,
        message: () =>
          pass
            ? `Expected element not to have attribute ${name}.`
            : `Expected element to have attribute ${name}${expected === undefined ? '' : `=${String(expected)}`}.`,
      };
    },
    toBeDisabled(received) {
      const pass = Boolean(received?.disabled || received?.getAttribute?.('aria-disabled') === 'true');
      return {
        pass,
        message: () =>
          pass
            ? 'Expected element not to be disabled.'
            : 'Expected element to be disabled.',
      };
    },
  });
};

installMatchers();

export {};
