
interface IObject<T> {
    [x: string]: T;
}

export const createMap = <T>(obj: IObject<T>) => new Map<string, T>(Object.entries<T>(obj));

export default createMap;
