/**
 * Retrieves the label associated with the given ID.
 *
 * @param id - The ID to retrieve the label for.
 * @returns - The label associated with the ID.
 */
export const idToLabel = (id: string) => {
    const [word, ...rest] = id.split('_');
    return [`${word.charAt(0).toUpperCase()}${word.slice(1)}`, ...rest].join(' ');
};

export default idToLabel;
