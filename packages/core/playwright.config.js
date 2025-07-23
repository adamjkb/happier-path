import { defineConfig } from '@playwright/test'

export default defineConfig({
	webServer: {
		command: 'pnpm run start:e2e',
		port: 4173,
	},
	testDir: './tests/e2e',
	outputDir: './.playwright'
})
