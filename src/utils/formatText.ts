interface IParams {
    symbol?: string;
    allowed?: RegExp
}

export const formatText = (raw: string, template: string, {
    symbol = '0',
    allowed,
}: IParams = {}) => {
    if (!template || !raw) {
        return raw;
    }
    if (allowed) {
        const lastChar = raw.slice(raw.length - 1, raw.length);
        if (!lastChar.match(allowed)) {
            return raw.slice(0, raw.length - 1);
        }
    }
    let idx = 0;
    let result = '';
    for (const char of template) {
        if (char === symbol || char === raw[idx]) {
            result += raw[idx];
            idx++;
        } else {
            result += char;
        }
        if (idx === raw.length) {
            break;
        }
    }
    return result;
};

export default formatText
