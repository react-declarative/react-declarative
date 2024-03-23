/**
 * Converts a snake-case key to a title-case string.
 *
 * @param key - The key to be converted.
 * @return - The title-case string.
 */
export const keyToTitle = (key: string) => {
    const [word, ...rest] = key.split('_');
    return [`${word.charAt(0).toUpperCase()}${word.slice(1)}`, ...rest].join(' ');
};

export default keyToTitle;
