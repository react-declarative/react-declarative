/**
 * Removes specified strings from a given data string.
 *
 * @param {string} data - The target data string to filter.
 * @param {...string} ignore - The strings to be removed from the data string.
 * @returns {string} - The filtered data string with specified strings removed.
 */
export const filterString = (data: string, ...ignore: string[]) => {
    let items = data;
    for (const entry of ignore) {
        items = items.split(entry).join('');
    }
    return items;
};

export default filterString;
