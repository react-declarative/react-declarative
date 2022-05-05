export const roundTicks = (price: number, tickSize = 8) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: tickSize,
        maximumFractionDigits: tickSize
    });
    return formatter.format(price);
};

export default roundTicks;
