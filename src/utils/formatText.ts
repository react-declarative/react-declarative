export const formatText = (raw: string, template: string, symbol = '0') => {
    if (!template || !raw) {
        return raw;
    }
    let idx = 0;
    let result = '';
    for (const char of template) {
        if (char === symbol) {
            result += raw[idx];
            idx++;
        } else if (char === raw[idx]) {
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
