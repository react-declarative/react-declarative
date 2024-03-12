/**
 * Rounds a number and formats it as a string with a fixed number of decimal places.
 *
 * @param price - The number to be formatted.
 * @param [tickSize=8] - The number of decimal places to round to.
 * @return - The formatted number as a string.
 */
export const roundTicks = (price: number, tickSize = 8) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: tickSize,
        maximumFractionDigits: tickSize
    });
    return formatter.format(price);
};

export default roundTicks;
