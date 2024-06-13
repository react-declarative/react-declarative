interface IArraySet<T = any> extends Array<T> {
    toArray: () => Array<T>;
}

export class ArraySet<T = any> extends Array<T> implements IArraySet<T> {

    readonly sourceHash: Set<T>;

    constructor(private readonly source: T[]) {
        super(...source);
        this.sourceHash = new Set(source);
    };

    includes = (searchElement: T) => {
        return this.sourceHash.has(searchElement);
    }

    toArray = () => this.source;

}

export default ArraySet;
