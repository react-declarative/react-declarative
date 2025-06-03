/**
 * Represents a set of parameters for custom symbol validation and replacement.
 * @interface
 */
interface IParams {
    symbol?: string;
    allowed?: RegExp | ((char: string, idx: number) => boolean);
    replace?: (char: string) => string | null;
}

/**
 * Formats a raw string using a template and optional parameters.
 *
 * @param raw - The raw string to be formatted.
 * @param template - The template string used for formatting.
 * @param [params] - Optional parameters for customization.
 * @param [params.symbol='0'] - The symbol used in the template to indicate characters to be replaced.
 * @param [params.allowed] - A function or regular expression used to filter characters in the raw string.
 * @param [params.replace] - A function used to replace characters in the raw string.
 * @returns The formatted string.
 */
export const formatText = (raw: string, template: string, {
    symbol = '0',
    allowed,
    replace,
}: IParams = {}) => {
    if (!raw) {
        return raw;
    }
    if (replace) {
        const tempRaw = raw.split('');
        for (let i = 0; i !== raw.length; i++) {
            const pendingChar = replace(raw[i]) || null;
            if (pendingChar !== null) {
                tempRaw[i] = pendingChar;
            }
        }
        raw = tempRaw.join('');
    }
    if (allowed) {
        const pendingRemoveIdx = new Set<number>();
        if (typeof allowed === 'function') {
            for (let i = 0; i !== raw.length; i++) {
                const lastChar = raw[i];
                if (!allowed(lastChar, i)) {
                    pendingRemoveIdx.add(i);
                }
            }
        } else {
            for (let i = 0; i !== raw.length; i++) {
                const lastChar = raw[i];
                if (!lastChar.match(allowed)) {
                    pendingRemoveIdx.add(i);
                }
            }
        }
        raw = raw.split('').filter((_, idx) => !pendingRemoveIdx.has(idx)).join('');
    }
    if (!template) {
        return raw;
    }
    let idx = 0;
    let result = '';
    for (const char of template) {
        if (idx === raw.length) {
            break;
        } else if (char === symbol || char === raw[idx]) {
            result += raw[idx];
            idx++;
        } else {
            result += char;
        }
    }
    return result;
};

export default formatText;
