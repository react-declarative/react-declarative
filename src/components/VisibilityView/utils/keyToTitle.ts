/**
 * Converts a string containing words separated by underscores into a title case string
 * where each word starts with an uppercase letter.
 *
 * @param key - The string containing words separated by underscores.
 * @returns - The title case string.
 */
export const keyToTitle = (key: string) => {
    const [word, ...rest] = key.split('_');
    return [`${word.charAt(0).toUpperCase()}${word.slice(1)}`, ...rest].join(' ');
};

export default keyToTitle;
