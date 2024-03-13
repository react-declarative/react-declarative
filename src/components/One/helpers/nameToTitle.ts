/**
 * Convert a name to title case.
 *
 * @param name - The name to convert to title case.
 * @return The name converted to title case.
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
