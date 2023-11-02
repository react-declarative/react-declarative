import flatArray from "./flatArray";

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
