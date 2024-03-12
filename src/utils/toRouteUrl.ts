import { compile } from "path-to-regexp";

/**
 * Converts a template string and params object into a route URL.
 * @param {string} template - The template string representing the route URL.
 * @param {object} params - The parameters object to be filled into the template.
 * @returns {string} The generated route URL.
 */
export const toRouteUrl = (template: string, params: object) => {
    const toPath = compile(template, { encode: decodeURIComponent });
    return toPath(params);
};

export default toRouteUrl;
