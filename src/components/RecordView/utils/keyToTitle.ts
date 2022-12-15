export const keyToTitle = (key: string) => {
    let k = key;
    if (k === 'email') {
        k = 'Current email';
    }
    const [word, ...rest] = k.split('_');
    return [`${word.charAt(0).toUpperCase()}${word.slice(1)}`, ...rest].join(' ');
};

export default keyToTitle;
