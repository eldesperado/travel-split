/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.BASE_PATH ?? './',
  plugins: [react()],
  test: {
    environment: 'node',
    exclude: ['node_modules', 'dist', 'e2e'],
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      include: ['src/domain/**/*.ts', 'src/storage/**/*.ts', 'src/logging/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    },
  },
});
