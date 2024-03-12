import { nbsp } from "./typo";

/**
 * Formats the given value to a specific scale and separates the thousands with a separator.
 *
 * @param {number | string} value - The value to be formatted.
 * @param {number} [scale=2] - The number of decimal places to round to.
 * @param {string} [separator=','] - The separator for thousands.
 * @returns {string} The formatted value.
 */
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
