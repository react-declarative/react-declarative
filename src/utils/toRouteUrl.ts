import { compile } from "path-to-regexp";

export const toRouteUrl = (template: string, params: object) => {
    const toPath = compile(template, { encode: decodeURIComponent });
    return toPath(params);
};

export default toRouteUrl;
