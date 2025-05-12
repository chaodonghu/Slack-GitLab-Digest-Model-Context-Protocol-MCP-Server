import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react',
  })],
  test: {
    include: ['**/*.test.tsx'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['@testing-library/jest-dom/vitest'],
    coverage: {
      reporter: ['html', 'text', 'lcov'],
    },
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './junit.xml',
    },
    retry: process.env.CI ? 2 : 0,

    server: {
      deps: {
        inline: [
          "@zapier/design-system"
        ]
      }
    }
  },
});
