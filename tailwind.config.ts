import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: 'rgba(15, 23, 42, 0.8)',
      },
      boxShadow: {
        soft: '0 24px 80px rgba(2, 6, 23, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
