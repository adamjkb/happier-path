// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AuthenticationManager } from "$lib/managers/auth";
import type { AuthMode, BaseFailedAuth, BaseSuccesfullAuth } from "./types/auth";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/**
			 * Happier internal managers and configuration objects
			 *
			 */
			happier?: {
				authManager?: AuthenticationManager
			};
			/**
			 * Auth outcome
			 */
			auth?: BaseSuccesfullAuth | BaseFailedAuth

		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
