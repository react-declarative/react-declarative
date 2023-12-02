import { match } from "path-to-regexp";

export const parseRouteUrl = (template: string, url: string) => {
    return match(template, { decode: decodeURIComponent })(url) || null;
};

export default parseRouteUrl;
