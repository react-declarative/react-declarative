/**
 * Converts a string in snake case to title case.
 *
 * @param key - The string to be converted.
 * @returns - The converted string.
 */
export const keyToTitle = (key: string) => {
    const [word, ...rest] = key.split('_');
    return [`${word.charAt(0).toUpperCase()}${word.slice(1)}`, ...rest].join(' ');
};

export default keyToTitle;
