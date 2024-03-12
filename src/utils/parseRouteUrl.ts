import { match } from "path-to-regexp";

/**
 * Parses the given route template and URL to match them and returns the result.
 *
 * @param {string} template - The route template to match against.
 * @param {string} url - The URL to be matched.
 * @returns {string|null} - The matched result or null if no match is found.
 */
export const parseRouteUrl = (template: string, url: string) => {
    return match(template, { decode: decodeURIComponent })(url) || null;
};

export default parseRouteUrl;
