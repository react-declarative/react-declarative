import flatArray from "./flatArray";

/**
 * Replaces substrings in a given string with specified replacements.
 *
 * @param str - The original string.
 * @param from - The substring(s) to be replaced. Can be an array or a single string.
 * @param to - The replacement(s) for the substrings. Can be an array or a single string.
 * @returns - The modified string with the replaced substrings.
 */
export const replaceSubstring = (str: string, from: string[] | string, to: string[] | string) => {
    let result = str;
    const fromChunks = flatArray([from]);
    const toChunks = flatArray([to]);
    if (fromChunks.length !== toChunks.length) {
        const [replaceTo = ""] = toChunks; 
        fromChunks.forEach((chunk) => result = result.split(chunk).join(replaceTo));
    } else {
        fromChunks.forEach((chunk, idx) => result = result.split(chunk).join(toChunks[idx]));
    }
    return result;
}

export default replaceSubstring;
