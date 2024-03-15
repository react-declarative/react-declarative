/**
 * Converts a given key to a header string.
 *
 * @param key - The key to be converted.
 * @returns The converted header string.
 */
export const fieldToHeader = (key: string) => {
    const [word, ...rest] = key.split('_');
    return [`${word.charAt(0).toUpperCase()}${word.slice(1)}`, ...rest].join(' ');
};

export default fieldToHeader;
