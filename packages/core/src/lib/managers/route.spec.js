import { describe, expect, test, vi } from 'vitest'
import { routeManager } from './route'
import { ZodError } from 'zod/v4'

describe('`routeManager` schema validation', () => {
	test('no args', () => {
		// @ts-ignore
		expect(() => routeManager()).toThrow(ZodError)
	})
	test('null arg', () => {
		// @ts-ignore
		expect(() => routeManager(null)).toThrow(ZodError)
	})
	test('empty object', () => {
		// @ts-ignore
		expect(() => routeManager({})).toThrow(ZodError)
	})
	test('minimum required arg', () => {
		const mockManager = vi.fn(routeManager)
		const route = mockManager({ handler: () => {} })
		expect(route).toBeInstanceOf(Function)
		expect(mockManager).toHaveReturned()
	})
	// test('minimum required arg', () => {
	// 	const mockManager = vi.fn(routeManager)
	// 	const route = mockManager({
	// 		handler: () => {},
	// 		auth: {
	// 			mode: 'required',
	// 			strategies: ['a'],
	// 			scope: {}
	// 		}
	// 	 })
	// 	expect(route).toBeInstanceOf(Function)
	// 	expect(mockManager).toHaveReturned()
	// })
})
