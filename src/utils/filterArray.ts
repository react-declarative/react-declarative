export const filterString = (data: string, ...ignore: string[]) => {
    let items = data;
    for (const entry of ignore) {
        items = items.split(entry).join('');
    }
    return items;
};

export default filterString;
