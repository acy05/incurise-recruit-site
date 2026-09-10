import { defineConfig } from '@playwright/test';
import base from './playwright.config';

const { channel: _channel, ...sharedUse } = base.use!;

export default defineConfig({
  ...base,
  use: sharedUse,
  testMatch: 'typography.cross-browser.spec.ts',
  timeout: 90_000,
  projects: [
    { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome' } },
    { name: 'webkit', use: { browserName: 'webkit', channel: undefined } },
  ],
});
