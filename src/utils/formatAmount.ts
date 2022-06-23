export const thinsp = '\u2009';
export const nbsp = '\u00a0';

export const formatAmount = (
    value: number | string,
    scale = 2,
    separator = ','
) => {
    const str = Number(value).toFixed(scale);
    const formatted =
        Number(value) < 10000 ? str : str.replace(/(\d)(?=(\d{3})+(\.|$))/g, `$1${nbsp}`)
    return formatted.replace(/.00$/, '').replace('.', separator)
};

export default formatAmount;
