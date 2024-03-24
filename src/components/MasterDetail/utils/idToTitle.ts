/**
 * Converts a given name to a title format.
 *
 * @param name - The name to be converted to title.
 * @returns - The converted name in title format.
 */
export const nameToTitle = (name: string) => {
    if (name.includes(".")) {
        const tokens = name.split(".");
        [name] = tokens.reverse();
    }
    const [word, ...rest] = name.split('_');
    return [`${word.charAt(0).toUpperCase()}${word.slice(1)}`, ...rest].join(' ');
};

export default nameToTitle;
