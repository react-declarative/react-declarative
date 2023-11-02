export const flatArray = <T = any>(...arr: any[]): T[] => {
    return arr.flat(Infinity);
}

export default flatArray;
