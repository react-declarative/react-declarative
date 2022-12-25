interface IParams {
    symbol?: string;
    allowed?: RegExp | ((char: string, idx: number) => boolean);
    replace?: (char: string) => string | null;
}

export const formatText = (raw: string, template: string, {
    symbol = '0',
    allowed,
    replace,
}: IParams = {}) => {
    if (!template || !raw) {
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
