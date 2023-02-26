export const idToLabel = (id: string) => {
    const [word, ...rest] = id.split('_');
    return [`${word.charAt(0).toUpperCase()}${word.slice(1)}`, ...rest].join(' ');
};

export default idToLabel;
