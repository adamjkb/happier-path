/**
 *
 * @param {{
 * name: string;
 * data: string;
 * locator: import("@playwright/test").Locator
 * }} args
 * @returns
 */
export const fillInputByName = async ({
	name,
	data,
	locator
}) => {
	return await locator.locator(`input[name="${name}"]`).fill(data)
}
