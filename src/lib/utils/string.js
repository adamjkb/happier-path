import dlv from "dlv";

/**
 * @template T
 * Delve inside a string template
 * 
 * Inspired by Hoeak.reachTemplate
 * @example 'user-{credentials.isAdmin}'
 * @param {string} template 
 * @param {Record<string, any>|Array<any>} obj
 * @param {T | string} [defaultValue='']
 * @returns {string | T}
 */
export function delveTemplate(template, obj, defaultValue = '') {
    return template.replace(/{([^{}]+)}/g, (_, path) =>  dlv(obj, path, defaultValue));
}