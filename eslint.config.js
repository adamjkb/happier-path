import eslintPluginSvelte from 'eslint-plugin-svelte'
import globals from 'globals'
import js from '@eslint/js'
import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

/** @type {import('eslint').Linter.Config[]} */
export default [
	includeIgnoreFile(gitignorePath),
	// add more generic rule sets here, such as:
	js.configs.recommended,
	...eslintPluginSvelte.configs['flat/recommended'],
	{
		ignores: ['**/*.ts'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {

			// Generic Rules
			indent: ['error', 'tab'],
			quotes: ['error', 'single'],
			semi: ['warn', 'never'],
			'no-case-declarations': 0,
			'no-undef': 'error',
			'no-unused-vars': [
				'warn',
				{
					'vars': 'all',
					'args': 'after-used',
					'ignoreRestSiblings': true,
					'argsIgnorePattern': '^_',
					'destructuredArrayIgnorePattern': '^_'
				}
			],
			// Svelte Rules
			'svelte/button-has-type': [
				'error',
				{
					'button': true,
					'submit': true,
					'reset': true
				}
			],
			'svelte/html-quotes': [
				'warn',
				{
					'prefer': 'single',
					'dynamic': {
						'quoted': false,
						'avoidInvalidUnquotedInHTML': false
					}
				}
			],
			'svelte/indent': [
				'warn',
				{
					'indent': 'tab',
					'ignoredNodes': [],
					'switchCase': 0,
					'alignAttributesVertically': false
				}
			],
			'svelte/valid-compile': [
				'error',
				{
					'ignoreWarnings': true
				}
			],
			'svelte/max-attributes-per-line': 'warn',
			'svelte/sort-attributes': 'warn',
			'svelte/first-attribute-linebreak': 'warn',
			'svelte/html-closing-bracket-spacing': [
				'error',
				{
					'selfClosingTag': 'ignore'
				}
			],
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/no-spaces-around-equal-signs-in-attribute': 'warn',
			'svelte/shorthand-attribute': 'warn',
			'svelte/shorthand-directive': 'warn',
			'svelte/no-target-blank': 'warn',
			'svelte/no-at-html-tags': 'off',
			'svelte/no-trailing-spaces': 'warn'
		}
	}
]
