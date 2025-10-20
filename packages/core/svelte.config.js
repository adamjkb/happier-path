import adapter from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		experimental: {
			remoteFunctions: true
		},
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			out: '.build'
		}),
		alias: {
			'$dev': './src/dev/'
		},
		// DO NOT COPY ;)
		csrf: {
			trustedOrigins: ['*']
		}
	}
}

export default config
